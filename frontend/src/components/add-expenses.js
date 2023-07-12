import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class AddExpenses {
    constructor() {
        this.saveCategoryButton = document.getElementById('create-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('add-expense-cat');
        this.errorText = document.getElementById('invalid-filed-text');
        this.cancelCategoryButton.onclick = function () {
            location.href = '#/expenses';
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
                const result = await CustomHttp.request(config.host + '/categories/expense/', 'POST',{
                    title: title
                })

                if (result) {
                    if (result.error || !result) {
                        throw new Error();
                    }
                    this.showResult(result);
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
    showResult(message){

        let textMessage = "Создан " + this.typeValue + " от " + message.date + " c категорией " + message.category + " на сумму $" + message.amount + " с комментарием " + message.comment;

        const text = document.getElementById('confirmation-message');
        text.innerText = textMessage;
        confirmModal.show(confirmModal);
        return console.log(message);
    }
}




