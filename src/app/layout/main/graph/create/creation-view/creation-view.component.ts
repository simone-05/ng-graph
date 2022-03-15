import { GraphEditingService } from '../../graph-editing.service';
import { Component, OnChanges, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';


@Component({
  selector: 'app-creation-view',
  templateUrl: './creation-view.component.html',
  styleUrls: ['./creation-view.component.scss']
})
export class CreationViewComponent implements OnInit, OnChanges{
  nodes = [
    // {id: "1", label: 'nodo1', type: "cond"},
    // {id: "2", label: 'nodo2', type: "task"}
  ];
  edges = [
    // {id: "1", label: "arco1", source: "1", target: "2"}
  ];
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
      //   if (element.id) {
      //     this.checkConditions(element);
      //   }
      //   console.log("ok1");
        this.updateGraph();
        // console.log("ok2");
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
      case 4:

      default:
        break;
    }
    // console.log(this.nodes);
    // console.log(this.edges);
  }

  updateGraph() {
    this.nodes = this.graphEditingService.graph$.getValue().nodes;
    this.edges = this.graphEditingService.graph$.getValue().edges;
    this.update$.next(true);
  }

  onNodeSelect(event: any) {
    // this.selectedNode.emit(event);
  }

  linkClick(link: any) {
    this.selectedEdge.emit(link);
    console.log(link);

  }

  nodeClick(node: any) {
    this.selectedNode.emit(node)
  }

  //id è il numero del nodo se il mouse è sopra, 0 se il mouse esce dal nodo
  moreDetails(id: number) {
    this.showDetails = id;
  }

  checkConditions(node: Node) {
    console.log(node);
  }
}


