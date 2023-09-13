"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./router");
var App = /** @class */ (function () {
    function App() {
        this.router = new router_1.Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }
    App.prototype.handleRouteChanging = function () {
        this.router.openRoute();
    };
    return App;
}());
(new App());
