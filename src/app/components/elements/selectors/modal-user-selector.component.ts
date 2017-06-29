import {
  Component,
  ViewChild
} from '@angular/core';
import { BaseModalSelector }     from './base-modal-selector';
import { User }                  from '../../../models/user';
import { UserSelectorComponent } from '../../../components/elements/selectors/user-selector.component';

@Component({
  selector: 'modal-user-selector',
  template: `
    <div
      class="modal {{classAttr}}"
      materialize="modal"
      [materializeParams]="materializeParams"
      [materializeActions]="materializeActions"
    >
      <div class="modal-content">
        <user-selector
          [loadOnInit]="false"
          (onSelect)="onSelectUser($event)"
        ></user-selector>
      </div>
      <div class="modal-footer">
        <button class="{{btnClassAttrCancel}}" (click)="close()">{{btnLabelCancel}}</button>
      </div>
    </div>
  `
})
export class ModalUserSelectorComponent extends BaseModalSelector {

  @ViewChild(UserSelectorComponent)
  public userSelector: UserSelectorComponent;

  public onSelectUser(user: User) {
    this.onSelect.emit({
      user,
      paramObject: this.paramObject
    });
  }

  /**
   * open the modal.  
   * Received object will return when item selected.  
   * It is useable for specify where was call this.
   * 
   * @param obj 
   */
  public open(obj?: any) {
    this.paramObject = obj;
    this.userSelector.load();
    this.openModal(this.materializeActions);
  }

  /**
   * close the modal.
   */
  public close() {
    this.closeModal(this.materializeActions);
  }

  /** after close handler. */
  public onComplete() {
    this.userSelector.unload();
  }
}
