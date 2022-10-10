import "./opts.css";

import { Config, loadConfig, storeConfig } from "../config";
import { bindInput } from "./utils";

loadConfig().then(state => {

    function addCookieFilter(cookie: chrome.cookies.GetAllDetails) {
        const template = document.getElementById("cookie-filter-template") as HTMLTemplateElement; 
        const insertionPlace = template.parentNode!!; 
        const row = template.content.children[0].cloneNode(true) as HTMLTableRowElement;
        for (const input of row.getElementsByTagName("input")) {
            if (input.name === "delete") { 
                input.addEventListener("click", e => {
                    const tr = (e.target as HTMLElement).closest("tr")!!;
                    const index = tr.rowIndex - 1;

                    state.cookies.splice(index, 1);
                    tr.remove();

                    console.log(`Cookie at ${index} deleted`, state);
                });
            } else {
                bindInput(input, cookie);
            }
        }
        insertionPlace.appendChild(row);
    }

    (["clientId", "url", "debounceTimeout", "maxRetries", "retryTimeout"] as Array<keyof Config>)
        .flatMap(f => Array.from(document.getElementsByName(f)))
        .map(e => e as HTMLInputElement)
        .forEach(input => bindInput(input, state));
    for (const cookie of state.cookies) {
        addCookieFilter(cookie);
    }

    (document.getElementById("add-cookie-filter") as HTMLInputElement).addEventListener("click", e => {
        const cookie: chrome.cookies.GetAllDetails = {};
        state.cookies.push(cookie);
        addCookieFilter(cookie);
    });

    (document.getElementById("form") as HTMLFormElement).addEventListener("submit", e => {
        e.preventDefault();

        const status = document.getElementById("status") as HTMLDivElement;

        status.innerText = "";
        storeConfig(state).then(() => status.innerText = "Config successfully saved", e => {
            status.innerText = "Unable to save config";
            console.error("Unable to save config", e);
        });
    });

});

