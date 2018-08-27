// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import './private.html'

// on created
Template.private.onCreated(() => {
  const instance = Template.instance()
  instance.state = {
    otherUserId: new ReactiveVar()
  }
  instance.autorun(() => {
    Meteor.userId()
    Meteor.call('findOtherUserId', (error, result) => {
      if (error) {
        throw new Meteor.Error('method', error)
      }
      else {
        console.log('set reactive other user id:', result)
        instance.state.otherUserId.set(result)
      }
    })
  })
})

// on rendered
Template.private.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.private.helpers({
  otherUserId() {
    const instance = Template.instance()
    return instance.state.otherUserId
  }
})

// events
Template.private.events({

  //on click class
  'click .className'(event, instance) {
  }
})

// on destroyed
Template.private.onDestroyed(() => {
  const instance = Template.instance();
})
