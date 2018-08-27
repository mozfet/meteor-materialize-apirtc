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
  console.log('Other user id:', instance.data.otherUserId)

  // frequently check for other users number
  const interval = Meteor.setInterval(() => {
    Meteor.call('apirtc.getNumber', instance.data.otherUserId, (error, result) => {
      if (error) {
        console.warn('cannot get number for other user')
      }
      if (!error) {
        console.log('other user number', result)
        instance.state.set('otherUserNumber', result)
        Meteor.clearInterval(interval)
      }
    })
  }, 1000)

  // enable the start button reactively
  instance.autorun(() => {
    if (instance.state.get('apiRrcSessionReady') &&
        instance.state.get('otherUserNumber')) {
      instance.state.set('enableStartCallButton', true)
    }
  })
})

Template.ApiRtc.onRendered(() => {
  const instance = Template.instance()

  // apiRTC initialization
  instance.apiRTC = apiRTC
  apiRTC.init({
    apiKey : "6d5d9e0862e0b118590b248fca093740",
    apiCCId : Meteor.userId(),
    onReady() {
      console.log('ApiRtc is Ready:', apiRTC.session.apiCCId)
      instance.state.set('userNumber', apiRTC.session.apiCCId)
      Meteor.call('apirtc.setNumber', apiRTC.session.apiCCId)

      // prepare for making a call
      instance.state.set('apiRrcSessionReady', true)
      instance.webRTCClient = apiRTC.session.createWebRTCClient({
        status : "status"
      })
      instance.webRTCClient.setAllowMultipleCalls(true)
      instance.webRTCClient.setVideoBandwidth(300)
      instance.webRTCClient.setUserAcceptOnIncomingCall(true)

      // event hanlder
      apiRTC.addEventListener('userMediaSuccess', () => {
        console.log('Event - userMediaSuccess')
      })

      // event hanlder
      apiRTC.addEventListener('incomingCall', (event) => {
        console.log('Event - incomingCall: ', event.detail.callId)
        instance.state.set('incomingCallId', event.detail.callId)
        instance.state.set('enableAcceptCallButton', true)
        instance.state.set('enableRejectCallButton', true)
      })

      // event hanlder
      apiRTC.addEventListener('userMediaError', () => {
        console.log('Event - userMediaError')
      })

      // event hanlder
      apiRTC.addEventListener('hangup', () => {
        console.log('Event - hangup')
        instance.state.set('enableEndCallButton', false)
        instance.state.set('enableAcceptCallButton', false)
        instance.state.set('enableRejectCallButton', false)
      })

      // event hanlder
      apiRTC.addEventListener('remoteStreamAdded', () => {
        console.log('Event - remoteStreamAdded')
      })

      apiRTC.addEventListener('remoteStreamAdded', () => {
        console.log('Event - localStreamRemoved')
      })

      // event hanlder
      apiRTC.addEventListener('connectedUsersListUpdate', (event) => {
        const userList = event.detail.usersList
        const userNumber = instance.state.get('otherUserNumber')
        // if (_.contains(userList, userNumber)) {
        //   console.log('other user is connected')
        //   instance.state.set('isOtherUserConnected', true)
        // }
        // else {
        //   console.log('other user is not connected')
        //   instance.state.set('isOtherUserConnected', false)
        // }
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
  'click .js-teb-apirtc-start-call-button'(event) {
    const instance = Template.instance()
    const number = instance.state.get('otherUserNumber')
    console.log(`starting call to number ${number}`)
    instance.webRTCClient.call(number)
    instance.state.set('enableEndCallButton', true)
  },
  'click .js-teb-apirtc-end-call-button'(event) {
    const instance = Template.instance()
    console.log(`end call`)
    instance.webRTCClient.hangUp()    
  },
  'click .js-teb-apirtc-accept-call-button'(event) {
    const instance = Template.instance()
    console.log(`accept call`)
    const incomingCallId = instance.state.get('incomingCallId')
    instance.webRTCClient.acceptCall(incomingCallId)
    instance.state.set('enableEndCallButton', false)
    instance.state.set('enableAcceptCallButton', false)
    instance.state.set('enableRejectCallButton', false)
    instance.state.set('enableEndCallButton', true)
  },
  'click .js-teb-apirtc-reject-call-button'(event) {
    const instance = Template.instance()
    console.log(`reject call`)
    const incomingCallId = instance.state.get('incomingCallId')
    instance.webRTCClient.refuseCall(incomingCallId)
    instance.state.set('enableEndCallButton', false)
    instance.state.set('enableAcceptCallButton', false)
    instance.state.set('enableRejectCallButton', false)
  }
})
