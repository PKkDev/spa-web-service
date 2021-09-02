import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Department } from '../../model/entity/department';
import { DepartmentEventService } from '../../services/department-event.service';
import { DepartmentService } from '../../services/department.service';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.scss']
})
export class DepartmentViewComponent implements OnInit, AfterViewInit {

  @ViewChild('container') container!: ElementRef;
  // templates
  @ViewChild('editTemplate')
  private editTemplate!: TemplateRef<any>;
  @ViewChild('viewTemplate')
  private viewTemplate!: TemplateRef<any>;
  public template: TemplateRef<any> | null = null;
  // input config
  @Input() config: Department | null = null;
  // flag
  public visibleMoreDep = false;
  public startLoadingSubDepartments = false;
  public isCanEdit = false;
  // edited department
  public editetDepartment: Department | null = null;

  constructor(
    private cts: CompackToastService,
    private cds: ChangeDetectorRef,
    private departmentEventService: DepartmentEventService,
    private el: ElementRef,
    private workerService: WorkerService,
    private departmentService: DepartmentService) { }

  ngOnInit() {

    this.departmentEventService.getNewclickInnerDepartmentEventObs()
      .subscribe((nex: EventTarget) => {

        if (this.container.nativeElement == nex) {
          this.isCanEdit = true;
          if (this.config?.id != -1) {
            this.workerService.EmitClearWorkers(true);
            if (this.config) {
              this.workerService.EmitLoadWorkerByDepartment(this.config.id);
              this.departmentEventService.emiteLoadWorkerEvent();
            }
          }
        } else {
          this.isCanEdit = false;
          if (this.config?.forAddNew)
            this.el.nativeElement.remove();
        }

        if (!this.el.nativeElement.contains(nex)) {
          this.visibleMoreDep = false;
        } else {
          this.visibleMoreDep = true;
        }

      })

    this.departmentEventService.getUpdateChildrenEventObs()
      .subscribe((id: number) => {
        if (this.config?.id == id) {
          this.viewMoreDepartment(true);
        }
      });
  }

  ngAfterViewInit() {
    this.loadTemplate();

    if (this.config?.forAddNew) {
      this.departmentEventService.setNewclickInnerDepartmentEvent(this.container.nativeElement);
      this.cds.detectChanges();
    }
  }

  public cancelEdit() {
    if (this.config?.forAddNew)
      this.el.nativeElement.remove();
    else {
      this.editetDepartment = null
      this.loadTemplate();
    }
  }

  public updateDepartment() {
    if (this.editetDepartment && this.config) {
      if (this.config.forAddNew) {
        this.departmentService.AddDepartment(this.editetDepartment.name, this.config.parentId)
          .subscribe(
            next => {
              if (next) {
                this.cts.emitNotife(TypeToast.Success, 'Успешно')
                if (this.config)
                  this.departmentEventService.emiteUpdateChildrenEvent(this.config.parentId);
              } else
                this.cts.emitNotife(TypeToast.Error, 'Ошибка');
            },
            err => {
              this.el.nativeElement.remove();
            });
      } else {
        this.departmentService.UpdateDepartment(this.editetDepartment?.name, this.config?.id)
          .subscribe(
            next => {
              if (next) {
                this.cts.emitNotife(TypeToast.Success, 'Успешно')
                if (this.editetDepartment && this.config)
                  this.config.name = this.editetDepartment?.name;
                this.cancelEdit();
              } else
                this.cts.emitNotife(TypeToast.Error, 'Ошибка');
            },
            err => this.cancelEdit()
          );
      }
    }
  }

  public remove() {
    if (window.confirm('удалить?'))
      if (this.config) {
        this.departmentService.RemoveDepartment(this.config?.id)
          .subscribe(
            next => {
              if (next) {
                this.cts.emitNotife(TypeToast.Success, 'Успешно')
                this.el.nativeElement.remove();
              } else
                this.cts.emitNotife(TypeToast.Error, 'Ошибка');
            });
      }
  }

  public startAddnewDepartment() {
    if (this.config) {
      const search = this.config.departments.findIndex(x => x.forAddNew);
      if (search != -1) {
        this.config?.departments.splice(search, 1);
      }
      const addDep = new Department();
      addDep.name = '';
      addDep.parentId = this.config.id;
      addDep.forAddNew = true;
      this.config?.departments.unshift(addDep);
      this.isCanEdit = false;
    }
  }

  public startEdite() {
    if (this.config) {
      this.editetDepartment = new Department();
      this.editetDepartment.name = this.config.name;
      this.loadTemplate();
    }
  }

  private loadTemplate() {
    if (this.config?.forAddNew) {
      this.editetDepartment = new Department();
      this.editetDepartment.name = this.config.name;
      this.template = this.editTemplate
    } else {
      this.template = this.editetDepartment ? this.editTemplate : this.viewTemplate;
    }
    this.cds.detectChanges();
  }

  public viewMoreDepartment(ignoreNoew: boolean) {
    this.departmentEventService.setNewclickInnerDepartmentEvent(this.container.nativeElement);
    if (this.config)
      if (this.config?.departments.length == 0 || ignoreNoew) {
        this.startLoadingSubDepartments = true;
        this.departmentService.LoadChildrenDepartment(this.config.id)
          .subscribe(next => {
            if (this.config)
              this.config.departments = next;
            this.startLoadingSubDepartments = false;
          })
      }
  }

}
