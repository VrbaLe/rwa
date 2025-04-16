import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { from, map, Observable, switchMap } from 'rxjs';
import { PaginationDto } from 'src/pagination/paginate.dto';
import { ReviewDataDto } from './dto/reviewData.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>
  ){}


  create(createReviewDto: CreateReviewDto): Observable<Review> {
    console.log(createReviewDto);
    return from(this.userRepository.findOneBy({id: createReviewDto.user_id})).pipe(
        switchMap((user) => {
            if(!user){
                throw new Error('User not found!');
            }
            return from(this.salonRepository.findOneBy({id: createReviewDto.salon_id})).pipe(
                switchMap((salon) => {
                    if(!salon){
                        throw new Error('Salon not found');
                    }
                    const review = this.reviewRepository.create({user: user, salon: salon, rate: createReviewDto.rate, comment: createReviewDto.comment});
                    return from(this.reviewRepository.save(review));
                }),
            )
        }),
    );
  }

  findBookReviews(
    pagination: PaginationDto,
    id: number
  ): Observable<ReviewDataDto[]>{

    return from(this.reviewRepository.find({
        where: {salon: {id}},
        relations: ['user'],
        skip: pagination.skip,
        take: pagination.limit
    })).pipe(
        map(reviews => 
            reviews.map(review => ({
                email: review.user.email,
                date: review.created_at,
                rate: review.rate,
                comment: review.comment,
                user_email: review.user.email
            }))
        )
    );
  }
   
  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number): Observable<DeleteResult> {
    return from(this.reviewRepository.delete(id));
  }
}
