import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    basketCounter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected basketCounter: HTMLElement;
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');

        this.basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set locked(value: boolean) {
        if (value) {
            this.wrapper.classList.add('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove('page__wrapper_locked');
        }
    }

    set counter(value: number) {
        this.setText(this.basketCounter, String(value));
    }
}