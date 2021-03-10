(async() => {
    const Component = require("component");
    const component = new Component({ moduleName: "component.logging", gitUsername: "marchuanv"});
})().catch((err)=>{
    console.log(err);
});