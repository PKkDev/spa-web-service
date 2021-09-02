import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AddBarServiceService } from 'src/app/services/addBarService.service';
import { AuthService } from 'src/app/services/auth.service';
import { TodoRecordInfo } from './model/todo-record-info';
import { TypeViewPeriodRecord } from './model/type-view-period-record';
import { TodoRecordService } from './services/todo-record.service';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss']
})
export class TodoPageComponent implements OnInit {

  // flags
  public recordIsLoading = false;
  // data
  private listRecords: TodoRecordInfo[] = [];
  public listViewRecord: TodoRecordInfo[] = [];
  public textFilter = '';
  public typeViewPeriodRecord: TypeViewPeriodRecord = TypeViewPeriodRecord.Today;
  private dates: string[] = []
  // timeOut
  private timeOutFilter: any
  // picker
  public formatOutPut = 'YYYY-MM-DD HH:mm:ss';

  constructor(
    public authService: AuthService,
    private recordService: TodoRecordService,
    private abs: AddBarServiceService,
    private titleService: Title) {

    this.authService.getAuthStatus$()
      .subscribe((state: boolean) => {
        if (!state) {
          this.textFilter = '';
          this.dates = [];
          this.typeViewPeriodRecord = TypeViewPeriodRecord.Today;;
        }
      });

  }

  ngOnInit() {
    this.titleService.setTitle('todo client app');

    // this.abs.changeBar(TodoRecordInfoPanelComponent);

    this.recordService.getRecordsSubs()
      .subscribe((next: TodoRecordInfo[]) => {
        this.recordIsLoading = false;
        this.listRecords = next;
        this.setTextFilter(false);
      })

    this.recordService.cancelAddEvent$
      .subscribe(() => {
        this.listRecords.shift();
        this.setTextFilter(false);
      });

    this.loadData();

  }

  public changeTypeView(newType: TypeViewPeriodRecord) {
    this.typeViewPeriodRecord = newType;
    this.dates = [];
    this.loadData();
  }

  public loadData() {
    this.recordIsLoading = true;
    this.recordService.emiteLoadRecords(this.typeViewPeriodRecord, this.dates);
  }

  public selectLastDateEvent(data: string[]) {
    this.typeViewPeriodRecord = TypeViewPeriodRecord.Calendare;
    this.dates = data;
    this.loadData();
  }

  public exportRecords() {
    this.recordService.exportRecords();
  }

  public selectedFile: File | null = null;
  onFileSelected(input: HTMLInputElement) {
    if (input.files) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        };
        reader.readAsDataURL(file);
        this.selectedFile = file;
        this.importRecords();
      }
    }
  }

  importRecords() {
    if (this.selectedFile)
      this.recordService.importRecords(this.selectedFile);
  }


  public setTextFilter(withTimer: boolean) {
    if (withTimer) {
      if (this.timeOutFilter)
        clearTimeout(this.timeOutFilter);
      this.timeOutFilter = setTimeout(() => {
        this.filtered()
      }, 1000 * 1);
    } else {
      this.filtered();
    }
  }

  public emiteAddRecord() {
    if (this.listRecords.find(x => x.isNew) == null) {
      this.listRecords.unshift({ date: '', id: -1, text: '', isNew: true });
      this.setTextFilter(false);
    }
  }

  private filtered() {
    this.listViewRecord = this.listRecords.filter(x =>
      x.text.trim().toLowerCase().includes(this.textFilter.trim().toLowerCase()))
  }

}
