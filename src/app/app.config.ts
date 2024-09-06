import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FavouriteService } from './services/favourite.service';
import { ProductService } from './services/product.service';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
        ProductService,
        FavouriteService,
        importProvidersFrom(BrowserModule, FormsModule),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(
            routes,
            withRouterConfig({onSameUrlNavigation: 'reload'}),

        ),
        {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
        provideAnimations()
    ]
};