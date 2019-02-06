import {Component} from '@angular/core';

@Component({
  selector: 'yacovi-footer',
  templateUrl: 'yacovi-footer.component.html',
  styleUrls: ['yacovi-footer.component.css']
})
export class YacoviFooterComponent {

  constructor() {
  }

  getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

}
