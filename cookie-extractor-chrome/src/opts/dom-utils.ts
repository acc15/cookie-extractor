
export function getValueOrDefault<T>(value: any | undefined, ctor: (v?: any) => T): T {
    return value !== undefined ? ctor(value) : ctor();
}

export function setInputValue(input: HTMLInputElement, value: any | undefined) {
    switch (input.type) {
        case "number":
            input.valueAsNumber = getValueOrDefault(value, Number);
            break;
        case "checkbox":
            input.checked = getValueOrDefault(value, Boolean);
            input.indeterminate = value === undefined;
            break;
        default: 
            input.value = getValueOrDefault(value, String);
            break;
    }
}

export function getInputValue(input: HTMLInputElement): any | undefined {
    switch (input.type) {
        case "number": 
            const v = input.valueAsNumber;
            return isNaN(v) ? (input.required ? 0 : undefined) : v;  
        case "checkbox": 
            return input.indeterminate && !input.required ? undefined : input.checked;
        default: 
            return input.required ? input.value : (input.value || undefined);
    }
}
