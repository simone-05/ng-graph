import { GraphCreationService } from './../graph-creation.service';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import _ from 'lodash';
import { Subject } from 'rxjs';
// import _ as * from 'lodash';

@Component({
  selector: 'app-creation-view',
  templateUrl: './creation-view.component.html',
  styleUrls: ['./creation-view.component.scss']
})
export class CreationViewComponent implements OnInit, OnChanges{
  nodes = [];
  edges = [];
  @Input() update: number = 0;
  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

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
    // console.log(event);
  }
}
