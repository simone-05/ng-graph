import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Edge, ClusterNode } from '@swimlane/ngx-graph';

@Injectable({
  providedIn: 'root'
})
export class GraphCreationService {
  graph: Graph = {name: "", description: "", nodes: [], edges: []};
  graph$: BehaviorSubject<Graph|any> = new BehaviorSubject<Graph|any>(null);

  constructor() { }

  createGraph(graph_name: string, graph_description: string) : boolean {
    if (localStorage.getItem(graph_name)) return false;
    this.graph.name = graph_name;
    this.graph.description = graph_description;
    this.graph.nodes = [];
    this.graph.edges = [];
    this.graph$.next(this.graph);
    // this.saveGraphInStorage();
    return true;
  }

  addNode(node: Node) : boolean {
    if (node && !this.graph.nodes.find(nodo => nodo.id == node.id)) {
      this.graph.nodes.push(node);
      this.graph$.next(this.graph);
      // this.saveGraphInStorage();
      return true;
    }
    return false;
  }

  addEdge(edge: Edge) : boolean {
    if (edge && !this.graph.edges.find(arco => arco.id == edge.id)) {
      this.graph.edges.push(edge);
      this.graph$.next(this.graph);
      // this.saveGraphInStorage();
      return true;
    }
    return false;
  }

  saveGraphInStorage() {
    // console.log("ok1");
    if (this.graph) {
      console.log("si");
    } else {console.log("no");}
    console.log(this.graph);
    console.log(JSON.stringify(this.graph));
    localStorage.setItem(this.graph.name, JSON.stringify(this.graph));
    // console.log("ok2");
  }
}

export interface Node {
  id: string,
  label: string,
  type: "cond"|"task";
}

export interface Graph {
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
}
