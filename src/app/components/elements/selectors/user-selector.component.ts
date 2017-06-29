import {
  Component,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  PagerComponent,
  PagerProps
} from '../pager.component';
import { Consts, SP }        from '../../../consts/consts';
import { BasePagerSelector } from './base-pager-selector';
import { User }              from '../../../models/user';
import { UserService }       from '../../../services/user.service';

@Component({
  selector: 'user-selector',
  template: `
    <div class="row">
      <div class="input-field col s1">
      </div>
      <div class="input-field col s6 l8">
        <input
          type="text"
          [(ngModel)]="search.name"
          maxlength="{{Consts.Limits.username.max}}"
          placeholder="{{Consts.Labels.username + Consts.Labels.search}}"
        />
      </div>
      <div class="input-field col s5 l3">
        <a (click)="onSearch($event)" class="waves-effect waves-light btn">
          <i class="material-icons left">search</i>{{Consts.Labels.search}}
        </a>
      </div>
    </div>

    <pager
      [enableQueryParams]="enableQueryParams"
      [pageSize]="pageSize"
      [pageLinks]="pageLinks"
      (change)="onPageChange($event)"
    ></pager>

    <div class="collection">
      <a *ngFor="let user of users"
        class="collection-item cursor-pointer blue-text text-darken4"
        (click)="onClickItem(user);"
      >
        <span>{{user.displayName}}</span>
        <span class="right">{{user.employeeCode}}</span>
      </a>
    </div><!--/.collection -->
    <div *ngIf="users?.length === 0">{{Consts.Msgs.noData}}</div>
  `
})
export class UserSelectorComponent extends BasePagerSelector {
  public get Consts() { return Consts; }

  public users: User[] = [];

  public search: { name?: string; } = {};

  @ViewChild(PagerComponent)
  public pager: PagerComponent;

  @Output()
  public onSelect = new EventEmitter();

  constructor(
    private userService: UserService
  ) {
    super();
  }

  public load(props?: PagerProps) {
    if (!props && this.enableQueryParams) {
      const page   = this.pager.getPageFromUrl();
      const search = this.pager.getSearchParamsFromUrl();
      this.search  = search;
      props = this.pager.getDefaultProps(page, search);
    } else if (!props) {
      props = this.pager.getDefaultProps();
    }

    this.userService.getUsers(props).subscribe((res) => {
      this.users = res.users;
      props.totalItems = res.totalItems;
      this.pager.load(props);
    });
  }

  /** unload and reset the view state. */
  public unload() {
    this.users = [];
    this.search = {};
    this.pager.unload();
  }

  public onPageChange(props: PagerProps) {
    this.load(props);
  }

  public onClickItem(user: User) {
    this.onSelect.emit(user);
  }

  public onSearch(event: any) {
    const props = this.pager.getDefaultProps();

    // set search parameter
    if (this.search.name) { props.search[SP.name] = this.search.name; }

    this.load(props);
  }

}
