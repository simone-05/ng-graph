import { Node, Edge, GraphEditingService } from './../../graph-editing.service';
import { Component, OnInit, SimpleChanges, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-graph-view-edit',
  templateUrl: './graph-view-edit.component.html',
  styleUrls: ['./graph-view-edit.component.scss']
})
export class GraphViewEditComponent implements OnInit {
  nodes: Node[] = [
    //     {id: "1", label: 'nodo1', type: "cond"},
    // {id: "2", label: 'nodo2', type: "task"}
  ];
  edges: Edge[] = [];
  @Input() update: number = 0;
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  @Output() selectedNode: any = new EventEmitter<any>();
  @Output() selectedEdge: any = new EventEmitter<any>();

  Object = Object;

  showDetails: number;

  constructor(public graphEditingService: GraphEditingService) {
    this.showDetails = 0;

    this.graphEditingService.graph$.subscribe((element) => {
      if (element) {
        this.updateGraph();

        if (element.source) { //se aggiungiamo/editiamo un arco
          // this.checkConditions(element);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.update) {
      case 1:
        // this.updateGraph();
        break;
      case 2:
        this.center$.next(true)
        break;
      case 3:
        this.zoomToFit$.next(true)
        break;
      default:
        break;
      }
  }

  updateGraph() {
    this.nodes = this.graphEditingService.graph.nodes;
    this.edges = this.graphEditingService.graph.edges;
    // this.nodes = this.graphEditingService.graph$.getValue().nodes;
    // this.edges = this.graphEditingService.graph$.getValue().edges;

    this.update$.next(true);
  }

  onNodeSelect(event: any) {
    // this.selectedNode.emit(event);
  }

  linkClick(link: any) {
    this.selectedEdge.emit(link);
  }

  nodeClick(node: any) {
    this.selectedNode.emit(node);
  }

  //id è il numero del nodo se il mouse è sopra, 0 se il mouse esce dal nodo
  moreDetails(id: number) {
    this.showDetails = id;
  }

  //triggered after adding/editing edge
  checkConditions(edge: Edge) : boolean {
    //salvo nodo sorgente e destinazione
    const source_node: Node|undefined = this.nodes.find(nodo => nodo.id == edge.source);
    const target_node: Node|undefined = this.nodes.find(nodo => nodo.id == edge.target);

    // se per qualche errore uno dei due non c'e, esco
    if (!source_node || !target_node) {
      return false;
    }

    if (source_node.type == "cond") {
      return this.checkConditionNode(source_node);
    } else if (target_node.type == "cond") {
      return this.checkConditionNode(target_node);
    } else return false;
  }

  //funzione che ci dice se un nodo condizione e soddisfatto o no (cioe se il nodo task che ha in ingresso attiva questo nodo o meno (se soddisfa tutte le condizioni del nodo condizione))
  checkConditionNode(node: Node): boolean {
    if (node.type != "cond") return false;

    const task_node: Node|undefined = this.nodes.find(nodo => nodo.id == this.edges.find(arco => arco.target == node.id)?.source);

    if (!task_node) return false;

    return this.checkAllProps(node, task_node);
  }

  //true se tutte le condizioni del primo nodo parametro sono presenti e stesso valore nel secondo nodo parametro
  checkAllProps(node1: Node, node2: Node): boolean {
    const cond_1 = Object.entries(node1.properties).map(x => x[1]);
    const cond_2 = Object.entries(node2.properties).map(x => x[1]);

    let flag: boolean = true;

    cond_1.forEach((element: any) => {
      const x = cond_2.find((x: any) => x.name == element.name && x.value == element.value);
      if (!x) {
        flag = false;
        return;
      }
    });

    return flag;
  }
}
