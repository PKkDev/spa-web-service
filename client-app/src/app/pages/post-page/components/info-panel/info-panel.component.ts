import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompackToastService, TypeToast } from 'ngx-compack';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit, OnDestroy {
  // data
  public countPost = 0;
  // http
  private subs: Subscription | null | undefined

  constructor(
    private apiService: ApiService,
    private cts: CompackToastService,
    public postService: PostService) { }

  ngOnInit() {
    this.postService.getPostSubs()
      .subscribe(() => this.getCountPost());
  }

  ngOnDestroy() {
    if (this.subs)
      this.subs.unsubscribe();
  }

  private getCountPost() {
    this.subs = this.apiService.get<number>("post/count")
      .subscribe(next => this.countPost = next,
        error => this.cts.emitNotife(TypeToast.Error, 'Количество постов', 'Произошла ошибка при получении количества постов'))
  }

}
