import { WorkspaceComponent } from './workspace/workspace.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './create/sidebar/sidebar.component';
import { CreationViewComponent } from './create/creation-view/creation-view.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    WorkspaceComponent,
    SidebarComponent,
    CreationViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxGraphModule
  ],
  exports: [
    CreateComponent,
    ListComponent,
    WorkspaceComponent
  ]
})
export class GraphModule { }
