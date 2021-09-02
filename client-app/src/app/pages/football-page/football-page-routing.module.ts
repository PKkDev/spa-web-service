import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FootballPageComponent } from './football-page.component';
import { MatchesPageComponent } from './pages/matches-page/matches-page.component';
import { TeamsPageComponent } from './pages/teams-page/teams-page.component';

const routes: Routes = [
  {
    path: '',
    component: FootballPageComponent
  },
  // {
  //   path: 'competition',
  //   component: FootballPageComponent
  // },
  {
    path: 'teams',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'teams/:id',
    component: TeamsPageComponent
  },
  {
    path: 'matches/:type/:id',
    component: MatchesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootballPageRoutingModule { }
