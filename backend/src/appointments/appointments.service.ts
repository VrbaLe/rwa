import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Salon } from 'src/salon/entities/salon.entity';
import { User } from 'src/user/entities/user.entity';
import { from, map, Observable, switchMap } from 'rxjs';


@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createAppointmentDto: CreateAppointmentDto): Observable<Appointment> {
    return from(this.userRepository.findOneBy({ id: createAppointmentDto.client_id })).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not found!');
        }

        return from(this.salonRepository.findOneBy({ id: createAppointmentDto.salon_id })).pipe(
          switchMap((salon) => {
            if (!salon) {
              throw new Error('Salon not found');
            }
            const appointment = this.appointmentRepository.create({
              salon: salon,
              client: user,
              appointmentDate: createAppointmentDto.appointmentDate,
              timeSlot: createAppointmentDto.timeSlot,
            });
            return from(this.appointmentRepository.save(appointment));
          })
        );
      })
    );
  }

  findAll(): Observable<Appointment[]> {
    return from(
      this.appointmentRepository.find({
        relations: ['salon', 'client'],
      }),
    );
  }


  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
