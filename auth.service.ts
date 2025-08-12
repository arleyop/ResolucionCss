import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BadrequestComponent } from '../../../components/features/feature1/components/badrequest/badrequest.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { InactivityService } from '../inactivity/inactivity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private localUrl = `${environment.apiUrl}/token`;
  private userHasBeenActive:boolean = false;

  constructor(
    private http: HttpClient, 
    public dialog: MatDialog,
    private router: Router,
    private inactivityService: InactivityService,
  ) {
    /* this.inactivityService.setHandler(() => {
      setInterval(() => {
        this.checkSessionExpiration(); // Verificar expiración cada minuto
      }, 60000); // Cada 60 segundos
    }); */
    setInterval(() => {
      this.checkSessionExpiration(); // Verificar expiración cada minuto
    }, 60000); // Cada 60 segundos
  }

  getUserRole(): string {
    return localStorage.getItem('rol') || ''; // Devuelve el rol almacenado o una cadena vacía si no existe
  }
  
  
  get isLogged():Observable<boolean>{
    return this.loggedIn.asObservable();
  }


   localAuth(username: string, passwordQuemado: string): Observable<any> {
   
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', passwordQuemado);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    return this.http.post<any>(this.localUrl, body.toString(), {headers})
      .pipe(
        map(response => {
          console.log("verificacion token ", response.access_token);
          this.router.navigate(['/motor']);
          localStorage.setItem('iduser', response.idUser);
            localStorage.setItem('usuario', response.nombre);
            localStorage.setItem('expires_in', response.expires_in);
            localStorage.setItem('rol', response.scope );
            localStorage.setItem('token', response.access_token);

                // Cálculo del tiempo de expiración
            const expiresIn = response.expires_in;
            const expirationTime = new Date().getTime() + expiresIn * 1000; // Convierte a milisegundos
            localStorage.setItem('expirationTime', expirationTime.toString());

          return response;
        }),
        catchError(error => {
          console.error('Error de autenticación local', error);
          return of({
            status: 404
          });
        })
      );
  }

  checkSessionExpiration() {
    console.log('Verificando expiración de sesión');
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const now = new Date().getTime();
      if (now >= parseInt(expirationTime)) {
        this.logout(); // Cierra la sesión si ha expirado
      }
    }
  }
  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('section');
    localStorage.removeItem('usuario');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('expirationTime'); // Elimina el tiempo de expiración
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
  

  private handleError(err:any): Observable<never>{
    let errorMessage = 'A ocurrido un error! Oh no!...';
    let errorMessageC = 'UNDEFINED bug response...';
    let errorMessageDesk = '';
    let errorMessageStatu = '';

    if(err){
      console.log('Error Aquí', err);
      console.log('Mensaje Fue', err.statusText);
        if (err.statusText === 'Unknown Error') {
          errorMessageDesk = 'Error con el servicio';
          errorMessage = 'Por favor, valide su conexión o comuniquese con el personal encargado de soporte.';
          errorMessageStatu = err.status;
          this.viewErrBadRequest(errorMessage, errorMessageDesk, errorMessageStatu);
        }
    }
    
    return throwError(() => new Error(errorMessageC));
  }

  viewErrBadRequest(message: string, description: string, status: string): void{
    const dialogref = this.dialog.open(BadrequestComponent, {
        data:{message, description, status},
      height: '90%',
      width: '80%',
      maxHeight:'542px',
      maxWidth: '542px',
      panelClass: 'errLogin'
    });
  }
}
