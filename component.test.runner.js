const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
module.exports = {
    runTest: ( { componentName, requestPath, username, passphrase, inputData = "", isNewRouteroute = false, statusCode = 200, statusMessage = "Success" }) => {
        return new Promise(async (resolve, reject) => {
            const { test, complete } = await bootstrap(componentName);
            test.subscribe(null, async() => {
                return {
                    success: true,
                    reasons: [],
                    message: {
                        headers: {},
                        statusCode: 200,
                        statusMessage: "Success"
                    }
                };
            });
            const results = await test.publish({ text:"test", headers: {} });
            if (results.success){
                await resolve( utils.getJSONString(results));
            } else {
                await reject( utils.getJSONString(results));
            }
            complete();
        });
    }
}

