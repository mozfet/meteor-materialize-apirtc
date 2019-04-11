# meteor-materialize-apirtc
Meteor MaterializeCSS styled WebRTC Implementation using [ApiRTC](https://apirtc.com/).

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
$ meteor add fourseven:scss
$ meteor add useraccounts:flow-routing
$ meteor add useraccounts:materialize
$ meteor add zodiase:material-design-icons-fonts

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
5. Set viewport in /client/head.html
```
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
```

# Usage

In Meteor Settings file:
```
{
  "public": {
    "ApiRTC": {
      "key": "YOUR_API_RTC_KEY"
    }
  }
}
```

In blaze template client side code:
```
<audio id="myCustomRinger" preload="auto" autoplay="false" loop="true"
  src="/household_telephone_old_bell_ring_002.mp3">
</audio>
{{>ApiRtc otherUserId="12345678" ringerElementSelector="#myCustomRinger"}}
```
