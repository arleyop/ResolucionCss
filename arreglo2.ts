 storeNewFactSheet() {
  // 1) Validaciones básicas
  if (!this.newFichaDerivado?.relaciones?.length) {
    this.snackBar.open('No hay datos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  // 2) Si hay duplicados, avisar pero continuar
  const hayDuplicados = this.newFichaDerivado.relaciones.some((r: any) => r.duplicado);
  if (hayDuplicados) {
    this.snackBar.open(
      '⚠ Existen duplicados. La exposición se sumará si coinciden Identificación y Fecha.',
      'Entendido',
      { duration: 5000 }
    );
  }

  // 3) Proyectar SOLO las columnas que se muestran en la tabla
  //    displayedColumns: ['tipoIdentificacion','exposicion','fechaOperacion','fechaCarga'];
  const columnasAEnviar = this.displayedColumns;

  const filasTabla = this.newFichaDerivado.relaciones.map((row: any) => {
    // Tomar solo las columnas definidas en displayedColumns
    const proyectada: any = {};
    columnasAEnviar.forEach(col => {
      // Normalización por si vienen números/strings
      if (col === 'exposicion') {
        proyectada[col] = Number(row[col]) || 0;
      } else {
        proyectada[col] = row[col] ?? '';
      }
    });
    return proyectada;
  });

  // 4) Llamar API con SOLO las filas de la tabla
  this.storeNewFactSheetIsLoading = true;

  this.derivadosService.guardarDerivados(filasTabla).subscribe({
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
