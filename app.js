const express = require('express')
const bodyparser = require('body-parser')
const lodash = require('lodash')
const port = 3000
const app = express()

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

// const data = require(__dirname + '/views/content/data.js')
const data = require(__dirname + '/views/content/db.js')
data.connect()

app.get("/", async (req, res)=>{
  await data.refreshPosts()
  // await data.loadLorem()
  res.redirect("/home")
})

app.get("/home", async (req, res)=>{
  if(data.contents){
    await data.refreshPosts()
    res.render("main", {selected: 0, contents: data.contents, pageTitle: data.contents[0]['title'], posts: data.posts})
  } else {
    console.log("redirecting...")
    res.redirect("/")
  }
})

app.get("/about", (req, res)=>{
  res.render("main", {selected: 1, contents: data.contents, pageTitle: data.contents[1]['title']})
})

app.get("/contact", (req, res)=>{
  res.render("main", {selected: 2, contents: data.contents, pageTitle: data.contents[2]['title']})
})

app.get("/compose", (req,res)=>{
  res.render("compose", {selected: 3, contents: data.contents, pageTitle: "New Post"})
})

app.get("/posts/:postID", async (req,res)=>{
  const post = await data.getPost(req.params.postID)
  if(post){
    console.log('match found')
    console.log(post)
    res.render("post", {selected: 5, contents: data.contents, pageTitle: post['title'], post: post})
  }
})

app.post("/api/new-post", async (req,res)=>{
  const date = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    dateStyle: "short"
  });
  const newPost = {
    date: date.format(Date.now()),
    title: req.body.newPostTitle,
    body: req.body.newPostBody
  };
  console.log(newPost)
  await data.newPost(newPost)
  res.redirect("/home")
})

app.post("/api/delete-post", async (req,res)=>{
  const postToDelete = req.body.postID
  console.log(postToDelete)
  await data.deletePost(postToDelete)
  res.redirect("/home")
})



app.listen(process.env.PORT || port, ()=>{
  console.log("Server has started succesfully!");
})
