import { HttpParams, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { DepartmentDto } from '../model/dto/department-dto';
import { TypeWorkerFile } from '../model/dto/type-worker-file';
import { Department } from '../model/entity/department';
import { WorkerService } from './worker.service';

@Injectable()
export class DepartmentService {

  constructor(
    private workerService: WorkerService,
    private cts: CompackToastService,
    private apiService: ApiService,
    @Inject('BASE_APP_URL') public urlApi: string) { }

  public LoadGlobalDepartment(): Observable<Department[]> {
    const url = 'department/children-dep'
    return this.apiService.get<DepartmentDto[]>(url)
      .pipe(
        map((deps: DepartmentDto[]) => {

          const newDep: Department[] = [];

          for (const dep of deps) {
            newDep.push({
              createdAt: dep.createdAt,
              id: dep.id,
              forAddNew: false,
              name: dep.name,
              parentId: -1,
              departments: []
            })
          }

          return newDep;
        }),
        catchError((err) => {
          this.cts.emitNotife(TypeToast.Error, 'Департаменты', 'Произошла ошибка при получении департаментов');
          throw err;
        }));
  }

  public LoadChildrenDepartment(idDepartment: number): Observable<Department[]> {
    const url = 'department/children-dep'
    const param = new HttpParams()
      .append('parantId', idDepartment.toString());
    return this.apiService.get<DepartmentDto[]>(url, param)
      .pipe(
        map((deps: DepartmentDto[]) => {

          const newDep: Department[] = [];

          for (const dep of deps) {
            newDep.push({
              createdAt: dep.createdAt,
              id: dep.id,
              forAddNew: false,
              name: dep.name,
              parentId: -1,
              departments: []
            })
          }


          return newDep;
        }),
        catchError((err) => {
          this.cts.emitNotife(TypeToast.Error, 'Департаменты', 'Произошла ошибка при получении департаментов');
          throw err;
        }));
  }

  public UpdateDepartment(newName: string, id: number): Observable<boolean> {
    const url = 'department'
    const httpBody = {
      departmentId: id,
      departmentName: newName
    };
    return this.apiService.put<boolean>(url, httpBody)
      .pipe(catchError((err) => {
        this.cts.emitNotife(TypeToast.Error, 'Ошибка при изменении');
        throw err;
      }))
  }

  public AddDepartment(newName: string, id: number | null): Observable<boolean> {
    const url = 'department'
    const httpBody = {
      departmentId: id,
      departmentName: newName
    };
    return this.apiService.post<boolean>(url, httpBody)
      .pipe(catchError((err) => {
        this.cts.emitNotife(TypeToast.Error, 'Ошибка при добавлении');
        throw err;
      }))
  }

  public RemoveDepartment(idDepartment: number): Observable<boolean> {
    const url = 'department'
    const param = new HttpParams()
      .append('departmentId', idDepartment.toString());
    return this.apiService.delete<boolean>(url, param)
      .pipe(catchError((err) => {
        this.cts.emitNotife(TypeToast.Error, 'Ошибка при удалении');
        throw err;
      }))
  }

  public exportDepartment(typeFile: TypeWorkerFile) {
    const id = this.workerService.getViewDepartmentId();
    const httpBody = {
      typeFile: typeFile,
      departmentId: id
    }
    return this.apiService.postOptions<Blob>("department/export-file", httpBody, {
      reportProgress: true,
      responseType: 'blob'
    })
  }

  public importDepartments(file: File, typeFile: TypeWorkerFile) {
    const id = this.workerService.getViewDepartmentId()
    if (id) {
      const formData = new FormData();
      formData.append('file', file, file.name);

      const req = new HttpRequest('POST', this.urlApi + 'department/import-file', formData, {
        reportProgress: true,
        params: new HttpParams()
          .append('departmentId', id.toString())
          .append('typeFile', typeFile.toString())
      });

      this.apiService.doRequest(req)
        .subscribe(next => { },
          error => {
            this.cts.emitNotife(TypeToast.Error, 'Импорт записей', 'Произошла ошибка');
          },
          () => {
            this.cts.emitNotife(TypeToast.Success, 'Импорт записей', 'Успешно');
            this.LoadGlobalDepartment();
          });
    }
  }

}
