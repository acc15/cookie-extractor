import React, { useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { ChromeCookieExtractorOptions } from "../options";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { NotificationFunction } from "./Notification";
import IndeterminateCheckbox, { OptionalBoolean } from "./IndeterminateCheckbox";
import { shallowEq } from "../util";

export interface CookieFormProps {
    data: ChromeCookieExtractorOptions,
    apply: (data: ChromeCookieExtractorOptions) => Promise<void>,
    notify: NotificationFunction
}

export default ({data, apply, notify}: CookieFormProps) => {
    const index = parseInt(useParams<"index">().index || "");
    const idx: number | undefined = isNaN(index) ? undefined : index;
    
    const [cookie, setCookie] = useState<chrome.cookies.GetAllDetails>(idx === undefined ? {} : data.cookies[idx]);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dupes = data.cookies.filter((c, i) => i !== idx && shallowEq(cookie, c));
        if (dupes.length > 0) {
            notify({ open: true, message: "Cookie with same parameters already exists", severity: "error" });
            return;
        }

        await apply({ ...data, cookies: idx === undefined ? [...data.cookies, cookie] : data.cookies.map((c, i) => i === idx ? cookie : c)})
        navigate(-1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCookie({ ...cookie, [e.target.name]: e.target.value });
    };

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, value: OptionalBoolean) => {
        setCookie({ ...cookie, [e.target.name]: value });
    };
 
    return <Box component="form" onSubmit={handleSubmit} display="flex" gap="15px" flexDirection="column">
        <Typography variant="h1">{idx === undefined ? "Add" : "Edit"} cookie</Typography>

        <TextField variant="standard" label="Domain" name="domain" value={cookie.domain || ""} onChange={handleChange}/>
        <TextField variant="standard" label="Name" name="name" value={cookie.name || ""} onChange={handleChange}/>
        <TextField variant="standard" label="Url" name="url" value={cookie.url || ""} onChange={handleChange}/>
        <TextField variant="standard" label="Path" name="path" value={cookie.path || ""} onChange={handleChange}/>
        <TextField variant="standard" label="Store Id" name="storeId" value={cookie.storeId  || ""} onChange={handleChange}/>
        <FormControlLabel label="Session" control={<IndeterminateCheckbox name="session" value={cookie.session} onChange={handleCheck}/>}/>
        <FormControlLabel label="Secure" control={<IndeterminateCheckbox name="secure" value={cookie.secure} onChange={handleCheck}/>}/>

        <Box display="flex" flexDirection="row" justifyContent="end" gap="20px">
            <Button variant="outlined" sx={{width: '200px'}} onClick={() => navigate(-1)}>Cancel</Button>
            <Button color="primary" type="submit" variant="contained" sx={{width: '200px'}}>Apply</Button>
        </Box>
    </Box>;
};