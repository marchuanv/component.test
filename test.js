const componentDelegate = require("./component.delegate.js");

const callingModule = "something";
componentDelegate.register(callingModule, "RandomFunction1", () => {
    throw new Error("some random error occured");
});
componentDelegate.register(callingModule, "RandomFunction2", () => {
    return "Success";
});


(async() => {
    const prom = new Promise(async (resolve) => {
        const parameters = {};
        const results = await componentDelegate.call( { context: callingModule }, parameters);
        setTimeout(resolve,1000);
    });
    await prom;
})().catch((err)=>{
    console.log(err);
});
