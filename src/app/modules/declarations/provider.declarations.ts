import {
  RequestOptions,
  XHRBackend
} from '@angular/http';
import { ProjectService }          from '../../services/project.service';
import { ProjectPersonnelService } from '../../services/project-personnel.service';
import { UserService }             from '../../services/user.service';
import { AuthService }             from '../../services/auth.service';
import { AuthGuard }               from '../../services/auth-guard.service';
import { PermissionGuard }         from '../../services/permission-guard.service';
import { CustomHttp }              from '../../services/custom-http.service';

export const providerDeclarations = [
  { provide: CustomHttp,
    useFactory: (backend: XHRBackend, options: RequestOptions) => {
      return new CustomHttp(backend, options);
    },
    deps: [XHRBackend, RequestOptions]
  },
  ProjectService,
  UserService,
  AuthService,
  AuthGuard,
  PermissionGuard,
  ProjectPersonnelService
];
