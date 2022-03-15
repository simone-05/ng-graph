import { GraphEditingService, Node, Edge} from './../../graph-editing.service';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

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
  edgePropForm: FormGroup;

  nodePropId: number;
  edgePropId: number;
  isCollapsed: boolean;
  @Output() updateGraphView = new EventEmitter<number>();
  @Input() selectedNode?: Node;
  @Input() selectedEdge?: Edge;
  @Input() forcedChange: any;

  graphNameAlready: boolean = false;
  nodeEditing: boolean = false;
  edgeEditing: boolean = false;

  constructor(public graphEditingService: GraphEditingService, private formBuilder: FormBuilder, private router: Router) {
    this.view = 'node_task';
    this.isCreated = false;
    this.isCollapsed = true;
    this.nodePropId = 0;
    this.edgePropId = 0;
    this.graphEditingService.clearGraph(); //preparo un grafo vuoto

    this.graphInitForm = this.formBuilder.group({
      graph_name: ["", Validators.required],
      graph_desc : new FormControl("", Validators.required)
    });

    this.nodeForm = this.formBuilder.group({
      node_id: [null, [Validators.required, this.checkNodeId()]],
      node_label: null,
      node_type: null,
      node_data: this.formBuilder.array([]),
    });
    // this.nodeForm.valueChanges.subscribe(()=>console.log(this.nodeForm.value));

    this.nodePropForm = this.formBuilder.group({
      node_prop_name: [null, [Validators.required, this.checkNodeProperty()]],
      node_prop_value: [null, Validators.required],
    });

    this.edgeForm = this.formBuilder.group({
      edge_id: null,
      edge_label: null,
      edge_source: [null, [Validators.required, this.checkEdgeNode()]],
      edge_target: [null, [Validators.required, this.checkEdgeNode()]],
      edge_data: this.formBuilder.array([]),
    }, {validators: this.checkEdgeId()});

    this.graphEditingService.graph$.subscribe();

    this.edgePropForm = this.formBuilder.group({
      edge_prop_name: [null, [Validators.required, this.checkEdgeProperty()]],
      edge_prop_value: [null, Validators.required],
    });
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

  get nodeDataForm() : FormArray {
    return this.nodeForm.get("node_data") as FormArray;
  }

  get edgeDataForm() : FormArray {
    return this.edgeForm.get("edge_data") as FormArray;
  }

  checkGraphName(name: string) {
    if (localStorage.getItem(name)) {
      this.graphNameAlready = true;
    } else {
      this.graphNameAlready = false;
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
    this.nodeForm.controls['node_type'].setValue(this.view == "node_cond"? "cond":"task");
    let node_type = this.nodeForm.controls["node_type"].value;
    let node_data = this.nodeForm.controls["node_data"].value;
    let node: Node = {id: node_id, label: node_label, type: node_type, properties: node_data};
    if (this.nodeEditing) {
      this.graphEditingService.editNode(node);
    } else {
      this.graphEditingService.addNode(node);
    }
    this.clearNodeInput();
  }

  tryEdge() {
    let edge_label = this.edgeForm.controls["edge_label"].value||"";
    let edge_source = this.edgeForm.controls["edge_source"].value;
    let edge_target = this.edgeForm.controls["edge_target"].value;
    this.edgeForm.controls["edge_id"].setValue("_"+edge_source+"-"+edge_target);
    let edge_id = this.edgeForm.controls["edge_id"].value;
    let edge_data = this.edgeForm.controls['edge_data'].value;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label, properties: edge_data};
    if (this.edgeEditing) {
      this.graphEditingService.editEdge(edge);
    } else {
      this.graphEditingService.addEdge(edge);
    }
    this.clearEdgeInput();
  }

  deleteNode() {
    let node_id = this.nodeForm.controls["node_id"].value;
    this.graphEditingService.deleteNode(node_id);
    this.clearNodeInput();
  }

  deleteEdge() {
    let edge_id = this.edgeForm.controls["edge_id"].value;
    this.graphEditingService.deleteEdge(edge_id);
    this.clearEdgeInput();
  }

  clearNodeInput() {
    this.nodeEditing = false;
    this.nodePropId = 0;
    this.nodeForm.reset();
    this.nodeDataForm.controls = [];
    // this.nodeDataForm.updateValueAndValidity();
  }

  clearEdgeInput() {
    this.edgeEditing = false;
    this.edgePropId = 0;
    this.edgeForm.reset();
    this.edgeDataForm.controls = [];
  }

  selectedNodeInputChange(node : any) {
    this.clearNodeInput();
    this.nodeEditing = true;
    this.nodeForm.controls["node_id"].setValue(node.id);
    this.nodeForm.controls["node_label"].setValue(node.label);

    node.properties.forEach((element: any) => {
      const dato = this.formBuilder.group({
        id: element.id,
        name: element.name,
        value: element.value,
      });
      this.nodeDataForm.push(dato);
    });
    this.view = (node.type == "cond"? "node_cond":"node_task");
  }

  selectedEdgeInputChange(edge : any) {
    this.clearEdgeInput();
    this.edgeEditing = true;
    this.edgeForm.controls["edge_id"].setValue(edge.id);
    this.edgeForm.controls["edge_label"].setValue(edge.label);
    this.edgeForm.controls["edge_source"].setValue(edge.source);
    this.edgeForm.controls["edge_target"].setValue(edge.target);
    edge.properties.forEach((element: any) => {
      const dato = this.formBuilder.group({
        id: element.id,
        name: element.name,
        value: element.value,
      });
      this.edgeDataForm.push(dato);
    });
    this.view = "edge";
  }

  saveGraph() {
    this.graphEditingService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  start_over() {
    this.graphEditingService.clearGraph();
    this.clearNodeInput();
    this.clearEdgeInput();
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

  addNodeDataField() {
    this.nodePropId += 1;
    const dato = this.formBuilder.group({
      id: this.nodePropId,
      name: this.nodePropForm.controls["node_prop_name"].value,
      value: this.nodePropForm.controls["node_prop_value"].value,
    });
    this.nodeDataForm.push(dato);
    this.nodePropForm.reset();
  }

  addEdgeDataField() {
    this.edgePropId += 1;
    const dato = this.formBuilder.group({
      id: this.edgePropId,
      name: this.edgePropForm.controls["edge_prop_name"].value,
      value: this.edgePropForm.controls["edge_prop_value"].value,
    });
    this.edgeDataForm.push(dato);
    this.edgePropForm.reset();
  }

  removeNodeDataField(n: number) {
    this.nodeDataForm.removeAt(n);
  }

  removeEdgeDataField(n: number) {
    this.edgeDataForm.removeAt(n);
  }

  checkNodeId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors|null => {
      if (control.value && this.graphEditingService.graph.nodes.find(nodo=>nodo.id == control.value && !this.nodeEditing)) {
        return {msg: "Already exists a node with this id"};
      } else return null
    }
  }

  checkNodeProperty(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors|null => {
      if (control.value && this.nodeForm.controls["node_data"].value.find((props: any) => props.name == control.value)) {
        return {msg: "Already existst a property with this name"};
      } else return null;
    }
  }

  checkEdgeId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors|null => {
      if (control.value) {
        let source = control.value.edge_source;
        let target = control.value.edge_target;
        if (source && target) {
          if (source == target) {
            return {loop: true, msg: "Source and target must be different"};
          } else {
            let id = "_"+source+"-"+target;
            if (this.graphEditingService.graph.edges.find(arco => arco.id == id && !this.edgeEditing)) {
              return {already: true, msg: "Already existst an edge between this nodes"};
            }
          }
        }
      }
      return null;
    }
  }

  checkEdgeNode(): ValidatorFn {
    return (control) => {
      if (control.value && !this.graphEditingService.graph.nodes.find(nodo => nodo.id == control.value)) {
        return {notFound: true};
      } else return null;
    }
  }

  checkEdgeProperty(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors|null => {
      if (control.value && this.edgeForm.controls["edge_data"].value.find((props: any) => props.name == control.value)) {
        return {msg: "Already existst a property with this name"};
      } else return null;
    }
  }
}
