import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Query} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Observable } from 'rxjs'
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ReviewDataDto } from './dto/reviewData.dto'; 
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post()
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  create(@Body() createReviewDto: CreateReviewDto): Observable<Review> {
      return this.reviewService.create(createReviewDto);
  }

  @Get('book-review/:id')
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  findUserSavedAds(
      @Param('id') id: number,
      @Query('page') skip: number,
      @Query('limit') limit: number
  ): Observable<ReviewDataDto[]> {
      return this.reviewService.findBookReviews({skip, limit}, id);
  }
  
  @Delete(':id')
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: number): Observable<DeleteResult> {
      return this.reviewService.remove(id);
  }
}
