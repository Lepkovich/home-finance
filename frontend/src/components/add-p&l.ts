import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import {FieldsType} from "../types/fields.type";
import bootstrap, {Modal} from "bootstrap";
import {
    GetCategoryExpenseType,
    GetCategoryIncomeType,
    GetErrorResponseType,
    PostOperationResponseType
} from "../types/backend-response.type";

export class AddPL {
    private typeValue: string | null;
    private readonly type: string;
    private fields: FieldsType[];
    private readonly processElement: HTMLElement | null;
    private readonly cancelElement: HTMLElement | null;
    private readonly typeElement: HTMLElement | null;
    private resultModal!: Modal;
    private textMessage: string | null;
    private readonly modalMessageField: HTMLElement | null;

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
        const that: AddPL = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }
        });
        // this.processForm = this.processForm.bind(this);
        this.processElement = document.getElementById('process') as HTMLElement;
        if (this.processElement) {
            // this.processElement.onclick = function () {
            //     that.processForm();
            // }
            this.processElement.addEventListener('click', this.processForm);
        }
        this.cancelElement = document.getElementById('cancel');
        if (this.cancelElement) {
            this.cancelElement.onclick = function () {
                location.href = '#/p&l';
            }
        }

        this.typeElement = document.getElementById('type');


        //определяем параметры модального окна
        const textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            this.resultModal = new bootstrap.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        this.init();
    }

    private async init(): Promise<void> {
        if (this.type === 'income') {
            await Sidebar.showSidebar('earnings');
            this.typeValue = 'Доход';
            try {
                const result: GetErrorResponseType | GetCategoryIncomeType[] = await CustomHttp.request(config.host + '/categories/income')

                if (result) {
                    if ((result as GetErrorResponseType).error) {
                        await this.showResult(result as GetErrorResponseType);
                        throw new Error((result as GetErrorResponseType).message);
                    }
                    this.showCategories(result as GetCategoryIncomeType[]);
                }
            } catch (error) {
                return console.log(error);
            }

        } else {
            this.typeValue = 'Расход';
            await Sidebar.showSidebar('expenses');
            try {
                const result: GetErrorResponseType | GetCategoryIncomeType[] = await CustomHttp.request(config.host + '/categories/expense')

                if (result) {
                    if ((result as GetErrorResponseType).error) {
                        await this.showResult(result as GetErrorResponseType);
                        throw new Error((result as GetErrorResponseType).message);
                    }
                    this.showCategories(result as GetCategoryIncomeType[]);
                }
            } catch (error) {
                return console.log(error);
            }
        }
        if (this.typeElement) {
            (this.typeElement as HTMLInputElement).value = this.typeValue;
        }
    };

    private showCategories(categories: GetCategoryExpenseType[]){
        // Получение ссылки на элемент <select>
        const selectElement = document.getElementById("category");

        if (selectElement) {
            // Создание строк <option> на основе массива categories
            categories.forEach(function(category) {
                const optionElement: HTMLElement = document.createElement("option");
                (optionElement as HTMLInputElement).value = category.id.toString();
                optionElement.textContent = category.title;
                selectElement.appendChild(optionElement);
            });
        }
    }


    private validateField(field: FieldsType , element: HTMLElement) {

        if (!(element as HTMLInputElement).value || !(element as HTMLInputElement).value.match(field.regex!)) {
            field.valid = false;
            element.classList.add('is-invalid');
            if (element instanceof HTMLInputElement && element.validationMessage) {
                const nextElement = element.nextElementSibling;
                if (nextElement instanceof HTMLElement) {
                    nextElement.innerText = element.validationMessage;
                }
            }
            if (element.nextElementSibling) {
                (element.nextElementSibling as HTMLElement).style.display = "flex";
            }
        } else {
            field.valid = true;
            element.classList.remove('is-invalid');
            (element.nextElementSibling as HTMLElement).style.display = "none";
        }

        this.validateForm();
    };

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm && this.processElement) {
            this.processElement.classList.remove('disabled');
        } else if (this.processElement) {
            this.processElement.classList.add('disabled');
        }
        return validForm;
    };

    private async processForm(event: MouseEvent): Promise<void> {
        event.preventDefault();
        if (this.validateForm()) {

                // "type": "income",
                // "amount": 250,
                // "date": "2022-01-01",
                // "comment": "new comment",
                // "category_id": 2

            // предыдущий код на JS
            // const amount = this.fields.find(item => item.name === 'sum').element.value;
            // const date = this.fields.find(item => item.name === 'date').element.value;
            // const comment = this.fields.find(item => item.name === 'comment').element.value;
            // const categoryId = this.fields.find(item => item.name === 'category').element.value;

            // реализация на TS:
            const values: Record<string, string> = {};

            ['sum', 'date', 'comment', 'category'].forEach(fieldName => {
                const field = this.fields.find(item => item.name === fieldName);
                if (field && field.element) {
                    values[fieldName] = (field.element as HTMLInputElement).value;
                }
            });

// Теперь объект `values` содержит значения всех полей, где ключи - это имена полей, а значения - их значения
            const amount = values['sum'];
            const date = values['date'];
            const comment = values['comment'];
            const categoryId = values['category'];



            try {
                const result: GetErrorResponseType | PostOperationResponseType = await CustomHttp.request(config.host + '/operations', 'POST', {
                    type: this.type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: parseInt(categoryId)
                })

                if (result) {
                    if ((result as GetErrorResponseType).error) {
                        await this.showResult(result as GetErrorResponseType);
                        throw new Error((result as GetErrorResponseType).message);
                    }
                    await this.showResult(result as PostOperationResponseType);
                    location.href = '#/p&l';
                }
            } catch (error) {
                return console.log(error);
            }

        }
    }

    private async showResult(message: GetErrorResponseType | PostOperationResponseType): Promise<void> {
        return new Promise((resolve) => {
            this.textMessage = (message as GetErrorResponseType).error ? (message as GetErrorResponseType).message :
                "Запись успешно добавлена." + "\nСообщение сервера: " + JSON.stringify(message);


            if (this.modalMessageField) {
                this.modalMessageField.innerText = this.textMessage;
            }

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            addEventListener('click', () => {
                this.resultModal.hide();
                resolve(); // Разрешаем обещание при закрытии попапа
            });
            // this.resultModal._element.addEventListener('hidden.bs.modal', () => {
            //     resolve(); // Разрешаем обещание при закрытии попапа
            // });
        });
    }

}