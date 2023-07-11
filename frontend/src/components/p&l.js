import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class PL {
    constructor() {
        this.addIncomeButton = document.getElementById('add-income');
        this.addExpenseButton = document.getElementById('add-expense');
        this.editElements = null;
        this.deleteElements = null;
        this.period = 'all';
        this.todayButton = null;
        this.weekButton = null;
        this.monthButton = null;
        this.yearButton = null;
        this.allButton = null;
        this.periodButton = null;
        this.periodFrom = null;
        this.periodTo = null;

        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        // document.addEventListener("click", function(event) {
        //     const clickedElement = event.target;
        //     const parentElement = clickedElement.parentNode;
        //     const parentId = parentElement.id;
        //     console.log("Кликнут родительский элемент с id:", parentId);
        // });
        this.processForm();
    }

    async getTable(period) {
        try {
            const result = await CustomHttp.request(config.host + '/operations/?period=' + period, 'GET',)

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                this.showTable(result);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    processForm() {
        // this.getTable(this.period);
        this.addIncomeButton.onclick = () => {
            location.href = '#/add-p&l?=income'
        };

        this.addExpenseButton.onclick = () => {
            location.href = '#/add-p&l?=expense'
        };


        const buttons = document.querySelectorAll('.medium'); //выберем все кнопки
        let activeButton = null;
        // меняем оформление активных и неактивных кнопок
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (activeButton !== null) {
                    activeButton.classList.remove('btn-secondary');
                    activeButton.classList.add('btn-outline-secondary');
                }
                button.classList.add('btn-secondary');
                button.classList.remove('btn-outline-secondary');
                activeButton = button;
            });
        });

        this.todayButton = document.getElementById('today');
        this.todayButton.onclick = this.getTable.bind(this, 'today');

        this.weekButton = document.getElementById('week');
        this.weekButton.onclick = this.getTable.bind(this, 'week');

        this.monthButton = document.getElementById('month');
        this.monthButton.onclick = this.getTable.bind(this, 'month');

        this.yearButton = document.getElementById('year');
        this.yearButton.onclick = this.getTable.bind(this, 'year');

        this.allButton = document.getElementById('all');
        this.allButton.onclick = this.getTable.bind(this, 'all');

        this.periodFrom = document.getElementById('periodFrom');
        this.periodTo = document.getElementById('periodTo');

        this.periodButton = document.getElementById('period');
        this.periodButton.onclick = () => {

            const queryString = `interval&dateFrom=${this.periodFrom.value}&dateTo=${this.periodTo.value}`;

            this.getTable(queryString);
        };
    }

    showTable(table){
        console.log(table);
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


        // Получение ссылки на элемент таблицы
        let tbody = document.getElementById("tbody");

        // Очистим таблицу перед заполнением
        tbody.innerHTML = '';

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
            if(item.type === 'expense'){
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

        this.deleteElements.forEach((element) => {
            element.addEventListener("click", () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                // Открытие модального окна перед удалением
                const confirmModal = new bootstrap.Modal(document.getElementById('deleteModal'), {
                    backdrop: true
                });
                confirmModal.show(confirmModal);

                // Обработчик для кнопки "Да, удалить"
                const deleteButton = document.getElementById("delete-confirm");
                deleteButton.addEventListener("click", async () => {
                    try {
                        // Вызов функции deleteElement
                        await this.deleteElement(number);
                        confirmModal.hide(); // Скрытие модального окна после удаления
                        // confirmModal.dispose(); // Удаление модального окна и фонового затемнителя
                    } catch (error) {
                        console.log('ошибка' + error);
                    }
                });

                // Обработчик для кнопки "Не удалять"
                const cancelButton = document.getElementById("delete-cancel");
                cancelButton.addEventListener("click", () => {
                    confirmModal.hide(); // Скрытие модального окна без удаления
                    // confirmModal.dispose(); // Удаление модального окна и фонового затемнителя
                });
            });
        });
    }

    async deleteElement(id) {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE',)

            if (result) {
                if (result.error || !result) {
                    this.showError(result.message);
                    throw new Error();
                }
                this.showResult(result.message)
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    }

    showError(message) {
        const myModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            backdrop: true
        });
        const text = document.getElementById('error-message');
        text.innerText = message;
        myModal.show(myModal);
        myModal.hide();
        myModal.dispose();
        return console.log(message);
    };

    showResult(message) {
        let textMessage = "Запись успешно удалена. Сообщение сервера: " + message + ".";
        const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
            backdrop: true
        });
        const text = document.getElementById('confirmation-message');
        text.innerText = textMessage;
        confirmModal.show(confirmModal);
        confirmModal.hide();
        confirmModal.dispose();
        return console.log(message);
    }

}

