import {Component} from '@angular/core';
import {SubRouteFacade} from '../subRoute/sub-route.facade';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public subRoute: SubRouteFacade) {
  }

}
