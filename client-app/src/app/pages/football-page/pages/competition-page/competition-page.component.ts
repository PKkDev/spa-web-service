import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Subscription } from 'rxjs';
import { Competition } from '../../domain/model/competition';
import { TypeStartView } from '../../domain/model/type-start-view';
import { FootFilterSaverService } from '../../services/foot-filter-saver.service';
import { FootballApiService } from '../../services/football-api.service';
import { FootballMergeService } from '../../services/football-merge.service';

@Component({
  selector: 'app-competition-page',
  templateUrl: './competition-page.component.html',
  styleUrls: ['./competition-page.component.scss']
})
export class CompetitionPageComponent implements OnInit, OnDestroy {

  // http
  private subsGet: Subscription | null = null;
  public dataIsLoading = false;
  // types
  public typeStartView: TypeStartView = TypeStartView.Competition;
  // data
  private competition: Competition[] = [];
  public viewCompetition: Competition[] = [];
  // filters
  private timeOutFilter: any
  public textFilter = '';

  constructor(
    private footballMergeService: FootballMergeService,
    private footballApiService: FootballApiService,
    private cts: CompackToastService,
    private filterSaver: FootFilterSaverService) { }

  ngOnInit() {
    const savedFilter = this.filterSaver.getFilterValue('competition_search');
    if (savedFilter)
      this.textFilter = savedFilter;
    this.subsGet = this.footballApiService.getCompetitions()
      .subscribe(
        data => {
          this.competition = this.footballMergeService.mergeCompetitions(data);
          this.setTextFilter(false);
        },
        error => {
          this.cts.emitNotife(TypeToast.Error, 'Список соревнований');
          this.dataIsLoading = false;
          this.acceptError();
        },
        () => this.dataIsLoading = true
      )
  }

  ngOnDestroy() {
    this.acceptError();
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
    this.filterSaver.saveFilterValue('competition_search', this.textFilter)
    this.viewCompetition = this.competition.filter(x =>
      x.competitionName.trim().toLowerCase().includes(this.textFilter.trim().toLowerCase()))
  }

  private acceptError() {
    if (this.subsGet) {
      this.subsGet.unsubscribe();
      this.subsGet = null;
    }
  }

}
