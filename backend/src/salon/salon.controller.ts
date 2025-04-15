import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalonService } from './salon.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Post()
  create(@Body() createSalonDto: CreateSalonDto) {
    //return this.salonService.create(createSalonDto);
  }

  @Get()
  findAll() {
    return this.salonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalonDto: UpdateSalonDto) {
    return this.salonService.update(+id, updateSalonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salonService.remove(+id);
  }
}
