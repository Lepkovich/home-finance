import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class ShowUserBalance {
    constructor() {
        this.balance = null;
        this.userFullName = localStorage.getItem('userFullName');

        this.init();
    }
    async init(){
        try {
            const result = await CustomHttp.request(config.host +  '/balance', 'GET')

            if (result) {
                if (result.error || result.balance === undefined) {
                    this.showError(result.message);
                    throw new Error(result.message);
                }
                this.processBalance(result.balance);
            }

        } catch (error) {
            console.log(error);
            location.href = '#/login';
        }
    };

    showError(message){
        const myModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            backdrop:true
        });
        const text = document.getElementById('error-message');
        text.innerText = message;
        myModal.show(myModal);
        return console.log(message);
    };

    processBalance(balance){
        let balanceValue = document.getElementById('balance-value');
        let userFullName = document.getElementById('userFullName');
        balanceValue.textContent = balance + "$";
        userFullName.textContent = this.userFullName;
    }
}