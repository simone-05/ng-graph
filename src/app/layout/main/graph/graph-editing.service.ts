import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ClusterNode, NgxGraphModule } from '@swimlane/ngx-graph';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GraphEditingService {
  graph: Graph = {date: "", name: "", description: "", nodes: [], edges: [], clusters: []};
  graph$: BehaviorSubject<Graph|any> = new BehaviorSubject<Graph|any>(null);

  constructor(private datePipe: DatePipe) { }

  createGraph(graph_name: string, graph_description: string) : boolean {
    if (localStorage.getItem(graph_name)) return false;
    this.graph.date = this.datePipe.transform(new Date(), "YYYY-MM-dd HH:mm:ss")||"";
    this.graph.name = graph_name;
    this.graph.description = graph_description;
    this.graph.nodes = [];
    this.graph.edges = [];
    this.graph.clusters = [];
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
      this.graph$.next(node);
      return true;
    }
    return false;
  }

  addEdge(edge: Edge) : boolean {
    if (edge && !this.graph.edges.find(arco => arco.id == edge.id)) {
      this.graph.edges.push(edge);
      this.graph$.next(edge);
      return true;
    }
    return false;
  }

  addCluster(cluster: ClusterNode) : boolean {
    if (cluster && !this.graph.clusters.find(clus => clus.id == cluster.id)) {
      this.graph.clusters.push(cluster);
      this.graph$.next(cluster);
      return true;
    }
    return false;
  }

  editNode(node: Node) : boolean{
    let index = this.graph.nodes.indexOf(this.graph.nodes.find(nodo => nodo.id == node.id)||node);
    if (index >= 0) {
      this.graph.nodes[index] = node;
      this.graph$.next(node);
      return true;
    }
    return false;
  }

  editEdge(edge: Edge) : boolean{
    let index = this.graph.edges.indexOf(this.graph.edges.find(arco => arco.id == edge.id)||edge);
    if (index >= 0) {
      this.graph.edges[index] = edge;
      this.graph$.next(edge);
      return true;
    }
    return false;
  }

  editCluster(cluster: ClusterNode) : boolean {
    let index = this.graph.clusters.indexOf(this.graph.clusters.find(clus => clus.id == cluster.id)||cluster);
    if (index >= 0) {
      this.graph.clusters[index] = cluster;
      this.graph$.next(cluster);
      return true;
    }
    return false;
  }

  addToCluster(clusterId: string, node: Node) : boolean {
    let cluster = this.graph.clusters.find(clus=>clus.id==clusterId);
    if (cluster) {
      let index = this.graph.clusters.indexOf(cluster);
      if (index >= 0 && !cluster.childNodeIds?.find(id => id == node.id)) {
          cluster.childNodeIds?.push(node.id);
          this.graph.clusters[index] = cluster;
          this.graph$.next(cluster);
          return true;
      }
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
        //elimino anche le sue entry nei vari cluster
        this.graph.clusters.forEach(cluster => {
          if (cluster.childNodeIds) {
            cluster.childNodeIds.forEach((ids, index) => {
              if (ids == id) cluster.childNodeIds?.splice(index,1);
            });
          }
        });
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

  deleteCluster(id: string) {
    this.graph.clusters.forEach((clus,index) => {
      if (clus.id == id) {
        this.graph.clusters.splice(index,1);
      }
    })
    this.graph$.next(this.graph);
  }

  saveGraphInStorage() {
    localStorage.setItem(this.graph.name, JSON.stringify(this.graph));
  }

  /*
   * Deletes all nodes and edges, preserving graph name and description
  */
  clearGraph() {
    this.graph.nodes=[];
    this.graph.edges=[];
    this.graph.clusters=[];
    this.graph$.next(this.graph);
  }

  getNode(id: string): Node|undefined {
    return this.graph.nodes.find(nodo => nodo.id == id);
  }

  getEdge(id: string): Edge|undefined {
    return this.graph.edges.find(arco => arco.id == id);
  }

  getCluster(id: string): ClusterNode|undefined {
    return this.graph.clusters.find(clus => clus.id == id);
  }

  getConds(node: Node): any[] {
    const conds: any[] = Object.entries(node.properties).map(x => x[1]);
    return conds;
  }

  getTaskNodes(): any[] {
    return this.graph.nodes.filter(node => node.type == "task")||[];
  }
}

export interface Edge {
  id: string,
  label: string,
  source: string,
  target: string,
  weight: number,
  // properties: {
  //   [indice: string]: string,
  // },
}

export interface Node {
  id: string,
  label: string,
  type: string,
  properties: {
    [indice: string]: string,
  },
}

export interface Graph {
  date: string,
  name: string,
  description: string,
  nodes: Node[],
  edges: Edge[],
  clusters: ClusterNode[]
}
