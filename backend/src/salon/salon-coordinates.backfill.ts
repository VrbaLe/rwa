import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { GeocodingService } from 'src/geocoding/geocoding.service';
import { Salon } from './entities/salon.entity';

@Injectable()
export class SalonCoordinatesBackfill implements OnApplicationBootstrap {
  private readonly logger = new Logger(SalonCoordinatesBackfill.name);

  constructor(
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    private geocodingService: GeocodingService,
  ) {}

  onApplicationBootstrap(): void {
    void this.run(); // u pozadini, ne usporava pokretanje aplikacije
  }

  private async run(): Promise<void> {
    const salons = await this.salonRepository.find({
      where: { latitude: IsNull(), address: Not(IsNull()) },
    });
    if (!salons.length) {
      return;
    }
    this.logger.log(`Odredjujem koordinate za ${salons.length} salona`);

    for (const salon of salons) {
      if (!salon.address?.trim()) {
        continue;
      }
      const coordinates = await this.geocodingService.geocode(salon.address, salon.city);
      if (coordinates) {
        await this.salonRepository.update(salon.id, coordinates);
      } else {
        this.logger.warn(`Adresa nije pronadjena za salon ${salon.id}: ${salon.address}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
    this.logger.log('Odredjivanje koordinata je zavrseno');
  }
}