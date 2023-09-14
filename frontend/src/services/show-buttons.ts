export class ShowButtons {
    public activeButton: HTMLElement | null;
    public todayButton: HTMLElement | null;
    public weekButton: HTMLElement | null;
    public monthButton: HTMLElement | null;
    public yearButton: HTMLElement | null;
    public allButton: HTMLElement | null;
    public periodFrom: HTMLElement | null;
    public periodTo: HTMLElement | null;
    public periodButton: HTMLElement | null;
    public buttons: NodeListOf<HTMLElement>;
    
    
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