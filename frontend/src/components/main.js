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
var custom_http_ts_1 = require("../services/custom-http.ts");
var config_1 = __importDefault(require("../../config/config"));
var sidebar_1 = require("./sidebar");
var show_buttons_ts_1 = require("../services/show-buttons.ts");
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
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sidebar_1.Sidebar.showSidebar('main')];
                    case 1:
                        _a.sent();
                        this.processButtons();
                        this.todayButton.onclick = this.getTable.bind(this, 'today');
                        this.weekButton.onclick = this.getTable.bind(this, 'week');
                        this.monthButton.onclick = this.getTable.bind(this, 'month');
                        this.yearButton.onclick = this.getTable.bind(this, 'year');
                        this.allButton.onclick = this.getTable.bind(this, 'all');
                        this.periodButton.onclick = function () {
                            var queryString = "interval&dateFrom=".concat(_this.periodFrom.value, "&dateTo=").concat(_this.periodTo.value);
                            _this.getTable(queryString);
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.getTable = function (period) {
        return __awaiter(this, void 0, void 0, function () {
            var income, expenses, operations, error_1, error_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        income = null;
                        expenses = null;
                        operations = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, custom_http_ts_1.CustomHttp.request(config_1.default.host + '/operations/?period=' + period, 'GET')];
                    case 2:
                        operations = _a.sent();
                        if (!operations) return [3 /*break*/, 4];
                        if (!(operations.error || !operations)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.showResult(operations.message)];
                    case 3:
                        _a.sent();
                        throw new Error(operations.message);
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.log('ошибка' + error_1);
                        return [3 /*break*/, 6];
                    case 6:
                        _a.trys.push([6, 10, , 11]);
                        return [4 /*yield*/, custom_http_ts_1.CustomHttp.request(config_1.default.host + '/categories/income', 'GET')];
                    case 7:
                        income = _a.sent();
                        if (!income) return [3 /*break*/, 9];
                        if (!(income.error || !income)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.showResult(income.message)];
                    case 8:
                        _a.sent();
                        throw new Error(income.message);
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 11];
                    case 11:
                        _a.trys.push([11, 15, , 16]);
                        return [4 /*yield*/, custom_http_ts_1.CustomHttp.request(config_1.default.host + '/categories/expense', 'GET')];
                    case 12:
                        expenses = _a.sent();
                        if (!expenses) return [3 /*break*/, 14];
                        if (!(expenses.error || !expenses)) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.showResult(expenses.message)];
                    case 13:
                        _a.sent();
                        throw new Error(expenses.message);
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 16];
                    case 16: return [4 /*yield*/, this.showOperations(income, expenses, operations)];
                    case 17:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Main.prototype.showOperations = function (income, expenses, operations) {
        return __awaiter(this, void 0, void 0, function () {
            var earningsContext, expensesContext, incomeData, earningsChart, expensesData, expensesChart;
            return __generator(this, function (_a) {
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
}(show_buttons_ts_1.ShowButtons));
exports.Main = Main;
//# sourceMappingURL=main.js.map