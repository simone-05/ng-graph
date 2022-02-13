import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: "", redirectTo: "app", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "app", loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)},
  {path: "not-found", component: NotFoundComponent},
  {path: "**", redirectTo: "not-found"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*, {enableTracing: true}*/)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
