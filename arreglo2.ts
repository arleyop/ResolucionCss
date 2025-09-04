import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { fichaTecnica } from '../../../features/interconectado/modelo/fichaTecnica.model';
import { InterconectadosFitec } from '../../../features/interconectado/services/interconectadosFitec.service';
import { FactSheetXlsxRow } from '../../../features/interconectado/modelo/fact-sheet-xlsx-row.interface';
import { UserService } from '../../../features/feature2/services/header/user.service';
import { FactSheetCreateDto } from '../../../features/interconectado/modelo/fact-sheet-create-dto.interface';
import { NgIf } from '@angular/common';
import { RequestButtonComponent } from '../../../features/shared/components/request-button/request-button.component';
import { FactSheetRelationshipsComponent } from '../../../features/interconectado/components/fact-sheet-relationships/fact-sheet-relationships.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


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
        RequestButtonComponent,
        FactSheetRelationshipsComponent,
        MatButton,
        MatIcon,
    ],
})
export class CargaClienteComponent {
  isLoadingFile: boolean = false;
  storeNewFactSheetIsLoading: boolean = false;
  storeNewFactSheetFailed: boolean = false;
  storeNewFactSheetDisabled: boolean = false;
  disabled: boolean = false;
  penomperDependencia: string = '';
  petipdocDependencia: string = '';
  penumdocDependencia: string = '';
  resumenData: FactSheetXlsxRow[] = []; // Variable para almacenar los datos de la hoja "resumen"
  oldFactSheet: fichaTecnica = {
    penumdoc: '',
    petipdoc: '',
    idFichaTecnica: -1,
    fechaCreacion: new Date(),
    usuarioCreacion: '',
    relaciones: [],
  };
  newFactSheet: fichaTecnica = {
    penumdoc: '',
    petipdoc: '',
    idFichaTecnica: -1,
    fechaCreacion: new Date(),
    usuarioCreacion: '',
    relaciones: [],
  };
  binaryExcelFile: Uint8Array = new Uint8Array();
  fileLastModifiedDate: Date = new Date();

  constructor(private interconectadosFitec: InterconectadosFitec) {}

