import { Component, OnInit, SimpleChanges, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphEditService } from '../graph-edit.service';

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
  @Output() selectedNode = new EventEmitter<any>();

  constructor(public graphEditService: GraphEditService) {
    this.graphEditService.graph$.subscribe();
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
    this.nodes = this.graphEditService.graph$.getValue().nodes;
    this.edges = this.graphEditService.graph$.getValue().edges;
    this.update$.next(true);
  }

  onNodeSelect(event: any) {
    this.selectedNode.emit(event);
  }

  linkClick(link: any) {
    console.log(link);
  }

}
