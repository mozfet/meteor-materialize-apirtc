// imports
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import './external/apiRTC-4.1.24.min'
import './client.html'

// template states in the instance.states reactive directory
const states = {
  isSessionReady: 'isSessionReady',
  otherUserNumber: 'otherUserNumber',
  errorMessage: 'errorMessage',
  isReadyToEndCall: 'isReadyToEndCall',
  isReadyToStartCall: 'isReadyToStartCall'
}

// messages
const messages = {
  errorRegistration: 'Registration Error',
  errorConnection: 'Connection Error'
}

// events
const events = {
  incomingCall: 'incomingCall',
  localStreamAvailable: 'localStreamAvailable',
  streamAdded: 'streamAdded',
  streamRemoved: 'streamRemoved',
  userMediaError: 'userMediaError',
  desktopCapture: 'desktopCapture',
  hangup: 'hangup',
  accepted: 'accepted',
  declined: 'declined',
  statusChange: 'statusChange',
  disconnectionWarning: 'disconnectionWarning',
  error: 'error',
  response: 'response'
}

// abstracted placeholder for internationalization
function translate(message, data) {
  return message + data?data:''
}


// add media stream in div -
// copied from https://dev.apirtc.com/demo/peertopeer_call/js/peertopeer-call.js
function addStreamInDiv(stream, divId, mediaEltId, style, muted) {
  console.log('addStreamInDiv:',stream, divId, mediaEltId, style, muted);

  var streamIsVideo = stream.hasVideo();
  console.error('addStreamInDiv - hasVideo? ' + streamIsVideo);

  var mediaElt = null,
      divElement = null,
      funcFixIoS = null,
      promise = null;

  if (streamIsVideo === 'false') {
      mediaElt = document.createElement("audio");
  } else {
      mediaElt = document.createElement("video");
  }

  mediaElt.id = mediaEltId;
  mediaElt.autoplay = true;
  mediaElt.muted = muted;
  mediaElt.style.width = style.width;
  mediaElt.style.height = style.height;

  funcFixIoS = function () {
      var promise = mediaElt.play()

      console.log('funcFixIoS')
      if (promise !== undefined) {
          promise.then(function () {
              // Autoplay started!
              console.log('Autoplay started')
              console.error('Audio is now activated')
              document.removeEventListener('touchstart', funcFixIoS)

              $('#status').empty().append('iOS / Safari : Audio is now activated')

          }).catch(function (error) {
              // autoplay was prevented.
              console.error('Autoplay was prevented')
          });
      }
  }

  stream.attachToElement(mediaElt);

  divElement = document.getElementById(divId)
  divElement.appendChild(mediaElt)
  promise = mediaElt.play()

  if (promise !== undefined) {
    promise.then(function () {
        // Autoplay started!
        console.log('Autoplay started')
    }).catch(function (error) {
      console.log('os name:', apiRTC.osName)
      switch(apiRTC.osName) {
        case  'iOS':
        case  'Mac OS':
          console.info('iOS : Autoplay was prevented, activating touch event to start media play');
          //Show a UI element to let the user manually start playback

          //In our sample, we display a modal to inform user and use touchstart event to launch "play()"
          document.addEventListener('touchstart',  funcFixIoS);
          console.error('WARNING : Audio autoplay was prevented by iOS, touch screen to activate audio');
          $('#status').empty().append('WARNING : iOS / Safari : Audio autoplay was prevented by iOS, touch screen to activate audio');
          break
        default:
          console.error('Autoplay was prevented');
          break
      }
    })
  }
}

