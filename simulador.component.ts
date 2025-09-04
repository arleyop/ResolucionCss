import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { fichaTecnica } from '../../../features/interconectado/modelo/fichaTecnica.model';
import { FactSheetXlsxRow } from '../../../features/interconectado/modelo/fact-sheet-xlsx-row.interface';
import { TipoDocumentoService } from '../../../features/interconectado/services/tipo-documento.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

enum Headers {
  TIPO_ID = 'tipo id',
  ID = 'id',
  NOMBRE_CLIENTE = 'nombre cliente',
  CRITERIO_ID = 'criterio id',
  CRITERIO = 'criterio',
}

@Component({
  selector: 'app-carga-cliente',
  templateUrl: './carga-cliente.component.html',
  styleUrls: ['./carga-cliente.component.css'],
  standalone: true,
  imports: [NgIf, MatTableModule, MatButtonModule, MatIconModule],
})
export class CargaClienteComponent {
  isLoadingFile = false;
  resumenData: FactSheetXlsxRow[] = [];

  // Previsualización de la ficha construida
  newFactSheet: fichaTecnica = {
    penumdoc: '',
    petipdoc: '',
    idFichaTecnica: -1,
    fechaCreacion: new Date(),
    usuarioCreacion: '',
    relaciones: [],
  };

  // Info para encabezado
  penomperDependencia: string = '';
  petipdocDependencia: string = '';
  penumdocDependencia: string = '';

  // Columnas visibles en la tabla Material
  displayedColumns: string[] = [
    'nombreDependencia',
    'tipoDependencia',
    'penomperDependiente',
    'petipdocDependiente',
    'penumdocDependiente',
  ];

  constructor(private tipoDocumentoService: TipoDocumentoService) {}

  /**
   * Selección de archivo desde el input file
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndProcessFile(file);
  }

  /**
   * Manejo drag & drop
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.validateAndProcessFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * Validar y procesar el archivo Excel cargado
   */
  validateAndProcessFile(file: File | undefined) {
    this.isLoadingFile = true;
    if (
      file &&
      file.size <= 10 * 1024 * 1024 &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryExcelFile = new Uint8Array(e.target.result);
        const workbook = XLSX.read(binaryExcelFile, { type: 'array' });

        // Procesar hoja "resumen" para construir la ficha técnica
        this.processResumenSheet(workbook);
        this.isLoadingFile = false;
      };
      reader.readAsArrayBuffer(file);
    } else {
      swal(
        'Error',
        'El archivo no es válido. Debe ser .xlsx y máximo 10MB.',
        'error'
      );
      this.isLoadingFile = false;
    }
  }

  /**
   * Procesar la hoja "resumen" y construir la ficha técnica
   */
  processResumenSheet(workbook: XLSX.WorkBook) {
    const sheetName = 'resumen';
    const worksheet = workbook.Sheets[sheetName];

    if (worksheet) {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as any[];
      const headersLowerCase = headers.map((h: string) => h.toLowerCase());
      const rows = jsonData.slice(1);

      // Ubicar columnas requeridas
      const tipoIdIdx = headersLowerCase.indexOf(Headers.TIPO_ID);
      const idIdx = headersLowerCase.indexOf(Headers.ID);
      const nombreClienteIdx = headersLowerCase.indexOf(Headers.NOMBRE_CLIENTE);
      const criterioIdIdx = headersLowerCase.indexOf(Headers.CRITERIO_ID);
      const criterioIdx = headersLowerCase.indexOf(Headers.CRITERIO);

      if (
        [tipoIdIdx, idIdx, nombreClienteIdx, criterioIdIdx, criterioIdx].includes(
          -1
        )
      ) {
        swal(
          'Error',
          `La hoja "resumen" no tiene todas las columnas necesarias.`,
          'error'
        );
        return;
      }

      // Construir array de relaciones
      this.resumenData = rows.map((row: any) => ({
        tipoId: String(row[tipoIdIdx]),
        id: String(row[idIdx]),
        nombreCliente: String(row[nombreClienteIdx]),
        criterioId: String(row[criterioIdIdx]),
        criterio: String(row[criterioIdx]),
      }));

      // Encabezado con cliente principal
      this.penomperDependencia = this.resumenData[0].nombreCliente;
      this.petipdocDependencia = this.tipoDocumentoService.validateTipoDocumento(
        this.resumenData[0].tipoId
      );
      this.penumdocDependencia = this.padNumeroIdentificacion(
        this.resumenData[0].id
      );

      // Construir ficha técnica para previsualización
      this.newFactSheet = {
        penumdoc: this.padNumeroIdentificacion(this.resumenData[0].id),
        petipdoc: this.tipoDocumentoService.validateTipoDocumento(
          this.resumenData[0].tipoId
        ),
        idFichaTecnica: -1,
        fechaCreacion: new Date(),
        usuarioCreacion: '',
        relaciones: this.resumenData.map((row) => ({
          penomperDependencia: this.penomperDependencia,
          petipdocDependencia: this.petipdocDependencia,
          penumdocDependencia: this.penumdocDependencia,
          penomperDependiente: row.nombreCliente,
          petipdocDependiente: row.tipoId,
          penumdocDependiente: row.id,
          nombreDependencia: row.criterio,
          tipoDependencia: Number(row.criterioId),
        })),
      };
    } else {
      swal('Error', 'No se encontró la hoja "resumen" en el archivo.', 'error');
    }
  }

  /**
   * Rellenar número de identificación a 11 dígitos
   */
  padNumeroIdentificacion(numero: string): string {
    return numero.padStart(11, '0');
  }
}
