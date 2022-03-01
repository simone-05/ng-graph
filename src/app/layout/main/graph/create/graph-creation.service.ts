import { CreationViewComponent } from './creation-view/creation-view.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Edge, ClusterNode } from '@swimlane/ngx-graph';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GraphCreationService {
  graph: Graph = {date: "", name: "", description: "", nodes: [], edges: []};
  graph$: BehaviorSubject<Graph|any> = new BehaviorSubject<Graph|any>(null);

  constructor(private datePipe: DatePipe) { }

  createGraph(graph_name: string, graph_description: string) : boolean {
    if (localStorage.getItem(graph_name)) return false;
    this.graph.date = this.datePipe.transform(new Date(), "YYYY-MM-dd HH:mm:ss")||"";
    this.graph.name = graph_name;
    this.graph.description = graph_description;
    this.graph.nodes = [];
    this.graph.edges = [];
    this.graph$.next(this.graph);
    return true;
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

  editNode(node: Node) : boolean{
    let index = this.graph.nodes.indexOf(this.graph.nodes.find(nodo => nodo.id == node.id)||node);
    if (index >= 0) {
      this.graph.nodes[index] = node;
      this.graph$.next(this.graph);
      return true;
    }
    return false;
  }

  editEdge(edge: Edge) : boolean{
    let index = this.graph.edges.indexOf(this.graph.edges.find(arco => arco.id == edge.id)||edge);
    if (index >= 0) {
      this.graph.edges[index] = edge;
      this.graph$.next(this.graph);
      return true;
    }
    return false;
  }

  deleteNode(id: string) {
    this.graph.nodes.forEach((node,index) => {
      if (node.id == id) {
        this.graph.nodes.splice(index,1);
        //elimino anche gli archi a lui collegati
        this.graph.edges.forEach((edge,e_index) => {
          if (edge.source == id || edge.target == id) {
            this.graph.edges.splice(e_index,1);
          }
        });
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
  date: string,   //messa come prima verrà salvata come prima nello storage => ordinate per data
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
}
