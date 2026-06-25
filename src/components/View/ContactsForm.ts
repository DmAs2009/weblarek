import { IEvents } from '../base/Events';
import { Form } from './FormValidation';

//Интерфейс для контактов
export interface IContacts {

  phone: string;
  email: string;
}

export class ContactsForm extends Form<IContacts> {
  
  constructor(
    container: HTMLFormElement,
    events: IEvents
  ) {
    super(container, events);
  }
}