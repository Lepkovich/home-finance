import {Form} from "./components/form.js";

export class Router {
    constructor() {
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/login',
                title: 'Регистрация',
                template: 'templates/login.html',
                styles: 'styles/login.css',
                load: () => {
                     new Form('login');
                }
            },
            {
                route: '#/signin',
                title: 'Вход',
                template: 'templates/signin.html',
                styles: 'styles/login.css',
                load: () => {
                     new Form('signin');
                }
            },
            {
                route: '#/p&l',
                title: 'Доходы и расходы',
                template: 'templates/p&l.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/edit-p&l',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-p&l.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/edit-expenses',
                title: 'Редактировать категорию расхода',
                template: 'templates/edit-expenses.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/edit-earnings',
                title: 'Редактировать категорию дохода',
                template: 'templates/edit-earnings.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/earnings',
                title: 'Доходы',
                template: 'templates/earnings.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/add-p&l',
                title: 'Создание дохода/расхода',
                template: 'templates/add-p&l.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/add-expenses',
                title: 'Создание категории расходов',
                template: 'templates/add-expenses.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
            {
                route: '#/add-earnings',
                title: 'Создание категории доходов',
                template: 'templates/add-earnings.html',
                styles: 'styles/main.css',
                load: () => {
                }
            },
        ]
    }

    async openRoute(){
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash;
        });
        if(!newRoute) {
            window.location.href = '#/';
            return;
        }

        document.getElementById('content').innerHTML = await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('title').innerText = newRoute.title;
        newRoute.load();
    }
}