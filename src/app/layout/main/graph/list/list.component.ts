import { Component, OnInit } from '@angular/core';
import { GraphsService } from './graphs.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // form: FormGroup;

  constructor(private Graphs: GraphsService, private router: Router, private formbuilder: FormBuilder) {
    // this.form = this.formbuilder.group({
    //   name: ["", Validators.required],
    //   description : new FormControl("")
    // })
  }

  ngOnInit(): void {
  }

  getGraphs() {
    return this.Graphs.graph$.getValue();
  }

  editGraph(id: number) {
    this.router.navigate(["/app/graph/edit/"+id]);
  }

  // goCreate() {
  //   if (this.form.valid) {
  //     this.router.navigate(["/app/graph/create"]);
  //   }
  // }

}