// call listeners
// called on acceptance of an invitation or when starting a call with a contact
function attachCallListeners(instance) {

  // on call accepted
  instance.apiRtcCall.on(events.accepted, () => {
    console.log('callAccepted')

    // disable the start call button
    instance.state.set(states.isReadyToStartCall, false)

    // enable the end call button
    instance.state.set(states.isReadyToEndCall, true)
  })

  // on call declined
  instance.apiRtcCall.on(events.declined, reason => {
    console.log('callDeclined, reason:', reason)

    // enable the start call button
    instance.state.set(states.isReadyToStartCall, true)

    // disable the end call button
    instance.state.set(states.isReadyToEndCall, false)
  })

  // on response
  instance.apiRtcCall.on(events.response, () => {
    console.log('other user responded')
  })

  // on local stream available for call
  instance.apiRtcCall.on(events.localStreamAvailable, stream => {
    console.log('localStreamAvailable')

    // generate element id
    const localMediaStreamId = `local-media-${stream.getId()}`

    // cleanup
    instance.$(`#${localMediaStreamId}`).remove()

    // add stream to DOM
    addStreamInDiv(stream, 'local-container', localMediaStreamId,
        {width : "160px", height : "120px"}, true)

    // on stream stop - e.g. screensharing call from another user
    stream.on('stopped', () => {
      console.log('Stream stopped.')

      // cleanup
      instance.$(`#${localMediaStreamId}`).remove()
    })
  })

  // on remote stream added
  instance.apiRtcCall.on(events.streamAdded, stream => {
    console.log('call stream added:', stream)

    // generate element id
    const remoteMediaStreamId = `remote-media-${stream.getId()}`

    // cleanup
    instance.$(`#${remoteMediaStreamId}`).remove()

    // add stream to DOM
    addStreamInDiv(stream, 'remote-container', remoteMediaStreamId,
        {width : "640px", height : "480px"}, false)

    // on stream stop - e.g. screensharing call from another user
    stream.on('stopped', () => {
      console.log('Stream stopped.')

      // cleanup
      instance.$(`#${remoteMediaStreamId}`).remove()
    })
  })

  // on remote stream removed
  instance.apiRtcCall.on(events.streamRemoved, stream => {

    // remove remote media from the DOM
    instance.$(`#remote-media-${stream.getId()}`).remove()

    // enable the start call button
    instance.state.set(states.isReadyToStartCall, true)

    // disable the end call button
    instance.state.set(states.isReadyToStartCall, false)
  })

  // on call user media error
  instance.apiRtcCall.on(events.userMediaError, event => {
    console.log('userMediaError detected : ', event);
    console.log('userMediaError detected with error : ',
        event.error)

    // checking if tryAudioCallActivated
    if (event.tryAudioCallActivated) {
      console.log('apiRTC will try to fall back to audio only')
    }
    else {
      console.log('no audio fallback')

      // enable the start call button
      instance.state.set(states.isReadyToStartCall, true)

      // disable the end call button
      instance.state.set(states.isReadyToStartCall, false)
    }
  })

  // on disconnect warning
  instance.apiRtcCall.on(events.disconnectionWarning, event => {
    const msg = translate(messages.errorConnection)
    console.error(msg)
    instance.state.set(states.errorMessage, msg)
  })

  // on error
  instance.apiRtcCall.on(events.error, event => {
    const msg = translate(messages.error, event)
    console.error(msg)
    instance.state.set(states.errorMessage, msg)
  })

  // on call desktop capture
  instance.apiRtcCall.on(events.desktopCapture, function (event) {
    console.log('call desktopCapture: ', event);

    // ???
  })

  // on call hangup
  instance.apiRtcCall.on(events.hangup, (from, reason) => {
    console.log('call hangup: ', from, reason)

    // enable the start call button
    instance.state.set(states.isReadyToStartCall, true)

    // disable the end call button
    instance.state.set(states.isReadyToEndCall, false)

    // remove the invitation
    delete instance.apiRtcInvitation

    // remove the call
    delete instance.apiRtcCall
  })
}


