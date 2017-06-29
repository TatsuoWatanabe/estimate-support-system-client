import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { Consts } from '../../consts/consts';

@Component({
  selector: 'pager',
  template: `
    <ul *ngIf="props && props.pages && props.pages.length" class="pagination" [ngClass]="classAttr">
        <!-- first -->
        <li class="waves-effect hide-on-small-only" [ngClass]="{disabled:props.currentPage === 1}">
            <a (click)="setPage(1)"><i class="material-icons">first_page</i></a>
        </li>
        <!-- previous -->
        <li class="waves-effect hide-on-med-and-down" [ngClass]="{disabled:props.currentPage === 1}">
            <a (click)="setPage(props.currentPage - 1)"><i class="material-icons">chevron_left</i></a>
        </li>
        <!-- page links -->
        <li *ngFor="let page of props.pages" class="waves-effect" [ngClass]="{active:props.currentPage === page}">
            <a (click)="setPage(page)">{{page}}</a>
        </li>
        <!-- next -->
        <li class="waves-effect hide-on-med-and-down" [ngClass]="{disabled:props.currentPage === props.totalPages}">
            <a (click)="setPage(props.currentPage + 1)"><i class="material-icons">chevron_right</i></a>
        </li>
        <!-- last -->
        <li class="waves-effect hide-on-small-only" [ngClass]="{disabled:props.currentPage === props.totalPages}">
            <a (click)="setPage(props.totalPages)"><i class="material-icons">last_page</i></a>
        </li>
    </ul>
  `
})
export class PagerComponent {
  public get Consts() { return Consts; }

  private props: PagerProps;

  /** Default count of data per page for pagination. */
  private pageSizeDefault = 12;

  /** Default count of page links for pagination. */
  private pageLinksDefault = 8;

  @Input()
  public pageSize: number;

  @Input()
  public pageLinks: number;

  @Input()
  public enableQueryParams = false;

  @Input()
  public classAttr = 'right-align';

  @Output()
  public change = new EventEmitter();

  constructor(
    private router: Router
  ) { }

  public getDefaultProps(page?: number, search?: object) {
    const props = new PagerProps();
    if (search) { props.search = search; }
    props.pageSize  = this.pageSize  || this.pageSizeDefault;
    props.pageLinks = this.pageLinks || this.pageLinksDefault;
    return this.getProps(props, page);
  }

  public load(props: PagerProps) {
    // set query string to url.
    this.setQueryParamsToUrl(props);
    // set props to instance.
    this.props = this.getProps(props);
  }

  public unload() {
    this.props = undefined;
  }

  public setPage(page: number) {
    // validate parameters.
    if (page < 1 || page === this.props.currentPage || page > this.props.totalPages) {
        return;
    }
    // set page to props and calculate skip and limit.
    const props = this.getProps(this.props, page);

    // emit the pager change event.
    this.change.emit(props);
  }

  /**
   * Get queryParams object from url.
   */
  public getQueryParams() {
    const tree = this.router.parseUrl(this.router.url);
    return Object.assign({}, tree.queryParams);
  }

  /**
   * Get current url exclude queryParams.
   */
  public getCurrentUrl() {
    const tree = this.router.parseUrl(this.router.url);
    // delete queryParams
    tree.queryParams = {};
    // returns url exclude queryParams.
    return tree.toString();
  }

  /**
   * Get page number from url.
   */
  public getPageFromUrl() {
    const queryParams = this.getQueryParams();
    const page = Number(queryParams.page);
    return this.isValidPage(page) ? page : 1;
  }

  /**
   * Get search params object from url.
   */
  public getSearchParamsFromUrl() {
    const queryParams = this.getQueryParams();
    if (!queryParams.search) { return {}; }

    let search = {};
    try {
      search = JSON.parse(queryParams.search);
    } catch (e) { }
    return search;
  }

  /**
   * Set query params to url.
   */
  private setQueryParamsToUrl(props: PagerProps) {
    if (!this.enableQueryParams) { return; }

    const queryParams = this.getQueryParams();
    const currentUrl = this.getCurrentUrl();
    // set or delete 'page' field.
    if (props.currentPage === 1) {
      delete queryParams['page'];
    } else {
      queryParams['page'] = String(props.currentPage);
    }
    // set or delete 'search' field.
    if (this.isEmptySearchParams(props.search)) {
      delete queryParams['search'];
    } else {
      queryParams['search'] = JSON.stringify(props.search);
    }
    this.router.navigate([currentUrl], { queryParams });
  }

  /**
   * Returns valid or not of page value.
   */
  private isValidPage(page: number) {
    return isFinite(page) && (page > 0);
  }

  /**
   * Returns empty or not of search params.
   */
  private isEmptySearchParams(search: object) {
    if (!search) { return true; }
    const keys = Object.keys(search);
    if (keys.length === 0) { return true; }
    const isEmpty = keys.every(key => {
      return search[key] === false ? false :
             search[key] === 0     ? false :
                               !search[key];
    });
    return isEmpty;
  }

  /**
   * Create the pager properties.
   * @see http://jasonwatmore.com/post/2016/08/23/angular-2-pagination-example-with-logic-like-google
   */
  private getProps(pagerProperties: PagerProps, page?: number) {
    // copy the original object.
    const props = Object.assign(new PagerProps(), pagerProperties);

    // set the page if it specified.
    if (this.isValidPage(page)) {
      props.currentPage = page;
    }

    // calculate total pages
    props.totalPages = Math.ceil(props.totalItems / props.pageSize);
    if (props.totalPages <= props.pageLinks) {
      // less than pageLinks total pages so show all
      props.startPage = 1;
      props.endPage = props.totalPages;
    } else {
      // more than pageLinks total pages so calculate start and end pages
      const overHalf = Math.floor(props.pageLinks / 2) + 1;
      const lessHalf = (props.pageLinks - overHalf);
      if (props.currentPage <= overHalf) {
        props.startPage = 1;
        props.endPage   = props.pageLinks;
      } else if (props.currentPage + lessHalf >= props.totalPages) {
        props.startPage = props.totalPages - (props.pageLinks - 1);
        props.endPage   = props.totalPages;
      } else {
        props.startPage = props.currentPage - (overHalf - 1);
        props.endPage   = props.currentPage + lessHalf;
      }
    }

    // calculate start and end item indexes
    props.startIndex = (props.currentPage - 1) * props.pageSize;
    props.endIndex = Math.min(props.startIndex + props.pageSize - 1, props.totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    props.pages = _.range(props.startPage, props.endPage + 1);

    // set the alias properties
    props.skip  = props.startIndex;
    props.limit = props.pageSize;

    // return object with all pager properties required by the view
    return props;
  }

}

/**
 * Container of pager properties.
 */
export class PagerProps {
    constructor(
      public totalItems  = 0,
      public currentPage = 1,
      public pageSize?: number,
      public pageLinks?: number,
      public totalPages?: number,
      public startPage?: number,
      public endPage?: number,
      public startIndex?: number,
      public endIndex?: number,
      public pages?: number[],
      public skip?: number,
      public limit?: number,
      public search = {}
    ) { }
}
