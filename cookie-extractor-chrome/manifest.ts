import { pkg } from "./pkg";

const manifest: chrome.runtime.Manifest = {
    manifest_version: 3,
    name: pkg.name || "",
    version: pkg.version || "",
    description: pkg.description,
    background: {
        service_worker: "background.js"
    },
    host_permissions: [
        "<all_urls>"
    ],
    action: {},
    options_page: "opts.html",
    permissions: [
        "cookies",
        "storage"
    ],
    icons: {
        64: "icon.png"
    }
};

export default manifest;
