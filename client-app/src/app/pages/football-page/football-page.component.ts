import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AddBarServiceService } from 'src/app/services/addBarService.service';

@Component({
  selector: 'app-football-page',
  templateUrl: './football-page.component.html',
  styleUrls: ['./football-page.component.scss'],
})
export class FootballPageComponent implements OnInit {

  constructor(
    private abs: AddBarServiceService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('football client app');
    this.abs.changeBar(null);
  }
}
