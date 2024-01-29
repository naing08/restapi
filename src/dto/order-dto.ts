import { PaymentInfoDto } from "./payment-dto";

export class OrderDto {
    customerName: string;
    amount: number;
    currency: string;
}