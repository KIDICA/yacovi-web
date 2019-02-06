import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {YacoviAlertService} from "src/app/core/modules/yacovi-alert/yacovi-alert.service";
import {YacoviAlertComponent} from "src/app/core/modules/yacovi-alert/yacovi-alert.component";

@NgModule({
  imports: [CommonModule],
  declarations: [
    YacoviAlertComponent
  ],
  providers: [YacoviAlertService],
  exports: [YacoviAlertComponent]
})
export class YacoviAlertModule {}
