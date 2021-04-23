import { Component, OnInit } from '@angular/core';
import { RouteTree } from '../../../../../libs/sub-routes/src/lib/subroute.model';

@Component({
  selector: 'modal-routes-child-two',
  templateUrl: './modal-child-two.component.html',
  styleUrls: ['./modal-child-two.component.scss'],
})
export class ModalChildTwoComponent implements OnInit {
  constructor(public routeTree: RouteTree) {
  }

  ngOnInit() {}

}
