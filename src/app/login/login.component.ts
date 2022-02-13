import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() isLogged: EventEmitter<boolean> = new EventEmitter();

  constructor() {
    this.isLogged.emit(false);
  }

  login() {
    this.isLogged.emit(true);
  }

  logout() {
    this.isLogged.emit(false);
  }

  ngOnInit(): void {
  }

}
