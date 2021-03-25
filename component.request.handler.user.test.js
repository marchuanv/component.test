const { bootstrap } = require("./bootstrap.js");
bootstrap().then( async (load) => {
    let { request, component, complete } = await load({ moduleName: "component.request.handler.user" });
    const newRequest = { port: 3000, path: "/requesthandlerusertest", method: "GET", headers: {},  data: "" };
    component.subscribe({ name: `${newRequest.port}${newRequest.path}` }, () => {
        return {
            statusCode: 200,
            statusMessage: "User Test Successful",
            headers: {}
        };
    });
    let results = await request.send(newRequest);
    if (results.statusCode !== 400) {
        console.log( `User Test Failed: ${results.data}`);
    }

    newRequest.headers = {
        username: "joe",
        fromport: 4000,
        fromhost: "localhost"
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
        console.log( `User Test Failed: ${results.data}`);
    }

    newRequest.headers = {
        sessionId: results.headers.sessionid
    };
    results = await request.send(newRequest);
    if (results.statusCode !== 200 || results.statusMessage !== "User Test Successful"){
        console.log(`User Test Failed: ${results.data}`);
    }

    complete();
}).catch((err)=>{
    console.log(err);
});