
/**
 * [EN] A private interface for the table data from the simulation result
 *
 * [ES] Una interfaz privada para los datos de la tabla del resultado de la simulación
 */
interface TableData {
  gccgroupid: string;
  Penumdoc: string;
  Petipdoc: string;
  Penumper: string;
  Customer: string;
  Portfolio: number;
  FinancialGuarantee: number;
  TechnicalGuarantee: number;
  Derivatives: number;
  TotalExposure: number;
  Provisions: number;
  Guarantees: number;
  NetExposure: number;
  Consumption: number;
  GrupoNombre: string;
  Type: 'P' | 'S' | 'T';
}

interface GaranteeRow {
  type: string;
  code: string;
  standardization: string;
  pdi: string;
  currency: string;
  amount: number;
}

interface FormGroupWithFilteredOptions extends FormGroup {
  filteredOptions: Observable<Garantee[]>;
}

/**
 *
 */
@Component({
    selector: 'app-simulador',
    templateUrl: './simulador.component.html',
    styleUrls: ['./simulador.component.css'],
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
            transition('open => closed', [animate('0.4s')]),
            transition('closed => open', [animate('0.4s')]),
        ]),
    ],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatSelect,
        NgFor,
        MatOption,
        MatInput,
        MatIconButton,
        MatIcon,
        RequestButtonComponent,
        NgIf,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatButton,
        MatSlideToggle,
        SharedTableComponent,
        AsyncPipe,
        KeyValuePipe,
    ],
})
export class SimuladorComponent {
  // if the data is loading
  isQueryLoading: boolean = false;
  isTableLoading: boolean = false;
  isTableFailed: boolean = false;
  isSaveLoading: boolean = false;
  isSimulationLoading: boolean = false;
  // the table state label
  tableStateLabel: string = 'Listo';
  // Columna a usar como identificador
  colmunId = 'Penumdoc';
  simulatorCustomer?: SimulatorCustomer;
  // Selected row id
  dataRowId: string = '';
  // Configuración de cada columna
  columnConfig: ColumnConfig = {
    Customer: { header: 'Cliente', type: 'text', tooltip: 'Cliente' },
    Portfolio: { header: 'Cartera', type: 'currency', tooltip: 'Cartera' },
    FinancialGuarantee: {
      header: 'Garantía Financiera',
      type: 'currency',
      tooltip: 'Garantía financiera',
    },
    TechnicalGuarantee: {
      header: 'Garantía Técnica',
      type: 'currency',
      tooltip: 'Garantía técnica',
    },
    Derivatives: {
      header: 'Derivados',
      type: 'currency',
      tooltip: 'Derivados',
    },
    TotalExposure: {
      header: 'Total Exposición',
      type: 'currency',
      tooltip: 'Total exposición',
    },
    Provisions: {
      header: 'Provisiones',
      type: 'currency',
      tooltip: 'Provisiones',
    },
    Guarantees: { header: 'Garantías', type: 'currency', tooltip: 'Garantías' },
    NetExposure: {
      header: 'Exposición Neta',
      type: 'currency',
      tooltip: 'Exposición neta',
    },
    Consumption: {
      header: 'Consumo PB',
      type: 'currency',
      tooltip: 'Consumo PB',
    },
  };
  // Controles del formulario
  documentFormGroup!: FormGroup;
  parametersFormGroup!: FormGroup;
  garanteeRowFormsGroup: FormGroupWithFilteredOptions[] = [];
  // Fuente de datos de la tabla
  tableDataSource: TableData[] = [];
  tableGroups: {grupo: string; data: TableData[]}[] =[];
  tableNewDataSource: TableData[] = [];
  tableOriginalDataSource: TableData[] = [];
  showOldData: boolean = true;
  // Fila seleccionada
  rowSelected: TableData | null = null;
  // Valor de búsqueda
  searchValue: string = '';
  // Tipo de documento
  documentType: string = '';
  // Opciones de tipos de documento para el combobox
  documentTypeOptions: string[] = [];
  // Número de documento
  documentNumber: string = '';
  // Opciones de tipo de moenda para el combobox
  currencyTypeOptions: string[] = [];
  //
  garanteeOptions: Garantee[] = [];
  //
  filteredGaranteeOptions: Observable<Garantee[]>[] = [];

