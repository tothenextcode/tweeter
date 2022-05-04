/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const MAX_CHARS = 140;
let headerTop;

$(() => {
  // Set header height top value for scrolling to check when back-to-top button should appear 
  headerTop = $('.avatar').offset().top;

  $('#post-tweet').submit(postTweet);
  $('.write-tweet').on('click', toggleComposeTweet);
  $(window).scroll(toggleBackToTopButton);
  $('.back-to-top').on('click', scrollBackTop);

  loadTweets();
});

const renderTweets = (tweets) => {
  const $tweetsContainer = $('#tweets-container');
  $tweetsContainer.empty();
  
  // Reset form
  $tweetsContainer.siblings('section').find('#post-tweet').trigger('reset');

  for (const tweet of tweets) {
    $tweetsContainer.prepend(createTweetElement(tweet));
  }
};

const loadTweets = () => {
  $.get("/tweets")
    .then((data) => {
      renderTweets(data);
    })    
    .catch((err) => {
      console.log("Error:", err);
    });
};

const postTweet = function(event) {
  event.preventDefault();
  const textField = $(this).children('#tweet-text').val().trim();

  if (!textField) {
    showError(true);
    return $('.error p').text('Error: Please enter a valid message to post tweet.');
  }

  if (textField.length > MAX_CHARS) {
    showError(true);
    return $('.error p').text(`Error: Exceeded maximum alloted characters of ${MAX_CHARS} for tweet.`);
  }

  $.post("/tweets", $(this).serialize())
    .then(() => {
      showError(false);
      loadTweets();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
};

// Force escape on text to prevent Cross-site Scripting
const safeText = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
      <p>${safeText(tweet.content.text)}</p>
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

const toggleComposeTweet = function() {
  $newTweet = $(this).closest('nav').siblings('main').find('.new-tweet');
  $newTweet.slideToggle();

  if (!$newTweet.is(':visible')) $('#tweet-text').focus();
};

// Highlight tweet content in red on show error
const showError = (flag) => {
  $error = $('#error');
  $tweetText = $('#tweet-text');
  
  if (flag) {
    $error.addClass('error');
    $tweetText.addClass('border-error');
    $error.removeClass('no-error');
    $tweetText.removeClass('line-border');
    $tweetText.focus();
    return;
  }

  $error.removeClass('error border-error');
  $tweetText.removeClass('border-error');
  $error.addClass('no-error');
  $tweetText.addClass('line-border');
};

// Back to top button appears once past avatar top 
const toggleBackToTopButton = function() {
  if ($(this).scrollTop() > headerTop) {
    $('.write-tweet').hide();
    $('.back-to-top').show();
  } else {
    $('.write-tweet').show();
    $('.back-to-top').hide();
  }
};

const scrollBackTop = function() {
  window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
  $('.new-tweet').slideDown();
  $('#tweet-text').focus();
};