# meteor-materialize-apirtc
MaterializeCSS styled WebRTC Implementation using ApiRTC for Meteor.

# Installation

0. Create Meteor project
```
$ mkdir testApp
$ cd testApp
$ meteor create . --full
```

1. In project folder
```
$ meteor npm install materialize-css --save
$ meteor npm install --save bcrypt
$ meteor add accounts-base
$ meteor add accounts-password
$ meteor add accounts-ui
$ meteor add useraccounts:flow-routing
$ meteor add useraccounts:materialize
$ meteor add zodiase:material-design-icons-fonts
$ meteor add fourseven:scss
$ meteor add mozfet:materialize-apirtc
```

2. Add ```scss-config.json``` to project folder:
```
{
  "includePaths": [
    "{}/node_modules/materialize-css/sass/"
  ]
}
```

3. Copy [Roboto font](https://fonts.google.com/specimen/Roboto) woff2 fonts to public/fonts folder in project folder.

4. Add ```main.scss``` to client folder in project folder:
```
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto'), local('Roboto-Regular'), url(fonts/Roboto-Regular.woff2), format('woff2');
}

html, body {
  font-family: 'Roboto', sans-serif;
}

@import "../node_modules/materialize-css/sass/materialize.scss";
@import "{mozfet:materialize-apirtc}/style.scss";
```

# Usage

In blaze template in client side code:
```
{{> ApiRtcVideoChat}}
```
