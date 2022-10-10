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

export function setModelValue<T>(m: T, k: keyof T, v: any | undefined) {
    if (v === undefined) {
        delete m[k];
    } else {
        m[k] = v;
    }
}

const INDETERMINATE_CHECKBOX_STATE: {[k: string]: boolean | undefined} = { undefined: true, true: false, false: undefined };

export function handleInputChange<T>(model: T): (e: Event) => void {
    return event => {
        const input = event.target as HTMLInputElement;
        const key = input.name as keyof T;
        const triState = input.type === "checkbox" && !input.required
        const nextValue = triState ? INDETERMINATE_CHECKBOX_STATE[String(model[key])] : getInputValue(input); 
        setModelValue(model, key, nextValue);
        if (triState) {
            setInputValue(input, nextValue);
        }
        console.log(`Input ${input.name} changed`, model);
    }
}

export function bindInput<T>(input: HTMLInputElement, model: T) {
    setInputValue(input, model[input.name as keyof T]);
    input.addEventListener("change", handleInputChange(model));
}
