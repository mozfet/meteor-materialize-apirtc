Meteor.methods({
  findOtherUserId() {
    const users = Meteor.users.find({}/*, {fields: {_id: 1}}*/).fetch()
    const thisUserId = Meteor.userId()
    return _.chain(users)
      .filter((user) => {
        return user._id !== thisUserId
      })
      .first()
      .value()._id
  }
})
