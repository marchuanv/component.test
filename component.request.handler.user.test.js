require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.user" });
    await context.run( async({ request, component }) => {
        let { requestHandlerUserProxy } = await component.register({});
        const newRequest = { port: 3000, path: "/requesthandlerusertest", method: "GET", headers: {},  data: "" };
        requestHandlerUserProxy.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
            return {
                statusCode: 200,
                statusMessage: "User Test Successful",
                headers: {}
            };
        });
        let results = await request.send(newRequest);
        if (results.statusCode !== 400) {
            throw `User Test Failed: ${results.data}`;
        }

        newRequest.headers = {
            username: "joe",
            fromport: 4000,
            fromhost: "localhost"
        };
        results = await request.send(newRequest);
        if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
            throw `User Test Failed: ${results.data}`;
        }

        newRequest.headers = {
            sessionId: results.headers.sessionid
        };
        results = await request.send(newRequest);
        if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
            throw `User Test Failed: ${results.data}`;
        }
        
    });
}).catch((err)=>{
    console.log(err);
});