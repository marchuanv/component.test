const component = require("component");
component.load({ moduleName:"component.request.handler" }).then(() => {
    component.load({ moduleName:"component.request.handler.route" }).then(async () => {
        let { currentModule } = require("component.request.handler.route/component.test");
        await component.register({componentModule: currentModule, componentParentModuleName: "component.request.handler.route"}).then( async ( { requestHandlerRoute } ) => {
            requestHandlerRoute.subscribe({ name: "3000/test1", overwriteDelegate: true }, () => {
                return {
                    statusCode: 200,
                    statusMessage: "Test Successful"
                };
            });
            const { request } = await component.load({ moduleName:"component.request" });
            let results = await request.send({ 
                host: "localhost",
                port: 3000,
                path: "/test1",
                method: "GET",
                headers: {}, 
                data: "",
                retryCount: 1
            });
            if (results.statusCode !== 200 && results.statusMessage !== "Test Successful"){
                throw "routing for test 01 failed";
            }
        });
    });
});