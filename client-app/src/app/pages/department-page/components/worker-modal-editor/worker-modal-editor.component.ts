import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { WorkerDep } from '../../model/entity/worker';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-worker-modal-editor',
  templateUrl: './worker-modal-editor.component.html',
  styleUrls: ['./worker-modal-editor.component.scss']
})
export class WorkerModalEditorComponent implements OnInit {

  constructor(
    private cts: CompackToastService,
    private workerService: WorkerService,
    public dialogRef: MatDialogRef<WorkerModalEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { worker: WorkerDep, idDep: number }) { }

  ngOnInit() { }

  public update() {
    if (this.data.idDep) {
      this.workerService.AddWorker(this.data.idDep, this.data.worker)
        .subscribe(next => {
          if (next) {
            this.cts.emitNotife(TypeToast.Success, 'Успешно добавлено');
            this.dialogRef.close(true);
          }
          else this.cts.emitNotife(TypeToast.Error, 'Ошибка');
        });
    } else {
      this.workerService.UpdateWorker(this.data.worker)
        .subscribe(next => {
          if (next) {
            this.cts.emitNotife(TypeToast.Success, 'Успешно обновлено');
            this.dialogRef.close(true);
          }
          else this.cts.emitNotife(TypeToast.Error, 'Ошибка');
        });
    }
  }

  public cLoseDialog() {
    this.dialogRef.close(false);
  }

}
