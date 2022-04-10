const BVD3_LIGHT_THEME = "BVD3_LIGHT_THEME";

export function isLightTheme() {
    return window.localStorage.getItem(BVD3_LIGHT_THEME) === "1";
}

export function saveTheme(isDark: boolean) {
    window.localStorage.setItem(BVD3_LIGHT_THEME, isDark ? "0" : "1");
}

export function savedTheme(nameOrDark: string, light?: string) {
    if (arguments.length === 1) {
        return `${arguments[0]}-${isLightTheme() ? "light" : "dark"}`;
    } else if (arguments.length === 2) {
        return light;
    }
    return isLightTheme() ? light : nameOrDark;
}
