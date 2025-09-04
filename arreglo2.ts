relaciones: this.resumenData.map((row) => ({
  penomperDependencia: this.penomperDependencia,
  petipdocDependencia: this.petipdocDependencia,
  penumdocDependencia: this.penumdocDependencia,

  penomperDependiente: row.nombreCliente,
  petipdocDependiente: this.tipoDocumentoService.validateTipoDocumento(row.tipoId),
  penumdocDependiente: this.padNumeroIdentificacion(row.id),

  nombreDependencia: row.criterio,
  tipoDependencia: Number(row.criterioId),
})),
