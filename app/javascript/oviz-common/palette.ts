const palettes = {
    npg: {
        name: "NPG",
        colors: ["#E64B35", "#4DBBD5", "#00A087", "#3C5488", "#F39B7F", "#8491B4", "#91D1C2", "#DC0000", "#7E6148", "#B09C85"],
    },
    aaas: {
        name: "AAAS",
        colors: ["#3B4992", "#EE0000",  "#008B45", "#631879",  "#008280", "#BB0021",  "#5F559B", "#A20056",  "#808180", "#1B1919"],
    },
    nejm: {
        name: "NEJM",
        colors: ["#BC3C29", "#0072B5", "#E18727", "#20854E", "#7876B1", "#6F99AD", "#FFDC91", "#EE4C97"],
    },
    lancet: {
        name: "Lancet",
        colors: ["#00468B", "#ED0000", "#42B540", "#0099B4", "#925E9F", "#FDAF91", "#AD002A", "#ADB6B6", "#1B1919"],
    },
    jama: {
        name: "JAMA",
        colors: ["#BC3C29", "#0072B5", "#E18727", "#20854E", "#7876B1", "#6F99AD", "#FFDC91", "#EE4C97"],
    },
};

export default palettes;

/*
    C>A
    C>G
    C>T
    T>A
    T>C
    T>G
*/
export const cosmicPalettes = {
    cosmicLight: {
        name: "COSMIC",
        colors: [
            "#49BCED",
            "#000000",
            "#E1422C",
            "#999999",
            "#9FCE66",
            "#ECC6C5",
        ],
    },
};

export const rainbowL = [ "hsl(330, 82%, 76%)",
"hsl(0, 85%, 77%)",
"hsl(14, 100%, 78%)",
"hsl(36, 100%, 75%)",
"hsl(45, 100%, 75%)",
"hsl(54, 100%, 72%)",//"hsl(54, 100%, 81%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 92%, 74%)",
"hsl(207, 90%, 77%)",
"hsl(231, 44%, 74%)",
"hsl(261, 46%, 74%)",
"hsl(291, 47%, 71%)",
];

export const rainbow1 = [ "hsl(340, 82%, 76%)",
"hsl(0, 73%, 77%)",
"hsl(14, 100%, 78%)",
"hsl(36, 100%, 75%)",
"hsl(45, 100%, 75%)",
"hsl(54, 90%, 72%)", // "hsl(54, 100%, 81%)",
"hsl(66, 71%, 77%)",
"hsl(88, 50%, 76%)",
"hsl(122, 37%, 74%)",
"hsl(150, 37%, 74%)",
"hsl(174, 42%, 65%)",
"hsl(187, 72%, 71%)",
"hsl(199, 92%, 74%)",
"hsl(207, 90%, 77%)",
"hsl(207, 90%, 77%)",
"hsl(231, 44%, 74%)",
"hsl(261, 46%, 74%)",
"hsl(291, 47%, 71%)",
"hsl(310, 47%, 71%)",
"hsl(325, 47%, 71%)",
];

export const groupedChartColors = [
// "#3CC145",
// "#f06748",
// "#6748f0",
// "#48d1f0",
// "#bb48f0",
// "#f0bb48",
"#20854E", "#BC3C29", "#0072B5", "#E18727", "#7876B1",
];

export const groupedColors2 = [
    "hsl(0, 73%, 70%)",
    "hsl(45, 100%, 70%)",
    "hsl(199, 92%, 70%)",
    "hsl(231, 44%, 70%)",
    "hsl(291, 47%, 70%)",
    "hsl(340, 82%, 70%)",
];

export const controlGroupColors = [
    "#27AE60", "#E74C3C"
];
export const signedChartColors = {
    posRange: "#27AE60",
    negRange: "#E74C3C",
    origin: "white"
}

// export const groupedChartColors = ["green", "red"]

export function withDefaultPalette(colors: string[], extraPalettes?: Dictionary<any>) {
    return {
        ...{ default: { name: "Default", colors }},
        ...extraPalettes,
        ...palettes,
    };
}

export function genDefaultPalette(colors: Record<string, string>, keyOrder?: string[]): [string[], Record<string, number>] {
    const paletteMap = {};
    const keys = keyOrder || Object.keys(colors);
    let i = 0;
    for (const name of keys) {
        paletteMap[name] = i++;
    }
    return [Object.values(colors), paletteMap];
}


export function genPaletteMap(keys: string[]): Dictionary<string | number> {
    const keyMap = {};
    keys.forEach((k, i) => keyMap[k] = i);
    return keyMap;

}
