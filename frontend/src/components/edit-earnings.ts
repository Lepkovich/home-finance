import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import bootstrap from "bootstrap";
import {GetCategoryIncomeType, GetErrorResponseType} from "../types/backend-response.type";

export class EditEarnings {
    private saveCategoryButton: HTMLElement | null;
    private cancelCategoryButton: HTMLElement | null;
    private readonly categoryField: HTMLElement | null;
    private errorText: HTMLElement | null;
    private readonly id: string;

    private resultModal!: bootstrap.Modal;
    private readonly modalMessageField: HTMLElement | null;
    private textMessage: string | null;

    constructor() {
        this.saveCategoryButton = document.getElementById('save-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('income-cat')
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

    private async init(field: EditEarnings): Promise<void> {
        await Sidebar.showSidebar('earnings');

        try {
            const result: GetErrorResponseType | GetCategoryIncomeType = await CustomHttp.request(config.host + '/categories/income/' + this.id, 'GET',)

            if (result) {
                if ((result as GetErrorResponseType).error || !result) {
                    await this.showResult(result);
                    throw new Error();
                }
                if (this.categoryField) {
                    (this.categoryField as HTMLInputElement).value = (result as GetCategoryIncomeType).title
                }
                await this.processButtons(result as GetCategoryIncomeType, field);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    private async processButtons(category:GetCategoryIncomeType, field: EditEarnings): Promise<void> {
        if (this.cancelCategoryButton) {
            this.cancelCategoryButton.onclick = function () {
                location.href = '#/earnings';
            }
        }

        if (this.saveCategoryButton) {
            this.saveCategoryButton.onclick = () => {
                let newCategory = (field.categoryField as HTMLInputElement).value;
                this.rewriteCategory(newCategory, category.id);
            }
        }


    }
    async rewriteCategory(title: string, id: number){
        if(title && id){
            try {
                const result: GetErrorResponseType |  GetCategoryIncomeType = await CustomHttp.request(config.host + '/categories/income/' + id, 'PUT',{
                    title: title
                })

                if (result) {
                    if ((result as GetErrorResponseType).error || !result) {
                        await this.showResult(result as GetErrorResponseType);
                        throw new Error((result as GetErrorResponseType).message);
                    }
                    await this.showResult(result as GetCategoryIncomeType);
                    location.href = '#/earnings';
                }

            } catch (error) {
                console.log('ошибка: ' + error);
            }
        }
    }

    private validateField(newCategory: string): void {
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

    private async showResult(message: GetErrorResponseType |  GetCategoryIncomeType): Promise<void> {
        return new Promise((resolve) => {
            this.textMessage = (message as GetErrorResponseType).error ? (message as GetErrorResponseType).message :
                "Новое название категории: " + (this.categoryField as HTMLInputElement).value + "." + "\nСообщение сервера: " + JSON.stringify(message);

            if (this.modalMessageField) {
                this.modalMessageField.innerText = this.textMessage;
            }

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

}




