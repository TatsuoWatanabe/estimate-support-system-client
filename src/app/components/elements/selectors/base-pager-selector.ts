import {
  Input,
  AfterViewInit
} from '@angular/core';
import { Consts }     from '../../../consts/consts';
import { PagerProps } from '../pager.component';

export abstract class BasePagerSelector implements AfterViewInit {
  public get Consts() { return Consts; }

  @Input()
  public pageSize: number;

  @Input()
  public pageLinks: number;

  @Input()
  public enableQueryParams = false;

  @Input()
  public loadOnInit = true;

  /**
   * To load template parameter, use ngAfterViewInit.
   */
  public ngAfterViewInit() {
    if (!this.loadOnInit) { return; }
    this.load();
  }

  abstract load(props?: PagerProps): void

  abstract unload(): void

  abstract onPageChange(props: PagerProps): void;

}
