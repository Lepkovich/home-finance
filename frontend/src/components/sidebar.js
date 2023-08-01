import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {icons} from "http-server/lib/core/show-dir/styles";

export class Sidebar {
    constructor() {
    }
    static async showSidebar(newActiveMenuItem){
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
        this.previousActiveMenuItem = document.querySelector('.nav-link.active');
        document.querySelector('.sub-menu').style.display = 'none';
        this.previousActiveMenuItem.classList.remove("active");
        console.log('Предыдущий элемент: ' + this.previousActiveMenuItem);


        this.selectedMenuItem = document.getElementById(newActiveMenuItem);
        console.log('Текущий элемент: ' + this.previousActiveMenuItem);


        this.selectedMenuItem.classList.add("active");
        // this.selectedMenuItem.querySelector("a.nav-link").removeAttribute("href");




    }
}