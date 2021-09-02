import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Subscription } from 'rxjs';
import { TeamDetail } from '../../../domain/model/team-detail';
import { FootballApiService } from '../../../services/football-api.service';
import { FootballMergeService } from '../../../services/football-merge.service';

@Component({
  selector: 'app-team-detail-dialog',
  templateUrl: './team-detail-dialog.component.html',
  styleUrls: ['./team-detail-dialog.component.scss']
})
export class TeamDetailDialogComponent implements OnInit, OnDestroy {

  // http
  private subsGet: Subscription | null = null;
  public dataIsLoading = false;
  // data
  public teamDetail: TeamDetail | null = null;

  constructor(
    private footballMergeService: FootballMergeService,
    private footballApiService: FootballApiService,
    private cts: CompackToastService,
    public dialogRef: MatDialogRef<TeamDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string }) { }

  ngOnInit() {
    this.subsGet = this.footballApiService.getTeamDetail(this.data.id)
      .subscribe(
        data =>
          this.teamDetail = this.footballMergeService.mergeTeamDetail(data),
        error => {
          this.cts.emitNotife(TypeToast.Error, 'Детали по команды');
          this.dataIsLoading = false;
          this.acceptError();
        },
        () => this.dataIsLoading = true
      )
  }

  ngOnDestroy() {
    this.acceptError();
  }

  public cLoseDialog() {
    this.dialogRef.close(false);
  }

  private acceptError() {
    if (this.subsGet) {
      this.subsGet.unsubscribe();
      this.subsGet = null;
    }
  }

}
