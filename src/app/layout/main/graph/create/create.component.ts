import { ClusterNode } from '@swimlane/ngx-graph';
import { Component, OnInit} from '@angular/core';
import { Edge } from '../graph-editing.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  graph_switch = 0;
  sidebar_switch = 0;
  selectedNode: any;
  selectedEdge: any;
  selectedCluster: any;

  constructor() {
  }

  ngOnInit(): void {
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

  clusterIsSelected(cluster: any) {
    this.selectedCluster = cluster;
    this.sidebar_switch = 3;
    setTimeout(() => {
      this.sidebar_switch = 0;
    }, 100);
  }
}
