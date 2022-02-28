import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphEditService, Node } from './../graph-edit.service';
import { Edge } from '@swimlane/ngx-graph';


@Component({
  selector: 'app-sidebar-edit',
  templateUrl: './sidebar-edit.component.html',
  styleUrls: ['./sidebar-edit.component.scss']
})
export class SidebarEditComponent implements OnInit, OnChanges {
  view: string = "node";
  nodeForm: FormGroup;
  edgeForm: FormGroup;
  editGraphForm: FormGroup;
  nodeEditing: boolean = false;
  edgeEditing: boolean = false;
  @Output() updateGraphView = new EventEmitter<number>();
  @Input() selectedNode: any;
  @Input() forcedChange: any;

  constructor(public graphEditService: GraphEditService, private formBuilder: FormBuilder, private router: Router) {

    this.editGraphForm = this.formBuilder.group({
      graph_name: ["", Validators.required],
      graph_desc : ["", Validators.required]
    });

    this.nodeForm = this.formBuilder.group({
      node_id: ["", Validators.required],
      node_label: ["", Validators.required],
      node_type: ["", Validators.required],
    });

    this.edgeForm = this.formBuilder.group({
      edge_id: ["", Validators.required],
      edge_source: ["", Validators.required],
      edge_target: ["", Validators.required],
      edge_label: ["", Validators.required]
    });

    this.graphEditService.graph$.subscribe();
  }

  ngOnInit(): void {
    this.editGraphForm.get("graph_name")?.setValue(this.graphEditService.graph.name);
    this.editGraphForm.get("graph_desc")?.setValue(this.graphEditService.graph.description);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.nodeForm.get("node_id")?.setValue(this.selectedNode.id);
    this.nodeInputChange(this.nodeForm.get("node_id")?.value);
    this.nodeForm.get("node_type")?.setValue(this.selectedNode.type);
    this.nodeForm.get("node_label")?.setValue(this.selectedNode.label);
  }

  editGraph() {
    let new_name = this.editGraphForm.controls["graph_name"].value;
    let old_name = this.graphEditService.graph.name;
    if (this.editGraphForm.controls["graph_name"].valid) {
      if (old_name != new_name && !localStorage.getItem(new_name)) {
        localStorage.removeItem(old_name);
        this.graphEditService.graph.name = this.editGraphForm.controls['graph_name'].value;
      } else if (localStorage.getItem(new_name)) {
        // NOME GIA ESISTENTE
      }
      this.graphEditService.graph.description = this.editGraphForm.controls['graph_desc'].value;
    }
  }

  nodeInputChange(id : any) {
    if (this.graphEditService.graph.nodes.find(node => node.id==id)) {
      this.nodeEditing = true;
      this.view = "node";
    } else {
      this.nodeEditing = false;
    }
  }

  edgeInputChange(id : any) {
    if (this.graphEditService.graph.edges.find(edge => edge.id==id)) {
      this.edgeEditing = true;
      this.view = "edge";
    } else {
      this.edgeEditing = false;
    }
  }

  tryNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    let node_label = this.nodeForm.controls["node_label"].value;
    let node_type = this.nodeForm.controls["node_type"].value;
    let node: Node = {id: node_id, label: node_label, type: node_type};
    if (this.nodeEditing) {
      this.graphEditService.editNode(node);
    } else {
      this.graphEditService.addNode(node);
      this.nodeEditing = true;
    }
    this.updateGraphView.emit(1);
  }

  tryEdge() {
    let edge_id = this.edgeForm.controls["edge_id"].value;
    let edge_source = this.edgeForm.controls["edge_source"].value;
    let edge_target = this.edgeForm.controls["edge_target"].value;
    let edge_label = this.edgeForm.controls["edge_label"].value;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label};
    if (this.edgeEditing) {
      this.graphEditService.editEdge(edge);
    } else {
      this.graphEditService.addEdge(edge);
      this.edgeEditing = true;
    }
    this.updateGraphView.emit(1);
  }

  deleteNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    this.graphEditService.deleteNode(node_id);
    this.updateGraphView.emit(1);
    this.nodeEditing = false;
  }

  deleteEdge() {
    let edge_id = this.edgeForm.controls["edge_id"].value;
    this.graphEditService.deleteEdge(edge_id);
    this.updateGraphView.emit(1);
    this.edgeEditing = false;
  }

  saveGraph() {
    this.graphEditService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  changedView(insertChoice: string) {
    this.view = insertChoice;
  }

  clearNodeInput() {
    this.nodeForm.reset();
    this.nodeEditing = false;
  }

  clearEdgeInput() {
    this.edgeForm.reset();
    this.edgeEditing = false;
  }

  reload_page() {
    location.reload();
  }

  centerGraph() {
    this.updateGraphView.emit(2);
  }

  fitGraph() {
    this.updateGraphView.emit(3);
  }

}
