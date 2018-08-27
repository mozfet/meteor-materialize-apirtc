// create two users
const adminEmails = ['peter@test.com', 'susan@test.com']
for (let email of adminEmails) {
  const isExistingUser = Meteor.users.findOne({'emails.address': email})
	if(!isExistingUser) {

		// create user
		const user = Accounts.createUser({
			email: email,
			password: '1234'
		})
		console.log('Created user', user)
	}
}
