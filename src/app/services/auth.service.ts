import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

export interface UserRegister {
  nombre: string;
  apellido: string;
  email: string;
  pwd: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /* =========== jso3lo ============ */
  private _auth = inject(Auth);
  private _fireStore = inject(Firestore);

  async loginWithEmailAndPwd(email: string, pwd: string) {
    const userFound = await signInWithEmailAndPassword(this._auth, email, pwd);
    return userFound;
  }

  async registerWithEmailAndPwd(user: UserRegister) {
    const newUser = await createUserWithEmailAndPassword(
      this._auth,
      user.email,
      user.pwd
    );

    const userRef = doc(this._fireStore, `users/${newUser.user.uid}`);
    await setDoc(userRef, {
      name: user.nombre,
      apellido: user.apellido,
      rol: 'user',
    });
    return newUser;
  }

  get authState$(): Observable<User | null> {
    return authState(this._auth);
  }

  async cerrarSesion() {
    await this._auth.signOut();
  }

  /* =========== jso3lo ============ */

  user$: Observable<any | null>;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection('users')
            .doc(user.uid)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  registerUser(
    nombre: string,
    apellido: string,
    correo: string,
    usuario: string,
    password: string
  ): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(correo, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return this.firestore.collection('users').doc(user.uid).set({
            nombre,
            apellido,
            correo,
            usuario,
          });
        }
        return Promise.reject('Error al crear el usuario.');
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error);
        throw error;
      });
  }

  login(correo: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(correo, password)
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }

  isAuthenticated(): Promise<boolean> {
    return this.afAuth.currentUser.then((user) => !!user);
  }
}
