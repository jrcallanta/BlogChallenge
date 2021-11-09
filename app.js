const express = require('express')
const bodyparser = require('body-parser')
const lodash = require('lodash')
const port = 3000
const app = express()

const data = require(__dirname + '/views/content/data.js')

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.get("/home", (req, res)=>{
  res.render("main", {
    selected: 0,
    contents: data.contents,
    pageTitle: data.contents[0]['title'],
    posts: data.posts
  })
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

app.get("/posts/:postTitle", (req,res)=>{
  const titleQuery = req.params.postTitle;
  data.posts.forEach((post)=>{
    console.log(lodash.lowerCase(post['title']))
    console.log(lodash.lowerCase(titleQuery))

    if(lodash.lowerCase(post['title']) == lodash.lowerCase(titleQuery)){
      console.log('match found')
      console.log(post)
      res.render("post", {selected: 5, contents: data.contents, pageTitle: "Some Post", post: post})
    }
  })
})

app.post("/api/new-post", (req,res)=>{
  const date = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    dateStyle: "short"
  });
  const postTitle = req.body.newPostTitle
  const postDate = date.format(Date.now());
  const newPost = {
    id: postDate,
    date: postDate,
    title: req.body.newPostTitle,
    body: req.body.newPostBody
  };
  data.posts.push(newPost)
  res.redirect("/home")
})

app.post("/api/delete-post", (req,res)=>{
  const postToDelete = JSON.parse(req.body.postObject)
  console.log(req.body)
  console.log(postToDelete)

  const i = data.posts.findIndex((object)=>{
    return JSON.stringify(object) == JSON.stringify(postToDelete)
  })
  if(i > -1)
    data.posts.splice(i,1);
  res.redirect("/home")
})



app.listen(port, ()=>{
  console.log("Listening on port " + port);
})
