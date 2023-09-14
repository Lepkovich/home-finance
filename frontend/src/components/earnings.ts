import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {ShowCategories} from "../services/show-categories";
import {Sidebar} from "./sidebar";
import {GetErrorResponseType, GetCategoryIncomeType} from "../types/backend-response.type";
import * as bootstrap from 'bootstrap';

export class Earnings {
    private editCategoryButtons: NodeListOf<HTMLElement> | null;
    private deleteCategoryButtons: NodeListOf<Element> | null;
    private resultModal!: bootstrap.Modal;
    private confirmationModal!: bootstrap.Modal;
    private readonly modalMessageField: HTMLElement | null;
    private readonly addCategoryButton: HTMLElement | null;
    private textMessage: string | null;

    constructor() {
        this.editCategoryButtons = null;
        this.deleteCategoryButtons = null;
        this.addCategoryButton = document.getElementById('add-category');
        if (this.addCategoryButton) {
            this.addCategoryButton.onclick = () => {
                location.href = "#/add-earnings"
            };
        }

        //определяем параметры модальных окон
        const textModalElement = document.getElementById('textModal');
        const confirmationModalElement = document.getElementById('confirmationModal');
        if (textModalElement && confirmationModalElement) {
            this.resultModal = new bootstrap.Modal(textModalElement);
            this.confirmationModal = new bootstrap.Modal(confirmationModalElement);
        }
        this.modalMessageField = document.getElementById('textModal-message');
        this.textMessage = null;


        this.getCategories();
    }

    private async getCategories(): Promise<void> {
        await Sidebar.showSidebar('earnings');

        try {
            const result: GetErrorResponseType | GetCategoryIncomeType[]= await CustomHttp.request(config.host + '/categories/income', 'GET',)

            if (result) {
                if ((result as GetErrorResponseType).error   || !result) {
                    await this.showResult(result as GetErrorResponseType)
                    throw new Error((result as GetErrorResponseType).message);
                }
                await ShowCategories.init(result as GetCategoryIncomeType[]); //отрисуем карточки категорий
                await this.processCategories();
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    private async processCategories(): Promise<void> {

        this.editCategoryButtons = document.querySelectorAll('[id^="edit-"]');
        this.deleteCategoryButtons = document.querySelectorAll('[id^="delete-"]');

        this.editCategoryButtons.forEach((element) => {
            element.addEventListener("click", () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                location.href = '#/edit-earnings?=' + number
            });
        });

        const deleteButtonsArray: Element[] = Array.from(this.deleteCategoryButtons);

        for (const element of deleteButtonsArray) {
            element.addEventListener("click", async () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                await this.confirmDeleting(number);
                await this.getCategories();
            });
        }
    }

    private async confirmDeleting(categoryId: number) {
        return new Promise<void>((resolve) => {
            const deleteButton = document.getElementById('delete');
            const cancelButton = document.getElementById('cancel');
            const confirmationText = document.getElementById('confirmationText');

            if (confirmationText) {
                confirmationText.innerText = 'Вы действительно хотите удалить категорию?'
            }
            this.confirmationModal.show();

            if (cancelButton) {
                cancelButton.onclick = () => {
                    this.confirmationModal.hide();
                    resolve(); // Разрешаем обещание после закрытия модального окна
                };
            }

            if (deleteButton) {
                deleteButton.onclick = async () => {
                    this.confirmationModal.hide();
                    await this.deleteCategory(categoryId);
                    resolve(); // Разрешаем обещание после удаления категории
                };
            }
        });
    }
    async deleteCategory(categoryId: number){
        if(categoryId){
            try {
                const result: GetErrorResponseType = await CustomHttp.request(config.host + '/categories/income/' + categoryId, 'DELETE',)

                if (result) {
                    if (result.error || !result) {
                        await this.showResult(result)
                        throw new Error(result.message);
                    }
                    await this.showResult(result);
                }
            } catch (error) {
                console.log('ошибка' + error);
            }
        }
    }
    async showResult(message:GetErrorResponseType) {
        return new Promise<void>((resolve) => {
            this.textMessage = message.error ? message.message :
                "Категория успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message.message);

            if (this.modalMessageField) {
                this.modalMessageField.innerText = this.textMessage;
            }

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal.getElement()?.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }
}




