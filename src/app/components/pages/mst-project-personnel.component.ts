import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Project }           from '../../models/project';
import { Consts }            from '../../consts/consts';

@Component({
  selector: 'mst-project-personnel',
  templateUrl: '../../../../templates/pages/mst-project-personnel.component.html'
})
export class MstProjectPersonnelComponent implements OnInit {
  public get Consts() { return Consts; }
  public projects: Project[];

  constructor(
    private router: Router
  ) { }

  public ngOnInit() {
  }

  public gotoEdit(project: Project) {
    this.router.navigate([`${Consts.Paths.mstProjectPersonnel}/${Consts.Paths.edit}`, project._id]);
  }

}
