import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

export interface NotificationData {
    open: boolean,
    message: string,
    severity?: AlertColor,
    timeout?: number
};

export const DEFAULT_NOTIFICATION: NotificationData = {
    open: false,
    message: "",
};

export interface NotificationProps {
    notification: NotificationData,
    onClose: () => void
}

export type NotificationFunction = (notification: NotificationData) => void;

export default ({notification, onClose}: NotificationProps) => 
    <Snackbar
        anchorOrigin={{horizontal: "center", vertical: "top"}}
        open={notification.open}
        autoHideDuration={notification.timeout}
        onClose={onClose}>
        <Alert onClose={onClose} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
        </Alert>
    </Snackbar>;