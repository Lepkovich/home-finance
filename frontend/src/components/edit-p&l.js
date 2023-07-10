import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {ShowUserBalance} from "../services/show-user-balance.js";

export class EditPL {
    constructor() {

        this.id = document.location.hash.split('=')[1];
        this.typeValue =null;
        this.fields = [
            {
                name: 'type',
                id: 'type',
                element: null,
                regex: /\S+/, // проверка на непустое значение
                valid: true,
            },
            {
                name: 'category',
                id: 'category',
                element: null,
                regex: /\S+/, // проверка на непустое значение
                valid: true,
            },
            {
                name: 'amount',
                id: 'amount',
                element: null,
                regex: /^\d+$/, //только цифры
                valid: true,
            },
            {
                name: 'date',
                id: 'date',
                element: null,
                regex: /\S+/, // проверка на непустое значение
                valid: true,
            },
            {
                name: 'comment',
                id: 'comment',
                element: null,
                regex: /\S+/, // проверка на непустое значение
                valid: true,
            },
        ];
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        });
        this.processElement = document.getElementById('process');
        this.cancelElement = document.getElementById('cancel');
        this.cancelElement.onclick = function () {
            location.href = '#/p&l';
        }
        this.processElement.addEventListener('click', this.processForm.bind(this));

        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        this.init();
    }

    async init() {

        try {
            const result = await CustomHttp.request(config.host + '/operations/' + this.id )

            if (result) {
                if (result.error) {
                    this.showError(result.message);
                    throw new Error(result.message);
                }
                await this.fillFields(result);
            }
        } catch (error) {
            return console.log(error);
        }
    }

    async fillFields(fields) {
        try {
            if (fields.type === 'income') {
                this.typeValue = 'income';
                const result = await CustomHttp.request(config.host + '/categories/income');
                if (result && !result.error) {
                    this.showCategories(result);
                }
            } else {
                this.typeValue = 'expense';
                const result = await CustomHttp.request(config.host + '/categories/expense');
                if (result && !result.error) {
                    this.showCategories(result);
                }
            }

            for (const key in fields) {
                if (fields.hasOwnProperty(key)) {
                    const field = document.getElementById(key);
                    if (field) {
                        if (field.tagName === 'SELECT') {
                            // Для элемента <select>
                            const options = field.options;
                            for (let i = 0; i < options.length; i++) { //пройдемся по всем options
                                const option = options[i];
                                if (option.textContent.trim() === fields[key]) { //и сравним текстовые значения {"id": 2, "title": "Жилье"}
                                    field.selectedIndex = i; //и подставим индекс того, с которым мы перешли на страницу  {category:"Жилье"}
                                    break;
                                }
                            }
                        } else {
                            // для полей input просто добавим value
                            if(fields[key] === 'income'){
                                fields[key] = 'Доход';
                            } else if(fields[key] === 'expense'){
                                fields[key] = 'Расход'
                            }
                            field.value = fields[key];
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    showCategories(categories) {
        // Получение ссылки на элемент <select>
        const selectElement = document.getElementById("category");

// Создание строк <option> на основе массива categories
        categories.forEach(function (category) {
            const optionElement = document.createElement("option");
            optionElement.value = category.id;
            optionElement.textContent = category.title;
            selectElement.appendChild(optionElement);
        });
    }


    validateField(field, element) {

        if (!element.value || !element.value.match(field.regex)) {
            field.valid = false;
            element.classList.add('is-invalid');
            if (element.validationMessage) {
                element.nextElementSibling.innerText = element.validationMessage;
            }
            element.nextElementSibling.style.display = "flex";
        } else {
            field.valid = true;
            element.classList.remove('is-invalid');
            element.nextElementSibling.style.display = "none";
        }

        this.validateForm();
    };

    validateForm() {

        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.classList.remove('disabled');
        } else {
            this.processElement.classList.add('disabled');
        }
        return validForm;
    };

    async processForm(event) {
        event.preventDefault();
        if (this.validateForm()) {

            //     "type": "expense",
            //     "amount": 150,
            //     "date": "2022-02-02",
            //     "comment": "wtf",
            //     "category_id": 3


            const type = this.typeValue;
            const amount = this.fields.find(item => item.name === 'amount').element.value;
            const date = this.fields.find(item => item.name === 'date').element.value;
            const comment = this.fields.find(item => item.name === 'comment').element.value;
            const categoryId = this.fields.find(item => item.name === 'category').element.value;

            try {
                const result = await CustomHttp.request(config.host + '/operations/' + this.id, 'PUT', {
                    type: type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: parseInt(categoryId)
                })

                if (result) {
                    if (result.error) {
                        this.showError(result.message);
                        throw new Error(result.message);
                    }
                    this.showResult(result);
                    location.href = '#/p&l';
                }
            } catch (error) {
                return console.log(error);
            }

        }
    }

    showError(message) {
        const myModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            backdrop: true
        });
        const text = document.getElementById('error-message');
        text.innerText = message;
        myModal.show(myModal);
        return console.log(message);
    };

    showResult(message) {

        let textMessage = "Изменена запись от " + message.date + " c категорией " + message.category + " на сумму $" + message.amount + " с комментарием " + message.comment;
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
            backdrop: true
        });
        const text = document.getElementById('confirmation-message');
        text.innerText = textMessage;
        confirmModal.show(confirmModal);
        return console.log(message);
    }

}