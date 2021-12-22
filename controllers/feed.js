const Post=require('../models/post');
const User=require('../models/user');

exports.getPosts = (req, res, next) => {
  const page=req.query.page||1;
  const perPage=2;
  Post.find().countDocuments().then(count=>{
    Post.find().skip((page-1)*perPage).limit(perPage).then(posts=>{
      res.status(200).json({message:'Fetched Post',posts:posts,totalItems:count});
    }).catch(err=>{
    if(!err.statusCode){
      err.statusCode=500;
    }
    next(err);
  })
}).catch(err=>{
    if(!err.statusCode){
      err.statusCode=500;
    }
    next(err);
  })
  // res.status(200).json({
  //   posts: [{
  //     _id:'1',
  //     title: 'First Post',
  //     content: 'This is the first post!',
  //     imageUrl:'images/duck.jpg',
  //     creator:{
  //       author:'Sukhvinder'
  //     },
  //     date:new Date()
  //     }]
  // });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl='images/duck.jpg';
  let creator;
  const post=new Post({
    title:title,
    content:content,
    imageUrl:imageUrl,
    creator:req.userId
  });
  post.save().then(result=>{
    console.log('saved');
    return User.findById(req.userId);
  }).then(user=>{
    creator=user;
    user.posts.push(post);
    return user.save();
  }).then(result=>{res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator:{_id:creator._id,name:creator.name}
    }
  )}

    ).catch(err=>{
    if(!err.statusCode){
      err.statusCode=500;
    }
    next(err);
    console.log(err)
  });
};

exports.getPost=(req,res,next)=>{
  const postId=req.params.postId;
  Post.findOne({_id:postId}).then(result=>{
    if(result){
      res.status(200).json({message:'Post found',post:result});
    }
    // const error=new Error("Couldn't find the Post");
    // error.statusCode=404;
    // throw(error)

  })
  .catch(err=>{
    if(!err.statusCode){
      err.statusCode=500;
    }
    next(err);
  })
}

exports.deletePost=(req,res,next)=>{
  const postId=req.params.postId;

  Post.findById(postId).then(post=>{
    if(!post){
      const error=new Error("could not find post");
      error.statusCode=404;
      throw error;
    }
    console.log()
    if(post.creator.toString()!==req.userId){
      const error=new Error("not authenticated!");
      error.statusCode=403;
      throw error;
    }
  return Post.findByIdAndRemove({_id:postId})}).then(result=>{
    return User.findById(req.userId)
  }).then(user=>{
    user.posts.pull(postId);
    return user.save()
  }).then(result=>{
    res.status(200).json({
      message:'Post Deleted'
    });
  }).catch(err=>{
    console.log(err)
    next(err);
  });


}
  // Create post in db
