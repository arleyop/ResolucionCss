import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { ParametriaLimiteService } from 'src/app/services/parametria-limite.service';
import { ParametriaPatrimonioService } from 'src/app/services/parametria-patrimonio.service';
import { ParametriaLimite } from 'src/app/models/parametria-limite';
import { ParametriaPatrimonio } from 'src/app/models/parametria-patrimonio';

@Component({
  selector: 'app-limite',
  templateUrl: './limite.component.html',
  styleUrls: ['./limite.component.scss']
})
export class LimiteComponent implements OnInit {

  // Formularios
  parametriaLimiteFormGroup!: FormGroup;
  parametriaPatrimonioFormGroup!: FormGroup;

  // Estados
  isFormLoading = false;
  isTableLoading = false;
  isTableFailed = false;
  tableStateLabel = 'Listo.';

  // Tablas
  tableDataLimite: ParametriaLimite[] = [];
  tableDataPatrimonio: ParametriaPatrimonio[] = [];
  columnConfigLimite: any[] = [];
  columnConfigPatrimonio: any[] = [];
  colmunIdLimite = 'idLimite';
  colmunIdPatrimonio = 'idPatrimonio';

  searchValue = '';

  constructor(
    private formBuilder: FormBuilder,
    private parametriaLimiteService: ParametriaLimiteService,
    private parametriaPatriminioService: ParametriaPatrimonioService
  ) {}

  ngOnInit(): void {
    // ====== LIMITE ======
    this.parametriaLimiteFormGroup = this.formBuilder.group({
      idLimite: [''],
      limite: ['', [Validators.required, Validators.min(0)]],
      fec_periodo: ['', [Validators.required]],
      estado: [true, [Validators.required]],
    });

    this.updateTableDataSourceLimite();

    // ====== PATRIMONIO ======
    this.parametriaPatrimonioFormGroup = this.formBuilder.group({
      idPatrimonio: [''],
      patrimonio: ['', [Validators.required, Validators.min(0)]],
      fec_periodo: ['', [Validators.required]],
      estado: [true, [Validators.required]],
    });

    this.updateTableDataSourcePatrimonio();
  }

  // ==========================================
  // ============== LIMITE ====================
  // ==========================================

  setNewParametriaLimite(): void {
    this.parametriaLimiteFormGroup.reset();
    this.parametriaLimiteFormGroup.get('estado')?.setValue(true);
    const newParam: ParametriaLimite = {
      idLimite: -1,
      limite: 0,
      fec_periodo: '',
      estado: 1,
    };
    this.parametriaLimiteFormGroup.patchValue(newParam);
  }

  getSaveButtonEnabledLimite(): boolean {
    return this.parametriaLimiteFormGroup.valid;
  }

  onSaveButtonClickedLimite() {
    if (!this.getSaveButtonEnabledLimite()) return;

    const payload: ParametriaLimite = this.parametriaLimiteFormGroup.value;
    if (payload.idLimite != null && payload.idLimite !== -1) {
      this.updateFormParametriaLimite(payload);
    } else {
      this.createRowParametriaLimite(payload);
    }
  }

  createRowParametriaLimite(param: ParametriaLimite) {
    this.isFormLoading = true;
    const toCreate = { ...param };
    delete (toCreate as any).idLimite;
    toCreate.estado = 1;

    this.parametriaLimiteService.createParametriaLimite(toCreate).subscribe({
      next: () => {
        this.updateTableDataSourceLimite();
        swal('Límite creado', 'El límite ha sido creado correctamente.', 'success');
        this.setNewParametriaLimite();
      },
      error: (error) => {
        swal('Error al crear el límite', error, 'error');
        this.isFormLoading = false;
      },
      complete: () => {
        this.isFormLoading = false;
      },
    });
  }

  updateFormParametriaLimite(param: ParametriaLimite) {
    this.isFormLoading = true;
    this.parametriaLimiteService.updateParametriaLimite(param).subscribe({
      next: () => {
        this.updateTableDataSourceLimite();
        swal('Límite actualizado', 'El límite ha sido actualizado correctamente.', 'success');
      },
      error: (error) => {
        swal('Error al actualizar el límite', error, 'error');
        this.isFormLoading = false;
      },
      complete: () => {
        this.isFormLoading = false;
      },
    });
  }

