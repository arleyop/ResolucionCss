import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { fichaTecnica } from '../../../features/interconectado/modelo/fichaTecnica.model';
import { FactSheetXlsxRow } from '../../../features/interconectado/modelo/fact-sheet-xlsx-row.interface';
import { NgIf, NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
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
    NgFor,
    MatButton,
    MatIcon,
    MatTableModule,
  ],
})
export class CargaClienteComponent {
  // Estados de carga
  isLoadingFile: boolean = false;
  disabled: boolean = false;

  // Variables para mostrar datos del cliente principal
  penomperDependencia: string = '';
  petipdocDependencia: string = '';
  penumdocDependencia: string = '';

  // Datos cargados desde Excel
  resumenData: FactSheetXlsxRow[] = [];

  // Fact sheet nuevo (lo que vamos a previsualizar)
  newFactSheet: fichaTecnica = {
    penumdoc: '',
    petipdoc: '',
    idFichaTecnica: -1,
    fechaCreacion: new Date(),
    usuarioCreacion: '',
    relaciones: [],
  };

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = [
    'penomperDependiente',
    'petipdocDependiente',
    'penumdocDependiente',
    'nombreDependencia',
    'tipoDependencia',
  ];

  constructor(private tipoDocumentoService: TipoDocumentoService) {}

  // ============================================================
  // Selección de archivo (input file)
  // ============================================================
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndProcessFile(file);
  }

  // ============================================================
  // Drag & Drop
  // ============================================================
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

  // ============================================================
  // Validar y procesar archivo Excel
  // ============================================================
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
        this.processResumenSheet(workbook);
      };
      reader.readAsArrayBuffer(file);
    } else {
      swal('Error', 'El archivo debe ser un Excel válido (.xlsx, máx 10MB).', 'error');
      this.isLoadingFile = false;
    }
  }

  // ============================================================
  // Procesar hoja "resumen"
  // ============================================================
  processResumenSheet(workbook: XLSX.WorkBook) {
    const sheetName = 'resumen';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      swal('Error', 'La hoja "resumen" no se encontró en el archivo.', 'error');
      this.isLoadingFile = false;
      return;
    }

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

    // Validar headers
    if (
      tipoIdIdx === -1 ||
      idIdx === -1 ||
      nombreClienteIdx === -1 ||
      criterioIdIdx === -1 ||
      criterioIdx === -1
    ) {
      swal(
        'Error',
        `La hoja "resumen" no tiene las columnas necesarias. Encontradas: [${headersLowerCase.join(', ')}]`,
        'error'
      );
      this.isLoadingFile = false;
      return;
    }

    // Mapear filas a objetos FactSheetXlsxRow
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

    // Construcción del nuevo fact sheet
    this.newFactSheet = {
      penumdoc: this.penumdocDependencia,
      petipdoc: this.petipdocDependencia,
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

    console.log('newFactSheet:', this.newFactSheet);

    this.isLoadingFile = false;
    swal('Éxito', 'Archivo procesado y cargado en memoria.', 'success');
  }

  // ============================================================
  // Resetear datos
  // ============================================================
  reset() {
    this.newFactSheet = {
      penumdoc: '',
      petipdoc: '',
      idFichaTecnica: -1,
      fechaCreacion: new Date(),
      usuarioCreacion: '',
      relaciones: [],
    };
    this.resumenData = [];
    this.penomperDependencia = '';
    this.petipdocDependencia = '';
    this.penumdocDependencia = '';
  }

  // ============================================================
  // Helper: Rellenar número de identificación
  // ============================================================
  padNumeroIdentificacion(numero: string): string {
    return numero.padStart(11, '0');
  }
}
