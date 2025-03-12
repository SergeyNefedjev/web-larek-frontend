import { Form } from "./Form";
import { IEvents } from "./base/events";

export interface IInfoContacts {
    email: string;
    phone: string;
  }

export class InfoContacts extends Form<IInfoContacts> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}