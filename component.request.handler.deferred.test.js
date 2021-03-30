const { bootstrap } = require("./bootstrap.js");
bootstrap().then( async (load) => {
    let { request, component, complete } = await load({ moduleName: "component.request.handler.deferred" });
    const newRequest = { port: 3000, path: "/requesthandlerdeferredtest", method: "GET", headers: {},  data: "" };
    component.subscribe({ channel: component.channel }, () => {
        return {
            statusCode: 200,
            statusMessage: "Deffered Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Deffered Test Successful"){
        console.log(`Deffered Test Failed: ${results.data}`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});