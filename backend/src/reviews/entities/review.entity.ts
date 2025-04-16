import { Salon } from "src/salon/entities/salon.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User, user=> user.reviews, {eager:true})
    user: User;

    @ManyToOne(() => Salon, salon => salon.reviews)
    salon: Salon;

    @Column()
    rate: number;

    @Column()
    comment:string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
