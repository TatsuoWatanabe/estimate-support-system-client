import { NgModule }                         from '@angular/core';
import { RouterModule, Routes }             from '@angular/router';
import { Paths }                            from '../consts/paths';
import { MstProjectComponent }              from '../components/pages/mst-project.component';
import { MstProjectEditComponent }          from '../components/pages/mst-project-edit.component';
import { MstProjectPersonnelComponent }     from '../components/pages/mst-project-personnel.component';
import { MstProjectPersonnelEditComponent } from '../components/pages/mst-project-personnel-edit.component';
import { MstUserComponent }                 from '../components/pages/mst-user.component';
import { MstUserEditComponent }             from '../components/pages/mst-user-edit.component';
import { LoginComponent }                   from '../components/pages/login.component';
import { AuthGuard }                        from '../services/auth-guard.service';
import { PermissionGuard }                  from '../services/permission-guard.service';

const routes: Routes = [
  // Project master
  { path: Paths.mstProject, children: [
    { path: ''                  , canActivate: [AuthGuard, PermissionGuard], component: MstProjectComponent },
    { path: `${Paths.edit}/:_id`, canActivate: [AuthGuard, PermissionGuard], component: MstProjectEditComponent },
    { path: Paths.edit          , canActivate: [AuthGuard, PermissionGuard], component: MstProjectEditComponent },
  ]},
  // Project-personnel master
  { path: Paths.mstProjectPersonnel, children: [
    { path: ''                  , canActivate: [AuthGuard, PermissionGuard], component: MstProjectPersonnelComponent },
    { path: `${Paths.edit}/:_id`, canActivate: [AuthGuard, PermissionGuard], component: MstProjectPersonnelEditComponent }
  ]},
  // User master
  { path: Paths.mstUser, children: [
    { path: ''                  , canActivate: [AuthGuard, PermissionGuard], component: MstUserComponent },
    { path: `${Paths.edit}/:_id`, canActivate: [AuthGuard, PermissionGuard], component: MstUserEditComponent },
    { path: Paths.edit          , canActivate: [AuthGuard, PermissionGuard], component: MstUserEditComponent },
  ]},
  // All user accesible.
  { path: Paths.logout          ,                                            component: LoginComponent },
  { path: Paths.login           ,                                            component: LoginComponent },
  // default
  { path: '', redirectTo: Paths.login, pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
