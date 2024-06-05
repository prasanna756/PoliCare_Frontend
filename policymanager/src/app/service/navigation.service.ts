import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private previousUrl:string='';

  constructor(private platformlocation: PlatformLocation) {}
  disableBackButton() {
    history.pushState(null,'',location.href);
    this.platformlocation.onPopState(() => {
      history.pushState(null,'',location.href);
    });
  }
}