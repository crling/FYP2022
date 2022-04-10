/** check if the data is distinct **/
function isDistcint (values: any[], key?: string) {
    if (!!key) return !!values.filter(x => x[key] !== "NA").find(x => isNaN(parseFloat(x[key])));
    return !!values.filter(x => x !== "NA").find(x => isNaN(parseFloat(x)));
}

function isNull (value: string) {
    if (value === "NA") return true;
    return false;
}

const DataUtils = {
    isDistcint, isNull
};

export default DataUtils;
