import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphCreationService {
  nodes: Node[] = [
    {id: "1", label: "nodo1", type: "cond"},
    {id: "2", label: "nodo2", type: "task"},
    {id: "3", label: "nodo3", type: "cond"},
  ];
  edges: Edge[] = [
    {id: "1", source: "1", target: "2"},
    {id: "2", source: "2", target: "3"}
  ];

  constructor() {
    this.nodes.forEach(node => {
      localStorage.setItem("node "+node.id, node.id+" "+node.label+" "+node.type);
    });

    this.edges.forEach(edge => {
      localStorage.setItem("edge "+edge.id, edge.id" "+edge.source+" "+edge.target);
    })
  }

  
}

export interface Node {
  id: string,
  label: string,
  type: "cond"|"task" //either condition or task
}

export interface Edge {
  id: string,
  source: string,
  target: string
}
