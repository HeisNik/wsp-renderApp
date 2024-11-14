

const checkUser = (req, res, next) => {
  const user = req.query.user
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

module.exports = {checkUser}