// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
// import { AppointmentsService } from './appointments.service';
// import { CreateAppointmentDto } from './dto/create-appointment.dto';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';
// import { Roles } from 'src/auth/decorators/roles.decorator';
// import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { Observable } from 'rxjs';
// import { Appointment } from './entities/appointment.entity';

// @Controller('appointments')
// export class AppointmentsController {
//   constructor(private readonly appointmentsService: AppointmentsService) {}

//   @Post()
//   @Roles('owner', 'user')
//   @UseGuards(RolesGuard)
//   create(@Body() createAppointmentDto: CreateAppointmentDto): Observable<Appointment> {
//     return this.appointmentsService.create(createAppointmentDto);
//   }

//   @Get()
//   findAll() {
//     return this.appointmentsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.appointmentsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
//     return this.appointmentsService.update(+id, updateAppointmentDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.appointmentsService.remove(+id);
//   }
// }
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentInfo } from './dto/appointment-info.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateAppointmentDto, @Req() req): Observable<AppointmentInfo> {
    return this.appointmentsService.create(dto, req.user.id);
  }

  @Get()
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  findAll(@Req() req): Observable<AppointmentInfo[]> {
    return this.appointmentsService.findAll(req.user.id);
  }

  @Delete(':id')
  @Roles('owner', 'user')
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req): Observable<DeleteResult> {
    return this.appointmentsService.remove(id, req.user.id);
  }
}