import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddBarServiceService {

  private changeBarEvent$: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public getEmiterChangeBar() {
    return this.changeBarEvent$;
  }

  public changeBar(newBar: any) {
    this.changeBarEvent$.next(newBar);
  }

}