  // Manejo de selección de archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndProcessFile(file);
  }

  // Manejo de arrastrar y soltar archivo
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
  /**
   * Valida y procesa un archivo Excel.
   * @param file - El archivo a validar y procesar.
   */
  validateAndProcessFile(file: File | undefined) {
    this.isLoadingFile = true;
    if (
      file &&
      file.size <= 10 * 1024 * 1024 &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      if (file) {
        const fileDate = new Date(file.lastModified);
        this.fileLastModifiedDate = fileDate;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.binaryExcelFile = new Uint8Array(e.target.result);
        const workbook = XLSX.read(this.binaryExcelFile, { type: 'array' });
        this.processResumenSheet(workbook);
        this.processFichaSheet(workbook);
      };
      reader.readAsArrayBuffer(file);
    } else {
      swal(
        'Error',
        '.',
        'error'
      );
    }
  }

  /**
   * Procesa la hoja "resumen" de un libro de Excel.
   * @param workbook - El libro de Excel que contiene la hoja "resumen".
   * @ resumenData - tenemos el diccionario de datos de ResumenDatos de la ficha tecnica del cliemte
   */
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

      //headers index
      const tipoIdIdx = headersLowerCase.indexOf(Headers.TIPO_ID);
      const idIdx = headersLowerCase.indexOf(Headers.ID);
      const nombreClienteIdx = headersLowerCase.indexOf(Headers.NOMBRE_CLIENTE);
      const criterioIdIdx = headersLowerCase.indexOf(Headers.CRITERIO_ID);
      const criterioIdx = headersLowerCase.indexOf(Headers.CRITERIO);

      // Validate headers
      if (
        tipoIdIdx === -1 ||
        idIdx === -1 ||
        nombreClienteIdx === -1 ||
        criterioIdIdx === -1 ||
        criterioIdx === -1
      ) {
        swal(
          'Error',
          `La hoja "resumen" no tiene las columnas necesarias. Asegúrate de que las columnas "Tipo ID", "ID", "Nombre Cliente", "Criterio ID" y "Criterio" estén presentes. Se encontraron las siguientes columnas: [${headersLowerCase.join(
            ', '
          )}]`,
          'error'
        );
        return;
      }

      // TODO: limpiar filas vacias

      this.resumenData = rows
        // Map from array to object
        .map((row: any) => {
          return {
            tipoId: String(row[tipoIdIdx]),
            id: String(row[idIdx]),
            nombreCliente: String(row[nombreClienteIdx]),
            criterioId: String(row[criterioIdIdx]),
            criterio: String(row[criterioIdx]),
          };
        });

      //

      this.penomperDependencia = this.resumenData[0].nombreCliente;
      this.petipdocDependencia = this.validateTipoDocumento(
        this.resumenData[0].tipoId
      );
      this.penumdocDependencia = this.padNumeroIdentificacion(
        this.resumenData[0].id
      );

      this.newFactSheet = {
        penumdoc: this.padNumeroIdentificacion(this.resumenData[0].id),
        petipdoc: this.validateTipoDocumento(this.resumenData[0].tipoId),
        idFichaTecnica: -1,
        fechaCreacion: new Date(),
        usuarioCreacion: UserService.usuario?.nombreusuario || '',
        relaciones: this.resumenData.map((row: FactSheetXlsxRow) => ({
          penumperDependencia: '',
          penomperDependencia: this.penomperDependencia,
          petipdocDependencia: this.petipdocDependencia,
          penumdocDependencia: this.penumdocDependencia,
          penumperDependiente: '',
          penomperDependiente: row.nombreCliente,
          petipdocDependiente: row.tipoId,
          penumdocDependiente: row.id,
          nombreDependencia: row.criterio,
          tipoDependencia: Number(row.criterioId),
          idGrupoGcc: '',
          nombreGrupoGcc: '',
        })),
      };

      console.log('newFactSheet:', this.newFactSheet);
    } else {
      swal('Error', 'La hoja "resumen" no se encontró en el archivo.', 'error');
    }
  }

  /**
   * Procesa la hoja "Ficha" de un libro de Excel.
   * @param workbook - El libro de Excel que contiene la hoja "Ficha".
   *
   * @param dataFicha -objeto que Tiene para realizar la consulta del servicio, el primer registro es el cliente de la ficha, los demas parametros
   * se pueden tomar como adicional para informacion si se requiere
   */
  processFichaSheet(workbook: XLSX.WorkBook) {
    const sheetNameFicha = 'Ficha';
    const worksheetFicha = workbook.Sheets[sheetNameFicha];

    if (worksheetFicha) {
      const nombreCliente = worksheetFicha['C5']
        ? worksheetFicha['C5'].v
        : undefined;
      const nombreGrupo = worksheetFicha['C6']
        ? worksheetFicha['C6'].v
        : undefined;
      const dataFicha = {
        TipoIdentificacion: this.validateTipoDocumento(
          String(this.resumenData[0].tipoId)
        ),
        NumeroIdentificacion: this.padNumeroIdentificacion(
          String(this.resumenData[0].id)
        ),
        NombreCliente: nombreCliente,
        NombreGrupo: nombreGrupo,
      };
      this.interconectadosFitec
        .getRelacionDependenciaCliente(
          dataFicha.TipoIdentificacion,
          dataFicha.NumeroIdentificacion
        )
        .subscribe({
          next: (response: fichaTecnica) => {
            console.log('Respuesta del servicio:', response);
            this.oldFactSheet = response;
            swal('¡Éxito!', 'Archivo procesado correctamente.', 'success');
          },
          error: (error) => {
            console.error('Error al llamar al servicio:', error);
            swal('Error', error, 'error');
            this.isLoadingFile = false;
          },
          complete: () => {
            this.isLoadingFile = false;
          },
        });
    } else {
      swal('Error', 'La hoja "Ficha" no se encontró en el archivo.', 'error');
    }
  }

  storeNewFactSheet() {
    this.storeNewFactSheetIsLoading = true;
    this.storeNewFactSheetFailed = false;
    // validación de la ficha técnica
    if (this.newFactSheet.relaciones.length === 0) {
      swal('Error', 'La ficha técnica no tiene relaciones.', 'error');
      this.storeNewFactSheetIsLoading = false;
      return;
    }
    if (this.newFactSheet.penumdoc === null || this.newFactSheet.penumdoc === '') {
      swal('Error', 'El tipo de documento del cliente es requerido.', 'error');
      this.storeNewFactSheetIsLoading = false;
      return;
    }
    if (this.newFactSheet.petipdoc === null || this.newFactSheet.petipdoc === '') {
      swal('Error', 'El número de documento del cliente es requerido.', 'error');
      this.storeNewFactSheetIsLoading = false;
      return;
    }
    const now = new Date();
     // Format as "YYYY-MM-DD HH:MM:SS.SSS" timestamp
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const factSheetCreateDto: FactSheetCreateDto = {
      penumdoc: this.padNumeroIdentificacion(this.newFactSheet.penumdoc),
      petipdoc: this.validateTipoDocumento(this.newFactSheet.petipdoc),
      relaciones: this.newFactSheet.relaciones.map((relacion) => ({
      petipdocDependencia: this.validateTipoDocumento(relacion.petipdocDependencia??'null'),
      penumdocDependencia: this.padNumeroIdentificacion(relacion.penumdocDependencia??'null'),
      petipdocDependiente: this.validateTipoDocumento(relacion.petipdocDependiente),
      penumdocDependiente: this.padNumeroIdentificacion(relacion.penumdocDependiente),
      tipoDependencia: relacion.tipoDependencia,
      })).filter((relacion) => relacion.tipoDependencia !== 100 && relacion.tipoDependencia !== 200 && relacion.tipoDependencia !== 300),
      archivoExcel: this.uint8ArrayToBase64(this.binaryExcelFile),
      fechaCreacion: formattedDate,
    }
    this.interconectadosFitec.saveFactSheetRelationships(factSheetCreateDto).subscribe({
      next: (response) => {
        swal('¡Éxito!', 'Ficha técnica almacenada correctamente.', 'success');        
        this.reset();
      },
      error: (error) => {
        console.log('Error al llamar al servicio:', error);
        swal('Error', error, 'error');
        this.storeNewFactSheetIsLoading = false;
        this.storeNewFactSheetFailed = true;
      },
      complete: () => {
        this.storeNewFactSheetIsLoading = false;
      },
    });
  }

  uint8ArrayToBase64(array: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(array);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Reset both old a new fact sheet data.
   */
  reset() {
    this.oldFactSheet = {
      penumdoc: '',
      petipdoc: '',
      idFichaTecnica: -1,
      fechaCreacion: new Date(),
      usuarioCreacion: '',
      relaciones: [],
    };
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

  // Validar tipo de documento
  validateTipoDocumento(tipoDocumento: string): string {
    switch (tipoDocumento) {
      case 'NIT':
        return 'NT';
      case 'Cedula':
        return 'CC';
      default:
        return tipoDocumento; // Retorna el tipo de documento original si no coincide con 'nit' o 'cedula'
    }
  }

  // Rellenar número de identificación
  padNumeroIdentificacion(numero: string): string {
    return numero.padStart(11, '0');
  }


}
