import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Sidebar} from "./sidebar.js";
import { ShowButtons } from '../services/show-buttons.js'

export class Main extends ShowButtons{

    constructor() {
        super();
        this.earningsChart = document.getElementById('earnings-chart');
        this.expensesChart = document.getElementById('expenses-chart');
        this.emptyText = document.getElementById('emptyText');
        this.charts = document.getElementById('charts');

        this.dataInit();
    }
    async dataInit(){
        await Sidebar.showSidebar('main');
        this.processButtons();

        this.todayButton.onclick = this.getTable.bind(this, 'today');
        this.weekButton.onclick = this.getTable.bind(this, 'week');
        this.monthButton.onclick = this.getTable.bind(this, 'month');
        this.yearButton.onclick = this.getTable.bind(this, 'year');
        this.allButton.onclick = this.getTable.bind(this, 'all');
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
                    await this.showResult(operations.message);
                    throw new Error(operations.message);
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
                    await this.showResult(income.message);
                    throw new Error(income.message);
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
                    await this.showResult(expenses.message)
                    throw new Error(expenses.message);
                }
            }

        } catch (error) {
            console.log(error);
        }

        await this.showOperations(income, expenses, operations);
    };

    async showOperations(income, expenses, operations) {

        if (operations.length === 0) {
            this.charts.style.display = 'none';
            this.emptyText.style.display = 'flex';
        } else {
            this.charts.style.display = 'flex';
            this.emptyText.style.display = 'none';

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
    };
    async showResult(message) {
        return new Promise((resolve) => {
            this.textMessage = message.error ? message.message :
                "Запись успешно удалена." + "\nСообщение сервера: " + JSON.stringify(message);

            this.modalMessageField.innerText = this.textMessage;

            this.resultModal.show();

            // Обработчик события при закрытии попапа
            this.resultModal._element.addEventListener('hidden.bs.modal', () => {
                resolve(); // Разрешаем обещание при закрытии попапа
            });
        });
    };
}
