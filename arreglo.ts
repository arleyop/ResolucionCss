<div class="container mt-4">
  <h2 class="mb-3">Simulador</h2>

  <form [formGroup]="parametersFormGroup">
    <!-- ======================== CARTERA ======================== -->
    <div class="row gx-3 align-items-center mb-3">
      <!-- Moneda -->
      <mat-form-field class="col-3">
        <mat-label>Moneda Cartera</mat-label>
        <mat-select formControlName="portfolioCurrencyField"
                    (selectionChange)="onCurrencyChange('portfolio', $event.value)">
          <mat-option [value]="null">Ninguno</mat-option>
          <mat-option *ngFor="let tasa of currencyTypeOptions" [value]="tasa">
            {{ tasa.cdDivisa }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Valor en moneda -->
      <mat-form-field class="col-4">
        <mat-label>Cartera ({{ selectedCurrencies.portfolio?.cdDivisa || '---' }})</mat-label>
        <input matInput type="number" formControlName="portfolioField"
               (input)="onValorChange('portfolio')" />
      </mat-form-field>

      <!-- Equivalente en COP -->
      <mat-form-field class="col-4">
        <mat-label>Equivalente en COP</mat-label>
        <input matInput readonly [value]="valoresConvertidos.portfolio | number:'1.0-2'" />
      </mat-form-field>
    </div>

    <!-- ======================== DERIVADOS ======================== -->
    <div class="row gx-3 align-items-center mb-3">
      <mat-form-field class="col-3">
        <mat-label>Moneda Derivados</mat-label>
        <mat-select formControlName="derivativesCurrencyField"
                    (selectionChange)="onCurrencyChange('derivatives', $event.value)">
          <mat-option [value]="null">Ninguno</mat-option>
          <mat-option *ngFor="let tasa of currencyTypeOptions" [value]="tasa">
            {{ tasa.cdDivisa }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Derivados ({{ selectedCurrencies.derivatives?.cdDivisa || '---' }})</mat-label>
        <input matInput type="number" formControlName="derivativesField"
               (input)="onValorChange('derivatives')" />
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Equivalente en COP</mat-label>
        <input matInput readonly [value]="valoresConvertidos.derivatives | number:'1.0-2'" />
      </mat-form-field>
    </div>

    <!-- ======================== GARANTÍA FINANCIERA ======================== -->
    <div class="row gx-3 align-items-center mb-3">
      <mat-form-field class="col-3">
        <mat-label>Moneda Garantía Financiera</mat-label>
        <mat-select formControlName="financialGuaranteeCurrencyField"
                    (selectionChange)="onCurrencyChange('financialGuarantee', $event.value)">
          <mat-option [value]="null">Ninguno</mat-option>
          <mat-option *ngFor="let tasa of currencyTypeOptions" [value]="tasa">
            {{ tasa.cdDivisa }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Garantía Financiera ({{ selectedCurrencies.financialGuarantee?.cdDivisa || '---' }})</mat-label>
        <input matInput type="number" formControlName="financialGuaranteeField"
               (input)="onValorChange('financialGuarantee')" />
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Equivalente en COP</mat-label>
        <input matInput readonly [value]="valoresConvertidos.financialGuarantee | number:'1.0-2'" />
      </mat-form-field>
    </div>

    <!-- ======================== GARANTÍA TÉCNICA ======================== -->
    <div class="row gx-3 align-items-center mb-3">
      <mat-form-field class="col-3">
        <mat-label>Moneda Garantía Técnica</mat-label>
        <mat-select formControlName="technicalGuaranteeCurrencyField"
                    (selectionChange)="onCurrencyChange('technicalGuarantee', $event.value)">
          <mat-option [value]="null">Ninguno</mat-option>
          <mat-option *ngFor="let tasa of currencyTypeOptions" [value]="tasa">
            {{ tasa.cdDivisa }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Garantía Técnica ({{ selectedCurrencies.technicalGuarantee?.cdDivisa || '---' }})</mat-label>
        <input matInput type="number" formControlName="technicalGuaranteeField"
               (input)="onValorChange('technicalGuarantee')" />
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Equivalente en COP</mat-label>
        <input matInput readonly [value]="valoresConvertidos.technicalGuarantee | number:'1.0-2'" />
      </mat-form-field>
    </div>

    <!-- ======================== LÍNEA COMPROMETIDA ======================== -->
    <div class="row gx-3 align-items-center mb-3">
      <mat-form-field class="col-3">
        <mat-label>Moneda Línea Comprometida</mat-label>
        <mat-select formControlName="committedLineCurrencyField"
                    (selectionChange)="onCurrencyChange('committedLine', $event.value)">
          <mat-option [value]="null">Ninguno</mat-option>
          <mat-option *ngFor="let tasa of currencyTypeOptions" [value]="tasa">
            {{ tasa.cdDivisa }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Línea Comprometida ({{ selectedCurrencies.committedLine?.cdDivisa || '---' }})</mat-label>
        <input matInput type="number" formControlName="committedLineField"
               (input)="onValorChange('committedLine')" />
      </mat-form-field>

      <mat-form-field class="col-4">
        <mat-label>Equivalente en COP</mat-label>
        <input matInput readonly [value]="valoresConvertidos.committedLine | number:'1.0-2'" />
      </mat-form-field>
    </div>
  </form>
</div>
