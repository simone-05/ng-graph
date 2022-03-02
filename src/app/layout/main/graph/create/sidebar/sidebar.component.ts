import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GraphCreationService, Node } from './../graph-creation.service';
import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Edge } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
  view: string;
  isCreated: boolean;
  graphInitForm: FormGroup;
  nodeForm: FormGroup;
  edgeForm: FormGroup;
  @Output() updateGraphView = new EventEmitter<number>();
  @Input() selectedNode?: Node;
  @Input() selectedEdge?: Edge;
  @Input() forcedChange: any;

  graphNameAlready: boolean = false;
  nodeIdAlready: boolean = false;
  edgeIdAlready: boolean = false;
  edgeIsLoop: boolean = false;
  edgeSourceNotFound: boolean = false;
  edgeTargetNotFound: boolean = false;
  nodeEditing: boolean = false;
  edgeEditing: boolean = false;

  constructor(public graphCreationService: GraphCreationService, private formbuilder: FormBuilder, private router: Router) {
    this.view = 'node_task';
    this.isCreated = false;

    this.graphInitForm = this.formbuilder.group({
      graph_name: ["", Validators.required],
      graph_desc : new FormControl("", Validators.required)
    });

    this.nodeForm = this.formbuilder.group({
      node_id: ["", Validators.required],
      node_label: ["", Validators.required],
      node_type: ["", Validators.required]
    });

    this.edgeForm = this.formbuilder.group({
      edge_id: ["", Validators.required],
      edge_label: ["", Validators.required],
      edge_source: ["", Validators.required],
      edge_target: ["", Validators.required],
    });

    this.graphCreationService.graph$.subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.forcedChange == 1) {
      this.selectedNodeInputChange(this.selectedNode);
    }

    if (this.forcedChange == 2) {
      this.selectedEdgeInputChange(this.selectedEdge);
    }
  }

  ngOnInit(): void {
  }

  checkGraphName(name: string) {
    if (localStorage.getItem(name)) {
      this.graphNameAlready = true;
    } else {
      this.graphNameAlready = false;
    }
  }

  checkNodeInput(){
    let node_id = this.nodeForm.controls["node_id"].value;
    this.nodeForm.controls["node_type"].setValue(this.view == "node_cond"? "cond":"task");

    if (node_id != "" && this.graphCreationService.graph.nodes.find(nodo => nodo.id == node_id)) {
      this.nodeIdAlready = true;
      this.nodeEditing = true;
    } else {
      this.nodeIdAlready = false;
      this.nodeEditing = false;
    }
  }

  checkEdgeInput() {
    let edge_source = this.edgeForm.controls["edge_source"].value;
    let edge_target = this.edgeForm.controls["edge_target"].value;

    if (edge_source != "") {
      if (!this.graphCreationService.graph.nodes.find(nodo => nodo.id == edge_source)) {
        this.edgeSourceNotFound = true;
      } else {
        this.edgeSourceNotFound = false;
      }
    } else {
      this.edgeSourceNotFound = false;
    }

    if (edge_target != "") {
      if (!this.graphCreationService.graph.nodes.find(nodo => nodo.id == edge_target)) {
        this.edgeTargetNotFound = true;
      } else {
        this.edgeTargetNotFound = false;
      }
    } else {
      this.edgeTargetNotFound = false;
    }

    if (edge_source != "" && edge_target != "" && edge_source == edge_target) {
      this.edgeIsLoop = true;
    } else {
      this.edgeIsLoop = false;
    }

    if (edge_source != "" && edge_target != "" && edge_source != edge_target) {
      this.edgeForm.controls["edge_id"].setValue("_"+edge_source+"-"+edge_target);
      let edge_id = this.edgeForm.controls["edge_id"].value;
      if (this.graphCreationService.graph.edges.find(arco => arco.id == edge_id)) {
        this.edgeIdAlready = true;
        this.edgeEditing = true;
      } else {
        this.edgeIdAlready = false;
        this.edgeEditing = false;
      }
    } else {
      this.edgeIdAlready = false;
      this.edgeEditing = false;
    }
  }

  tryCreate() {
    if (this.graphInitForm.controls["graph_name"].valid) {
      let graph_name = this.graphInitForm.controls["graph_name"].value;
      let graph_desc = this.graphInitForm.controls["graph_desc"].value;
      this.isCreated = this.graphCreationService.createGraph(graph_name, graph_desc);
    }
  }

  tryNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    let node_label = this.nodeForm.controls["node_label"].value||"";
    let node_type = this.nodeForm.controls["node_type"].value;
    let node: Node = {id: node_id, label: node_label, type: node_type};
    if (this.nodeEditing) {
      this.graphCreationService.editNode(node);
    } else {
      this.graphCreationService.addNode(node);
    }
    this.clearNodeInput();
    this.updateGraphView.emit(1);
  }

  tryEdge() {
    let edge_id = this.edgeForm.controls["edge_id"].value;
    let edge_label = this.edgeForm.controls["edge_label"].value||"";
    let edge_source = this.edgeForm.controls["edge_source"].value;
    let edge_target = this.edgeForm.controls["edge_target"].value;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label};
    if (this.edgeEditing) {
      this.graphCreationService.editEdge(edge);
    } else {
      this.graphCreationService.addEdge(edge);
    }
    this.clearEdgeInput();
    this.updateGraphView.emit(1);
  }

  deleteNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    this.graphCreationService.deleteNode(node_id);
    this.clearNodeInput();
    this.updateGraphView.emit(1);
  }

  deleteEdge() {
    let edge_id = this.edgeForm.controls["edge_id"].value;
    this.graphCreationService.deleteEdge(edge_id);
    this.clearEdgeInput();
    this.updateGraphView.emit(1);
  }

  clearNodeInput() {
    this.nodeForm.reset();
    //reset dei flag
    this.nodeIdAlready = false;
    this.nodeEditing = false;
  }

  clearEdgeInput() {
    this.edgeForm.reset();
    //reset dei flag
    this.edgeIdAlready = false;
    this.edgeEditing = false;
    this.edgeSourceNotFound = false;
    this.edgeTargetNotFound = false;
    this.edgeIsLoop = false;
  }

  selectedNodeInputChange(node : any) {
    this.nodeForm.get("node_id")?.setValue(node.id);
    this.nodeForm.get("node_label")?.setValue(node.label);
    this.nodeForm.get("node_type")?.setValue(node.type);
    this.view = (node.type == "cond"? "node_cond":"node_task");
    this.checkNodeInput();
  }

  selectedEdgeInputChange(edge : any) {
    this.nodeForm.get("edge_id")?.setValue(edge.id);
    this.edgeForm.get("edge_label")?.setValue(edge.label);
    this.edgeForm.get("edge_source")?.setValue(edge.source);
    this.edgeForm.get("edge_target")?.setValue(edge.target);
    this.view = "edge";
    this.checkEdgeInput();
  }

  saveGraph() {
    this.graphCreationService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  start_over() {
    this.graphCreationService.graph.nodes = [];
    this.graphCreationService.graph.edges = [];
    this.clearNodeInput();
    this.clearEdgeInput();
    this.updateGraphView.emit(1);
  }

  changedView(insertChoice: string) {
    if (insertChoice == "node_task") {
      this.nodeForm.controls["node_type"].setValue("task");
    } else if (insertChoice == "node_cond") {
      this.nodeForm.controls["node_type"].setValue("cond");
    }
    this.view = insertChoice;
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
