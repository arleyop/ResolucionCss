import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DerivadoRequest {
  tipoIdentificacion: string;
  exposicion: number;
  fechaOperacion: string; // YYYY-MM-DD
  fechaCarga: string;     // YYYY-MM-DD
}

@Injectable({ providedIn: 'root' })
export class FichaDerivadoService {
  private baseUrl = '/api/derivados';

  constructor(private http: HttpClient) {}

  // Nuevo método: recibe directamente las filas de la tabla
  guardarDerivados(filas: DerivadoRequest[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/guardar`, filas);
  }
}
