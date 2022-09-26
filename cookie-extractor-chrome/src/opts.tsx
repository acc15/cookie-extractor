import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from "react";
import OptionsRoot from './options/OptionsRoot';
import { createRoot } from "react-dom/client"

const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

createRoot(root).render(<OptionsRoot />);