"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var UserFeedBackServie = (function () {
    function UserFeedBackServie() {
    }
    UserFeedBackServie.prototype.getUserFeedBackList = function () {
        return http_1.default.get('/cdd/user/replySuggestion.json')
            .then(function (resp) { return Promise.resolve(resp.data || []); })
            .then(function (resp) {
            for (var _i = 0, resp_1 = resp; _i < resp_1.length; _i++) {
                var s = resp_1[_i];
                s.updateTime = s.updateTime
                    ? s.updateTime.substr(0, 10)
                    : s.createTime.substr(0, 10);
            }
            return Promise.resolve(resp);
        });
    };
    return UserFeedBackServie;
}());
exports.default = UserFeedBackServie;
