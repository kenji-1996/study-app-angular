import { Component, OnInit } from '@angular/core';
import {AuthenticateService} from "../../services/authenticate.service";

@Component({
  selector: 'app-router-outlet',
  templateUrl: './router-outlet.component.html',
  styleUrls: ['./router-outlet.component.scss']
})
export class RouterOutletComponent implements OnInit {

  constructor(private auth: AuthenticateService) { }

  ngOnInit() {
  }

}
