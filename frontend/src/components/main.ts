import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Sidebar} from "./sidebar";
import { ShowButtons } from '../services/show-buttons'
import {GetCategoryIncomeType, GetErrorResponseType, GetOperationsPeriodType} from "../types/backend-response.type";
import * as bootstrap from "bootstrap";
// import {Chart, ChartType, PieController, ArcElement} from "chart.js";
// import * as chart from "chart.js";
import Chart, { ChartType } from 'chart.js/auto';



export class Main extends ShowButtons{
    private earningsChart: Chart | null;
    private expensesChart: Chart | null;
    private readonly earningsChartCanvas: HTMLCanvasElement | null;
    private readonly expensesChartCanvas: HTMLCanvasElement | null;
    private readonly emptyText: HTMLElement | null;
    private readonly charts: HTMLElement | null;
    private resultModal!: bootstrap.Modal;
    private textMessage: string | null;
    private readonly modalMessageField: HTMLElement | null;

    constructor() {
        super();

        // Chart.register(PieController, ArcElement);

        this.earningsChart = null;
        this.expensesChart = null;

        //определяем параметры модального окна
        const textModalElement = document.getElementById('textModal');
        if (textModalElement !== null) {
            this.resultModal = new bootstrap.Modal(textModalElement);
        }
        this.textMessage = null;
        this.modalMessageField = document.getElementById('textModal-message');

        this.earningsChartCanvas = document.getElementById('earnings-chart') as HTMLCanvasElement;
        this.expensesChartCanvas = document.getElementById('expenses-chart') as HTMLCanvasElement;
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

    private async getTable(period?: string): Promise<void>{
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

        if (this.charts && this.emptyText && this.earningsChartCanvas && this.expensesChartCanvas) {
            if (operations.length === 0) {
                this.charts.style.display = 'none';
                this.emptyText.style.display = 'flex';
            } else {
                this.charts.style.display = 'flex';
                this.emptyText.style.display = 'none';

                // Проверка и уничтожение существующих графиков
                if (this.earningsChart) {
                    this.earningsChart.destroy();
                }

                if (this.expensesChart) {
                    this.expensesChart.destroy();
                }


                const earningsContext = this.earningsChartCanvas.getContext("2d");
                if (earningsContext) {
                    earningsContext.clearRect(0, 0, this.earningsChartCanvas.width, this.earningsChartCanvas.height);
                }

                const expensesContext = this.expensesChartCanvas.getContext("2d");
                if (expensesContext) {
                    expensesContext.clearRect(0, 0, this.expensesChartCanvas.width, this.expensesChartCanvas.height);
                }


                //отсортируем из операций только доходы, оставим только непустые категории и просуммируем все доходы в них
                const incomeData = operations.reduce((data:{amounts: number[], labels: string[]}, operation) => {
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


                this.earningsChart = new Chart(this.earningsChartCanvas, {
                    type: 'pie' as ChartType,
                    data: {
                        labels: incomeData.labels,
                        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: 'Сумма Доходов',
                            data: incomeData.amounts,
                            // data: [12, 19, 3, 5, 2, 3],
                            borderWidth: 1 ,
                            backgroundColor: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                            hoverOffset: 4
                        }]
                    },

                    options: {
                        devicePixelRatio: 4,
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        weight: '500',
                                    },
                                    color: "#000000",
                                },
                            },
                        },
                    }
                });

                //отсортируем из операций только расходы, оставим только непустые категории и просуммируем все расходы в них
                const expensesData = operations.reduce((data:{amounts: number[], labels: string[]}, operation) => {
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

                this.expensesChart = new Chart(this.expensesChartCanvas, {
                    type: 'pie' as ChartType,
                    data: {
                        labels: expensesData.labels,
                        datasets: [{
                            label: 'Сумма расходов',
                            data: expensesData.amounts,
                            borderWidth: 1,
                            backgroundColor: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                            hoverOffset: 4
                        }]
                    },
                });
            }
        }
    };


    private async showResult(message: GetErrorResponseType): Promise<void> {
        return new Promise((resolve) => {

            if (message.error && this.modalMessageField) {
                this.textMessage = message.message;
                this.modalMessageField.innerText = this.textMessage;
            }


            this.resultModal.show();

            // Обработчик события при закрытии попапа
            addEventListener('click', () => {
                this.resultModal.hide();
                resolve(); // Разрешаем обещание при закрытии попапа
            });
            // this.resultModal._element.addEventListener('hidden.bs.modal', () => {
            //     resolve(); // Разрешаем обещание при закрытии попапа
            // });
        });
    };
}
