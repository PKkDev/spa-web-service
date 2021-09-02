import { EventEmitter, Injectable } from '@angular/core';

export interface WindowResizeObj {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  private sizeChange$: EventEmitter<WindowResizeObj> = new EventEmitter<WindowResizeObj>();

  constructor() {
    window.onresize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newConfig: WindowResizeObj = {
        height: newHeight,
        width: newWidth
      };
      this.sizeChange$?.emit(newConfig);
    };
  }

  public getResizeSubs() {
    return this.sizeChange$;
  }

}
