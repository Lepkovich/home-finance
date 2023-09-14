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
exports.AddExpenses = void 0;
var custom_http_ts_1 = require("../services/custom-http.ts");
var config_1 = __importDefault(require("../../config/config"));
var sidebar_1 = require("./sidebar");
var AddExpenses = /** @class */ (function () {
    function AddExpenses() {
        var _this = this;
        this.saveCategoryButton = document.getElementById('create-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('add-expense-cat');
        this.errorText = document.getElementById('invalid-filed-text');
        //определяем параметры модального окна
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');
        this.cancelCategoryButton.onclick = function () {
            location.href = '#/expenses';
        };
        this.categoryField.addEventListener('input', function () {
            _this.validateField(_this.categoryField.value);
        });
        this.saveCategoryButton.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init(this.categoryField.value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.init();
    }
    AddExpenses.prototype.init = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sidebar_1.Sidebar.showSidebar('expenses')];
                    case 1:
                        _a.sent();
                        if (!title) return [3 /*break*/, 9];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, custom_http_ts_1.CustomHttp.request(config_1.default.host + '/categories/expense/', 'POST', {
                                title: title
                            })];
                    case 3:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 7];
                        if (!(result.error || !result)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.showResult(result.message)];
                    case 4:
                        _a.sent();
                        throw new Error();
                    case 5: return [4 /*yield*/, this.showResult(result)];
                    case 6:
                        _a.sent();
                        location.href = '#/expenses';
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        console.log('ошибка' + error_1);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ;
    AddExpenses.prototype.validateField = function (newCategory) {
        if (newCategory.length === 0) {
            this.errorText.style.display = "flex";
            this.categoryField.classList.add('is-invalid');
            this.saveCategoryButton.classList.add('disabled');
        }
        else {
            this.errorText.style.display = "none";
            this.categoryField.classList.remove('is-invalid');
            this.saveCategoryButton.classList.remove('disabled');
        }
    };
    AddExpenses.prototype.showResult = function (message) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.textMessage = message.error ? message.message :
                "Название категории: " + _this.categoryField.value + "." + "\nСообщение сервера: " + JSON.stringify(message);
            _this.modalMessageField.innerText = _this.textMessage;
            _this.resultModal.show();
            // Обработчик события при закрытии попапа
            _this.resultModal._element.addEventListener('hidden.bs.modal', function () {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    };
    return AddExpenses;
}());
exports.AddExpenses = AddExpenses;
//# sourceMappingURL=add-expenses.js.map