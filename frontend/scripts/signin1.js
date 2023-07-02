(function (){
    const SignIn = {
        fields: [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //регулярка для email
            }
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
            if (!element.value || !element.value.match(field.regex)) {
                element.classList.add('is-invalid');
                if (element.validationMessage) {
                    element.nextElementSibling.innerText = element.validationMessage;
                }
                element.nextElementSibling.style.display = 'flex';
            } else {
                element.classList.remove('is-invalid');
                element.nextElementSibling.style.display = 'none';
            }
        }
    };
    SignIn.init();
})();