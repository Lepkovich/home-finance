import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebar} from "./sidebar.js";

export class AddExpenses {
    constructor() {
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
        }

        this.categoryField.addEventListener('input', () => {
            this.validateField(this.categoryField.value);
        })

        this.saveCategoryButton.onclick = async () => {
            await this.init(this.categoryField.value);
        }

        // обрабатываем кнопку меню на sidebar
        // const categoriesMenuItem = document.getElementById("categories-menu");
        // const subMenu = document.querySelector(".sub-menu");
        //
        // categoriesMenuItem.querySelector("a.nav-link").classList.remove("link-body-emphasis");
        // categoriesMenuItem.querySelector("a.nav-link").classList.add("active");
        //
        //
        // categoriesMenuItem.querySelector("a.nav-link").removeAttribute("href");
        //
        // subMenu.style.display = "block";
        // const subMenuLink = subMenu.querySelector(".expenses");
        // subMenuLink.removeAttribute("href");
        // subMenuLink.classList.add("sub-menu-active");

        this.dataInit();
    }

    async dataInit(){
        // await ShowUserBalance.init();
        await Sidebar.showSidebar('expenses');

    }

    async init(title) {
        if(title){
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense/', 'POST',{
                    title: title
                })

                if (result) {
                    if (result.error || !result) {
                        throw new Error();
                    }
                    await this.showResult(result);
                    location.href = '#/expenses';
                }

            } catch (error) {
                console.log('ошибка' + error);
            }
        }

    };

    validateField(newCategory) {
        if (newCategory.length === 0) {
            this.errorText.style.display = "flex";
            this.categoryField.classList.add('is-invalid');
            this.saveCategoryButton.classList.add('disabled');
        } else {
            this.errorText.style.display = "none";
            this.categoryField.classList.remove('is-invalid');
            this.saveCategoryButton.classList.remove('disabled');
        }
    }
    showResult(message) {
        return new Promise((resolve) => {
            this.textMessage = message.error ? message.message :
                "Название категории: " + this.categoryField.value + "." + "\nСообщение сервера: " + JSON.stringify(message);


            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }
}




