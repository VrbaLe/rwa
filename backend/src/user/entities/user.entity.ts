import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Salon } from 'src/salon/entities/salon.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Owner, owner => owner.user, { nullable: true, cascade: true} )
    owner?: Owner;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Appointment, (appointment) => appointment.client)
    appointments: Appointment[];

    @Column({ default: 'user'})
    role: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;


    
}
