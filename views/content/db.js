const mongoose = require('mongoose')
// const url = "mongodb://localhost:27017/blogDB";
const url = "mongodb+srv://jrsc:!cLUSTERjr4!@mycluster.leoii.mongodb.net/blogDB"

/* SCHEMAS ***********/

const postSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
})

const Post = mongoose.model("post", postSchema);

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: String
})

const Content = mongoose.model("content", contentSchema);

/* FUNCTIONS **********/

exports.connect = async function(){
  mongoose.connect(url, {useNewUrlParser: true});
  exports.contents = await Content.find({}).exec()
  if(exports.contents.length == 0){
    console.log("no data found. loading...")
    await loremPageContent()
    await loremPostsData()
    console.log("finished loading: " + exports.contents)
  } else {
    console.log("data already loaded: " + exports.contents)
  }
}

exports.refreshPosts = async function(){
  exports.posts = await Post.find({})
}

exports.newPost = async function(postObject){
  const newPost = new Post(postObject);
  await newPost.save()
  console.log("Post Saved: " + newPost)
}
exports.deletePost = async function(postID){
  Post.findOneAndRemove({_id: postID}, (err, result)=>{
    console.log("Post Deleted: " + result)
  })
}
exports.getPost = async function(postID){
  return await Post.findOne({_id: postID}).exec()
}



/* LOREM DATA LOADERS *************/

async function loadLorem(){
  await loremPageContent()
  await loremPostsData()
  exports.loaded = true;
}

async function loremPageContent(){
  const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
  const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
  const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

  const homeContents = new Content({title: "Home", text: homeStartingContent});
  await homeContents.save()
  const aboutContents = new Content({title: "About", text: aboutContent});
  await aboutContents.save()
  const contactContents = new Content({title: "Contact", text: contactContent});
  await contactContents.save()

  exports.contents = await Content.find().exec()
}

async function loremPostsData(){
  const date = new Intl.DateTimeFormat("en", {timeStyle: "short", dateStyle: "short" });

  const sampleLongPost = new Post({
    date: date.format(Date.now()),
    title: "This Is A Sample Post",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Magna sit amet purus gravida quis blandit turpis cursus in. Feugiat in fermentum posuere urna nec. Sed ullamcorper morbi tincidunt ornare massa eget. Et magnis dis parturient montes. Massa tempor nec feugiat nisl pretium fusce id velit ut. Accumsan sit amet nulla facilisi morbi tempus iaculis. Orci dapibus ultrices in iaculis. Facilisis leo vel fringilla est. Nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est. Eget dolor morbi non arcu risus quis varius. /n Nec feugiat nisl pretium fusce id. Eget mauris pharetra et ultrices neque ornare aenean euismod. Habitant morbi tristique senectus et netus et. Tortor dignissim convallis aenean et tortor. Morbi blandit cursus risus at ultrices mi tempus. Viverra nam libero justo laoreet sit amet cursus. Ornare massa eget egestas purus viverra accumsan. Leo integer malesuada nunc vel risus commodo viverra. Tristique senectus et netus et malesuada fames ac turpis egestas. Id neque aliquam vestibulum morbi blandit. Ut porttitor leo a diam sollicitudin tempor id eu. Congue quisque egestas diam in arcu cursus euismod quis."
  })
  await sampleLongPost.save()

  const sampleShortPost = new Post({
    date: date.format(Date.now()),
    title: "This Is A Short Post",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper quis lectus nulla at volutpat. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Mollis nunc sed id semper risus. Pellentesque elit eget gravida cum sociis natoque penatibus et. Integer quis auctor elit sed vulputate mi sit."
  })
  await sampleShortPost.save()

  exports.posts = []
  Post.find((err,result)=>{
    result.forEach((post, i) => {
      exports.posts.push(post)
    })
  });
}
