import { relacionDependencia } from "./relacionDependencia.model";

export class fichaTecnica{
    penumdoc!: string | null;
    petipdoc!: string | null;
    idFichaTecnica!: number | null;
    fechaCreacion!: Date | string | null;
    usuarioCreacion!: string | null;
    relaciones: relacionDependencia[];
  
    constructor() {
      this.relaciones = [];
    }

  }



export class relacionDependencia {
    penumperDependiente!: string;
    penomperDependiente!: string;
    penumdocDependiente!: string;
    petipdocDependiente!: string;
    penumperDependencia!: string | null;
    penomperDependencia!: string | null;
    penumdocDependencia!: string | null;
    petipdocDependencia!: string | null;
    nombreDependencia!: string;
    tipoDependencia!: number;
    idGrupoGcc!: string;
    nombreGrupoGcc!: string;
  }


