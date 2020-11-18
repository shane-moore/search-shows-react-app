import './App.scss';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// add Font Awesome magnifying glass to use in search input field
library.add(faSearch);

function App() {


  // Declare a state variable to keep track of the searched show
  const [searchedShow, setSearchedShow] = useState('');

  // boolean state variable to conditionally rebder either the Shows component or Episodes component
  const [searchPageFlag, setSearchPageFlag] = useState(true);

  // state variable to hold the show searched via the input field
  const [selectedShow, setSelectedShow] = useState('');

  // Declare a state variable containing the GitHub API's JSON response with the searched user's repo data
  const [showsList, setShowsList] = useState([]);

  // state variable to keep track of total number of seasons for a selected show
  const [seasons, setSeasons] = useState([]);

  // state variable to keep track of selected season number for a show
  const [selectedSeason, setSelectedSeason] = useState(1);

  // state variable to contain data about a show's episodes, cast, and crew
  const [episodesList, setEpisodesList] = useState([]);

  // useEffect hook will call GitHub users REST API and will assign returned user's repo data as JSON after render and on change of the 'user' state
  useEffect(() => {
    async function getShows() {

      // call API to return show data after user searches for a show via input field
      if (searchedShow) {
        let showsList = [];
        let showsResponse = await fetch(
          `https://api.tvmaze.com/search/shows?q=${searchedShow}`
        );
        let showsJson = await showsResponse.json();
        showsList.push(showsJson);
        setShowsList(...showsList);
      }
    }

    // call API to return episodes, crew, and cast data if user selects a show from a list of shows
    async function getEpisodes() {
      if (selectedShow) {
        let episodesList = []
        let episodeResponse = await fetch(
          `https://api.tvmaze.com/singlesearch/shows?q=${selectedShow}&embed[]=episodes&embed[]=cast&embed[]=crew`
        );
        let episodesJson = await episodeResponse.json();
        episodesList.push(episodesJson);
        setEpisodesList(...episodesList);
        let seasons = getSeasons(episodesList);
        setSeasons(seasons);

        // call getSeasonDetails to update the Seasons variable
        //getSeasonDetails();
      }
    }
    // call getShows and getEpisodes
    getShows();
    getEpisodes();
    console.log('Vote for Shane!')


    // run useEffect hook when user searches for a show, selects a show from the list, or selects a season
  }, [searchedShow, selectedShow, selectedSeason]);

  // get number of seasons for a selected show
  function getSeasons(episodesList) {
    let seasons = [];
    episodesList[0]._embedded.episodes.forEach(episode => {
      if (!seasons.includes(episode.season)) {
        seasons.push(episode.season);
      }
    })
    return seasons;
  }

  // get the details for a show's season after the user selects a season and return as JSX to Episodes comopnent
  function getSeasonDetails() {
    let episodesDetails = [];
    episodesList._embedded?.episodes.forEach(episode => {
      if (episode.season == selectedSeason) {
        let details = {
          episodeTitle: '',
          episodeNumber: 0,
          episodeAirDate: ''
        };
        details['episodeTitle'] = episode?.name;
        details['episodeNumber'] = episode?.number;
        details['episodeAirDate'] = episode?.airdate;
        episodesDetails.push(details);
      }
    });

    return (
      <div className="episodes-container">
        <div className="show-details-container">
          <div class="img-container"><img src={episodesList.image?.medium ? `${episodesList.image?.medium}` : null} alt=""></img></div>
          <h3>{episodesList.name}</h3>
          <p>{episodesList.summary}</p>
          <p>Creator:{episodesList._embedded?.crew.find(current => current.type == 'Producer')?.person.name}</p>
          <p>Cast:{episodesList._embedded?.cast.find(current => current.type == 'Producer')?.person.name}</p>
        </div>

        {episodesDetails.map(episodeDetail => {
          return (
            <div className="episode">
              <div className="episode-container__left-block">{episodeDetail.episodeNumber}</div>
              <div className="episode-container__right-block">
                <div className="episode-title">{episodeDetail.episodeTitle}</div>
                <div className="episode-rating-airdate">{`${episodeDetail.episodeAirDate} | 7.5 `}</div>
              </div>
            </div>
          )
        })
        }
      </div>
    );
  }

  // remove tags from the show's summary returned in the showsList
  function formatSummary(summary) {
    if (summary) {
      summary = summary.replace('<p>', '').replace('</p>', '').replace('<b>', '').replace('</b>', '');
      return `${summary.substring(0, 283)}...`;
    }

  }

  // create a Show component to house all data for the show's returned from the user's search
  function Shows() {
    return (
      <React.Fragment>
        <section className='results-container'>
          {
            showsList.map((show) => { return resultsMap(show) }
            )
          }
        </section>
      </React.Fragment>
    )
  }

  // return shows results as JSX to the mapping function
  function resultsMap(show) {
    return (
      <article className="results" key="repo.id">
        <div class="img-container"><img src={show.show.image ? `${show.show.image.medium}` : null} alt=""></img>
        </div>
        <div className="show-container">
          <header>{show.show.name}</header>
          <p>{formatSummary(show.show.summary)}</p>
          <button className="episodes-button" onClick={() => {
            setSelectedShow(show.show.name);
            setSearchPageFlag(false);
          }
          }>Show Episodes
          </button>
        </div>
      </article >
    );
  }

  // create an Episodes component to render after the user selects a show from the list
  function Episodes() {
    return (
      <React.Fragment>
        <select onChange={() => setSelectedSeason(document.querySelector('select').value)}>
          {seasons.map(seasonNumber => {
            console.log(seasonNumber);
            return (<React.Fragment>
              <option value={seasonNumber}>{seasonNumber}</option>
            </React.Fragment>)
          })}
        </select>
        <div>{getSeasonDetails()}</div>
      </React.Fragment>
    )
  }

  // top level page render that includes the search input field and conditionally renders either the Shows component or Episodes component based off user selections
  return (
    <React.Fragment>
      <header className="app-title-header">Show Finder</header>
      <main>
        <div className="search-container">
          <FontAwesomeIcon icon="search" />
          <input type="text" placeholder="The Office" />
          <button onClick={() => {
            setSearchedShow(document.querySelector("input").value);
            setSearchPageFlag(true);
          }}>Search</button>
        </div>
        {
          searchPageFlag ? <Shows /> : <Episodes />
        }
      </main>
    </React.Fragment>
  );
}

export default App;
