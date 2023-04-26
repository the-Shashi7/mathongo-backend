const shortId = require("shortid");
const urlModel = require("../Model/urlSchema");
const userModel = require('../Model/userSchema');
const { createClient } = require('redis');

const client = createClient({
  password: 'laUNSSwjXSTtfLnTf0DZIMnxAVbu3K3U',
  socket: {
      host: 'redis-13123.c305.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 13123
  }
});

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const shortUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const value = await client.get(url);
    if(value){
        return res.status(200).json({message:"url come from cache (redis) memory" , url: value });
    }
    if (!url) {
      res.status(400).json({ message: "Url required" });
    }
    const shortedUrl = shortId(6);
    let urlResult = await urlModel({
      url: url,
      shortUrl: shortedUrl,
      UserId: req.userId,
    });
    await urlResult.save();
    const user = await userModel.findOne({_id:req.userId});
    if(user){
        user.urls.push(urlResult._id);
        await user.save();
    }

    await client.set(url, shortedUrl);
    res.status(200).json({url: urlResult });
  } catch (error) {
    console.log(error)
    res.json({ message: "Url not shorted" });
  }
};

const getShortUrl = async (req, res) => {
  try {
    const url = await urlModel.findOne({ shortUrl: req.params.shortUrl });
    //url not found
    if (!url) res.status(404).json({ message: "url not found" });
    //url Found then redirect to original url.
    res.status(200).redirect(url.url);
  } catch (error) {
    console.log("message: ", error);
  }
};

module.exports = { shortUrl, getShortUrl };
