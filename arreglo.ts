/**
 * [EN] Gets the customer data
 * [ES] Obtiene los datos del cliente
 */
getCustomerData(documentType: string, documentNumber: string): void {
  this.isQueryLoading = true;
  this.isTableLoading = true;
  this.tableStateLabel = 'Cargando.';

  this.simulatorService
    .getCustomerData(documentType, documentNumber)
    .subscribe({
      next: (data: SimulatorCustomer[]) => {
        // Transformamos cada registro en TableData
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
            GrupoNombre: item.grupo, // aquí ya tienes el nombre del grupo
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

        // Agrupar por ID de grupo, pero guardando también el nombre
        const grouped: {
          [key: string]: { nombre: string; data: TableData[] };
        } = {};

        dataSource.forEach(row => {
          if (!grouped[row.gccgroupid]) {
            grouped[row.gccgroupid] = {
              nombre: row.GrupoNombre, // usamos el nombre del grupo
              data: [],
            };
          }
          grouped[row.gccgroupid].data.push(row);
        });

        // Convertir el objeto a un arreglo para *ngFor en la vista
        this.tableGroups = Object.keys(grouped).map(key => ({
          grupo: key, // código del grupo
          nombre: grouped[key].nombre, // nombre del grupo
          data: grouped[key].data,
        }));

        console.log('data grupo table : ', this.tableGroups);

        // Guardamos los datos originales para simulación
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
