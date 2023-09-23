import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import {ShowButtons} from "../services/show-buttons";
import bootstrap, {Modal} from "bootstrap";
import {GetErrorResponseType, GetOperationsPeriodType} from "../types/backend-response.type";

export class PL extends ShowButtons{
    private readonly addIncomeButton: HTMLElement | null;
    private readonly addExpenseButton: HTMLElement | null;
    private emptyText: HTMLElement | null;
    private readonly tbody: HTMLElement | null;
    private resultModal!: Modal;
    private textMessage: string | null;
    private readonly modalMessageField: HTMLElement | null;
    private confirmationModal!: Modal;
    private editElements: NodeListOf<Element> | null;
    private deleteElements: NodeListOf<Element> | null;

    constructor() {
        super();
        this.editElements = null;
        this.deleteElements = null;
        this.addIncomeButton = document.getElementById('add-income');
        this.addExpenseButton = document.getElementById('add-expense');
        this.emptyText = document.getElementById('emptyText');
        this.tbody = document.getElementById("tbody");


        //определяем параметры модальных окон
        const textModalElement = document.getElementById('textModal');
        const confirmationModalElement = document.getElementById('confirmationModal');
        if (textModalElement && confirmationModalElement) {
            this.resultModal = new bootstrap.Modal(textModalElement);
            this.confirmationModal = new bootstrap.Modal(confirmationModalElement);
        }
        this.modalMessageField = document.getElementById('textModal-message');
        this.textMessage = null;



        this.dataInit();
    }

    async dataInit(){
        await Sidebar.showSidebar('pl');
        this.processButtons();

        // Создаем массив кнопок и их соответствующих обработчиков
        const buttons = [
            { button: this.todayButton, handler: 'today' },
            { button: this.weekButton, handler: 'week' },
            { button: this.monthButton, handler: 'month' },
            { button: this.yearButton, handler: 'year' },
            { button: this.allButton, handler: 'all' },
        ];

        // Добавляем обработчики для существующих кнопок
        buttons.forEach(({ button, handler }) => {
            if (button) {
                button.onclick = this.getTable.bind(this, handler);
            }
        });
        // Добавляем обработчик для periodButton, если он существует
        if (this.periodButton) {

            this.periodButton.onclick = () => {
                if (this.periodFrom && this.periodTo) {
                    const queryString = `interval&dateFrom=${(this.periodFrom as HTMLInputElement).value}&dateTo=${(this.periodTo as HTMLInputElement).value}`;
                    this.getTable(queryString);
                }
            };
        }

/*
        this.todayButton.onclick = this.getTable.bind(this, 'today');
        this.weekButton.onclick = this.getTable.bind(this, 'week');
        this.monthButton.onclick = this.getTable.bind(this, 'month');
        this.yearButton.onclick = this.getTable.bind(this, 'year');
        this.allButton.onclick = this.getTable.bind(this, 'all');
        this.periodButton.onclick = () => {
            const queryString = `interval&dateFrom=${this.periodFrom.value}&dateTo=${this.periodTo.value}`;
            this.getTable(queryString);
        }; */

        if (this.addIncomeButton) {
            this.addIncomeButton.onclick = () => {
                location.href = '#/add-p&l?=income'
            };
        }

        if (this.addExpenseButton) {
            this.addExpenseButton.onclick = () => {
                location.href = '#/add-p&l?=expense'
            };
        }


    }

