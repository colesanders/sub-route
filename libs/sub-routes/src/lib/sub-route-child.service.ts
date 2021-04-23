import {SubRouteService} from './sub-route.service';

export class SubRouteChildService {
  constructor(private subRoute: SubRouteService) {
  }

  push(route) {
    this.subRoute.push(route);
  }

  pop(data?, role?) {
    this.subRoute.pop(data, role);
  }
}
