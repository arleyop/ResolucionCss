// 1) Filtrar fuera registros con exposicion = 0
filasTabla = filasTabla.filter((row: any) => Number(row.exposicion) > 0);

// 2) Normalizar fechas inválidas
filasTabla = filasTabla.map((row: any) => {
  if (row.fechaOperacion === '1900-01-00') {
    return { ...row, fechaOperacion: null };
  }
  return row;
});

// 3) Agrupar por numeroDocumento y sumar exposición
const agrupados = new Map<string, any>();

for (const row of filasTabla) {
  const doc = row.numeroDocumento;

  if (!agrupados.has(doc)) {
    // Si no existe aún, lo guardamos
    agrupados.set(doc, { ...row });
  } else {
    // Si ya existe, acumulamos
    const existente = agrupados.get(doc);
    existente.exposicion = Number(existente.exposicion) + Number(row.exposicion);

    // Manejo de fechaOperacion: si difieren => null
    if (existente.fechaOperacion !== row.fechaOperacion) {
      existente.fechaOperacion = null;
    }

    agrupados.set(doc, existente);
  }
}

// 4) Convertimos el Map a array final
filasTabla = Array.from(agrupados.values());
