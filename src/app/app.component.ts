import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  /* =========== jso3lo ============ */
  private _authService = inject(AuthService);
  private _router = inject(Router);

  user: User | null = null;
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.getUser();
  }

  getUser() {
    this._authService.authState$.subscribe({
      next: (data) => {
        console.log(data);
        this.user = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  async logout() {
    await this._authService.cerrarSesion();
    this._router.navigateByUrl('/home');
    this.getUser();
  }

  pushRoute(route: string) {
    this._router.navigateByUrl(route);
  }

  /* =========== jso3lo ============ */

  isAuthenticated: boolean = false;

  ngOnInit() {
    this.checkAuthState();
  }

  private checkAuthState() {
    this.afAuth.onAuthStateChanged((user) => {
      this.isAuthenticated = !!user;

      if (!user) {
        this.router.navigate(['/home']);
      }
    });
  }
}
