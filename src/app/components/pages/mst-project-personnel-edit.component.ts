import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Params
} from '@angular/router';
import { Location } from '@angular/common';
import '../../modules/rxjs-extensions';
import * as moment from 'moment/moment';
import { ProjectPersonnelService }    from '../../services/project-personnel.service';
import { Project }                    from '../../models/project';
import { ProjectPersonnel }           from '../../models/project-personnel';
import { User }                       from '../../models/user';
import { MonthSelectorComponent }     from '../../components/elements/selectors/month-selector.component';
import { ModalUserSelectorComponent } from '../../components/elements/selectors/modal-user-selector.component';
import { CommonEditBtnsComponent }    from '../elements/common-edit-btns.component';
import { Consts }                     from '../../consts/consts';

@Component({
  selector: 'mst-project-personnel-edit',
  templateUrl: '../../../../templates/pages/mst-project-personnel-edit.component.html',
  styles: [`
    .collection {
      overflow: visible;
    }
    .collection-item .row {
      margin-bottom: 0px;
    }
    .add-btn {
      margin-right: 1.3rem;
      margin-top: -1.4rem;
    }
  `]
})
export class MstProjectPersonnelEditComponent implements OnInit {
  public get Consts() { return Consts; }

  public project: Project;
  public projectPersonnels: ProjectPersonnel[];

  @ViewChild(ModalUserSelectorComponent)
  public modalUserSelector: ModalUserSelectorComponent;

  @ViewChild(CommonEditBtnsComponent)
  public commonEditBtns: CommonEditBtnsComponent;

  constructor(
    private projectPersonnelService: ProjectPersonnelService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  public ngOnInit(): void {
    this.route.params.switchMap((params: Params) => {
      return this.projectPersonnelService.getProjectPersonnel(params['_id']);
    }).subscribe(obj => {
      if (!obj.project) {
        Materialize.toast(Consts.Msgs.noData, Consts.Nums.toastNormal);
        return this.goBack();
      }
      this.project = obj.project;
      this.projectPersonnels = obj.projectPersonnels;
    }, (err) => {
      Materialize.toast(Consts.Msgs.noData, Consts.Nums.toastNormal);
      this.goBack();
    });
  }

  public openUserSelector(pp: ProjectPersonnel) {
    this.modalUserSelector.open(pp);
  }

  public onSelectUser(event: {user: User, paramObject: ProjectPersonnel}) {
    const targetRowData = event.paramObject;
    // set user object to binding data.
    targetRowData.userId = event.user;
    this.modalUserSelector.close();
  }

  public monthChanged(monthSelector: MonthSelectorComponent, pp: ProjectPersonnel, fieldName: string) {
    pp[fieldName] = monthSelector.selectValue;
  }

  public addRow() {
    // TODO: validate user input
    const isValid = this.validate();
    if (!isValid) { return; }

    const newPP = ProjectPersonnel.create();
    const m = moment();
    newPP.projectId  = this.project._id;
    newPP.periodFrom = m.format(Consts.Formats.yearMonthDb);
    newPP.periodTo   = m.format(Consts.Formats.yearMonthDb);
    this.projectPersonnels.push(newPP);
  }

  public deleteRow(pp: ProjectPersonnel) {
    const idx = this.projectPersonnels.indexOf(pp);
    if (idx !== -1) {
      this.projectPersonnels.splice(idx, 1);
    }
  }

  public validate() {
    // TODO: server side validation.
    const errs: string[] = [];
    this.projectPersonnels.forEach((pp) => {
      if (!pp.userId || !pp.userId._id) {
        errs.push(Consts.Msgs.promptInput(Consts.Labels.personnelName));
      }
    });

    errs.forEach((errMsg) => Materialize.toast(errMsg, Consts.Nums.toastNormal));
    return errs.length ? false : true;
  }

  public onClickSave() {
    if (this.validate()) {
      this.commonEditBtns.confirmSaveDialog.open();
    };
  }

  public save() {
    this.projectPersonnelService.save(this.project, this.projectPersonnels).subscribe(() => {
      Materialize.toast(Consts.Msgs.saved, Consts.Nums.toastNormal);
    }, (err) => {
      Materialize.toast(Consts.Msgs.saveFailed, Consts.Nums.toastNormal);
    });
  }

  public goBack() {
    this.location.back();
  }

}
