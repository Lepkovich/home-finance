import {CustomHttp} from "../services/custom-http.ts";
import config from "../../config/config";
import {Sidebar} from "./sidebar";

export class EditEarnings {
    constructor() {
        this.saveCategoryButton = document.getElementById('save-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('income-cat')
        this.id = document.location.hash.split('=')[1];
        this.errorText = document.getElementById('invalid-filed-text');


        //определяем параметры модального окна
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        this.categoryField.addEventListener('input', () => {
            this.validateField(this.categoryField.value);
        })

        this.init(this);
    }

    async init(field) {
        await Sidebar.showSidebar('earnings');

        try {
            const result = await CustomHttp.request(config.host + '/categories/income/' + this.id, 'GET',)

            if (result) {
                if (result.error || !result) {
                    await this.showResult(result);
                    throw new Error();
                }
                this.categoryField.value = result.title
                await this.processButtons(result, field);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    async processButtons(category, field) {
        this.cancelCategoryButton.onclick = function () {
            location.href = '#/earnings';
        }

        this.saveCategoryButton.onclick = () => {
            let newCategory = field.categoryField.value;
            this.rewriteCategory(newCategory, category.id);
        }

    }
    async rewriteCategory(title, id){
        if(title && id){
            try {
                const result = await CustomHttp.request(config.host + '/categories/income/' + id, 'PUT',{
                    title: title
                })

                if (result) {
                    if (result.error || !result) {
                        await this.showResult(result.message);
                        throw new Error();
                    }
                    await this.showResult(result);
                    location.href = '#/earnings';
                }

            } catch (error) {
                console.log('ошибка' + error);
            }
        }
    }

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

    async showResult(message) {
        return new Promise((resolve) => {
            this.textMessage = message.error ? message.message :
                "Новое название категории: " + this.categoryField.value + "." + "\nСообщение сервера: " + JSON.stringify(message);

            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

}




