import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';


const app = express();

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({ 
        cloud_name: 'ddeyy19fg', 
        api_key: '651795777644846', 
        api_secret: 'RZJDAmmvavmn7MU8IHQSY8CA6SY'
    });

mongoose.connect("mongodb+srv://farashsaquib97:763n6pD5orhkrPpO@cluster0.42dh53w.mongodb.net/", {dbName: "Node_Mastery_Course"}).then(() => console.log("MongoDB connected successfully....!")).catch((err) => console.log(err));

// rendering ejs file
app.get('/', (req, res) => {
  res.render('index.ejs',{url:null});
});

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const imageSchema = new mongoose.Schema({
    filename: String,
    public_id: String,
    imageUrl: String,
});   

const File = mongoose.model('cloudinary', imageSchema);

app.post('/upload', upload.single('file'), async (req, res)=> {
 const file = req.file.path
 const cloudinaryResponse = await cloudinary.uploader.upload(file, {
   folder: 'Node_Mastery_Course',
 });

 // Save file information to MongoDB
 const db = await File.create({
   filename: req.file.filename,
   public_id: cloudinaryResponse.public_id,
   imageUrl: cloudinaryResponse.secure_url
 });
 
 res.render('index.ejs', {url: cloudinaryResponse.secure_url});
 // Optionally, you can send a response back to the client

//  res.json({message: "File uploaded successfully", cloudinaryResponse  });
})

const PORT = 1010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

