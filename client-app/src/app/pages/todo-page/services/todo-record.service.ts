import { HttpParams, HttpRequest } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import * as moment from 'moment';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TodoRecordInfo } from '../model/todo-record-info';
import { DateFIlterDto, GetToDoQuery, TodoRecordInfoDto } from '../model/todo-record-info-dto';
import { TypeViewPeriodRecord } from '../model/type-view-period-record';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TodoRecordService {
  // data
  private posts$: ReplaySubject<TodoRecordInfo[]> = new ReplaySubject<TodoRecordInfo[]>(1)
  // emit
  public cancelAddEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();
  // http
  private subs: Subscription | null | undefined
  // configs
  private typeView: TypeViewPeriodRecord = TypeViewPeriodRecord.Today;
  private dates: string[] = [];

  constructor(
    private authService: AuthService,
    private cts: CompackToastService,
    private apiService: ApiService,
    @Inject('BASE_APP_URL') public urlApi: string) {

    this.authService.getAuthStatus$()
      .subscribe((state: boolean) => {
        if (state)
          this.getToDoRecords(TypeViewPeriodRecord.Today, []);
        else{
          this.posts$.next([]);
        }
      });

    moment.locale('ru');
    if (this.authService.checkLogIn())
      this.getToDoRecords(TypeViewPeriodRecord.Today, [])

  }

  ngOnDestroy() {
    if (this.subs)
      this.subs.unsubscribe();
  }

  public emiteLoadRecords(typeViewPeriodRecord: TypeViewPeriodRecord, dates: string[]) {
    if (this.authService.checkLogIn())
      this.getToDoRecords(typeViewPeriodRecord, dates)
  }

  public emiteCancelAddPosts() {
    this.cancelAddEvent$.emit(true);
  }

  public exportRecords() {
    const httpBody: GetToDoQuery = {
      typeView: this.typeView,
      userId: this.authService.getUserId(),
      dateFilter: new DateFIlterDto(this.dates)
    }

    this.subs = this.apiService.postOptions<Blob>("todo/export-file", httpBody, {
      reportProgress: true,
      responseType: 'blob'
    })
      .subscribe(
        next => {
          saveAs(next, 'exports');
        }, error => {
          this.cts.emitNotife(TypeToast.Error, 'Произошла ошибка при экспорте');
        }
      )
  }

  public importRecords(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', this.urlApi + 'todo/import-file', formData, {
      reportProgress: true,
      params: new HttpParams()
        .append('IdUser', this.authService.getUserId().toString())
    });

    this.apiService.doRequest(req)
      .subscribe(next => { },
        error => {
          this.cts.emitNotife(TypeToast.Error, 'Произошла ошибка при ипорте');
        },
        () => {
          this.cts.emitNotife(TypeToast.Success, 'Успешный импорт записей');
          this.getToDoRecords(this.typeView, this.dates);
        });
  }

  public updateRecord(record: TodoRecordInfo) {
    const httpParams = new HttpParams()
      .append('IdUser', this.authService.getUserId().toString())
    this.subs = this.apiService.put("todo", record, httpParams)
      .subscribe(
        next => {
          this.cts.emitNotife(TypeToast.Success, 'Заметка изменена')
          this.getToDoRecords(this.typeView, this.dates);
        },
        error => this.cts.emitNotife(TypeToast.Error, 'ПИзменение заметки'))
  }

  public addNewRecord(record: TodoRecordInfo) {
    const httpParams = new HttpParams()
      .append('IdUser', this.authService.getUserId().toString())
    this.subs = this.apiService.post("todo", record, httpParams)
      .subscribe(
        next => {
          this.cts.emitNotife(TypeToast.Success, 'Заметка добавлена')
          this.getToDoRecords(this.typeView, this.dates);
        },
        error => this.cts.emitNotife(TypeToast.Error, 'Добавление заметки'))
  }

  public removeRecord(idRecord: number) {
    const httpParams = new HttpParams()
      .append('IdRecord', idRecord.toString())
      .append('IdUser', this.authService.getUserId().toString())
    this.subs = this.apiService.delete("todo", httpParams)
      .subscribe(
        next => {
          this.cts.emitNotife(TypeToast.Success, 'Заметка удалена')
          this.getToDoRecords(this.typeView, this.dates);
        },
        error => this.cts.emitNotife(TypeToast.Error, 'Удаление заметки'))
  }

  public getRecordsSubs(): Observable<TodoRecordInfo[]> {
    return this.posts$;
  }

  private getToDoRecords(typeView: TypeViewPeriodRecord, dates: string[]) {
    const httpBody: GetToDoQuery = {
      typeView,
      userId: this.authService.getUserId(),
      dateFilter: new DateFIlterDto(dates)
    }
    this.typeView = typeView;
    this.dates = dates;
    this.subs = this.apiService.post<TodoRecordInfoDto[]>("todo/list", httpBody)
      .subscribe(records => {
        if (records.length !== 0) {
          const recordsInfo: TodoRecordInfo[] = []
          for (const item of records) {
            recordsInfo.push({
              isNew: false,
              text: item.text,
              id: item.id,
              date: moment(item.dateCreate, 'YYYY-MM-DDTHH:mm:ss').format('D MMMM HH:mm')
            })
          }
          this.posts$.next(recordsInfo);
        } else {
          this.posts$.next([]);
        }
      },
        error => this.cts.emitNotife(TypeToast.Error, 'Произошла ошибка при получении списка заметок'))
  }

}
