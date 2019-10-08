'use strict';

const apiKey = 'AIzaSyBxBsXHbC2hu6qRO6NBOcZTvLcoxxChWvA'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';

function clearList(){
    $('#results-list').empty();
}

//--------------------- to hide display and to show display --------------------//

function hide(element){
    //this function will hide a class
    if( !$(element).hasClass('hidden') ){
        $(element).addClass('hidden');
        console.log(`hiding class: ${element}`);
    }
}

function show(element){
    //this function will reverse the "hide" function
    console.log(`Show element ran: ${element}`);
    if( $(element).hasClass('hidden') ){
        $(element).removeClass('hidden');
        console.log(`showing class: ${element}`);
    }
}

function btnSettings(){
    console.log('Settings clicked!');
    $('.max-results').toggleClass('hidden');
    $('.max-results-label').toggleClass('hidden');
}


function formatQueryParams(params) {
    console.log('Formating Query');
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log('Display results');
  console.log(responseJson);
  console.log(responseJson.items[0].snippet);
  console.log('^^^^^^^^^^^^^^^^^^^^^^^');
  console.log(responseJson.items[0].id);
  console.log('^^^^^^^^^^^^^^^^^^^^^^^');
  console.log(responseJson.items[1].id.videoId);

  clearList();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li class="video-info">
        
        <h3>${responseJson.items[i].snippet.title}</h3>
        <iframe class="video" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}"" frameborder="0" allow="autoplay; encrypted-meda gyroscope; picture-in-picture" allowfullscreen></iframe>
        <ul class="link-boxes">
            <li><a href="https://youtubemp3.today/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${responseJson.items[i].id.videoId}">Download Audio</a></li>
            <li><a href="https://onlinevideoconverter.party/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${responseJson.items[i].id.videoId}">Download Video</a></li>
        </ul>
      
      </li>`
    )};
 
  $('#results').removeClass('hidden');
};

function getYouTubeVideos(query, maxResults) {
    console.log(`max: ${maxResults}`);
    let tempMaxResults = $('#js-max-results').val();

    hide('.error-message');

    if( !(isNaN(tempMaxResults)) ){
        if(tempMaxResults>1 && tempMaxResults<50){
            console.log(`New Max Amount: ${tempMaxResults}`);
            maxResults = tempMaxResults;
        }
        else if(tempMaxResults<0 || tempMaxResults>50){
            console.log(`Out of range: ${tempMaxResults}`);
            $('#js-error-message').text(`Invalid Entry: out of range.`);
            clearList();
            show('.error-message');
            return;
        }
        else if(tempMaxResults==1){
            console.log('1 entered. Invalid.');
            $('#js-error-message').text(`Invalid Entry: enter more than one.`);
            clearList();
            show('.error-message');
            return;
        }
    }
    else{
        console.log('Invalid Entry: not a number');
        $('#js-error-message').text(`Invalid Entry: not a number.`);
        clearList();
        show('.error-message');
        return;
    }

    console.log('Getting YouTube Videos');
    const params = {
        key: apiKey,
        q: query,
        part: 'snippet',
        maxResults,
        type: 'video'
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
    console.log('Application Started!');
    $(".enter").on('click', function(){
        console.log("Button to search was clicked");
        const searchTerm = $('#js-search-term').val();
        let maxResults=15;
        getYouTubeVideos(searchTerm, maxResults); //15 videos is the default 
    });
}

$(watchForm);