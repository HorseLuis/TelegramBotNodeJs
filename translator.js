const translate = require('translate')

module.exports = {
    translateDefault: async function(text) {
        const res = await translate(text, {from: "es", to: "en", engine: "libre"});
        return res;
    },
    translateText: async function(text, from, to) {
        const res = await translate(text, {from: `${from}`, to: `${to}`, engine: "libre"});
        return res;
    },
    translateTo: async function(text, to) {
        const res = await translate(text, {from: "es", to: `${to}`, engine: "libre"});
        return res;
    },
}