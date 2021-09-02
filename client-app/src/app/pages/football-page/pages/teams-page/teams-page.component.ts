import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Observable, Subscription } from 'rxjs';
import { TeamsDto } from '../../domain/dto/teams-dto';
import { Teams } from '../../domain/model/teams';
import { TypeStartView } from '../../domain/model/type-start-view';
import { FootFilterSaverService } from '../../services/foot-filter-saver.service';
import { FootballApiService } from '../../services/football-api.service';
import { FootballMergeService } from '../../services/football-merge.service';
import { TeamDetailDialogComponent } from './team-detail-dialog/team-detail-dialog.component';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent implements OnInit, OnDestroy {

  // http
  private subsGet: Subscription | null = null;
  public dataIsLoading = false;
  // types
  public typeStartView: TypeStartView = TypeStartView.Teams;
  // data
  private teams: Teams[] = [];
  public viewTeams: Teams[] = [];
  // filters
  private timeOutFilter: any
  public textFilter = ''

  constructor(
    private footballMergeService: FootballMergeService,
    private footballApiService: FootballApiService,
    private cts: CompackToastService,
    private activateRoute: ActivatedRoute,
    private route: Router,
    public dialog: MatDialog,
    private filterSaver: FootFilterSaverService) { }

  ngOnInit() {
    const savedFilter = this.filterSaver.getFilterValue('team_search');
    if (savedFilter)
      this.textFilter = savedFilter;
    this.activateRoute.params
      .subscribe((params: Params) => {
        const idParam = params['id'];
        if (+idParam)
          this.loadTeamsData(+idParam)
        else
          this.cts.emitNotife(TypeToast.Error, 'Недопустимый id команды');
      });
  }

  ngOnDestroy() {
    this.acceptError();
  }

  private loadTeamsData(id: number) {
    let obs: Observable<TeamsDto>;
    obs = this.footballApiService.getCompetitionTeams(id);
    this.subsGet = obs.subscribe(
      data => {
        this.teams = this.footballMergeService.mergeTeams(data);
        this.setTextFilter(false);
      },
      error => {
        this.cts.emitNotife(TypeToast.Error, 'Список команд');
        this.dataIsLoading = false;
        this.acceptError();
      },
      () => this.dataIsLoading = true
    )
  }

  public openDetailDialog(id: number, name: string) {
    this.dialog.open(TeamDetailDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { id, name }
    });
  }

  public navigateToTeamMatches(id: number) {
    this.route.navigate(['/foot/matches', this.typeStartView, id]);
  }

  public setTextFilter(withTimer: boolean) {
    if (withTimer) {
      if (this.timeOutFilter)
        clearTimeout(this.timeOutFilter);
      this.timeOutFilter = setTimeout(() => {
        this.filtered()
      }, 1000 * 1);
    } else {
      this.filtered();
    }
  }

  private filtered() {
    this.filterSaver.saveFilterValue('team_search', this.textFilter)
    this.viewTeams = this.teams.filter(x =>
      x.name.trim().toLowerCase().includes(this.textFilter.trim().toLowerCase()))
  }

  private acceptError() {
    if (this.subsGet) {
      this.subsGet.unsubscribe();
      this.subsGet = null;
    }
  }

}
