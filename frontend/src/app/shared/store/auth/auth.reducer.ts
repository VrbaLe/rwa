import { createReducer, on } from "@ngrx/store";
import { loadTokenSuccess, loginFailure, loginSuccess, logout, registerOwnerFailure, registerOwnerSuccess, registerUserFailure, registerUserSuccess } from "./auth.actions";
import { loadUserDataSuccess } from "../user/user.actions";
import { OwnerDto } from "../../dtos/owner.dto";

export interface AuthState {
    token: string | null;
    user: any | null;
    error: any;
    author?: OwnerDto | null
  }
  
  export const initialState: AuthState = {
    token: null,
    user: null,
    error: null
  };
  
  export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, { token}) => ({
      ...state,
      token,
      error: null
    })),
    on(loginFailure, (state, { error }) => ({
      ...state,
      token: null,
      user: null,
      error
    })),
    on(registerUserSuccess, (state, { status, data }) => ({
      ...state,
      token: null,
      user: data,
      error: null
    })),
    on(registerUserFailure, (state, { status, message }) => ({
      ...state,
      token: null,
      user: null,
      error: message
    })),
    on(logout, state => ({
      ...state,
      token: null,
      user: null,
      error: null
    })),
    on(registerOwnerSuccess, (state, { status, data }) => ({
      ...state,
      token: null,
      user: data,
      error: null
    })),
    on(registerOwnerFailure, (state, { status, message }) => ({
      ...state,
      token: null,
      user: null,
      error: message
    })),
    on(loadTokenSuccess, (state, { token, user }) => ({
      ...state,
      token: token,
      user: user,
      error: null
    })),
  );