import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class AddEarnings {
    constructor() {
        this.saveCategoryButton = document.getElementById('create-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('add-profit-cat');
        this.errorText = document.getElementById('invalid-filed-text');
        this.confirmationModal = new bootstrap.Modal(document.getElementById('modal-message'));
        this.cancelCategoryButton.onclick = function () {
            location.href = '#/earnings';
        }

        this.categoryField.addEventListener('input', () => {
            this.validateField(this.categoryField.value);
        })

        this.saveCategoryButton.onclick = async () => {
            await this.init(this.categoryField.value);
        }

        const showUserBalance = new ShowUserBalance();
        showUserBalance.init();

    }

    async init(title) {
        if(title){
            try {
                const result = await CustomHttp.request(config.host + '/categories/income/', 'POST',{
                    title: title
                })

                if (result) {
                    if (result.error || !result) {
                        throw new Error();
                    }
                    this.showResult(result);
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
    showResult(message){
        let textMessage = "Создана новая категория дохода " + this.categoryField.value + ". Сообщение сервера: " + message;

        const text = document.getElementById('exampleModalLabel');
        text.innerText = textMessage;
        this.confirmationModal.show();
        return console.log(message);
    }
}




