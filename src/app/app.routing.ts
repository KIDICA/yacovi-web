﻿import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './views/home';
import { LoginComponent } from './views/login';
import {CustomAdalGuard} from '@app/core/guards/customAdal.guard';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [CustomAdalGuard] },
    { path: 'login', component: LoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const AppRouteModule = RouterModule.forRoot(appRoutes);
