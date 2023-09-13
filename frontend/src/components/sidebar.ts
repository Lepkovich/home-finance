import {CustomHttp} from "../services/custom-http.ts";
import config from "../../config/config";

export class Sidebar {
    constructor() {
    }
    static async showSidebar(newActiveMenuItem){
        document.getElementById('sidebar').style.display = 'flex';
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
        this.previousActiveMenuItem = document.querySelector('.active');
        this.previousActiveMenuItem.classList.remove("active");
        this.categoriesElement = document.getElementById('categories');
        this.categoriesSubmenu = document.querySelector('.sub-menu');


        this.selectedMenuItem = document.getElementById(newActiveMenuItem);
        this.selectedMenuItem.classList.add("active");
        if (newActiveMenuItem === 'pl' || newActiveMenuItem === 'main') {
            this.categoriesSubmenu.style.display = 'none';
            this.categoriesElement.classList.remove('open');

        } else {
            this.categoriesSubmenu.style.display = 'block';
            this.categoriesElement.classList.add('open');
        }
    }
}