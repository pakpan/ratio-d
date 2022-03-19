'use strict';

const getUserId = async (twitter_handle, client) => {
  const response = await client.v2.userByUsername(twitter_handle);
  return response.data.id;
};

const hasBeenRatiod = (tweet_response) => {
  if (parseInt(tweet_response.data.public_metrics.reply_count) > parseInt(tweet_response.data.public_metrics.like_count)){
    return true
  }
  else {
    return false
  }
}

module.exports.hello = async (event, context, callback) => {
  const AWS = require('aws-sdk')

  const ssmClient = new AWS.SSM();
  
  const params = {
    Name: 'Twitter_API_Key', /* required */
    WithDecryption: true
  };

  const stuff = await ssmClient.getParameter(params).promise();
  const twitter_key = stuff.Parameter.Value;
  const { TwitterApi } = require('twitter-api-v2');
  const client = new TwitterApi(twitter_key);
  //console.log(event)
  const twitter_handle = event.queryStringParameters.handle
  //console.log(twitter_handle)
  const user_id = await getUserId(twitter_handle, client);
  const user_timeline = await client.v2.userTimeline(user_id, {exclude: ['replies', 'retweets']});
  //const page1 = await user_tweets.next()
  const user_tweets = user_timeline._realData.data
  // const actual_tweet = user_timeline._realData.data[8].id
  
  let a = twitter_handle + ' has not been ratio\'d';
  for(const tweet of user_tweets){
    const get_tweet = await client.v2.singleTweet(tweet.id, {
    'tweet.fields': [
        'created_at',
        'public_metrics',
    ]
    });
    if(hasBeenRatiod(get_tweet)) {
      a = twitter_handle + ' got ratio\'d on ' + get_tweet.data.created_at;
    }
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      ratio: a
    }),
  };
  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};