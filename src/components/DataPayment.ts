import { Form } from "./Form";
import { IEvents } from "./base/events";

export interface IDataPayment {
    payment: string;
    address: string;  
  }
  
export class DataPayment extends Form<IDataPayment> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    const paymentButtons = this.container.querySelectorAll<HTMLButtonElement>(".order__buttons button");
    paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const payment = button.name as IDataPayment['payment'];
        this.onInputChange("payment", payment);
      });
    });
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}