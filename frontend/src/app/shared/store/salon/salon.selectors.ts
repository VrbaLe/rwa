import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalonState, salonAdapter } from './salon.reducer';
import { selectOwnerEntities } from '../owner/owner.selectors';
import { SalonViewDto } from '../../dtos/salon-view.dto';
import { SalonFilterDto } from '../../dtos/salon-filter.dto';

export const selectSalonState = createFeatureSelector<SalonState>('salon');

const { selectAll, selectEntities } = salonAdapter.getSelectors();

// OSNOVNO
export const selectAllSalons = createSelector(selectSalonState, selectAll);
export const selectSalonEntities = createSelector(selectSalonState, selectEntities);
export const selectSalonsLoaded = createSelector(selectSalonState, (state) => state.salonsLoaded);
export const selectNewSalonAdded = createSelector(selectSalonState, (state) => state.newSalonAdded);
export const selectSalonLoading = createSelector(selectSalonState, (state) => state.loading);
export const selectSalonError = createSelector(selectSalonState, (state) => state.error);
export const selectSalonFilters = createSelector(selectSalonState, (state) => state.filters);
export const selectSelectedSalonId = createSelector(selectSalonState, (state) => state.selectedSalonId);

// SALON + VLASNIK + PROSECNA OCENA
const average = (rates: number[]): number =>
  rates.length ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0;

export const selectSalonViews = createSelector(
  selectAllSalons,
  selectOwnerEntities,
  (salons, owners): SalonViewDto[] =>
    salons.map((salon) => ({
      ...salon,
      owner: owners[salon.ownerId],
      avgRating: average(salon.reviews.map((review) => review.rate)),
      reviewCount: salon.reviews.length,
    })),
);

// FILTRIRANJE I SORTIRANJE
const comparators: Record<
  SalonFilterDto['sortBy'],
  (a: SalonViewDto, b: SalonViewDto) => number
> = {
  rating: (a, b) => a.avgRating - b.avgRating,
  reviews: (a, b) => a.reviewCount - b.reviewCount,
  name: (a, b) => a.name.localeCompare(b.name),
  newest: (a, b) => a.id - b.id,
};

export const selectFilteredSalons = createSelector(
  selectSalonViews,
  selectSalonFilters,
  (salons, filters) => {
    const city = filters.city.trim().toLowerCase();
    const search = filters.search.trim().toLowerCase();
    const direction = filters.order === 'ASC' ? 1 : -1;

    return salons
      .filter((salon) => !city || (salon.city ?? '').toLowerCase().includes(city))
      .filter((salon) => !filters.category || salon.category === filters.category)
      .filter((salon) => !search || salon.name.toLowerCase().includes(search))
      .filter((salon) => salon.avgRating >= filters.minRating)
      .sort((a, b) => comparators[filters.sortBy](a, b) * direction);
  },
);

export const selectFilteredSalonsCount = createSelector(
  selectFilteredSalons,
  (salons) => salons.length,
);

// GRADOVI ZA PADAJUCI MENI
export const selectCities = createSelector(selectAllSalons, (salons) =>
  [...new Set(salons.map((salon) => salon.city).filter((city): city is string => !!city))].sort(),
);

// JEDAN SALON
export const selectSelectedSalon = createSelector(
  selectSalonViews,
  selectSelectedSalonId,
  (salons, id) => salons.find((salon) => salon.id === id) ?? null,
);

export const selectSalonById = (id: number) =>
  createSelector(selectSalonViews, (salons) => salons.find((salon) => salon.id === id) ?? null);

// SALONI JEDNOG VLASNIKA
export const selectSalonsByOwner = (ownerId: number) =>
  createSelector(selectSalonViews, (salons) => salons.filter((salon) => salon.ownerId === ownerId));