// on created
Template.ApiRtc.onCreated(() => {
  const instance = Template.instance()
  console.log('Other user id:', instance.data.otherUserId)

  // initialize state
  instance.state = new ReactiveDict()

  // disable start button
  instance.state.set(states.isReadyToStartCall, false)

  // disable end button
  instance.state.set(states.isReadyToEndCall, false)

  // get api rtc user agent
  instance.userAgent = new apiRTC.UserAgent({
    uri: 'apzkey: 6d5d9e0862e0b118590b248fca093740'
  })

  // get the user id
  const userId = Meteor.userId()

  // register the user
  instance.userAgent.register({id: Meteor.userId()})

      // then
      .then(session => {
        console.log('Registration OK:', session.id)

        // remember the session
        instance.apiRtcSession = session

        // set the user api rtc contact number
        Meteor.call('apirtc.setNumber', session.id, error => {

          // if error
          if (error) {

            // set error message
            const msg = translate(errors.registration, {error})
            console.warn(error)
            instance.state.set(states.errorMessage, msg)
          }

          // else - no error
          else {
            console.log('apiRTC.setnumber completed ok.')

            // on incoming call of the api rtc session
            instance.apiRtcSession.on(events.incomingCall, invitation => {
              console.log('incoming call invitation:', invitation)

              // remember the invitation
              instance.apiRtcInvitation = invitation

              // enable the start button
              instance.state.set(states.isReadyToStartCall, true)

              // enable the end button
              instance.state.set(states.isReadyToEndCall, true)

              // on invitation state change
              invitation.on(events.statusChange, event => {
                console.log('invitation state', event.status)

                // if declined
                if (event.status === apiRTC.INVITATION_STATUS_DECLINED) {
                  console.log('invitation was declined')

                  // remove the invitation
                  delete instance.apiRtcInvitation
                }
              })
            })
          }
        })
      }).catch(error => {
        console.error(error)
      })

  // interval worker function
  const worker = (intervalId) => {

    // if other user number is known
    if (instance.state.get(states.otherUserNumber)) {

      // stop looking for other user number
      Meteor.clearInterval(intervalId)
    }

    // else - user number is unknown
    else {

      // get the user number
      Meteor.call('apirtc.getNumber', instance.data.otherUserId,
          (error, number) => {

            // if error
            if (error) {

              // show error message to user
              const msg = translate(messages.errorRegistration, {error})
              instance.state.set(states.errorMessage, msg)

              // disable the start button
              instance.state.set(states.isReadyToStartCall, false)

              // disable the end button
              instance.state.set(states.isReadyToEndCall, false)
              console.warn(msg)
            }

            // else - no error
            else {
              console.log(`Other user number is ${number}.`)
              instance.state.set(states.otherUserNumber, number)

              // enable start button
              instance.state.set(states.isReadyToStartCall, true)

              // disable end button
              instance.state.set(states.isReadyToEndCall, false)
            }
          })
    }

  }

  // check for other users number every second
  const intervalId = Meteor.setInterval(() => {
    worker(intervalId)
  }, 5000)
  worker(intervalId)
})

// helpers
Template.ApiRtc.helpers({
  isReadyToStart() {
    const instance = Template.instance()
    return instance.state.get(states.isReadyToStartCall)
  },
  startIconAttr() {
    const instance = Template.instance()
    return {
      icon: 'call',
      iconClass: 'medium green-text js-teb-apirtc-start-call-button',
      text: 'Start or accept call.'
    }
  },
  isReadyToEnd() {
    const instance = Template.instance()
    return instance.state.get(states.isReadyToEndCall)
  },
  endIconAttr() {
    const instance = Template.instance()
    return {
      icon: 'call_end',
      iconClass: 'medium red-text js-teb-apirtc-end-call-button',
      text: 'End or reject call.'
    }
  }
})

// events
Template.ApiRtc.events({

  // on click of start call button
  'click .js-teb-apirtc-start-call-button'(event, instance) {
    console.log(`Start call button was clicked.`)

    // if there is an invitation
    if (instance.apiRtcInvitation) {
      console.log('accepting invitation');

      // accept the call
      instance.apiRtcInvitation.accept()

          // then
          .then(call => {
              console.log('invitation accepted, call started', call)

              // remember the call
              instance.apiRtcCall = call

              // disable the start button
              instance.state.set(states.isReadyToStartCall, false)

              // enable the end button
              instance.state.set(states.isReadyToEndCall, true)

              // attach call listerners
              attachCallListeners(instance)
          })
    }

    // else - no invitation
    else {
      console.log('no invitation - starting a new call')

      // get the other user number
      Meteor.call('apirtc.getNumber', instance.data.otherUserId,
          (error, number) => {

            // if number was retrieved
            if (!error && number) {

              // get the other user number
              const number = instance.state.get(states.otherUserNumber)
              console.log('other user number is ', number)

              // start a new call
              const contact = instance.apiRtcSession.getOrCreateContact(number)
              instance.apiRtcCall = contact.call()

              // attach call listeners
              attachCallListeners(instance)
            }
            else {
              console.warn('could not get other user number');
            }
          })
    }
  },

  // on click of end call button
  'click .js-teb-apirtc-end-call-button'(event, instance) {
    console.log(`End call button was clicked.`)

    if (instance.apiRtcCall) {
      console.log(`Hangup`)

      // hangup the call
      instance.apiRtcCall.hangUp()
    }

    else if (instance.apiRtcInvitation) {
      console.log('Decline call invitation.')

      // decline the invitation
      instance.apiRtcInvitation.decline()

      // remove the invitation
      delete instance.apiRtcInvitation

      // enable the start call button
      instance.state.set(states.isReadyToStartCall, true)

      // disable the end call button
      instance.state.set(states.isReadyToEndCall, false)
    }
  }
})
