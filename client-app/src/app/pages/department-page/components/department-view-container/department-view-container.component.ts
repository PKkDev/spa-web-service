import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { TypeWorkerFile } from '../../model/dto/type-worker-file';
import { Department } from '../../model/entity/department';
import { DepartmentEventService } from '../../services/department-event.service';
import { DepartmentService } from '../../services/department.service';
import { WorkerService } from '../../services/worker.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-department-view-container',
  templateUrl: './department-view-container.component.html',
  styleUrls: ['./department-view-container.component.scss']
})
export class DepartmentViewContainerComponent implements OnInit, OnDestroy {

  // data
  public departments: Department[] = [];
  public selectedTypeFile = TypeWorkerFile.JSON;
  // flag
  public dataIsLoading = true;
  public fileIsPending = false;

  constructor(
    private cts: CompackToastService,
    private eventService: DepartmentEventService,
    public workerService: WorkerService,
    private depService: DepartmentService) { }

  ngOnInit() {

    this.loadGlobalDepartment();

    this.eventService.getUpdateChildrenEventObs()
      .subscribe(
        (next: number | null) => {
          if (next == null)
            this.loadGlobalDepartment();
        }
      );
  }

  ngOnDestroy() {
  }

  private loadGlobalDepartment() {
    this.depService.LoadGlobalDepartment()
      .subscribe(next => {
        this.dataIsLoading = false;
        this.departments = next
      })
  }

  public AddNewGlobalDep() {
    const search = this.departments.findIndex(x => x.forAddNew);
    if (search != -1) {
      this.departments.splice(search, 1);
    }
    const addDep = new Department();
    addDep.name = '';
    addDep.parentId = null;
    addDep.forAddNew = true;
    this.departments.unshift(addDep);
  }

  // public selectedFile: File | null = null;
  onFileSelected(input: HTMLInputElement) {
    if (input.files) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        };
        reader.readAsDataURL(file);
        // this.selectedFile = file;
        // this.importDepartments();
        this.depService.importDepartments(file, this.selectedTypeFile);
      }
    }
  }
  // importDepartments() {
  //   if (this.selectedFile)
  //     this.depService.importDepartments(this.selectedFile, this.selectedTypeFile);
  // }

  public exportDepartment() {
    this.fileIsPending = true;
    this.depService.exportDepartment(this.selectedTypeFile)
      .subscribe(
        next =>
          saveAs(next, 'exports'),
        error =>
          this.cts.emitNotife(TypeToast.Error, 'Экспорт данных', 'Произошла ошибка'),
        () =>
          this.fileIsPending = false
      );
  }

}
