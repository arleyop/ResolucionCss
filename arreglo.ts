import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametriaLimite } from 'src/app/components/features/parametria/models/parametria-limite.model';
import { ParametriaLimiteService } from 'src/app/components/features/parametria/services/parametria-limite.service';
import { ColumnConfig } from 'src/app/components/features/shared/components/shared-table/shared-table.component';
import swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RequestButtonComponent } from '../../../features/shared/components/request-button/request-button.component';
import { SharedTableComponent } from '../../../features/shared/components/shared-table/shared-table.component';
import { ParametriaPatrimonio } from 'src/app/components/features/parametria/models/parametria-patrimonio.model';
import { ParametriaPatrimonioService } from 'src/app/components/features/parametria/services/parametria-patrimonio.service';

interface TableData {
  IdLimite: number | undefined;
  Caso: string | undefined;
  Maximo: number | undefined;
}


interface TableDataPatrimonio {
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
    selector: 'app-limite',
    templateUrl: './limite.component.html',
    styleUrls: ['./limite.component.css'],
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
        NgIf,
        MatButton,
        MatIcon,
        MatFormField,
        MatLabel,
        MatInput,
        RequestButtonComponent,
        SharedTableComponent,
    ],
})
export class LimiteComponent implements OnInit {
  // Estado de la carga
  isFormLoading: boolean = false;
  isTableLoading: boolean = true;
  isTableFailed: boolean = false;
  tableStateLabel: string = 'Listo.';
  // Controles del formulario
  parametriaLimiteFormGroup!: FormGroup;
  parametriaPatrimonioFormGroup!: FormGroup;
  // Columna a usar como identificador
  colmunId = 'IdLimite';
  // Columna a usar como identificador
  colmunIdPatrimonio = 'Version';
  // Configuración de cada columna
  columnConfig: ColumnConfig = {
    Caso: { header: 'Nombre del Límite', type: 'text' },
    Maximo: { header: 'Máximo (%)', type: 'text' },
    Editar: {
      header: 'Editar',
      type: 'button',
      handler: this.setParametriaLimiteFormGroupById.bind(this),
      icon: 'edit',
    },
    // Eliminar: { header: 'Eliminar',       type: 'button', handler: this.deleteParametriaLimite.bind(this),            icon: 'delete'  } // Deprecated
  };



  columnConfigPatrimonio: ColumnConfig = {
    Version: { header: 'Versión', type: 'text' },
    Creacion: { header: 'Fecha Creación', type: 'text' },
    Modificacion: { header: 'Fecha Modificación', type: 'text' },
    Usuario: { header: 'Usuario', type: 'text' },
    ModificadoPor: { header: 'Modificado Por', type: 'text' },
    Estado: {
      header: 'Estado',
      type: 'toggle',
      handler: this.updateRowStatusParametriaPatrimonioById.bind(this),
    },
    Editar: {
      header: 'Editar',
      type: 'button',
      handler: this.setParametriaPatrimonioFormGroupById.bind(this),
      icon: 'edit',
    }
  };
  // Fuente de datos de la tabla
  tableDataSource: TableData[] = [];

    // Fuente de datos de la tabla
  tableDataPatrimonio: TableDataPatrimonio[] = [];
  // Fila seleccionada
  rowSelected: TableData | null = null;

    // Fila seleccionada
  rowSelectedPatrimonio: TableDataPatrimonio | null = null;
  // Valor de búsqueda
  searchValue: string = '';
  // Parametria limite seleccionada
  parametriaExposicionSelected: ParametriaLimite | null = null;

  /**
   * Constructor
   *
   * @param formBuilder
   * @param parametriaLimiteService
   */
  constructor(
    private formBuilder: FormBuilder,
    private parametriaLimiteService: ParametriaLimiteService,
    private parametriaPatriminioService: ParametriaPatrimonioService
  ) {}

  /**
   * This method is called when the component is initialized
   */
  ngOnInit() {
    // Get the data from the service for the table
    this.updateTableDataSource();
    // Populate the form group with empty values
    this.parametriaLimiteFormGroup = this.formBuilder.group({
      idLimite: [''],
      caso: ['', [Validators.required, Validators.maxLength(50)]],
      maximo: ['', [Validators.required, Validators.pattern('^(?:[0-9]{0,1}[0-9]?|100)$')]],
    });

    this.updateTableDataSourcePatrimonio();

    this.parametriaPatrimonioFormGroup = this.formBuilder.group({
      idMoneda: [''],
      vpatrimonio: [''],
      fechaPatrimonio: [''],
      estado: [true, [Validators.required]],
    });

  }

