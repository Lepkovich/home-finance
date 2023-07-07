import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Main{

    constructor() {
        const showUserBalance = new ShowUserBalance();
        showUserBalance.processBalance();
        this.processExpenses();
        this.processIncome();
    }

    async processExpenses(){
        try {
            const result = await CustomHttp.request(config.host +  '/categories/expense', 'GET', )

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                this.showExpenses(result);
            }

        } catch (error) {
            console.log(error);
        }
    };
    async processIncome(){
        try {
            const result = await CustomHttp.request(config.host +  '/categories/income', 'GET', )

            if (result) {
                if (result.error || !result) {
                    throw new Error();
                }
                this.showIncome(result);
            }

        } catch (error) {
            console.log(error);
        }
    };
    showExpenses(expenses){
        //создаем структуру html
        const expensesBlock = document.getElementById('expenses-block')
        const ul = document.createElement("ul");
        ul.classList.add("expenses-list");
        expenses.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item.id + ': ' + item.title;
            ul.appendChild(li);
        });
        expensesBlock.appendChild(ul);

    };
    showIncome(income){
        //создаем структуру html
        const incomeBlock = document.getElementById('income-block')
        const ul = document.createElement("ul");
        ul.classList.add("expenses-list");
        income.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item.id + ': ' + item.title;
            ul.appendChild(li);
        });
        incomeBlock.appendChild(ul);

    };


}