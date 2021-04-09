const { bootstrap } = require("./bootstrap.js");
bootstrap("component.request.handler.secure").then( async ({ request, component, complete }) => {
    const newRequest = { port: 3000, path: "/requesthandlersecuretest", method: "GET", headers: {},  data: "" };
    component.subscribe({ channel: component.config.channel }, () => {
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
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Secure Test Successful"){
        console.log(`Secure Test Failed: ${results.data}`);
    } else {
        console.log(`Secure Test Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});