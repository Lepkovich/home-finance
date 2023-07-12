import {Form} from "./components/form.js";
import {Main} from "./components/main.js";
import {PL} from "./components/p&l.js";
import {AddPL} from "./components/add-p&l.js";
import {EditPL} from "./components/edit-p&l.js";
import {Earnings} from "./components/earnings.js";
import {Expenses} from "./components/expenses.js";
import {EditExpenses} from "./components/edit-expenses.js";
import {EditEarnings} from "./components/edit-earnings.js";
import {AddEarnings} from "./components/add-earnings.js";
import {AddExpenses} from "./components/add-expenses.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new Main();

                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login.css',
                load: () => {
                     new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                     new Form('login');
                }
            },
            {
                route: '#/p&l',
                title: 'Доходы и расходы',
                template: 'templates/p&l.html',
                styles: 'styles/main.css',
                load: () => {
                    new PL();
                }
            },
            {
                route: '#/edit-p&l',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-p&l.html',
                styles: 'styles/main.css',
                load: () => {
                    new EditPL();
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расхода',
                template: 'templates/edit-expenses.html',
                styles: 'styles/main.css',
                load: () => {
                    new EditExpenses();
                }
            },
            {
                route: '#/edit-earnings',
                title: 'Редактировать категорию дохода',
                template: 'templates/edit-earnings.html',
                styles: 'styles/main.css',
                load: () => {
                    new EditEarnings();
                }
            },
            {
                route: '#/earnings',
                title: 'Доходы',
                template: 'templates/earnings.html',
                styles: 'styles/main.css',
                load: () => {
                    new Earnings();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/main.css',
                load: () => {
                    new Expenses();
                }
            },
            {
                route: '#/add-p&l',
                title: 'Создание дохода',
                template: 'templates/add-p&l.html',
                styles: 'styles/main.css',
                load: () => {
                    new AddPL();
                }
            },
            {
                route: '#/add-expenses',
                title: 'Создание категории расходов',
                template: 'templates/add-expenses.html',
                styles: 'styles/main.css',
                load: () => {
                    new AddExpenses();
                }
            },
            {
                route: '#/add-earnings',
                title: 'Создание категории доходов',
                template: 'templates/add-earnings.html',
                styles: 'styles/main.css',
                load: () => {
                    new AddEarnings();
                }
            },
        ]
    }

    async openRoute(){
        const urlRoute =  window.location.hash.split('?')[0];//split разделит адресную строку до ?, а [0] возьмет первую часть
        if (urlRoute === '#/logout') {
            await Auth.logOut();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if(!newRoute) {
            window.location.href = '#/login';
            return;
        }

        document.getElementById('content').innerHTML = await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('title').innerText = newRoute.title;
        newRoute.load();
    }
}