const cloudinary = require('cloudinary').v2

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'ddirxsks0',
    api_key: '141439916343833',
    api_secret: 'bUHXokUBvYDyVuwbXBqcI8ajfT8'
})

exports.uploads = (file) =>{
    return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) =>{
    resolve({url: result.url, id: result.public_id})
    }, {resource_type: "auto"})
    })
}