import {Component, OnInit} from '@angular/core';
import {CustomAdalService} from '@app/services';
import {RTCService} from "@app/services/rtc.service";

@Component({
  selector: 'yacovi-header',
  templateUrl: 'yacovi-header.component.html',
  styleUrls: ['yacovi-header.component.css']
})
export class YacoviHeaderComponent implements OnInit {

  constructor(
    private adalService: CustomAdalService,
  ) {

  }

  ngOnInit() {
    this.adalService.handleWindowCallback();
  }

  logout() {
    this.adalService.logOut();
  }

  isNavbarVisible() {
    return this.adalService.isAuthenticated();
  }

}
