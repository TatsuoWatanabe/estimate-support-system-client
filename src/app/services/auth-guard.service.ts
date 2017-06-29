import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable }            from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { AuthService }           from './auth.service';
import { Paths }                 from '../consts/paths';
import { Consts }                from '../consts/consts';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private slimLoadingBarService: SlimLoadingBarService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url;
    return this.checkLogin(url);
  }

  public checkLogin(url: string) {
    // show loading bar.
    this.slimLoadingBarService.progress = Consts.Nums.slimLoadingBarInitProgress;
    this.slimLoadingBarService.start();
    const observe = this.authService.checkLogin(url);
    observe.subscribe(() => {
    }, (err) => {
      //  Navigate to the login page on error.
      this.router.navigateByUrl(Paths.login);
    });
    return observe.finally(() => {
      this.slimLoadingBarService.complete();
    });
  }
}
