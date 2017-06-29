import {
  Component,
  Input,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Consts }                  from '../../consts/consts';
import { CommonUtil }              from '../../util/common-util';
import { UserService }             from '../../services/user.service';
import { OkCancelDialogComponent } from '../elements/ok-cancel-dialog.component';
import * as HttpStatus             from 'http-status-codes';

@Component({
  selector: 'change-password',
  template: `
    <div
      class="modal {{classAttr}}"
      materialize="modal"
      [materializeParams]="materializeParams"
      [materializeActions]="materializeActions"
    >
      <div class="modal-content">
        <h5 class="form-title center"><i class="material-icons center">lock</i>{{Consts.Labels.changePassword}}</h5>
        <div class="row">
          <div class="input-field col s12">
            <input [(ngModel)]="fields.oldPass" [ngClass]="{'invalid': invalids.oldPass}" id="cp_oldPass" type="password" maxlength="{{Consts.Limits.password.max}}">
            <label for="cp_oldPass">{{Consts.Labels.password}}</label>
            <p *ngFor="let errCode of invalids.oldPass" class="red-text">{{errCode | msgCode}}</p>
          </div>
          <div class="input-field col s12">
            <input [(ngModel)]="fields.newPass" [ngClass]="{'invalid': invalids.newPass}" id="cp_newPass" type="password" maxlength="{{Consts.Limits.password.max}}">
            <label for="cp_newPass">{{Consts.Labels.newPass}}</label>
            <p *ngFor="let errCode of invalids.newPass" class="red-text">{{errCode | msgCode}}</p>
          </div>
          <div class="input-field col s12">
            <input [(ngModel)]="fields.newPassConfirm" [ngClass]="{'invalid': invalids.newPassConfirm}" id="cp_newPassConfirm" type="password" maxlength="{{Consts.Limits.password.max}}">
            <label for="cp_newPassConfirm">{{Consts.Labels.newPassConfirm}}</label>
            <p *ngFor="let errCode of invalids.newPassConfirm" class="red-text">{{errCode | msgCode}}</p>
          </div>
        </div>
      </div><!--/.modal-content -->
      <div class="modal-footer">
        <button class="{{btnClassAttrOk}}" (click)="onOkClicked()">{{btnLabelOk}}</button>
        <button class="{{btnClassAttrCancel}}" (click)="onCancelClicked()">{{btnLabelCancel}}</button>
      </div>
    </div>

    <!-- Modal Structure -->
    <ok-cancel-dialog
      [message]="Consts.Msgs.confirmChangePass"
      [classAttr]="'width40per'"
      (onOk)="save()"
    ></ok-cancel-dialog>
  `,
  styles: [`
    .form-title {
      color: #26a69a;
    }
    .modal {
      max-height: 90%;
    }
  `]
})
export class ChangePasswordComponent {
  public get Consts() { return Consts; }

  /** OkCancelDialogComponent. */
  @ViewChild(OkCancelDialogComponent) confirmSaveDialog: OkCancelDialogComponent;

  public fields: Ifields = {};

  private defaultInvalids = {};

  public invalids: Ifields = {};

  @Input()
  public classAttr = '';

  @Input()
  public btnClassAttrOk = 'waves-effect btn-flat';

  @Input()
  public btnClassAttrCancel = 'waves-effect btn-flat';

  @Input()
  public btnLabelOk = 'OK';

  @Input()
  public btnLabelCancel = 'Cancel';

  @Input()
  public materializeParams = [{
    dismissible: true,
    complete: () => this.reset()
  }];

  @Input()
  public materializeActions = new EventEmitter();

  constructor(
    private userService: UserService,
  ) { }

  public open() {
    this.materializeActions.emit({ action: 'modal', params: ['open'] });
  }

  public close() {
    this.materializeActions.emit({ action: 'modal', params: ['close'] });
  }

  public onOkClicked() {
    this.validate().subscribe(result => {
      this.confirmSaveDialog.open();
    }, response => {
      this.receiveError(response);
    });
  }

  public save() {
    this.userService.changePassword(
      this.fields.oldPass,
      this.fields.newPass,
      this.fields.newPassConfirm
    ).subscribe(result => {
      Materialize.toast(Consts.Msgs.passwordChanged, Consts.Nums.toastNormal);
      this.close();
    }, response => {
      this.receiveError(response);
    });
  }

  public onCancelClicked() {
    this.close();
  }

  private validate() {
    return this.userService.validateChangePassword(
      this.fields.oldPass,
      this.fields.newPass,
      this.fields.newPassConfirm
    ).map(res => {
      this.invalids = this.defaultInvalids;
      return res;
    });
  }

  /**
   * receive error and display messages.
   */
  private receiveError(response: any) {
    const resp = response.json();
    if (!resp.errors || !Object.keys(resp.errors).length) {
      Materialize.toast(Consts.Msgs.passwordChangeFailed, Consts.Nums.toastNormal);
      this.invalids = this.defaultInvalids;
    } else {
      this.invalids = resp.errors;
    }
    if (response.status === HttpStatus.UNAUTHORIZED) {
      this.close();
    }
  }

  /** reset the view state. */
  private reset() {
    this.fields = {};
    this.invalids = this.defaultInvalids;
    CommonUtil.updateTextFields();
  }

}

interface Ifields {
  oldPass?:        string;
  newPass?:        string;
  newPassConfirm?: string;
}
