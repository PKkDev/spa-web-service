import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public title = 'Angular App';

  constructor(
    router: Router) {
    router.events.subscribe(next => {
      if (next instanceof NavigationEnd) {
        const url = next.url;
        switch (url) {
          case '/post': {
            this.title = 'Post Client App';
            break;
          }
          case '/todo': {
            this.title = 'ToDo Client App';
            break;
          }
          case '/department': {
            this.title = 'Department Client App';
            break;
          }
          default: {
            this.title = 'Client App';
            break;
          }
        }
      }
    }
    )
  }

  ngOnInit() {
  }

}
