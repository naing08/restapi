import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Currency, Status } from "./enums"

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    customerName: string

    @Column()
    currency: Currency

    @Column()
    totalAmount: number

    @Column()
    status: Status;
}
