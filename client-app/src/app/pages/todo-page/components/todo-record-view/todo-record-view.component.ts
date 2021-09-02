import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TodoRecordInfo } from '../../model/todo-record-info';
import { TodoRecordService } from '../../services/todo-record.service';

@Component({
  selector: 'app-todo-record-view',
  templateUrl: './todo-record-view.component.html',
  styleUrls: ['./todo-record-view.component.scss']
})
export class TodoRecordViewComponent implements OnInit, AfterViewInit {
  // input config
  @Input() recordData: TodoRecordInfo | undefined = undefined;
  // типы шаблонов
  @ViewChild('readTemplate', { static: false }) readTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate', { static: false }) editTemplate!: TemplateRef<any>;
  private isEdit = false;
  public selectedTemplate = this.readTemplate;
  // editet record
  public editedRecord: TodoRecordInfo | undefined = undefined

  constructor(
    private recordService: TodoRecordService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadTemplate();
  }

  public updateRecord() {
    if (this.editedRecord) {
      if (this.editedRecord.isNew)
        this.recordService.addNewRecord(this.editedRecord);
      else
        this.recordService.updateRecord(this.editedRecord);
    }

  }

  public removeRecord() {
    if (this.editedRecord) {
      this.recordService.removeRecord(this.editedRecord?.id);
    }
  }

  public cancelEdit(isNew: boolean) {
    if (isNew) {
      this.recordService.emiteCancelAddPosts();
    } else {
      this.editedRecord = undefined;
      this.isEdit = !this.isEdit;
      this.loadTemplate();
    }
  }

  public editRecord() {
    this.editedRecord = JSON.parse(JSON.stringify(this.recordData));
    this.isEdit = !this.isEdit;
    this.loadTemplate();
  }

  public loadTemplate() {
    if (this.recordData?.isNew) {
      this.editedRecord = JSON.parse(JSON.stringify(this.recordData));
      this.selectedTemplate = this.editTemplate;
    } else {
      if (this.isEdit)
        this.selectedTemplate = this.editTemplate;
      else
        this.selectedTemplate = this.readTemplate;
    }
    this.cdr.detectChanges();
  }

}
