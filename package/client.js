import { Template } from 'meteor/templating'
import './dependancies'
import {apiRTC } from './external/apiRTC-v2.0.3.min.debug'
import './client.html'

Template.ApiRtc.onRendered(() => {

  var session = null,
      webRTCClient = null,
      connectedUsersList = [],
      incomingCallId = 0;

  // apiRTC initialization
  apiRTC.init({
    apiKey : "6d5d9e0862e0b118590b248fca093740",
    // apiCCId : "1",
    onReady : Handlers.sessionReadyHandler
  })

  // display
  webRTCClient = apiRTC.session.createWebRTCClient({
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
})

Template.ApiRtc.helpers({
  helper() {
    const instance = Template.instance()
  }
})

Template.ApiRtc.events({
  'click .js-teb-apirtc-address-button'(event) {
    const instance = Template.instance()
    instance.$(".addressBook").toggle()
  }
})
