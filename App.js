const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./model/blogs")
const bcryptjs = require("bcryptjs")

const app = express()
app.use(cors())
app.use(express.json())

const generateHashedPassword = async(password) => {
const salt=await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)
}

mongoose.connect("mongodb+srv://Annajimmy:annajimmychirackal@cluster0.moqndmi.mongodb.net/blogsdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/post", async(req, res) => {
    let input = req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog=new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})


app.listen(8000, () => {
    console.log("server started")
})