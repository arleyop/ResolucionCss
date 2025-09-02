
  onSimulateButtonClicked(): void {
    this.isSimulationLoading = true;
    this.isTableLoading = true;
    this.isTableFailed = false;
    this.tableStateLabel = 'Simulando.';

    const simulatorRequest: SimulatorRequest = {
      penumdocU: this.documentNumber,
      petipdocU: this.documentType,
      carteraU: this.parametersFormGroup.get('portfolioField')?.value,
      moneCartera: this.parametersFormGroup.get('portfolioCurrencyField')?.value,
      gtiaFinancieraU: this.parametersFormGroup.get('financialGuaranteeField')?.value,
      moneGtiaFinanciera: this.parametersFormGroup.get('financialGuaranteeCurrencyField')?.value,
      gtiaTecnicaU: this.parametersFormGroup.get('technicalGuaranteeField')?.value,
      moneGtiaTecnica: this.parametersFormGroup.get('technicalGuaranteeCurrencyField')?.value,
      derivadosU: this.parametersFormGroup.get('derivativesField')?.value,
      moneDerivados: this.parametersFormGroup.get('derivativesCurrencyField')?.value,
      listGarantia: this.garanteeRowFormsGroup.map(f => ({
        codGarantiaU: f.get('codeField')?.value,
        vrGarantiaU: f.get('amountField')?.value,
        moneVrGarantia: f.get('currencyField')?.value,
      })),
    };

    this.simulatorService.createSimulation(simulatorRequest).subscribe({
      next: (simulations: SimulatorSimulatedCustomer[]) => {
         // clonar grupos originales
            const cloneGroups: TableGroup[] = this.tableOriginalGroups.map(g => ({
              grupo: g.grupo,
              nombre: g.nombre,
              data: g.data.map(item => ({ ...item })),
            }));

        simulations.forEach(element => {
              // buscar grupo por gccgroupid
              const group = cloneGroups.find(g => g.grupo === element.gccgroupid);
              if (group && group.data.length > 0) {
                // reemplazar solo la primera fila del grupo
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
              // si no existe el grupo → se ignora
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
