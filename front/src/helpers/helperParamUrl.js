class helperParamUrl {
    static getParams() {
        const urlFull = window.location.href;
        const startIndex = urlFull.indexOf('?')+1;
        const url = urlFull.substring(startIndex);
        const result = {};
        url.split('&').forEach(x=> {
            const data = x.split('=');
            result[data[0]] = data[1];
        });
        return result;
    }
}

module.exports = helperParamUrl;
