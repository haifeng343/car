"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatterMap = new Map();
var registerFormatter = function (formatterName, formatter) {
    if (formatterMap.has(formatterName)) {
        formatterMap.delete(formatterName);
    }
    formatterMap.set(formatterName, formatter);
};
exports.registerFormatter = registerFormatter;
var doFormatData = function (data, formatterName) {
    if (!formatterMap.has(formatterName)) {
        throw new Error("\u4E0D\u5B58\u5728\u7684formatter" + formatterName + "!\u8BF7\u68C0\u67E5\u53C2\u6570");
    }
    var formatter = formatterMap.get(formatterName);
    return formatter(data);
};
exports.doFormatData = doFormatData;
