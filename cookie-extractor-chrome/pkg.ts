import { PackageJson } from "type-fest";
import package_data from "./package.json";

export function loadModule<T>(path: string): any {
    delete require.cache[require.resolve(path)];
    return require(path);
}

export const pkg: PackageJson = package_data as PackageJson;