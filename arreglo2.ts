// 5) Agrupar directamente en filasTabla
const map = new Map<string, any>();

for (const row of filasTabla) {
  const doc = row.numeroDocumento;
  if (!map.has(doc)) {
    // clona el objeto inicial
    map.set(doc, { ...row });
  } else {
    const existente = map.get(doc);
    existente.exposicion = Number(existente.exposicion) + Number(row.exposicion);

    // Manejo de fechaOperacion
    if (existente.fechaOperacion === null || row.fechaOperacion === null) {
      existente.fechaOperacion = null;
    } else if (existente.fechaOperacion !== row.fechaOperacion) {
      existente.fechaOperacion = null;
    }

    map.set(doc, existente);
  }
}

// convertir el Map en array y asignar de nuevo
filasTabla = Array.from(map.values());
