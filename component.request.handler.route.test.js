const { bootstrap } = require("./bootstrap.js");
const utils = require("utils");
bootstrap("component.request.handler.route").then( async ({ request, component, complete }) => {
    const registerRouteRequest = { 
        port: 3000, path: "/routes/register", method: "GET", 
        headers: { username: "joe", fromport: 4000, fromhost: "localhost" },  
        data: utils.getJSONString({ path: "/requesthandlerroutetest" })
    };
    let results = await request.send(registerRouteRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "/requesthandlerroutetest registered"){
        console.log(`Registering Routing Test Failed: ${results.data}`);
    } else {
        console.log(`Registering Routing Test Passed`);
    }

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
    results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "Routing Test Successful"){
        console.log(`Routing Test Failed: ${results.data}`);
    } else {
        console.log(`Routing Test Passed`);
    }
    complete();
}).catch((err)=>{
    console.log(err);
});