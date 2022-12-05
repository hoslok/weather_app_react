import React, { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import "./App.css";
document.title = `React Weather App`

export default function App() {
  const [search, setSearch] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(`Sunny.jpg`);
  var latitudeData = null;
  var longitudeData = null;
  var [current, setCurrent] = useState({
    weather: [
      {
        id: ``,
        main: ``,
        description: null,
      },
      {
        id: ``,
        main: ``,
        description: `dummy`,
      },
    ],
    clouds: {},
    main: {
      temp: ``,
      feels_like: ``,
      temp_min: ``,
      temp_max: ``,
      pressure: ``,
    },
    name: ``,
  });

  function handleOnChange(searchData) {
    setSearch(searchData);
    latitudeData = Number(searchData.value.split(" ")[0]);
    longitudeData = Number(searchData.value.split(" ")[1]);
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitudeData}&lon=${longitudeData}&appid=d7d1ec5dd6c0d83c9dda85d5cd3a21d7`;
    getWeather();
  }

  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitudeData}&lon=${longitudeData}&appid=d7d1ec5dd6c0d83c9dda85d5cd3a21d7`;

  async function getWeather() {
    const currentCityData = await fetch(url);
    const currentCityDataJson = await currentCityData.json();
    setCurrent((prevValue) => {
      return {
        ...currentCityDataJson,
      };
    });
  }
  useEffect(() => {
    switch (current.weather[0].description) {
      case `moderate rain`:
        setBackgroundImage(`ModerateR.jpg`);
        break;
      case `light rain`:
        setBackgroundImage(`LightR.jpg`);
        break;
      case `broken clouds`:
        setBackgroundImage(`Broken.jpg`);
        break;
      case `scattered clouds`:
        setBackgroundImage(`Scattered.jpg`);
        break;
      case `overcast clouds`:
        setBackgroundImage(`Overcast.jpg`);
        break;
      case `few clouds`:
        setBackgroundImage(`Few.jpg`);
        break;
      case `haze`:
        setBackgroundImage(`Haze.jpg`);
        break;
      case `clear sky`:
        setBackgroundImage(`Clear.jpg`);
        break;
      case `snow`:
        setBackgroundImage(`Snowing.jpg`);
        break;
      case `thunderstorm with light rain`:
        setBackgroundImage(`Thunderstorm1.jpg`);
        break;
      case `mist`:
        setBackgroundImage(`Mist.jpg`);
        break;
      case `smoke`:
        setBackgroundImage(`Sunny.jpg`);
      case `light snow`:
        setBackgroundImage(`LightS.jpg`);
        break;
      default:
        setBackgroundImage(`Sunny.jpg`);
        break;
    }
  }, [current.weather[0].description]);

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "6f803b7b5dmshc3794feaa92afd6p12b416jsn97391b15d479",
      "XRapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  function loadOptions(inputValue) {
    return fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=100000&namePrefix=${inputValue}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      })
      .catch((err) => console.error(err));
  }

  return (
    <div
      className="everything"
      style={{ backgroundImage: `url(./${backgroundImage})` }}
    >
      <div className="title">
        <h1>Weather</h1>
      </div>
      <div className="paginate">
        <AsyncPaginate
          placeholder="City Name"
          debounceTimeout={800}
          value={search}
          onChange={handleOnChange}
          loadOptions={loadOptions}
        />
        <br></br>
        <div className="container">
          <h1>{current.main.temp && `${current.name}`} </h1>
          <h2>
            Current Temperature:{" "}
            {current.main.temp && `${Math.floor(current.main.temp - 273.15)}°C`}
          </h2>
          <h3>
            Temperature Range:{" "}
            {current.main.temp &&
              `${Math.floor(current.main.temp_min - 273.15)}°C — ${Math.floor(
                current.main.temp_max - 273.15
              )}C`}
          </h3>
          <div className="feels_like">
            <h4>
              Feels Like:{" "}
              {current.main.temp &&
                `${Math.floor(current.main.feels_like - 273.15)}°C`}
            </h4>
            <h4>
              Pressure: {current.main.temp && `${current.main.pressure}mb`}
            </h4>
          </div>
          <h4>Humidity: {current.main.temp && `${current.main.humidity}%`}</h4>
          <h4>
            Conditions:{" "}
            {current.main.temp &&
              `${current.weather[0].description.toUpperCase()}`}
          </h4>
        </div>
      </div>
    </div>
  );
}
