require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler" });
    await context.run( async({ request, requestHandlerProxy }) => {
        const newRequest = { port: 3000, path: "/requesthandlertest", method: "GET", headers: {},  data: "" };
        requestHandlerProxy.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
            return {
                statusCode: 200,
                statusMessage: "Request Test Successful",
                headers: {}
            };
        });
        let results = await request.send({ 
            path: "/requesthandlertest",
            method: "GET",
            headers: {}, 
            data: ""
        });
        if (results.statusCode !== 200 || results.statusMessage !== "Request Test Successful"){
            throw `Request Test Failed: ${results.data}`;
        }
    });
}).catch((err)=>{
    console.log(err);
});