const { bootstrap } = require("./bootstrap.js");
bootstrap().then( async (load) => {
    let { request, component, complete } = await load({ moduleName: "component.request.handler.route" });
    const newRequest = { port: 3000, path: "/requesthandlerroutetest", method: "GET", headers: {},  data: "" };
    component.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
        return {
            statusCode: 200,
            statusMessage: "Routing Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Routing Test Successful"){
        console.log(`Routing Test Failed: ${results.data}`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});