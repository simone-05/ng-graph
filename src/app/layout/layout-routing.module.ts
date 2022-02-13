import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';

const routes: Routes = [
  {path: "graph", children: [
    {path: "list", component: ContentComponent},
    {path: "create"},
    {path: "edit/:graph_id"},
    {path: "", redirectTo: "list"}
  ]},
  {path: "", redirectTo: "graph"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
