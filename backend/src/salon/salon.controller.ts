import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteResult } from 'typeorm';
import { Observable } from 'rxjs';
import { SalonInfo } from './dto/salon-info.dto';
import { PaginationDto } from 'src/pagination/paginate.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Salon } from './entities/salon.entity';
import { extname } from 'path';


@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  @Roles('author')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'image', maxCount: 1 }
    ], {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.fieldname === 'image') {
            cb(null, './uploads/salon-images');
          } 
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        }
      })
    }))
    create(@Body() createSalonDto: CreateSalonDto, @UploadedFiles() files: { image?: Express.Multer.File[]}): Observable<Salon> {
      const image = files.image ? files.image[0] : null;

      createSalonDto.image = image.path;

      return this.salonService.create(createSalonDto);
    }

  @Get()
  findAll(@Query() pagination: PaginationDto): Observable<SalonInfo[]>{
    return this.salonService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<SalonInfo>{
    return this.salonService.findOne(id);
  }


  @Get('search')
  searchSalon(
    @Query('text') text: string
  ): Observable<SalonInfo[]>{
    return this.salonService.searchSalon(text);
  }

  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  deleteSalon(@Param('id') id: number): Observable<DeleteResult> {
    return this.salonService.deleteSalon(id);
  }
}
