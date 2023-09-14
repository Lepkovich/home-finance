export class ShowButtons {
    public activeButton: HTMLElement | null;
    private todayButton: HTMLElement | null;
    private weekButton: HTMLElement | null;
    private monthButton: HTMLElement | null;
    private yearButton: HTMLElement | null;
    private allButton: HTMLElement | null;
    private periodFrom: HTMLElement | null;
    private periodTo: HTMLElement | null;
    private periodButton: HTMLElement | null;
    private buttons: NodeListOf<HTMLElement>;
    
    
    constructor() {
        this.activeButton = null;
        this.todayButton = document.getElementById('today');
        this.weekButton = document.getElementById('week');
        this.monthButton = document.getElementById('month');
        this.yearButton = document.getElementById('year');
        this.allButton = document.getElementById('all');
        this.periodFrom = document.getElementById('periodFrom');
        this.periodTo = document.getElementById('periodTo');
        this.periodButton = document.getElementById('period');
        this.buttons = document.querySelectorAll('.medium');
    }
    processButtons() {
        // меняем оформление активных и неактивных кнопок
        this.buttons.forEach((button) => {
            button.addEventListener('click', () => {
                if (this.activeButton !== null) {
                    this.activeButton.classList.remove('btn-secondary');
                    this.activeButton.classList.add('btn-outline-secondary');
                }
                button.classList.add('btn-secondary');
                button.classList.remove('btn-outline-secondary');
                this.activeButton = button;
            });
        });
    }
}