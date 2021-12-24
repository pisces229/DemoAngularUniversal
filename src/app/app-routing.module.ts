import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    //component: HomeComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'about',
    //component: AboutComponent,
    loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
