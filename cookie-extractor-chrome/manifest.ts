import { pkg } from "./pkg";

const manifest: chrome.runtime.Manifest = {
    manifest_version: 3,
    name: pkg.name || "",
    version: pkg.version || "",
    description: pkg.description,
    minimum_chrome_version: "116",
    background: {
        service_worker: "background.js"
    },
    host_permissions: [ "<all_urls>" ],
    permissions: [ "cookies", "storage" ],
    options_page: "opts.html",
    action: {},
    icons: {
        64: "icon.png"
    }
};

export default manifest;
