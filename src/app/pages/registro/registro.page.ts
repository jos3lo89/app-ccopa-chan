import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  /* =========== jso3lo ============ */

  private _authService = inject(AuthService);
  private _fb = inject(FormBuilder);
  private _toastService = inject(ToastService);
  isloadingSubmitBtn = false;

  form = this._fb.group({
    nombre: this._fb.control('', [Validators.required]),
    apellido: this._fb.control('', [Validators.required]),
    email: this._fb.control('', [Validators.required, Validators.email]),
    pwd: this._fb.control('', [Validators.required, Validators.min(6)]),
  });

  async register() {
    console.log(this.form.value);

    try {
      this.isloadingSubmitBtn = true;

      const { apellido, email, nombre, pwd } = this.form.value;
      if (!apellido || !email || !nombre || !pwd) {
        console.log('faltan datos');

        return;
      }

      await this._authService.registerWithEmailAndPwd({
        apellido,
        email,
        nombre,
        pwd,
      });

      await this._toastService.getToast(
        'Registro exitoso',
        'middle',
        'success'
      );

      this.form.reset();

      this.isloadingSubmitBtn = false;
    } catch (error) {
      console.log(error);

      this.isloadingSubmitBtn = false;
      await this._toastService.getToast(
        'Fallo al registrarse',
        'middle',
        'danger'
      );
    }
  }

  /* =========== jso3lo ============ */
  correo: string = '';
  password: string = '';

  constructor() {} // private router: Router // private toastController: ToastController, // private afAuth: AngularFireAuth,

  // async login() {
  //   if (!this.correo || !this.password) {
  //     this.presentToast('Por favor, ingrese su correo y contraseña.');
  //     return;
  //   }

  //   try {
  //     const userCredential = await this.afAuth.signInWithEmailAndPassword(
  //       this.correo,
  //       this.password
  //     );

  //     if (userCredential.user) {
  //       this.presentToast('Inicio de sesión exitoso.');

  //       this.router.navigate(['/home']);
  //     }
  //   } catch (error) {
  //     console.error('Error al iniciar sesión:', error);
  //     this.presentToast('Correo o contraseña incorrectos.');
  //   }
  // }

  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000,
  //     position: 'bottom',
  //   });
  //   toast.present();
  // }
}
