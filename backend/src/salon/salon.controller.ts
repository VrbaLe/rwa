import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Query, UseInterceptors, UploadedFiles, Req, ParseIntPipe } from '@nestjs/common';
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

const salonImageOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/salon-images'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  @Roles('owner')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileFieldsInterceptor(
    [{ name: 'image', maxCount: 1 }], 
    salonImageOptions
    )
  )
    create(@Body() createSalonDto: CreateSalonDto, @UploadedFiles() files: { image?: Express.Multer.File[]}, @Req() req): Observable<Salon> {
      const image = files?.image?.[0];
      if (image) {
        createSalonDto.image = image.path;
      }

      return this.salonService.create(createSalonDto, req.user.id);
    }

  @Get()
  findAll(@Query() pagination: PaginationDto): Observable<SalonInfo[]>{
    return this.salonService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<SalonInfo>{
    return this.salonService.findOne(id);
  }

  @Patch(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], salonImageOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalonDto: UpdateSalonDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Req() req,
  ): Observable<SalonInfo> {
    const image = files?.image?.[0];
    if (image) {
      updateSalonDto.image = image.path.replace(/\\/g, '/');
    }
    return this.salonService.update(id, updateSalonDto, req.user.id);
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
