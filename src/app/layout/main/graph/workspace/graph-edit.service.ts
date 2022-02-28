import { GraphViewEditComponent } from './graph-view-edit/graph-view-edit.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Edge, ClusterNode } from '@swimlane/ngx-graph';

@Injectable({
  providedIn: 'root'
})
export class GraphEditService {
  graph: Graph = {date: "", name: "", description: "", nodes: [], edges: []};
  graph$: BehaviorSubject<Graph|any> = new BehaviorSubject<Graph|any>(null);

  constructor() { }

  loadGraph(graph_id: number) : boolean {
    if (graph_id < localStorage.length) {
      this.graph = JSON.parse(localStorage.getItem(localStorage.key(graph_id)||"")||"");
      this.graph$.next(this.graph);
      return true;
    }
    return false;
  }

  editGraph(graph_name: string, graph_desc: string) {
    this.graph.name = graph_name;
    this.graph.description = graph_desc;
    this.graph$.next(this.graph);
  }

  editNode(node: Node) : boolean{
    let id = this.graph.nodes.find(nodo => nodo.id == node.id)?.id;
    if (node && id) {
      console.log("prima: "+ Object.fromEntries(Object.entries(this.graph.nodes[Number.parseInt(id)-1])));
      this.graph.nodes[Number.parseInt(id)-1] = node;
      console.log("dopo: "+ Object.fromEntries(Object.entries(this.graph.nodes[Number.parseInt(id)-1])));
      this.graph$.next(this.graph);
      return true;
    }
    return false;
  }

  editEdge(edge: Edge) : boolean{
    let id = this.graph.edges.find(arco => arco.id == edge.id)?.id;
    if (edge && id) {
      console.log("prima: "+ Object.fromEntries(Object.entries(this.graph.edges[Number.parseInt(id)-1])));
      this.graph.edges[Number.parseInt(id)-1] = edge;
      console.log("dopo: "+ Object.fromEntries(Object.entries(this.graph.edges[Number.parseInt(id)-1])));
      this.graph$.next(this.graph);
      return true;
    }
    return false;

  }

  addNode(node: Node) : boolean {
    if (node && !this.graph.nodes.find(nodo => nodo.id == node.id)) {
      this.graph.nodes.push(node);
      this.graph$.next(this.graph);
      return true;
    }
    return false;
  }

  addEdge(edge: Edge) : boolean {
    if (edge && !this.graph.edges.find(arco => arco.id == edge.id)) {
      this.graph.edges.push(edge);
      this.graph$.next(this.graph);
      return true;
    }
    return false;
  }

  deleteNode(id: string) {
    this.graph.nodes.forEach((node,index) => {
      if (node.id == id) {
        this.graph.nodes.splice(index,1);
      }
    });
    this.graph$.next(this.graph);
  }

  deleteEdge(id: string) {
    this.graph.nodes.forEach((edge,index) => {
      if (edge.id == id) {
        this.graph.edges.splice(index,1);
      }
    })
    this.graph$.next(this.graph);
  }

  saveGraphInStorage() {
    localStorage.setItem(this.graph.name, JSON.stringify(this.graph));
  }
}

export interface Node {
  id: string,
  label: string,
  type: "cond"|"task";
}

export interface Graph {
  date: string,
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
}