  /**
   * Update table data source
   */
  updateTableDataSource(): void {
    this.isTableLoading = true;
    this.isTableFailed = false;
    this.tableStateLabel = 'Cargando...';
    this.parametriaLimiteService.getParametriaLimites().subscribe({
      next: (data: ParametriaLimite[]) => {
        // Map the data to the table data source
        this.tableDataSource = data.map((item: ParametriaLimite) => {
          return {
            IdLimite: item.idLimite,
            Caso: item.caso,
            Maximo: item.maximo,
          };
        });
      },
      error: (error) => {
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
   * Get the save button enabled
   *
   * @returns boolean: true if the form is valid
   */
  getSaveButtonEnabled(): boolean {
    return this.parametriaLimiteFormGroup.valid;
  }

  /**
   * This method is called when the save button is clicked
   */
  onSaveButtonClicked() {
    // Verificar si el formulario es válido
    if (!this.getSaveButtonEnabled()) {
      return;
    }
    this.updateParametriaLimite(this.parametriaLimiteFormGroup.value);
  }

  /**
   * Set the parametria limite by id
   *
   * @param id
   */
  setParametriaLimiteFormGroupById(id: number) {
    this.isFormLoading = true;
    const foundItem = this.tableDataSource.find((item) => item.IdLimite === id);
    this.rowSelected = foundItem ? foundItem : null;
    this.parametriaLimiteService.getParametriaLimiteById(id).subscribe({
      next: (data: ParametriaLimite) => {
        this.parametriaLimiteFormGroup.patchValue(data);
      },
      error: (error) => {
        swal('Error al obtener el limite', error, 'error');
        this.isFormLoading = false;
      },
      complete: () => {
        this.isFormLoading = false;
      },
    });
  }

  /**
   * Update the selected parametria limite
   *
   * @param parametriaExposicion
   */
  updateParametriaLimite(parametriaExposicion: ParametriaLimite) {
    this.isFormLoading = true;
    console.log('updateParametriaLimite:', parametriaExposicion);
    this.parametriaLimiteService
      .updateParametriaLimite(parametriaExposicion)
      .subscribe({
        next: () => {
          this.updateTableDataSource();
          swal(
            'Límite actualizado',
            'El límite ha sido actualizado correctamente.',
            'success'
          );
        },
        error: (error) => {
          swal('Error al actualizar el limite', error, 'error');
          this.isFormLoading = false;
        },
        complete: () => {
          this.isFormLoading = false;
        },
      });
  }


/**
 * Paguinacio  para patrimonio 
 * 
 * 
 */


/**
   * Update status of the selected parametria exposicion row of the table
   *
   * @param id
   */
  updateRowStatusParametriaPatrimonioById(id: number): void {
    this.isTableLoading = true;
    this.isTableFailed = false;
    this.tableStateLabel = 'Actualizando...';
    // get the item from the table data source
    const foundItem = this.tableDataPatrimonio .find((item) => item.Version === id);
    if (foundItem) {
      // we need to persist the state which has been changed
      const newStatus = foundItem?.Estado;
      // Get the entity by id
      this.parametriaPatriminioService.getParametriaPatrimonioById(id).subscribe({
          next: (parametriaExposicion: ParametriaPatrimonio) => {
            // change the status from the entity
            parametriaExposicion.estado = newStatus ? 1 : 0;
            // update the entity
            this.parametriaPatriminioService
              .updateParametriaPatrimonioEstado(parametriaExposicion)
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


  setParametriaPatrimonioFormGroupById(id: number) {
      this.isFormLoading = true;
      const foundItem = this.tableDataPatrimonio.find((item) => item.Version === id);
      this.rowSelectedPatrimonio = foundItem ? foundItem : null;
      this.parametriaPatriminioService.getParametriaPatrimonioById(id).subscribe({
          next: (data: ParametriaPatrimonio) => {
            this.parametriaPatrimonioFormGroup.patchValue(data);
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
  
      setNewParametriaMoneda(): void {
          this.parametriaPatrimonioFormGroup.reset();
          this.parametriaPatrimonioFormGroup.get('estado')?.setValue(true);
          let newParametriaMoneda: ParametriaPatrimonio = {
            idPatrimonio: -1,
            fec_periodo: "",
            patrimonio: "",
            estado: 1
          };
          this.parametriaPatrimonioFormGroup.patchValue(newParametriaMoneda);
          // Focus on the first mat-form-field
          const firstInput = document.querySelector(
            'mat-form-field input'
          ) as HTMLInputElement;
          if (firstInput) {
            firstInput.focus();
          }
        }

  /**
   * Update table data source
   */
  updateTableDataSourcePatrimonio(): void {
    this.isTableLoading = true;
    this.parametriaPatriminioService.getParametriaPatrimonios().subscribe({
      next: (data: ParametriaPatrimonio[]) => {
        // Map the data to the table data source
        this.tableDataPatrimonio = data.map((item: ParametriaPatrimonio) => {
          return {
            Version: item.idPatrimonio,
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

}
