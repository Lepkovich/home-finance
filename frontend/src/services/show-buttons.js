"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowButtons = void 0;
var ShowButtons = /** @class */ (function () {
    function ShowButtons() {
        this.activeButton = null;
        this.todayButton = document.getElementById('today');
        this.weekButton = document.getElementById('week');
        this.monthButton = document.getElementById('month');
        this.yearButton = document.getElementById('year');
        this.allButton = document.getElementById('all');
        this.periodFrom = document.getElementById('periodFrom');
        this.periodTo = document.getElementById('periodTo');
        this.periodButton = document.getElementById('period');
        this.buttons = document.querySelectorAll('.medium');
    }
    ShowButtons.prototype.processButtons = function () {
        var _this = this;
        // меняем оформление активных и неактивных кнопок
        this.buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                if (_this.activeButton !== null) {
                    _this.activeButton.classList.remove('btn-secondary');
                    _this.activeButton.classList.add('btn-outline-secondary');
                }
                button.classList.add('btn-secondary');
                button.classList.remove('btn-outline-secondary');
                _this.activeButton = button;
            });
        });
    };
    return ShowButtons;
}());
exports.ShowButtons = ShowButtons;
//# sourceMappingURL=show-buttons.js.map