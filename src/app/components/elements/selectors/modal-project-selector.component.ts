import {
  Component,
  ViewChild
} from '@angular/core';
import { BaseModalSelector }        from './base-modal-selector';
import { Project }                  from '../../../models/project';
import { ProjectSelectorComponent } from '../../../components/elements/selectors/project-selector.component';

@Component({
  selector: 'modal-project-selector',
  template: `
    <div
      class="modal {{classAttr}}"
      materialize="modal"
      [materializeParams]="materializeParams"
      [materializeActions]="materializeActions"
    >
      <div class="modal-content">
        <project-selector
          [pageSize]="pageSize"
          [pageLinks]="pageLinks"
          [loadOnInit]="false"
          (onSelect)="onSelectProject($event)"
        ></project-selector>
      </div>
      <div class="modal-footer">
        <button class="{{btnClassAttrCancel}}" (click)="close()">{{btnLabelCancel}}</button>
      </div>
    </div>
  `
})
export class ModalProjectSelectorComponent extends BaseModalSelector {

  @ViewChild(ProjectSelectorComponent)
  public projectSelector: ProjectSelectorComponent;

  public onSelectProject(project: Project) {
    this.onSelect.emit({
      project,
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
    this.projectSelector.load();
    this.openModal(this.materializeActions);
  }

  /** close the modal. */
  public close() {
    this.closeModal(this.materializeActions);
  }

  /** after close handler. */
  public onComplete() {
    this.projectSelector.unload();
  }

}
