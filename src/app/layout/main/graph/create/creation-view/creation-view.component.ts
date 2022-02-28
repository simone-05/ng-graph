import { GraphCreationService } from './../graph-creation.service';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import _ from 'lodash';
import { Subject } from 'rxjs';
// import _ as * from 'lodash';

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

  constructor(public graphCreationService: GraphCreationService) {
    this.graphCreationService.graph$.subscribe();
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
    this.nodes = this.graphCreationService.graph$.getValue().nodes;
    this.edges = this.graphCreationService.graph$.getValue().edges;
    this.update$.next(true);
  }

  onNodeSelect(event: any) {
    this.selectedNode.emit(event);
  }

  linkClick(link: any) {
    console.log(link);
    this.selectedEdge.emit(link);
  }

}
