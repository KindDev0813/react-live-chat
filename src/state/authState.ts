import create from 'zustand';
import { auth } from '../firebase';
import firebase from 'firebase/app';

type AuthState = {
  authUser:
    | {
        uid: string;
        username: string;
        email: string;
      }
    | {};
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
  setLoading: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  authUser: {},
  loading: true,
  signup: (email, password) =>
    auth.createUserWithEmailAndPassword(email, password),
  login: (email, password) => auth.signInWithEmailAndPassword(email, password),
  logout: () => auth.signOut(),
  setLoading: () => set((state) => ({ ...state, loading: false })),
}));
