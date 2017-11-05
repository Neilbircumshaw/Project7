//requiring the modules, calling express the app var and requiring the config file for the Twit module so it works with my access tokens.

const express = require("express");
const Twit = require("twit");
const app = express();
const config = require("./config")

//using express and pug.
app.use("/static", express.static("public"));
app.set("view engine","pug");

//calling twit module with the config file info in to the var T - ya know, for convienence.
const T = new Twit(config);

//middleward function that gets the diect messages sent from a friend, along with other details -  get 5.
function messageMiddleware(req,res,next) {
T.get('direct_messages', { count:5 }, function(err, data, response) {
   //Do some basic error handling here
   if(err) {
        return next(err)
   }
//assign the data from twitter with is in JSON to the var messages for easy reference.
let messages = data;

//create an array to store the values which are added to the array by looping over the "text" key in the JSON provided by Twitter and pusing the data to the array
let fiveMessages = []
for (let i = 0; i < messages.length; i++){
    fiveMessages.push(messages[i].text)
};
//grab each item from the array and assign it to a varible passing it through the req paramater to use in the app.get near the bottom of the code.
 req.messages1 = fiveMessages[0];
 req.messages2 = fiveMessages[1];
 req.messages3 = fiveMessages[2];
 req.messages4 = fiveMessages[3];
 req.messages5 = fiveMessages[4];


 //same sort of thing but this gets the users profile pic.

 let profilePictureMess = []
 for (let i = 0; i < messages.length; i++){
    profilePictureMess.push(messages[i].sender.profile_image_url)};


  req.profilePictureMess1 = profilePictureMess[0];
  req.profilePictureMess2 = profilePictureMess[1];
  req.profilePictureMess3 = profilePictureMess[2];
  req.profilePictureMess4 = profilePictureMess[3];
  req.profilePictureMess5 = profilePictureMess[4];

  //grab senders username.

  req.userNameMess = messages[0].sender.name;

  //grab the time for each message

  let messageTimeArr = []
  for (let i = 0; i < messages.length; i++){
     messageTimeArr.push(messages[i].created_at)};


   req.messageTimeArr1 = messageTimeArr[0];
   req.messageTimeArr2 = messageTimeArr[1];
   req.messageTimeArr3 = messageTimeArr[2];
   req.messageTimeArr4 = messageTimeArr[3];
   req.messageTimeArr5 = messageTimeArr[4];

   //make sure you run next() to move on

 return next();

   });
};

//this middleware gets the timeline status of the user, among other info.

function tweetMiddleware(req,res,next) {
T.get('statuses/user_timeline', { screen_name: "Neil_Bircumshaw", count: 5 }, function(err, data, response) {
   //Do some basic error handling here
   if(err) {
        return next(err)
   }


    //if no error with the twitter api we keep going
   let tweets = data;
   //same as before, crate array, store info - this time it's text
   let fiveTweets = []
   for (let i = 0; i < tweets.length; i++){
       fiveTweets.push(tweets[i].text)};
   //once the loop is finished we take the req parameter from the middleware function and give it a property 'tweets(1/2/3/4/5)' do this for all 5 of the tweets grabbing them from the array.
    req.tweets1 = fiveTweets[0];
    req.tweets2 = fiveTweets[1];
    req.tweets3 = fiveTweets[2];
    req.tweets4 = fiveTweets[3];
    req.tweets5 = fiveTweets[4];

//same thing as before but this time it's grabbing he retweet count for each of the tweets.
    let tweetsRetweetCountArr = []
    for (let i = 0; i < tweets.length; i++){
        tweetsRetweetCountArr.push(tweets[i].retweet_count)};

    req.retweets1 = tweetsRetweetCountArr[0];
    req.retweets2 = tweetsRetweetCountArr[1];
    req.retweets3 = tweetsRetweetCountArr[2];
    req.retweets4 = tweetsRetweetCountArr[3];
    req.retweets5 = tweetsRetweetCountArr[4];

//again but for favorite count.

    let tweetsFavoriteCountArr = []
    for (let i = 0; i < tweets.length; i++){
        tweetsFavoriteCountArr.push(tweets[i].favorite_count)};

    req.favCount1 = tweetsFavoriteCountArr[0];
    req.favCount2 = tweetsFavoriteCountArr[1];
    req.favCount3 = tweetsFavoriteCountArr[2];
    req.favCount4 = tweetsFavoriteCountArr[3];
    req.favCount5 = tweetsFavoriteCountArr[4];

//again but for when the tweet was created.

    let tweetsTimeArr = []
    for (let i = 0; i < tweets.length; i++){
        tweetsTimeArr.push(tweets[i].created_at)};

    req.time1 = tweetsTimeArr[0];
    req.time2 = tweetsTimeArr[1];
    req.time3 = tweetsTimeArr[2];
    req.time4 = tweetsTimeArr[3];
    req.time5 = tweetsTimeArr[4];

    //user profile info
    req.userName = tweets[0].user.screen_name;
    req.name = tweets[0].user.name;
    req.profileImage = tweets[0].user.profile_image_url;
    req.userCount = tweets[0].user.friends_count;



    //don't forget to call .next() to go to the next handler
    return next();
   });
};

