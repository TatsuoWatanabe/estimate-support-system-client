import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input
} from '@angular/core';
import * as moment from 'moment/moment';
import { Consts }  from '../../../consts/consts';

@Component({
  selector: 'month-selector',
  template: `
    <select
      materialize="material_select"
      [materializeSelectOptions]="selectOptions"
      [(ngModel)]="selectValue"
      (ngModelChange)="onChange($event)"
    >
      <option *ngFor="let option of selectOptions" [value]="option.value">{{option.name}}</option>
    </select>
    <label *ngIf="label">{{label}}</label>
  `
})
export class MonthSelectorComponent implements OnInit {
  public get Consts() { return Consts; }

  @Input()
  public format = Consts.Formats.yearMonth;

  @Input()
  public selectOptions: { name: string, value: string }[] = [];

  @Input()
  public selectValue = '';

  @Input()
  public monthAgoFrom = 6;

  @Input()
  public monthRange = 12;

  @Input()
  public label = '';

  public get moment() {
    return moment(this.selectValue, Consts.Formats.yearMonth);
  }

  @Output()
  public monthChanged = new EventEmitter();

  constructor(
    // write here dependency injection declaration.
  ) {  }

  ngOnInit(): void {
    const month = 'month';
    const valueFormat = Consts.Formats.yearMonthDb;

    if (!this.selectValue) {
      this.selectValue = moment().format(valueFormat);
    }
    // support parsing format 'YYYY-MM' and specified format.
    const m = moment(this.selectValue, valueFormat);
    this.selectValue = m.format(valueFormat);

    m.subtract(this.monthAgoFrom, month);
    for (let i = 0; i <= this.monthRange; i += 1) {
      const name = m.format(this.format);
      const value = m.format(valueFormat);
      this.selectOptions.push({ name, value });
      m.add(1, month);
    }
    this.selectOptions.sort((a, b) => a.value < b.value ? 1 : -1);
  }

  public onChange($event: any) {
    this.monthChanged.emit(this);
  }

  /**
   * get the value of specified format.
   * @param format format of selected value.
   */
  public getValue(fmt = Consts.Formats.yearMonthDb) {
    return this.moment.format(fmt);
  }

}
