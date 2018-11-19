import {_} from 'meteor/underscore'

Meteor.methods({
  findOtherUserId() {
    const users = Meteor.users.find({}, {fields: {_id: 1}}).fetch()
    console.log('all users:', users)
    const thisUserId = Meteor.userId()
    console.log('this user:', thisUserId)
    const otherUserId = _.chain(users)
      .filter((user) => {
        return user._id !== thisUserId
      })
      .first()
      .value()._id
    console.log('other user id:', otherUserId)
    return otherUserId
  }
})
