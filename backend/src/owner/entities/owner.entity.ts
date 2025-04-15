import { Salon } from 'src/salon/entities/salon.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm';

@Entity()
export class Owner {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.owner)
    @JoinColumn()
    user: User;

    @OneToMany(() => Salon, (salon) => salon.owner)
    salons: Salon[];

    @Column()
    firstName: string;
  
    @Column()
    lastName: string;

    @Column({ nullable: true })
    about: string;
  
    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    instagram: string;

    @Column({ nullable: true })
    linkedin: string;
}
