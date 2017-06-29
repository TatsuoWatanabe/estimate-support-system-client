import {
  Component,
  Input,
  EventEmitter
} from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

const size = '128px';

@Component({
  selector: 'modal-preloader',
  template: `
    <div class="modal modal-preloader"
      materialize="modal" 
      [materializeParams]="materializeParams"
      [materializeActions]="materializeActions"
    >
        <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div><!-- /.spinner-layer -->

          <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div><!-- /.spinner-layer -->

          <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div><!-- /.spinner-layer -->

          <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div><!-- /.spinner-layer -->

        </div><!-- /.preloader-wrapper -->
    </div>
  `,
  styles: [`
    .modal-preloader {
      top: 30% !important;
      width: ${size};
      height: ${size};
      background-color: rgba(0, 0, 0, 0);
      box-shadow: none;
      overflow: hidden;
      padding: 0;
    }
    .modal-preloader .preloader-wrapper.big {
      width: ${size};
      height: ${size};
    }
  `]
})
export class ModalPreloaderComponent {

  @Input()
  public materializeParams = [{
    dismissible: false,
    opacity: 0.2,
    /** Callback for Modal open. Modal and trigger parameters available.*/
    ready: (modal: any, trigger: any) => {
        const overlay  = $(modal).data('associatedOverlay');
        const defaultZ = Number($(overlay).css('zIndex'));
        const doubleZ  = defaultZ * 2;
        const addOne   = doubleZ + 1;
        $(overlay).css('zIndex', doubleZ);
        $(modal).css('zIndex', addOne);
    }
  }];

  @Input()
  public materializeActions: EventEmitter<string | MaterializeAction>;

}
