import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { CreateGeocodingDto } from './dto/create-geocoding.dto';
import { UpdateGeocodingDto } from './dto/update-geocoding.dto';

@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  // @Post()
  // create(@Body() createGeocodingDto: CreateGeocodingDto) {
  //   return this.geocodingService.create(createGeocodingDto);
  // }

  // @Get()
  // findAll() {
  //   return this.geocodingService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.geocodingService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGeocodingDto: UpdateGeocodingDto) {
  //   return this.geocodingService.update(+id, updateGeocodingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.geocodingService.remove(+id);
  // }
}
