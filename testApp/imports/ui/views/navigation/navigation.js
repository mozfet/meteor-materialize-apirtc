// imports
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import './navigation.html'

// on created
Template.navigation.onCreated(() => {
  const instance = Template.instance()
})

// on rendered
Template.navigation.onRendered(() => {
  const instance = Template.instance()
  $('#mobile-nav').sidenav()
})

// helpers
Template.navigation.helpers({
  helper() {
    const instance = Template.instance();
    return 'help'
  }
})

// events
Template.navigation.events({

  //on click class
  'click .className'(event, instance) {
  }
})

// on destroyed
Template.navigation.onDestroyed(() => {
  const instance = Template.instance();
})
