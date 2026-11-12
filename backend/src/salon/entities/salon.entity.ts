import { Owner } from 'src/owner/entities/owner.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany,ManyToOne} from 'typeorm';
import { Review } from 'src/reviews/entities/review.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Treatment } from 'src/treatments/entities/treatment.entity';

@Entity()
export class Salon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    category: string;

    @Column({nullable: true})
    tags: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    address: string;
    
    @Column({ type: 'double precision', nullable: true })
    latitude: number | null;

    @Column({ type: 'double precision', nullable: true })
    longitude: number | null;
    
    @ManyToOne(() => Owner, (owner) => owner.salons , {eager: true})
    owner: Owner;


    @OneToMany(() => Review, review => review.salon, {cascade: true, onDelete: 'CASCADE'})
    reviews: Review[];

    @OneToMany(() => Appointment, (appointment) => appointment.salon)
    appointments: Appointment[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

     @Column({ default: '09:00' })
    openTime: string;

    @Column({ default: '17:00' })
    closeTime: string;

    @Column({ default: '1,2,3,4,5,6' })
    workingDays: string;

    @OneToMany(() => Treatment, (treatment) => treatment.salon)
    treatments: Treatment[];
}