  /**
   * [ES] Constructor del componente
   *
   * [EN] Constructor of the component
   *
   * @param simulatorService
   */
  constructor(
    private simulatorService: SimulatorService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * This method is called when the component is initialized
   */
  ngOnInit() {
    // Get the combo box data
    this.getDocumentTypeComboBoxData();
    this.getCurrencyTypeComboBoxData();
    this.getGaranteeOptions();
    // Populate the form groups with empty values
    this.documentFormGroup = this.formBuilder.group({
      docmentTypeField: [null, [Validators.required]], // Select input
      documentNumberField: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ], // number input
    });
    this.parametersFormGroup = this.formBuilder.group(
      {
        portfolioField: [null, [Validators.pattern('^[0-9]+$')]], // number input
        portfolioCurrencyField: [null], // Select input
        financialGuaranteeField: [null, [Validators.pattern('^[0-9]+$')]], // number input
        financialGuaranteeCurrencyField: [null], // Select input
        technicalGuaranteeField: [null, [Validators.pattern('^[0-9]+$')]], // number input
        technicalGuaranteeCurrencyField: [null], // Select input
        derivativesField: [null, [Validators.pattern('^[0-9]+$')]], // number input
        derivativesCurrencyField: [null], // Select input
        committedLineField: [null, [Validators.pattern('^[0-9]+$')]], // number input
        committedLineCurrencyField: [null], // Select input
      },
      {
        validators: [
          currencyValueValidator('portfolioCurrencyField', 'portfolioField'),
          currencyValueValidator(
            'financialGuaranteeCurrencyField',
            'financialGuaranteeField'
          ),
          currencyValueValidator(
            'technicalGuaranteeCurrencyField',
            'technicalGuaranteeField'
          ),
          currencyValueValidator(
            'derivativesCurrencyField',
            'derivativesField'
          ),
          currencyValueValidator(
            'committedLineCurrencyField',
            'committedLineField'
          ),
        ],
      }
    );
  }

  /**
   * [EN] Gets the document types to feed the combobox
   */
  getDocumentTypeComboBoxData(): void {
    this.isQueryLoading = true;
    this.simulatorService.getDocumentTypes().subscribe({
      next: (data: string[]) => {
        this.documentTypeOptions = data;
      },
      error: (error: any) => {
        console.error('Error getting document types:', error);
      },
      complete: () => {
        this.isQueryLoading = false;
      },
    });
  }

  /**
   * [EN] Gets the currency types to feed the combobox
   */
  getCurrencyTypeComboBoxData(): void {
    this.isQueryLoading = true;
    this.simulatorService.getCurrencyTypes().subscribe({
      next: (data: string[]) => {
        this.currencyTypeOptions = data;
      },
      error: (error: any) => {
        console.error('Error getting currency types:', error);
      },
      complete: () => {
        this.isQueryLoading = false;
      },
    });
  }

  getGaranteeOptions(): void {
    this.isQueryLoading = true;
    this.simulatorService.getGarantees().subscribe({
      next: (data: Garantee[]) => {
        this.garanteeOptions = data;
      },
      error: (error: any) => {
        console.error('Error getting garantee options:', error);
      },
      complete: () => {
        this.isQueryLoading = false;
      },
    });
  }

