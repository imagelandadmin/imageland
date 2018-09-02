import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular-boost';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  msg: String = "default";

  constructor(private apollo: Apollo) { 

  }

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`{welcome}`,
      })
      .valueChanges.subscribe(result => {
        console.log("begin")
        console.log(result)
        console.log(result.data)
        console.log(result.errors)
        console.log("end")
      });
  }

}
