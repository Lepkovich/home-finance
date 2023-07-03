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
                     new Form();
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