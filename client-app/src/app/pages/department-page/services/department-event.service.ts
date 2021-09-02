import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentEventService {

  private clickInnerDepartmentEvent$: EventEmitter<EventTarget | null> = new EventEmitter<EventTarget | null>();

  private updateChildrenEvent$: EventEmitter<number | null> = new EventEmitter<number | null>();

  private loadWorkerEvent$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public setNewclickInnerDepartmentEvent(newEvent: EventTarget) {
    this.clickInnerDepartmentEvent$.next(newEvent);
  }

  public getNewclickInnerDepartmentEventObs() {
    return this.clickInnerDepartmentEvent$;
  }

  public emiteUpdateChildrenEvent(id: number | null) {
    this.updateChildrenEvent$.next(id);
  }

  public getUpdateChildrenEventObs() {
    return this.updateChildrenEvent$;
  }

  public emiteLoadWorkerEvent() {
    this.loadWorkerEvent$.next(true);
  }

  public getLoadWorkerEventObs() {
    return this.loadWorkerEvent$;
  }

}
