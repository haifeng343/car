"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rx_1 = require("../rx/rx");
var SearchDataSubject = new rx_1.Subject();
exports.SearchDataSubject = SearchDataSubject;
var SearchDataObject = new rx_1.BehaviorSubject(false);
exports.SearchDataObject = SearchDataObject;
var MonitorSearchDataSubject = new rx_1.Subject();
exports.MonitorSearchDataSubject = MonitorSearchDataSubject;
