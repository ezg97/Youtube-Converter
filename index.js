'use strict';

const YVAC_STORE = {
    apiKey: 'AIzaSyBxBsXHbC2hu6qRO6NBOcZTvLcoxxChWvA',
    searchURL: 'https://www.googleapis.com/youtube/v3/search',
}


// this function will clear the results //
function clearList(){
    $('#results-list').empty();
}

// This function will update the classes from the initial screen //
function styleUpdate(){
    hide('.intro');
    show('.mode');

    $('body').removeClass('initial');
    $('body').addClass('light-body');

    $('.container').addClass('light');
}

//--------------------- to hide display and to show display --------------------//

function hide(element){
    //this function will hide a class
    if( !$(element).hasClass('hidden') ){
        $(element).addClass('hidden');
    }
}

function show(element){
    //this function will reverse the "hide" function
    if( $(element).hasClass('hidden') ){
        $(element).removeClass('hidden');
    }
}

// ------- BUTTONS --------- //
function btnModeClick(){
    $('.light-body').toggleClass('dark-body');
    $('.light').toggleClass('dark');
    $('.mode').toggleClass('mode-dark');
}

function btnSettings(){
    $('.max-results').toggleClass('hidden');
    $('.max-results-label').toggleClass('hidden');
    $("#js-max-results").val(''); //whenever "settings" button is clicked
    // then it will be cleared
}

// formating the query parameter //
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// Displaying the results //
function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  console.log(responseJson.items.length);
 
  clearList();

  if(responseJson.items.length<=0){
    $('#js-error-message').text(`No results found. Try using changing your search entry.`);
    show('.error-message');
    return;
  }
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li class="video-info">
        
        <h3>${responseJson.items[i].snippet.title}</h3>
        <iframe class="video" src='https://www.youtube.com/embed/${responseJson.items[i].id.videoId}' frameborder="0" allow="autoplay; encrypted-meda gyroscope; picture-in-picture" allowfullscreen></iframe>
        <ul class="link-boxes">
            <li><a href="https://youtubemp3.today/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${responseJson.items[i].id.videoId}" target="_blank">Download Audio</a></li>
            <li><a href="https://onlinevideoconverter.party/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${responseJson.items[i].id.videoId}" target="_blank">Download Video</a></li>
        </ul>
      
      </li>`
    )};
 
  $('#results').removeClass('hidden');
};

// Fetching the youtube videos from the API //
function getYouTubeVideos(query, maxResults) {
    let tempMaxResults = $('#js-max-results').val();

    hide('.error-message');

    if( !(isNaN(tempMaxResults)) ){
        if(tempMaxResults>1 && tempMaxResults<=50){
            maxResults = tempMaxResults;
        }
        else if(tempMaxResults<0 || tempMaxResults>50){
            $('#js-error-message').text(`Invalid Entry: out of range.`);
            clearList();
            show('.error-message');
            return;
        }
        else if(tempMaxResults==1){
            $('#js-error-message').text(`Invalid Entry: enter more than one.`);
            clearList();
            show('.error-message');
            return;
        }
    }
    else{
        $('#js-error-message').text(`Invalid Entry: not a number.`);
        clearList();
        show('.error-message');
        return;
    }

    //setting the parameters
    const params = {
        key: YVAC_STORE.apiKey,
        q: query,
        part: 'snippet',
        maxResults,
        type: 'video'
    };
    const queryString = formatQueryParams(params)
    const url = YVAC_STORE.searchURL + '?' + queryString; 

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

// Watching for a form sumbission //
function watchForm() {
    $('#js-form').submit(event => {
        event.preventDefault();

        styleUpdate();

        const searchTerm = $('#js-search-term').val(); //grabbing the string that was searched
        let maxResults=15;
        getYouTubeVideos(searchTerm, maxResults); //15 videos is the default 
    });
}

$(watchForm);