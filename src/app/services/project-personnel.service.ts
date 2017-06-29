import 'rxjs/Rx';
import {
  URLSearchParams,
  Response
} from '@angular/http';
import { Injectable }       from '@angular/core';
import { CustomHttp }       from './custom-http.service';
import { AuthService }      from './auth.service';
import { Consts, SP }       from '../consts/consts';
import { Project }          from '../models/project';
import { ProjectPersonnel } from '../models/project-personnel';

@Injectable()
export class ProjectPersonnelService {

  constructor(
    private http: CustomHttp,
    private authService: AuthService
  ) { }

  public getProjectPersonnel(_id: string) {
    const search = new URLSearchParams();
    search.set(SP.projectId, _id);

    return this.http.get(Consts.Api.projectPersonnel, {
      withLoading: true,
      search
    })
    .catch(err => this.handleError(err))
    .map(res => {
      const obj = res.json();
      const project = Project.fromObject(obj.project, Project);
      const projectPersonnels = ProjectPersonnel.fromArray(obj.projectPersonnels, ProjectPersonnel);

      return { project, projectPersonnels };
    });
  }

  public save(project: Project, projectPersonnels: ProjectPersonnel[]) {
    const requestBody = {
      projectId: project._id,
      projectPersonnels
    };
    return this.http.post(Consts.Api.projectPersonnel, requestBody, { withLoading: true })
      .catch(err => this.handleError(err))
      .map(res => {
        const obj = res.json();
        return obj;
      });
  }

  private handleError(res: Response) {
    return this.authService.handleError(res);
  }

}
