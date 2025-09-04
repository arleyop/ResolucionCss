export interface relacionDependencia {
  penomperDependencia: string;
  petipdocDependencia: string;
  penumdocDependencia: string;
  penomperDependiente: string;
  petipdocDependiente: string;
  penumdocDependiente: string;
  nombreDependencia: string;
  tipoDependencia: number;

  // 🔹 Los siguientes campos ahora son opcionales
  penumperDependiente?: string;
  penumperDependencia?: string;
  idGrupoGcc?: number;
  nombreGrupoGcc?: string;
}



this.newFactSheet = {
  penumdoc: this.padNumeroIdentificacion(this.resumenData[0].id),
  petipdoc: this.tipoDocumentoService.validateTipoDocumento(this.resumenData[0].tipoId),
  idFichaTecnica: -1,
  fechaCreacion: new Date(),
  usuarioCreacion: '',
  relaciones: this.resumenData.map((row) => ({
    penomperDependencia: this.penomperDependencia,
    petipdocDependencia: this.petipdocDependencia,
    penumdocDependencia: this.penumdocDependencia,
    penomperDependiente: row.nombreCliente,
    petipdocDependiente: row.tipoId,
    penumdocDependiente: row.id,
    nombreDependencia: row.criterio,
    tipoDependencia: Number(row.criterioId),
  })),
};
