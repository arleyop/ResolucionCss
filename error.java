guardarFichaDerivados() {
  if (!this.dataSource || this.dataSource.length === 0) {
    this.snackBar.open('No hay datos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  // 1. Filtrar registros válidos (sin N.A ni vacíos)
  let filtrados = this.dataSource.filter(row =>
    row.tipoIdentificacion && row.tipoIdentificacion !== 'N.A' &&
    row.numeroDocumento && row.numeroDocumento !== 'N.A' &&
    row.exposicion !== null && row.exposicion !== '' && row.exposicion !== 'N.A' &&
    row.fechaOperacion && row.fechaOperacion !== 'N.A'
  );

  // 2. Agrupar por (numeroDocumento + fechaOperacion)
  const agrupados: { [key: string]: any } = {};

  filtrados.forEach(row => {
    const key = `${row.numeroDocumento}-${row.fechaOperacion}`;
    if (!agrupados[key]) {
      agrupados[key] = { ...row };
    } else {
      // sumar exposición si ya existe el mismo documento+fecha
      agrupados[key].exposicion = 
        Number(agrupados[key].exposicion) + Number(row.exposicion);
    }
  });

  const payload = Object.values(agrupados);

  if (payload.length === 0) {
    this.snackBar.open('No hay datos válidos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  this.storeNewFactSheetIsLoading = true;

  this.fichaDerivadoService.guardarFicha(payload).subscribe({
    next: () => {
      this.snackBar.open('Ficha Derivados guardada correctamente.', 'Cerrar', { duration: 3000 });
      this.reset();
      this.storeNewFactSheetIsLoading = false;
    },
    error: () => {
      this.snackBar.open('Error al guardar la ficha.', 'Cerrar', { duration: 3000 });
      this.storeNewFactSheetIsLoading = false;
    }
  });
}
