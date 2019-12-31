const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PDF2Pic = require('pdf2pic')
const dbConnect = require("./dbconnect")
const Books = require('./models/bookModel')
const Categories = require('./models/categoryModel')
const upload = require('./multerConfig')
// const cloud = require('./cloudinaryConfig')
const cloudinary = require('cloudinary').v2
const jade = require('jade')

app.use(express.static('static'))


//set view engine
app.set("view engine","jade")

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))

// parse application/json
app.use(bodyParser.json())


app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, access_token');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
  
// Start of functional route handlers
app.get('/',(req,res)=>{
    Books.find({},(err,books)=>{
        if (err) return err
        res.render('index.jade',{books})
    })
})

app.get('/category/:selectedcategory',(req,res)=>{
    var paramArray = req.params.selectedcategory.split("-") 
    var catergoryTerm = ""
    for (var i = 0; i<paramArray.length;i++){
        if (i === 0) {
            catergoryTerm += paramArray[i].charAt(0).toUpperCase() + paramArray[i].slice(1,paramArray[i].length)
        }
        else{
            catergoryTerm += " " + paramArray[i].charAt(0).toUpperCase() + paramArray[i].slice(1,paramArray[i].length)
        }
    }
    Categories.findOne({category_name:catergoryTerm}).populate('books').exec((err,books)=>{
        if (err) throw err
        if (books==null){
            res.render('nobooks.jade')
        }
        else{
            var booksArray = books.books
            res.render('index.jade',{books:booksArray})
        }
    })
})

app.post('/searchapi', (req,res)=>{
    Books.find({title:req.body.searchTerm},(err,books)=>{
        if (err) throw err
        res.render('index.jade',{books})
    })
})

app.post('/upload',upload.single('avatar'), async (req, res, next) => {

    // pdf2pic object configuration
   var pdf2pic = new PDF2Pic({
       density: 100,           // output pixels per inch
       savename: `${req.body.contentTitle}`,   // output file name
       savedir: "./static/images",    // output file location
       format: "png",          // output file format
       size: "600x600"         // output size in pixels
   })

      // send file to cloudinary
      cloudinary.config({
        cloud_name: 'ddirxsks0',
        api_key: '141439916343833',
        api_secret: 'bUHXokUBvYDyVuwbXBqcI8ajfT8'
    })
      
     const pdfPath = req.file.path
     const imagePath = `static/images/${req.body.contentTitle}_1.png`
     const uniqueFilename = req.body.contentTitle

   const pdfImage = await(pdf2pic.convert(__dirname+`/pdfs/${req.body.contentTitle}.pdf`))
   const pdfFile = await(cloudinary.uploader.upload(pdfPath,{ public_id: `pdf/${uniqueFilename}`, tags: `pdf` }))
   const imageFile = await(cloudinary.uploader.upload(imagePath,{ public_id: `image/${uniqueFilename}`, tags: `img` }))
   try{
    console.log("Book being pushed")
    var book = new Books()
    book.title= req.body.contentTitle
    book.author=req.body.author
    book.description=req.body.contentDescription
    book.category= req.body.selectedBookCategory
    book.img_url=imageFile.secure_url
    book.pdf_url=pdfFile.secure_url
    book.save()
    Categories.findOne({ category_name: book.category }, (err,category)=>{
        if (err) throw err
        if (category){
            category.books.push(book.id)
        }
        else{
            var category = new Categories()
            category.category_name = book.category
            category.books.push(book.id)
        }
        category.save()
        // remove pdf file from server
        const fs = require('fs')
        fs.unlinkSync(pdfPath)
        fs.unlinkSync(imagePath)
        res.redirect('/')
    })
   }
   catch(e){
     throw e
   }
})

app.listen(3000,() => console.log('Server running on port 3000'))
