require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.user" });
    await context.run( async({ request, component }) => {
        let { requestHandlerUserProxy } = await component.register({});
        requestHandlerUserProxy.subscribe({ name: "3000/test2" }, () => {
            return {
                statusCode: 200,
                statusMessage: "User Test Successful",
                headers: {}
            };
        });
        let results = await request.send({ 
            path: "/test2",
            method: "GET",
            headers: {
                username: "joe",
                fromport: 4000,
                fromhost: "localhost"
            }, 
            data: ""
        });
        if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
            throw "User Test Failed.";
        }
    });
}).catch((err)=>{
    console.log(err);
});