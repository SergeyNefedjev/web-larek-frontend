import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

interface ISuccess {
    totalAmount: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected closeWindow: HTMLElement;
    protected totalAmount: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this.closeWindow = ensureElement<HTMLElement>('.order-success__close', this.container);
        this.totalAmount = this.container.querySelector('.order-success__description');
        if (actions?.onClick) {
            this.closeWindow.addEventListener('click', actions.onClick);
        }
    }

    set total(total: number) {
        this.setText(this.totalAmount, 'Списано ' + total.toString() + ' синапсов');
    }
}