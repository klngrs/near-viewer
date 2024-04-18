import { loadVM } from "near-social-vm"; // webpack alias to ./near-social-vm-federated

loadVM({
    name: "near_vm",
    entry: "http://localhost:2000/mf-manifest.json", // this is dynamic at runtime
}).then(() => {
    import('bootstrap'); // bootstrap the app once you have near-social-vm
})
