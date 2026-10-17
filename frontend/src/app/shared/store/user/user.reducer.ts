// import { createReducer, on } from "@ngrx/store";
// import { UserDataStoreDto } from "../../dtos/user.dto";
// import { loadUserDataFailure, loadUserDataSuccess, removeSavedSalonSuccess, saveSalonFailed, saveSalonSuccess } from "./user.actions";
// //import { addSalonToDowloadedListSuccess, removeSalonSuccess } from "../Salon/Salon.actions";

// export interface UserState {
//     user: UserDataStoreDto | null;
//     userDataLoaded: boolean;
//     error: string | null;
// }

// export const initialState: UserState = {
//     user: null,
//     userDataLoaded: false,
//     error: null
// }


// export const userReducer = createReducer(
//     initialState,
//     on(loadUserDataSuccess, (state, {user}) => ({
//         ...state,
//         user: user,
//         userDataLoaded: true
//     })),
//     on(loadUserDataFailure, (state, {error}) => ({
//         ...state,
//         error: error
//     })),
//     on(saveSalonSuccess, (state, {savedSalon}) => ({
//         ...state,
//         user: state.user
//             ? {
//                 ...state.user,
//                 savedSalons: [...(state.user.savedSalons || []), savedSalon.Salon.id]
//             }: null
//     })),
//     on(saveSalonFailed, (state, {error}) => ({
//         ...state,
//         error: error
//     })),
//     on(removeSavedSalonSuccess, (state, {salon_id}) => ({
//         ...state,
//         user: state.user
//             ? {
//                 ...state.user,
//                 savedSalons: state.user.savedSalons?.filter(id => id !== salon_id) || []
//             }
//             : null
//     })),
//     // IZ LISTE PREUZETIH KNJIGA
//     on(addSalonToDowloadedListSuccess, (state, {downloadedSalon}) => ({
//         ...state,
//         user: state.user 
//             ? {
//                 ...state.user,
//                 downloadedSalons: [...state.user?.downloadedSalons || [], downloadedSalon.Salon.id]
//             }
//             : null
//     })),

//     on(removeSalonSuccess, (state, { Salon_id, author_id }) => {
//         const newSavedSalons = state.user?.savedSalons?.filter(Salon => Salon !== Salon_id) || [];
      
//         return {
//           ...state,
//           user: state.user ? {
//             ...state.user,
//             savedSalons: newSavedSalons
//           } : null
//         };
//       })
      
// );