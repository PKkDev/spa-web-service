import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// routing
import { DepartmentPageRoutingModule } from './department-page-routing.module';
// mat
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
// components
import { DepartmentPageComponent } from './department-page.component';
import { DepartmentInfoPanelComponent } from './components/department-info-panel/department-info-panel.component';
import { DepartmentViewContainerComponent } from './components/department-view-container/department-view-container.component';
import { WorkerViewComponent } from './components/worker-view/worker-view.component';
import { DepartmentViewComponent } from './components/department-view/department-view.component';
import { WorkerModalEditorComponent } from './components/worker-modal-editor/worker-modal-editor.component';
// services
import { WorkerService } from './services/worker.service';
import { DepartmentService } from './services/department.service';

@NgModule({
  declarations: [
    WorkerModalEditorComponent,
    DepartmentPageComponent,
    DepartmentInfoPanelComponent,
    WorkerViewComponent,
    DepartmentViewContainerComponent,
    DepartmentViewComponent
  ],
  imports: [
    MatRadioModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    DepartmentPageRoutingModule
  ],
  providers: [
    WorkerService,
    DepartmentService
  ]
})
export class DepartmentPageModule { }
