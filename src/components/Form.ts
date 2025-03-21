import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected submit: HTMLButtonElement;
    protected button?: NodeListOf<HTMLButtonElement>;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.button = this.container.querySelectorAll<HTMLButtonElement>(".order__buttons button");

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    buttonActive() {
        this.button.forEach((button) => {
          button.addEventListener("click", () => {
            this.button.forEach((btn) => this.toggleClass(btn, 'button_alt-active', btn === button)); 
            });
        });
      }
      
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });    
        Object.assign(this, inputs);    
        this.buttonActive();    
        return this.container;
    }
}