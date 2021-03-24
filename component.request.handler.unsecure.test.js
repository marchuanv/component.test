require("./bootstrap.js").then( async ({ proxy }) => {
    let context = await proxy({ moduleName: "component.request.handler.unsecure" });
    await context.run( async({ request, component }) => {
        let { requestHandlerUnsecureProxy } = await component.register({});
        const newRequest = { port: 3000, path: "/requesthandlerunsecuretest", method: "GET", headers: {},  data: "" };
        requestHandlerUnsecureProxy.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
            return {
                statusCode: 200,
                statusMessage: "Unsecure Test Successful",
                headers: {}
            };
        });
        newRequest.headers = {
            username: "joe",
            fromport: 4000,
            fromhost: "localhost"
        };
        let results = await request.send(newRequest);
        if (results.statusCode !== 200 || results.statusMessage !== "Unsecure Test Successful"){
            throw `Unsecure Test Failed: ${results.data}`;
        }
    });
}).catch((err)=>{
    console.log(err);
});