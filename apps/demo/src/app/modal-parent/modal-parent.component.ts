import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-modal-parent',
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss'],
})
export class ModalParentComponent {
  val;
  @Input() dismiss;

  doStuff() {
    console.log('DISMISS');
    this.val();
  }

  logEvent(event) {
    console.log(event);
  }
}
