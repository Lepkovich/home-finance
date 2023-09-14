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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var form_1 = require("./components/form");
var main_1 = require("./components/main");
var p_l_1 = require("./components/p&l");
var auth_1 = require("./services/auth");
var add_p_l_1 = require("./components/add-p&l");
var edit_p_l_1 = require("./components/edit-p&l");
var earnings_1 = require("./components/earnings");
var expenses_1 = require("./components/expenses");
var edit_expenses_1 = require("./components/edit-expenses");
var edit_earnings_1 = require("./components/edit-earnings");
var add_earnings_1 = require("./components/add-earnings");
var add_expenses_1 = require("./components/add-expenses");
var Router = /** @class */ (function () {
    function Router() {
        this.sidebarElement = document.getElementById('sidebar');
        this.contentElement = document.getElementById('content');
        this.popupElement = document.getElementById('popup');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('title');
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: function () {
                    new main_1.Main();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login.css',
                load: function () {
                    new form_1.Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: function () {
                    new form_1.Form('login');
                }
            },
            {
                route: '#/p&l',
                title: 'Доходы и расходы',
                template: 'templates/p&l.html',
                styles: 'styles/main.css',
                load: function () {
                    new p_l_1.PL();
                }
            },
            {
                route: '#/edit-p&l',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-p&l.html',
                styles: 'styles/main.css',
                load: function () {
                    new edit_p_l_1.EditPL();
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расхода',
                template: 'templates/edit-expenses.html',
                styles: 'styles/main.css',
                load: function () {
                    new edit_expenses_1.EditExpenses();
                }
            },
            {
                route: '#/edit-earnings',
                title: 'Редактировать категорию дохода',
                template: 'templates/edit-earnings.html',
                styles: 'styles/main.css',
                load: function () {
                    new edit_earnings_1.EditEarnings();
                }
            },
            {
                route: '#/earnings',
                title: 'Доходы',
                template: 'templates/earnings.html',
                styles: 'styles/main.css',
                load: function () {
                    new earnings_1.Earnings();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/main.css',
                load: function () {
                    new expenses_1.Expenses();
                }
            },
            {
                route: '#/add-p&l',
                title: 'Создание дохода',
                template: 'templates/add-p&l.html',
                styles: 'styles/main.css',
                load: function () {
                    new add_p_l_1.AddPL();
                }
            },
            {
                route: '#/add-expenses',
                title: 'Создание категории расходов',
                template: 'templates/add-expenses.html',
                styles: 'styles/main.css',
                load: function () {
                    new add_expenses_1.AddExpenses();
                }
            },
            {
                route: '#/add-earnings',
                title: 'Создание категории доходов',
                template: 'templates/add-earnings.html',
                styles: 'styles/main.css',
                load: function () {
                    new add_earnings_1.AddEarnings();
                }
            },
        ];
    }
    Router.prototype.openRoute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var urlRoute, result, newRoute, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        urlRoute = window.location.hash.split('?')[0];
                        if (!(urlRoute === '#/logout')) return [3 /*break*/, 2];
                        return [4 /*yield*/, auth_1.Auth.logOut()];
                    case 1:
                        result = _e.sent();
                        if (result) {
                            window.location.href = '#/login';
                            return [2 /*return*/];
                        }
                        _e.label = 2;
                    case 2:
                        newRoute = this.routes.find(function (item) {
                            return item.route === urlRoute;
                        });
                        if (!!newRoute) return [3 /*break*/, 3];
                        window.location.href = '#/login';
                        return [2 /*return*/];
                    case 3:
                        if (!(urlRoute === '#/login' || urlRoute === '#/signup')) return [3 /*break*/, 6];
                        this.sidebarElement.style.display = 'none';
                        this.contentElement.style.display = 'contents';
                        _a = this.contentElement;
                        return [4 /*yield*/, fetch(newRoute.template).then(function (response) { return response.text(); })];
                    case 4:
                        _a.innerHTML = _e.sent();
                        _b = this.popupElement;
                        return [4 /*yield*/, fetch('templates/modal.html').then(function (response) { return response.text(); })];
                    case 5:
                        _b.innerHTML = _e.sent();
                        this.stylesElement.setAttribute('href', newRoute.styles);
                        this.titleElement.innerText = newRoute.title;
                        newRoute.load();
                        return [2 /*return*/];
                    case 6:
                        _c = this.popupElement;
                        return [4 /*yield*/, fetch('templates/modal.html').then(function (response) { return response.text(); })];
                    case 7:
                        _c.innerHTML = _e.sent();
                        _d = this.contentElement;
                        return [4 /*yield*/, fetch(newRoute.template).then(function (response) { return response.text(); })];
                    case 8:
                        _d.innerHTML = _e.sent();
                        this.stylesElement.setAttribute('href', newRoute.styles);
                        this.titleElement.innerText = newRoute.title;
                        newRoute.load();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map