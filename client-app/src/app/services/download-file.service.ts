import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { distinctUntilChanged, map, scan } from 'rxjs/operators';

export interface Download {
  content: Blob | null;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  public loadedFile: BehaviorSubject<Blob | null> = new BehaviorSubject<Blob | null>(null);

  constructor(
    @Inject('BASE_APP_URL') private baseAppUrl: string,
    private httpClient: HttpClient) { }

  public dowmloadFilePost(url: string, httpBody: any, params?: HttpParams): Observable<Blob> {

    return this.httpClient.post(this.baseAppUrl + url, httpBody, {
      reportProgress: true,
      responseType: 'blob',
      params: params
    }).pipe(
      map(value => {
        if (value != null)
          this.loadedFile.next(value);
        return value;
      })
    );
  }

  public dowmloadFileGet(url: string, params?: HttpParams): Observable<Blob> {
    return this.httpClient.get(this.baseAppUrl + url, {
      reportProgress: true,
      responseType: 'blob',
      params: params
    }).pipe(
      map(value => {
        if (value != null)
          this.loadedFile.next(value);
        return value;
      })
    );
  }

  public getLastFile() {
    return this.loadedFile.getValue();
  }
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}



function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );

}

export function downloadHttp(saver: (b: Blob | null) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan(
        (down: Download, event): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : down.progress,
              state: 'IN_PROGRESS',
              content: null
            };
          }

          if (isHttpResponse(event)) {
            if (saver) {
              saver(event.body);
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            };
          }
          return down;
        },
        { state: 'PENDING', progress: 0, content: null }
      ),
      distinctUntilChanged((a, b) => a.state === b.state
        && a.progress === b.progress
        && a.content === b.content
      )
    );
}