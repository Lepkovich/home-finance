import {CustomHttp} from "../services/custom-http.ts";
import config from "../../config/config";
import {Sidebar} from "./sidebar";

export class AddEarnings {
    constructor() {
        this.saveCategoryButton = document.getElementById('create-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('add-profit-cat');
        this.errorText = document.getElementById('invalid-filed-text');

        //определяем параметры модального окна
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        this.cancelCategoryButton.onclick = function () {
            location.href = '#/earnings';
        }

        this.categoryField.addEventListener('input', () => {
            this.validateField(this.categoryField.value);
        })

        this.saveCategoryButton.onclick = async () => {
            await this.init(this.categoryField.value);
        }

        this.init();

    }

    async init(title) {
        await Sidebar.showSidebar('earnings');

        if(title){
            try {
                const result = await CustomHttp.request(config.host + '/categories/income/', 'POST',{
                    title: title
                })

                if (result) {
                    if (result.error || !result) {
                        throw new Error();
                    }
                    await this.showResult(result);
                    location.href = '#/earnings';
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


    async showResult(message) {
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




