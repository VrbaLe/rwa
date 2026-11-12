import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Like, ILike } from 'typeorm';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';
import { from, map, mergeMap, Observable, switchMap, toArray, throwError, of } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { PaginationDto } from 'src/pagination/paginate.dto';
import { SalonInfo } from './dto/salon-info.dto';
import { DeleteResult } from 'typeorm';
import { GeocodingService } from 'src/geocoding/geocoding.service';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
    private geocodingService: GeocodingService,
  ){}

  create(salonData: CreateSalonDto, userId:number): Observable<Salon> {
    return from(
      //this.ownerRepository.findOneBy({ id: salonData.owner })
      this.ownerRepository.findOne({ where: { user: { id: userId } } }),

    ).pipe(
      switchMap((owner) => {
        if (!owner) {
          throw new Error('Owner not found');
        }
        
        const salon = new Salon();
        salon.name = salonData.name;
        salon.description = salonData.description;
        salon.image = salonData.image;
        salon.category = salonData.category;
        salon.city = salonData.city;
        salon.address = salonData.address;
        salon.latitude = this.toCoordinate(salonData.latitude);
        salon.longitude = this.toCoordinate(salonData.longitude);
        salon.tags = salonData.tags;
        salon.owner = owner;
        salon.openTime = salonData.openTime || '09:00';
        salon.closeTime = salonData.closeTime || '17:00';
        salon.workingDays = salonData.workingDays || '1,2,3,4,5,6';

        return this.withCoordinates(salon).pipe(
          switchMap((withCoordinates) => from(this.salonRepository.save(withCoordinates))),
        );
      }),
    );
  }

  findAll(pagination: PaginationDto): Observable<SalonInfo[]> {
    return from(this.salonRepository.find({
       relations: ['owner','reviews', 'treatments'] ,
       skip: pagination.skip,
       take: pagination.limit
      })).pipe(
      map(salons => 
        salons.map(salon => ({
            id: salon.id,
            owner: salon.owner,
            name: salon.name,
            description: salon.description,
            image: salon.image,
            category: salon.category,
            city: salon.city,
            address: salon.address,
            latitude: salon.latitude,
            longitude: salon.longitude,
            tags: salon.tags,
            reviews: (salon.reviews ?? []).map(r => ({
              id: r.id,
              rate: r.rate,
              comment: r.comment,
              created_at: r.created_at,
              user: r.user ? { id: r.user.id } : undefined,
            })),
            openTime: salon.openTime,
            closeTime: salon.closeTime,
            workingDays: salon.workingDays,
            treatments: (salon.treatments ?? []).map((treatment) => ({
              id: treatment.id,
              name: treatment.name,
              price: treatment.price,
              duration: treatment.duration,
            })),
        }))
      )
    )
  }

  findOne(id: number): Observable<SalonInfo> {
    return from(this.salonRepository.findOne({where: {id: id}, relations: ['owner','reviews']}));
  }

  searchSalon(text: string): Observable<SalonInfo[]> {
    return from(this.salonRepository.find({
      relations: ['reviews'],
      where: { name: ILike(`${text}%`)}
    }));
  }

  update(id: number, dto: UpdateSalonDto, userId: number): Observable<SalonInfo> {
    return from(
      this.salonRepository.findOne({ where: { id }, relations: { owner: { user: true } } }),
    ).pipe(
      switchMap((salon) => {
        if (!salon) {
          return throwError(() => new NotFoundException('Salon nije pronađen'));
        }
        if (salon.owner?.user?.id !== userId) {
          return throwError(() => new ForbiddenException('Nemate pravo da menjate ovaj salon'));
        }

        const fields = [
          'name', 'description', 'category', 'city', 'tags',
          'image', 'openTime', 'closeTime', 'workingDays',
        ] as const;

        fields.forEach((field) => {
          const value = dto[field];
          if (value !== undefined && value !== '') {
            salon[field] = value;
          }
        });

        return from(this.salonRepository.save(salon));
      }),
      switchMap((saved) => this.findOne(saved.id)),
    );
  }

  deleteSalon(id: number): Observable<DeleteResult>{
    return from(this.salonRepository.delete({id}));
  }

    // koordinate se traze iz adrese samo ako ih vlasnik nije vec postavio (npr. klikom na mapu)
  private withCoordinates(salon: Salon): Observable<Salon> {
    const hasCoordinates = salon.latitude != null && salon.longitude != null;
    if (hasCoordinates || !salon.address) {
      return of(salon);
    }
    return from(this.geocodingService.geocode(salon.address, salon.city)).pipe(
      map((coordinates) => {
        if (coordinates) {
          salon.latitude = coordinates.latitude;
          salon.longitude = coordinates.longitude;
        }
        return salon;
      }),
    );
  }

  private toCoordinate(value?: string | number | null): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
