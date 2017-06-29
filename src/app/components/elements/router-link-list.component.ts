import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Consts }      from '../../consts/consts';
import { User }        from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'router-link-list',
  templateUrl: '../../../../templates/elements/router-link-list.component.html'
})
export class RouterLinkListComponent implements OnInit {
  public get Consts() { return Consts; }

  @Input()
  public idAttr = '';

  @Input()
  public classAttr = '';

  public user: User;

  constructor(
    private authService: AuthService
  ) { }

  public ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