  /**
   * [EN] Gest the custumer data
   */
  getCustomerData(documentType: string, documentNumber: string): void {
    this.isQueryLoading = true;
    this.isTableLoading = true;
    this.tableStateLabel = 'Cargando...';
    this.simulatorService
      .getCustomerData(documentType, documentNumber)
      .subscribe({
        next: (data: SimulatorCustomer[]) => {
          let dataSource: TableData[] = data.map((item: SimulatorCustomer) => {
            let row: TableData = {
              gccgroupid: item.gcc_group_tsi_id,
              Penumdoc: item.penumdoc,
              Petipdoc: item.petipdoc,
              Penumper: item.penumper,
              Customer: item.penomper,
              Portfolio: item.cartera,
              FinancialGuarantee: item.garantiaFinanciera,
              TechnicalGuarantee: item.garantiaTecnica,
              Derivatives: item.derivados,
              TotalExposure: item.totalExposicion,
              Provisions: item.provisiones,
              Guarantees: item.garantias,
              NetExposure: item.exposicionNeta,
              Consumption: item.consumoPb,
              GrupoNombre: item.grupo,
              Type:
                item.penumdoc == documentNumber && item.petipdoc == documentType
                  ? 'P'
                  : 'S',
            };
             if (item.penumdoc == documentNumber && item.petipdoc == documentType) {
            this.simulatorCustomer = item;
            this.dataRowId = documentNumber;
            
          }
          return row;
          });

          // Agrupar por grupo (GrupoNombre en este caso)
        const grouped: { [key: string]: TableData[] } = {};
        dataSource.forEach(row => {
          if (!grouped[row.gccgroupid]) {
            grouped[row.gccgroupid] = [];
          }
          grouped[row.gccgroupid].push(row);
        });

        
        // Convertir el objeto a un arreglo para *ngFor en la vista
        this.tableGroups = Object.keys(grouped).map(key => ({
          
          grupo: key,
          data: grouped[key]
        }));

         console.log("data grupo table : ", this.tableGroups)

        this.switchDataSource(true);

          // Sort data source so the selected row is the first
          dataSource = dataSource.sort((a: TableData, b: TableData) => {
            if (a.Penumdoc == documentNumber && a.Petipdoc == documentType) {
              return -1;
            } else {
              return 1;
            }
          });
          this.tableOriginalDataSource = dataSource;
          this.switchDataSource(true);
        },
        error: (error: any) => {
          console.error('Error getting customer data:', error);
          this.isQueryLoading = false;
          this.isTableLoading = false;
          this.isTableFailed = true;
          this.tableStateLabel = 'Error al obtener los datos del cliente.';
          swal('Error al obtener los datos del cliente', error, 'error');
        },
        complete: () => {
          this.isQueryLoading = false;
          this.isTableLoading = false;
          this.tableStateLabel = 'Listo.';
        },
      });
  }

  /**
   * Retrun true if the query button is enabled, false otherwise
   *
   * @returns boolean true if the query button is enabled, false otherwise
   */
  getQueryButtonEnabled(): boolean {
    return this.documentFormGroup.valid;
  }

  /**
   * Called when the query button is clicked
   */
  onQueryButtonClicked(): void {
    if (!this.getQueryButtonEnabled()) return;
    this.documentType = this.documentFormGroup.get('docmentTypeField')?.value;
    this.documentNumber = this.documentFormGroup.get(
      'documentNumberField'
    )?.value;
    this.getCustomerData(this.documentType, this.documentNumber);
  }

  displayFn(garantee: Garantee): string {
    return garantee && garantee.descripcionGarantia
      ? garantee.descripcionGarantia
      : '';
  }

  /**
   * Retrun true if the simulate button is enabled, false otherwise
   *
   * @returns boolean: true if the form is valid
   */
  getSimulateButtonEnabled(): boolean {
    return (
      this.parametersFormGroup.valid &&
      this.garanteeRowFormsGroup.every((formGroup) => formGroup.valid) &&
      this.garanteeRowFormsGroup.length <= 5
    );
  }

