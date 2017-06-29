import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Subscription }            from 'rxjs/Subscription';
import { MaterializeAction }       from 'angular2-materialize';
import { SlimLoadingBarService }   from 'ng2-slim-loading-bar';
import { Consts }                  from '../consts/consts';
import { User }                    from '../models/user';
import { ChangePasswordComponent } from './elements/change-password.component';
import { AuthService }             from '../services/auth.service';
import { CustomHttp }              from '../services/custom-http.service';

@Component({
  selector: 'app',
  templateUrl: '../../../templates/app.component.html',
  styles: [
    `#user-menu {
      min-width: 13.8rem;
    }`
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  public get Consts() { return Consts; }
  private subscriptions: { [key: string]: Subscription; } = {};
  private user: User;

  @ViewChild(ChangePasswordComponent)
  public changePassword: ChangePasswordComponent;

  /** EventEmitter of showing loading indicator. */
  public modalLoaderActions = new EventEmitter<string|MaterializeAction>();

  constructor(
    private authService: AuthService,
    private slimLoadingBarService: SlimLoadingBarService,
    private http: CustomHttp
  ) { }

  public ngOnInit() {
    // subscribe user state.
    this.subscriptions[Consts.Subscriptions.user] = this.authService.user$.subscribe(user => {
      this.user = user;
    }, (err) => {
      console.log(err);
    });
    // subscribe loading state.
    this.subscriptions[Consts.Subscriptions.loading] = this.http.loading$.subscribe(loading => {
      const param = loading ? 'open' : 'close';
      this.modalLoaderActions.emit({action: 'modal', params: [param]});
    }, (err) => {
      console.log(err);
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
