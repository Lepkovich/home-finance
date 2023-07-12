import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class EditEarnings {
    constructor() {
        this.saveCategoryButton = document.getElementById('save-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('income-cat')
        this.id = document.location.hash.split('=')[1];

        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        const that = this;

        this.init(that);
    }

    async init(field) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income/' + this.id, 'GET',)

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
                const result = await CustomHttp.request(config.host + '/categories/income/' + id, 'PUT',{
                    title: title
                })

                if (result) {
                    if (result.error || !result) {
                        throw new Error();
                    }
                    location.href = '#/earnings';
                }

            } catch (error) {
                console.log('ошибка' + error);
            }
        }
    }

}




