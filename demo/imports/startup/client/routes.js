import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout'
import Toast from '/imports/ui/components/toast'

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
})

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

AccountsTemplates.configure({
  onSubmitHook: ( error, state ) => {
    if ( !error && state === 'signIn' ) {
      console.log('signin success')
      Toast.show(['account'], 'Sign-in OK')
    }
    else {
      Toast.show(['account'], 'Sign-in Failed')
    }
  },
  onLogoutHook: ( error, state ) => {
    console.log('signout success')
    Toast.show(['account'], 'Sign-out OK')
  }
})
