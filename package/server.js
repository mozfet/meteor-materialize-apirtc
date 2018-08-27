import { Mongo } from 'meteor/mongo'

const ApiRtcUsers = new Mongo.Collection('api_rtc_users')

Meteor.methods({
  'apirtc.getNumber'(meteorUserId) {
    const doc = ApiRtcUsers.findOne(meteorUserId)
    if (doc && doc.number) {
      return doc.number
    }
    else {
      throw new Meteor.Error('apirtc',
          'Invalid user or user does not yet have a number')
    }
  },
  'apirtc.setNumber'(number) {
    const userId = Meteor.userId()
    console.log(`User ${userId} has number ${number}`)
    ApiRtcUsers.upsert(userId, {$set:{number}})
  }
})
