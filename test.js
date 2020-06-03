const componentDelegate = require("./component.delegate.js");
(async() => {
    const prom = new Promise((resolve) => {
        const callingFunc = () => {
            throw new Error("some random error occured");
        };
        const rollbackFunc = () => {
          
        };
        const parameters = {};
        componentDelegate.call(callingFunc, rollbackFunc, parameters);
        setTimeout(resolve,1000);
    });
    await prom;
})().catch((err)=>{
    console.log(err);
});
