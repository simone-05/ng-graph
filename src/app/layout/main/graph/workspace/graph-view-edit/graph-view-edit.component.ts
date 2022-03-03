import { GraphEditingService } from './../../graph-editing.service';
import { Component, OnInit, SimpleChanges, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-graph-view-edit',
  templateUrl: './graph-view-edit.component.html',
  styleUrls: ['./graph-view-edit.component.scss']
})
export class GraphViewEditComponent implements OnInit {
  nodes=[
    //     {id: "1", label: 'nodo1', type: "cond"},
    // {id: "2", label: 'nodo2', type: "task"}
  ];
  edges=[];
  @Input() update: number = 0;
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  @Output() selectedNode: any = new EventEmitter<any>();
  @Output() selectedEdge: any = new EventEmitter<any>();

  constructor(public graphEditingService: GraphEditingService) {
    this.graphEditingService.graph$.subscribe();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.update) {
      case 1:
        this.updateGraph();
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
    this.nodes = this.graphEditingService.graph$.getValue().nodes;
    this.edges = this.graphEditingService.graph$.getValue().edges;

    this.update$.next(true);
  }

  onNodeSelect(event: any) {
    // this.selectedNode.emit(event);
  }

  linkClick(link: any) {
    this.selectedEdge.emit(link);
  }

  nodeClick(node: any) {
    this.selectedNode.emit(node)
  }

}
