import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphCreationService, Node } from './../graph-creation.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Edge } from '@swimlane/ngx-graph';
import { validateLocaleAndSetLanguage } from 'typescript';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  view: string;
  isCreated: boolean;
  graphInitForm: FormGroup;
  newNodeForm: FormGroup;
  newEdgeForm: FormGroup;
  @Output() updateGraphView = new EventEmitter<any>();

  constructor(public graphCreationService: GraphCreationService, private formbuilder: FormBuilder, private router: Router) {
    this.view = 'node';
    this.isCreated = false;

    this.graphInitForm = this.formbuilder.group({
      graph_name: ["", Validators.required],
      graph_desc : new FormControl("", Validators.required)
    });

    this.newNodeForm = this.formbuilder.group({
      node_id: ["", Validators.required],
      node_label: ["", Validators.required],
      node_type: ["", Validators.required],
    });

    this.newEdgeForm = this.formbuilder.group({
      edge_id: ["", Validators.required],
      edge_source: ["", Validators.required],
      edge_target: ["", Validators.required],
      edge_label: ["", Validators.required]
    });

    this.graphCreationService.graph$.subscribe();
  }

  ngOnInit(): void {
  }

  tryCreate() {
    if (this.graphInitForm.controls["graph_name"].valid) {
      let graph_name = this.graphInitForm.controls["graph_name"].value;
      let graph_desc = this.graphInitForm.controls["graph_desc"].value;
      this.isCreated = this.graphCreationService.createGraph(graph_name, graph_desc);
    }
  }

  tryAddNode() {
    let node_id = this.newNodeForm.controls["node_id"].value;
    let node_label = this.newNodeForm.controls["node_label"].value;
    let node_type = this.newNodeForm.controls["node_type"].value;
    let node: Node = {id: node_id, label: node_label, type: node_type};
    this.graphCreationService.addNode(node);
    this.updateGraphView.emit();
  }

  tryAddEdge() {
    let edge_id = this.newEdgeForm.controls["edge_id"].value;
    let edge_source = this.newEdgeForm.controls["edge_source"].value;
    let edge_target = this.newEdgeForm.controls["edge_target"].value;
    let edge_label = this.newEdgeForm.controls["edge_label"].value;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label};
    this.graphCreationService.addEdge(edge);
    this.updateGraphView.emit();
  }

  saveGraph() {
    this.graphCreationService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  changedView(insertChoice: string) {
    this.view = insertChoice;
  }
}
