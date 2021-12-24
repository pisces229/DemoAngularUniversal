import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerTransferStateModule, // <- 讓 server 可以傳遞狀態
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
