export class ShowButtons {
    constructor() {
    }
    static async init(){
        this.buttons = document.querySelectorAll('.medium'); //выберем все кнопки
                // меняем оформление активных и неактивных кнопок
        this.buttons.forEach(button => {
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
}