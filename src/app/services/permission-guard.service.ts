import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable }  from '@angular/core';
import { AuthService } from './auth.service';
import { Consts }      from '../consts/consts';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkPermission();
  }

  /**
   * check user has permission or not.
   */
  public checkPermission() {
    return this.authService.user$.map((user) => {
      if (!user) { return false; }

      if (!user.admin) {
        Materialize.toast(Consts.Msgs.noPermission, Consts.Nums.toastNormal);
        return false; // not allowed.
      }

      return true;
    });

  }
}
