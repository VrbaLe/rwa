import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Salon } from 'src/salon/entities/salon.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Review } from 'src/reviews/entities/review.entity';


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

    @Column({ default: 'user'})
    role: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;


    
}
