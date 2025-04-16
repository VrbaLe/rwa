import { Owner } from 'src/owner/entities/owner.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany,ManyToOne} from 'typeorm';
import { Review } from 'src/reviews/entities/review.entity';

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

    
    @ManyToOne(() => Owner, (owner) => owner.salons , {eager: true})
    owner: Owner;


    @OneToMany(() => Review, review => review.salon, {cascade: true, onDelete: 'CASCADE'})
    reviews: Review[];


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
