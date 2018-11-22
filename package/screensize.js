import {Session} from 'meteor/session'

const onWindowResize = function() {
  const instance = Template.instance()
  const width = $(window).width()
  let size = 'LARGE'
  if (width <= 600) {
    size = 'SMALL'
  }
  else if (width <= 992) {
    size = 'MEDIUM'
  }
  Session.set('apiRtcScreenSize', size)
  console.log('Screen size is '+size+'.')
}
onWindowResize()

const throttledOnWindowResize = _.throttle(onWindowResize, 200, {
  leading: false
})

$(window).resize(throttledOnWindowResize)

Template.registerHelper('isScreenSizeSmall', function() {
  return Session.get('screenSize') === 'SMALL'
})

Template.registerHelper('isScreenSizeMedium', function() {
  return Session.get('screenSize') === 'MEDIUM'
})

Template.registerHelper('isScreenSizeLarge', function() {
  return Session.get('screenSize') === 'LARGE'
})
