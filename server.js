const express = require('express');
const PORT = process.env.PORT || 4000;
const app = express();
const axios = require('axios').default;


const fs = require('fs')

let text = fs.readFileSync('./public/assets/text/composers.txt','utf8')

let newText = text.replace(/\s\s+/g," ")

fs.writeFileSync('./public/assets/text/new-composers.txt',newText)


app.get('/',(req,res)=>{
    res.send("testing...")
})


app.listen(PORT,()=>{
    console.log("listening on port: " + PORT);
})




