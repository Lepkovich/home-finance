import {ShowUserBalance} from "../services/show-user-balance.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Main{

    constructor() {
        this.earningsChart = document.getElementById('earnings-chart');
        this.expensesChart = document.getElementById('expenses-chart');
        this.period = 'all';
        this.todayButton = null;
        this.weekButton = null;
        this.monthButton = null;
        this.yearButton = null;
        this.allButton = null;
        this.periodButton = null;
        this.periodFrom = null;
        this.periodTo = null;

        // обрабатываем кнопку меню на sidebar
        const homeMenuItem = document.getElementById("main");
        homeMenuItem.querySelector("a.nav-link").classList.remove("link-body-emphasis");
        homeMenuItem.querySelector("a.nav-link").classList.add("active");

        homeMenuItem.querySelector("a.nav-link").removeAttribute("href");
        const iconElement = homeMenuItem.querySelector("img");
        iconElement.src = "static/images/home-icon.png";


        this.dataInit();
    }

    async dataInit(){
        await ShowUserBalance.init();
        await this.processForm();
    }


    async processForm() {

        const buttons = document.querySelectorAll('.medium'); //выберем все кнопки
        let activeButton = null;
        // меняем оформление активных и неактивных кнопок
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (activeButton !== null) {
                    activeButton.classList.remove('btn-secondary');
                    activeButton.classList.add('btn-outline-secondary');
                }
                button.classList.add('btn-secondary');
                button.classList.remove('btn-outline-secondary');
                activeButton = button;
            });
        });

        this.todayButton = document.getElementById('today');
        this.todayButton.onclick = this.getTable.bind(this, 'today');

        this.weekButton = document.getElementById('week');
        this.weekButton.onclick = this.getTable.bind(this, 'week');

        this.monthButton = document.getElementById('month');
        this.monthButton.onclick = this.getTable.bind(this, 'month');

        this.yearButton = document.getElementById('year');
        this.yearButton.onclick = this.getTable.bind(this, 'year');

        this.allButton = document.getElementById('all');
        this.allButton.onclick = this.getTable.bind(this, 'all');

        this.periodFrom = document.getElementById('periodFrom');
        this.periodTo = document.getElementById('periodTo');

        this.periodButton = document.getElementById('period');
        this.periodButton.onclick = () => {
            const queryString = `interval&dateFrom=${this.periodFrom.value}&dateTo=${this.periodTo.value}`;
            this.getTable(queryString);
        };
    }

    async getTable(period){
        let  income = null;
        let expenses = null;
        let operations = null;

        //забираем Записи за период
        try {
            operations = await CustomHttp.request(config.host + '/operations/?period=' + period, 'GET',)

            if (operations) {
                if (operations.error || !operations) {
                    throw new Error();
                }
            }

        } catch (error) {
            console.log('ошибка' + error);
        }

        //забираем Категории доходов
        try {
            income = await CustomHttp.request(config.host +  '/categories/income', 'GET', )

            if (income) {
                if (income.error || !income) {
                    throw new Error();
                }
            }

        } catch (error) {
            console.log(error);
        }

        //забираем Категории расходов
        try {
            expenses = await CustomHttp.request(config.host +  '/categories/expense', 'GET', )

            if (expenses) {
                if (expenses.error || !expenses) {
                    throw new Error();
                }
            }

        } catch (error) {
            console.log(error);
        }

        await this.showOperations(income, expenses, operations);
    };

    async showOperations(income, expenses, operations) {

        // Очищаем канвасы и уничтожаем объекты графиков
        if (this.earningsChart.chart) {
            this.earningsChart.chart.destroy();
        }
        const earningsContext = this.earningsChart.getContext("2d");
        earningsContext.clearRect(0, 0, this.earningsChart.width, this.earningsChart.height);

        if (this.expensesChart.chart) {
            this.expensesChart.chart.destroy();
        }
        const expensesContext = this.expensesChart.getContext("2d");
        expensesContext.clearRect(0, 0, this.expensesChart.width, this.expensesChart.height);



        //отсортируем из операций только доходы, оставим только непустые категории и просуммируем все доходы в них
        const incomeData = operations.reduce((data, operation) => {
            if (operation.type === 'income') {
                const categoryIndex = data.labels.indexOf(operation.category);
                if (categoryIndex !== -1) {
                    data.amounts[categoryIndex] += operation.amount;
                } else {
                    data.labels.push(operation.category);
                    data.amounts.push(operation.amount);
                }
            }
            return data;
        }, { labels: [], amounts: [] });

        const earningsChart = new Chart(this.earningsChart, {
            type: 'pie',
            data: {
                labels: incomeData.labels,
                // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: 'Сумма Доходов',
                    data: incomeData.amounts,
                    // data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1
                }]
            },

            options: {
                // scales: {
                //     y: {
                //         beginAtZero: true
                //     }
                // }
            }
        });

        //отсортируем из операций только расходы, оставим только непустые категории и просуммируем все расходы в них
            const expensesData = operations.reduce((data, operation) => {
            if (operation.type === 'expense') {
                const categoryIndex = data.labels.indexOf(operation.category);
                if (categoryIndex !== -1) {
                    data.amounts[categoryIndex] += operation.amount;
                } else {
                    data.labels.push(operation.category);
                    data.amounts.push(operation.amount);
                }
            }
            return data;
        }, { labels: [], amounts: [] });

        console.log(expensesData);

        const expensesChart = new Chart(this.expensesChart, {
            type: 'pie',
            data: {
                labels: expensesData.labels,
                datasets: [{
                    label: 'Сумма расходов',
                    data: expensesData.amounts,
                    borderWidth: 1
                }]
            },
        });

        // Сохраняем ссылки на объекты графиков
        this.earningsChart.chart = earningsChart;
        this.expensesChart.chart = expensesChart;
    }
}
