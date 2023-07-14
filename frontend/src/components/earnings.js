import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Earnings {
    constructor() {
        this.editCategoryButtons = null;
        this.deleteCategoryButtons = null;
        this.confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income', 'GET',)

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                await this.showCategories(result);
            }

        } catch (error) {
            console.log('ошибка' + error);
        }
    };

    async showCategories(categories) {
        //создаем структуру html
        // <div className="card mb-4 rounded-3 p-4">
        //     <h2>Зарплата</h2>
        //     <div className="d-flex">
        //         <button className="btn btn-primary px-2 me-3 edit btn-earnings" type="button" id="edit-1">Редактировать</button>
        //         <button className="btn btn-danger px-2 btn-earnings" type="button" id="delete-1">Удалить</button>
        //     </div>
        // </div>


        // Получение ссылки на элемент таблицы
        let categoriesBlock = document.getElementById("categories-block");

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
        link.id = "add-earning-category";
        link.textContent = "+";

        innerDiv.appendChild(link);
        card.appendChild(innerDiv);

        // добавляем созданный блок на страницу
        categoriesBlock.appendChild(card);


        this.editCategoryButtons = document.querySelectorAll('[id^="edit-"]');
        this.deleteCategoryButtons = document.querySelectorAll('[id^="delete-"]');
        this.addCategoryButton = document.getElementById('add-earning-category');

        this.addCategoryButton.onclick = () => {
            location.href = "#/add-earnings"
        };

        this.editCategoryButtons.forEach((element) => {
            element.addEventListener("click", () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                location.href = '#/edit-earnings?=' + number
                console.log("Редактировать с id:", number);
            });
        });
        this.deleteCategoryButtons.forEach((element) => {
            element.addEventListener("click", () => {
                const id = element.id;
                const number = parseInt(id.split('-')[1]);
                console.log("Удалить с id:", number);
                this.confirmDeleting(number);
            });
        });
    }
    async deleteCategory(categoryId){
        await this.confirmDeleting(categoryId);

        if(categoryId){
            try {
                const result = await CustomHttp.request(config.host + '/categories/income/' + categoryId, 'DELETE',)

                if (result) {
                    if (result.error || !result) {
                        throw new Error();
                    }
                    this.clearPage();
                }

            } catch (error) {
                console.log('ошибка' + error);
            }
        }
    }

    async confirmDeleting(categoryId) {
        return new Promise((resolve) => {
            const deleteButton = document.getElementById('delete');
            const cancelButton = document.getElementById('cancel');

            deleteButton.onclick = async () => {
                await this.deleteCategory(categoryId);
                this.confirmationModal.hide();
                resolve(); // Разрешаем обещание после удаления категории
            };

            cancelButton.onclick = () => {
                this.confirmationModal.hide();
                resolve(); // Разрешаем обещание после закрытия модального окна
            };

            this.confirmationModal.show();

            // Обработчик события при закрытии попапа
            this.confirmationModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    }

    clearPage(){
        const categoriesBlock = document.getElementById("categories-block");
        categoriesBlock.innerHTML = "";
        this.init();
    }
}




