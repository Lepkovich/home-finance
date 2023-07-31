import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Sidebar {
    constructor() {
    }
    static async showSidebar(activeMenuItem){
        //получаем баланс и имя пользователя
        let balanceValue = document.getElementById('balance-value');
        let userFullName = document.getElementById('userFullName');
        try {
            const result = await CustomHttp.request(config.host +  '/balance', 'GET')

            if (result) {
                if (result.error || result.balance === undefined) {
                    throw new Error(result.message);
                }
                balanceValue.textContent = result.balance + "$";
                userFullName.textContent = localStorage.getItem('userFullName');
            }

        } catch (error) {
            console.log(error);
            location.href = '#/login';
        }

        // обрабатываем кнопки меню на sidebar
        this.selectedMenuItem = document.getElementById(activeMenuItem);
        // this.mainMenuItem = document.getElementById("main");
        // this.plMenuItem = document.getElementById("p&l");
        // this.categoriesMenuItem = document.getElementById("categories-menu");

        this.selectedMenuItem.querySelector("a.nav-link").classList.remove("link-body-emphasis");
        this.selectedMenuItem.querySelector("a.nav-link").classList.add("active");
        this.selectedMenuItem.querySelector("a.nav-link").removeAttribute("href");
        this.selectedMenuItem.querySelector("img").src = "static/images/home-icon.png";

        // кнопка для p&l
        // const homeMenuItem = document.getElementById("p&l");
        // homeMenuItem.querySelector("a.nav-link").classList.remove("link-body-emphasis");
        // homeMenuItem.querySelector("a.nav-link").classList.add("active");
        //
        // homeMenuItem.querySelector("a.nav-link").removeAttribute("href");
        // const iconElement = homeMenuItem.querySelector("img");
        // iconElement.src = "static/images/p&l-icon-white.png";

    }
}