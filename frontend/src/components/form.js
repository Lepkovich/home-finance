export class Form  {
    constructor(page) {
        this.rememberMeElement = null;
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
        this.processElement.onclick = function () {
            that.processForm();
        }
        if (this.page === 'login'){
            this.rememberMeElement = document.getElementById('checkbox');
            this.rememberMeElement.onchange = function () {
                that.processForm();
            }
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
            console.log(this.name + ' ' + this.lastName);
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

    async processForm() {
        if (this.validateForm()) {

            if (this.page === 'signup') {
                try {
                    const response = await fetch('http://localhost:3000/api/signup', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({

                            name: this.name,
                            lastName: this.lastName,
                            email: this.fields.find(item => item.name === 'email').element.value,
                            password: this.fields.find(item => item.name === 'password').element.value,
                            passwordRepeat: this.fields.find(item => item.name === 'repeat-password').element.value,
                        })
                    })

                    if (response.status < 200 || response.status >= 300) {
                        throw new Error(response.message);
                    }
                    const result = await response.json();
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        location.href = "#/"
                    }

                } catch (error) {
                    console.log(error);
                }

            }
        }
    }
}
