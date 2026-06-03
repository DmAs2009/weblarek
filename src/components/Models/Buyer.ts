import { IBuyer, TPayment } from "../../types";

export class Buyer {
    private data: IBuyer = {
        payment: "online",  // Default payment method
        email: "",
        phone: "",
        address: ""
    };

    updateField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        if (field === "payment") {
            if (!["cash", "online"].includes(value)) {
                throw new Error(`Invalid payment method. Must be "cash" or "online"`);
            }
            this.data.payment = value as TPayment;  // Type assertion after validation
        } else {
            this.data[field] = value;
        }
    }

    saveAll(buyerData: Partial<IBuyer>): void {
        Object.entries(buyerData).forEach(([field, value]) => {
            const key = field as keyof IBuyer;

            if (key === "payment") {
                if (value && !["cash", "online"].includes(value)) {
                    throw new Error(`Invalid payment method. Must be "cash" or "online"`);
                }
                this.data.payment = value as TPayment;  // Type assertion after validation
            } else {
                this.data[key] = value as IBuyer[keyof IBuyer];  // Type assertion for other fields
            }
        });
    }

    getAllData(): IBuyer {
        return { ...this.data };
    }

    clearAll(): void {
        this.data = {
            payment: "online",
            email: "",
            phone: "",
            address: ""
        };
    }
}