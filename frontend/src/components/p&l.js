import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class PL {
    constructor() {
        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/operations/?period=all', 'GET',)

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                this.showTable(result);
            }

        } catch (error) {
            console.log(error);
        }
    };

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
            typeCell.textContent = item.type;
            typeCell.classList.add(item.type); // Добавление класса в соответствии с типом
            row.appendChild(typeCell);

            // Создание ячейки для категории
            let categoryCell = document.createElement("td");
            categoryCell.textContent = item.category;
            row.appendChild(categoryCell);

            // Создание ячейки для суммы
            let amountCell = document.createElement("td");
            amountCell.textContent = item.amount + "$";
            row.appendChild(amountCell);

            // Создание ячейки для даты
            let dateCell = document.createElement("td");
            dateCell.textContent = item.date;
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
            deleteLink.href = "#";
            deleteLink.id = "delete-" + item.id;
            deleteLink.setAttribute("data-bs-toggle", "modal");
            deleteLink.setAttribute("data-bs-target", "#exampleModal");
            deleteLink.classList.add("me-3");
            let deleteIcon = document.createElement("img");
            deleteIcon.src = "static/images/trash-icon.png";
            deleteIcon.alt = "удалить";
            deleteLink.appendChild(deleteIcon);
            actionsDiv.appendChild(deleteLink);

            // Создание ссылки для редактирования
            let editLink = document.createElement("a");
            editLink.href = "#/edit-p&l";
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
    }

}

