import { Injectable } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphsService {
  Graphs: graph[] = [
    {id: 1, name: "grafo1", description: "desc grafo 1"},
    {id: 2, name: "grafo2", description: ""},
    {id: 3, name: "grafo3", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex maiores saepe dolor minima iste similique iusto facilis corrupti possimus amet, fugiat cum officia accusamus dolorum architecto fugit, quod accusantium tempore!"},
    {id: 4, name: "gdfsa", description: "fd"}
  ];

  graph$: BehaviorSubject<graph|any> = new BehaviorSubject<graph|any>(this.Graphs);

  constructor() { }

  getGraphs() {
    return of (this.Graphs);
  }
}

export interface graph {
  id: number,
  name: string,
  description: string
}
