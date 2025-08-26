<div class="container">
  <div class="row">
    <div class="col-8 mx-auto">
      <form [formGroup]="parametriaLimiteFormGroup">
        <div class="container py-5">
          <div class="row">
            <div class="col">
              <h1>Límite</h1>
            </div>
            <div class="col-auto">
              <div class="row">
                <button
                  mat-stroked-button
                  color="primary"
                  *ngIf="this.parametriaLimiteFormGroup.value.idLimite"
                  (click)="this.parametriaLimiteFormGroup.value.idLimite = null"
                >
                  <mat-icon [svgIcon]="'close'"></mat-icon>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <!-- Campos del fomulario -->
          <div
            [@openClose]="
              this.parametriaLimiteFormGroup.value.idLimite ? 'open' : 'closed'
            "
            class="row justify-content-center overflow-hidden"
          >
            <div class="col-8 mb-5">
              <div class="row">
                <div class="col">
                  <h2>
                    {{
                      this.parametriaLimiteFormGroup.value.idLimite != -1
                        ? "Actualizar Límite" 
                        : "Crear exposición"
                    }}
                  </h2>
                </div>
              </div>
              <div class="row row-cols-2 gx-5">
                <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>Nombre Límite</mat-label>
                    <input matInput formControlName="caso" />
                  </mat-form-field>
                </div>
                <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>Máximo(%)</mat-label>
                    <input type="number" matInput formControlName="maximo" />
                  </mat-form-field>
                </div>
              </div>
              <!-- Botones del fomrulario -->
              <div class="row justify-content-center">
                <div class="col-6">
                  <div class="row">
                    <div class="row justify-content-center">
                      <div class="row">
                        <app-request-button
                          (click)="onSaveButtonClicked()"
                          [isLoading]="isFormLoading"
                          [disabled]="!getSaveButtonEnabled()"
                          >Actualizar</app-request-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <h3 color="primary">Listado de Límites</h3>
          </div>
          <div class="row">
            <app-shared-table
              [dataSource]="tableDataSource"
              [columnConfig]="columnConfig"
              [colmunId]="colmunId"
              [enableSearch]="true"
              [searchValue]="searchValue"
              [searchColumn]="'Caso'"
              [searchLabel]="'Buscar por nombre del Límite'"
              [stateLabel]="tableStateLabel"
              [isProcessing]="isTableLoading"
              [isFailed]="isTableFailed"
            ></app-shared-table>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>



<!-- patrimonio -->




<div class="container">
  <div class="row">
    <div class="col-8 mx-auto">
      <form [formGroup]="parametriaPatrimonioFormGroup">
        <div class="container py-5">
          <div class="row align-items-center">
            <div class="col">
              <h1>Patrimonio Basico</h1>
            </div>
            <div class="col-auto">
              <div class="row">
                <button
                  mat-stroked-button
                  color="primary"
                  (click)="
                    this.parametriaPatrimonioFormGroup.value.idPatrimonio
                      ? (this.parametriaPatrimonioFormGroup.value.idPatrimonio = null)
                      : setNewParametriaMoneda()
                  "
                >
                  <mat-icon
                    [svgIcon]="
                      this.parametriaPatrimonioFormGroup.value.idPatrimonio
                        ? 'close'
                        : 'add'
                    "
                  ></mat-icon>
                  {{
                    this.parametriaPatrimonioFormGroup.value.idPatrimonio
                      ? "Cancelar"
                      : "Crear nuevo Patrimonio"
                  }}
                </button>
              </div>
            </div>
          </div>
          <!-- Campos del fomulario -->
          <div
            [@openClose]="
              this.parametriaPatrimonioFormGroup.value.idPatrimonio ? 'open' : 'closed'
            "
            class="row justify-content-center overflow-hidden"
          >
            <div class="col-8 mb-5">
              <div class="row">
                <div class="col">
                  <h2>
                    {{
                      this.parametriaPatrimonioFormGroup.value.idPatrimonio !=
                      -1
                        ? "Actualizar Patrimonio " 
                        : "Crear Patrimonio"
                    }}
                  </h2>
                </div>
              </div>
              <div class="row row-cols-2 gx-6">
                  <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>Valor Patrimonio:</mat-label>
                    <input type="number" matInput formControlName="vpatrimonio" />
                  </mat-form-field>
                </div>
                <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>Fecha Patrimonio:</mat-label>
                    <input type="date" matInput formControlName="fechaPatrimonio" />
                  </mat-form-field>
                </div>
              </div>
             <div class="row justify-content-center">
                <div class="col-6">
                  <div class="row">
                    <div class="row justify-content-center">
                      <div class="row">
                        <app-request-button
                          (click)="onSaveButtonClicked()"
                          [isLoading]="isFormLoading"
                          [disabled]="!getSaveButtonEnabled()"
                          >{{
                            this.parametriaPatrimonioFormGroup.value.idPatrimonio != -1
                              ? "Actualizar moneda"
                              : "Crear moneda"
                          }}</app-request-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-5">
            <h2 color="primary">Versión Patrimonio</h2>
          </div>
          <div class="row">
            <app-shared-table
              [dataSource]="tableDataPatrimonio"
              [columnConfig]="columnConfigPatrimonio"
              [colmunId]="colmunIdPatrimonio"
              [enableSearch]="true"
              [searchValue]="searchValue"
              [searchLabel]="'Usuarios'"
              [searchColumn]="'Usuario'"
              [searchLabel]="'Buscar por usuario'"
              [stateLabel]="tableStateLabel"
              [isProcessing]="isTableLoading"
            ></app-shared-table>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
