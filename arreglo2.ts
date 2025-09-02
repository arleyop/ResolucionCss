storeNewFactSheet() {
  // 1) Validaciones básicas
  if (!this.newFichaDerivado?.relaciones?.length) {
    this.snackBar.open('No hay datos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  const columnasAEnviar = this.displayedColumns;

  // 2) Proyectar SOLO columnas de la tabla
  let filasTabla = this.newFichaDerivado.relaciones.map((row: any) => {
    const proyectada: any = {};
    columnasAEnviar.forEach(col => {
      if (col === 'exposicion') {
        proyectada[col] = Number(row[col]) || 0;
      } else if (col === 'fechaOperacion') {
        // Si la fecha es inválida (1900-01-00) => enviar como null
        proyectada[col] =
          row[col] && row[col].startsWith('1900-01-00') ? null : row[col];
      } else {
        proyectada[col] = row[col]?.toString().trim() || '';
      }
    });
    return proyectada;
  });

  // 3) Eliminar registros con exposición == 0
  filasTabla = filasTabla.filter(row => row.exposicion !== 0);

  if (!filasTabla.length) {
    this.snackBar.open('No hay datos válidos para guardar (todas las exposiciones son 0).', 'Cerrar', { duration: 3000 });
    return;
  }

  // 4) Agrupar SOLO por numeroDocumento (sumar exposición)
  const agrupados: { [key: string]: any } = {};
  let hayDuplicados = false;

  filasTabla.forEach(row => {
    const key = row.numeroDocumento;
    if (!agrupados[key]) {
      agrupados[key] = { ...row };
    } else {
      agrupados[key].exposicion =
        Number(agrupados[key].exposicion) + Number(row.exposicion);
      hayDuplicados = true;

      // Mantener la fecha si existe, pero si uno de ellos es null -> queda null
      if (!agrupados[key].fechaOperacion || row.fechaOperacion === null) {
        agrupados[key].fechaOperacion = null;
      }
    }
  });

  const payload = Object.values(agrupados);

  // 5) Avisar si había duplicados
  if (hayDuplicados) {
    this.snackBar.open(
      '⚠ Existen duplicados de documento. La exposición se sumó automáticamente.',
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
