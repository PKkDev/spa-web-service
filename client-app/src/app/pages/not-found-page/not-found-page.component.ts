import { Component, OnInit } from '@angular/core';
import { AddBarServiceService } from 'src/app/services/addBarService.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

  constructor(
    private abs: AddBarServiceService) { }

  ngOnInit() {
    this.abs.changeBar(null);
  }

}
