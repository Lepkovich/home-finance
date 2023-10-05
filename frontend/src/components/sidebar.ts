import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {GetBalanceResponseType, GetErrorResponseType} from "../types/backend-response.type";

export class Sidebar {
    private static sidebarElement: HTMLElement | null;
    private static previousActiveMenuItem: HTMLElement | null;
    private static categoriesElement: HTMLElement | null;
    private static categoriesSubmenu: HTMLElement | null;
    private static selectedMenuItem: HTMLElement | null;
    private static userExitLink: HTMLElement | null;
    private static userExitField: HTMLElement | null;


    constructor() {
    }

    static async showSidebar(newActiveMenuItem: string): Promise<void>{
        this.sidebarElement = document.getElementById('sidebar');
        if (this.sidebarElement) {
            this.sidebarElement.style.display = 'flex';
        }
        //получаем поля баланса и имени пользователя
        let balanceValue = document.getElementById('balance-value');
        let userFullName = document.getElementById('userFullName');
        try {
            const result: GetBalanceResponseType | GetErrorResponseType = await CustomHttp.request(config.host +  '/balance', 'GET')

            if (result) {

                if ((result as GetErrorResponseType).error) {
                    throw new Error((result as GetErrorResponseType).message);
                }
                if (balanceValue && userFullName) {
                    balanceValue.textContent = (result as GetBalanceResponseType).balance + "$";
                    userFullName.textContent = localStorage.getItem('userFullName');
                }
            }

        } catch (error) {
            console.log(error);
            location.href = '#/login';
        }

        // обрабатываем клик по имени пользователя
        this.userExitField = document.getElementById('dropUp')
        this.userExitLink = document.querySelector('.exit');
        if (this.userExitLink && this.userExitField) {
            (this.userExitLink as HTMLElement).style.display = 'none';

            this.userExitField.onclick = () => {
                (this.userExitLink as HTMLElement).style.display = 'block';
            }

        }

        // обрабатываем кнопки меню на sidebar
        this.previousActiveMenuItem = document.querySelector('.active');
        if (this.previousActiveMenuItem) {
            this.previousActiveMenuItem.classList.remove("active");
        }



        this.selectedMenuItem = document.getElementById(newActiveMenuItem);
        if (this.selectedMenuItem) {
            this.selectedMenuItem.classList.add("active");
        }

        this.categoriesElement = document.getElementById('categories');
        this.categoriesSubmenu = document.querySelector('.sub-menu');

        if(this.categoriesElement && this.categoriesSubmenu) {
            if (newActiveMenuItem === 'pl' || newActiveMenuItem === 'main') {
                this.categoriesSubmenu.style.display = 'none';
                this.categoriesElement.classList.remove('open');

            } else {
                this.categoriesSubmenu.style.display = 'block';
                this.categoriesElement.classList.add('open');
            }
        }
    }
}