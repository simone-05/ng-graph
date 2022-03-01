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
  @Input() selectedNode?: Node;
  @Input() selectedEdge?: Edge;
  @Input() forcedChange: any;
  graphNameAlready: boolean = false;
  nodeIdAlready: boolean = false;
  edgeIdAlready: boolean = false;
  edgeIsLoop: boolean = false;
  nodeEditing: boolean = false;
  edgeEditing: boolean = false;
  edge_id_check = {source: "", target: "", id: ""}; //per il controllo nel form, se esiste già la combinazione source-target

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
      edge_source: ["", Validators.required],
      edge_target: ["", Validators.required],
      edge_label: ["", Validators.required]
    });

    this.graphCreationService.graph$.subscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedNode) {
      this.nodeInputChange(this.selectedNode.id);
      this.newNodeForm.get("node_id")?.setValue(this.selectedNode.id);
      this.newNodeForm.get("node_type")?.setValue(this.selectedNode.type);
      this.newNodeForm.get("node_label")?.setValue(this.selectedNode.label);
    }

    if (this.selectedEdge) {
      this.edgeInputChange(this.selectedEdge.id);
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

  checkEdge(evento: any) {
    let input = evento.target.attributes.formControlName.value;
    let value = evento.target.value;
    if (input == "edge_source") {
      this.edge_id_check.source = value;
    } else if (input == "edge_target") {
      this.edge_id_check.target = value;
    }

    if (this.edge_id_check.source != "" && this.edge_id_check.source == this.edge_id_check.target) {
      this.edgeIsLoop = true;
    } else {
      this.edgeIsLoop = false;
    }

    this.edge_id_check.id = this.edge_id_check.source + "-" + this.edge_id_check.target;

    if (this.graphCreationService.graph.edges.find(arco => arco.id == this.edge_id_check.id)) {
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

  tryNode() {
    let node_id = this.newNodeForm.controls["node_id"].value;
    let node_label = this.newNodeForm.controls["node_label"].value||"";
    let node_type = this.newNodeForm.controls["node_type"].value;
    let node: Node = {id: node_id, label: node_label, type: node_type};
    if (this.nodeEditing) {
      this.graphCreationService.editNode(node);
    } else {
      this.graphCreationService.addNode(node);
          this.updateGraphView.emit(1);

      this.clearNodeInput();
      // this.nodeEditing = true;
      // this.nodeIdAlready = true;
    }
    this.updateGraphView.emit(1);
  }

  tryEdge() {
    let edge_source = this.newEdgeForm.controls["edge_source"].value;
    let edge_target = this.newEdgeForm.controls["edge_target"].value;
    let edge_label = this.newEdgeForm.controls["edge_label"].value||"";
    let edge_id = edge_source+"-"+edge_target;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label};
    if (this.edgeEditing) {
      this.graphCreationService.editEdge(edge);
    } else {
      this.graphCreationService.addEdge(edge);
          this.updateGraphView.emit(1);

      this.clearEdgeInput();
      // this.edgeEditing = true;
      // this.edgeIdAlready = true;
    }
    this.edge_id_check = {source: "", target: "", id: ""}; //per resettare i controlli sul form
    this.updateGraphView.emit(1);
  }

  deleteNode() {
    let node_id = this.newNodeForm.controls["node_id"].value;
    this.graphCreationService.deleteNode(node_id);
    this.updateGraphView.emit(1);
    this.nodeEditing = false;
  }

  deleteEdge() {
    let edge_id = this.newEdgeForm.controls["edge_source"].value+"-"+this.newEdgeForm.controls["edge_target"];
    this.graphCreationService.deleteEdge(edge_id);
    this.updateGraphView.emit(1);
    this.edgeEditing = false;
  }

  clearNodeInput() {
    this.newNodeForm.reset();
    this.nodeIdAlready = false;
    this.nodeEditing = false;
  }

  clearEdgeInput() {
    this.newEdgeForm.reset();
    this.edgeIdAlready = false;
    this.edgeEditing = false;
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

  start_over() {
    this.graphCreationService.graph.nodes = [];
    this.graphCreationService.graph.edges = [];
    this.updateGraphView.emit(1);
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
