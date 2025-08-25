<div class="container py-5">
  <h2>Carga Derivados Manual</h2>

  <!-- Zona Drag & Drop -->
  <div *ngIf="newFichaDerivado.relaciones.length === 0; else dataPreview"
       class="drag-drop-area"
       (drop)="onDrop($event)"
       (dragover)="onDragOver($event)"
       (dragleave)="onDragLeave($event)">

    <div class="file-upload pt-4 text-center">
      <input type="file"
             (change)="onFileSelected($event)"
             accept=".xlsx"
             hidden
             #fileInput>
      <p>Selecciona un archivo Excel válido (.xlsx) de hasta 10MB.</p>

      <button mat-raised-button color="primary"
              (click)="fileInput.click()"
              [disabled]="disabled">
        <mat-icon>upload</mat-icon>
        Seleccionar archivo
      </button>

      <div>
        <small>O arrastra tu archivo aquí</small>
      </div>
    </div>
  </div>

  <!-- Preview de datos -->
  <ng-template #dataPreview>
    <div class="my-4">
      <h5>Datos cargados desde Excel</h5>
      <p><strong>Fecha de carga:</strong> {{ newFichaDerivado.fechaCarga }}</p>

      <!-- Tabla Angular Material -->
      <table mat-table [dataSource]="newFichaDerivado.relaciones" class="mat-elevation-z8 full-width-table">

        <!-- Tipo Identificación -->
        <ng-container matColumnDef="tipoIdentificacion">
          <th mat-header-cell *matHeaderCellDef> Tipo Identificación </th>
          <td mat-cell *matCellDef="let element" [ngClass]="{'duplicado-cell': element.duplicado}">
            {{element.tipoIdentificacion}}
          </td>
        </ng-container>

        <!-- Exposición -->
        <ng-container matColumnDef="exposicion">
          <th mat-header-cell *matHeaderCellDef> Exposición </th>
          <td mat-cell *matCellDef="let element" [ngClass]="{'duplicado-cell': element.duplicado}">
            {{element.exposicion}}
          </td>
        </ng-container>

        <!-- Fecha Operación -->
        <ng-container matColumnDef="fechaOperacion">
          <th mat-header-cell *matHeaderCellDef> Fecha Operación </th>
          <td mat-cell *matCellDef="let element" [ngClass]="{'duplicado-cell': element.duplicado}">
            {{element.fechaOperacion}}
          </td>
        </ng-container>

        <!-- Fecha Carga -->
        <ng-container matColumnDef="fechaCarga">
          <th mat-header-cell *matHeaderCellDef> Fecha Carga </th>
          <td mat-cell *matCellDef="let element">
            {{element.fechaCarga}}
          </td>
        </ng-container>

        <!-- Renderizado -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <!-- Advertencia si hay duplicados -->
      <mat-card *ngIf="newFichaDerivado.relaciones.some(r => r.duplicado)"
                class="mt-3 p-2 bg-warning text-dark">
        ⚠ Algunos registros tienen duplicados (mismo Tipo Identificación y Fecha Operación).  
        Al guardar, la exposición se sumará automáticamente.
      </mat-card>

      <!-- Botones -->
      <div class="d-flex gap-3 mt-3">
        <button mat-stroked-button color="warn" (click)="reset()">
          <mat-icon>close</mat-icon> Cancelar cambios
        </button>

        <button mat-raised-button color="primary"
                (click)="storeNewFactSheet()"
                [disabled]="storeNewFactSheetDisabled">
          <mat-icon>save</mat-icon> Guardar Derivados
        </button>
      </div>
    </div>
  </ng-template>
</div>



// en tu módulo (ej: app.module.ts)
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    ...,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class AppModule {}
displayedColumns: string[] = [
  'tipoIdentificacion',
  'exposicion',
  'fechaOperacion',
  'fechaCarga'
];





.full-width-table {
  width: 100%;
}

.duplicado-cell {
  background-color: #ffe0b2; /* naranja claro */
}


