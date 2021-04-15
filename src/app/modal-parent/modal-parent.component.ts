import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'app-modal-parent',
  templateUrl: './modal-parent.component.html',
  styleUrls: ['./modal-parent.component.scss'],
})
export class ModalParentComponent {
  val;
  @Input() dismiss;
  // @Input() set dismiss(val) {
  //   console.log(val);
  //   console.log(typeof val);
  //   val();
  //   this.val = val;
  // }
  // @Output() dismiss = new EventEmitter();

  doStuff(){
    console.log('DISMISS');
    this.val();
  }
}
