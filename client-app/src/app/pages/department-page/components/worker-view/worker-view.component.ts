import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { TypeWorkerFile } from '../../model/dto/type-worker-file';
import { WorkerDto } from '../../model/dto/worker-dto';
import { WorkerDep } from '../../model/entity/worker';
import { DepartmentEventService } from '../../services/department-event.service';
import { WorkerService } from '../../services/worker.service';
import { WorkerModalEditorComponent } from '../worker-modal-editor/worker-modal-editor.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-worker-view',
  templateUrl: './worker-view.component.html',
  styleUrls: ['./worker-view.component.scss']
})
export class WorkerViewComponent implements OnInit {

  //data
  public workers: WorkerDep[] = [];
  // filter
  public sortedColumn: string = '';
  public sortedColumnOpt: string[] = ['Имя', 'Фамилия', 'Возраст', 'зп'];
  public selectedTypeFile = TypeWorkerFile.JSON;
  // flags
  public needSelectedDep = true;
  public fileIsPending = false;
  public workerIsLoading = false;

  constructor(
    private eventService: DepartmentEventService,
    public dialog: MatDialog,
    private cts: CompackToastService,
    private workerService: WorkerService) { }

  ngOnInit() {

    this.workerService.getWorkersDataSubs()
      .subscribe(
        next => {
          if (next) {
            this.sortedColumn = '';
            this.needSelectedDep = false;
            this.workerIsLoading = false;
            this.workers = next;
          }
        }
      )

    this.eventService.getLoadWorkerEventObs()
      .subscribe(
        () => {
          this.workerIsLoading = true;
        }
      )
  }

  public onSortWorkers() {
    switch (this.sortedColumn) {
      case 'Имя': {
        this.workers.sort((a, b) => {
          if (a.lName > b.lName)
            return 1;
          if (a.lName < b.lName)
            return -1;
          return 0;
        });
        break;
      }
      case 'Фамилия': {
        this.workers.sort((a, b) => {
          if (a.fName > b.fName)
            return 1;
          if (a.fName < b.fName)
            return -1;
          return 0;
        });
        break;
      }
      case 'Возраст': {
        this.workers.sort((a, b) => {
          return a.age - b.age;
        });
        break;
      }
      case 'зп': {
        this.workers.sort((a, b) => {
          return a.salary - b.salary;
        });
        break;
      }
    }

  }

  public removeWorker(workerId: number) {
    if (window.confirm('удалить?')) {
      this.workerService.RemoveWorker(workerId)
        .subscribe(
          next => {
            if (next) {
              this.cts.emitNotife(TypeToast.Success, 'успешно удалён');
              if (next)
                this.workerService.ReloadWorkers();
              else this.cts.emitNotife(TypeToast.Error, 'Ошибка');
            }
          }
        );
    }
  }

  public editeWorker(worker: WorkerDep) {
    const dialog = this.dialog.open(WorkerModalEditorComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        worker: worker,
        idDep: null
      }
    })
    dialog.afterClosed().subscribe(next => {
      if (next)
        this.workerService.ReloadWorkers();
    });
  }

  public addWorker() {
    const worker = new WorkerDep();
    const dialog = this.dialog.open(WorkerModalEditorComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        worker: worker,
        idDep: this.workerService.getViewDepartmentId()
      }
    })
    dialog.afterClosed().subscribe(next => {
      if (next)
        this.workerService.ReloadWorkers();
    });
  }

  public getDesctStr(worker: WorkerDto): string {
    if (!worker)
      return '';
    return 'имя: ' + worker.fName + '\n' + 'фамилия: ' + worker.lName + '\n' + 'возраст: ' + worker.age + '\n' + 'зп: ' + worker.salary;
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
        //this.selectedFile = file;
        this.workerService.importWorker(file, this.selectedTypeFile);
        //this.selectedFile = null;
      }
    }
  }

  public exportWorker() {
    this.fileIsPending = true;
    this.workerService.exportWorker(this.selectedTypeFile)
      .subscribe(
        next =>
          saveAs(next, 'exports'),
        error =>
          this.cts.emitNotife(TypeToast.Error, 'Экспорт данных', 'Произошла ошибка'),
        () => this.fileIsPending = false
      );
  }

}
