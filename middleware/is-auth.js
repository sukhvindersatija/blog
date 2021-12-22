const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
  const token=req.get('Authorization').split(" ")[1];
  let decodedToken;
  try{
    console.log(token);
    decodedToken=jwt.verify(token,'secretkey');

  }catch(err){
    err.statusCode=500;
    throw err;
  }
  if(!decodedToken){
    const error=new Error('Not authenticated');
    error.statusCode=401;
    throw error;
  }
  req.userId=decodedToken.userId;
  next();
}
