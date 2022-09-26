import Checkbox from "@mui/material/Checkbox";
import React from "react";

export type OptionalBoolean = boolean | undefined;

const changeMap: { [k: string]: OptionalBoolean } = {
    undefined: false,
    false: true,
    true: undefined
};

function nextValue(v: OptionalBoolean): OptionalBoolean {
    return changeMap[String(v)];
} 

export interface IndeterminateCheckboxProps {
    name?: string;
    value: OptionalBoolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: OptionalBoolean) => void;
}

export default ({name, value, onChange}: IndeterminateCheckboxProps) => <Checkbox name={name} 
        indeterminate={value === undefined} 
        checked={value || false} 
        onChange={ onChange ? e => onChange(e, nextValue(value)) : undefined }/>
        