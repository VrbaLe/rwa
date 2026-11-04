import { Salon } from 'src/salon/entities/salon.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Treatment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'int' })
    price: number;

    @Column({ type: 'int', default: 30 })
    duration: number;

    @ManyToOne(() => Salon, (salon) => salon.treatments, { onDelete: 'CASCADE' })
    salon: Salon;
}