  /**
   * This method is called when the simulate button is clicked
   */
  onSimulateButtonClicked(): void {
    this.isSimulationLoading = true;
    this.isTableLoading = true;
    this.isTableFailed = false;
    this.tableStateLabel = 'Simulando...';
    const simulatorRequest: SimulatorRequest = {
      penumdocU: this.documentNumber,
      petipdocU: this.documentType,
      carteraU: this.parametersFormGroup.get('portfolioField')?.value,
      moneCartera: this.parametersFormGroup.get('portfolioCurrencyField')
        ?.value,
      gtiaFinancieraU: this.parametersFormGroup.get('financialGuaranteeField')
        ?.value,
      moneGtiaFinanciera: this.parametersFormGroup.get(
        'financialGuaranteeCurrencyField'
      )?.value,
      gtiaTecnicaU: this.parametersFormGroup.get('technicalGuaranteeField')
        ?.value,
      moneGtiaTecnica: this.parametersFormGroup.get(
        'technicalGuaranteeCurrencyField'
      )?.value,
      derivadosU: this.parametersFormGroup.get('derivativesField')?.value,
      moneDerivados: this.parametersFormGroup.get('derivativesCurrencyField')
        ?.value,
      listGarantia: this.garanteeRowFormsGroup.map((formGroup: FormGroup) => {
        return {
          codGarantiaU: formGroup.get('codeField')?.value,
          vrGarantiaU: formGroup.get('amountField')?.value,
          moneVrGarantia: formGroup.get('currencyField')?.value,
        };
      }),
    };
    this.simulatorService.createSimulation(simulatorRequest).subscribe({
      next: (element: SimulatorSimulatedCustomer) => {
        // get the original datasource and replace the new customer row data
        let tableOriginalDataSourceClone = JSON.parse(
          JSON.stringify(this.tableOriginalDataSource)
        );
        this.tableNewDataSource = tableOriginalDataSourceClone.map(
          (item: TableData) => {
            if (item.Penumdoc == this.dataRowId) {
              if (item.Penumdoc == this.dataRowId) {
                item.Portfolio = element.cartera;
                item.Derivatives = element.derivados;
                item.NetExposure = element.exposicionNeta;
                item.Guarantees = element.garantia;
                item.TechnicalGuarantee = element.gtiaTecnica;
                item.FinancialGuarantee = element.gtiaTecnica;
                item.Consumption = element.porcConsumo;
                item.TotalExposure = element.totalExposicion;
              }
            }
            return item;
          }
        );
        console.log("tableNewDataSource"+this.tableNewDataSource);
        this.switchDataSource(false);
        swal(
          'Simulación exitosa',
          'La simulación de los datos del cliente ha sido exitosa.',
          'success'
        );
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

  /**
   * Retrun true if the save button is enabled, false otherwise
   *
   * @returns boolean: true if the form is valid
   */
  getSaveButtonEnabled(): boolean {
    return this.tableDataSource.length > 0;
  }

  /**
   * This method is called when the save button is clicked
   */
  onSaveButtonClicked(): void {
    this.isSaveLoading = true;
    var simulatorResult: SimulatorResult = {
      penumdoc: this.simulatorCustomer?.penumdoc || '',
      petipdocU: this.simulatorCustomer?.petipdoc || '',
      carteraU: this.simulatorCustomer?.cartera || 0,
      moneCartera: this.parametersFormGroup.get('portfolioCurrencyField')
        ?.value,
      gtiaFinancieraU: this.simulatorCustomer?.garantiaFinanciera || 0,
      moneGtiaFinanciera: this.parametersFormGroup.get(
        'financialGuaranteeCurrencyField'
      )?.value,
      gtiaTecnicaU: this.simulatorCustomer?.garantiaTecnica || 0,
      moneGtiaTecnica: this.parametersFormGroup.get(
        'technicalGuaranteeCurrencyField'
      )?.value,
      derivadosU: this.simulatorCustomer?.derivados || 0,
      moneDerivados: this.parametersFormGroup.get('derivativesCurrencyField')
        ?.value,
      listGarantia: this.garanteeRowFormsGroup.map((formGroup: FormGroup) => {
        return {
          codGarantiaU: formGroup.get('codeField')?.value,
          vrGarantiaU: formGroup.get('amountField')?.value,
          moneVrGarantia: formGroup.get('currencyField')?.value,
        };
      }),
      clientes: this.tableDataSource.map((item: TableData) => {
        return {
          tipo: item.Type,
          penumdoc: item.Penumdoc,
          petipdocU: item.Petipdoc,
          penomper: item.Customer,
          cartera: item.Portfolio,
          gtiaTecnica: item.TechnicalGuarantee,
          gtiaFinanciera: item.FinancialGuarantee,
          derivados: item.Derivatives,
          totalExposicion: item.TotalExposure,
          provisiones: item.Provisions,
          garantia: item.Guarantees,
          exposicionNeta: item.NetExposure,
          porcConsumo: item.Consumption,
        };
      }),
    };
    // the totals rows as another client element of type T
    simulatorResult.clientes.push({
      tipo: 'T',
      penumdoc: '',
      petipdocU: '',
      penomper: '',
      cartera: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.cartera,
        0
      ),
      gtiaTecnica: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.gtiaTecnica,
        0
      ),
      gtiaFinanciera: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.gtiaFinanciera,
        0
      ),
      derivados: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.derivados,
        0
      ),
      totalExposicion: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.totalExposicion,
        0
      ),
      provisiones: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.provisiones,
        0
      ),
      garantia: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.garantia,
        0
      ),
      exposicionNeta: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.exposicionNeta,
        0
      ),
      porcConsumo: simulatorResult.clientes.reduce(
        (acc, item) => acc + item.porcConsumo,
        0
      ),
    });
    this.simulatorService.createSimulationResult(simulatorResult).subscribe({
      next: () => {
        swal(
          'Datos de la simulación guardados',
          'Los datos de la simulación han sido guardados correctamente.',
          'success'
        );
      },
      error: (error: any) => {
        console.error('Error getting simulation result data:', error);
        swal('Error al guardar los datos de la simulación', error, 'error');
        this.isSaveLoading = false;
      },
      complete: () => {
        this.isSaveLoading = false;
      },
    });
  }

  /**
   * Add a row of garantees related fiels
   */
  addGaranteeRowForm(): void {
    const garanteeRowFormGroup: FormGroup = this.formBuilder.group({
      //typeField: [''],
      codeField: ['', [Validators.required]],
      currencyField: [null, [Validators.required]],
      amountField: [null, [Validators.required]],
    });
    const control = this.formBuilder.control('');
    garanteeRowFormGroup.addControl('typeField', control);
    // The filtered options will be the a observable that returns the garanteeOptions filtered by the value of the control when it changes
    const filteredOptions: Observable<Garantee[]> = control.valueChanges.pipe(
      startWith(''), // Start with an empty string
      map((value: string | null) => {
        // if the value is a string, filter the options
        if (typeof value === 'string') {
          return this._filter(value || '');
        }
        // if the value is not a string, return the options
        else {
          return this.garanteeOptions;
        }
      })
    );
    let garanteeRowFormGroupWithFilteredOptions: FormGroupWithFilteredOptions =
      <FormGroupWithFilteredOptions>garanteeRowFormGroup;
    garanteeRowFormGroupWithFilteredOptions.filteredOptions = filteredOptions;
    this.garanteeRowFormsGroup.push(garanteeRowFormGroupWithFilteredOptions);
  }

  private _filter(value: string): Garantee[] {
    const filterValue = value.toLowerCase();
    return this.garanteeOptions.filter((option) =>
      option.descripcionGarantia.toLowerCase().includes(filterValue)
    );
  }

  /**
   * Remove a row of garantees related fiels
   */
  removeGaranteeRowForm(index: number): void {
    this.garanteeRowFormsGroup.splice(index, 1);
  }

  onShowOldDataButtonClicked(): void {
    this.switchDataSource(this.showOldData);
  }

  switchDataSource(toOriginal: boolean = true): void {
    if (toOriginal) {
      this.showOldData = true;
      // Clonar la fuente de datos original
      this.tableDataSource = JSON.parse(
        JSON.stringify(this.tableOriginalDataSource)
      );
      this.tableStateLabel = 'Datos originales.';
    } else {
      this.showOldData = false;
      // Clonar la fuente de datos nueva
      this.tableDataSource = JSON.parse(
        JSON.stringify(this.tableNewDataSource)
      );
      this.tableStateLabel = 'Datos simulados.';
    }
  }
}
