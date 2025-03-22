import React, { useEffect, useState } from "react";
import axios from "axios"; 
import dayjs from "dayjs"; 

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch weather data from API
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const lat = localStorage.getItem("latitude");
                const long = localStorage.getItem("longitude");
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=ed222663fbd11dffb5c672e3e086c265`); // Replace with your actual API URL

                const forcast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=ed222663fbd11dffb5c672e3e086c265`)

                console.log("FORCAST :: ", forcast.data.list);


                setWeatherData(response.data);
                const data = forcast.data;


                // Filter data to get one forecast per day (midday forecast preferred)
                const filteredData = data.list.filter((item) =>
                    item.dt_txt.includes("12:00:00")
                );

                // Slice the first 3 days of forecast
                setForecast(filteredData.slice(0, 3));
                setCity(data.city.name);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching weather data:", error);
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    
    if (!weatherData) {
        return <div>Loading weather...</div>;
    }

    // Extract necessary data
    const { main, weather, wind, sys, dt, name } = weatherData;
    const currentTemp = main.temp - 273.15; 
    const feelsLikeTemp = main.feels_like - 273.15; 
    const humidity = main.humidity;
    const weatherDescription = weather[0].description;
    const icon = weather[0].icon;
    const windSpeed = wind.speed;
    const country = sys.country;

    // Format the date
    const formattedDate = dayjs.unix(dt).format(" MMM D , ddd");


    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
        </div>;
    }

    if (error) return <p>{error}</p>;
    return (
        <div className="max-w-sm mx-auto bg-[#434242] text-white rounded-lg shadow-lg p-6">
            <div className="justify-around flex gap-4 items-center">
                <h2 className="text-xl font-assistant font-bold">{name}</h2>
                <p className="text-xs px-3 py-1  rounded-md bg-gray-600 font-semibold">{formattedDate}</p>
            </div>

            <div className="mb-4">
                <div className="flex justify-around items-center">
                    <p className="text-xl font-bold">
                        {currentTemp.toFixed(1)}°C
                    </p>
                    <p className="text-sm text-gray-100">{weatherDescription}</p>
                </div>
            </div>


            <div className="p-0  text-white rounded-lg">

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {forecast.map((day) => {
                        // Format date to weekday (e.g., Mon, Tue)
                        const weekday = new Date(day.dt * 1000).toLocaleString("en-US", {
                            weekday: "short",
                        });

                        return (
                            <div
                                key={day.dt}
                                className="w-[4.2 rem] bg-[#434242] rounded-lg flex flex-col items-center"
                            >
                                <p className="text-sm font-semibold">{weekday}</p>
                                <img
                                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                    alt={day.weather[0].description}
                                    className="w-5 h-5"
                                />
                                <p className="text-[8px] mb-1 capitalize">{day.weather[0].description}</p>
                                <p className="text-[8px] mb-2 font-medium">Temp: {day.main.temp}°C</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Weather;
