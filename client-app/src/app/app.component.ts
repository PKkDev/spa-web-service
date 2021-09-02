import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompackBannerService, TypeMessage, TypePositionMessage } from 'ngx-compack';
import { environment } from 'src/environments/environment';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { AddBarServiceService } from './services/addBarService.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('subMenuLinc') subMenuLinc!: ElementRef

  // urls
  public apiUsrl = this.urlApi.replace('/api', '') + environment.swaggerUrlSegment;
  public linkToCode = environment.linckToCode;
  public linkToAuthor = environment.linckToAuthor;

  // dynamic bar from page
  public dynamicBar: any = null;


  constructor(
    private dcs: ChangeDetectorRef,
    private abs: AddBarServiceService,
    private bs: CompackBannerService,
    public authService: AuthService,
    public dialog: MatDialog,
    @Inject('BASE_APP_URL') public urlApi: string) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    // console.log(this.subMenuLinc.nativeElement.contains(event.target));
    if (this.subMenuLinc)
      if (!this.subMenuLinc.nativeElement.contains(event.target))
        this.lincSubMenuIsVisible = false;
  }

  ngOnInit() {

    this.bs.viewBanner(
      TypeMessage.Info, TypePositionMessage.TopRight,
      'Для авторизации: \n логин: admin \n пароль: complex', undefined, 15);

    this.abs.getEmiterChangeBar()
      .subscribe((next: any) => {
        this.dynamicBar = next;
        this.dcs.detectChanges();
      });

  }

  public lincSubMenuIsVisible = false;
  public showSubMenu() {
    this.lincSubMenuIsVisible = true;
  }

  public openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      height: 'auto',
      width: 'auto'
    });
  }

  public sideBarToogly = false;
  public changeStteSideBa() {
    this.sideBarToogly = !this.sideBarToogly;
  }

}
