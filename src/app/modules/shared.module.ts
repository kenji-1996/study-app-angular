import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditTestComponent} from "../components/edit-test/edit-test.component";
import {ImportsModule} from "./imports.module";

@NgModule({
  imports: [
      ImportsModule,
  ],
  declarations: [
    EditTestComponent,
  ],
  providers: [
  ],

  exports: [
    EditTestComponent,
  ]
})
export class SharedModule {}
