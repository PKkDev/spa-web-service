import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// routing
import { TodoPageRoutingModule } from './todo-page-routing.module';
// components
import { TodoPageComponent } from './todo-page.component';
import { TodoRecordViewComponent } from './components/todo-record-view/todo-record-view.component';
import { TodoRecordInfoPanelComponent } from './components/todo-record-info-panel/todo-record-info-panel.component';
// mat
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

// compack
import { CompackDatepickerModule } from 'ngx-compack';
// service
import { TodoRecordService } from './services/todo-record.service';

@NgModule({
  declarations: [
    TodoRecordInfoPanelComponent,
    TodoRecordViewComponent,
    TodoPageComponent
  ],
  imports: [
    CompackDatepickerModule,
    FormsModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    TodoPageRoutingModule
  ],
  providers: [TodoRecordService]
})
export class TodoPageModule { }
