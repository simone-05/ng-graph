import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import _ from 'lodash';
// import _ as * from 'lodash';

@Component({
  selector: 'app-creation-view',
  templateUrl: './creation-view.component.html',
  styleUrls: ['./creation-view.component.scss']
})
export class CreationViewComponent implements OnInit {
  nodi = [
    {id: 'first',label: 'A'},
    {id: 'second',label: 'B'},
    {id: 'third',label: 'C'}
  ];
  archi = [
    {id: 'a',source: 'first',target: 'second', label: 'is parent of'},
    {id: 'b', source: 'first', target: 'third', label: 'custom label'}
  ];


  constructor(private changed: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   console.log("ok1");
    //   this.archi.push({id: 'c', source: 'second', target: "first", label: "yes"});
    //   this.nodi = _.cloneDeep(this.nodi);
    //   this.archi = _.cloneDeep(this.archi);
    //   // this.changed.detectChanges();
    // }, 5000);
  }

  onNodeSelect(event: any) {
    console.log(event);
  }
}
