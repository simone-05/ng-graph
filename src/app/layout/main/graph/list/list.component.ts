import { Component, OnInit } from '@angular/core';
import { GraphsService } from './graphs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private Graphs: GraphsService, private router: Router) { }

  ngOnInit(): void {
  }

  getGraphs() {
    return this.Graphs.graph$.getValue();
  }

  editGraph(id: number) {
    this.router.navigate(["/app/graph/edit/"+id]);
  }

}
