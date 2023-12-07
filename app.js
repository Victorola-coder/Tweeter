$(document).ready(function () {
  const $composeBox = $('#compose-box');
  const $tweetInput = $('#tweet-input');
  const $charCounter = $('#char-counter');
  const $composeForm = $('#compose-form');
  const $tweetsContainer = $('#tweets-container');
  const $scrollTopBtn = $('#scroll-top-btn');

  // Dummy data for initial tweets
  const tweets = [];

  // Event listener for composing tweets
  $('#compose-btn').click(function () {
    $composeBox.toggleClass('hidden');
    $tweetInput.focus();
  });

  // Event listener for typing in the Compose Tweet textarea
  $tweetInput.on('input', function () {
    const remainingChars = 140 - $tweetInput.val().length;
    $charCounter.text(remainingChars);

    if (remainingChars < 0) {
      $charCounter.addClass('over-limit');
      $tweetInput.val($tweetInput.val().substring(0, 140)); // Truncate the text if it exceeds 140 characters
    } else {
      $charCounter.removeClass('over-limit');
    }

    // Disable textarea if character limit is reached or empty
    $tweetInput.prop(
      'disabled',
      remainingChars <= 0 || $tweetInput.val().trim() === ''
    );
  });

  // Event listener for submitting tweets
  $composeForm.submit(function (e) {
    e.preventDefault();

    const newTweetText = $tweetInput.val();

    if (newTweetText.trim() === '' || newTweetText.length > 140) {
      alert('Invalid tweet! Please check the character limit.');
    } else {
      const username = 'VickyJay'; // Replace with actual user authentication
      const tagname = username.toLowerCase(); // Replace with actual user tagname
      const createdAt = new Date().toLocaleString();

      const newTweet = {
        username,
        tagname,
        text: newTweetText,
        createdAt,
        likes: 0,
        retweets: 0,
        likedBy: [],
      };

      tweets.unshift(newTweet);
      renderTweets();
      $tweetInput.val('');
      $charCounter.text('140').removeClass('over-limit');
      $tweetInput.prop('disabled', false); // Enable textarea after submitting a valid tweet
      $composeBox.addClass('hidden');
    }
  });

  // Event listener for scrolling to top
  $scrollTopBtn.click(function () {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  // Event listener for scrolling
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $scrollTopBtn.show();
    } else {
      $scrollTopBtn.hide();
    }
  });

  // Event listener for liking a tweet
  $tweetsContainer.on('click', '.like-btn', function () {
    const index = $(this).data('index');
    const tweet = tweets[index];

    if (tweet.likedBy.includes('VickyJay')) {
      // If the user already liked the tweet, unlike it
      tweet.likes--;
      tweet.likedBy = tweet.likedBy.filter((user) => user !== 'VickyJay');
    } else {
      // If the user hasn't liked the tweet, like it
      tweet.likes++;
      tweet.likedBy.push('VickyJay');
    }

    renderTweets();
  });

  // Event listener for retweeting
  $tweetsContainer.on('click', '.retweet-btn', function () {
    const index = $(this).data('index');
    const originalTweet = tweets[index];

    const retweetText = `RT @${originalTweet.username}: ${originalTweet.text}`;
    const username = 'VickyJay'; // Replace with actual user authentication
    const createdAt = new Date().toLocaleString();

    const retweet = {
      username,
      text: retweetText,
      createdAt,
      likes: 0,
      retweets: 0,
      likedBy: [],
    };

    tweets.unshift(retweet);
    originalTweet.retweets++;
    renderTweets();
  });

  // Event listener for deleting a tweet
  $tweetsContainer.on('click', '.delete-btn', function () {
    const index = $(this).data('index');
    tweets.splice(index, 1);
    renderTweets();
  });

  // Event listener for editing a tweet
  $tweetsContainer.on('click', '.edit-btn', function () {
    const index = $(this).data('index');
    const tweet = tweets[index];
    const updatedText = prompt('Edit your tweet:', tweet.text);

    if (updatedText !== null && updatedText.trim() !== '') {
      tweet.text = updatedText;
      renderTweets();
    }
  });

  // Function to render tweets
  function renderTweets() {
    $tweetsContainer.empty();

    tweets.forEach((tweet, index) => {
      const $tweetDiv = $('<div class="tweet">');
      $tweetDiv.append(`<p><strong>${tweet.username}</strong></p>`);

      // Add tagname if available
      if (tweet.tagname) {
        $tweetDiv.append(`<p class="tagname">@${tweet.tagname}</p>`);
      }

      $tweetDiv.append(`<p>${tweet.text}</p>`);
      $tweetDiv.append(
        `<div class="tweet-footer">${timeAgo(tweet.createdAt)}</div>`
      );
      $tweetDiv.append(`<div class="tweet-likes">
                          <span class="like-btn ${
                            tweet.likedBy.includes('VickyJay') ? 'active' : ''
                          }" data-index="${index}">❤️ ${tweet.likes}</span>
                          <span class="retweet-btn ${
                            tweet.retweets > 0 ? 'active' : ''
                          }" data-index="${index}">🔁 ${tweet.retweets}</span>
                          <button class="delete-btn" data-index="${index}">Delete</button>
                          <button class="edit-btn" data-index="${index}">Edit</button>
                      </div>`);
      $tweetDiv.append(
        `<div class="tweet-liked-by">${
          tweet.likedBy.length > 0
            ? `Liked by: ${tweet.likedBy.join(', ')}`
            : ''
        }</div>`
      );
      $tweetsContainer.append($tweetDiv);
    });
  }

  // Function to calculate time ago
  function timeAgo(date) {
    const now = new Date();
    const tweetDate = new Date(date);
    const diff = now - tweetDate;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  }

  // Initial render
  renderTweets();
});
