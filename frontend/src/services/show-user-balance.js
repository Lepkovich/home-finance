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
                // if (result.error || !result.balance) {
                //     throw new Error(result.message);
                // }
                this.processBalance(result.balance);
            }

        } catch (error) {
            console.log(error);
        }
    };

    processBalance(balance){
        let balanceValue = document.getElementById('balance-value');
        let userFullName = document.getElementById('userFullName');
        balanceValue.textContent = balance + "$";
        userFullName.textContent = this.userFullName;
    }
}