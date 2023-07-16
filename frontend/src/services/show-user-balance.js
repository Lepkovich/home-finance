import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class ShowUserBalance {
    constructor() {
        // this.balance = null;
        // this.userFullName = localStorage.getItem('userFullName');

        // this.init();
    }
    static async init(){
        let balanceValue = document.getElementById('balance-value');
        let userFullName = document.getElementById('userFullName');
        try {
            const result = await CustomHttp.request(config.host +  '/balance', 'GET')

            if (result) {
                if (result.error || result.balance === undefined) {
                    throw new Error(result.message);
                }
                balanceValue.textContent = result.balance + "$";
                userFullName.textContent = localStorage.getItem('userFullName');
            }

        } catch (error) {
            console.log(error);
            location.href = '#/login';
        }
    };


    // processBalance(balance){
    //     let balanceValue = document.getElementById('balance-value');
    //     let userFullName = document.getElementById('userFullName');
    //     balanceValue.textContent = balance + "$";
    //     userFullName.textContent = this.userFullName;
    // }
}