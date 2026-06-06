import { IBuyer, TPayment } from "../../types";

export class Buyer {
    private data: IBuyer = {
        payment: "null",  // Default payment method
        email: "",
        phone: "",
        address: ""
    };

    updateField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        this.data.payment = value as TPayment; 
        this.data[field] = value;
    }

    getAllData(): IBuyer {
        return { ...this.data };
    }

    clearAll(): void {
        this.data = {
            payment: "null",
            email: "",
            phone: "",
            address: ""
        };
    }
}