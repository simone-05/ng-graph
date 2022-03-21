import { GraphEditingService, Node, Edge, Graph } from './../../graph-editing.service';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ClusterNode } from '@swimlane/ngx-graph';

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
  clusterForm: FormGroup;
  // edgePropForm: FormGroup;

  nodePropId: number;
  edgePropId: number;
  isCollapsed: boolean;
  @Output() updateGraphView = new EventEmitter<number>();
  @Input() selectedNode?: Node;
  @Input() selectedEdge?: Edge;
  @Input() selectedCluster?: ClusterNode;
  @Input() forcedChange: any;

  graphNameAlready: boolean = false;
  nodeEditing: boolean = false;
  edgeEditing: boolean = false;
  clusterEditing: boolean = false;

  Object = Object;

  constructor(public graphEditingService: GraphEditingService, private formBuilder: FormBuilder, private router: Router) {
    this.view = "node_task";
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
      node_cluster: [null, this.checkClusterExists()],
      node_data: this.formBuilder.array([]),
    });
    // this.nodeForm.valueChanges.subscribe(()=>console.log(this.nodeForm.value));

    this.nodePropForm = this.formBuilder.group({
      node_prop_name: [null, [Validators.required, this.checkNodeProperty()]],
      node_prop_value: null,
    });

    this.edgeForm = this.formBuilder.group({
      edge_id: null,
      edge_label: null,
      edge_source: [null, [Validators.required, this.checkEdgeNode()]],
      edge_target: [null, [Validators.required, this.checkEdgeNode(), this.checkCondNode()]],
      // edge_data: this.formBuilder.array([]),
      edge_weight: [1, this.checkEdgeWeight()],
    }, {validators: this.checkEdgeId()});

    // this.graphEditingService.graph$.subscribe();

    // this.edgePropForm = this.formBuilder.group({
    //   edge_prop_name: [null, [Validators.required, this.checkEdgeProperty()]],
    //   edge_prop_value: [null, Validators.required],
    // });

    this.clusterForm = this.formBuilder.group({
      cluster_id: [null, [Validators.required, this.checkClusterId()]],
      cluster_label: null,
      cluster_nodes: this.formBuilder.array([]),
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

    if (this.forcedChange == 3) {
      this.selectedClusterInputChange(this.selectedCluster);
    }
  }

  get graph(): Graph {
    return this.graphEditingService.graph;
  }

  get nodeDataForm(): FormArray {
    return this.nodeForm.get("node_data") as FormArray;
  }

  get clusterNodes(): FormArray {
    return this.clusterForm.get("cluster_nodes") as FormArray;
  }

  // get edgeDataForm() : FormArray {
  //   return this.edgeForm.get("edge_data") as FormArray;
  // }

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
    let node_cluster = this.nodeForm.controls["node_cluster"].value;
    if (node_cluster) {
      let clus = this.graphEditingService.getCluster(node_cluster);
      clus?.childNodeIds?.push(node_id);
    }
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
    // let edge_data = this.edgeForm.controls['edge_data'].value;
    let edge_weight = this.edgeForm.controls["edge_weight"].value||1;
    let edge: Edge = {id: edge_id, source: edge_source, target: edge_target, label: edge_label, weight: edge_weight};
    if (this.edgeEditing) {
      this.graphEditingService.editEdge(edge);
    } else {
      this.graphEditingService.addEdge(edge);
    }
    this.clearEdgeInput();
  }

  tryCluster() {
    let cluster_id = this.clusterForm.controls["cluster_id"].value;
    let cluster_label = this.clusterForm.controls["cluster_label"].value || "";
    let cluster_nodes = this.clusterForm.controls["cluster_nodes"].value || [];
    let cluster: ClusterNode = { id: cluster_id, label: cluster_label, childNodeIds: cluster_nodes };
    if (this.clusterEditing) {
      this.graphEditingService.editCluster(cluster);
    } else {
      this.graphEditingService.addCluster(cluster);
    }
    this.clearClusterInput();
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

  deleteCluster() {
    let cluster_id = this.clusterForm.controls["cluster_id"].value;
    this.graphEditingService.deleteCluster(cluster_id);
    this.clearClusterInput();
  }

  clearNodeInput() {
    this.nodeEditing = false;
    this.nodePropId = 0;
    this.nodeForm.reset();
    this.nodeForm.controls["node_data"] = this.formBuilder.array([]);
    // this.nodeDataForm.updateValueAndValidity();
  }

  clearEdgeInput() {
    this.edgeEditing = false;
    this.edgePropId = 0;
    this.edgeForm.reset();
    // this.nodeForm.controls["edge_data"] = this.formBuilder.array([]);
    this.edgeForm.controls["edge_weight"].setValue(1);
  }

  clearClusterInput() {
    this.clusterEditing = false;
    this.clusterForm.reset();
    this.clusterForm.controls["cluster_nodes"] = this.formBuilder.array([]);
    // this.nodeDataForm.updateValueAndValidity();
  }

  selectedNodeInputChange(node: any) {
    this.clearNodeInput();
    this.nodeEditing = true;
    this.nodeForm.controls["node_id"].setValue(node.id);
    this.nodeForm.controls["node_label"].setValue(node.label);
    this.graph.clusters.forEach(clus => {
      clus.childNodeIds?.forEach(ids => {
        if (ids == node.id) {
          this.nodeForm.controls["node_cluster"].setValue(clus.id);
          return;
        }
      });
    });

    node.properties.forEach((element: any) => {
      const dato = this.formBuilder.group({
        id: element.id,
        name: element.name,
        value: element.value,
      });
      this.nodeDataForm.push(dato);
    });
    this.view = (node.type == "cond" ? "node_cond":"node_task");
  }

  selectedEdgeInputChange(edge: any) {
    this.clearEdgeInput();
    this.edgeEditing = true;
    this.edgeForm.controls["edge_id"].setValue(edge.id);
    this.edgeForm.controls["edge_label"].setValue(edge.label);
    this.edgeForm.controls["edge_source"].setValue(edge.source);
    this.edgeForm.controls["edge_target"].setValue(edge.target);
    this.edgeForm.controls["edge_weight"].setValue(edge.weight);
    // edge.properties.forEach((element: any) => {
    //   const dato = this.formBuilder.group({
    //     id: element.id,
    //     name: element.name,
    //     value: element.value,
    //   });
    //   this.edgeDataForm.push(dato);
    // });
    this.view = "edge";
  }

  selectedClusterInputChange(cluster: any) {
    this.clearClusterInput();
    this.clusterEditing = true;
    this.clusterForm.controls["cluster_id"].setValue(cluster.id);
    this.clusterForm.controls["cluster_label"].setValue(cluster.label);
    if (cluster.childNodeIds) {
      cluster.childNodeIds.forEach((id: string) => {
        const dato = this.formBuilder.control(id);
        this.clusterNodes.push(dato);
      });
    }
    this.view = "cluster";
  }


  saveGraph() {
    this.graphEditingService.saveGraphInStorage();
    this.router.navigate(["/app/graph/list"]);
  }

  start_over() {
    this.graphEditingService.clearGraph();
    this.clearNodeInput();
    this.clearEdgeInput();
    this.clearClusterInput();
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
      id: String(this.nodePropId),
      name: this.nodePropForm.controls["node_prop_name"].value,
      value: this.nodePropForm.controls["node_prop_value"].value||"",
    });
    this.nodeDataForm.push(dato);
    this.nodePropForm.reset();
  }

  editNodeDataField(name: string) {

  }

  // addEdgeDataField() {
  //   this.edgePropId += 1;
  //   const dato = this.formBuilder.group({
  //     id: this.edgePropId,
  //     name: this.edgePropForm.controls["edge_prop_name"].value,
  //     value: this.edgePropForm.controls["edge_prop_value"].value,
  //   });
  //   this.edgeDataForm.push(dato);
  //   this.edgePropForm.reset();
  // }

  removeNodeDataField(n: number) {
    this.nodeDataForm.removeAt(n);
  }

  // removeEdgeDataField(n: number) {
  //   this.edgeDataForm.removeAt(n);
  // }

  checkNodeId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !this.nodeEditing) {
        if (this.graph.nodes.find(nodo => nodo.id == control.value)) {
          return { already: true, msg: "Already exists a node with this id" };
        }
        if (this.graph.clusters.find(clus => clus.id == control.value)) {
          return { already: true, msg: "Already exists a cluster with this id"};
        }
      }
      return null;
    }
  }

  checkNodeProperty(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        if (this.nodeForm.controls["node_data"].value.find((props: any) => props.name == control.value)) {
          return {already: true, msg: "Already existst a property with this name" };
        }

        // non posso aggiungere una condizione se non e presente nei nodi task destinatari
        if (this.view == "node_cond" && this.graph.edges.find((edge: Edge) => edge.source == this.nodeForm.controls["node_id"].value)) {
          let task_nodes: Node[] = [];
          let task_conds: any[] = [];
          let flag: boolean = false;

          this.graphEditingService.graph.edges.forEach(element => {
            if (element.source == this.nodeForm.controls['node_id'].value) {
              let node = this.graphEditingService.getNode(element.target);
              if (node) {
                task_nodes.push(node);
                let node_conds = this.graphEditingService.getConds(node);
                if (node_conds) {
                  node_conds.forEach(element => {
                    task_conds.push(element);
                  });
                }
              }
            }
          });

          task_conds.forEach(element => {
            if (element.name == control.value) {
              flag = true;
              return;
            }
          });

          if (flag) return null;
          else return {noCondName: true, msg: "This condition isn't present in any of the targeting task nodes"};
        }

      }
      return null;
    }
  }

  checkEdgeId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        let source = control.value.edge_source;
        let target = control.value.edge_target;
        if (source && target) {
          if (source == target) {
            return { loop: true, msg: "Source and target must be different" };
          } else if (
            (this.graph.nodes.find(nodo => nodo.id == target && nodo.type == "cond") ||
            this.graph.clusters.find(clus => clus.id == target))
            &&
            (this.graph.nodes.find(nodo => nodo.id == source && nodo.type == "cond") ||
            this.graph.clusters.find(clus => clus.id == source))
            ) {
            return { cond2cond: true, msg: "Can't add edge from condition to condition" };
          } else {
            let id = "_" + source + "-" + target;
            if (this.graph.edges.find(arco => arco.id == id && !this.edgeEditing) && !this.edgeEditing) {
              return { already: true, msg: "Already existst an edge between these nodes" };
            }
          }
        }
      }
      return null;
    }
  }

  checkEdgeNode(): ValidatorFn {
    return (control) => {
      if (control.value) {
        if (!this.graph.nodes.find(nodo => nodo.id == control.value) && !this.graph.clusters.find(clus => clus.id == control.value)) {
          return {notFound: true};
        }
      }
      return null;
    }
  }

    //controlla non ci siano gia archi entranti nel nodo condizione
  checkCondNode(): ValidatorFn {
    return (control) => {
      if (this.graph.nodes.find(nodo => nodo.id == control.value && nodo.type == "cond") || this.graph.nodes.find(clus => clus.id == control.value)) {
        if (this.graph.edges.find(arco => arco.target == control.value) && !this.edgeEditing) {
          return {already2cond: true, msg: "Already exists an edge to that condition"};
        }
      } return null;
    }
  }

  // checkEdgeProperty(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     if (control.value && this.edgeForm.controls["edge_data"].value.find((props: any) => props.name == control.value)) {
  //       return { msg: "Already existst a property with this name" };
  //     } else return null;
  //   }
  // }

  checkEdgeWeight(): ValidatorFn {
    return (control) => {
      if (control.value < 1) {
        return {weightError: true, msg: "Edge weight must be at least 1"};
      } else return null;
    }
  }

  checkClusterId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && !this.clusterEditing) {
        if (this.graph.clusters.find(clus => clus.id == control.value)) {
          return { msg: "Already exists a cluster with this id" };
        }
        if (this.graph.nodes.find(node => node.id == control.value)) {
          return { msg: "Already exists a node with this id"};
        }
      }
      return null;
    }
  }

  checkClusterExists(): ValidatorFn {
    return (control) => {
      if (control.value && !this.graph.clusters.find(clus => clus.id == control.value)) {
        return {clusterNotFound: true, msg: "Cluster not found"}
      } else return null;
    }
  }

}
