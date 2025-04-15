import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards } from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DeleteResult } from 'typeorm';
import { Observable } from 'rxjs';
import { SalonInfo } from './dto/salon-info.dto';


@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  create(@Body() createSalonDto: CreateSalonDto) {
    //return this.salonService.create(createSalonDto);
  }


  @Get(':id')
  findOne(@Param('id') id: number): Observable<SalonInfo>{
    return this.salonService.findOne(id);
  }


  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  deleteSalon(@Param('id') id: number): Observable<DeleteResult> {
    return this.salonService.deleteSalon(id);
  }
}
