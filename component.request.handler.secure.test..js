const { bootstrap } = require("./bootstrap.js");
bootstrap().then( async (load) => {
    let { request, component, complete } = await load({ moduleName: "component.request.handler.secure" });
    const newRequest = { port: 3000, path: "/requesthandlersecuretest", method: "GET", headers: {},  data: "" };
    component.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
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
    }
    complete();
}).catch((err)=>{
    console.log(err);
});