import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  msg: String = "Welcome to Imageland!";

  ngOnInit() {
    this.test();
  }

  test() {
    var y = this.sqRoot(4);
  }

  sqRoot(x: number): number {
    return x^2;
  }
}
