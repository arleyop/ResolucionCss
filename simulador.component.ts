import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { fichaTecnica } from '../../../features/interconectado/modelo/fichaTecnica.model';
import { FactSheetXlsxRow } from '../../../features/interconectado/modelo/fact-sheet-xlsx-row.interface';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RequestButtonComponent } from '../../../features/shared/components/request-button/request-button.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TipoDocumentoService } from '../../../features/interconectado/services/tipo-documento.service';

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
  imports: [
    NgIf,
    MatTableModule,
    RequestButtonComponent,
    MatButton,
    MatIcon,
  ],
})
export class CargaClienteComponent {
  // Estados de carga
  isLoadingFile: boolean = false;
  disabled: boolean = false;

  // Datos básicos del cliente principal
  penomperDependencia: string = '';
  petipdocDependencia: string = '';
  penumdocDependencia: string = '';

  // Datos procesados desde la hoja "resumen"
  resumenData: FactSheetXlsxRow[] = [];

  // Ficha técnica generada en memoria
  newFactSheet: fichaTecnica = new fichaTecnica();

  // Archivo excel
  binaryExcelFile: Uint8Array = new Uint8Array();
  fileLastModifiedDate: Date = new Date();

  // Columnas para la tabla de preview
  displayedColumns: string[] = [
    'nombreCliente',
    'tipoId',
    'id',
    'criterio',
    'criterioId',
  ];

  constructor(private tipoDocumentoService: TipoDocumentoService) {}

  // =============================
  // Manejo de selección de archivo
  // =============================
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndProcessFile(file);
  }

  // =============================
  // Manejo de drag & drop
  // =============================
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.removeDragOverClass();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.validateAndProcessFile(file);
      event.dataTransfer.clearData();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.addDragOverClass();
  }

  onDragLeave(event: DragEvent) {
    this.removeDragOverClass();
  }

  addDragOverClass() {
    const element = document.querySelector('.drag-drop-area');
    if (element) {
      element.classList.add('drag-over');
    }
  }

  removeDragOverClass() {
    const element = document.querySelector('.drag-drop-area');
    if (element) {
      element.classList.remove('drag-over');
    }
  }

  // =============================
  // Validar y procesar archivo
  // =============================
  validateAndProcessFile(file: File | undefined) {
    this.isLoadingFile = true;
    if (
      file &&
      file.size <= 10 * 1024 * 1024 &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.fileLastModifiedDate = new Date(file.lastModified);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.binaryExcelFile = new Uint8Array(e.target.result);
        const workbook = XLSX.read(this.binaryExcelFile, { type: 'array' });
        this.processResumenSheet(workbook);
      };
      reader.readAsArrayBuffer(file);
    } else {
      swal('Error', 'El archivo debe ser un Excel (.xlsx) y menor a 10MB', 'error');
      this.isLoadingFile = false;
    }
  }

  // =============================
  // Procesar hoja "resumen"
  // =============================
  processResumenSheet(workbook: XLSX.WorkBook) {
    const sheetName = 'resumen';
    const worksheet = workbook.Sheets[sheetName];

    if (worksheet) {
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] as any[];
      const headersLowerCase = headers.map((header: string) =>
        header.toLowerCase()
      );
      const rows = jsonData.slice(1);

      // Índices de columnas
      const tipoIdIdx = headersLowerCase.indexOf(Headers.TIPO_ID);
      const idIdx = headersLowerCase.indexOf(Headers.ID);
      const nombreClienteIdx = headersLowerCase.indexOf(Headers.NOMBRE_CLIENTE);
      const criterioIdIdx = headersLowerCase.indexOf(Headers.CRITERIO_ID);
      const criterioIdx = headersLowerCase.indexOf(Headers.CRITERIO);

      // Validación de columnas
      if (
        tipoIdIdx === -1 ||
        idIdx === -1 ||
        nombreClienteIdx === -1 ||
        criterioIdIdx === -1 ||
        criterioIdx === -1
      ) {
        swal(
          'Error',
          `La hoja "resumen" no tiene las columnas necesarias. Se encontraron: [${headersLowerCase.join(
            ', '
          )}]`,
          'error'
        );
        this.isLoadingFile = false;
        return;
      }

      // Construcción de resumenData
      this.resumenData = rows.map((row: any) => {
        return {
          tipoId: String(row[tipoIdIdx]),
          id: String(row[idIdx]),
          nombreCliente: String(row[nombreClienteIdx]),
          criterioId: String(row[criterioIdIdx]),
          criterio: String(row[criterioIdx]),
        };
      });

      // Datos del cliente principal
      this.penomperDependencia = this.resumenData[0].nombreCliente;
      this.petipdocDependencia = this.tipoDocumentoService.validateTipoDocumento(
        this.resumenData[0].tipoId
      );
      this.penumdocDependencia = this.padNumeroIdentificacion(
        this.resumenData[0].id
      );

      // Construcción de newFactSheet
      this.newFactSheet = {
        penumdoc: this.penumdocDependencia,
        petipdoc: this.petipdocDependencia,
        idFichaTecnica: -1,
        fechaCreacion: new Date(),
        usuarioCreacion: '',
        relaciones: this.resumenData.map((row: FactSheetXlsxRow) => ({
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

      console.log('✅ newFactSheet construido:', this.newFactSheet);
      swal('¡Éxito!', 'Archivo procesado correctamente.', 'success');
    } else {
      swal('Error', 'La hoja "resumen" no se encontró en el archivo.', 'error');
    }

    this.isLoadingFile = false;
  }

  // =============================
  // Reset de estado
  // =============================
  reset() {
    this.newFactSheet = new fichaTecnica();
    this.resumenData = [];
    this.penomperDependencia = '';
    this.petipdocDependencia = '';
    this.penumdocDependencia = '';
  }

  // =============================
  // Utilidades
  // =============================
  padNumeroIdentificacion(numero: string): string {
    return numero.padStart(11, '0');
  }
}
