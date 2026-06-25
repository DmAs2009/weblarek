import { IBuyer} from "../../types";

export class Buyer {
    protected payment: TPayment = '';
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';

    constructor (protected events: IEvents) {}

    updateBuyer(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment
        }

        if (data.email !== undefined) {
            this.email = data.email
        }

        if (data.phone !== undefined) {
            this.phone = data.phone
        }

        if (data.address !== undefined) {
            this.address = data.address
        }

        this.events.emit('order:updated')
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        }
    }

    clearBuyerData(): void {
        this.payment = '' as TPayment;
        this.email = '';
        this.phone = '';
        this.address = '';

        this.events.emit('order:updated')
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errorsMessages: Partial<Record<keyof IBuyer, string>> = {}

        if (!this.payment) {
            errorsMessages.payment = 'Не выбран вид оплаты'
        }
        if (!this.email) {
            errorsMessages.email = 'Укажите адрес электронной почты'
        }
        if (!this.phone) {
            errorsMessages.phone = 'Введите номер телефона'
        }
        if (!this.address) {
            errorsMessages.address = 'Укажите адрес для доставки'
        }

        return errorsMessages
    }
}