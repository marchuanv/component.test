const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
module.exports = {
    runTest: ( { componentName, requestPath, username, passphrase, inputData = "", isNewRouteroute = false, statusCode = 200, statusMessage = "Success" }) => {
        return new Promise(async (resolve, reject) => {
            const { request, component, complete } = await bootstrap(componentName);
            let newRequest = {
                port: 3000,
                path: requestPath,
                method: "GET",
                headers: {},
                data: inputData
            };
            if (username){
                newRequest.headers.username = username;
                newRequest.headers.fromport = 4000;
                newRequest.headers.fromhost = "localhost";
            }
            if (isNewRouteroute) {
                newRequest.path = "/routes/register";
                if (passphrase) {
                    const { hashedPassphrase, hashedPassphraseSalt } = utils.hashPassphrase(passphrase);
                    newRequest.data = utils.getJSONString({ path: requestPath, hashedPassphrase, hashedPassphraseSalt });
                } else {
                    newRequest.data = utils.getJSONString({ path: requestPath });
                }
                const results = await request.send(newRequest);
                if (results.statusCode !== 200){
                    reject(results);
                    return complete();
                }
                newRequest.path = requestPath;
                newRequest.data = inputData;
            }
            if (passphrase) {
                newRequest.headers.passphrase = passphrase;
            }
            component.subscribe(null, async() => {
                return {
                    success: true,
                    reasons: [],
                    message: "Success"
                };
            });
            const results = await request.send(newRequest);
            if (results.statusCode === statusCode && results.statusMessage === statusMessage){
                await resolve( utils.getJSONString(results));
            } else {
                await reject( utils.getJSONString(results));
            }
            complete();
        });
    }
}

