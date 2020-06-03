"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setDate = function (date) {
    var d = date.split(" ")[0];
    var dd = d.split("-");
    return dd[1] + '-' + dd[2];
};
exports.setDate = setDate;
var setDay = function (time) {
    return Math.floor(time / 24);
};
exports.setDay = setDay;
var setHour = function (time) {
    if ((Math.floor(time / 24)) === 0) {
        return time;
    }
    else {
        return time % 24;
    }
};
exports.setHour = setHour;
var startTimeName = function (startTime) {
    var date = startTime.split(" ")[0];
    var time = startTime.split(" ")[1];
    var m = date.split("-")[1];
    var d = date.split("-")[2];
    var h = time.split(":")[0];
    var min = time.split(":")[1];
    return m + '月' + d + '日' + h + '时' + min + '分';
};
exports.startTimeName = startTimeName;
var taskTime = function (monitorTime, minutes) {
    if (monitorTime || monitorTime == 0 && !minutes && minutes != 0) {
        if (~~(monitorTime / 24) === 0) {
            return monitorTime + '小时';
        }
        else {
            return ~~(monitorTime / 24) + "天" + monitorTime % 24 + "小时";
        }
    }
    if (minutes || minutes == 0) {
        return minutes + '分钟';
    }
};
exports.taskTime = taskTime;
var checkDate = function (date) {
    if (!date) {
        return '--.--';
    }
    var d = date.split(" ")[0];
    var dateTime = d.split("-")[1] + "." + d.split("-")[2];
    return dateTime;
};
exports.checkDate = checkDate;
var json2Form = function (json) {
    var str = [];
    for (var p in json) {
        if (typeof (json[p]) == 'object') {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(json[p])));
        }
        else {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
    }
    return str.join("&");
};
exports.json2Form = json2Form;
var navigateToProgram = function (plateform, carid, city) {
    if (plateform == 'gz') {
        var c = city.gz ? city.gz.city_id : '';
        var domain = city.gz ? city.gz.domain : '';
        if (carid && c) {
            wx.navigateToMiniProgram({
                appId: 'wx2f40778ca2a8c6b0',
                path: 'pages/index/index?return_url=' + encodeURIComponent('https://m.guazi.com/' + domain + '/' + carid + 'x')
            });
        }
        else {
            wx.navigateToMiniProgram({
                appId: 'wx2f40778ca2a8c6b0',
            });
        }
    }
    if (plateform == 'yx') {
        var c = city.yx ? city.yx.cityid : '';
        if (carid && c) {
            wx.navigateToMiniProgram({
                appId: 'wx66d9d754ae654ee0',
                path: 'pages/carDetailNew/carDetailNew?carid=' + carid + '&cityid=' + c
            });
        }
        else {
            wx.navigateToMiniProgram({
                appId: 'wx66d9d754ae654ee0',
            });
        }
    }
    if (plateform == 'rr') {
        if (carid) {
            wx.navigateToMiniProgram({
                appId: 'wx2d80f009df8d7aaa',
                path: 'pages/detail/index?car_id=' + carid
            });
        }
        else {
            wx.navigateToMiniProgram({
                appId: 'wx2d80f009df8d7aaa',
            });
        }
    }
};
exports.navigateToProgram = navigateToProgram;
var jsonForm = function (json) {
    for (var p in json) {
        if (typeof (json[p]) == 'object') {
            json[p] = JSON.stringify(json[p]);
        }
    }
    return json;
};
exports.jsonForm = jsonForm;
