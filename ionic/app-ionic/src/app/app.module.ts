import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';


@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],

  providers: [

    // 🔥 HTTP moderno con interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }

  ],

  bootstrap: [AppComponent],
})

export class AppModule {}
