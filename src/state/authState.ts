import create from 'zustand';
import { auth } from '../firebase';
import firebase from 'firebase/app';

export interface AuthUser {
  uid: string;
  username: string;
  email: string;
}

type AuthState = {
  authUser: AuthUser | null;
  fbUser: any;
  loading: boolean;
  signup: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout: () => Promise<void>;
  setFbUser: (fbUser: any) => void;
  setAuthUser: (authUser: AuthUser) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
  authUser: null,
  loading: true,
  fbUser: null,
  signup: (email, password) =>
    auth.createUserWithEmailAndPassword(email, password),
  login: (email, password) => auth.signInWithEmailAndPassword(email, password),
  logout: () => auth.signOut(),
  setFbUser: (fbUser) => set((state) => ({ ...state, fbUser })),
  setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));
