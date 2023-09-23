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
exports.Form = void 0;
var custom_http_1 = require("../services/custom-http");
var auth_1 = require("../services/auth");
var config_1 = __importDefault(require("../../config/config"));
var bootstrap_1 = __importDefault(require("bootstrap"));
var Form = /** @class */ (function () {
    function Form(page) {
        //определяем параметры модального окна
        var textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            this.resultModal = new bootstrap_1.default.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');
        this.rememberMeElement = null;
        this.rememberMe = false;
        this.name = null;
        this.lastName = null;
        this.processElement = null;
        this.page = page;
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                /* (?=.*\d)          // should contain at least one digit
                (?=.*[a-z])       // should contain at least one lower case
                (?=.*[A-Z])       // should contain at least one upper case
                [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters  */
                valid: false,
            }
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'name',
                id: 'full-name',
                element: null,
                regex: /^[А-Я][а-я]+\s{1}[А-Я][а-я]+$/,
                valid: false,
            }, {
                name: 'repeat-password',
                id: 'repeat-password',
                element: null,
                valid: false,
            });
        }
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
        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('checkbox');
        }
    }
    Form.prototype.validateField = function (field, element) {
        var _a;
        if (!element.value || !element.value.match(field.regex)) {
            field.valid = false;
            element.classList.add('is-invalid');
            if (element instanceof HTMLInputElement && element.validationMessage) {
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
        if (field.name === 'name') {
            var fullNameElement = (_a = this.fields.find(function (item) { return item.name === 'name'; })) === null || _a === void 0 ? void 0 : _a.element;
            var fullName = fullNameElement === null || fullNameElement === void 0 ? void 0 : fullNameElement.value;
            this.name = fullName.split(" ")[0]; // Имя (до пробела)
            this.lastName = fullName.split(" ")[1]; // Фамилия (после пробела)
        }
        if (field.name === 'repeat-password') {
            var passwordField = this.fields.find(function (item) { return item.name === 'password'; });
            if (passwordField) {
                if (!element.value || element.value !== passwordField.element.value) {
                    field.valid = false;
                    element.classList.add('is-invalid');
                    element.nextElementSibling.style.display = 'flex';
                }
                else {
                    field.valid = true;
                    element.classList.remove('is-invalid');
                    element.nextElementSibling.style.display = "none";
                }
            }
        }
        this.validateForm();
    };
    ;
    Form.prototype.validateForm = function () {
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
    Form.prototype.processForm = function (event) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var emailEmail, email, passwordElement, password, passwordRepeatElement, passwordRepeat, result, error_1, result, userFullName, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        event.preventDefault();
                        if (!this.validateForm()) return [3 /*break*/, 13];
                        emailEmail = (_a = this.fields.find(function (item) { return item.name === 'email'; })) === null || _a === void 0 ? void 0 : _a.element;
                        email = emailEmail.value;
                        passwordElement = (_b = this.fields.find(function (item) { return item.name === 'password'; })) === null || _b === void 0 ? void 0 : _b.element;
                        password = passwordElement.value;
                        if (this.rememberMeElement) {
                            this.rememberMe = this.rememberMeElement.checked;
                        }
                        passwordRepeatElement = (_c = this.fields.find(function (item) { return item.name === 'repeat-password'; })) === null || _c === void 0 ? void 0 : _c.element;
                        passwordRepeat = passwordRepeatElement.value;
                        if (!(this.page === 'signup')) return [3 /*break*/, 6];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/signup', 'POST', {
                                name: this.name,
                                lastName: this.lastName,
                                email: email,
                                password: password,
                                passwordRepeat: passwordRepeat
                            })];
                    case 2:
                        result = _d.sent();
                        if (!result) return [3 /*break*/, 4];
                        if (!(result.error || !result.user)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.showResult(result)];
                    case 3:
                        _d.sent();
                        throw new Error(result.message);
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _d.sent();
                        return [2 /*return*/, console.log(error_1)];
                    case 6:
                        _d.trys.push([6, 12, , 13]);
                        return [4 /*yield*/, custom_http_1.CustomHttp.request(config_1.default.host + '/login', 'POST', {
                                email: email,
                                password: password,
                                rememberMe: this.rememberMe
                            })];
                    case 7:
                        result = _d.sent();
                        if (!result) return [3 /*break*/, 11];
                        if (!result.error) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.showResult(result)];
                    case 8:
                        _d.sent(); //вот тут мы не видим модальное окно
                        throw new Error(result.message);
                    case 9:
                        result.tokens;
                        if (!(!result.error && result.tokens && result.tokens.accessToken && result.tokens.refreshToken && result.user && result.user.name && result.user.lastName && result.user.id)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.showResult(result)];
                    case 10:
                        _d.sent();
                        userFullName = result.user.name + ' ' + result.user.lastName;
                        auth_1.Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        auth_1.Auth.setUserData((result.user.id).toString(), userFullName);
                        location.href = "#/";
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_2 = _d.sent();
                        console.log(error_2);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Form.prototype.showResult = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.textMessage = message.error ? message.message :
                            "Вход под именем " + message.user.name + " успешно выполнен";
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
    return Form;
}());
exports.Form = Form;
//# sourceMappingURL=form.js.map