const componentDelegate = require("./component.delegate.js");
const callingModule = "something";
componentDelegate.register(callingModule, "RandomFunction", () => {
    throw new Error("some random error occured");
});

(async() => {
    const prom = new Promise((resolve) => {
        const parameters = {};
        componentDelegate.call( { context: callingModule }, parameters);
        setTimeout(resolve,1000);
    });
    await prom;
})().catch((err)=>{
    console.log(err);
});
