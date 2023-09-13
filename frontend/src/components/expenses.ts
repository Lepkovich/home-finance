import {CustomHttp} from "../services/custom-http.ts";
import config from "../../config/config";
import {ShowCategories} from "../services/show-categories.ts";
import {Sidebar} from "./sidebar";

export class Expenses {
    constructor() {
        this.editCategoryButtons = null;
        this.deleteCategoryButtons = null;

        //определяем параметры модальных окон
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        this.modalMessageField = document.getElementById('textModal-message');
        this.textMessage = null;

        this.getCategories();

    }

    async getCategories() {
        await Sidebar.showSidebar('expenses');

        try {
            const result = await CustomHttp.request(config.host + '/categories/expense', 'GET',)

            if (result) {
                if (result.error || !result) {
                    await this.showResult(result.message);
                    throw new Error(result.message);
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
            location.href = "#/add-expenses";
        };

        this.editCategoryButtons.forEach((element) => {
            element.addEventListener("click", () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                location.href = '#/edit-expenses?=' + number
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
                const result = await CustomHttp.request(config.host + '/categories/expense/' + categoryId, 'DELETE',)

                if (result) {
                    if (result.error || !result) {
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
            this.textMessage = message.error ? message.message :
                "Категория успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message);

            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }
}




