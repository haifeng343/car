"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var FeedBackServie = (function () {
    function FeedBackServie() {
    }
    FeedBackServie.prototype.submitFeedBack = function (suggestion) {
        return http_1.default.get('/cdd/user/addSuggestion.json', { suggestion: suggestion });
    };
    return FeedBackServie;
}());
exports.default = FeedBackServie;
