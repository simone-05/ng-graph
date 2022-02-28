import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { CreateComponent } from './main/graph/create/create.component';
import { ListComponent } from './main/graph/list/list.component';
import { WorkspaceComponent } from './main/graph/workspace/workspace.component';

const routes: Routes = [
  {path: "graph", component: ContentComponent, children: [
    {path: "list", component: ListComponent},
    {path: "create", component: CreateComponent, data: {footer: false}},
    {path: "edit/:graph_id", component: WorkspaceComponent},
    {path: "", redirectTo: "list"}
  ]},
  {path: "", redirectTo: "graph"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
