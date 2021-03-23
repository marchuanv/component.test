require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.route" });
    await context.run( async({ request, component }) => {
        let { requestHandlerRouteProxy } = await component.register({ });
        requestHandlerRouteProxy.subscribe({ name: "3000/test2" }, () => {
            return {
                statusCode: 200,
                statusMessage: "Routing Test Successful",
                headers: {}
            };
        });
        let results = await request.send({ 
            path: "/test2",
            method: "GET",
            headers: {}, 
            data: ""
        });
        if (results.statusCode !== 200 || results.statusMessage !== "Routing Test Successful"){
            throw "Routing Test Failed.";
        }
    });
}).catch((err)=>{
    console.log(err);
});