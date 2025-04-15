import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm';

@Entity()
export class Owner {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.owner)
    @JoinColumn()
    user: User;

    @Column()
    name: string;
  
    @Column({ nullable: true })
    about: string;
  
    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    instagram: string;
}
