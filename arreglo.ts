<div class="container">
  <div class="row">
    <div class="col-8 mx-auto">
      <form [formGroup]="parametriaMonedaFormGroup">
        <div class="container py-5">
          <div class="row align-items-center">
            <div class="col">
              <h1>Moneda</h1>
            </div>
            <div class="col-auto">
              <div class="row">
                <button
                  mat-stroked-button
                  color="primary"
                  (click)="
                    this.parametriaMonedaFormGroup.value.idMoneda
                      ? (this.parametriaMonedaFormGroup.value.idMoneda = null)
                      : setNewParametriaMoneda()
                  "
                >
                  <mat-icon
                    [svgIcon]="
                      this.parametriaMonedaFormGroup.value.idMoneda
                        ? 'close'
                        : 'add'
                    "
                  ></mat-icon>
                  {{
                    this.parametriaMonedaFormGroup.value.idMoneda
                      ? "Cancelar"
                      : "Crear nueva Moneda"
                  }}
                </button>
              </div>
            </div>
          </div>
          <!-- Campos del fomulario -->
          <div
            [@openClose]="
              this.parametriaMonedaFormGroup.value.idMoneda ? 'open' : 'closed'
            "
            class="row justify-content-center overflow-hidden"
          >
            <div class="col-8 mb-5">
              <div class="row">
                <div class="col">
                  <h2>
                    {{
                      this.parametriaMonedaFormGroup.value.idMoneda !=
                      -1
                        ? "Actualizar Tipo Moneda " 
                        : "Crear Tipo Moneda"
                    }}
                  </h2>
                </div>
              </div>
              <div class="row row-cols-2 gx-6">
                <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>Pesos colombianos (%) :</mat-label>
                    <input type="number" matInput formControlName="pesosColombianos" />
                  </mat-form-field>
                </div>
                <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>USD (%):</mat-label>
                    <input type="number" matInput formControlName="usd" />
                  </mat-form-field>
                </div>
                <div class="col d-flex justify-content-center">
                  <mat-form-field>
                    <mat-label>Otras monedas extranjeras (%):</mat-label>
                    <input type="number" matInput formControlName="otrasMonedasExt" />
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
                            this.parametriaMonedaFormGroup.value.idMoneda != -1
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
            <h2 color="primary">Versión Moneda</h2>
          </div>
          <div class="row">
            <app-shared-table
              [dataSource]="tableDataSource"
              [columnConfig]="columnConfig"
              [colmunId]="colmunId"
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
