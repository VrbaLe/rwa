import { createAction, props } from "@ngrx/store";
import { UserSessionDto } from "../../dtos/user-session.dto";
import { UserDataStoreDto } from "../../dtos/user.dto";

//POSTAVI ULOGOVANOG KORISNIKA (iz tokena)
export const setUser = createAction(
    '[User] Set User',
    props<{user: UserSessionDto}>()
);

//OBRISI ULOGOVANOG KORISNIKA
export const clearUser = createAction(
    '[User] Clear User'
);

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