import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLogged.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
      //  if (!isLoggedIn) {
      //    this.router.navigate(['/login']);
      //    return false;
      //  }

        // Si se especifican roles permitidos, verificar que el usuario tenga uno de esos roles
        const allowedRoles = route.data['roles'] as Array<string>;
        const url = state.url;
        console.log(`AuthGuard: roles para la ruta ${ url }:`,allowedRoles);
        
        const userRole = this.authService.getUserRole();
        console.log(`AuthGuard: rol del usuario:`,userRole);

        if (route.data['defaultRedirect']) {
          if (userRole === 'Administradorusuarios') {
              this.router.navigate(['GestiondeUsuarios/Usuario'])
            } else {
              this.router.navigate(['Top20'])
            }
        return false;
        }

        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          this.router.navigate(['unauthorized']); // Redirige a una página "no autorizado"
          return false;
        }

        return true;
      })
    );
  }
}
