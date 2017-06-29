import {
  Input,
  Output,
  EventEmitter
} from '@angular/core';

export abstract class BaseModalSelector {

  @Input()
  public pageSize: number = 8;

  @Input()
  public pageLinks: number;

  @Input()
  public classAttr = 'width70per';

  @Input()
  public btnClassAttrCancel = 'modal-action modal-close waves-effect btn-flat';

  @Input()
  public btnLabelCancel = 'Cancel';

  @Input()
  public materializeParams = [{
    dismissible: true,
    complete: () => { this.onComplete(); }
  }];

  @Output()
  public onSelect = new EventEmitter();

  @Output()
  public onCancel = new EventEmitter();

  /** EventEmitter for materialize dialog. */
  public materializeActions = new EventEmitter();

  public paramObject: any = {};

  /**
   * open the modal.  
   * Received object will return when item selected.  
   * It is useable for specify where was call this.
   * 
   * @param obj 
   */
  abstract open(obj?: any): void;

  /** close the modal. */
  abstract close(): void;

  /** after close handler. */
  abstract onComplete(): void;

  public openModal(emitter: EventEmitter<any>) {
    emitter.emit({ action: 'modal', params: ['open'] });
  }

  public closeModal(emitter: EventEmitter<any>) {
    emitter.emit({ action: 'modal', params: ['close'] });
  }
}
