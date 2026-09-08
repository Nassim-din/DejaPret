import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Chaque étape s'ouvre en haut de page, comme sur un téléphone.
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
  ],
};
