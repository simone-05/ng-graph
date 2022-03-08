import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Edge, ClusterNode } from '@swimlane/ngx-graph';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GraphEditingService {
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
    let del_edges: Edge[] = [];
    this.graph.nodes.forEach((node,index) => {
      if (node.id == id) {
        this.graph.nodes.splice(index,1);
        //elimino anche gli archi a lui collegati
        del_edges = this.graph.edges.filter(edge => edge.source == id || edge.target == id);
      }
    });

    del_edges.forEach(element => {
      this.graph.edges.splice(this.graph.edges.indexOf(element),1);
    });

    this.graph$.next(this.graph);
  }

  deleteEdge(id: string) {
    this.graph.edges.forEach((edge,index) => {
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

// export interface Edge {
//   id: string,
//   label: string,
//   source: string,
//   target: string,
//   data: {
//     [indice: string]: string,
//   },
// }

export interface Node {
  id: string,
  label: string,
  type: "cond"|"task",
  properties: {
    [indice: string]: string,
  },
}

export interface Graph {
  date: string,
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[]
}
