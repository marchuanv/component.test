const { bootstrap } = require("./bootstrap.js");
bootstrap("component.request.handler.deferred").then( async ({ request, component, complete }) => {
    const newRequest = { port: 3000, path: "/requesthandlerdeferredtest", method: "GET", headers: {},  data: "" };
    component.subscribe({ channel: component.config.channel }, () => {
        return {
            statusCode: 200,
            statusMessage: "Deffered Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Deffered Test Successful"){
        console.log(`Deffered Test Failed: ${results.data}`);
    } else {
        console.log(`Deffered Test Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});