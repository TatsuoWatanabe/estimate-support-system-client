import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { OkCancelDialogComponent } from '../elements/ok-cancel-dialog.component';
import { Consts }                  from '../../consts/consts';

@Component({
  selector: 'common-edit-btns',
  template: `
    <div class="row">
      <!-- save button -->
      <div class="col s12 m2 right">
        <button
          (click)="onClickSave()"
          class="btn {{Consts.Colors.main}} btn-slim waves-effect waves-light right"
        >{{Consts.Labels.save}}</button>
      </div>
      <!-- back button -->
      <div class="col s12 m2 right">
        <button
          (click)="onClickBackBtn($event)"
          class="btn grey btn-slim waves-effect waves-light right"
        >{{Consts.Labels.back}}</button>
      </div>
    </div><!-- /.row -->

    <div *ngIf="deletable" class="row">
      <!-- delete button -->
      <div class="col s12 m2 right">
        <button
          (click)="onClickDelete()"
          class="btn red lighten-1 btn-slim waves-effect waves-light right"
        >{{Consts.Labels.delete}}</button>
      </div>
    </div><!-- /.row -->
    
    <!-- Modal Structure -->
    <ok-cancel-dialog #confirmSaveDialog
      [message]="Consts.Msgs.confirmSave(dataName)"
      [classAttr]="'width40per'"
      (onOk)="onClickSaveOk()"
    ></ok-cancel-dialog>

    <!-- Modal Structure -->
    <ok-cancel-dialog #confirmDeleteDialog
      [message]="Consts.Msgs.confirmDelete(dataName)"
      [classAttr]="'width40per'"
      (onOk)="onClickDeleteOk()"
    ></ok-cancel-dialog>
  `
})
export class CommonEditBtnsComponent {
  public get Consts() { return Consts; }

  @ViewChild('confirmSaveDialog')
  public confirmSaveDialog: OkCancelDialogComponent;

  @ViewChild('confirmDeleteDialog')
  public confirmDeleteDialog: OkCancelDialogComponent;

  @Output()
  public clickBackBtn = new EventEmitter();

  @Output()
  public clickSave = new EventEmitter();

  @Output()
  public clickSaveOk = new EventEmitter();

  @Output()
  public clickDelete = new EventEmitter();

  @Output()
  public clickDeleteOk = new EventEmitter();

  @Input()
  public deletable = false;

  @Input()
  public dataName = '';

  public onClickBackBtn($event: any) {
    this.clickBackBtn.emit($event);
  }

  public onClickSave($event: any) {
    this.clickSave.emit($event);
  }

  public onClickSaveOk($event: any) {
    this.clickSaveOk.emit($event);
  }

  public onClickDelete($event: any) {
    this.clickDelete.emit($event);
  }

  public onClickDeleteOk($event: any) {
    this.clickDeleteOk.emit($event);
  }

}
