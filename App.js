const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const { blogmodel } = require("./model/blogs")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

const generateHashedPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password, salt)
}

mongoose.connect("mongodb+srv://Annajimmy:annajimmychirackal@cluster0.moqndmi.mongodb.net/blogsdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/post", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})


app.post("/login", (req, res) => {
    let input = req.body
    blogmodel.find({ "email": req.body.email }).then(
        (response) => {
            if (response.length > 0) {
                let dbPassword = response[0].password

                console.log(dbPassword)
                bcryptjs.compare(input.password, dbPassword, (error, isMatch) => {
                    if (isMatch) {

                        jwt.sign({ "email": input.emailid }, "blog-app", { expiresIn: "1d" },
                            (error, token) => {
                                if (error) {
                                    res.json({ "status": "unable to create token" })
                                } else {
                                    res.json({ "status": "token germinated","userid":response[0]._id,"token":token })
                                }

                            }

                        )

                    } else {
                        res.json({ "status": "Incorrect password"})
                    }
                })
            } else {
                res.json({ "status": "user not found" })
            }
        }
    ).catch()

})

app.listen(8000, () => {
    console.log("server started")
})