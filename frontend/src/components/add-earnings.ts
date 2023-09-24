import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import bootstrap, {Modal} from "bootstrap";
import {GetErrorResponseType, PostIncomeCategoryType} from "../types/backend-response.type";

export class AddEarnings {
    private readonly saveCategoryButton: HTMLElement | null;
    private readonly cancelCategoryButton: HTMLElement | null;
    private readonly categoryField: HTMLElement | null;
    private readonly errorText: HTMLElement | null;
    private resultModal!: Modal;
    private textMessage: string | null;
    private readonly modalMessageField: HTMLElement | null;
    
    constructor() {
        this.saveCategoryButton = document.getElementById('create-button');
        this.cancelCategoryButton = document.getElementById('cancel-button');
        this.categoryField = document.getElementById('add-profit-cat');
        this.errorText = document.getElementById('invalid-filed-text');

        //определяем параметры модального окна
        const textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            this.resultModal = new bootstrap.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        if (this.cancelCategoryButton) {
            this.cancelCategoryButton.onclick = function () {
                location.href = '#/earnings';
            }
        }

        if (this.categoryField) {
            this.categoryField.addEventListener('input', () => {
                if (this.categoryField instanceof HTMLInputElement) {
                    this.validateField(this.categoryField.value);
                }
            });
        }

        if (this.saveCategoryButton) {
            this.saveCategoryButton.onclick = async () => {
                if (this.categoryField instanceof HTMLInputElement) {
                    await this.init(this.categoryField.value);
                }
            }
        }

        this.init();

    }

    private async init(title?: string): Promise<void> {
        await Sidebar.showSidebar('earnings');

        if(title){
            try {
                const data: object = { title: title};
                const result: GetErrorResponseType | PostIncomeCategoryType = await CustomHttp.request(config.host + '/categories/income/', 'POST', data);

                if (result) {
                    if ((result as GetErrorResponseType).error || !result) {
                        await this.showResult(result as GetErrorResponseType);
                        throw new Error();
                    } else {
                        await this.showResult(result as PostIncomeCategoryType);
                        location.href = '#/earnings';
                    }
                }

            } catch (error) {
                console.log('ошибка' + error);
            }
        }

    };

    private validateField(newCategory: string): void {
        if (this.errorText && this.categoryField && this.saveCategoryButton) {
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

    }


    private async showResult(message: GetErrorResponseType | PostIncomeCategoryType): Promise<void> {
        return new Promise <void> ((resolve) => {

            this.textMessage = (message as GetErrorResponseType).error ? (message as GetErrorResponseType).message :
            "Категория  " + (this.categoryField as HTMLInputElement).value + " успешно создана." + "\nСообщение сервера: " + JSON.stringify(message);


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




