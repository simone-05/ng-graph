import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ListComponent } from './list/list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './create/sidebar/sidebar.component';
import { CreationViewComponent } from './create/creation-view/creation-view.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { SidebarEditComponent } from './workspace/sidebar-edit/sidebar-edit.component';
import { GraphViewEditComponent } from './workspace/graph-view-edit/graph-view-edit.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    WorkspaceComponent,
    SidebarComponent,
    CreationViewComponent,
    SidebarEditComponent,
    GraphViewEditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxGraphModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [
    CreateComponent,
    ListComponent,
    WorkspaceComponent
  ]
})
export class GraphModule { }
