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

const escape = function (str) {
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
      <p>${escape(tweet.content.text)}</p>
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

const showError = (flag) => {

  if (flag) {
    $('#error').addClass('error');
    $('#tweet-text').addClass('border-error');
    $('#error').removeClass('no-error');
    $('#tweet-text').removeClass('line-border');
    $('#tweet-text').focus();
    return;
  }

  $('#error').removeClass('error border-error');
  $('#tweet-text').removeClass('border-error');
  $('#error').addClass('no-error');
  $('#tweet-text').addClass('line-border');
};

$(() => {
  $('#post-tweet').submit(function(event) {
    event.preventDefault();
    
    const textField = $('#tweet-text').val().trim();

    if (!textField) {
      showError(true);
      return $('.error p').text('Error: Please enter a valid message to post tweet.');
    }

    if (textField.length > MAX_CHARS) {
      showError(true);
      return $('.error p').text(`Error: Exceeded maximum alloted characters of ${MAX_CHARS} for tweet.`);
    }

    $.ajax({
      url: "/tweets",
      type: "POST",
      data: $(this).serialize()
    })
    .then(() => {
      showError(false);
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

  $('.write-tweet').on('click', () => {
    if ($('.new-tweet').is(':visible')) {
      $('.new-tweet').slideUp();
    } else {
      $('.new-tweet').slideDown();
      $('#tweet-text').focus();
    }
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > $('h2').offset().top) {
      $('.write-tweet').hide();
    } else {
      $('.write-tweet').show();
    }
  });

  loadTweets();
});