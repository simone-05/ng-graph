import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { ListComponent } from './list/list.component';
import { SidebarEditComponent } from './edit/sidebar-edit/sidebar-edit.component';
import { ViewEditComponent } from './edit/view-edit/view-edit.component';

@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    EditComponent,
    SidebarEditComponent,
    ViewEditComponent,
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
    EditComponent
  ]
})
export class GraphModule { }
