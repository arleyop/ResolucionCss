import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { DerivadosService } from './derivados.service';

@Component({
  selector: 'app-carga-derivados',
  templateUrl: './carga-derivados.component.html',
  styleUrls: ['./carga-derivados.component.css']
})
export class CargaDerivadosComponent {
  isLoadingFile = false;
  disabled = false;

  newFichaDerivado: any = {
    fechaCarga: '',
    relaciones: [] // Aquí irán los registros leídos del Excel
  };

  storeNewFactSheetIsLoading = false;
  storeNewFactSheetDisabled = false;

  constructor(private derivadosService: DerivadosService) {}

  // ----------------------------
  // Manejo de archivo
  // ----------------------------
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

  // ----------------------------
  // Procesar Excel
  // ----------------------------
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

        // Procesar hoja "informacion Derivados"
        this.processInformacionDerivados(workbook, file.name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      this.isLoadingFile = false;
      console.error("Archivo inválido.");
    }
  }

  processInformacionDerivados(workbook: XLSX.WorkBook, fileName: string) {
    const sheetName = "informacion Derivados";
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      console.error(`No existe la hoja ${sheetName}`);
      return;
    }

    // 1. Extraer fecha desde nombre archivo → "PT fichero 20250821"
    let fechaCarga: string | null = null;
    const regexFecha = /(\d{8})$/;
    const match = fileName.match(regexFecha);
    if (match) {
      const rawDate = match[1];
      const year = rawDate.substring(0, 4);
      const month = rawDate.substring(4, 6);
      const day = rawDate.substring(6, 8);
      fechaCarga = `${year}-${month}-${day}`;
    }
    this.newFichaDerivado.fechaCarga = fechaCarga;

    // 2. Leer desde fila 3 (A3 en adelante)
    const range = XLSX.utils.decode_range(sheet["!ref"]!);
    range.s.r = 2; // fila 3 = índice 2
    const data = XLSX.utils.sheet_to_json(sheet, {
      range: range,
      header: 1,
      defval: ""
    }) as any[][];

    // 3. Mapear a objetos con tus campos específicos
    const lista = data.map((row) => ({
      tipoIdentificacion: row[0],  // Columna A
      exposicion: row[1],          // Columna B
      fechaOperacion: row[2],      // Columna C
      fechaCarga: fechaCarga       // viene del nombre archivo
    }));

    this.newFichaDerivado.relaciones = lista;
    this.isLoadingFile = false;
  }

  // ----------------------------
  // Guardar en API
  // ----------------------------
  storeNewFactSheet() {
    if (this.newFichaDerivado.relaciones.length === 0) {
      alert("No hay datos para guardar.");
      return;
    }

    this.storeNewFactSheetIsLoading = true;
    this.storeNewFactSheetDisabled = true;

    this.derivadosService.guardarDerivados(this.newFichaDerivado).subscribe({
      next: (resp) => {
        console.log("Guardado con éxito:", resp);
        alert("Datos guardados correctamente.");
        this.reset();
      },
      error: (err) => {
        console.error("Error al guardar:", err);
        alert("Error al guardar en API.");
        this.storeNewFactSheetIsLoading = false;
        this.storeNewFactSheetDisabled = false;
      },
      complete: () => {
        this.storeNewFactSheetIsLoading = false;
        this.storeNewFactSheetDisabled = false;
      }
    });
  }

  // ----------------------------
  // Resetear
  // ----------------------------
  reset() {
    this.newFichaDerivado = {
      fechaCarga: '',
      relaciones: []
    };
  }
}
