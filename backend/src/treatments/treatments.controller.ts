import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { TreatmentInfo } from './dto/treatment-info.dto'; 

@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  @Roles('owner')
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateTreatmentDto, @Req() req): Observable<TreatmentInfo> {
    return this.treatmentsService.create(dto, req.user.id);
  }

  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req): Observable<DeleteResult> {
    return this.treatmentsService.remove(id, req.user.id);
  }
}
