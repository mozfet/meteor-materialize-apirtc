import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import '/imports/ui/layouts/master/masterLayout.js'
import '/imports/ui/views/navigation/navigation.js'
import '/imports/ui/views/home/home.js'
import '/imports/ui/views/private/private.js'
import '/imports/ui/views/notFound/notFound.js'

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('masterLayout', {
      navigation: 'navigation',
      main: 'home'
    })
  },
})

FlowRouter.route('/private', {
  name: 'private',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action: function(params, queryParams) {
    BlazeLayout.render('masterLayout', {
      navigation: 'navigation',
      main: 'private'
    })
  }
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('masterLayout', { main: 'notFound' })
  },
}

AccountsTemplates.configureRoute('changePwd')
AccountsTemplates.configureRoute('forgotPwd')
AccountsTemplates.configureRoute('resetPwd')
AccountsTemplates.configureRoute('signIn')
AccountsTemplates.configureRoute('signUp')
AccountsTemplates.configureRoute('verifyEmail')
