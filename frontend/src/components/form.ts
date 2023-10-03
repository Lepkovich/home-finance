import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import {FieldsType} from "../types/fields.type";
import * as bootstrap from "bootstrap";
import {PostLoginResponseType, PostSignupResponseType} from "../types/backend-response.type";

export class Form {
    private readonly rememberMeElement: HTMLElement | null;
    private rememberMe: boolean;
    private passwordRepeat: string | null;
    private name: string | null;
    private lastName: string | null;
    private readonly processElement: HTMLElement | null;
    private readonly page: string;
    private fields: FieldsType[];
    private resultModal!: bootstrap.Modal;
    private textMessage: string | null;
    private readonly modalMessageField: HTMLElement | null;

    constructor(page: string) {
        //определяем параметры модального окна
        const textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            console.log(bootstrap);
            this.resultModal = new bootstrap.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        this.rememberMeElement = null;
        this.rememberMe = false;
        this.name = null;
        this.lastName = null;
        this.passwordRepeat = null;
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


        const that: Form = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item, <HTMLInputElement>this);
                }
            }
        });
        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.addEventListener('click', this.processForm.bind(this));
        }


        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('checkbox');
        }

    }

    validateField(field: FieldsType, element: HTMLElement) {

        if (!(element as HTMLInputElement).value || !(element as HTMLInputElement).value.match(field.regex!)) {
            field.valid = false;
            element.classList.add('is-invalid');
            if (element instanceof HTMLInputElement && element.validationMessage) {
                const nextElement = element.nextElementSibling;
                if (nextElement instanceof HTMLElement) {
                    nextElement.innerText = element.validationMessage;
                }
            }
            if (element.nextElementSibling) {
                (element.nextElementSibling as HTMLElement).style.display = "flex";
            }
        } else {
            field.valid = true;
            element.classList.remove('is-invalid');
            (element.nextElementSibling as HTMLElement).style.display = "none";
        }

        if (field.name === 'name') {
            const fullNameElement = this.fields.find(item => item.name === 'name')?.element as HTMLInputElement;
            const fullName = fullNameElement?.value;
            this.name = fullName.split(" ")[0]; // Имя (до пробела)
            this.lastName = fullName.split(" ")[1]; // Фамилия (после пробела)
        }

        if (field.name === 'repeat-password') {

            const passwordField = this.fields.find(item => item.name === 'password');
            if (passwordField) {
                if (!(element as HTMLInputElement).value || (element as HTMLInputElement).value !== (passwordField.element as HTMLInputElement).value) {
                    field.valid = false;
                    element.classList.add('is-invalid');
                    (element.nextElementSibling as HTMLElement).style.display = 'flex';
                } else {
                    field.valid = true;
                    element.classList.remove('is-invalid');
                    (element.nextElementSibling as HTMLElement).style.display = "none";
                }
            }

        }


        this.validateForm();
    };

    private validateForm(): boolean {
        const validForm = this.fields.every(item => item.valid);
        if (validForm && this.processElement) {
            this.processElement.classList.remove('disabled');
        } else if (this.processElement) {
            this.processElement.classList.add('disabled');
        }
        return validForm;
    };

    private async processForm(event: MouseEvent): Promise<void>  {
        event.preventDefault();
        if (this.validateForm()) {
            const emailElement =  this.fields.find(item => item.name === 'email')?.element as HTMLInputElement;
            const email = emailElement.value;
            const passwordElement = this.fields.find(item => item.name === 'password')?.element as HTMLInputElement;
            const password = passwordElement.value;
            if (this.rememberMeElement){
                this.rememberMe = (this.rememberMeElement as HTMLInputElement).checked;
            }

            const passwordRepeatElement = this.fields.find(item => item.name === 'repeat-password')?.element as HTMLInputElement;
            if (passwordRepeatElement) {
                this.passwordRepeat = passwordRepeatElement.value;
            }


            if (this.page === 'signup') {
                try {
                    const result: PostSignupResponseType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.name,
                        lastName: this.lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.passwordRepeat
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            await this.showResult(result);
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                  return   console.log(error);
                }
            }

            try {
                const result: PostLoginResponseType = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.rememberMe
                })

                if (result) {
                    if (result.error) {
                        await this.showResult(result); //вот тут мы не видим модальное окно
                        // console.log(result);
                        throw new Error(result.message);
                    }
                    result.tokens
                    if (!result.error && result.tokens  && result.tokens.accessToken && result.tokens.refreshToken && result.user && result.user.name && result.user.lastName && result.user.id) {
                        await this.showResult(result);

                        let userFullName = result.user.name + ' ' + result.user.lastName;
                        Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        Auth.setUserData((result.user.id).toString(), userFullName);
                        location.href = "#/"
                    }
                }

            } catch (error) {
               console.log(error);
            }
        }
    }

    private async showResult(message: PostSignupResponseType | PostLoginResponseType): Promise<void>{
        return new Promise((resolve) => {

            this.textMessage = message.error ? message.message :
                "Вход под именем " + message.user!.name + " успешно выполнен";

            if (this.modalMessageField) {
                this.modalMessageField.innerText = this.textMessage;
            }

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            addEventListener('click', () => {
                this.resultModal.hide();
                resolve(); // Разрешаем обещание при закрытии попапа
            });
            // this.resultModal._element.addEventListener('hidden.bs.modal', () => {
            //     resolve(); // Разрешаем обещание при закрытии попапа
            // });
        });
    }
}
