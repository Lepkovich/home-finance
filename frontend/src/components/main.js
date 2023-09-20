"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
var custom_http_1 = require("../services/custom-http");
var config_1 = __importDefault(require("../../config/config"));
var sidebar_1 = require("./sidebar");
var show_buttons_1 = require("../services/show-buttons");
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.earningsChart = document.getElementById('earnings-chart');
        _this.expensesChart = document.getElementById('expenses-chart');
        _this.emptyText = document.getElementById('emptyText');
        _this.charts = document.getElementById('charts');
        _this.dataInit();
        return _this;
    }
    Main.prototype.dataInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buttons;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sidebar_1.Sidebar.showSidebar('main')];
                    case 1:
                        _a.sent();
                        this.processButtons();
                        buttons = [
                            { button: this.todayButton, handler: 'today' },
                            { button: this.weekButton, handler: 'week' },
                            { button: this.monthButton, handler: 'month' },
                            { button: this.yearButton, handler: 'year' },
                            { button: this.allButton, handler: 'all' },
                        ];
                        // Добавляем обработчики для существующих кнопок
                        buttons.forEach(function (_a) {
                            var button = _a.button, handler = _a.handler;
                            if (button) {
                                button.onclick = _this.getTable.bind(_this, handler);
                            }
                        });
                        // Добавляем обработчик для periodButton, если он существует
                        if (this.periodButton) {
                            this.periodButton.onclick = function () {
                                if (_this.periodFrom && _this.periodTo) {
                                    var queryString = "interval&dateFrom=".concat(_this.periodFrom.value, "&dateTo=").concat(_this.periodTo.value);
                                    _this.getTable(queryString);
                                }
                            };
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.getTable = function (period) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, operations, income, expenses, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, Promise.all([
                                custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=' + period, 'GET'),
                                custom_http_1.CustomHttp.request(config_1.default.host + '/categories/income', 'GET'),
                                custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense', 'GET'),
                            ])];
                    case 1:
                        _a = _b.sent(), operations = _a[0], income = _a[1], expenses = _a[2];
                        if (!(operations && !('error' in operations) && income && !('error' in income) && expenses && !('error' in expenses))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.showOperations(income, expenses, operations)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 3:
                        if (!(operations && 'error' in operations)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.showResult(operations)];
                    case 4:
                        _b.sent();
                        throw new Error(operations.message);
                    case 5:
                        if (!(income && 'error' in income)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.showResult(income)];
                    case 6:
                        _b.sent();
                        throw new Error(income.message);
                    case 7:
                        if (!(expenses && 'error' in expenses)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.showResult(expenses)];
                    case 8:
                        _b.sent();
                        throw new Error(expenses.message);
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_1 = _b.sent();
                        console.log('Ошибка: ' + error_1);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Main.prototype.showOperations = function (income, expenses, operations) {
        return __awaiter(this, void 0, void 0, function () {
            var earningsContext, expensesContext, incomeData, earningsChart, expensesData, expensesChart;
            return __generator(this, function (_a) {
                if (this.charts && this.emptyText && this.earningsChart && this.expensesChart) {
                    if (operations.length === 0) {
                        this.charts.style.display = 'none';
                        this.emptyText.style.display = 'flex';
                    }
                    else {
                        this.charts.style.display = 'flex';
                        this.emptyText.style.display = 'none';
                        // Очищаем канвасы и уничтожаем объекты графиков
                        if (this.earningsChart.chart) {
                            this.earningsChart.chart.destroy();
                        }
                        earningsContext = this.earningsChart.getContext("2d");
                        earningsContext.clearRect(0, 0, this.earningsChart.width, this.earningsChart.height);
                        if (this.expensesChart.chart) {
                            this.expensesChart.chart.destroy();
                        }
                        expensesContext = this.expensesChart.getContext("2d");
                        expensesContext.clearRect(0, 0, this.expensesChart.width, this.expensesChart.height);
                        incomeData = operations.reduce(function (data, operation) {
                            if (operation.type === 'income') {
                                var categoryIndex = data.labels.indexOf(operation.category);
                                if (categoryIndex !== -1) {
                                    data.amounts[categoryIndex] += operation.amount;
                                }
                                else {
                                    data.labels.push(operation.category);
                                    data.amounts.push(operation.amount);
                                }
                            }
                            return data;
                        }, { labels: [], amounts: [] });
                        earningsChart = new Chart(this.earningsChart, {
                            type: 'pie',
                            data: {
                                labels: incomeData.labels,
                                // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                                datasets: [{
                                        label: 'Сумма Доходов',
                                        data: incomeData.amounts,
                                        // data: [12, 19, 3, 5, 2, 3],
                                        borderWidth: 1
                                    }]
                            },
                            options: {
                            // scales: {
                            //     y: {
                            //         beginAtZero: true
                            //     }
                            // }
                            }
                        });
                        expensesData = operations.reduce(function (data, operation) {
                            if (operation.type === 'expense') {
                                var categoryIndex = data.labels.indexOf(operation.category);
                                if (categoryIndex !== -1) {
                                    data.amounts[categoryIndex] += operation.amount;
                                }
                                else {
                                    data.labels.push(operation.category);
                                    data.amounts.push(operation.amount);
                                }
                            }
                            return data;
                        }, { labels: [], amounts: [] });
                        expensesChart = new Chart(this.expensesChart, {
                            type: 'pie',
                            data: {
                                labels: expensesData.labels,
                                datasets: [{
                                        label: 'Сумма расходов',
                                        data: expensesData.amounts,
                                        borderWidth: 1
                                    }]
                            },
                        });
                        // Сохраняем ссылки на объекты графиков
                        this.earningsChart.chart = earningsChart;
                        this.expensesChart.chart = expensesChart;
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    ;
    Main.prototype.showResult = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.textMessage = message.error ? message.message :
                            "Запись успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message);
                        _this.modalMessageField.innerText = _this.textMessage;
                        _this.resultModal.show();
                        // Обработчик события при закрытии попапа
                        _this.resultModal._element.addEventListener('hidden.bs.modal', function () {
                            resolve(); // Разрешаем обещание при закрытии попапа
                        });
                    })];
            });
        });
    };
    ;
    return Main;
}(show_buttons_1.ShowButtons));
exports.Main = Main;
//# sourceMappingURL=main.js.map