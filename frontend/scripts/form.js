(function (){
    const Form = {
        fields: [
            {
                name: 'name',
                id: 'full-name',
                element:null,
                regex: /^[А-Я][а-я]+\s*$/, //регулярка для имени (первая - заглавная, русские буквы

            },
            {
                name: 'email',
                id: 'email',
                element:null,
                regex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //регулярка для email
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
            },
            {
                name: 'repeat-password',
                id: 'repeat-password',
                element:null,
            },
        ],
        init(){
            const that = this;
            this.fields.forEach(item => {
                item.element = document.getElementById(item.id);
                item.element.onchange = function () {
                    that.validateField.call(that, item, this)
                }
            })
        },
        validateField(field, element) {
            if(!element.value || !element.value.match(field.regex)) {
                element.classList.add('is-invalid');
                element.nextElementSibling.style.display = "flex";
            } else {
                element.classList.remove('is-invalid');
                element.nextElementSibling.style.display = "none";
            }
        }
    };
    Form.init();
})();