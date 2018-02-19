
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import {OnInit, Component} from "@angular/core";
import {DataEmitterService} from "../services/data-emitter.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  config: ToasterConfig;

  constructor(public dataEmit: DataEmitterService,
              private toasterService: ToasterService
  ) {
    dataEmit.$updateArray.subscribe(data =>
    {
      let [content, title, type, timeout] = data;
      const toast: Toast = {
        type: type? type : 'info',
        title: title? title : 'Notification',
        body: content,
        timeout: timeout? timeout : 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.toasterService.pop(toast);
    });
  }

  ngOnInit() {
    this.config = new ToasterConfig({
      positionClass: 'toast-top-left',
      timeout: 5000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'fade',
      limit: 5,
    });
  }

}


