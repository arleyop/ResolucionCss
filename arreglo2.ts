Type '{ penomperDependencia: string; petipdocDependencia: string; penumdocDependencia: string; penomperDependiente: string; petipdocDependiente: string; penumdocDependiente: string; nombreDependencia: string; tipoDependencia: number; }[]' is not assignable to type 'relacionDependencia[]'.
  Type '{ penomperDependencia: string; petipdocDependencia: string; penumdocDependencia: string; penomperDependiente: string; petipdocDependiente: string; penumdocDependiente: string; nombreDependencia: string; tipoDependencia: number; }' is missing the following properties from type 'relacionDependencia': penumperDependiente, penumperDependencia, idGrupoGcc, nombreGrupoGcc [plugin angular-compiler]

    src/app/components/pages/Interconectados/carga-cliente/carga-cliente.component.ts:171:7:
      171 │        relaciones: this.resumenData.map((row) => ({
          ╵        ~~~~~~~~~~

  The expected type comes from property 'relaciones' which is declared here on type 'fichaTecnica'

    src/app/components/features/interconectado/modelo/fichaTecnica.model.ts:9:4:
      9 │     relaciones: relacionDependencia[];
