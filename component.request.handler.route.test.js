const { bootstrap } = require("./bootstrap.js");
bootstrap("component.request.handler.route").then( async ({ request, component, complete }) => {
    const newRequest = { port: 3000, path: "/requesthandlerroutetest", method: "GET", headers: {},  data: "" };
    component.subscribe({ channel: component.channel }, () => {
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
    }
    complete();
}).catch((err)=>{
    console.log(err);
});