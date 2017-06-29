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
import { ProjectService }          from '../../services/project.service';
import { Project }                 from '../../models/project';
import { Consts }                  from '../../consts/consts';
import { CommonUtil }              from '../../util/common-util';

@Component({
  selector: 'mst-project-edit',
  templateUrl: '../../../../templates/pages/mst-project-edit.component.html'
})
export class MstProjectEditComponent implements OnInit, AfterViewInit {
  public get Consts() { return Consts; }

  @ViewChild(CommonEditBtnsComponent)
  public commonEditBtns: CommonEditBtnsComponent;

  public isNew = true;

  public project: Project;

  private defaultInvalids = {};

  public invalids: {
    name?:        string;
    projectCode?: string;
    projectNote?: string;
  } = this.defaultInvalids;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  public ngOnInit(): void {
    const routeParams = this.route.params['value'];
    this.isNew = !routeParams._id;

    if (this.isNew) {
      this.project = Project.create();
      return;
    }

    this.route.params.switchMap((params: Params) => {
      return this.projectService.getProject(params['_id']);
    }).subscribe(project => {
      if (!project._id) {
        Materialize.toast(Consts.Msgs.noData, Consts.Nums.toastNormal);
        return this.goBack();
      }
      this.project = project;
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
    return this.projectService.validateSave(
      this.project
    ).map(res => {
      this.invalids = this.defaultInvalids;
      return res;
    });
  }

  public save() {
    this.projectService.save(
      this.project
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
    this.projectService.delete(
      this.project
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
