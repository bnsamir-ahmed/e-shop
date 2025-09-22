// import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
// import {
//   EnvironmentInjector,
//   inject,
//   Inject,
//   runInInjectionContext,
// } from '@angular/core';
// import { AuthService } from '../login/auth/auth.service';
// import { catchError } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const injector = Inject(EnvironmentInjector);
//   return runInInjectionContext(injector, () => {
//     const auth = inject(AuthService);

//     const reqWithHeader = req.clone({
//       headers: new HttpHeaders({}),
//     });
//     return next(reqWithHeader).pipe(
//         catchError((error : HttpErrorResponse))
//     )
//   });
// };
