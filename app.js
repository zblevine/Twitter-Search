/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import moment from 'moment';

const testSearch = async () => {
  const yelpData = await axios.get('/api/');
  return yelpData;
}

const range = (start, end) => {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
}

//const numArray = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const tzRaw = [...range(-11, -4), -3.5, ...range(-3, 3), 3.5, 4, 4.5, 5, 5.5,
              5.75, 6, 6.5, ...range(7, 12) ]

const tzExamples = ['Samoa', 'Hawaii', 'Alaska', 'San Francisco', 'Denver', 'Chicago',
                  'New York', 'Nova Scotia', 'Newfoundland', 'Sao Paulo',
                  'Fernando de Noronha', 'Azores', 'London', 'Paris', 'Athens',
                  'Moscow', 'Tehran', 'Tbilisi', 'Kabul', 'Lahore', 'Mumbai',
                  'Kathmandu', 'Dhaka', 'Yangon', 'Bangkok', 'Shanghai', 'Tokyo',
                  'Sydney', 'Vanuatu', 'Auckland']

const timeZones = tzRaw.map((tz, idx) => (tz >= 0 ? `UTC +${tz} (${tzExamples[idx]})`
                            : `UTC ${tz} (${tzExamples[idx]})`));



const numArray = [12, ...range(1, 11)];
const hourArray = [...(numArray.map(n => `${n} AM`)), ...(numArray.map(n => `${n} PM`))];



class App extends Component {
  constructor() {
    super();
    this.state = {
      biz: [],
      nbText: '',
      cityText: '',
      time: moment().hour(),
      timeZone: -5 //Eastern Time
    }
  }
  async searchByLocation(nb, city) {
    const searchResults = (await axios.get(`/api/${nb}/${city}`)).data.jsonBody;
    document.querySelector('h3').innerHTML = 'Search Results:';
    this.setState({biz: searchResults.businesses});
    console.log(this.state.biz);
    console.log(this.state.time);
  }
  async searchByLocTime(nb, city, time) {
    const searchResults = (await axios.get(`/api/${nb}/${city}/${time}`)).data.jsonBody;
    document.querySelector('h3').innerHTML = 'Search Results:';
    this.setState({biz: searchResults.businesses});
    console.log(this.state.biz);
    console.log(this.state.time);
    //console.log(moment().utcOffset(this.state.timeZone).set('hour', parseInt(this.state.time, 10)).unix());
  }
  render() {
    const { biz, nbText, cityText, time, timeZone } = this.state;
    const hours = hourArray;
    return (
      <div>
        <h2>Search Open Restaurants</h2>
        <form id="openNow" onSubmit={(ev) => ev.preventDefault()}>
          <label htmlFor="nbhd">Neighborhood: </label>
          <input name="nbhd" value={ nbText } onChange={ (ev) => this.setState({nbText: ev.target.value })} />
          <label htmlFor="city">City: </label>
          <input name="city" value={ cityText } onChange={ (ev) => this.setState({cityText: ev.target.value })} />
          <button onClick={() => this.searchByLocation(nbText, cityText)}>Search Open Now By Neighborhood</button>
        </form>
        <h4>Search By Time (Optional)</h4>
        <form id="byTime" onSubmit={(ev) => ev.preventDefault()}></form>
          <label htmlFor="times">Select Time: </label>
          <select name="times" value={time} onChange={(ev) => {
            this.setState({time: ev.target.value});
          }}>
            {hours.map((hour, idx) => <option key={idx} value={idx}>{hour}</option>)}
          </select>
          <label htmlFor="timeZones">Time Zone: </label>
          <select name="timeZones" value={timeZone} onChange={(ev) => {
            this.setState({timeZone: ev.target.value});
          }}>
            {tzRaw.map((tz, idx) => <option key={tz} value={tz}>{timeZones[idx]}</option>)}
          </select>
          <button onClick={() => {
            console.log(timeZone);
            this.searchByLocTime(nbText, cityText, moment().utcOffset(parseFloat(timeZone)).set('hour', parseInt(time, 10)).unix())}}>Search By Time</button>
        <h3></h3>
        <ul>
          {biz.map(b => 
          <li key={b.id}>
            <img src={b.image_url} height="200px" />
            <br />
            Name: {b.name}
            <br />
            Rating: {b.rating}
            <br />
            Address: {b.location.address1}, {b.location.city}
            <br />
            Yelp Page <a href={b.url} target="_blank">Here</a>
          </li>)}
        </ul>
      </div>
    );
  }
}

const apiKey = 'S370M4sMp1u2FgBBYcBxGaHj2gqmzFWFyNQ8W5u-sIhoXDAcXvuap41_kQhUUNqNen97DopaNwfFbyJmsvmv1UJA4h4Vbcjb4AfMqBdHhdzHM7KEVgamTcqXgInGXXYx';
const search = {
  term: 'food',
  location: 'tribeca nyc',
  limit: 5,
  sort_by: 'rating'
}




render(<App />, document.querySelector('#root'));
