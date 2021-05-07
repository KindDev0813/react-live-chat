import create from 'zustand';
import { auth } from '../firebase';
import firebase from 'firebase/app';

export interface AuthUser {
  uid: string;
  username: string;
  email: string;
  activeRooms: string[];
  profileImgUrl: string | undefined;
}

type AuthState = {
  authUser: AuthUser | null;
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
  setAuthUser: (authUser: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
  authUser: null,
  loading: true,
  signup: (email, password) =>
    auth.createUserWithEmailAndPassword(email, password),
  login: (email, password) => auth.signInWithEmailAndPassword(email, password),
  logout: () => auth.signOut(),
  setAuthUser: (authUser) => set((state) => ({ ...state, authUser })),
  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));
