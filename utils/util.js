"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compareSort = function (e, type, se) {
    if (type === void 0) { type = 'asc'; }
    if (se === void 0) { se = ''; }
    if (type === 'asc') {
        return function (a, b) {
            if (e === 'licensedDate') {
                var value1 = new Date(a[e]).getTime();
                var value2 = new Date(b[e]).getTime();
                if (value1 === value2) {
                    return a[se] - b[se];
                }
                return value1 - value2;
            }
            else {
                var value1 = a[e];
                var value2 = b[e];
                return value1 - value2;
            }
        };
    }
    else {
        return function (a, b) {
            if (e === 'licensedDate') {
                var value1 = new Date(a[e]).getTime();
                var value2 = new Date(b[e]).getTime();
                if (value1 === value2) {
                    return a[se] - b[se];
                }
                return value2 - value1;
            }
            else {
                var value1 = a[e];
                var value2 = b[e];
                return value2 - value1;
            }
        };
    }
};
exports.compareSort = compareSort;
var objectDiff = function (obj1, obj2) {
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    else {
        for (var key in obj1) {
            if (!obj2.hasOwnProperty(key)) {
                return false;
            }
            if (typeof obj1[key] === typeof obj2[key]) {
                if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                    var equal = objectDiff(obj1[key], obj2[key]);
                    if (!equal) {
                        return false;
                    }
                }
                if (typeof obj1[key] !== 'object' && typeof obj2[key] !== 'object' && obj1[key] !== obj2[key] && key != 'advSort') {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    }
    return true;
};
exports.objectDiff = objectDiff;
