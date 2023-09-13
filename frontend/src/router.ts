import {Form} from "./components/form";
import {Main} from "./components/main";
import {PL} from "./components/p&l";
import {Auth} from "./services/auth";
import {AddPL} from "./components/add-p&l";
import {EditPL} from "./components/edit-p&l";
import {Earnings} from "./components/earnings";
import {Expenses} from "./components/expenses";
import {EditExpenses} from "./components/edit-expenses";
import {EditEarnings} from "./components/edit-earnings";
import {AddEarnings} from "./components/add-earnings";
import {AddExpenses} from "./components/add-expenses";
import {RouteType} from "./types/route.type";

export class Router {

    readonly sidebarElement: HTMLElement;
    readonly contentElement: HTMLElement;
    readonly popupElement: HTMLElement;
    readonly stylesElement: HTMLElement;
    readonly titleElement: HTMLElement;
    private routes: RouteType[];
    constructor() {
        this.sidebarElement = document.getElementById('sidebar') as HTMLElement;
        this.contentElement = document.getElementById('content') as HTMLElement;
        this.popupElement = document.getElementById('popup') as HTMLElement;
        this.stylesElement = document.getElementById('styles') as HTMLElement;
        this.titleElement = document.getElementById('title') as HTMLElement;

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

    public async openRoute(): Promise<void> {
        const urlRoute: string =  window.location.hash.split('?')[0];//split разделит адресную строку до ?, а [0] возьмет первую часть
        if (urlRoute === '#/logout') {
            const result: boolean =  await Auth.logOut();
            if (result) {
                window.location.href = '#/login';
                return;
            }

        }

        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        });
        if(!newRoute) {
            window.location.href = '#/login';
            return;
        } else if (urlRoute === '#/login' || urlRoute === '#/signup') {
            this.sidebarElement.style.display = 'none';
            this.contentElement.style.display = 'contents';
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.popupElement.innerHTML = await fetch('templates/modal.html').then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            newRoute.load();
            return;
        }


        this.popupElement.innerHTML = await fetch('templates/modal.html').then(response => response.text());
        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;
        newRoute.load();
    }
}