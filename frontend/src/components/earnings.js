import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {ShowCategories} from "../services/show-categories.js";

export class Earnings {
    constructor() {
        this.editCategoryButtons = null;
        this.deleteCategoryButtons = null;

        //определяем параметры модальных окон
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        this.modalMessageField = document.getElementById('textModal-message');
        this.textMessage = null;


        // обрабатываем кнопку меню на sidebar
        const categoriesMenuItem = document.getElementById("categories-menu");
        const subMenu = document.querySelector(".sub-menu");

        categoriesMenuItem.querySelector("a.nav-link").classList.remove("link-body-emphasis");
        categoriesMenuItem.querySelector("a.nav-link").classList.add("active");


        categoriesMenuItem.querySelector("a.nav-link").removeAttribute("href");

        subMenu.style.display = "block";
        const subMenuLink = subMenu.querySelector(".nav-link");
        subMenuLink.removeAttribute("href");
        subMenuLink.classList.add("sub-menu-active");

        this.dataInit();
    }

    async dataInit(){
        await ShowUserBalance.init();
        await this.getCategories();
    }

    async getCategories() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income', 'GET',)

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                await ShowCategories.init(result); //отрисуем карточки категорий
                await this.processCategories();
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    async processCategories() {

        this.editCategoryButtons = document.querySelectorAll('[id^="edit-"]');
        this.deleteCategoryButtons = document.querySelectorAll('[id^="delete-"]');
        this.addCategoryButton = document.getElementById('add-category');

        this.addCategoryButton.onclick = () => {
            location.href = "#/add-earnings"
        };

        this.editCategoryButtons.forEach((element) => {
            element.addEventListener("click", () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                location.href = '#/edit-earnings?=' + number
            });
        });

        for (const element of this.deleteCategoryButtons) {
            element.addEventListener("click", async () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                await this.confirmDeleting(number);
                await this.getCategories();
            });
        }
    }

    async confirmDeleting(categoryId) {
        return new Promise((resolve) => {
            const deleteButton = document.getElementById('delete');
            const cancelButton = document.getElementById('cancel');
            const confirmationText = document.getElementById('confirmationText');

            confirmationText.innerText = 'Вы действительно хотите удалить категорию?'
            this.confirmationModal.show();

            cancelButton.onclick = () => {
                this.confirmationModal.hide();
                resolve(); // Разрешаем обещание после закрытия модального окна
            };

            deleteButton.onclick = async () => {
                this.confirmationModal.hide();
                await this.deleteCategory(categoryId);
                resolve(); // Разрешаем обещание после удаления категории
            };
        });
    }
    async deleteCategory(categoryId){
        if(categoryId){
            try {
                const result = await CustomHttp.request(config.host + '/categories/income/' + categoryId, 'DELETE',)

                if (result) {
                    if (result.error || !result) {
                        await this.showResult(result.error());
                        throw new Error();
                    }
                    await this.showResult(result);
                }
            } catch (error) {
                console.log('ошибка' + error);
            }
        }
    }
    async showResult(message) {
        return new Promise((resolve) => {
            if (message.error) {
                this.textMessage = message.error;
            } else {
                this.textMessage = "Категория успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message);
            }

            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }
}




