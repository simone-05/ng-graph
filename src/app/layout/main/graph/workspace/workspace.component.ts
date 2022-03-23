import { GraphEditingService } from './../graph-editing.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  graph_switch = 0;
  sidebar_switch = 0;
  graph_id = 0;
  selectedNode: any;
  selectedEdge: any;

  constructor(private activatedRoute: ActivatedRoute, private graphEditingService : GraphEditingService) { }

  ngOnInit(): void {
    this.graph_id = this.activatedRoute.snapshot.params['graph_id'];
    this.graphEditingService.loadGraph(this.graph_id-1);
    this.switcher(1);
  }

  switcher(x: number) {
    this.graph_switch = x;
    setTimeout(() => {
      this.graph_switch = 0;
    }, 100);
  }

  nodeIsSelected(node: any) {
    this.selectedNode = node;
    this.sidebar_switch = 1;
    setTimeout(() => {
      this.sidebar_switch = 0;
    }, 100);
  }

  edgeIsSelected(edge: any) {
    this.selectedEdge = edge;
    this.sidebar_switch = 2;
    setTimeout(() => {
      this.sidebar_switch = 0;
    }, 100);
  }
}
