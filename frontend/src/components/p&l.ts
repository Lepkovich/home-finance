import {CustomHttp} from "../services/custom-http.ts";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import {ShowButtons} from "../services/show-buttons.ts";

export class PL extends ShowButtons{
    constructor() {
        super();
        this.addIncomeButton = document.getElementById('add-income');
        this.addExpenseButton = document.getElementById('add-expense');
        this.emptyText = document.getElementById('emptyText');
        this.tbody = document.getElementById("tbody");


        //определяем параметры модальных окон
        this.resultModal = new bootstrap.Modal(document.getElementById('textModal'));
        this.confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        this.modalMessageField = document.getElementById('textModal-message');
        this.textMessage = null;



        this.dataInit();
    }

    async dataInit(){
        await Sidebar.showSidebar('pl');
        this.processButtons();

        this.todayButton.onclick = this.getTable.bind(this, 'today');
        this.weekButton.onclick = this.getTable.bind(this, 'week');
        this.monthButton.onclick = this.getTable.bind(this, 'month');
        this.yearButton.onclick = this.getTable.bind(this, 'year');
        this.allButton.onclick = this.getTable.bind(this, 'all');
        this.periodButton.onclick = () => {
            const queryString = `interval&dateFrom=${this.periodFrom.value}&dateTo=${this.periodTo.value}`;
            this.getTable(queryString);
        };

        this.addIncomeButton.onclick = () => {
            location.href = '#/add-p&l?=income'
        };

        this.addExpenseButton.onclick = () => {
            location.href = '#/add-p&l?=expense'
        };

    }
    async getTable(period) {
        try {
            const result = await CustomHttp.request(config.host + '/operations/?period=' + period, 'GET',)

            if (result) {
                if (result.error || !result) {
                    await this.showResult(result.message);
                    throw new Error(result.message);
                }
                await this.showTable(result);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    async showTable(table) {
        // Очистим таблицу перед заполнением
        this.tbody.innerHTML = '';

        if (table.length === 0) {
            this.emptyText.style.display = 'flex';
        } else {
            this.emptyText.style.display = 'none';

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
                numberCell.textContent = i + 1;
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
                tbody.appendChild(row);

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

            for (const element of this.deleteElements) {
                element.addEventListener("click", async () => {
                    const id = element.id;
                    const number = parseInt(id.split('-')[1]);
                    await this.confirmDeleting(number); //await заставляет дождаться исполнения, и только потом перейти дальше
                });
            }
       }
    }

    async deleteElement(id) {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE',)

            if (result) {
                if (result.error || !result) {
                    await this.showResult(result.message);
                    throw new Error(result.message);
                }
                await this.showResult(result);
                location.reload();
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    }
    async confirmDeleting(id) {
        return new Promise((resolve) => {
            const deleteButton = document.getElementById('delete');
            const cancelButton = document.getElementById('cancel');

            this.confirmationModal.show();

            cancelButton.onclick = () => {
                this.confirmationModal.hide();
                resolve(); // Разрешаем обещание после закрытия модального окна
            };

            deleteButton.onclick = async () => {
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
    async showResult(message) {
        return new Promise((resolve) => {
            this.textMessage = message.error ? message.message :
                "Запись успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message);

            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

}

