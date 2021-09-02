import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UploadFileService {

  constructor(
    @Inject('BASE_APP_URL') private baseAppUrl: string,
    private httpClient: HttpClient) { }

  /**
  * Constructs a `POST` request that interprets the body as a
  * JSON object and returns the response body as a JSON object.
  *
  * @param url The endpoint URL.
  * @param body The content to replace with.
  * @param options HTTP options
  *
  * @return An `Observable` of the response, with the response body as a JSON object.
  */
  public uploadFile(url: string, file: File, params?: HttpParams): Observable<any> {
    // const formData = new FormData();
    // formData.append("file", file, file.name);
    // return this.httpClient.post(this.baseAppUrl + url, formData, {reportProgress: true, params });
    const formData = new FormData();
    formData.append('file', file, file.name);
    const req = new HttpRequest('POST', this.baseAppUrl + url, formData, {
      reportProgress: true,
      params
    });
    return this.httpClient.request(req);
  }

  public blobToFile(blob: Blob, fileName: string): File {
    var b: any = blob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>blob;
  }

}