import {GetCategoryIncomeType} from "../types/backend-response.type";

export class ShowCategories {
    constructor() {

    }
    static async init(categories: GetCategoryIncomeType[]): Promise<void>{

        //создаем структуру html
        // <div className="card mb-4 rounded-3 p-4">
        //     <h2>Зарплата</h2>
        //     <div className="d-flex">
        //         <button className="btn btn-primary px-2 me-3 edit btn-earnings" type="button" id="edit-1">Редактировать</button>
        //         <button className="btn btn-danger px-2 btn-earnings" type="button" id="delete-1">Удалить</button>
        //     </div>
        // </div>


        // Получение ссылки на элемент таблицы
        let categoriesBlock: HTMLElement | null = document.getElementById("categories-block");
        if (categoriesBlock) {
            categoriesBlock.innerHTML = ""; //сначала очистим блок

        // Перебор каждого объекта в массиве и создание соответствующих блоков категорий
        for (let i = 0; i < categories.length; i++) {
            let item = categories[i];

            // Создаем элементы и добавляем им нужные классы и атрибуты
            let card = document.createElement("div");
            card.className = "card mb-4 rounded-3 p-4";

            let heading = document.createElement("h2");
            heading.textContent = item.title;

            let buttonWrapper = document.createElement("div");
            buttonWrapper.className = "d-flex";

            let editButton = document.createElement("button");
            editButton.className = "btn btn-primary px-2 me-3 edit btn-earnings";
            editButton.type = "button";
            editButton.id = "edit-" + item.id;
            editButton.textContent = "Редактировать";

            let deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger px-2 btn-earnings";
            deleteButton.type = "button";
            deleteButton.id = "delete-" + item.id;
            deleteButton.textContent = "Удалить";

            // Собираем элементы вместе
            buttonWrapper.appendChild(editButton);
            buttonWrapper.appendChild(deleteButton);

            card.appendChild(heading);
            card.appendChild(buttonWrapper);

            // добавляем созданный блок на страницу
            categoriesBlock.appendChild(card);
        }

        // Создаем карточку с добавлением категории
        let card = document.createElement("div");
        card.className = "card mb-4 rounded-3 d-flex align-items-center justify-content-center add-cart";

        let innerDiv = document.createElement("div");

        let link = document.createElement("a");
        link.id = "add-category";
        link.textContent = "+";

        innerDiv.appendChild(link);
        card.appendChild(innerDiv);

        // добавляем созданный блок на страницу
        categoriesBlock.appendChild(card);
        }
    };
}