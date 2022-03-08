import { GraphEditingService, Node} from './../../graph-editing.service';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges, enableProdMode } from '@angular/core';
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
  nodePropForm: FormGroup;
  nodeDataNumber: number;
  isCollapsed = false;
  @Output() updateGraphView = new EventEmitter<number>();
  @Input() selectedNode?: Node;
  @Input() selectedEdge?: Edge;
  @Input() forcedChange: any;

  graphNameAlready: boolean = false;
  nodeIdAlready: boolean = false;
  nodeEditing: boolean = false;
  nodePropAlready: boolean = false;
  edgeIdAlready: boolean = false;
  edgeIsLoop: boolean = false;
  edgeSourceNotFound: boolean = false;
  edgeTargetNotFound: boolean = false;
  edgeEditing: boolean = false;

  constructor(public graphEditingService: GraphEditingService, private formbuilder: FormBuilder, private router: Router) {
    this.view = 'node_task';
    this.isCreated = false;
    this.nodeDataNumber = 0;

    this.graphInitForm = this.formbuilder.group({
      graph_name: ["", Validators.required],
      graph_desc : new FormControl("", Validators.required)
    });

    this.nodeForm = this.formbuilder.group({
      node_id: ["", Validators.required],
      node_label: ["", Validators.required],
      node_type: ["", Validators.required],
      node_data: this.formbuilder.array([
        // this.formbuilder.control(""),
        // this.formbuilder.group(
        //   {
        //     id: ["", Validators.required],
        //     name: ["", Validators.required],
        //     value: ["", Validators.required],
        // })
      ]),
    });


    this.nodePropForm = this.formbuilder.group({
      node_prop_name: ["", Validators.required],
      node_prop_value: ["", Validators.required],
    })

    this.edgeForm = this.formbuilder.group({
      edge_id: ["", Validators.required],
      edge_label: ["", Validators.required],
      edge_source: ["", Validators.required],
      edge_target: ["", Validators.required],
    });

    this.graphEditingService.graph$.subscribe();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.forcedChange == 1) {
      this.selectedNodeInputChange(this.selectedNode);
    }

    if (this.forcedChange == 2) {
      this.selectedEdgeInputChange(this.selectedEdge);
    }
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

    if (node_id != "" && this.graphEditingService.graph.nodes.find(nodo => nodo.id == node_id)) {
      this.nodeIdAlready = true;
      // this.nodeEditing = true;
    } else {
      this.nodeIdAlready = false;
      // this.nodeEditing = false;
    }
    
    let prop_name = this.nodePropForm.controls["node_prop_name"].value;
    if (prop_name != "" && this.nodeForm.controls["node_data"].value.find((props: any) => props.name == prop_name)) {
      this.nodePropAlready = true;
    } else {
      this.nodePropAlready = false;
    }
  }

  checkEdgeInput() {
    let edge_source = this.edgeForm.controls["edge_source"].value;
    let edge_target = this.edgeForm.controls["edge_target"].value;

    if (edge_source != "") {
      if (!this.graphEditingService.graph.nodes.find(nodo => nodo.id == edge_source)) {
        this.edgeSourceNotFound = true;
      } else {
        this.edgeSourceNotFound = false;
      }
    } else {
      this.edgeSourceNotFound = false;
    }

    if (edge_target != "") {
      if (!this.graphEditingService.graph.nodes.find(nodo => nodo.id == edge_target)) {
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
      if (this.graphEditingService.graph.edges.find(arco => arco.id == edge_id)) {
        this.edgeIdAlready = true;
        // this.edgeEditing = true;
      } else {
        this.edgeIdAlready = false;
        // this.edgeEditing = false;
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
      this.isCreated = this.graphEditingService.createGraph(graph_name, graph_desc);
    }
  }

  tryNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    let node_label = this.nodeForm.controls["node_label"].value||"";
    let node_type = this.nodeForm.controls["node_type"].value;
    let node_data = this.nodeForm.controls["node_data"].value;
    let node: Node = {id: node_id, label: node_label, type: node_type, properties: node_data};
    if (this.nodeEditing) {
      this.graphEditingService.editNode(node);
    } else {
      this.graphEditingService.addNode(node);
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
      this.graphEditingService.editEdge(edge);
    } else {
      this.graphEditingService.addEdge(edge);
    }
    this.clearEdgeInput();
    this.updateGraphView.emit(1);
  }

  deleteNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    this.graphEditingService.deleteNode(node_id);
    this.clearNodeInput();
    this.updateGraphView.emit(1);
  }

  deleteEdge() {
    let edge_id = this.edgeForm.controls["edge_id"].value;
    this.graphEditingService.deleteEdge(edge_id);
    this.clearEdgeInput();
    this.updateGraphView.emit(1);
  }

  clearNodeInput() {
    this.nodeForm.reset();
    this.nodePropForm.reset();
    //reset dei flag
    this.nodeIdAlready = false;
    this.nodeEditing = false;
    this.nodeDataNumber = 0;
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
    node.properties.forEach((element: any) => {
      this.nodeForm.controls["node_data"]?.value.push(element);
    });
    this.view = (node.type == "cond"? "node_cond":"node_task");
    this.nodeEditing = true;
    this.checkNodeInput();
  }

  selectedEdgeInputChange(edge : any) {
    this.nodeForm.get("edge_id")?.setValue(edge.id);
    this.edgeForm.get("edge_label")?.setValue(edge.label);
    this.edgeForm.get("edge_source")?.setValue(edge.source);
    this.edgeForm.get("edge_target")?.setValue(edge.target);
    this.view = "edge";
    this.edgeEditing = true;
    this.checkEdgeInput();
  }

  saveGraph() {
    this.graphEditingService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  start_over() {
    this.graphEditingService.graph.nodes = [];
    this.graphEditingService.graph.edges = [];
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

  get node_data() : FormArray {
    return this.nodeForm.get("node_data") as FormArray;
  }

  addNodeDataField() {
    this.nodeDataNumber += 1;
    this.node_data.value.push(
      {
        id: this.nodeDataNumber,
        name: this.nodePropForm.controls["node_prop_name"].value,
        value: this.nodePropForm.controls["node_prop_value"].value,
      }
    );
    this.nodePropForm.reset();
    this.nodePropAlready = false;
  }

  removeNodeDataField(n: number) {
    if (this.node_data.value.length >= n) {
      this.node_data.value.splice(n,1);
    }
  }

}
