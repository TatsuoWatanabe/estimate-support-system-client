import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Params
} from '@angular/router';
import { Location } from '@angular/common';
import '../../modules/rxjs-extensions';
import { CommonEditBtnsComponent } from '../elements/common-edit-btns.component';
import { UserService }             from '../../services/user.service';
import { User }                    from '../../models/user';
import { Consts }                  from '../../consts/consts';
import { CommonUtil }              from '../../util/common-util';

@Component({
  selector: 'mst-user-edit',
  templateUrl: '../../../../templates/pages/mst-user-edit.component.html'
})
export class MstUserEditComponent implements OnInit, AfterViewInit {
  public get Consts() { return Consts; }

  @ViewChild(CommonEditBtnsComponent)
  public commonEditBtns: CommonEditBtnsComponent;

  public isNew = true;

  public editUser: User;

  private defaultInvalids = {};

  public invalids: {
    username?:    string;
    password?:    string;
    displayName?: string;
  } = this.defaultInvalids;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  public ngOnInit(): void {
    const routeParams = this.route.params['value'];
    this.isNew = !routeParams._id;

    if (this.isNew) {
      this.editUser = User.create();
      return;
    }

    this.route.params.switchMap((params: Params) => {
      return this.userService.getUser(params['_id']);
    }).subscribe(editUser => {
      if (!editUser._id) {
        Materialize.toast(Consts.Msgs.noData, Consts.Nums.toastNormal);
        return this.goBack();
      }
      this.editUser = editUser;
    }, (err) => {
      Materialize.toast(Consts.Msgs.noData, Consts.Nums.toastNormal);
      this.goBack();
    });
  }

  public ngAfterViewInit() {
    if (this.isNew) { return; }
    CommonUtil.updateTextFields();
  }

  public onClickSave() {
    this.validate().subscribe(result => {
      this.commonEditBtns.confirmSaveDialog.open();
    }, response => {
      this.receiveError(response);
    });
  }

  private validate() {
    return this.userService.validateSave(
      this.editUser
    ).map(res => {
      this.invalids = this.defaultInvalids;
      return res;
    });
  }

  public save() {
    this.userService.save(
      this.editUser
    ).subscribe(() => {
      Materialize.toast(Consts.Msgs.saved, Consts.Nums.toastNormal);
      this.goBack();
    }, response => {
      this.receiveError(response);
    });
  }

  public onClickDelete() {
    this.commonEditBtns.confirmDeleteDialog.open();
  }

  public delete() {
    this.userService.delete(
      this.editUser
    ).subscribe(() => {
      Materialize.toast(Consts.Msgs.deleted, Consts.Nums.toastNormal);
      this.goBack();
    }, (err) => {
      // TODO: show various err messages.
      Materialize.toast(Consts.Msgs.deleteFailed, Consts.Nums.toastNormal);
    });
  }

  public goBack() {
    this.location.back();
  }

  /**
   * receive error and display messages.
   */
  private receiveError(response: any) {
    const resp = response.json();
    if (!resp.errors || !Object.keys(resp.errors).length) {
      Materialize.toast(Consts.Msgs.saveFailed, Consts.Nums.toastNormal);
      this.invalids = this.defaultInvalids;
    } else {
      this.invalids = resp.errors;
    }
  }

}
