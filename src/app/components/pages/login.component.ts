import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import {
  Router
} from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import { Consts }         from '../../consts/consts';
import { CommonUtil }     from '../../util/common-util';
import { User }           from '../../models/user';
import { AuthService }    from '../../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: '../../../../templates/pages/login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  public get Consts() { return Consts; }
  public fields = { username: '', password: '' };

  private subscriptions: { [key: string]: Subscription; } = {};
  private user: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  public ngOnInit() {
    // subscribe the user state.
    this.subscriptions[Consts.Subscriptions.user] = this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if (this.router.url === this.router.createUrlTree([Consts.Paths.logout]).toString()) {
      this.logout();
    }
  }

  public ngAfterViewInit() {
    CommonUtil.updateTextFields();
  }

  public login() {
    this.authService.login(this.fields.username, this.fields.password).subscribe(() => {
      Materialize.toast(Consts.Msgs.loggedIn(this.user.displayName), Consts.Nums.toastNormal);
      const defaultUrl = Consts.Paths.mstProject;
      this.router.navigateByUrl(this.authService.redirectUrl || defaultUrl);
    }, (err) => {
      Materialize.toast(Consts.Msgs.loginFailed, Consts.Nums.toastNormal);
    });
  }

  private logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl(Consts.Paths.login);
      Materialize.toast(Consts.Msgs.loggedOut, Consts.Nums.toastNormal);
    }, (err) => {
      Materialize.toast(Consts.Msgs.logoutFailed, Consts.Nums.toastNormal);
    });
  }

  public ngOnDestroy() {
    // prevent memory leak when component destroyed
    Object.keys(this.subscriptions).forEach((key => {
      const subscription = this.subscriptions[key];
      subscription.unsubscribe();
    }));
  }

}
