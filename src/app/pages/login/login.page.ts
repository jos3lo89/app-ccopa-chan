import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  /* =========== jso3lo ============ */

  private _authService = inject(AuthService);
  private _fb = inject(FormBuilder);
  private _toastService = inject(ToastService);
  private _router = inject(Router);

  isloadingSubmitBtn = false;

  form = this._fb.group({
    email: this._fb.control('', [Validators.required, Validators.email]),
    pwd: this._fb.control('', [Validators.required, Validators.min(6)]),
  });

  async registrar() {
    console.log(this.form.value);

    try {
      this.isloadingSubmitBtn = true;

      const { email, pwd } = this.form.value;
      if (!email || !pwd) {
        console.log('faltan datos');

        return;
      }

      await this._authService.loginWithEmailAndPwd(email, pwd);

      this.form.reset();

      this.isloadingSubmitBtn = false;

      this._router.navigateByUrl('/home');

      await this._toastService.getToast('Vienvenido', 'middle', 'success');
    } catch (error) {
      console.log(error);

      this.isloadingSubmitBtn = false;
      await this._toastService.getToast(
        'Fallo al iniciar sesión',
        'middle',
        'danger'
      );
    }
  }

  /* =========== jso3lo ============ */

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastController: ToastController,
    private router: Router
  ) {}

  async register() {
    if (!this.correo || !this.password || this.password.length < 6) {
      this.presentToast('Por favor, verifica los datos ingresados.');
      return;
    }

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        this.correo,
        this.password
      );

      if (userCredential.user) {
        await this.afs.collection('users').doc(userCredential.user.uid).set({
          nombre: this.nombre,
          apellido: this.apellido,
          correo: this.correo,
        });

        this.presentToast('Usuario registrado exitosamente.');

        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      this.presentToast(
        'Error al registrar el usuario. Por favor, intenta nuevamente.'
      );
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
