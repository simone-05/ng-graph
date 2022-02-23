import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  switch = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  switcher(x: number) {
    this.switch = x;
    setTimeout(() => {
      this.switch = 0;
    }, 100);
  }
}
