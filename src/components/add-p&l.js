import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebar} from "./sidebar.js";

export class AddPL {
    constructor() {

        this.typeValue = null;
        this.type = document.location.hash.split('=')[1];
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
                valid: false,
            },
            {
                name: 'sum',
                id: 'sum',
                element: null,
                regex: /^\d+$/, //только цифры
                valid: false,
            },
            {
                name: 'date',
                id: 'date',
                element: null,
                regex: /\S+/, // проверка на непустое значение
                valid: false,
            },
            {
                name: 'comment',
                id: 'comment',
                element: null,
                regex: /\S+/, // проверка на непустое значение
                valid: false,
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
        this.typeElement = document.getElementById('type');

        //определяем параметры модального окна
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        this.cancelElement.onclick = function () {
            location.href = '#/p&l';
        }
        this.processElement.addEventListener('click', this.processForm.bind(this));



        this.init();
    }

    async init() {
        if (this.type === 'income') {
            await Sidebar.showSidebar('earnings');
            this.typeValue = 'Доход';
            try {
                const result = await CustomHttp.request(config.host + '/categories/income')

                if (result) {
                    if (result.error) {
                        await this.showResult(result.message);
                        throw new Error(result.message);
                    }
                    this.showCategories(result);
                }
            } catch (error) {
                return console.log(error);
            }

        } else {
            this.typeValue = 'Расход';
            await Sidebar.showSidebar('expenses');
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense')

                if (result) {
                    if (result.error) {
                        await this.showResult(result.message);
                        throw new Error(result.message);
                    }
                    this.showCategories(result);
                }
            } catch (error) {
                return console.log(error);
            }
        }
        this.typeElement.value = this.typeValue;
    };

    showCategories(categories){
        // Получение ссылки на элемент <select>
        const selectElement = document.getElementById("category");

// Создание строк <option> на основе массива categories
        categories.forEach(function(category) {
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

                // "type": "income",
                // "amount": 250,
                // "date": "2022-01-01",
                // "comment": "new comment",
                // "category_id": 2

            const amount = this.fields.find(item => item.name === 'sum').element.value;
            const date = this.fields.find(item => item.name === 'date').element.value;
            const comment = this.fields.find(item => item.name === 'comment').element.value;
            const categoryId = this.fields.find(item => item.name === 'category').element.value;

            try {
                const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                    type: this.type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: parseInt(categoryId)
                })

                if (result) {
                    if (result.error) {
                        await this.showResult(result.message);
                        throw new Error(result.message);
                    }
                    await this.showResult(result);
                    location.href = '#/p&l';
                }
            } catch (error) {
                return console.log(error);
            }

        }
    }

    async showResult(message) {
        return new Promise((resolve) => {
            this.textMessage = message.error ? message.message :
                "Запись успешно добавлена." + "\nСообщение сервера: " + JSON.stringify(message);


            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

}