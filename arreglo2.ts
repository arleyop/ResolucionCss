storeNewFactSheet() {
  // 1) Validaciones básicas
  if (!this.newFichaDerivado?.relaciones?.length) {
    this.snackBar.open('No hay datos para guardar.', 'Cerrar', { duration: 3000 });
    return;
  }

  // Asegúrate de que displayedColumns contenga 'numeroDocumento'
  // Ej: ['tipoIdentificacion','numeroDocumento','exposicion','fechaOperacion','fechaCarga']
  const columnasAEnviar = this.displayedColumns;

  // 2) Proyectar SOLO columnas de la tabla y normalizar valores
  let filasTabla: any[] = this.newFichaDerivado.relaciones.map((row: any) => {
    const proyectada: any = {};
    columnasAEnviar.forEach(col => {
      if (col === 'exposicion') {
        proyectada[col] = Number(row[col]) || 0;
      } else if (col === 'fechaOperacion') {
        const raw = row[col]?.toString().trim() || '';
        // convertir fechas tipo '1900-01-00' o 'YYYY-MM-00' a null
        if (/^\d{4}-\d{2}-00$/.test(raw) || raw === '1900-01-00') {
          proyectada[col] = null;
        } else if (raw === '' || raw.toUpperCase() === 'N.A') {
          proyectada[col] = null;
        } else {
          proyectada[col] = raw;
        }
      } else {
        const v = row[col];
        proyectada[col] = v === null || v === undefined ? '' : String(v).trim();
      }
    });
    return proyectada;
  });

  // 3) Filtrar: quitar N.A / vacíos en campos clave y eliminar exposiciones == 0
  filasTabla = filasTabla.filter(row =>
    row.tipoIdentificacion && row.tipoIdentificacion.toUpperCase() !== 'N.A' &&
    row.numeroDocumento && row.numeroDocumento.toString().trim().toUpperCase() !== 'N.A' &&
    Number(row.exposicion) > 0
  );

  if (!filasTabla.length) {
    this.snackBar.open('No hay datos válidos para guardar (todas las filas fueron filtradas).', 'Cerrar', { duration: 3000 });
    return;
  }

  // 4) Ordenar por numeroDocumento para agrupar fácilmente en un solo pase
  filasTabla.sort((a, b) => {
    const aKey = (a.numeroDocumento || '').toString();
    const bKey = (b.numeroDocumento || '').toString();
    return aKey.localeCompare(bKey);
  });

  // 5) Agrupar SOBRE filasTabla (resultado final quedará en filasTabla)
  const merged: any[] = [];
  let hayDuplicados = false;

  for (const row of filasTabla) {
    const lastIndex = merged.length - 1;
    const last = merged[lastIndex];

    if (last && last.numeroDocumento === row.numeroDocumento) {
      // ya existe para ese documento: sumar exposición
      last.exposicion = Number(last.exposicion) + Number(row.exposicion);
      hayDuplicados = true;

      // fechaOperacion: si alguna de las dos es null → conservar null
      // si son diferentes (p.ej. '2025-05-30' vs '2025-06-01') → dejar null (porque se agrupa por documento)
      if (last.fechaOperacion === null || row.fechaOperacion === null) {
        last.fechaOperacion = null;
      } else if (last.fechaOperacion !== row.fechaOperacion) {
        last.fechaOperacion = null;
      }
      // otros campos si quieres conservar se mantienen del primer elemento
    } else {
      // nuevo documento: clonar el objeto para no mutar el original
      merged.push({ ...row });
    }
  }

  // reasignar filasTabla al resultado agrupado
  filasTabla = merged;

  // 6) Mensaje si hubo duplicados
  if (hayDuplicados) {
    this.snackBar.open(
      '⚠ Se detectaron registros con el mismo número de documento. Las exposiciones se sumaron por documento.',
      'Entendido',
      { duration: 5000 }
    );
  }

  // 7) Enviar payload al backend
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
