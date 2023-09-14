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
exports.PL = void 0;
var custom_http_1 = require("../services/custom-http");
var config_1 = __importDefault(require("../../config/config"));
var sidebar_1 = require("./sidebar");
var show_buttons_1 = require("../services/show-buttons");
var PL = /** @class */ (function (_super) {
    __extends(PL, _super);
    function PL() {
        var _this = _super.call(this) || this;
        _this.addIncomeButton = document.getElementById('add-income');
        _this.addExpenseButton = document.getElementById('add-expense');
        _this.emptyText = document.getElementById('emptyText');
        _this.tbody = document.getElementById("tbody");
        //определяем параметры модальных окон
        _this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        _this.confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        _this.modalMessageField = document.getElementById('textModal-message');
        _this.textMessage = null;
        _this.dataInit();
        return _this;
    }
    PL.prototype.dataInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sidebar_1.Sidebar.showSidebar('pl')];
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
                        this.addIncomeButton.onclick = function () {
                            location.href = '#/add-p&l?=income';
                        };
                        this.addExpenseButton.onclick = function () {
                            location.href = '#/add-p&l?=expense';
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    PL.prototype.getTable = function (period) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/operations/?period=' + period, 'GET')];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 5];
                        if (!(result.error || !result)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.showResult(result.message)];
                    case 2:
                        _a.sent();
                        throw new Error(result.message);
                    case 3: return [4 /*yield*/, this.showTable(result)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.log('ошибка' + error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ;
    PL.prototype.showTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var i, item, row, numberCell, typeCell, categoryCell, amountCell, dateCell, parts, commentCell, actionsCell, actionsDiv, deleteLink, deleteIcon, editLink, editIcon, _loop_1, _i, _a, element;
            var _this = this;
            return __generator(this, function (_b) {
                // Очистим таблицу перед заполнением
                this.tbody.innerHTML = '';
                if (table.length === 0) {
                    this.emptyText.style.display = 'flex';
                }
                else {
                    this.emptyText.style.display = 'none';
                    //создаем структуру html
                    // <tr>
                    //     <th>1</th>
                    //     <td class="income">доход</td>
                    //     <td>зарплата</td>
                    //     <td>500$</td>
                    //     <td>11.09.2022</td>
                    //     <td></td>
                    //     <td>
                    //         <div className="d-flex">
                    //             <a href="#" id="delete-1" data-bs-toggle="modal" data-bs-target="#exampleModal"
                    //                className="me-3"><img src="static/images/trash-icon.png" alt="удалить"></a>
                    //             <a href="#/edit-p&l" id="edit-1"><img src="static/images/pen-icon.png" alt="редактировать"></a>
                    //         </div>
                    //     </td>
                    // </tr>
                    // Перебор каждого объекта в массиве и создание соответствующих элементов таблицы
                    for (i = 0; i < table.length; i++) {
                        item = table[i];
                        row = document.createElement("tr");
                        numberCell = document.createElement("th");
                        numberCell.textContent = i + 1;
                        row.appendChild(numberCell);
                        typeCell = document.createElement("td");
                        if (item.type === 'expense') {
                            typeCell.textContent = 'расход';
                        }
                        else {
                            typeCell.textContent = 'доход';
                        }
                        typeCell.classList.add(item.type); // Добавление класса в соответствии с типом
                        row.appendChild(typeCell);
                        categoryCell = document.createElement("td");
                        categoryCell.textContent = item.category;
                        row.appendChild(categoryCell);
                        amountCell = document.createElement("td");
                        amountCell.textContent = item.amount.toLocaleString('ru-RU') + "$"; //отобразит разделяя тысячи пробелом
                        row.appendChild(amountCell);
                        dateCell = document.createElement("td");
                        parts = item.date.split('-');
                        dateCell.textContent = "".concat(parts[2], ".").concat(parts[1], ".").concat(parts[0]); //из YYYY-MM-DD в DD.MM.YYYY
                        row.appendChild(dateCell);
                        commentCell = document.createElement("td");
                        commentCell.textContent = item.comment;
                        row.appendChild(commentCell);
                        actionsCell = document.createElement("td");
                        actionsDiv = document.createElement("div");
                        actionsDiv.classList.add("d-flex");
                        deleteLink = document.createElement("a");
                        deleteLink.id = "delete-" + item.id;
                        // deleteLink.setAttribute("data-bs-toggle", "modal");
                        // deleteLink.setAttribute("data-bs-target", "#exampleModal");
                        deleteLink.classList.add("me-3");
                        deleteIcon = document.createElement("img");
                        deleteIcon.src = "static/images/trash-icon.png";
                        deleteIcon.alt = "удалить";
                        deleteLink.appendChild(deleteIcon);
                        actionsDiv.appendChild(deleteLink);
                        editLink = document.createElement("a");
                        editLink.id = "edit-" + item.id;
                        editIcon = document.createElement("img");
                        editIcon.src = "static/images/pen-icon.png";
                        editIcon.alt = "редактировать";
                        editLink.appendChild(editIcon);
                        actionsDiv.appendChild(editLink);
                        actionsCell.appendChild(actionsDiv);
                        row.appendChild(actionsCell);
                        // Добавление строки в таблицу
                        tbody.appendChild(row);
                    }
                    this.editElements = document.querySelectorAll('[id^="edit-"]');
                    this.deleteElements = document.querySelectorAll('[id^="delete-"]');
                    this.editElements.forEach(function (element) {
                        element.addEventListener("click", function () {
                            var id = element.id;
                            var number = parseInt(id.split('-')[1]);
                            location.href = '#/edit-p&l?=' + number;
                        });
                    });
                    _loop_1 = function (element) {
                        element.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                            var id, number;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        id = element.id;
                                        number = parseInt(id.split('-')[1]);
                                        return [4 /*yield*/, this.confirmDeleting(number)];
                                    case 1:
                                        _a.sent(); //await заставляет дождаться исполнения, и только потом перейти дальше
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    for (_i = 0, _a = this.deleteElements; _i < _a.length; _i++) {
                        element = _a[_i];
                        _loop_1(element);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    PL.prototype.deleteElement = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/operations/' + id, 'DELETE')];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 5];
                        if (!(result.error || !result)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.showResult(result.message)];
                    case 2:
                        _a.sent();
                        throw new Error(result.message);
                    case 3: return [4 /*yield*/, this.showResult(result)];
                    case 4:
                        _a.sent();
                        location.reload();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log('ошибка' + error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PL.prototype.confirmDeleting = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var deleteButton = document.getElementById('delete');
                        var cancelButton = document.getElementById('cancel');
                        _this.confirmationModal.show();
                        cancelButton.onclick = function () {
                            _this.confirmationModal.hide();
                            resolve(); // Разрешаем обещание после закрытия модального окна
                        };
                        deleteButton.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.confirmationModal.hide();
                                        return [4 /*yield*/, this.deleteElement(id)];
                                    case 1:
                                        _a.sent();
                                        resolve(); // Разрешаем обещание после удаления категории
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        // Обработчик события при закрытии попапа
                        _this.confirmationModal._element.addEventListener('hidden.bs.modal', function () {
                            resolve(); // Разрешаем обещание при закрытии попапа
                        });
                    })];
            });
        });
    };
    PL.prototype.showResult = function (message) {
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
    return PL;
}(show_buttons_1.ShowButtons));
exports.PL = PL;
//# sourceMappingURL=p&l.js.map