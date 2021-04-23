import {Component} from '@angular/core';
import { SubRouteFacade } from '../../../../../libs/sub-routes/src/lib/sub-route.facade';

@Component({
  selector: 'modal-routes-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public subRoute: SubRouteFacade) {
  }

}
