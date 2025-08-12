import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtectedComponent } from './protected/protected.component';
import { ModuloComponent } from './GestiosDeUsuario/modulo/modulo.component';
import { AuthGuard } from 'src/app/core';
import { RolComponent } from './GestiosDeUsuario/rol/rol.component';
import { UsuarioComponent } from './GestiosDeUsuario/usuario/usuario.component';
import { MonitoreoComponent } from './GestiosDeUsuario/monitoreo/monitoreo.component';
import { TransferStatusComponent } from './procesos/transfer-status/transfer-status.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ExposicionComponent } from './Parametria/exposicion/exposicion.component';
import { GarantiaComponent } from './Parametria/garantia/garantia.component';
import { MonedaComponent } from './Parametria/moneda/moneda.component';
import { LimiteComponent } from './Parametria/limite/limite.component';
import { MarcacionComponent } from './Maraciones/marcacion/marcacion.component';
import { ClienteComponent } from './Maraciones/cliente/cliente.component';
import { OperacionComponent } from './Maraciones/operacion/operacion.component';
import { CargaManualComponent } from './procesos/carga-manual/carga-manual.component';
import { SectorComponent } from './Apetito/sector/sector.component';
import { RatingComponent } from './Apetito/rating/rating.component';
import { Top20Component } from './Apetito/top20/top20.component';
import { ReportingAssetsComponent } from './reporting/assets/reporting-assets.component';
import { ReportingGuarantorsComponent } from './reporting/guarantors/reporting-guarantors.component';
import { ReportingLimitsComponent } from './reporting/limits/reporting-limits.component';
import { CalculoComponent } from './procesos/calculo/calculo.component';
import { SimuladorComponent } from './simulador/simulador/simulador.component';
import { CargaClienteComponent } from './Interconectados/carga-cliente/carga-cliente.component';
import { GrupoComponent } from './Interconectados/grupo/grupo.component';
import { CalculoManualComponent } from './procesos/calculo-manual/calculo-manual.component';



const routes: Routes = [
  {
    path: '', 
    component: ProtectedComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administradorusuarios',	'Administrador','Analista',	'Comercial'	,'Consulta'] }, 
    children: [
      {
        path: 'GestiondeUsuarios/Modulo',
        component: ModuloComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administradorusuarios'] } 
      },
      {
        path: 'GestiondeUsuarios/Rol',
        component: RolComponent,
        canActivate:[AuthGuard],
        data: { roles: ['Administradorusuarios'] } 
      },
      {
        path: 'GestiondeUsuarios/Usuario',
        component: UsuarioComponent,
        canActivate:[AuthGuard],
        data: { roles: ['Administradorusuarios' ] } 
      },
      {
        path: 'GestiondeUsuarios/Monitoreo',
        component: MonitoreoComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administradorusuarios'] } 
      },
      {
        path: 'Procesos/Carga',
        component: TransferStatusComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },
      {
        path: 'Procesos/Calculo/Manual',
        component: CalculoManualComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },
      {
        path: 'Procesos/Carga/Manual',
        component: CargaManualComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      }, 
      {
        path: 'Procesos/Calculo',
        component: CalculoComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },     
      {
        path: 'Parametria/Exposición',
        component: ExposicionComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },
      {
        path: 'Parametria/Garantías',
        component: GarantiaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },
      {
        path: 'Parametria/Moneda',
        component: MonedaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },
      {
        path: 'Parametria/Límite',
        component: LimiteComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador'] }  
      },
      {
        path: 'Marcaciones/Marcaciones',
        component: MarcacionComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista'] }  
      },
      {
        path: 'Marcaciones/CreacionMarcacionClientes',
        component: ClienteComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista'] }  
      },
      {
        path: 'Marcaciones/CreacionMarcacionOperaciones',
        component: OperacionComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista'] }  
      },
      {
        path: 'Apetito/Sector',
        component: SectorComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista',	'Comercial','Consulta'] }  
      },
      {
        path: 'Apetito/Top20',
        component: Top20Component,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista',	'Comercial','Consulta'] }  
      },
      {
        path: 'Apetito/Rating',
        component: RatingComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista',	'Comercial','Consulta'] }  
      },
      {
        path: 'Reportes/Patrimonio',
        component: ReportingAssetsComponent,
        canActivate: [AuthGuard],
        data: { roles: [ 'Administrador','Analista',	'Comercial','Consulta'] }  
      },
      {
        path: 'Reportes/Límites',
        component: ReportingLimitsComponent,
        canActivate: [AuthGuard],
        data: { roles: [ 'Administrador','Analista',	'Comercial','Consulta'] }  
      },
      {
        path: 'Reportes/Garantes',
        component: ReportingGuarantorsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Administrador','Analista',	'Comercial','Consulta'] }  
      },
      {
        path: 'Simulador/Simulador',
        component: SimuladorComponent,
        canActivate: [AuthGuard],
        data: { roles: [ 'Administrador','Analista',	'Comercial'] }  
      },
      {
        path: 'Interconectados/CargaCliente',
        component: CargaClienteComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Comercial'] }  
      } ,
      {
        path: 'Interconectados/Grupo',
        component: GrupoComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Comercial'] }  
      },      
      {
        path: '', 
        canActivate:[AuthGuard],
        component: Top20Component,
      }
    ]
  },{
    path: '**',
    component: UnauthorizedComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administradorusuarios', 'Administrador','Analista',	'Comercial','Consulta'] }  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }