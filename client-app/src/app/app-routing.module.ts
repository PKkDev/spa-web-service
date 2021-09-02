import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo',
    pathMatch: 'full'
  }, {
    path: 'not-found',
    component: NotFoundPageComponent
  }, {
    path: 'swagger',
    redirectTo: 'swagger'
  }, {
    path: 'post',
    loadChildren: () => import('./pages/post-page/post-page.module').then(m => m.PostPageModule)
  }, {
    path: 'todo',
    loadChildren: () => import('./pages/todo-page/todo-page.module').then(m => m.TodoPageModule)
  }, {
    path: 'department',
    loadChildren: () => import('./pages/department-page/department-page.module').then(m => m.DepartmentPageModule)
  }, {
    path: 'foot',
    loadChildren: () => import('./pages/football-page/football-page.module').then(m => m.FootballPageModule)
  }, {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
