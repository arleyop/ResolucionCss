onSimulateButtonClicked(): void {
  this.isSimulationLoading = true;
  this.isTableLoading = true;
  this.isTableFailed = false;
  this.tableStateLabel = 'Simulando.';

  const carteraValue = this.parametersFormGroup.get('portfolioField')?.value;
  const carteraCurrency = this.parametersFormGroup.get('portfolioCurrencyField')?.value;

  const gtiaFinancieraValue = this.parametersFormGroup.get('financialGuaranteeField')?.value;
  const gtiaFinancieraCurrency = this.parametersFormGroup.get('financialGuaranteeCurrencyField')?.value;

  const gtiaTecnicaValue = this.parametersFormGroup.get('technicalGuaranteeField')?.value;
  const gtiaTecnicaCurrency = this.parametersFormGroup.get('technicalGuaranteeCurrencyField')?.value;

  const derivadosValue = this.parametersFormGroup.get('derivativesField')?.value;
  const derivadosCurrency = this.parametersFormGroup.get('derivativesCurrencyField')?.value;

  const simulatorRequest: SimulatorRequest = {
    penumdocU: this.documentNumber,
    petipdocU: this.documentType,

    carteraU: this.transformToPesos(carteraValue, carteraCurrency),
    moneCartera: carteraCurrency?.cdDiviss,

    gtiaFinancieraU: this.transformToPesos(gtiaFinancieraValue, gtiaFinancieraCurrency),
    moneGtiaFinanciera: gtiaFinancieraCurrency?.cdDiviss,

    gtiaTecnicaU: this.transformToPesos(gtiaTecnicaValue, gtiaTecnicaCurrency),
    moneGtiaTecnica: gtiaTecnicaCurrency?.cdDiviss,

    derivadosU: this.transformToPesos(derivadosValue, derivadosCurrency),
    moneDerivados: derivadosCurrency?.cdDiviss,

    listGarantia: this.garanteeRowFormsGroup.map(f => ({
      codGarantiaU: f.get('codeField')?.value,
      vrGarantiaU: this.transformToPesos(f.get('amountField')?.value, f.get('currencyField')?.value),
      moneVrGarantia: f.get('currencyField')?.value?.cdDiviss,
    })),
  };

  this.simulatorService.createSimulation(simulatorRequest).subscribe({
    next: (simulations: SimulatorSimulatedCustomer[]) => {
      const cloneGroups: TableGroup[] = this.tableOriginalGroups.map(g => ({
        grupo: g.grupo,
        nombre: g.nombre,
        data: g.data.map(item => ({ ...item })),
      }));

      simulations.forEach(element => {
        const group = cloneGroups.find(g => g.grupo === element.gccgroupid);
        if (group && group.data.length > 0) {
          group.data[0] = {
            ...group.data[0],
            Portfolio: element.cartera,
            Derivatives: element.derivados,
            NetExposure: element.exposicionNeta,
            Guarantees: element.garantia,
            TechnicalGuarantee: element.gtiaTecnica,
            FinancialGuarantee: element.gtiaFinanciera,
            Consumption: element.porcConsumo,
            TotalExposure: element.totalExposicion,
          };
        }
      });

      this.tableNewGroups = cloneGroups;
      this.switchDataSource(false);

      swal('Simulación exitosa', 'La simulación de los datos del cliente ha sido exitosa.', 'success');
    },
    error: (error: any) => {
      console.error('Error getting simulation data:', error);
      this.isSimulationLoading = false;
      this.isTableLoading = false;
      this.isTableFailed = true;
      this.tableStateLabel = 'Error al simular los datos del cliente.';
      swal('Error al simular los datos del cliente', error, 'error');
    },
    complete: () => {
      this.isSimulationLoading = false;
      this.isTableLoading = false;
      this.tableStateLabel = 'Listo.';
    },
  });
}


private transformToPesos(value: number, currency: any): number {
  if (!value || !currency) return value;
  return value * currency.cambFix; // Se multiplica para llevar a pesos
}
