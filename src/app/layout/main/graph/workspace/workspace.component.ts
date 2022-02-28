import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GraphEditService } from './graph-edit.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  graph_switch = 0;
  sidebar_switch = false;
  graph_id = 0;
  selectedNode: any;
  selectedEdge: any;

  constructor(private activatedRoute: ActivatedRoute, private graphEditService : GraphEditService) { }

  ngOnInit(): void {
    this.graph_id = this.activatedRoute.snapshot.params['graph_id'];
    this.graphEditService.loadGraph(this.graph_id-1);
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
    this.sidebar_switch = !this.sidebar_switch;
  }

  edgeIsSelected(edge: any) {
    this.selectedEdge = edge;
    this.sidebar_switch = !this.sidebar_switch;
  }

}
