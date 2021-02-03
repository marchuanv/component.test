const componentDelegate = require("./component.delegate.js");

const callingModule1 = "something";
const callingModule2 = "something2";

componentDelegate.register(callingModule1, "RandomFunction1", () => {
    throw new Error("some random error occured");
});
componentDelegate.register(callingModule1, "RandomFunction2", () => {
    return "Success";
});
componentDelegate.register(callingModule2, "RandomFunction3", () => {
    return "Success";
});
componentDelegate.register(callingModule2, "RandomFunction4", () => {
    return "Success";
});


(async() => {
    const prom = new Promise(async (resolve) => {
        const parameters = {};
        const results = await componentDelegate.call( { context: callingModule1 }, parameters);
        setTimeout(resolve,2000);
    });
    await prom;

    const prom2 = new Promise(async (resolve) => {
        const parameters = {};
        const results = await componentDelegate.call( { context: callingModule2, wildcard: "RandomFunction" }, parameters);
        setTimeout(resolve,2000);
    });
    await prom2;

})().catch((err)=>{
    console.log(err);
});
