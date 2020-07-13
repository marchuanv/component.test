const componentDelegate = require("./component.delegate.js");
const callingModule = "something";
componentDelegate.register(callingModule, () => {
    throw new Error("some random error occured");
});

(async() => {
    const prom = new Promise((resolve) => {
        const parameters = {};
        componentDelegate.call(callingModule, parameters);
        setTimeout(resolve,1000);
    });
    await prom;
})().catch((err)=>{
    console.log(err);
});
