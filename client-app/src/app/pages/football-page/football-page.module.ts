import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// routing
import { FootballPageRoutingModule } from './football-page-routing.module';
// mat
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// compack
import { CompackDatepickerModule } from 'ngx-compack';
// components
import { FootballPageComponent } from './football-page.component';
// pages
import { CompetitionPageComponent } from './pages/competition-page/competition-page.component';
import { TeamsPageComponent } from './pages/teams-page/teams-page.component';
import { MatchesPageComponent } from './pages/matches-page/matches-page.component';
// dialog
import { TeamDetailDialogComponent } from './pages/teams-page/team-detail-dialog/team-detail-dialog.component';


@NgModule({
  declarations: [
    CompetitionPageComponent,
    FootballPageComponent,
    TeamsPageComponent,
    MatchesPageComponent,
    TeamDetailDialogComponent
  ],
  imports: [
    MatSelectModule,
    CompackDatepickerModule,
    FormsModule,
    CommonModule,
    FootballPageRoutingModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FootballPageModule { }
