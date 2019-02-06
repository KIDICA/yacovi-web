import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { YacoviAlertService } from '../../../services';
import {YaCoviAlertTypesAware} from "src/app/core/modules/yacovi-alert/yacovi-alert.enum";

@Component({
    selector: 'yacovi-alert',
    templateUrl: 'yacovi-alert.component.html',
    styleUrls: ['yacovi-alert.component.css']
})
@YaCoviAlertTypesAware
export class YacoviAlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: YacoviAlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
