/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const MAX_CHARS = 140;

const renderTweets = (tweets) => {
  $('#tweets-container').empty();

  for (const tweet of tweets) {
    $('#tweets-container').prepend(createTweetElement(tweet));
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
      <p class="date">${timeago.format(tweet.created_at)}</p>
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
  $('#post-tweet').submit(function(event) {
    event.preventDefault();
    
    const textField = $('#tweet-text').val();

    if (!textField) {
      return alert('Error: Please enter a valid message to post tweet.');
    }

    if (textField.length > MAX_CHARS) {
      return alert('Error: Exceeded maximum alloted characters for tweet.');
    }

    $.ajax({
      url: "/tweets",
      type: "POST",
      data: $(this).serialize()
    })
    .then(() => {
      $(this).trigger('reset');
      loadTweets();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
  });

  const loadTweets = () => {
    $.ajax({
      url: "/tweets",
      type: "GET"
    })
    .then((data) => {
      renderTweets(data);
    })    
    .catch((err) => {
      console.log("Error:", err);
    });
  }

  loadTweets();
});