import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import { Favorite } from './entities/favorite.entity';
import { Salon } from 'src/salon/entities/salon.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
  ) {}

  findSalonIds(userId: number): Observable<number[]> {
    return from(
      this.favoriteRepository.find({
        where: { user: { id: userId } },
        relations: { salon: true },
      }),
    ).pipe(map((favorites) => favorites.map((favorite) => favorite.salon.id)));
  }

  add(userId: number, salonId: number): Observable<{ salonId: number }> {
    return from(this.salonRepository.findOneBy({ id: salonId })).pipe(
      switchMap((salon) => {
        if (!salon) {
          return throwError(() => new NotFoundException('Salon nije pronađen'));
        }
        return from(
          this.favoriteRepository.findOne({
            where: { user: { id: userId }, salon: { id: salonId } },
          }),
        ).pipe(
          switchMap((existing) => {
            if (existing) {
              return of({ salonId });
            }
            const favorite = this.favoriteRepository.create({ user: { id: userId }, salon });
            return from(this.favoriteRepository.save(favorite)).pipe(map(() => ({ salonId })));
          }),
        );
      }),
    );
  }

  remove(userId: number, salonId: number): Observable<{ salonId: number }> {
    return from(
      this.favoriteRepository.findOne({
        where: { user: { id: userId }, salon: { id: salonId } },
      }),
    ).pipe(
      switchMap((favorite) => (favorite ? from(this.favoriteRepository.remove(favorite)) : of(null))),
      map(() => ({ salonId })),
    );
  }
}