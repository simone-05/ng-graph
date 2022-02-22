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
  @Input() update: boolean = false;
  update$: Subject<boolean> = new Subject();

  constructor(public graphCreationService: GraphCreationService) {
    this.graphCreationService.graph$.subscribe();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.nodes = this.graphCreationService.graph$.getValue().nodes;
    this.edges = this.graphCreationService.graph$.getValue().edges;
    this.update$.next(true);
  }

  onNodeSelect(event: any) {
    // console.log(event);
  }
}
