(function (){
    const processElement = null;
    const passwordMatch = false;

    const Form = {
        fields: [
            {
                name: 'name',
                id: 'full-name',
                element:null,
                regex: /^[А-Я][а-я]+\s*$/, //регулярка для имени (первая - заглавная, русские буквы
                valid: false,

            },
            {
                name: 'email',
                id: 'email',
                element:null,
                regex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //регулярка для email
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element:null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, //регулярка для пароля
                /* (?=.*\d)          // should contain at least one digit
                (?=.*[a-z])       // should contain at least one lower case
                (?=.*[A-Z])       // should contain at least one upper case
                [a-zA-Z0-9]{8,}   // should contain at least 8 from the mentioned characters  */
                valid: false,
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                element:null,
                valid: false,
            },
        ],
        init(){
            const that = this;
            this.fields.forEach(item => {
                item.element = document.getElementById(item.id);
                item.element.onchange = function () {
                    that.validateField.call(that, item, this)
                }
            });
            this.processElement = document.getElementById('process');
        },
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

                if(field.name === 'repeat-password') {

                    const passwordField = this.fields.find(item => item.name === 'password');
                    console.log(passwordField.element.value);
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
        },
        validateForm(){
            const validForm = this.fields.every(item => item.valid);
            if (validForm) {
                this.processElement.classList.remove('disabled');
            } else {
                this.processElement.classList.add('disabled');
            }
        }
    };
    Form.init();
})();