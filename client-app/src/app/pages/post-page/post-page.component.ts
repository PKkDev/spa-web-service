import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { AddBarServiceService } from 'src/app/services/addBarService.service';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from './model/post';
import { PostService } from './services/post.service';

export class ColPost {
  constructor(public col: Post[]) { };
}

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  //data
  private listPost: Post[] = [];
  public listViewPost: Post[] = [];
  public textFilter = '';
  // timeOut
  private timeOutFilter: any
  // picker
  public formatOutPut = 'YYYY-MM-DD HH:mm:ss';
  // flags
  public postsIsLoading = true;

  constructor(
    public authService: AuthService,
    private ps: PostService,
    private abs: AddBarServiceService,
    private titleService: Title) {
  }

  ngOnInit() {

    this.titleService.setTitle('post client app');

    // this.abs.changeBar(InfoPanelComponent);

    this.ps.getPostSubs()
      .subscribe(next => {
        this.postsIsLoading = false;
        this.listPost = next;
        this.setTextFilter(false);
      })

    this.ps.getCancelAddPostEventSubs()
      .subscribe(() => {
        this.listPost.shift();
        this.setTextFilter(false);
      });
  }

  ngOnDestroy() { }

  public listColPost: ColPost[] = [];

  private constructGrid() {
    this.listColPost = [];
    let countColumn = 2;

    for (let i = 0; i < countColumn; i++)
      this.listColPost.push(new ColPost([]));

    let columnCounter = 0;
    for (let i = 0; i < this.listViewPost.length; i++) {
      this.listColPost[columnCounter].col.push(this.listViewPost[i]);
      columnCounter = columnCounter == countColumn - 1 ? 0 : columnCounter + 1;
    }
  }


  public emiteAddPost() {
    if (this.listPost.find(x => x.isNew) == null) {
      this.listPost.unshift({ author: '', date: null, displayDate: '', edited: false, id: -1, text: '', isNew: true, fileDescDto: [] });
      this.setTextFilter(false);
    }
  }

  public selectLastDateEvent(data: string[]) {
    this.setTextFilter(false);
    if (data[0] != 'reset')
      this.listViewPost = this.listViewPost.filter(x =>
        moment(x.date, 'YYYY-MM-DDTHH:mm:ss').isBetween(moment(data[0], this.formatOutPut), moment(data[1], this.formatOutPut))
        || x.isNew);
    this.constructGrid();
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

    // временная сортировка TODO
    this.listViewPost.sort((a, b) => {
      if (a.date && b.date) {
        if (a.date > b.date)
          return -1
        if (a.date < b.date)
          return 1
      }
      return 0;
    });
  }

  private filtered() {
    this.listViewPost = this.listPost.filter(x =>
      x.author.trim().toLowerCase().includes(this.textFilter.trim().toLowerCase())
      || x.text.trim().toLowerCase().includes(this.textFilter.trim().toLowerCase())
      || x.isNew);
    this.constructGrid();
  }

}
