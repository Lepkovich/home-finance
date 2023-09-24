import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import bootstrap from "bootstrap";
import {GetCategoryExpenseType, GetCategoryIncomeType, GetErrorResponseType} from "../types/backend-response.type";

export class EditExpenses {
    private readonly saveCategoryButton: HTMLElement | null;
    private readonly cancelCategoryButton: HTMLElement | null;
    private readonly categoryField: HTMLElement | null;
    private readonly id: string;
    private errorText: HTMLElement | null;
    private resultModal!: bootstrap.Modal;
    private readonly modalMessageField: HTMLElement | null;
    private textMessage: string | null;
    constructor() {
        this.saveCategoryButton = document.getElementById('save-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('expense-cat')
        this.id = document.location.hash.split('=')[1];
        this.errorText = document.getElementById('invalid-filed-text');


        //определяем параметры модального окна
        const textModalElement = document.getElementById('textModal');
        const confirmationModalElement = document.getElementById('confirmationModal');
        if (textModalElement && confirmationModalElement) {
            this.resultModal = new bootstrap.Modal(textModalElement);
        }
        this.modalMessageField = document.getElementById('textModal-message');
        this.textMessage = null;

        if (this.categoryField) {
            this.categoryField.addEventListener('input', () => {
                this.validateField((this.categoryField as HTMLInputElement).value);
            })
        }

        this.init(this);
    }

    async init(field: EditExpenses) {
        await Sidebar.showSidebar('expenses');
        try {
            const result: GetErrorResponseType | GetCategoryExpenseType = await CustomHttp.request(config.host + '/categories/expense/' + this.id, 'GET',)

            if (result) {
                if ((result as GetErrorResponseType).error || !result) {
                    await this.showResult(result);
                    throw new Error((result as GetErrorResponseType).message);
                }
                if (this.categoryField) {
                    (this.categoryField as HTMLInputElement).value = (result as GetCategoryIncomeType).title
                }
                await this.processButtons(result as GetCategoryExpenseType, field);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    private async processButtons(category: GetCategoryExpenseType , field: EditExpenses) {
        if (this.cancelCategoryButton) {
            this.cancelCategoryButton.onclick = function () {
                location.href = '#/expenses';
            }
        }

        if (this.saveCategoryButton) {
            this.saveCategoryButton.onclick = () => {
                let newCategory = (field.categoryField as HTMLInputElement).value;
                this.rewriteCategory(newCategory, category.id);
            }
        }
    }
    private async rewriteCategory(title: string, id: number): Promise<void> {
        if(title && id){
            try {
                const result: GetErrorResponseType | GetCategoryExpenseType = await CustomHttp.request(config.host + '/categories/expense/' + id, 'PUT',{
                    title: title
                })

                if (result) {
                    if ((result as GetErrorResponseType).error || !result) {
                        await this.showResult(result as GetCategoryExpenseType);
                        throw new Error((result as GetErrorResponseType).message);
                    }
                    await this.showResult(result as GetCategoryExpenseType);
                    location.href = '#/expenses';
                }
            } catch (error) {
                console.log('ошибка' + error);
            }
        }
    }

    private validateField(newCategory: string) {
        if (newCategory.length === 0) {
            (this.errorText as HTMLElement).style.display = "flex";
            (this.categoryField as HTMLElement).classList.add('is-invalid');
            (this.saveCategoryButton as HTMLElement).classList.add('disabled');
        } else {
            (this.errorText as HTMLElement).style.display = "none";
            (this.categoryField as HTMLElement).classList.remove('is-invalid');
            (this.saveCategoryButton as HTMLElement).classList.remove('disabled');
        }
    }

    private async showResult(message: GetErrorResponseType | GetCategoryExpenseType): Promise<void> {
        return new Promise((resolve) => {
            this.textMessage = (message as GetErrorResponseType).error ? (message as GetErrorResponseType).message :
                "Новое название категории: " + (this.categoryField as HTMLInputElement).value + "." + "\nСообщение сервера: " + JSON.stringify(message as GetCategoryExpenseType);


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