    private async getTable(period?: string): Promise<void> {
        try {
            const result: GetOperationsPeriodType[] | GetErrorResponseType = await CustomHttp.request(config.host + '/operations/?period=' + period, 'GET',)

            if (result) {
                if ((result as GetErrorResponseType).error || !result) {
                    await this.showResult(result as GetErrorResponseType);
                    throw new Error((result as GetErrorResponseType).message);
                }
                await this.showTable(result as GetOperationsPeriodType[]);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    private async showTable(table:GetOperationsPeriodType[]): Promise<void> {
        // Очистим таблицу перед заполнением
        if (this.tbody) {
            this.tbody.innerHTML = '';
        }

        if (table.length === 0) {
            (this.emptyText as HTMLElement).style.display = 'flex';
        } else {
            (this.emptyText as HTMLElement).style.display = 'none';

            //создаем структуру html
            // <tr>
            //     <th>1</th>
            //     <td class="income">доход</td>
            //     <td>зарплата</td>
            //     <td>500$</td>
            //     <td>11.09.2022</td>
            //     <td></td>
            //     <td>
            //         <div className="d-flex">
            //             <a href="#" id="delete-1" data-bs-toggle="modal" data-bs-target="#exampleModal"
            //                className="me-3"><img src="static/images/trash-icon.png" alt="удалить"></a>
            //             <a href="#/edit-p&l" id="edit-1"><img src="static/images/pen-icon.png" alt="редактировать"></a>
            //         </div>
            //     </td>
            // </tr>

// Перебор каждого объекта в массиве и создание соответствующих элементов таблицы
            for (let i = 0; i < table.length; i++) {
                let item = table[i];

                // Создание новой строки
                let row = document.createElement("tr");

                // Создание ячейки для номера
                let numberCell = document.createElement("th");
                numberCell.textContent = (i + 1).toString();
                row.appendChild(numberCell);

                // Создание ячейки для типа (доход/расход)
                let typeCell = document.createElement("td");
                if (item.type === 'expense') {
                    typeCell.textContent = 'расход'
                } else {
                    typeCell.textContent = 'доход'
                }
                typeCell.classList.add(item.type); // Добавление класса в соответствии с типом
                row.appendChild(typeCell);

                // Создание ячейки для категории
                let categoryCell = document.createElement("td");
                categoryCell.textContent = item.category;
                row.appendChild(categoryCell);

                // Создание ячейки для суммы
                let amountCell = document.createElement("td");
                amountCell.textContent = item.amount.toLocaleString('ru-RU') + "$"; //отобразит разделяя тысячи пробелом
                row.appendChild(amountCell);

                // Создание ячейки для даты
                let dateCell = document.createElement("td");
                const parts = item.date.split('-');                    //преобразовываем дату в формат по макету
                dateCell.textContent = `${parts[2]}.${parts[1]}.${parts[0]}`; //из YYYY-MM-DD в DD.MM.YYYY
                row.appendChild(dateCell);

                // Создание ячейки для комментария
                let commentCell = document.createElement("td");
                commentCell.textContent = item.comment;
                row.appendChild(commentCell);

                // Создание ячейки для действий
                let actionsCell = document.createElement("td");
                let actionsDiv = document.createElement("div");
                actionsDiv.classList.add("d-flex");

                // Создание ссылки для удаления
                let deleteLink = document.createElement("a");
                deleteLink.id = "delete-" + item.id;
                // deleteLink.setAttribute("data-bs-toggle", "modal");
                // deleteLink.setAttribute("data-bs-target", "#exampleModal");
                deleteLink.classList.add("me-3");
                let deleteIcon = document.createElement("img");
                deleteIcon.src = "static/images/trash-icon.png";
                deleteIcon.alt = "удалить";
                deleteLink.appendChild(deleteIcon);
                actionsDiv.appendChild(deleteLink);

                // Создание ссылки для редактирования
                let editLink = document.createElement("a");
                editLink.id = "edit-" + item.id;
                let editIcon = document.createElement("img");
                editIcon.src = "static/images/pen-icon.png";
                editIcon.alt = "редактировать";
                editLink.appendChild(editIcon);
                actionsDiv.appendChild(editLink);

                actionsCell.appendChild(actionsDiv);
                row.appendChild(actionsCell);

                // Добавление строки в таблицу
                if ( this.tbody) {
                    this.tbody.appendChild(row);
                }

            }
            this.editElements = document.querySelectorAll('[id^="edit-"]');
            this.deleteElements = document.querySelectorAll('[id^="delete-"]');

            this.editElements.forEach((element) => {
                element.addEventListener("click", () => {
                    const id = element.id;
                    const number = parseInt(id.split('-')[1]);
                    location.href = '#/edit-p&l?=' + number
                });
            });

            const elementsArray = Array.from(this.deleteElements);
            for (const element of elementsArray) {
                element.addEventListener("click", async () => {
                    const id = element.id;
                    const number = parseInt(id.split('-')[1]);
                    await this.confirmDeleting(number); //await заставляет дождаться исполнения, и только потом перейти дальше
                });
            }
       }
    }


    private async confirmDeleting(id:number): Promise<void> {
        return new Promise((resolve) => {
            const deleteButton = document.getElementById('delete');
            const cancelButton = document.getElementById('cancel');

            this.confirmationModal.show();

            (cancelButton as HTMLElement).onclick = () => {
                this.confirmationModal.hide();
                resolve(); // Разрешаем обещание после закрытия модального окна
            };

            (deleteButton as HTMLElement).onclick = async () => {
                this.confirmationModal.hide();
                await this.deleteElement(id);
                resolve(); // Разрешаем обещание после удаления категории
            };

            // Обработчик события при закрытии попапа
            this.confirmationModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

    private async deleteElement(id:number): Promise<void> {
        try {
            const result: GetErrorResponseType = await CustomHttp.request(config.host + '/operations/' + id.toString(), 'DELETE',)

            if (result) {
                if (result.error || !result) {
                    await this.showResult(result);
                    throw new Error(result.message);
                }
                await this.showResult(result);
                location.reload();
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    }

    private async showResult(message: GetErrorResponseType): Promise<void> {
        return new Promise((resolve) => {
            this.textMessage = message.error ? message.message :
                "Запись успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message);

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

