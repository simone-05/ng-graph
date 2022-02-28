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
  newNodeForm: FormGroup;
  newEdgeForm: FormGroup;
  @Output() updateGraphView = new EventEmitter<number>();
  @Input() selectedNode: any;
  @Input() selectedEdge: any;
  @Input() forcedChange: any;
  graphNameAlready: boolean = false;
  nodeIdAlready: boolean = false;
  edgeIdAlready: boolean = false;
  nodeEditing: boolean = false;
  edgeEditing: boolean = false;

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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('selectedNode')) {
      console.log("nodo");
      this.newNodeForm.get("node_id")?.setValue(this.selectedNode.id);
      this.nodeInputChange(this.newNodeForm.get("node_id")?.value);
      this.newNodeForm.get("node_type")?.setValue(this.selectedNode.type);
      this.newNodeForm.get("node_label")?.setValue(this.selectedNode.label);
    }

    if (changes.hasOwnProperty('selectedEdge')) {
      console.log("arco");
      this.newEdgeForm.get("edge_id")?.setValue(this.selectedEdge.id);
      this.edgeInputChange(this.newEdgeForm.get("edge_id")?.value);
      this.newEdgeForm.get("edge_source")?.setValue(this.selectedEdge.source);
      this.newEdgeForm.get("edge_target")?.setValue(this.selectedEdge.target);
      this.newEdgeForm.get("edge_label")?.setValue(this.selectedEdge.label);
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

  checkNodeId(id: string) {
    if (this.graphCreationService.graph.nodes.find(nodo => nodo.id ==id)) {
      this.nodeIdAlready = true;
    } else {
      this.nodeIdAlready = false;
    }
  }

  checkEdgeId(id: string) {
    if (this.graphCreationService.graph.edges.find(arco => arco.id ==id)) {
      this.edgeIdAlready = true;
    } else {
      this.edgeIdAlready = false;
    }
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
    this.updateGraphView.emit(1);
  }

  tryAddEdge() {
    let edge_id = this.newEdgeForm.controls["edge_id"].value;
    let edge_source = this.newEdgeForm.controls["edge_source"].value;
    let edge_target = this.newEdgeForm.controls["edge_target"].value;
    let edge_label = this.newEdgeForm.controls["edge_label"].value;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label};
    this.graphCreationService.addEdge(edge);
    this.updateGraphView.emit(1);
  }

  nodeInputChange(id : any) {
    if (this.graphCreationService.graph.nodes.find(node => node.id==id)) {
      this.nodeEditing = true;
      this.view = "node";
    } else {
      this.nodeEditing = false;
    }
  }

  edgeInputChange(id : any) {
    if (this.graphCreationService.graph.edges.find(edge => edge.id==id)) {
      this.edgeEditing = true;
      this.view = "edge";
    } else {
      this.edgeEditing = false;
    }
  }

  saveGraph() {
    this.graphCreationService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  changedView(insertChoice: string) {
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
