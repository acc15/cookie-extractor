import React, { useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ChromeCookieExtractorOptions, DEFAULT_OPTIONS, loadOptions, storeOptions } from "../options";
import CookieForm from "./CookieForm";
import OptionsForm from "./OptionsForm";

import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from './theme';
import Notification, { NotificationData, DEFAULT_NOTIFICATION, NotificationFunction } from "./Notification";


const Background = require("../icon/icon.svg") as string;

interface RootState {
    initial: ChromeCookieExtractorOptions,
    current: ChromeCookieExtractorOptions,
    loading: boolean,
    notification: NotificationData
};

export type ApplyFunction = (opts: ChromeCookieExtractorOptions) => Promise<void>;
export type SaveFunction = () => Promise<void>;

export default class Root extends React.Component {

    state: RootState = { 
        initial: DEFAULT_OPTIONS, 
        current: DEFAULT_OPTIONS, 
        loading: true,
        notification: {
            open: true,
            message: "hello",
            severity: "success",
            timeout: 6000
        }
    };

    async componentDidMount() {
        const opts = await loadOptions();
        this.setState({ initial: opts, current: opts, loading: false });
    }

    render(): React.ReactNode {
        const save: SaveFunction = async () => {
            await storeOptions(this.state.current);
            return new Promise(resolve => this.setState({ initial: this.state.current }, resolve));
        }
        const apply: ApplyFunction = (opts) => new Promise(resolve => this.setState({ current: opts }, resolve));
        const notify: NotificationFunction = n => this.setState({ notification: n });

        return <ThemeProvider theme={theme}>
            <CssBaseline/>
            {/*
            <Box sx={{
                backgroundImage: `url(${Background})`, 
                width: "100%", 
                height: "100%", 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "600px", 
                position: "absolute", 
                left: 0, 
                top: 0, 
                opacity: 0.1 
                }}/>
            */}
            <Container sx={{pb: theme.spacing(3), backgroundColor: theme.palette.background.default, boxShadow: 3 }}>
                { this.state.loading ? null : 
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <OptionsForm 
                                initData={this.state.initial} 
                                data={this.state.current} 
                                apply={apply} save={save} 
                                notify={notify}/>
                            }/>
                        <Route path="/cookie/:index" element={<CookieForm data={this.state.current} apply={apply} notify={notify}/>}/>
                    </Routes>
                </MemoryRouter> 
                }
            </Container>
            <Notification 
                notification={this.state.notification} 
                onClose={() => this.setState({ notification: DEFAULT_NOTIFICATION})}/>
        </ThemeProvider>;
    }

};
