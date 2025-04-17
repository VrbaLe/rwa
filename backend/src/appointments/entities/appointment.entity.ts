import { Salon } from "src/salon/entities/salon.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Salon, (salon)=>salon.appointments)
    salon: Salon;

    @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
    client: User;

    @Column({ type: 'date' })
    appointmentDate: string;
  
    @Column({ type: 'time' })
    timeSlot: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
