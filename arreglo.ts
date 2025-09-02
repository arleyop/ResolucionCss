<div class="container">
  <div class="row">
    <div class="col-10 mx-auto">
      <div class="container py-5">
        <div class="row">
          <h1 color="primary">Simulador</h1>
        </div>
        <!-- Campos del fomulario para consultar por documento-->
        <form [formGroup]="documentFormGroup">
          <div class="row row-cols-3 justify-content-center">
            <div class="col-auto d-flex justify-content-center">
              <mat-form-field>
                <mat-label>Tipo de documento</mat-label>
                <mat-select formControlName="docmentTypeField">
                  <mat-option
                    *ngFor="let documentTypeOption of documentTypeOptions"
                    [value]="documentTypeOption"
                  >
                    {{ documentTypeOption }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="col-auto d-flex justify-content-center">
              <mat-form-field>
                <mat-label>Número de documento</mat-label>
                <input matInput formControlName="documentNumberField" />
              </mat-form-field>
            </div>
            <button
              class="col-1"
              mat-icon-button
              color="warn"
              (click)="
                simulatorCustomer = undefined;
                documentFormGroup.reset();
              "
            >
              <mat-icon svgIcon="close"></mat-icon>
            </button>
          </div>
          <!-- Botones del fomrulario -->
          <div class="row justify-content-center pb-4">
            <div class="col-6">
              <div class="row">
                <app-request-button
                  (click)="onQueryButtonClicked()"
                  [isLoading]="isQueryLoading"
                  [icon]="'search'"
                  [disabled]="!getQueryButtonEnabled()"
                  >Consultar</app-request-button
                >
              </div>
            </div>
          </div>
        </form>
        <!-- Campos del fomulario de marcación -->
        <div class="row overflow-hidden mat-elevation-z1 rounded-3 bg-white">
          <div class="container p-5">
            <div class="row mb-2">
              <h2 color="primary">Exposición</h2>
            </div>
            <form [formGroup]="parametersFormGroup">
              <div
                *ngIf="!simulatorCustomer"
                class="row justify-content-center"
              >
                <p>
                  Seleccione un cliente para configurar los parámetros de la
                  simulación
                </p>
              </div>
              <div
                class="container"
                [@openClose]="simulatorCustomer ? 'open' : 'closed'"
              >
                <div class="row mb-2">
                  <p>
                    Parametros de simulación de exposición para el cliente
                    <em>{{ simulatorCustomer?.penomper }}</em
                    >({{ simulatorCustomer?.petipdoc }}.
                    {{ simulatorCustomer?.penumper }})
                  </p>
                </div>
                <div class="row row-cols-2 gx-5">
                  <div class="col d-flex justify-content-start">
                    <mat-form-field class="col-3">
                      <mat-label>Moneda</mat-label>
                      <mat-select formControlName="portfolioCurrencyField">
                        <mat-option [value]="null">Ninguno</mat-option>
                        <mat-option
                          *ngFor="let currencyTypeOption of currencyTypeOptions"
                          [value]="currencyTypeOption"
                        >
                          {{ currencyTypeOption }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field class="col-9">
                      <mat-label>Cartera</mat-label>
                      <input matInput formControlName="portfolioField" />
                    </mat-form-field>
                  </div>
                  <div class="col d-flex justify-content-end">
                    <mat-form-field class="col-3">
                      <mat-label>Moneda</mat-label>
                      <mat-select formControlName="derivativesCurrencyField">
                        <mat-option [value]="null">Ninguno</mat-option>
                        <mat-option
                          *ngFor="let currencyTypeOption of currencyTypeOptions"
                          [value]="currencyTypeOption"
                        >
                          {{ currencyTypeOption }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field class="col-9">
                      <mat-label>Derivados</mat-label>
                      <input matInput formControlName="derivativesField" />
                    </mat-form-field>
                  </div>
                  <div class="col d-flex justify-content-center">
                    <mat-form-field class="col-3">
                      <mat-label>Moneda</mat-label>
                      <mat-select
                        formControlName="financialGuaranteeCurrencyField"
                      >
                        <mat-option [value]="null">Ninguno</mat-option>
                        <mat-option
                          *ngFor="let currencyTypeOption of currencyTypeOptions"
                          [value]="currencyTypeOption"
                        >
                          {{ currencyTypeOption }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field class="col-9">
                      <mat-label>Garantía financiera</mat-label>
                      <input
                        matInput
                        formControlName="financialGuaranteeField"
                      />
                    </mat-form-field>
                  </div>
                  <div class="col d-flex justify-content-center">
                    <mat-form-field class="col-3">
                      <mat-label>Moneda</mat-label>
                      <mat-select
                        formControlName="technicalGuaranteeCurrencyField"
                      >
                        <mat-option [value]="null">Ninguno</mat-option>
                        <mat-option
                          *ngFor="let currencyTypeOption of currencyTypeOptions"
                          [value]="currencyTypeOption"
                        >
                          {{ currencyTypeOption }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field class="col-9">
                      <mat-label>Garantía técnica</mat-label>
                      <input
                        matInput
                        formControlName="technicalGuaranteeField"
                      />
                    </mat-form-field>
                  </div>
                  <div class="col d-flex justify-content-center">
                    <mat-form-field class="col-3">
                      <mat-label>Moneda</mat-label>
                      <mat-select formControlName="committedLineCurrencyField">
                        <mat-option [value]="null">Ninguno</mat-option>
                        <mat-option
                          *ngFor="let currencyTypeOption of currencyTypeOptions"
                          [value]="currencyTypeOption"
                        >
                          {{ currencyTypeOption }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field class="col-9">
                      <mat-label>Línea comprometida</mat-label>
                      <input matInput formControlName="committedLineField" />
                    </mat-form-field>
                  </div>
                </div>
                <div class="row mb-2">
                  <h3 color="primary">Garantías*</h3>
                </div>
                <ng-container
                  *ngFor="
                    let forms of garanteeRowFormsGroup | keyvalue;
                    let i = index
                  "
                >
                  <form [formGroup]="garanteeRowFormsGroup[i]">
                    <div class="row justify-content-center gx-0">
                      <mat-form-field class="col-3">
                        <mat-label>Tipo</mat-label>
                        <input
                          type="text"
                          matInput
                          formControlName="typeField"
                          required
                          [matAutocomplete]="autoGroup"
                        />
                        <mat-autocomplete
                          #autoGroup="matAutocomplete"
                          (optionSelected)="
                            garanteeRowFormsGroup[i].patchValue({
                              codeField: $event.option.value['codigoGarantia']
                            })
                          "
                          [displayWith]="displayFn"
                        >
                          <mat-option
                            *ngFor="
                              let garanteeOption of garanteeRowFormsGroup[i]
                                .filteredOptions | async
                            "
                            [value]="garanteeOption"
                          >
                            {{ garanteeOption.descripcionGarantia }}
                          </mat-option>
                        </mat-autocomplete>
                      </mat-form-field>
                      <mat-form-field class="col-1">
                        <mat-label>Código</mat-label>
                        <!-- <input matInput readonly="true" [value]="garanteeRowFormsGroup[i].value['typeField']['codigoGarantia']??''"> -->
                        <input
                          matInput
                          readonly="true"
                          formControlName="codeField"
                        />
                      </mat-form-field>
                      <mat-form-field class="col-2">
                        <mat-label>Homologación</mat-label>
                        <input
                          matInput
                          readonly="true"
                          [value]="
                            garanteeRowFormsGroup[i].value['typeField'][
                              'homologacion'
                            ] ?? ''
                          "
                        />
                      </mat-form-field>
                      <mat-form-field class="col-1">
                        <mat-label>PDI</mat-label>
                        <input
                          matInput
                          readonly="true"
                          [value]="
                            garanteeRowFormsGroup[i].value['typeField'][
                              'pdi'
                            ] ?? ''
                          "
                        />
                      </mat-form-field>
                      <mat-form-field class="col-2">
                        <mat-label>Moneda</mat-label>
                        <mat-select formControlName="currencyField">
                          <mat-option [value]="null">Ninguno</mat-option>
                          <mat-option
                            *ngFor="
                              let currencyTypeOption of currencyTypeOptions
                            "
                            [value]="currencyTypeOption"
                          >
                            {{ currencyTypeOption }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>
                      <mat-form-field class="col-2">
                        <mat-label>Monto</mat-label>
                        <input matInput formControlName="amountField" />
                      </mat-form-field>
                      <button
                        class="col-1"
                        mat-icon-button
                        color="warn"
                        (click)="removeGaranteeRowForm(i)"
                      >
                        <mat-icon svgIcon="close"></mat-icon>
                      </button>
                    </div>
                  </form>
                </ng-container>
                <div class="row">
                  <button
                    class="col-12"
                    mat-stroked-button
                    color="primary"
                    (click)="addGaranteeRowForm()"
                  >
                    <mat-icon>add</mat-icon> Agregar garantía
                  </button>
                </div>
                <!-- Botones de simular -->
                <div class="row mt-5 justify-content-center">
                  <div class="col-6">
                    <app-request-button
                      (click)="onSimulateButtonClicked()"
                      [isLoading]="isSimulationLoading"
                      [disabled]="!getSimulateButtonEnabled()"
                      [icon]="'chemistry'"
                      >Simular</app-request-button
                    >
                  </div>
                </div>
              </div>
            </form>
            <!-- Tabla de datos -->
            <div class="row mt-5">
              <h2 color="primary">Simulación</h2>
            </div>
            <div class="row mb-2 justify-content-end">
              <div class="col-auto">Mostrar datos originales</div>
              <div class="col-auto">
                <mat-slide-toggle
                  color="accent"
                  [(ngModel)]="showOldData"
                  (click)="onShowOldDataButtonClicked()"
                ></mat-slide-toggle>
              </div>
            </div>
           <div class="row"
                [@openClose]="tableGroups.length > 0 ? 'open' : 'closed'">

              <div *ngFor="let group of tableGroups">
                <h3>Grupo: {{ group.grupo }} - {{ group.nombre }}</h3>
                <app-shared-table
                  [dataSource]="group.data"
                  [columnConfig]="columnConfig"
                  [enableSearch]="false"
                  [colmunId]="colmunId"
                  [stateLabel]="tableStateLabel"
                  [(dataRowId)]="dataRowId"
                  [isProcessing]="isTableLoading"
                  [isSelectable]="false"
                  [showTotals]="true"
                  [totalsColumnLabel]="'Customer'"
                  [isFailed]="isTableFailed"
                  [isDownloadable]="true"
                ></app-shared-table>
              </div>
            </div>
            <div *ngIf="tableOriginalGroups.length == 0">
              <p>No hay datos para mostrar</p>
            </div>
            <!-- Botones de guardar simulación -->
          <!--   <div class="row justify-content-center">
              <div class="col-6 mt-3">
                <app-request-button
                  (click)="onSaveButtonClicked()"
                  [isLoading]="isSaveLoading"
                  [disabled]="!getSaveButtonEnabled()"
                  [icon]="'upload-cloud'"
                  >Guardar</app-request-button
                >
              </div>
            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</div>
