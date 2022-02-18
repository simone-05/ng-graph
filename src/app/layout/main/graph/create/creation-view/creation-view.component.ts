import { GraphCreationService, Node } from './../graph-creation.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { Edge } from '@swimlane/ngx-graph';
// import _ as * from 'lodash';

@Component({
  selector: 'app-creation-view',
  templateUrl: './creation-view.component.html',
  styleUrls: ['./creation-view.component.scss']
})
export class CreationViewComponent implements OnInit {
  nodes = [{id: "1", label: "1", type: "cond"}];
  // IL GRAFO SI AGGIORNA OGNI VOLTA CHE PREMO SU UN NODO, SECONDO LA FUNZIONE ALLA FINE
  // edges = [{id: "1", source: "1", target: "2"}];
  edges = [];

  constructor(public graphCreationService: GraphCreationService) {
    this.graphCreationService.graph$.subscribe((element) => {
      // this.nodes = _.cloneDeep(element.nodes);
      // console.log("==========8==8=8=8=8====");
      // this.edges = _.cloneDeep(element.edges);
      // console.log("si" + this.nodes);
      // console.log(this.edges);
    });
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.edges.push({id: 'c', source: 'second', target: "first"});
    //   this.nodes = this.graphCreationService.graph$.getValue().nodes;
    //   this.edges = this.graphCreationService.graph$.getValue().edges;
    //   this.nodes = _.cloneDeep(this.nodes);
    //   this.edges = _.cloneDeep(this.edges);
    //   // this.changed.detectChanges();
    //   console.log("fatto");
    // }, 20000);
  }

  onNodeSelect(event: any) {
    this.nodes = this.graphCreationService.graph$.getValue().nodes;
    this.edges = this.graphCreationService.graph$.getValue().edges;
    this.nodes = _.cloneDeep(this.nodes);
    this.edges = _.cloneDeep(this.edges);
    // console.log(event);
  }
}
