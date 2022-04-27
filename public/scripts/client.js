/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1650906829166
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1650993229166
  }
];

const renderTweets = (tweets) => {
  for (const tweet of tweets) {
    $('#tweets-container').append(createTweetElement(tweet));
  }
}

const createTweetElement = (tweet) => {
  let $tweet = (`
  <article class="tweet">
    <div class="header">
      <div>
        <img src="${tweet.user.avatars}">
        <h3>${tweet.user.name}</h3>
      </div>
      <p class="handle">${tweet.user.handle}</p>
    </div>
    <div class="message">
      <p>${tweet.content.text}</p>
    </div>
    <div class="footer">
      <p class="date">${tweet.created_at}</p>
      <div class="icons">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </div>
  </article>
  `);

  return $tweet;
};

$(() => {
  renderTweets(data);

  $('.new-tweet').submit(function(event) {
    event.preventDefault();

    $.ajax({
      url: "/tweets",
      type: "POST",
      data: $('form').serialize()
    })
    .then((data) => {
      console.log("Data sent over:", data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
  });


});