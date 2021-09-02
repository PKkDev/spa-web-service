import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// routing
import { PostPageRoutingModule } from './post-page-routing.module';
// components
import { PostPageComponent } from './post-page.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { PostViewComponent } from './components/post-view/post-view.component';
// mat
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// compack
import { CompackDatepickerModule } from 'ngx-compack';
// services
import { PostService } from './services/post.service';

@NgModule({
  declarations: [
    InfoPanelComponent,
    PostViewComponent,
    PostPageComponent
  ],
  imports: [
    CompackDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CommonModule,
    PostPageRoutingModule
  ],
  providers: [
    PostService
  ]
})
export class PostPageModule { }
