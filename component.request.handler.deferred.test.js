require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.deferred" });
    await context.run( async({ request, component }) => {
        let { requestHandlerDeferredProxy } = await component.register({});
        const newRequest = { port: 3000, path: "/requesthandlerdeferredtest", method: "GET", headers: {},  data: "" };
        requestHandlerDeferredProxy.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
            return {
                statusCode: 200,
                statusMessage: "Deferred Test Successful",
                headers: {}
            };
        });
        let results = await request.send(newRequest);
        if (results.statusCode !== 200 || results.statusMessage !== "Deferred Test Successful"){
            throw `Deferred Test Failed: ${results.data}`;
        }
    });
}).catch((err)=>{
    console.log(err);
});