import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
import { Treatment } from './entities/treatment.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { TreatmentInfo } from './dto/treatment-info.dto';

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
  ) {}

  create(dto: CreateTreatmentDto, userId: number): Observable<TreatmentInfo>{
    if (!dto.name || Number(dto.price) < 0) {
      return throwError(() => new BadRequestException('Naziv i cena usluge su obavezni'));
    }
    return from(
      this.salonRepository.findOne({
        where: { id: dto.salon_id },
        relations: { owner: { user: true } },
      }),
    ).pipe(
      switchMap((salon) => {
        if (!salon) {
          return throwError(() => new NotFoundException('Salon nije pronađen'));
        }
        if (salon.owner?.user?.id !== userId) {
          return throwError(() => new ForbiddenException('Nemate pravo da menjate ovaj salon'));
        }
        const treatment = this.treatmentRepository.create({
          name: dto.name,
          price: Number(dto.price),
          duration: Number(dto.duration) || 30,
          salon,
        });
        return from(this.treatmentRepository.save(treatment));
      }),
      map((saved) => ({
        id: saved.id,
        name: saved.name,
        price: saved.price,
        duration: saved.duration,
      })),
    );
  }

  // findAll() {
  //   return `This action returns all treatments`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} treatment`;
  // }

  // update(id: number, updateTreatmentDto: UpdateTreatmentDto) {
  //   return `This action updates a #${id} treatment`;
  // }

  remove(id: number, userId: number): Observable<DeleteResult> {
    return from(
      this.treatmentRepository.findOne({
        where: { id },
        relations: { salon: { owner: { user: true } } },
      }),
    ).pipe(
      switchMap((treatment) => {
        if (!treatment) {
          return throwError(() => new NotFoundException('Usluga nije pronađena'));
        }
        if (treatment.salon?.owner?.user?.id !== userId) {
          return throwError(() => new ForbiddenException('Nemate pravo da menjate ovaj salon'));
        }
        return from(this.treatmentRepository.delete(id));
      }),
    );
  }
}
