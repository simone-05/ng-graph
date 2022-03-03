import { Component, OnInit } from '@angular/core';
import { GraphsService } from './graphs.service';
import { Router } from '@angular/router';
import { Graph } from '../graph-editing.service';
import { HighlightSpanKind } from 'typescript';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  graph_deletions: boolean[] = [];
  graphs: _Graph[] = [];

  constructor(private Graphs: GraphsService, private router: Router) {
    // bypasso il graphs.service
    for (let index = 0; index < localStorage.length; index++) {
      this.graphs.push(
        {
          id: index+1,
          graph: JSON.parse(localStorage.getItem(localStorage.key(index)||"")||"")
        }
      );
      this.graph_deletions[index+1] = false;
    }
    this.graphs = this.graphs.sort((a,b) => (a.graph.date > b.graph.date)? 1:-1);
  }

  ngOnInit(): void {
  }

  getGraphs() {
    // return this.Graphs.graph$.getValue();
    return this.graphs;
  }

  editGraph(id: number) {
    this.router.navigate(["/app/graph/edit/"+id]);
  }

  deleteGraph(graph_name: string) {
    localStorage.removeItem(graph_name);
    location.reload();
  }

  confirm_delete(graph_id: number) {
    if (!this.graph_deletions[graph_id]) {
      this.graph_deletions[graph_id] = true;
    } else {
      this.graph_deletions[graph_id] = false;
    }
  }

}

interface _Graph {
  id: number,
  graph: Graph
}
