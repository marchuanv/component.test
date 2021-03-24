require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.route" });
    await context.run( async({  request, requestHandlerRouteProxy }) => {
        const newRequest = { port: 3000, path: "/requesthandlerroutetest", method: "GET", headers: {},  data: "" };
        requestHandlerRouteProxy.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
            return {
                statusCode: 200,
                statusMessage: "Routing Test Successful",
                headers: {}
            };
        });
        let results = await request.send(newRequest);
        if (results.statusCode !== 200 || results.statusMessage !== "Routing Test Successful"){
            throw `Routing Test Failed: ${results.data}`;
        }
    });
}).catch((err)=>{
    console.log(err);
});