import { Component, OnInit} from '@angular/core';

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
}
