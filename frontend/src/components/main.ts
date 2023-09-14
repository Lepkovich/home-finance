import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import { ShowButtons } from '../services/show-buttons'
import {GetCategoryIncomeType, GetErrorResponseType, GetOperationsPeriodType} from "../types/backend-response.type";

export class Main extends ShowButtons{
    private readonly earningsChart: HTMLElement | null;
    private readonly expensesChart: HTMLElement | null;
    private emptyText: HTMLElement | null;
    private charts: HTMLElement | null;

    constructor() {
        super();
        this.earningsChart = document.getElementById('earnings-chart');
        this.expensesChart = document.getElementById('expenses-chart');
        this.emptyText = document.getElementById('emptyText');
        this.charts = document.getElementById('charts');

        this.dataInit();
    }
    private async dataInit(): Promise<void>{
        await Sidebar.showSidebar('main');
        this.processButtons();

        // Создаем массив кнопок и их соответствующих обработчиков
        const buttons = [
            { button: this.todayButton, handler: 'today' },
            { button: this.weekButton, handler: 'week' },
            { button: this.monthButton, handler: 'month' },
            { button: this.yearButton, handler: 'year' },
            { button: this.allButton, handler: 'all' },
        ];

        // Добавляем обработчики для существующих кнопок
        buttons.forEach(({ button, handler }) => {
            if (button) {
                button.onclick = this.getTable.bind(this, handler);
            }
        });
        // Добавляем обработчик для periodButton, если он существует
        if (this.periodButton) {

            this.periodButton.onclick = () => {
                if (this.periodFrom && this.periodTo) {
                    const queryString = `interval&dateFrom=${(this.periodFrom as HTMLInputElement).value}&dateTo=${(this.periodTo as HTMLInputElement).value}`;
                    this.getTable(queryString);
                }
            };
        }

/*      предыдущая версия функции
        this.todayButton.onclick = this.getTable.bind(this, 'today');
        this.weekButton.onclick = this.getTable.bind(this, 'week');
        this.monthButton.onclick = this.getTable.bind(this, 'month');
        this.yearButton.onclick = this.getTable.bind(this, 'year');
        this.allButton.onclick = this.getTable.bind(this, 'all');
        this.periodButton.onclick = () => {
            const queryString = `interval&dateFrom=${this.periodFrom.value}&dateTo=${this.periodTo.value}`;
            this.getTable(queryString);
        };*/
    }

    async getTable(period?: string){
        try {
            const [operations, income, expenses] = await Promise.all([
                CustomHttp.request(config.host + '/operations/?period=' + period, 'GET'),
                CustomHttp.request(config.host + '/categories/income', 'GET'),
                CustomHttp.request(config.host + '/categories/expense', 'GET'),
            ]);

            if (operations && !('error' in operations) && income && !('error' in income) && expenses && !('error' in expenses)) {
                await this.showOperations(
                    income as GetCategoryIncomeType[],
                    expenses as GetCategoryIncomeType[],
                    operations as GetOperationsPeriodType[]
                );
            } else {
                if (operations && 'error' in operations) {
                    await this.showResult(operations as GetErrorResponseType);
                    throw new Error((operations as GetErrorResponseType).message);
                }
                if (income && 'error' in income) {
                    await this.showResult(income as GetErrorResponseType);
                    throw new Error((income as GetErrorResponseType).message);
                }
                if (expenses && 'error' in expenses) {
                    await this.showResult(expenses as GetErrorResponseType);
                    throw new Error((expenses as GetErrorResponseType).message);
                }
            }
        } catch (error) {
            console.log('Ошибка: ' + error);
        }

/*      предыдущая версия функции:
        let income = null;
        let expenses = null;
        let operations = null;

        //забираем Записи за период
        try {
            const operations: GetOperationsPeriodType[] | GetErrorResponseType = await CustomHttp.request(config.host + '/operations/?period=' + period, 'GET',)

            if (operations) {
                if ((operations as GetErrorResponseType).error || !operations) {
                    await this.showResult(operations as GetErrorResponseType);
                    throw new Error((operations as GetErrorResponseType).message);
                }
            }

        } catch (error) {
            console.log('ошибка' + error);
        }

        //забираем Категории доходов
        try {
            const income: GetCategoryIncomeType[] | GetErrorResponseType = await CustomHttp.request(config.host +  '/categories/income', 'GET', )

            if (income) {
                if ((income as GetErrorResponseType).error || !income) {
                    await this.showResult((income as GetErrorResponseType));
                    throw new Error((income as GetErrorResponseType).message);
                }
            }

        } catch (error) {
            console.log(error);
        }

        //забираем Категории расходов
        try {
            const expenses: GetCategoryIncomeType[] | GetErrorResponseType  = await CustomHttp.request(config.host +  '/categories/expense', 'GET', )

            if (expenses) {
                if ((expenses as GetErrorResponseType).error || !expenses) {
                    await this.showResult(expenses as GetErrorResponseType)
                    throw new Error((expenses as GetErrorResponseType).message);
                }
            }

        } catch (error) {
            console.log(error);
        }
        if (income && expenses && operations) {
            await this.showOperations(income, expenses, operations);
        }*/
    };

    async showOperations(income: GetCategoryIncomeType[], expenses: GetCategoryIncomeType[], operations: GetOperationsPeriodType[]) {

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
