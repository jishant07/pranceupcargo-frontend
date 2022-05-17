// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig :{
    apiKey: "AIzaSyA3NztBcAEmwlD411cChV-naztaH3ky5Qk",
    authDomain: "pranceup-cargo.firebaseapp.com",
    projectId: "pranceup-cargo",
    storageBucket: "pranceup-cargo.appspot.com",
    messagingSenderId: "660075239942",
    appId: "1:660075239942:web:b439b57652979973604187",
    measurementId: "G-DDG8ML3S12"
  },
  // devURL:"http://localhost:5001/pranceup-cargo/us-central1/api"
  devURL:"https://us-central1-pranceup-cargo.cloudfunctions.net/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
