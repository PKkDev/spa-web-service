import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FootFilterSaverService {

  constructor() { }

  /**
   * save value to local storage by key
   * @param key value key
   * @param value value
   */
  public saveFilterValue(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  /**
   * get value rom local storage by key
   * @param key value key
   * @returns value
   */
  public getFilterValue(key: string): string | null {
    return sessionStorage.getItem(key)
  }

}
