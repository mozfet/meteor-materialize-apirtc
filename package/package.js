Package.describe({
  name: 'mozfet:materialize-apirtc',
  summary: 'MaterializeCSS styled WebRTC Implementation using ApiRTC for Meteor.',
  version: '1.0.2',
  git: 'https://github.com/mozfet/meteor-materialize-apirtc.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.6');
  api.use([
    'ecmascript',
    'ejson',
    'jquery',
    'underscore'
  ]);
  api.use([
    'templating',
    'blaze',
    'reactive-dict',
    'mozfet:materialize-icons@1.1.1',
    'fourseven:scss@4.5.4'
  ], 'client');
  api.use([
    'mongo'
  ], 'client');
  api.mainModule('server.js', 'server')
  api.mainModule('client.js', 'client')
  api.addFiles(['style.scss'], 'client');
});

// Npm.depends({
//   github: '0.2.4'
// });

Package.onTest(function(api) {
  api.versionsFrom('METEOR@1.6');
  api.use([
    'templating',
    'blaze',
    'reactive-dict',
    'mozfet:materialize-icons@0.1.1',
    'fourseven:scss@4.5.4'
  ], 'client');
  api.use([
    'mozfet:meteor-materialize-apirtc',
    'ecmascript',
    'ejson',
    'jquery',
    'underscore',
    'velocity:meteor-stubs',
    'meteortesting:mocha',
    'tmeasday:check-npm-versions@0.3.2'
  ]);
  api.mainModule('server_test.js', 'server')
  api.mainModule('client_test.js', 'client')
  api.addFiles(['style.scss'], 'client');
});
