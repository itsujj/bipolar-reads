const multer = require('multer')
const path = require('path');

// multer disk storage engine configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'pdfs')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.contentTitle + '.pdf')
    }
})
   
const upload = multer(
  { storage: storage ,
    fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      if(ext !== '.pdf') {
          return cb(new Error('Only pdfs are allowed'))
      }
      cb(null, true)
  },
    limits:{fileSize:50589999}
})

module.exports = upload