export const rankDict = {
    k: "Kingdom",
    p: "Phylum",
    c: "Class",
    o: "Order",
    f: "Family",
    t: "tribe",
    g: "Genus",
    s: "Species",
};
 export function sortByRankKey(a: string, b: string): number {
    return Object.keys(rankDict).indexOf(a) - Object.keys(rankDict).indexOf(b);
 }

 export function sortByRank(a: string, b: string): number {
    return Object.values(rankDict).indexOf(a) - Object.values(rankDict).indexOf(b);
 }