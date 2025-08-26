storeNewFactSheet() {
  // 1) Validaciones básicas
  if (!this.newFichaDerivado?.relaciones?.length) {
    this.snackBar.open('No hay datos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  // 2) Proyectar SOLO las columnas que se muestran en la tabla
  //    displayedColumns: ['tipoIdentificacion','numeroDocumento','exposicion','fechaOperacion','fechaCarga'];
  const columnasAEnviar = this.displayedColumns;

  let filasTabla = this.newFichaDerivado.relaciones.map((row: any) => {
    const proyectada: any = {};
    columnasAEnviar.forEach(col => {
      if (col === 'exposicion') {
        proyectada[col] = Number(row[col]) || 0;
      } else {
        proyectada[col] = row[col]?.toString().trim() || '';
      }
    });
    return proyectada;
  });

  // 3) Filtrar registros inválidos (N.A o vacíos)
  filasTabla = filasTabla.filter(row =>
    row.tipoIdentificacion && row.tipoIdentificacion !== 'N.A' &&
    row.numeroDocumento && row.numeroDocumento !== 'N.A' &&
    row.fechaOperacion && row.fechaOperacion !== 'N.A' &&
    row.exposicion !== null && row.exposicion !== 0
  );

  if (!filasTabla.length) {
    this.snackBar.open('No hay datos válidos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  // 4) Agrupar por numeroDocumento + fechaOperacion (sumar exposición)
  const agrupados: { [key: string]: any } = {};
  let hayDuplicados = false;

  filasTabla.forEach(row => {
    const key = `${row.numeroDocumento}-${row.fechaOperacion}`;
    if (!agrupados[key]) {
      agrupados[key] = { ...row };
    } else {
      agrupados[key].exposicion = Number(agrupados[key].exposicion) + Number(row.exposicion);
      hayDuplicados = true;
    }
  });

  const payload = Object.values(agrupados);

  // 5) Avisar si había duplicados
  if (hayDuplicados) {
    this.snackBar.open(
      '⚠ Existen duplicados. La exposición se sumó si coincidían Identificación y Fecha.',
      'Entendido',
      { duration: 5000 }
    );
  }

  // 6) Llamar API con filas procesadas
  this.storeNewFactSheetIsLoading = true;

  this.derivadosService.guardarDerivados(payload).subscribe({
    next: () => {
      this.snackBar.open('Derivados guardados correctamente.', 'Cerrar', { duration: 3000 });
      this.reset();
      this.storeNewFactSheetIsLoading = false;
    },
    error: () => {
      this.snackBar.open('Error al guardar derivados.', 'Cerrar', { duration: 3000 });
      this.storeNewFactSheetIsLoading = false;
    }
  });
}
