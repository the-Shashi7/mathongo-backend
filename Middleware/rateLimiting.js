const { createClient  } = require('redis');

const client = createClient({
  password: 'laUNSSwjXSTtfLnTf0DZIMnxAVbu3K3U',
  socket: {
      host: 'redis-13123.c305.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 13123
  }
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();


const rateLimit = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const reqsDone = Number(await client.get(`user-${userId}`));
  if(reqsDone>10){
    const stTime = await client.get(`time-${userId}`);
    var difference = new Date(stTime) - Date.now();
    var hoursDifference = Math.floor(difference/1000/60/60);
    if(hoursDifference>=1){
      await client.set(`user-${userId}`, 1);
      await client.set(`time-${userId}`, Date.now().toString());
      next();
    }else{
      return res.status(401).json({ message: "Request quota exceeded" });
    }
  }else{
    await client.set(`user-${userId}`, reqsDone+1);
    next(); 
  }
  
};

module.exports = rateLimit;
