import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {
  /**
   * Valida el tipo de documento y lo transforma según reglas.
   * @param tipoDocumento tipo de documento leído del Excel
   * @returns tipo de documento normalizado
   */
  validateTipoDocumento(tipoDocumento: string): string {
    switch (tipoDocumento?.toUpperCase()) {
      case 'NIT':
        return 'NT';
      case 'CEDULA':
        return 'CC';
      default:
        return tipoDocumento;
    }
  }
}
