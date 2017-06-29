import { Component } from '@angular/core';

@Component({
  selector: 'page-title',
  template: `
    <h4 class="blue-text text-darken-4"><ng-content></ng-content></h4>
  `
})
export class PageTitleComponent {
}
