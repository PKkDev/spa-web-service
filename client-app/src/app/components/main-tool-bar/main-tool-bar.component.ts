import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-tool-bar',
  templateUrl: './main-tool-bar.component.html',
  styleUrls: ['./main-tool-bar.component.scss']
})
export class MainToolBarComponent implements OnInit, AfterViewInit {

  // state linck block
  @ViewChild('closedIcon') closedIcon: any
  @ViewChild('openIcon') openIcon: any
  public iconTemplate: any
  // flags
  public navMenuisVisible = false;
  public lincMenuVisible = false;
  // urls
  public apiUsrl = this.urlApi.replace('/api', '') + environment.swaggerUrlSegment;
  public linckToCode = environment.linckToCode;
  public linckToAuthor = environment.linckToAuthor;

  constructor(
    private dcs: ChangeDetectorRef,
    @Inject('BASE_APP_URL') public urlApi: string) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.iconTemplate = !this.navMenuisVisible ? this.closedIcon : this.openIcon;
    this.dcs.detectChanges();
  }

  public loadNavIcon() {
    return !this.navMenuisVisible ? this.closedIcon : this.openIcon;
  }

  public loadLincICon() {
    return !this.lincMenuVisible ? this.closedIcon : this.openIcon;
  }

}
