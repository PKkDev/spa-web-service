import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AddBarServiceService } from 'src/app/services/addBarService.service';

@Component({
  selector: 'app-department-page',
  templateUrl: './department-page.component.html',
  styleUrls: ['./department-page.component.scss']
})
export class DepartmentPageComponent implements OnInit {

  constructor(
    private abs: AddBarServiceService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('department client app');

    // this.abs.changeBar(DepartmentInfoPanelComponent);
  }

}
