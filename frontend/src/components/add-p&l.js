"use strict";
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
exports.AddPL = void 0;
var custom_http_1 = require("../services/custom-http");
var config_1 = __importDefault(require("../../config/config"));
var sidebar_1 = require("./sidebar");
var bootstrap_1 = __importDefault(require("bootstrap"));
var AddPL = /** @class */ (function () {
    function AddPL() {
        this.typeValue = null;
        this.type = document.location.hash.split('=')[1];
        this.fields = [
            {
                name: 'type',
                id: 'type',
                element: null,
                regex: /\S+/,
                valid: true,
            },
            {
                name: 'category',
                id: 'category',
                element: null,
                regex: /\S+/,
                valid: false,
            },
            {
                name: 'sum',
                id: 'sum',
                element: null,
                regex: /^\d+$/,
                valid: false,
            },
            {
                name: 'date',
                id: 'date',
                element: null,
                regex: /\S+/,
                valid: false,
            },
            {
                name: 'comment',
                id: 'comment',
                element: null,
                regex: /\S+/,
                valid: false,
            },
        ];
        var that = this;
        this.fields.forEach(function (item) {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, this);
                };
            }
        });
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.addEventListener('click', this.processForm.bind(this));
        }
        this.cancelElement = document.getElementById('cancel');
        if (this.cancelElement) {
            this.cancelElement.onclick = function () {
                location.href = '#/p&l';
            };
        }
        this.typeElement = document.getElementById('type');
        //определяем параметры модального окна
        var textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            this.resultModal = new bootstrap_1.default.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');
        this.init();
    }
    AddPL.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.type === 'income')) return [3 /*break*/, 9];
                        return [4 /*yield*/, sidebar_1.Sidebar.showSidebar('earnings')];
                    case 1:
                        _a.sent();
                        this.typeValue = 'Доход';
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/categories/income')];
                    case 3:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 6];
                        if (!result.error) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.showResult(result)];
                    case 4:
                        _a.sent();
                        throw new Error(result.message);
                    case 5:
                        this.showCategories(result);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        return [2 /*return*/, console.log(error_1)];
                    case 8: return [3 /*break*/, 17];
                    case 9:
                        this.typeValue = 'Расход';
                        return [4 /*yield*/, sidebar_1.Sidebar.showSidebar('expenses')];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        _a.trys.push([11, 16, , 17]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/categories/expense')];
                    case 12:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 15];
                        if (!result.error) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.showResult(result)];
                    case 13:
                        _a.sent();
                        throw new Error(result.message);
                    case 14:
                        this.showCategories(result);
                        _a.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_2 = _a.sent();
                        return [2 /*return*/, console.log(error_2)];
                    case 17:
                        if (this.typeElement) {
                            this.typeElement.value = this.typeValue;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    AddPL.prototype.showCategories = function (categories) {
        // Получение ссылки на элемент <select>
        var selectElement = document.getElementById("category");
        if (selectElement) {
            // Создание строк <option> на основе массива categories
            categories.forEach(function (category) {
                var optionElement = document.createElement("option");
                optionElement.value = category.id.toString();
                optionElement.textContent = category.title;
                selectElement.appendChild(optionElement);
            });
        }
    };
    AddPL.prototype.validateField = function (field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            field.valid = false;
            element.classList.add('is-invalid');
            if (element instanceof HTMLInputElement && element.validationMessag) {
                var nextElement = element.nextElementSibling;
                if (nextElement instanceof HTMLElement) {
                    nextElement.innerText = element.validationMessage;
                }
            }
            if (element.nextElementSibling) {
                element.nextElementSibling.style.display = "flex";
            }
        }
        else {
            field.valid = true;
            element.classList.remove('is-invalid');
            element.nextElementSibling.style.display = "none";
        }
        this.validateForm();
    };
    ;
    AddPL.prototype.validateForm = function () {
        var validForm = this.fields.every(function (item) { return item.valid; });
        if (validForm && this.processElement) {
            this.processElement.classList.remove('disabled');
        }
        else if (this.processElement) {
            this.processElement.classList.add('disabled');
        }
        return validForm;
    };
    ;
    AddPL.prototype.processForm = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var values_1, amount, date, comment, categoryId, result, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        if (!this.validateForm()) return [3 /*break*/, 8];
                        values_1 = {};
                        ['sum', 'date', 'comment', 'category'].forEach(function (fieldName) {
                            var field = _this.fields.find(function (item) { return item.name === fieldName; });
                            if (field && field.element) {
                                values_1[fieldName] = field.element.value;
                            }
                        });
                        amount = values_1['sum'];
                        date = values_1['date'];
                        comment = values_1['comment'];
                        categoryId = values_1['category'];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/operations', 'POST', {
                                type: this.type,
                                amount: amount,
                                date: date,
                                comment: comment,
                                category_id: parseInt(categoryId)
                            })];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 6];
                        if (!result.error) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.showResult(result)];
                    case 3:
                        _a.sent();
                        throw new Error(result.message);
                    case 4: return [4 /*yield*/, this.showResult(result)];
                    case 5:
                        _a.sent();
                        location.href = '#/p&l';
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        return [2 /*return*/, console.log(error_3)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AddPL.prototype.showResult = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.textMessage = message.error ? message.message :
                            "Запись успешно добавлена." + "\nСообщение сервера: " + JSON.stringify(message);
                        if (_this.modalMessageField) {
                            _this.modalMessageField.innerText = _this.textMessage;
                        }
                        _this.resultModal.show();
                        // Обработчик события при закрытии попапа
                        _this.resultModal._element.addEventListener('hidden.bs.modal', function () {
                            resolve(); // Разрешаем обещание при закрытии попапа
                        });
                    })];
            });
        });
    };
    return AddPL;
}());
exports.AddPL = AddPL;
//# sourceMappingURL=add-p&l.js.map