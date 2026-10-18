import { createAction, props } from "@ngrx/store";
import { OwnerDto } from "../../dtos/owner.dto";

//DODAJ ILI AZURIRAJ VLASNIKE (iz salona)
export const upsertOwners = createAction(
    '[Owner] Upsert Owners',
    props<{owners: OwnerDto[]}>()
);

//SVI VLASNICI
export const loadOwners = createAction(
    '[Owner] Load Owners'
);
export const loadOwnersSuccess = createAction(
    '[Owner] Load Owners Success',
    props<{owners: OwnerDto[]}>()
);
export const loadOwnersFailure = createAction(
    '[Owner] Load Owners Failure',
    props<{error: string}>()
);

//JEDAN VLASNIK
export const loadOwner = createAction(
    '[Owner] Load Owner',
    props<{id: number}>()
);
export const loadOwnerSuccess = createAction(
    '[Owner] Load Owner Success',
    props<{owner: OwnerDto}>()
);
export const loadOwnerFailure = createAction(
    '[Owner] Load Owner Failure',
    props<{error: string}>()
);

//IZMENI PROFIL
export const updateOwner = createAction(
    '[Owner] Update Owner',
    props<{id: number, ownerData: FormData}>()
);
export const updateOwnerSuccess = createAction(
    '[Owner] Update Owner Success',
    props<{id: number}>()
);
export const updateOwnerFailure = createAction(
    '[Owner] Update Owner Failure',
    props<{error: string}>()
);