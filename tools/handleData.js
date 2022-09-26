module.exports = {
  responseJSON: (isOK, obj) => {
    return {
      info: {
        ...obj
      },
      status: isOK? "OK":"error"
    }
  }
}
