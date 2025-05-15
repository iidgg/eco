const protected = (req, res, next) => {
  if (req.session.user) return next()
  res.redirect(`/auth/signin?r=${encodeURIComponent(req.originalUrl)}`)
}

module.exports = protected
