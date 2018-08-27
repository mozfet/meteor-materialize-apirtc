import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions'

checkNpmVersions({
  'react': '0.14.x'
}, 'my:awesome-package')
