import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.resultModal = new bootstrap.Modal(document.getElementById('errorModal'));
        this.rememberMeElement = null;
        this.rememberMe = false;
        this.name = null;
        this.lastName = null;
        this.processElement = null;
        this.page = page;
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //регулярка для email
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, //регулярка для пароля
                /* (?=.*\d)          // should contain at least one digit
                (?=.*[a-z])       // should contain at least one lower case
                (?=.*[A-Z])       // should contain at least one upper case
                [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters  */
                valid: false,
            }
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'name',
                    id: 'full-name',
                    element: null,
                    regex: /^[А-Я][а-я]+\s{1}[А-Я][а-я]+$/, //регулярка для имени и фамилии (первая - заглавная, русские буквы, через пробел)
                    valid: false,
                },
                {
                    name: 'repeat-password',
                    id: 'repeat-password',
                    element: null,
                    valid: false,
                });
        }


        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        });
        this.processElement = document.getElementById('process');
        this.processElement.addEventListener('click', this.processForm.bind(this));


        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('checkbox');
        }

    }

    validateField(field, element) {

        if (!element.value || !element.value.match(field.regex)) {
            field.valid = false;
            element.classList.add('is-invalid');
            if (element.validationMessage) {
                element.nextElementSibling.innerText = element.validationMessage;
            }
            element.nextElementSibling.style.display = "flex";
        } else {
            field.valid = true;
            element.classList.remove('is-invalid');
            element.nextElementSibling.style.display = "none";
        }

        if (field.name === 'name') {
            const fullName = this.fields.find(item => item.name === 'name').element.value;
            this.name = fullName.split(" ")[0]; // Имя (до пробела)
            this.lastName = fullName.split(" ")[1]; // Фамилия (после пробела)
        }

        if (field.name === 'repeat-password') {

            const passwordField = this.fields.find(item => item.name === 'password');
            if (!element.value || element.value !== passwordField.element.value) {
                field.valid = false;
                element.classList.add('is-invalid');
                element.nextElementSibling.style.display = 'flex';
            } else {
                field.valid = true;
                element.classList.remove('is-invalid');
                element.nextElementSibling.style.display = "none";
            }
        }


        this.validateForm();
    };

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.classList.remove('disabled');
        } else {
            this.processElement.classList.add('disabled');
        }
        return validForm;
    };

    async showError(message){
        return new Promise((resolve) => {

            const text = document.getElementById('error-message');
            text.innerText = message;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
        // const myModal = new bootstrap.Modal(document.getElementById('errorModal'), {
        //     backdrop:true
        // });
        // const text = document.getElementById('error-message');
        // text.innerText = message;
        // myModal.show(myModal);
        // return console.log(message);
    }

    async processForm(event) {
        event.preventDefault();
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            if (this.rememberMeElement){
                this.rememberMe = this.rememberMeElement.checked;
            }


            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.name,
                        lastName: this.lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'repeat-password').element.value,
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            await this.showError(result.message);
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                  return   console.log(error);
                }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.rememberMe
                })

                if (result) {
                    if (result.error) {
                        await this.showError(result.message);
                        throw new Error(result.message);
                    }
                    if (result.tokens.accessToken && result.tokens.refreshToken && result.user.name && result.user.lastName && result.user.id) {
                        await this.showError('Вход успешно выполнен!');
                        let userFullName = result.user.name + result.user.lastName;
                        Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        Auth.setUserData(result.user.id, userFullName);
                        location.href = "#/"
                    }
                }

            } catch (error) {
                console.log(error);
            }
        }
    }
}
