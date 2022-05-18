import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
<<<<<<< HEAD
import { ListComponent } from './list/list.component';
import { SidebarEditComponent } from './edit/sidebar-edit/sidebar-edit.component';
import { ViewEditComponent } from './edit/view-edit/view-edit.component';
=======
import { InjectNodeComponent } from './flow-nodes/inject-node/inject-node.component';
>>>>>>> 69b5db5 (creo cartella per componenti flow-nodes)

@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    EditComponent,
    SidebarEditComponent,
<<<<<<< HEAD
    ViewEditComponent,
    ViewComponent
=======
    GraphViewEditComponent,
    ViewComponent,
    InjectNodeComponent
>>>>>>> 69b5db5 (creo cartella per componenti flow-nodes)
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
