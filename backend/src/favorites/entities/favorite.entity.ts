import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Salon } from 'src/salon/entities/salon.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
@Unique(['user', 'salon'])
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Salon, { onDelete: 'CASCADE' })
    salon: Salon;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}