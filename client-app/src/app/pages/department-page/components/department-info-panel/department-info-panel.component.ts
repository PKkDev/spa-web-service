import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DepartmentInfoDto } from '../../model/dto/department-info-dto';
import { DepartmentEventService } from '../../services/department-event.service';

@Component({
  selector: 'app-department-info-panel',
  templateUrl: './department-info-panel.component.html',
  styleUrls: ['./department-info-panel.component.scss']
})
export class DepartmentInfoPanelComponent implements OnInit, OnDestroy {

  // data
  public countDepartment = 0;
  public countWorkers = 0;
  // http
  private subs: Subscription | null | undefined

  constructor(
    private apiService: ApiService,
    private cts: CompackToastService,
    private departmentEventService: DepartmentEventService) { }

  ngOnInit() {

    this.getCountDepartment()

    this.departmentEventService.getUpdateChildrenEventObs()
      .subscribe(() => this.getCountDepartment())

  }

  ngOnDestroy() {
    if (this.subs)
      this.subs.unsubscribe();
  }

  private getCountDepartment() {
    this.subs = this.apiService.get<DepartmentInfoDto>("department/info")
      .subscribe(
        next => {
          if (next) {
            this.countDepartment = next.countDepartment;
            this.countWorkers = next.countWorkers;
          }
        },
        error => this.cts.emitNotife(TypeToast.Error, 'информация по департаментам'));
  }

}

