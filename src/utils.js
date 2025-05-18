const updateSession = async (req, data) => {
  const { user } = data
  const session = req.session

  if (user) {
    req.session.user = {
      _id: user._id ?? session.user._id,
      avatar: user.avatar ?? session.user._id,
      username: user.username ?? session.user._id,
      firstName: user.first_name ?? session.user._id
    }
  }

  await req.session.save()
}

module.exports = { updateSession }
