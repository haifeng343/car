"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var BindPhoneService = (function () {
    function BindPhoneService() {
    }
    BindPhoneService.prototype.getCode = function (mobile) {
        return http_1.default.get('/cdd/user/validate/code.json', {
            validateType: 'bind_Mobile',
            mobile: mobile
        });
    };
    BindPhoneService.prototype.bindMoblie = function (mobile, code) {
        return http_1.default.post('/cdd/user/bindMobile.json', { mobile: mobile, code: code });
    };
    return BindPhoneService;
}());
exports.default = BindPhoneService;
