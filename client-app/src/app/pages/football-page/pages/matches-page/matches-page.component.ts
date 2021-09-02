import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Observable, Subscription } from 'rxjs';
import { MatchesDto } from '../../domain/dto/matches-dto';
import { Matches } from '../../domain/model/matches';
import { TypeMatchView } from '../../domain/model/type-matches-view';
import { TypeStartView } from '../../domain/model/type-start-view';
import { FootFilterSaverService } from '../../services/foot-filter-saver.service';
import { FootballApiService } from '../../services/football-api.service';
import { FootballMergeService } from '../../services/football-merge.service';
import { TeamDetailDialogComponent } from '../teams-page/team-detail-dialog/team-detail-dialog.component';

@Component({
  selector: 'app-matches-page',
  templateUrl: './matches-page.component.html',
  styleUrls: ['./matches-page.component.scss']
})
export class MatchesPageComponent implements OnInit, OnDestroy {

  // http
  private subsGet: Subscription | null = null;
  public dataIsLoading = false;
  // data
  public matches: Matches[] = [];
  public viewMatches: Matches[] = [];
  // picker
  public formatOutPut = 'YYYY-MM-DD HH:mm:ss';
  private selectedDateFilter: string[] = [];
  // filters
  public typeMatchesView: TypeMatchView[] = [
    { name: 'будущие', type: 'SCHEDULED' },
    { name: 'прошедшие', type: 'FINISHED' },
    { name: 'все', type: '' }
  ];
  public selecteTypeMatchesView = '';

  constructor(
    private footballMergeService: FootballMergeService,
    private footballApiService: FootballApiService,
    private cts: CompackToastService,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    private filterSaver: FootFilterSaverService) { }

  ngOnInit() {
    const savedTypeFilter = this.filterSaver.getFilterValue('type_matches_view');
    if (savedTypeFilter)
      if (this.typeMatchesView.findIndex(x => x.type == savedTypeFilter) != -1)
        this.selecteTypeMatchesView = savedTypeFilter;
    const savedDateFilter = this.filterSaver.getFilterValue('selected_date_filter');
    if (savedDateFilter) {
      const tempArr = JSON.parse(savedDateFilter);
      if (tempArr.length == 2)
        if (moment(tempArr[0]).isValid() && moment(tempArr[1]).isValid())
          this.selectedDateFilter = tempArr;
    }
    this.activateRoute.params
      .subscribe((params: Params) => {
        const idParam = params['id'];
        const typeStartParam = params['type'];
        if (+idParam && typeStartParam)
          this.loadMatchesData(+idParam, +typeStartParam)
        else
          this.cts.emitNotife(TypeToast.Error, 'Недопустимые параметры');
      });
  }

  ngOnDestroy() {
    this.acceptError();
  }

  private loadMatchesData(id: number, typeStartViewInd: number) {
    const typeStartView = typeStartViewInd as TypeStartView;
    let obs: Observable<MatchesDto>;
    switch (typeStartView) {
      case TypeStartView.Competition: {
        obs = this.footballApiService.getCompetitionMatches(id);
        break;
      }
      case TypeStartView.Teams: {
        obs = this.footballApiService.getTeamMatches(id);
        break;
      }
    }
    this.subsGet = obs.subscribe(
      data => {
        this.matches = this.footballMergeService.mergeMatches(data);
        this.viewMatches = this.matches;
        this.setFilter(this.selectedDateFilter, this.selecteTypeMatchesView);
      },
      error => {
        this.cts.emitNotife(TypeToast.Error, 'Список матчей');
        this.dataIsLoading = false;
        this.acceptError();
      },
      () => this.dataIsLoading = true
    )
  }

  public openTeamDetail(id: number, name: string) {
    this.dialog.open(TeamDetailDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { id, name }
    });
  }

  public filterDateEvent(data: string[]) {
    if (data[0] == 'reset') {
      this.filterSaver.saveFilterValue('selected_date_filter', JSON.stringify([]))
      this.selectedDateFilter = [];
    }
    else {
      this.filterSaver.saveFilterValue('selected_date_filter', JSON.stringify(data))
      this.selectedDateFilter = data;
    }
    this.setFilter(this.selectedDateFilter, this.selecteTypeMatchesView);
  }

  public changeTypeView() {
    this.filterSaver.saveFilterValue('type_matches_view', this.selecteTypeMatchesView);
    this.setFilter(this.selectedDateFilter, this.selecteTypeMatchesView);
  }

  public setFilter(data: string[], type: string) {
    let tempData = this.matches;

    if (data.length != 0) {
      const startPeriod = moment(data[0], this.formatOutPut);
      const endPeriod = moment(data[1], this.formatOutPut);
      tempData = this.matches.filter(x =>
        moment(x.utcDate, 'DD.MM.YYYY HH:mm').isBetween(startPeriod, endPeriod));
    }
    this.viewMatches = tempData.filter(x =>
      x.status.trim().toLowerCase().includes(this.selecteTypeMatchesView.trim().toLowerCase()));
  }

  private acceptError() {
    if (this.subsGet != null && this.subsGet != undefined) {
      this.subsGet.unsubscribe();
      this.subsGet = null;
    }
  }

}
