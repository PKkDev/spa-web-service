// import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { CompackToastService, TypeToast } from "ngx-compack";
// import { of } from "rxjs";
// import { tap } from "rxjs/operators";

// @Injectable()
// export class AcceptErrorInterceptor implements HttpInterceptor {

//     constructor(private cts: CompackToastService) { }

//     intercept(req: HttpRequest<any>, next: HttpHandler) {
//         return next.handle(req)
//             .pipe(
//                 tap(
//                     () => { },
//                     error => {
//                         if (error instanceof HttpErrorResponse)
//                             if (error.status == 403) {
//                                 this.cts.emitNotife(TypeToast.Error, 'Недостаточно прав');
//                                 return of(null);
//                             }
//                         return error;
//                     }
//                 )
//             );
//     }

// }
