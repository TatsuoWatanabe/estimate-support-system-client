import 'rxjs/Rx';
import {
  URLSearchParams,
  Response
} from '@angular/http';
import { Injectable }  from '@angular/core';
import { CustomHttp }  from './custom-http.service';
import { AuthService } from './auth.service';
import { Consts, SP }  from '../consts/consts';
import { Project }     from '../models/project';

@Injectable()
export class ProjectService {

  constructor(
    private http: CustomHttp,
    private authService: AuthService
  ) { }

  public getProject(_id: string) {
    const search = new URLSearchParams();
    search.set(SP._id, _id);

    return this.http.get(Consts.Api.project, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj = res.json();
      const project = Project.fromObject(obj.project, Project);

      return project;
    });
  }

  public getProjects(cond: { skip?: number, limit?: number, search?: any }) {
    const search = new URLSearchParams();
    if (cond.skip)  { search.set(SP.__skip , String(cond.skip)); }
    if (cond.limit) { search.set(SP.__limit, String(cond.limit)); }
    if (cond.search && cond.search[SP.name]) {
      search.set(SP.name, cond.search[SP.name]);
    }

    return this.http.get(Consts.Api.Project.list, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj = res.json();
      const projects: Project[] = Project.fromArray(obj.projects, Project);
      const totalItems = obj.totalItems || 0;
      return {
        projects,
        totalItems
      };
    });
  }

  public getProjectsByUserMonth(userId: string, yyyymm: string) {
    const search = new URLSearchParams();
    search.set(SP.userId, userId);
    search.set(SP.yyyymm, yyyymm);

    return this.http.get(Consts.Api.Project.userMonth, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj = res.json();
      const projects: Project[] = Project.fromArray(obj.projects, Project);
      return projects;
    });
  }

  public validateSave(project: Project) {
    const validationOnly = true;
    return this.save(project, validationOnly);
  }

  public save(project: Project, validationOnly = false) {
    const url = validationOnly ? Consts.Api.Project.validate :
                                 Consts.Api.project;
    return this.http.post(url, project, { withLoading: true })
    .catch(err => this.handleError(err));
  }

  public delete(project: Project) {
    const search = new URLSearchParams();
    search.set(SP._id, project._id);

    return this.http.delete(Consts.Api.project, {
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