  deleteRowParametriaLimite(id: number) {
    this.isTableLoading = true;
    this.tableStateLabel = 'Eliminando...';
    this.parametriaLimiteService.deleteParametriaLimite(id).subscribe({
      next: () => {
        swal('Límite eliminado', 'El límite ha sido eliminado', 'success');
        this.updateTableDataSourceLimite();
        this.setNewParametriaLimite();
      },
      error: (error) => {
        swal('Error al eliminar el límite', error, 'error');
        this.isTableLoading = false;
        this.isTableFailed = true;
        this.tableStateLabel = 'Error al eliminar límite.';
      },
      complete: () => {
        this.isTableLoading = false;
        this.tableStateLabel = 'Listo.';
      },
    });
  }

  updateTableDataSourceLimite() {
    this.isTableLoading = true;
    this.parametriaLimiteService.getParametriaLimites().subscribe({
      next: (data) => {
        this.tableDataLimite = data;
      },
      error: (error) => {
        swal('Error al cargar límites', error, 'error');
        this.isTableFailed = true;
      },
      complete: () => {
        this.isTableLoading = false;
      },
    });
  }

  // ==========================================
  // ============ PATRIMONIO ==================
  // ==========================================

  setNewParametriaPatrimonio(): void {
    this.parametriaPatrimonioFormGroup.reset();
    this.parametriaPatrimonioFormGroup.get('estado')?.setValue(true);
    const newParam: ParametriaPatrimonio = {
      idPatrimonio: -1,
      patrimonio: 0,
      fec_periodo: '',
      estado: 1,
    };
    this.parametriaPatrimonioFormGroup.patchValue(newParam);
  }

  getSaveButtonEnabledPatrimonio(): boolean {
    return this.parametriaPatrimonioFormGroup.valid;
  }

  onSaveButtonClickedPatrimonio() {
    if (!this.getSaveButtonEnabledPatrimonio()) return;

    const payload: ParametriaPatrimonio = this.parametriaPatrimonioFormGroup.value;
    if (payload.idPatrimonio != null && payload.idPatrimonio !== -1) {
      this.updateFormParametriaPatrimonio(payload);
    } else {
      this.createRowParametriaPatrimonio(payload);
    }
  }

  createRowParametriaPatrimonio(param: ParametriaPatrimonio) {
    this.isFormLoading = true;
    const toCreate = { ...param };
    delete (toCreate as any).idPatrimonio;
    toCreate.estado = 1;

    this.parametriaPatriminioService.createParametriaPatrimonio(toCreate).subscribe({
      next: () => {
        this.updateTableDataSourcePatrimonio();
        swal('Patrimonio creado', 'El patrimonio ha sido creado correctamente.', 'success');
        this.setNewParametriaPatrimonio();
      },
      error: (error) => {
        swal('Error al crear el patrimonio', error, 'error');
        this.isFormLoading = false;
      },
      complete: () => {
        this.isFormLoading = false;
      },
    });
  }

  updateFormParametriaPatrimonio(param: ParametriaPatrimonio) {
    this.isFormLoading = true;
    this.parametriaPatriminioService.updateParametriaPatrimonio(param).subscribe({
      next: () => {
        this.updateTableDataSourcePatrimonio();
        swal('Patrimonio actualizado', 'El patrimonio ha sido actualizado correctamente.', 'success');
      },
      error: (error) => {
        swal('Error al actualizar el patrimonio', error, 'error');
        this.isFormLoading = false;
      },
      complete: () => {
        this.isFormLoading = false;
      },
    });
  }

  deleteRowParametriaPatrimonio(id: number) {
    this.isTableLoading = true;
    this.tableStateLabel = 'Eliminando...';
    this.parametriaPatriminioService.deleteParametriaPatrimonio(id).subscribe({
      next: () => {
        swal('Patrimonio eliminado', 'El patrimonio ha sido eliminado', 'success');
        this.updateTableDataSourcePatrimonio();
        this.setNewParametriaPatrimonio();
      },
      error: (error) => {
        swal('Error al eliminar el patrimonio', error, 'error');
        this.isTableLoading = false;
        this.isTableFailed = true;
        this.tableStateLabel = 'Error al eliminar patrimonio.';
      },
      complete: () => {
        this.isTableLoading = false;
        this.tableStateLabel = 'Listo.';
      },
    });
  }

  updateTableDataSourcePatrimonio() {
    this.isTableLoading = true;
    this.parametriaPatriminioService.getParametriaPatrimonios().subscribe({
      next: (data) => {
        this.tableDataPatrimonio = data;
      },
      error: (error) => {
        swal('Error al cargar patrimonio', error, 'error');
        this.isTableFailed = true;
      },
      complete: () => {
        this.isTableLoading = false;
      },
    });
  }
}
