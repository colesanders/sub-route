import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { RouteTree } from '../../../../../libs/sub-routes/src/lib/subroute.model';

@Component({
  selector: 'modal-routes-child-one',
  templateUrl: './modal-child-one.component.html',
  styleUrls: ['./modal-child-one.component.scss'],
})
export class ModalChildOneComponent implements OnInit {
  @Output() cancel = new EventEmitter();

  constructor(public routeTree: RouteTree) { }

  ngOnInit() {}

}
