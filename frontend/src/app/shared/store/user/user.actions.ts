import { createAction, props } from "@ngrx/store";
import { UserDataDto, UserDataStoreDto } from "../../dtos/user.dto";
import { SavedDto } from "../../dtos/saved.dto";

//UCITAJ KORISNIKOVE PODATKE
export const loadUserData = createAction(
    '[User] Load Data',
    props<{id: number}>()
);
export const loadUserDataSuccess = createAction(
    '[User] Load Data Success',
    props<{user: UserDataStoreDto}>()
);
export const loadUserDataFailure = createAction(
    '[User] Load Data Failure',
    props<{error: string}>()
);

//SACUVAJ SALON 
export const saveSalon = createAction(
    '[Save Salon] Save New Salon',
    props<{user_id: number, salon_id: number}>()
);
export const saveSalonSuccess = createAction(
    '[Save Salon] Save Salon Success',
    props<{savedSalon: SavedDto}>()
);
export const saveSalonFailed = createAction(
    '[Save Salon] Save Salon Failed',
    props<{error: string}>()
);