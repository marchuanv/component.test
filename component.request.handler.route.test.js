const { bootstrap } = require("./bootstrap.js");
bootstrap("component.request.handler.route").then( async ({ request, component, requestHandlerRoute, complete }) => {
    requestHandlerRoute.config.routes = [
        { path: "/requesthandlertest", secure: false },
        { path: "/requesthandlerroutetest", secure: false },
        { path: "/requesthandlerdeferredtest", secure: false },
        { path: "/requesthandlerusertest", secure: false },
        { path: "/requesthandlerunsecuretest", secure: false },
        { path: "/requesthandlersecuretest", secure: true },
    ];
    const newRequest = { port: 3000, path: "/requesthandlerroutetest", method: "GET", headers: {},  data: "" };
    component.subscribe( () => {
        return {
            statusCode: 200,
            statusMessage: "Routing Test Successful",
            headers: {}
        };
    });
    newRequest.headers = {
        username: "joe",
        fromport: 4000,
        fromhost: "localhost"
    };
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Routing Test Successful"){
        console.log(`Routing Test Failed: ${results.data}`);
    } else {
        console.log(`Routing Test Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});