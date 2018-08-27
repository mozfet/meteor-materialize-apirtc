// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import './private.html'

// on created
Template.private.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.private.onRendered(() => {
  const instance = Template.instance()
})

// helpers
Template.private.helpers({
  otherUserId() {
    const instance = Template.instance()
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
