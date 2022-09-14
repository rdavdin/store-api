const {CustomAPIError} = require('../errors/custome-error')
const errorHandlerMiddleware = async (err, req, res, next) => {
  console.log(err.message);
  if(err instanceof CustomAPIError){
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware
