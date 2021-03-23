require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.deferred" });
    await context.run( async({ request, component }) => {
        let { requestHandlerDeferredProxy } = await component.register({});
        requestHandlerDeferredProxy.subscribe({ name: "3000/test1" }, () => {
            return {
                statusCode: 200,
                statusMessage: "Deferred Test Successful",
                headers: {}
            };
        });
        let results = await request.send({ 
            host: "localhost",
            port: 3000,
            path: "/test1",
            method: "GET",
            headers: {}, 
            data: "",
            retryCount: 1
        });
        if (results.statusCode !== 200 || results.statusMessage !== "Deferred Test Successful"){
            throw "Deferred Test Failed.";
        }
    });
}).catch((err)=>{
    console.log(err);
});