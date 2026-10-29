import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentInfo } from './dto/appointment-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Salon } from 'src/salon/entities/salon.entity';
import { User } from 'src/user/entities/user.entity';
import { from, map, Observable, switchMap, catchError, throwError } from 'rxjs';


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

  // create(createAppointmentDto: CreateAppointmentDto): Observable<Appointment> {
  //   return from(this.userRepository.findOneBy({ id: createAppointmentDto.client_id })).pipe(
  //     switchMap((user) => {
  //       if (!user) {
  //         throw new Error('User not found!');
  //       }

  //       return from(this.salonRepository.findOneBy({ id: createAppointmentDto.salon_id })).pipe(
  //         switchMap((salon) => {
  //           if (!salon) {
  //             throw new Error('Salon not found');
  //           }
  //           const appointment = this.appointmentRepository.create({
  //             salon: salon,
  //             client: user,
  //             appointmentDate: createAppointmentDto.appointmentDate,
  //             timeSlot: createAppointmentDto.timeSlot,
  //           });
  //           return from(this.appointmentRepository.save(appointment));
  //         })
  //       );
  //     })
  //   );
  // }

  // findAll(): Observable<Appointment[]> {
  //   return from(
  //     this.appointmentRepository.find({
  //       relations: ['salon', 'client'],
  //     }),
  //   );
  // }


  // findOne(id: number) {
  //   return `This action returns a #${id} appointment`;
  // }

  // update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   return `This action updates a #${id} appointment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} appointment`;
  // }
  create(dto: CreateAppointmentDto, userId: number): Observable<AppointmentInfo> {
    return from(this.salonRepository.findOneBy({ id: dto.salon_id })).pipe(
      switchMap((salon) => {
        if (!salon) {
          return throwError(() => new NotFoundException('Salon nije pronađen'));
        }
        return from(
          this.appointmentRepository.findOne({
            where: {
              salon: { id: salon.id },
              appointmentDate: dto.appointmentDate,
              timeSlot: dto.timeSlot,
            },
          }),
        ).pipe(
          switchMap((existing) => {
            if (existing) {
              return throwError(() => new ConflictException('Termin je već zauzet'));
            }
            return from(this.userRepository.findOneBy({ id: userId })).pipe(
              switchMap((user) => {
                if (!user) {
                  return throwError(() => new NotFoundException('Korisnik nije pronađen'));
                }
                const appointment = this.appointmentRepository.create({
                  salon,
                  client: user,
                  appointmentDate: dto.appointmentDate,
                  timeSlot: dto.timeSlot,
                });
                return from(this.appointmentRepository.save(appointment));
              }),
            );
          }),
        );
      }),
      map((saved) => this.toInfo(saved, userId)),
      catchError((error) =>
        error?.code === '23505'
          ? throwError(() => new ConflictException('Termin je već zauzet'))
          : throwError(() => error),
      ),
    );
  }

  findAll(userId: number): Observable<AppointmentInfo[]> {
    return from(
      this.appointmentRepository.find({
        relations: { salon: { owner: { user: true } }, client: true },
        order: { appointmentDate: 'ASC', timeSlot: 'ASC' },
      }),
    ).pipe(map((appointments) => appointments.map((a) => this.toInfo(a, userId))));
  }

  remove(id: number, userId: number): Observable<DeleteResult> {
    return from(
      this.appointmentRepository.findOne({
        where: { id },
        relations: { salon: { owner: { user: true } }, client: true },
      }),
    ).pipe(
      switchMap((appointment) => {
        if (!appointment) {
          return throwError(() => new NotFoundException('Termin nije pronađen'));
        }
        const isClient = appointment.client?.id === userId;
        const isSalonOwner = appointment.salon?.owner?.user?.id === userId;
        if (!isClient && !isSalonOwner) {
          return throwError(() => new ForbiddenException('Nemate pravo da otkažete ovaj termin'));
        }
        return from(this.appointmentRepository.delete(id));
      }),
    );
  }

  // email klijenta vide samo klijent i vlasnik tog salona, ostali dobijaju samo id
  private toInfo(appointment: Appointment, userId: number): AppointmentInfo {
    const isClient = appointment.client?.id === userId;
    const isSalonOwner = appointment.salon?.owner?.user?.id === userId;

    return {
      id: appointment.id,
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      created_at: appointment.created_at,
      salon: { id: appointment.salon.id, name: appointment.salon.name },
      client: {
        id: appointment.client.id,
        email: isClient || isSalonOwner ? appointment.client.email : undefined,
      },
    };
  }
}
