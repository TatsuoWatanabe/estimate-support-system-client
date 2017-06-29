import { BaseModel } from './base-model';

export class Project extends BaseModel {
  public _id         = '';
  public name        = '';
  public projectCode = '';
  public note        = '';

  public static create() {
    return new Project();
  }

  constructor() {
    super();
  }

}
