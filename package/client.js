import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions'
import './external/apiRTC-v2.0.3.min'
// import './external/apiRTC-v2.0.3.min.debug'
import './client.html'

checkNpmVersions({
  "materialize-css": "1.0.0-rc.2"
}, 'mozfet:materialize-apirtc')

Template.ApiRtc.onCreated(() => {
  const instance = Template.instance()
  instance.state = new ReactiveDict()

  // init button states
  instance.state.set('enableStartCallButton', false)
  instance.state.set('enableEndCallButton', false)
  instance.state.set('enableAcceptCallButton', false)
  instance.state.set('enableRejectCallButton', false)

  // get user
})

Template.ApiRtc.onRendered(() => {
  const instance = Template.instance()

  // apiRTC initialization
  apiRTC.init({
    apiKey : "6d5d9e0862e0b118590b248fca093740",
    apiCCId : instance.data.otherUser,
    onReady() {
      console.log('ApiRtc is Ready:', apiRTC.session.apiCCId)

      // display
      const webRTCClient = apiRTC.session.createWebRTCClient({
        status : "status"
      })

      // event hanlder
      apiRTC.addEventListener('userMediaSuccess', () => {
        console.log('Event - userMediaSuccess')
      })

      // event hanlder
      apiRTC.addEventListener('incomingCall', () => {
        console.log('Event - incomingCall')
      })

      // event hanlder
      apiRTC.addEventListener('userMediaError', () => {
        console.log('Event - userMediaError')
      })

      // event hanlder
      apiRTC.addEventListener('hangup', () => {
        console.log('Event - hangup')
      })

      // event hanlder
      apiRTC.addEventListener('remoteStreamAdded', () => {
        console.log('Event - remoteStreamAdded')
      })

      // event hanlder
      apiRTC.addEventListener('connectedUsersListUpdate', () => {
        console.log('Event - connectedUsersListUpdate')
      })

      // event hanlder
      apiRTC.addEventListener('webRTCClientCreated', () => {
        console.log('Event - webRTCClientCreated')
      })
    }
  })
})

Template.ApiRtc.helpers({
  disableStartCallButton() {
    const instance = Template.instance()
    return !instance.state.get('enableStartCallButton')
  },
  disableEndCallButton() {
    const instance = Template.instance()
    return !instance.state.get('enableEndCallButton')
  },
  disableAcceptCallButton() {
    const instance = Template.instance()
    return !instance.state.get('enableAcceptCallButton')
  },
  disableRejectCallButton() {
    const instance = Template.instance()
    return !instance.state.get('enableRejectCallButton')
  }
})

Template.ApiRtc.events({
  'click .js-teb-apirtc-address-button'(event) {
    const instance = Template.instance()
    instance.$(".addressBook").toggle()
  }
})
