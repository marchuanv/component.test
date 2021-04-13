const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
bootstrap("component.request.handler.secure").then( async ({ request, component, complete }) => {
    
    const { hashedPassphrase, hashedPassphraseSalt } = utils.hashPassphrase("secret1");
    const registerRouteRequest = { 
        port: 3000, path: "/routes/register", method: "GET",
        headers: { username: "joe", fromport: 4000, fromhost: "localhost" },  
        data: utils.getJSONString({ path: "/requesthandlersecuretest", hashedPassphrase, hashedPassphraseSalt })
    };
    let results = await request.send(registerRouteRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "/requesthandlersecuretest registered"){
        console.log(`Registering Routing Test Failed: ${results.data}`);
    } else {
        console.log(`Registering Routing Test Passed`);
    }

    const newRequest = { port: 3000, path: "/requesthandlersecuretest", method: "GET", headers: {},  data: "" };
    component.subscribe(() => {
        return {
            statusCode: 200,
            statusMessage: "Secure Test Successful",
            headers: {}
        };
    });
    newRequest.headers = {
        username: "joe",
        fromport: 4000,
        fromhost: "localhost"
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 401 || results.statusMessage !== "Unauthorised"){
        console.log(`Secure Test1 Failed: ${results.data}`);
    } else {
        console.log(`Secure Test1 Passed`);
    }
    newRequest.headers = {
        username: "joe",
        passphrase: "secret2", //wrong password
        fromport: 4000,
        fromhost: "localhost"
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 401 || results.statusMessage !== "Unauthorised"){
        console.log(`Secure Test1 Failed: ${results.data}`);
    } else {
        console.log(`Secure Test1 Passed`);
    }

    newRequest.headers = {
        username: "joe",
        passphrase: "secret1",
        fromport: 4000,
        fromhost: "localhost"
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Secure Test Successful"){
        console.log(`Secure Test2 Failed: ${results.data}`);
    } else {
        console.log(`Secure Test2 Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});