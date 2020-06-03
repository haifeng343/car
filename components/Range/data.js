"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RangeComponentData = (function () {
    function RangeComponentData() {
        this.leftX = 0;
        this.rightX = 0;
        this.containerWidth = 0;
        this.blockHalfWidth = 0;
        this.blockWidth = 0;
        this.containerLeft = 0;
        this.stepWidth = 0;
        this.isLoaded = false;
        this.rightStyle = '';
        this.leftStyle = '';
        this.distanceStyle = '';
        this.inited = false;
        this.tickWidth = 0;
        this.leftIcon = 'uniE953';
        this.rightIcon = 'uniE954';
        this.tickList = [];
    }
    return RangeComponentData;
}());
exports.default = RangeComponentData;
