import { NgModule }             from '@angular/core';
import { HttpModule }           from '@angular/http';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { NgxDatatableModule }   from '@swimlane/ngx-datatable';
import { MaterializeDirective } from 'angular2-materialize';
import { LocalStorageModule }   from 'angular-2-local-storage';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AppComponent }         from '../components/app.component';
import { pageDeclarations }     from './declarations/page.declarations';
import { pipeDeclarations }     from './declarations/pipe.declarations';
import { elementDeclarations }  from './declarations/element.declarations';
import { providerDeclarations } from './declarations/provider.declarations';
import { AppRoutingModule }     from './app-routing.module';

import './rxjs-extensions';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgxDatatableModule,
    SlimLoadingBarModule.forRoot(),
    LocalStorageModule.withConfig({
      prefix: 'man-hour-manager',
      storageType: 'localStorage'
    })
  ],
  declarations: [
    AppComponent,
    MaterializeDirective,
    ...pageDeclarations,
    ...elementDeclarations,
    ...pipeDeclarations,
  ],
  bootstrap: [ AppComponent ],
  providers: [
    ...providerDeclarations
  ]
})
export class AppModule { }
