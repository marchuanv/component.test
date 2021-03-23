require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler" });
    await context.run( async({ request, component }) => {
        let { requestHandlerProxy } = await component.register({ });
        requestHandlerProxy.subscribe({ name: "3000/test1" }, () => {
            return {
                statusCode: 200,
                statusMessage: "Request Test Successful",
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
        if (results.statusCode !== 200 || results.statusMessage !== "Request Test Successful"){
            throw "Request Test Failed.";
        }
    });
}).catch((err)=>{
    console.log(err);
});