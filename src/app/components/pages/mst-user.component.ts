import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router }                from '@angular/router';
import { User }                  from '../../models/user';
import { Consts }                from '../../consts/consts';
import { UserSelectorComponent } from '../../components/elements/selectors/user-selector.component';

@Component({
  selector: 'mst-user',
  templateUrl: '../../../../templates/pages/mst-user.component.html'
})
export class MstUserComponent implements OnInit {
  public get Consts() { return Consts; }
  public users: User[];

  @ViewChild(UserSelectorComponent)
  public userSelector: UserSelectorComponent;

  constructor(
    private router: Router
  ) { }

  public ngOnInit() {
  }

  public gotoEdit(user: User) {
    this.router.navigate([`${Consts.Paths.mstUser}/${Consts.Paths.edit}`, user._id]);
  }

}
