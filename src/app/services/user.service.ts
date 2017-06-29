import 'rxjs/Rx';
import {
  URLSearchParams,
  Response
} from '@angular/http';
import { Injectable }  from '@angular/core';
import { CustomHttp }  from './custom-http.service';
import { AuthService } from './auth.service';
import { Consts, SP }  from '../consts/consts';
import { User }        from '../models/user';

@Injectable()
export class UserService {

  constructor(
    private http: CustomHttp,
    private authService: AuthService
  ) { }

  public getUser(_id: string) {
    const search = new URLSearchParams();
    search.set(SP._id, _id);

    return this.http.get(Consts.Api.user, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj  = res.json();
      const user = obj.user ? User.fromObject(obj.user, User) : User.create();
      return user;
    });
  }

  public getUsers(cond: { skip?: number, limit?: number, search?: any }) {
    const search = new URLSearchParams();
    if (cond.skip)  { search.set(SP.__skip , String(cond.skip)); }
    if (cond.limit) { search.set(SP.__limit, String(cond.limit)); }
    if (cond.search && cond.search[SP.name]) {
      search.set(SP.name, cond.search[SP.name]);
    }

    return this.http.get(Consts.Api.User.list, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj = res.json();
      const users = User.fromArray(obj.users, User);
      const totalItems = obj.totalItems || 0;
      return {
        users,
        totalItems
      };
    });
  }

  public getUsersByProjectMonth(projectId: string, yyyymm: string) {
    const search = new URLSearchParams();
    search.set(SP.projectId, projectId);
    search.set(SP.yyyymm, yyyymm);

    return this.http.get(Consts.Api.User.projectMonth, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj  = res.json();
      const users: User[] = User.fromArray(obj.users, User);
      return users;
    });
  }

  public validateSave(user: User) {
    const validationOnly = true;
    return this.save(user, validationOnly);
  }

  public save(user: User, validationOnly = false) {
    const url = validationOnly ? Consts.Api.User.validate :
                                 Consts.Api.user;
    return this.http.post(url, user, { withLoading: true })
    .catch(err => this.handleError(err));
  }

  public validateChangePassword(oldPass: string, newPass: string, newPassConfirm: string) {
    const validationOnly = true;
    return this.changePassword(oldPass, newPass, newPassConfirm, validationOnly);
  }

  public changePassword(oldPass: string, newPass: string, newPassConfirm: string, validationOnly = false) {
    const params = {};
    params[SP.oldPass]        = oldPass;
    params[SP.newPass]        = newPass;
    params[SP.newPassConfirm] = newPassConfirm;
    const url = validationOnly ? Consts.Api.User.validateChangePassword :
                                 Consts.Api.User.changePassword;
    return this.http.put(url, params, { withLoading: true })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj = res.json();
      return obj;
    });
  }

  public delete(user: User) {
    const search = new URLSearchParams();
    search.set(SP._id, user._id);

    return this.http.delete(Consts.Api.user, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => res.json());
  }

  private handleError(res: Response) {
    return this.authService.handleError(res);
  }

}
