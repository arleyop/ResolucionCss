import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.scss']
})
export class SimuladorComponent implements OnInit {

  parametersFormGroup!: FormGroup;

  // Opciones de divisas (debes cargarlas desde tu servicio real)
  currencyTypeOptions: any[] = [
    { cdDivisa: 'USD', cambfix: 4000 },
    { cdDivisa: 'EUR', cambfix: 4400 },
    { cdDivisa: 'COP', cambfix: 1 }
  ];

  // Monedas seleccionadas por cada campo
  selectedCurrencies: any = {
    portfolio: null,
    derivatives: null,
    financialGuarantee: null,
    technicalGuarantee: null,
    committedLine: null
  };

  // Valores convertidos en COP
  valoresConvertidos: any = {
    portfolio: 0,
    derivatives: 0,
    financialGuarantee: 0,
    technicalGuarantee: 0,
    committedLine: 0
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.parametersFormGroup = this.fb.group({
      // Campos de cartera
      portfolioCurrencyField: [null],
      portfolioField: [0],

      // Campos de derivados
      derivativesCurrencyField: [null],
      derivativesField: [0],

      // Campos de garantía financiera
      financialGuaranteeCurrencyField: [null],
      financialGuaranteeField: [0],

      // Campos de garantía técnica
      technicalGuaranteeCurrencyField: [null],
      technicalGuaranteeField: [0],

      // Campos de línea comprometida
      committedLineCurrencyField: [null],
      committedLineField: [0]
    });
  }

  // Método para actualizar moneda seleccionada
  onCurrencyChange(tipo: string, currency: any): void {
    this.selectedCurrencies[tipo] = currency;
    this.convertirValor(tipo);
  }

  // Método para actualizar valor ingresado
  onValorChange(tipo: string): void {
    this.convertirValor(tipo);
  }

  // Conversión genérica a COP
  private convertirValor(tipo: string): void {
    const valor = this.parametersFormGroup.get(this.getFieldName(tipo))?.value || 0;
    const currency = this.selectedCurrencies[tipo];

    if (currency && currency.cambfix) {
      this.valoresConvertidos[tipo] = valor * currency.cambfix;
    } else {
      this.valoresConvertidos[tipo] = 0;
    }
  }

  // Helper para mapear tipo → nombre del FormControl
  private getFieldName(tipo: string): string {
    switch (tipo) {
      case 'portfolio':
        return 'portfolioField';
      case 'derivatives':
        return 'derivativesField';
      case 'financialGuarantee':
        return 'financialGuaranteeField';
      case 'technicalGuarantee':
        return 'technicalGuaranteeField';
      case 'committedLine':
        return 'committedLineField';
      default:
        return '';
    }
  }
}
