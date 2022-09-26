import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { ChromeCookieExtractorOptions } from "../options";
import Paper from "@mui/material/Paper";

import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {Link} from "react-router-dom";
import { Checkbox } from "@mui/material";
import { NotificationData, NotificationFunction } from "./Notification";
import { ApplyFunction, SaveFunction } from "./OptionsRoot";
import IndeterminateCheckbox from "./IndeterminateCheckbox";

export interface OptionsFormProps {
    initData: ChromeCookieExtractorOptions;
    data: ChromeCookieExtractorOptions;
    apply: ApplyFunction;
    save: SaveFunction;
    notify: NotificationFunction;
}

const OptionsForm = ({ initData, data, apply, save, notify }: OptionsFormProps) => {
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await save();
        notify({ open: true, message: "Options has been succesfully saved", severity: "success", timeout: 6000});
    }

    return <Box component="form" display="flex" gap="15px" flexDirection="column" onSubmit={handleSubmit}>

        <Typography variant="h1">Chrome Cookie Extractor options</Typography>

        <Typography variant="h2">Generic</Typography>

        <TextField id="id" label="Client Id" sx={{ width: '300px' }} value={data.id} onChange={e => apply({...data, id: e.target.value})} variant="standard" />
        <TextField id="url" label="Connector URL" sx={{ width: '300px' }} value={data.url} onChange={e => apply({...data, url: e.target.value})} variant="standard" />
        
        <Typography variant="h2">Cookies</Typography>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Domain</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Url</TableCell>
                        <TableCell>Path</TableCell>
                        <TableCell>StoreId</TableCell>
                        <TableCell>Session</TableCell>
                        <TableCell>Secure</TableCell>
                        <TableCell align="right">
                            <IconButton component={Link} to="/cookie/new">
                                <Add/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.cookies.map((c, i) =>
                        <TableRow key={i}>
                            <TableCell>{c.domain}</TableCell>
                            <TableCell>{c.name}</TableCell>
                            <TableCell>{c.url}</TableCell>
                            <TableCell>{c.path}</TableCell>
                            <TableCell>{c.storeId}</TableCell>
                            <TableCell><IndeterminateCheckbox value={c.session}/></TableCell>
                            <TableCell><IndeterminateCheckbox value={c.secure}/></TableCell>
                            <TableCell align="right">
                                <IconButton component={Link} to={`/cookie/${i}`}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="warning" onClick={() => apply({ ...data, cookies: data.cookies.filter((v, idx) => idx !== i)})}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <Box display="flex" flexDirection="row" justifyContent="end" gap="20px">
            <Button variant="outlined" sx={{width: '200px'}} onClick={() => apply(initData)}>Reset</Button>
            <Button color="primary" type="submit" variant="contained" sx={{width: '200px'}}>Save</Button>
        </Box>
    </Box>;
};


export default OptionsForm;