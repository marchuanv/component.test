const { bootstrap } = require("./bootstrap.js");
bootstrap().then( async (load) => {
    let { request, component, complete } = await load({ moduleName: "component.request.handler" });
    const newRequest = { port: 3000, path: "/requesthandlertest", method: "GET", headers: {},  data: "" };
    component.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
        return {
            statusCode: 200,
            statusMessage: "Request Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Request Test Successful"){
        console.log(`Request Test Failed: ${results.data}`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});