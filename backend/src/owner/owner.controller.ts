import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Observable } from 'rxjs';
import { Owner } from './entities/owner.entity';
import { User } from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'typeorm';
import { OwnerDataDto } from './dto/ownerData.dto';

@Controller('owner')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Post()
  @Roles('owner')
  @UseGuards(RolesGuard)
  create(@Body() createOwnerDto: CreateOwnerDto): Observable<User> {
    return this.ownerService.create(createOwnerDto);
  }

  @Get()
  findAll(): Observable<OwnerDataDto[]> {
    return this.ownerService.findAll();
  }

  @Get('findById/:id')
  findOne(@Param('id') id: number): Observable<Owner> {
    return this.ownerService.findOne(id);
  }

  @Put(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('picture', {
    dest: './uploads',
  }))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() ownerData: UpdateOwnerDto
  ): Observable<UpdateResult>{
    const { picture, ...authorDataWithoutPicture } = ownerData;
    const picturePath = file ? file.path : null;

    const updatedAuthorData: UpdateOwnerDto = {
      ...authorDataWithoutPicture,
      picture: picturePath
    };

    return this.ownerService.update(id, updatedAuthorData);  
  }

  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: number): Observable<void> {
    return this.ownerService.remove(id);
  }
}
