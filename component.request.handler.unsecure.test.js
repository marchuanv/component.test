const { bootstrap } = require("./bootstrap.js");
bootstrap().then( async (load) => {
    let { request, component, complete } = await load({ moduleName: "component.request.handler.unsecure" });
    const newRequest = { port: 3000, path: "/requesthandlerunsecuretest", method: "GET", headers: {},  data: "" };
    component.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
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
        console.log(`Unsecure Test Failed: ${results.data}`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});