//This piece of middleware will get the first 5 follows from my twitter, as well as their profile pics and screen name
function followMiddleware(req,res,next) {
T.get('friends/list', { screen_name: "Neil_Bircumshaw", count: 5 }, function(err, data, response) {

   if(err) {
        return next(err)
   }
// data is the data in the get method that is returned back from Twitter in JSON format. So I looked through the JSON and used dot notation to access the data I needed, in this case "users" and assigned it to "follows"
   let follows = data.users;
//made a empty array to store the looped values in, in this case the names of 5 follows (it's 5 because the count is 5 in the middleware function.)
   let fiveFollows = []
   for (let i = 0; i < follows.length; i++){
       fiveFollows.push(follows[i].name)
   };
//assigning each of the 5 names from the array a value so then I can target each individually and give them a varible name to use in my pug template.
    req.names1 = fiveFollows[0];
    req.names2 = fiveFollows[1];
    req.names3 = fiveFollows[2];
    req.names4 = fiveFollows[3];
    req.names5 = fiveFollows[4];

//same as above but with the users picture image url
    let profilePictureArr = []
    for (let i = 0; i < follows.length; i++){
        profilePictureArr.push(follows[i].profile_image_url)
    };

     req.profilePicture1 = profilePictureArr[0];
     req.profilePicture2 = profilePictureArr[1];
     req.profilePicture3 = profilePictureArr[2];
     req.profilePicture4 = profilePictureArr[3];
     req.profilePicture5 = profilePictureArr[4];

//same again but with screen name.

     let screenNameArr = []
     for (let i = 0; i < follows.length; i++){
         screenNameArr.push(follows[i].screen_name)
     };

      req.screenName1 = screenNameArr[0];
      req.screenName2 = screenNameArr[1];
      req.screenName3 = screenNameArr[2];
      req.screenName4 = screenNameArr[3];
      req.screenName5 = screenNameArr[4];

//make sure to return next() to move on.
    return next();
   });
};

//Now that we have the middleware set up, we can use it in any route we want. By doing that we ensure that the //middleware functions are run before the actual route handler
app.get('/', tweetMiddleware, followMiddleware, messageMiddleware, (req,res) => {

     //This is a list of all the varibles I want to pass through to the pug document using the req paramater. I have access to these from the middleware functions.
   res.render("index", {
     follows1: req.names1, follows2: req.names2, follows3: req.names3, follows4: req.names4, follows5: req.names5,
     profilePicture1: req.profilePicture1, profilePicture2: req.profilePicture2, profilePicture3: req.profilePicture3, profilePicture4: req.profilePicture4, profilePicture5: req.profilePicture5,
     screenName1:req.screenName1,screenName2:req.screenName2,screenName3:req.screenName3,screenName4:req.screenName4,screenName5:req.screenName5,
     tweets1: req.tweets1,tweets2: req.tweets2,tweets3: req.tweets3,tweets4: req.tweets4,tweets5: req.tweets5,
     retweets1: req.retweets1,retweets2: req.retweets2,retweets3: req.retweets3,retweets4: req.retweets4,retweets5: req.retweets5,
     favCount1: req.favCount1,favCount2: req.favCount2,favCount3: req.favCount3,favCount4: req.favCount4,favCount5: req.favCount5,
     time1:req.time1,time2:req.time2,time3:req.time3,time4:req.time4,time5:req.time5,
     userName: req.userName, name:req.name, profileImage:req.profileImage,userCount:req.userCount,
     messages1:req.messages1,messages2:req.messages2,messages3:req.messages3,messages4:req.messages4,messages5:req.messages5,
     profilePictureMess1:req.profilePictureMess1,profilePictureMess2:req.profilePictureMess2,profilePictureMess3:req.profilePictureMess3,profilePictureMess4:req.profilePictureMess4,profilePictureMess5:req.profilePictureMess5,
     userNameMess:req.userNameMess,
     messageTime1:req.messageTimeArr1,messageTime2:req.messageTimeArr2,messageTime3:req.messageTimeArr3,messageTime4:req.messageTimeArr4,messageTime5:req.messageTimeArr5,
   })
});


app.listen(3000, () => {
console.log("The application is running on localhost:3000 baby!")

});
