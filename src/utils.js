const updateSession = async (req, data) => {
  const { user } = data
  const session = req.session

  if (user) {
    if (!req.session.user) {
      req.session.user = {}
    }

    req.session.user = {
      _id: user._id || session.user._id,
      avatar: user.avatar || session.user.avatar,
      username: user.username || session.user.username,
      firstName: user.firstName || session.user.firstName
    }
  }

  await req.session.save()
}

module.exports = { updateSession }
