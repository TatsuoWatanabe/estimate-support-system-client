import { BaseModel } from './base-model';

export class ProjectPersonnel extends BaseModel {
  public _id         = '';
  public periodFrom  = '';
  public periodTo    = '';
  public userId: any = {};
  public projectId   = '';

  public static create() {
    return new ProjectPersonnel();
  }

  constructor() {
    super();
  }

}
