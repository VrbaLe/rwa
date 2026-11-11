import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';
import { SalonCardComponent } from '../../shared/components/salon-card/salon-card.component';
import { GeoPoint } from '../../shared/dtos/geo-point.dto';
import { SalonFilterDto } from '../../shared/dtos/salon-filter.dto';
import { SalonViewDto } from '../../shared/dtos/salon-view.dto';
import { CATEGORIES } from '../../shared/local-lists/categories.list';
import { initialFilters } from '../../shared/store/salon/salon.reducer';
import { addFavorite, removeFavorite } from '../../shared/store/favorite/favorite.actions';
import { clearUserLocation, loadSalons, locateUser, resetFilters, setFilters } from '../../shared/store/salon/salon.actions';
import {
  selectCities,
  selectFilteredSalons,
  selectLocating,
  selectLocationError,
  selectSalonError,
  selectSalonFilters,
  selectSalonLoading,
  selectSalonsLoaded,
  selectUserLocation
} from '../../shared/store/salon/salon.selectors';
import { selectIsLoggedIn, selectIsOwner } from '../../shared/store/user/user.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, SalonCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories = CATEGORIES;

  // salons$ = this.store.select(selectFilteredSalons);
  // cities$ = this.store.select(selectCities);
  // loading$ = this.store.select(selectSalonLoading);
  // error$ = this.store.select(selectSalonError);
  // isOwner$ = this.store.select(selectIsOwner);
  salons$: Observable<SalonViewDto[]> = this.store.select(selectFilteredSalons);
  cities$: Observable<string[]> = this.store.select(selectCities);
  loading$: Observable<boolean> = this.store.select(selectSalonLoading);
  error$: Observable<string | null> = this.store.select(selectSalonError);
  isOwner$: Observable<boolean> = this.store.select(selectIsOwner);
  isLoggedIn$: Observable<boolean> = this.store.select(selectIsLoggedIn);
  userLocation$: Observable<GeoPoint | null> = this.store.select(selectUserLocation);
  locating$: Observable<boolean> = this.store.select(selectLocating);
  locationError$: Observable<string | null> = this.store.select(selectLocationError);


  filterForm = this.fb.nonNullable.group({
    search: [initialFilters.search],
    city: [initialFilters.city],
    category: [initialFilters.category],
    minRating: [initialFilters.minRating],
    maxDistance: [initialFilters.maxDistance],
    onlyFavorites: [initialFilters.onlyFavorites],
    sortBy: [initialFilters.sortBy as string],
    order: [initialFilters.order as string]
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ucitaj salone samo ako vec nisu ucitani
    this.store.select(selectSalonsLoaded).pipe(take(1)).subscribe(loaded => {
      if (!loaded) {
        this.store.dispatch(loadSalons());
      }
    });

    // forma uvek prati filtere iz store-a (i kad ih promeni nesto drugo, npr. pronadjena lokacija)
    this.store.select(selectSalonFilters).pipe(takeUntil(this.destroy$)).subscribe(filters => {
      this.filterForm.patchValue(filters, { emitEvent: false });
    });

    // svaka promena forme azurira filtere u store-u
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(setFilters({ filters: this.filterForm.getRawValue() as SalonFilterDto }));
    });
  }

  openSalon(id: number): void {
    this.router.navigate(['/salon', id]);
  }

  toggleFavorite(event: { id: number; favorite: boolean }): void {
    this.store.dispatch(
      event.favorite ? addFavorite({ salon_id: event.id }) : removeFavorite({ salon_id: event.id })
    );
  }

  locate(): void {
    this.store.dispatch(locateUser());
  }

  clearLocation(): void {
    this.store.dispatch(clearUserLocation());
  }


  reset(): void {
    this.store.dispatch(resetFilters());
    //this.filterForm.reset(initialFilters, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}