const { bootstrap } = require("./bootstrap.js");
bootstrap("component.request.handler").then( async ({ request, component, complete }) => {
    const newRequest = { port: 3000, path: "/requesthandlertest", method: "GET", headers: {},  data: "" };
    component.subscribe({ channel: component.config.channel }, () => {
        return {
            statusCode: 200,
            statusMessage: "Request Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Request Test Successful"){
        console.log(`Request Test Failed: ${results.data}`);
    } else {
        console.log(`Request Test Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});