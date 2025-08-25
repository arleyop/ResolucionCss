import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FichaDerivadoService } from './ficha-derivado.service';

interface RelacionDerivado {
  tipoIdentificacion: string;
  exposicion: number;
  fechaOperacion: string;
  fechaCarga: string;
  duplicado?: boolean;
}

interface FichaDerivado {
  penumdoc: string;
  petipdoc: string;
  idFichaTecnica: number;
  fechaCreacion: Date;
  usuarioCreacion: string;
  relaciones: RelacionDerivado[];
  fechaCarga?: string;
}

@Component({
  selector: 'app-carga-derivados',
  templateUrl: './carga-derivados.component.html',
  styleUrls: ['./carga-derivados.component.css']
})
export class CargaDerivadosComponent {
  isLoadingFile = false;
  disabled = false;
  storeNewFactSheetIsLoading = false;
  storeNewFactSheetDisabled = false;

  newFichaDerivado: FichaDerivado = {
    penumdoc: '',
    petipdoc: '',
    idFichaTecnica: -1,
    fechaCreacion: new Date(),
    usuarioCreacion: '',
    relaciones: [],
  };

  displayedColumns: string[] = [
    'tipoIdentificacion',
    'exposicion',
    'fechaOperacion',
    'fechaCarga'
  ];

  constructor(
    private snackBar: MatSnackBar,
    private fichaDerivadoService: FichaDerivadoService
  ) {}

  // ====== DRAG & DROP ======
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndProcessFile(file);
  }

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

  // ====== PROCESAMIENTO DE ARCHIVO ======
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
        this.processInformacionDerivados(workbook, file.name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      this.snackBar.open('Archivo inválido. Debe ser un .xlsx de máximo 10MB.', 'Cerrar', { duration: 4000 });
      this.isLoadingFile = false;
    }
  }

  private processInformacionDerivados(workbook: XLSX.WorkBook, fileName: string) {
    const sheet = workbook.Sheets['informacion Derivados'];
    if (!sheet) {
      this.snackBar.open('No se encontró la hoja "informacion Derivados"', 'Cerrar', { duration: 4000 });
      this.isLoadingFile = false;
      return;
    }

    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // mantiene como array de arrays
      range: 2   // desde la fila 3 (índice 2)
    });

    const relaciones: RelacionDerivado[] = [];
    const fechaCarga = this.extractDateFromFileName(fileName);

    jsonData.forEach((row) => {
      if (!row || row.length < 3) return;

      const tipoIdentificacion = this.cleanValue(row[0]);
      const exposicion = this.cleanValue(row[1]);
      const fechaOperacion = this.cleanValue(row[2]);

      // Validar vacíos
      if (!tipoIdentificacion || !exposicion || !fechaOperacion) return;

      relaciones.push({
        tipoIdentificacion,
        exposicion: Number(exposicion),
        fechaOperacion,
        fechaCarga,
      });
    });

    // Marcar duplicados
    this.markDuplicates(relaciones);

    this.newFichaDerivado = {
      penumdoc: '',
      petipdoc: '',
      idFichaTecnica: -1,
      fechaCreacion: new Date(),
      usuarioCreacion: '',
      relaciones,
      fechaCarga
    };

    this.isLoadingFile = false;
  }

  private cleanValue(value: any): string {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    if (str.toUpperCase() === 'N.A' || str === '') return '';
    return str;
  }

  private extractDateFromFileName(fileName: string): string {
    const match = fileName.match(/(\d{8})$/); // busca YYYYMMDD al final
    if (match) {
      const dateStr = match[1];
      return `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
    }
    return new Date().toISOString().split('T')[0];
  }

  private markDuplicates(relaciones: RelacionDerivado[]) {
    const seen = new Map<string, number>();
    relaciones.forEach((r) => {
      const key = `${r.tipoIdentificacion}_${r.fechaOperacion}`;
      if (seen.has(key)) {
        r.duplicado = true;
      } else {
        seen.set(key, 1);
        r.duplicado = false;
      }
    });

    if (relaciones.some(r => r.duplicado)) {
      this.snackBar.open(
        '⚠ Existen duplicados. La exposición se sumará si coinciden Tipo Identificación y Fecha.',
        'Entendido',
        { duration: 6000 }
      );
    }
  }

  // ====== ACCIONES ======
  storeNewFactSheet() {
    if (this.newFichaDerivado.relaciones.length === 0) {
      this.snackBar.open('No hay datos para guardar.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.storeNewFactSheetIsLoading = true;

    this.fichaDerivadoService.guardarFicha(this.newFichaDerivado).subscribe({
      next: () => {
        this.snackBar.open('Ficha Derivados guardada correctamente.', 'Cerrar', { duration: 3000 });
        this.reset();
        this.storeNewFactSheetIsLoading = false;
      },
      error: () => {
        this.snackBar.open('Error al guardar la ficha.', 'Cerrar', { duration: 3000 });
        this.storeNewFactSheetIsLoading = false;
      }
    });
  }

  reset() {
    this.newFichaDerivado = {
      penumdoc: '',
      petipdoc: '',
      idFichaTecnica: -1,
      fechaCreacion: new Date(),
      usuarioCreacion: '',
      relaciones: [],
    };
  }
}
