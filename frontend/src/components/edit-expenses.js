import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class EditExpenses {
    constructor() {
        this.saveCategoryButton = document.getElementById('save-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('expense-cat')
        this.id = document.location.hash.split('=')[1];
        this.confirmationModal = new bootstrap.Modal(document.getElementById('modal-message'));

        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        const that = this;

        this.dataInit(that);

    }

    async dataInit(field){
        await ShowUserBalance.init();
        await this.init(field);
    }

    async init(field) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/expense/' + this.id, 'GET',)

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                this.categoryField.value = result.title
                this.processButtons(result, field);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    async processButtons(category, field) {
        console.log(category);
        console.log(field);
        this.cancelCategoryButton.onclick = function () {
            location.href = '#/expenses';
        }

        this.saveCategoryButton.onclick = () => {
            let newCategory = field.categoryField.value;
            this.rewriteCategory(newCategory, category.id);
            console.log(newCategory, category.id);
        }

    }
    async rewriteCategory(title, id){
        if(title && id){
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense/' + id, 'PUT',{
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
    }
    showResult(message) {
        return new Promise((resolve) => {
            let textMessage = "Новое название категории: " + this.categoryField.value + "." + "\nСообщение сервера: " + JSON.stringify(message);

            const text = document.getElementById('popup-message');
            text.innerText = textMessage;

            this.confirmationModal.show();

            // Обработчик события при закрытии попапа
            this.confirmationModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

}




