export interface GemTasaCambio {
  cdDiviss: string;   // Código de divisa
  cambFix: number;    // Valor de la tasa
  fhCambio: string;   // Fecha de cambio (ISO string)
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GemTasaCambio } from '../models/gem-tasa-cambio.model';

@Injectable({
  providedIn: 'root'
})
export class TasaCambioService {
  private apiUrl = '/api/tasas-cambio';

  constructor(private http: HttpClient) {}

  getcurrencyTypeCombonBoxData(): Observable<{ status: string, data: GemTasaCambio[] }> {
    return this.http.get<{ status: string, data: GemTasaCambio[] }>(`${this.apiUrl}/tipos-moneda`);
  }
}
