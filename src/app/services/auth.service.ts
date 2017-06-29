import * as HttpStatus from 'http-status-codes';
import { Response }    from '@angular/http';
import { Injectable }  from '@angular/core';
import { Router }      from '@angular/router';
import 'rxjs/Rx';
import { Subject }     from 'rxjs/Subject';
import { Observable }  from 'rxjs/Observable';
import { Consts }      from '../consts/consts';
import { User }        from '../models/user';
import { CustomHttp }  from '../services/custom-http.service';

@Injectable()
export class AuthService {
  // user source Subject
  private userSource = new Subject<User>();
  // Observable user streams
  public user$ = this.userSource.asObservable();

  public user: User;

  // store the URL so we can redirect after logging in
  private srcUrl = '';
  public get redirectUrl() { return this.srcUrl; };

  constructor(
    private http: CustomHttp,
    private router: Router
  ) { }

  public login(username: string, password: string) {
    const params  = { username, password };
    return this.http.post(Consts.Api.login, params, { withLoading: true })
      .map(res => this.receiveUser(res))
      .catch(res => this.handleError(res));
  }

  public checkLogin(srcUrl: string) {
    this.srcUrl = srcUrl;
    return this.http.get(Consts.Api.checkLogin)
      .map(res => this.receiveUser(res))
      .catch(res => this.handleError(res));
  }

  public logout() {
    return this.http.get(Consts.Api.logout, { withLoading: true })
      .map(res => this.receiveUser(res))
      .catch(res => this.handleError(res));
  }

  public receiveUser(res: Response) {
    const obj  = res.json();
    const user = obj.user ? User.fromObject(obj.user, User) : null;
    this.userSource.next(user);
    this.user = user;
    return !!user;
  }

  public handleError(res: Response) {
    if (res.status === HttpStatus.UNAUTHORIZED) {
      // user has gone.
      this.userSource.next(null);
      this.user = null;
      //  Navigate to the login page on error.
      this.router.navigateByUrl(Consts.Paths.login);
    }
    return Observable.throw(res);
  }

}
