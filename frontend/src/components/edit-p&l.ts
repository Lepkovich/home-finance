import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import {FieldsType} from "../types/fields.type";
// import bootstrap, {Modal} from "bootstrap";
import * as bootstrap from "bootstrap";
import {GetCategoryIncomeType, GetErrorResponseType, GetOperationsPeriodType} from "../types/backend-response.type";

export class EditPL {
    private readonly id: string;
    private typeValue: string | null;
    private fields: FieldsType[];
    private resultModal!: bootstrap.Modal;
    private textMessage: string | null;
    private readonly modalMessageField: HTMLElement | null;
    private readonly cancelElement: HTMLElement | null;
    private readonly processElement: HTMLElement | null;

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
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = function () {
                that.validateField.call(that, item, <HTMLInputElement>this)
            }
        });

        //определяем параметры модального окна
        const textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            this.resultModal = new bootstrap.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');


        this.cancelElement = document.getElementById('cancel');
        if (this.cancelElement) {
            this.cancelElement.onclick = function () {
                location.href = '#/p&l';
            }
        }


        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.addEventListener('click', this.processForm.bind(this));

        }

        this.init();
    }

    async init() {

        try {
            const result: GetErrorResponseType | GetOperationsPeriodType = await CustomHttp.request(config.host + '/operations/' + this.id )

            if (result) {
                if ((result as GetErrorResponseType).error) {
                    await this.showResult(result as GetErrorResponseType);
                    throw new Error((result as GetErrorResponseType).message);
                }
                await this.fillFields(result as GetOperationsPeriodType);
            }
        } catch (error) {
            return console.log(error);
        }
    }

    private async fillFields(fields: GetOperationsPeriodType ): Promise<void> {
        try {
            if (fields.type === 'income') {
                this.typeValue = 'income';
                await Sidebar.showSidebar('earnings');
                const result: GetErrorResponseType | GetCategoryIncomeType[] = await CustomHttp.request(config.host + '/categories/income');
                if (result && !(result as GetErrorResponseType).error) {
                    this.showCategories(result as GetCategoryIncomeType[]);
                }
            } else {
                this.typeValue = 'expense';
                await Sidebar.showSidebar('expenses');
                const result: GetErrorResponseType | GetCategoryIncomeType[] = await CustomHttp.request(config.host + '/categories/expense');
                if (result && !(result as GetErrorResponseType).error) {
                    this.showCategories(result as GetCategoryIncomeType[]);
                }
            }

            for (const key in fields) {
                if (fields.hasOwnProperty(key)) {
                    const field = document.getElementById(key);
                    if (field) {
                        if (field.tagName === 'SELECT') {
                            // Для элемента <select>
                            const selectElement = field as HTMLSelectElement; 
                            const options = selectElement.options;
                            for (let i = 0; i < options.length; i++) { //пройдемся по всем options
                                const option = options[i];
                                if (option.textContent && option.textContent.trim() === fields[key]) { //и сравним текстовые значения {"id": 2, "title": "Жилье"}
                                    (field as HTMLSelectElement).selectedIndex = i; //и подставим индекс того, с которым мы перешли на страницу  {category:"Жилье"}
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
                            (field as HTMLInputElement).value = fields[key].toString();
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private showCategories(categories: GetCategoryIncomeType[]): void {
        // Получение ссылки на элемент <select>
        const selectElement = document.getElementById("category");

// Создание строк <option> на основе массива categories
        categories.forEach(function (category) {
            const optionElement: HTMLElement = document.createElement("option");
            (optionElement as HTMLInputElement).value = category.id.toString();
            optionElement.textContent = category.title;
            if (selectElement) {
                selectElement.appendChild(optionElement);
            }
        });
    }


    validateField(field: FieldsType, element: HTMLElement) {

        if (!(element as HTMLInputElement).value || !(element as HTMLInputElement).value.match(field.regex as RegExp)) {
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

    private async processForm(): Promise<void> {
        // event.preventDefault();
        if (this.validateForm()) {

            //     "type": "expense",
            //     "amount": 150,
            //     "date": "2022-02-02",
            //     "comment": "any",
            //     "category_id": 3

            // предыдущий код на JS
            // const type = this.typeValue;
            // const amount = this.fields.find(item => item.name === 'amount').element.value;
            // const date = this.fields.find(item => item.name === 'date').element.value;
            // const comment = this.fields.find(item => item.name === 'comment').element.value;
            // const categoryId = this.fields.find(item => item.name === 'category').element.value;

            // реализация на TS:
            const values: Record<string, string> = {};

            ['amount', 'date', 'comment', 'category'].forEach(fieldName => {
                const field = this.fields.find(item => item.name === fieldName);
                if (field && field.element) {
                    values[fieldName] = (field.element as HTMLInputElement).value;
                }
            });

// Теперь объект `values` содержит значения всех полей, где ключи - это имена полей, а значения - их значения
            const amount = values['amount'];
            const date = values['date'];
            const comment = values['comment'];
            const categoryId = values['category'];


            try {
                const result: GetErrorResponseType | GetOperationsPeriodType = await CustomHttp.request(config.host + '/operations/' + this.id, 'PUT', {
                    type: this.typeValue,
                    amount: parseInt(amount),
                    date: date,
                    comment: comment,
                    category_id: parseInt(categoryId)
                })

                if (result) {
                    if ((result as GetErrorResponseType).error) {
                        await this.showResult(result as GetErrorResponseType);
                        throw new Error((result as GetErrorResponseType).message);
                    }
                    await this.showResult(result as GetOperationsPeriodType);
                    location.href = '#/p&l';
                }
            } catch (error) {
                return console.log(error);
            }

        }
    }

    private async showResult(message: GetErrorResponseType | GetOperationsPeriodType): Promise<void> {
        return new Promise((resolve) => {
            if ((message as GetOperationsPeriodType).date && (message as GetOperationsPeriodType).category && (message as GetOperationsPeriodType).amount && (message as GetOperationsPeriodType).comment) {
                this.textMessage = "Изменена запись от " + (message as GetOperationsPeriodType).date + " c категорией " + (message as GetOperationsPeriodType).category + " на сумму $" + (message as GetOperationsPeriodType).amount + " с комментарием " + (message as GetOperationsPeriodType).comment;
            } else {
                this.textMessage = (message as GetErrorResponseType).message;
            }

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