import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametriaMoneda } from 'src/app/components/features/parametria/models/parametria-moneda.model';
import { ParametriaMonedaService } from 'src/app/components/features/parametria/services/parametria-moneda.service';
import { ColumnConfig } from 'src/app/components/features/shared/components/shared-table/shared-table.component';
import swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RequestButtonComponent } from '../../../features/shared/components/request-button/request-button.component';
import { SharedTableComponent } from '../../../features/shared/components/shared-table/shared-table.component';

interface TableData {
  Version: number | undefined;
  Creacion: string | undefined;
  Modificacion: string | undefined;
  Usuario: string;
  ModificadoPor: string;
  Estado: boolean;
}

/**
 *
 * @author Fredy Rosero
 */
@Component({
    selector: 'app-moneda',
    templateUrl: './moneda.component.html',
    styleUrls: ['./moneda.component.css'],
    animations: [
        trigger('openClose', [
            // ...
            state('open', style({
                height: '*',
                opacity: 1,
            })),
            state('closed', style({
                height: '0px',
                opacity: 0,
            })),
            transition('open => closed', [animate('0.3s')]),
            transition('closed => open', [animate('0.3s')]),
        ]),
    ],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButton,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        RequestButtonComponent,
        SharedTableComponent,
    ],
})
export class MonedaComponent implements OnInit {
  // Estado de la carga
  isFormLoading: boolean = false;
  isTableLoading: boolean = true;
  isTableFailed: boolean = false;
  tableStateLabel: string = 'Listo.';
  // Controles del formulario
  parametriaMonedaFormGroup!: FormGroup;
  // Columna a usar como identificador
  colmunId = 'Version';
  // Configuración de cada columna
  columnConfig: ColumnConfig = {
    Version: { header: 'Versión', type: 'text' },
    Creacion: { header: 'Fecha Creación', type: 'text' },
    Modificacion: { header: 'Fecha Modificación', type: 'text' },
    Usuario: { header: 'Usuario', type: 'text' },
    ModificadoPor: { header: 'Modificado Por', type: 'text' },
    Estado: {
      header: 'Estado',
      type: 'toggle',
      handler: this.updateRowStatusParametriaMonedaById.bind(this),
    },
    Editar: {
      header: 'Editar',
      type: 'button',
      handler: this.setParametriaMonedaFormGroupById.bind(this),
      icon: 'edit',
    },
    Eliminar: {
      header: 'Eliminar',
      type: 'button',
      handler: this.deleteRowParametriaMonedo.bind(this),
      icon: 'delete',
    },
  };
  // Fuente de datos de la tabla
  tableDataSource: TableData[] = [];
  // Fila seleccionada
  rowSelected: TableData | null = null;
  // Valor de búsqueda
  searchValue: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private parametriaMonedaService: ParametriaMonedaService
  ) {}

  ngOnInit() {
    // Get the data from the service for the table
    this.updateTableDataSource();
    // TODO: validations
    this.parametriaMonedaFormGroup = this.formBuilder.group({
      idMoneda: [''],
      pesosColombianos: [
        '',
        [Validators.required, Validators.pattern('^(?:[0-9]{0,1}[0-9]?|100)$')],
      ],
      usd: ['', [Validators.required, Validators.pattern('^(?:[0-9]{0,1}[0-9]?|100)$')]],
      otrasMonedasExt: [
        '',
        [Validators.required, Validators.pattern('^(?:[0-9]{0,1}[0-9]?|100)$')],
      ],
      estado: [true, [Validators.required]],
    });
  }

  /**
   * This method is called when the data source changes
   */
  ngOnChanges() {
    console.log('dataSource:', this.tableDataSource);
  }

  /**
   * Update table data source
   */
  updateTableDataSource(): void {
    this.isTableLoading = true;
    this.parametriaMonedaService.getParametriaMonedas().subscribe({
      next: (data: ParametriaMoneda[]) => {
        // Map the data to the table data source
        this.tableDataSource = data.map((item: ParametriaMoneda) => {
          return {
            Version: item.idMoneda,
            Creacion: item.fechaCreacion,
            Modificacion: item.fechaModificacion,
            Usuario: item.nombreUsuario ?? '',
            ModificadoPor: item.nombreUsuarioModificado ?? '',
            Estado: item.estado === 1 ? true : false,
          };
        });
      },
      error: (error) => {
        console.error(error);
        swal('Error al cargar los datos', error, 'error');
        this.isTableLoading = false;
        this.isTableFailed = true;
        this.tableStateLabel = 'Error al cargar los datos.';
      },
      complete: () => {
        this.isTableLoading = false;
        this.tableStateLabel = 'Listo.';
      },
    });
  }

  /**
   * Set the parametria exposición form by the status
   */
  setParametriaMonedaFormGroupByStatus(): void {
    // Get the first item with 'Estado' as TRUE or 1
    const foundItem = this.tableDataSource.find((item) => item.Estado);
    // Asign the found item to the rowSelected
    this.rowSelected = foundItem ? foundItem : null;
    // Get the data of the selected itme
    if (this.rowSelected && this.rowSelected.Version) {
      this.setParametriaMonedaFormGroupById(this.rowSelected.Version);
    }
  }

  /**
   * Set a new empty parametriaExposicion for selection
   */
  setNewParametriaMoneda(): void {
    this.parametriaMonedaFormGroup.reset();
    this.parametriaMonedaFormGroup.get('estado')?.setValue(true);
    let newParametriaMoneda: ParametriaMoneda = {
      idMoneda: -1,
      pesosColombianos: 0,
      usd: 0,
      otrasMonedasExt: 0,
      estado: 1,
    };
    this.parametriaMonedaFormGroup.patchValue(newParametriaMoneda);
    // Focus on the first mat-form-field
    const firstInput = document.querySelector(
      'mat-form-field input'
    ) as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  /**
   * Get the save button enabled
   *
   * @returns boolean: true if the form is valid
   */
  getSaveButtonEnabled(): boolean {
    return this.parametriaMonedaFormGroup.valid;
  }

  /**
   * This method is called when the save button is clicked
   */
  onSaveButtonClicked() {
    // Verificar si el formulario es válido
    if (!this.getSaveButtonEnabled()) {
      return;
    }
    // Verificar si es un nuevo registro o se va a actualizar
    if (this.parametriaMonedaFormGroup.value.idMoneda != -1) {
      // Actualizar
      this.updateFormParametriaMoneda(this.parametriaMonedaFormGroup.value);
    } else {
      // Crear
      this.createRowParametriaMoneda(this.parametriaMonedaFormGroup.value);
    }
    //this.CreateParametriaMoneda(this.formGroup.value);
  }

  /**
   *  Save the selected parametria moneda
   *
   * @param parametriaMoneda
   */
  createRowParametriaMoneda(parametriaMoneda: ParametriaMoneda) {
    this.isFormLoading = true;
    // Remover `idMoneda`
    delete parametriaMoneda.idMoneda;
    // Agregar `estado` como true
    parametriaMoneda.estado = 1;
    this.parametriaMonedaService
      .createParametriaMoneda(parametriaMoneda)
      .subscribe({
        next: (data: any) => {
          this.isFormLoading = false;
          console.log('ParametriaMoneda created:', data);
          // Recargar la tabla
          this.updateTableDataSource();
          // Blanquear formulario
          this.setNewParametriaMoneda();
        },
        error: (error) => {
          swal('Error al crear la moneda', error, 'error');
          this.isFormLoading = false;
        },
        complete: () => {
          this.isFormLoading = false;
        },
      });
  }

  /**
   * Set the parametria moneda by id
   *
   * @param id
   */
  setParametriaMonedaFormGroupById(id: number) {
    this.isFormLoading = true;
    const foundItem = this.tableDataSource.find((item) => item.Version === id);
    this.rowSelected = foundItem ? foundItem : null;
    this.parametriaMonedaService.getParametriaMonedaById(id).subscribe({
        next: (data: ParametriaMoneda) => {
          this.parametriaMonedaFormGroup.patchValue(data);
        },
        error: (error) => {
          swal('Error al cargar la moneda', error, 'error');
          this.isFormLoading = false;
        },
        complete: () => {
          this.isFormLoading = false;
        },
      });
  }

  /**
   * Update status of the selected parametria exposicion row of the table
   *
   * @param id
   */
  updateRowStatusParametriaMonedaById(id: number): void {
    this.isTableLoading = true;
    this.isTableFailed = false;
    this.tableStateLabel = 'Actualizando...';
    // get the item from the table data source
    const foundItem = this.tableDataSource.find((item) => item.Version === id);
    if (foundItem) {
      // we need to persist the state which has been changed
      const newStatus = foundItem?.Estado;
      // Get the entity by id
      this.parametriaMonedaService.getParametriaMonedaById(id).subscribe({
          next: (parametriaExposicion: ParametriaMoneda) => {
            // change the status from the entity
            parametriaExposicion.estado = newStatus ? 1 : 0;
            // update the entity
            this.parametriaMonedaService
              .updateParametriaMonedaEstado(parametriaExposicion)
              .subscribe({
                next: () => {
                  swal(
                    'Moneda actualizada',
                    `La moneda ha sido ${
                      newStatus ? 'activada' : 'desactivada'
                    }`,
                    'success'
                  );
                  // Refresh the table
                  this.updateTableDataSource();
                },
                error: (error) => {
                  swal(
                    'Error al actualizar la moneda',
                    error,
                    'error'
                  );
                  this.tableStateLabel = error;
                  this.isTableLoading = false;
                  this.isTableFailed = true;
                  foundItem.Estado = !newStatus; // rollback
                },
                complete: () => {
                  this.isTableLoading = false;
                  this.tableStateLabel = 'Listo.';
                },
              });
          },
          error: (error) => {
            swal('Error al cargar la moneda', error, 'error');
            this.isTableLoading = false;
          },
          complete: () => {
            this.isTableLoading = false;
          },
        });
    } else {
      swal(
        'Error al actualizar el estado de la moneda',
        `No exsite una fila con el id "${id}"`,
        'error'
      );
      this.isTableLoading = false;
    }
  }

  /**
   * Update the selected parametria moneda
   *
   * @param parametriaMoneda
   */
  updateFormParametriaMoneda(parametriaMoneda: ParametriaMoneda) {
    this.isFormLoading = true;
    this.parametriaMonedaService
      .updateParametriaMoneda(parametriaMoneda)
      .subscribe({
        next: () => {
          this.updateTableDataSource();
          swal(
            'Moneda actualizada',
            'La moneda ha sido actualizada',
            'success'
          );
        },
        error: (error) => {
          swal('Error al actualizar la moneda', error, 'error');
          this.isFormLoading = false;
        },
        complete: () => {
          this.isFormLoading = false;
        }
      });
  }

  /**
   * Delete the selected parametria exposicion
   *
   * @param id
   */
  deleteRowParametriaMonedo(id: number) {
    this.isTableLoading = true;
    this.isTableFailed = false;
    this.tableStateLabel = 'Eliminando...';
    this.parametriaMonedaService
      .deleteParametriaMoneda(id)
      .subscribe({
        next: () => {
          swal(
            'Moneda eliminda',
            'La moneda ha sido eliminada',
            'success')
          // Actualizar tabla
          this.updateTableDataSource();
          // Blanqueara formulario
          this.setNewParametriaMoneda();
        },
        error: (error) => {
          swal('Error al eliminar la moneda', error, 'error');
          this.isTableLoading = false;
          this.isTableFailed = true;
          this.tableStateLabel = "Error al eliminar la moneda.";
        },
        complete: () => {
          this.isTableLoading = false;
          this.tableStateLabel = 'Listo.';
        },
      });
  }
}
