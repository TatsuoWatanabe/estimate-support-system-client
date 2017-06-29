import { BaseModel } from './base-model';

export class User extends BaseModel {
  public _id = '';
  public username     = '';
  public password     = '';
  public displayName  = '';
  public employeeCode = '';
  public admin        = false;

  public static create() {
    return new User();
  }

  constructor() {
    super();
  }

}
