"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    console.log("Original location:", location);
    console.log("Trimmed location:", trimmedLocation);

    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${trimmedLocation}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };

      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Please enter an existing city.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Did Elsa just move into your town?`;
      } else if (temperature < 10) {
        return `It's cold at ${temperature}°C. Someone get Jon Snow, winter is coming!`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Not too bad, just jacket weather.`;
      } else if (temperature < 30) {
        return `It's a comfy ${temperature}°C. Enjoy it, no need for AC memes yet!`;
      } else {
        return `It's ${temperature}°C. Are we in a desert, or did someone just turn on the oven?`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's sunny! Time to pull out your sunglasses and pretend you're in a music video.";
      case "partly cloudy":
        return "Partly cloudy, like your life decisions. Kidding, it's just some clouds!";
      case "cloudy":
        return "It's cloudy. Someone forgot to pay the sun's electricity bill.";
      case "overcast":
        return "Overcast... It's the perfect weather to binge-watch Netflix and avoid responsibilities.";
      case "rain":
        return "It's raining. Cue the 'It's Raining Men' song and grab an umbrella!";
      case "thunderstorm":
        return "Thunderstorm? Looks like Thor's practicing for a big event.";
      case "snow":
        return "It's snowing! Time to build a snowman or just scroll memes about how cold it is.";
      case "mist":
        return "It's misty. Looks like the set of a horror movie out there.";
      case "fog":
        return "Foggy. Are we in Silent Hill? Proceed with caution!";
      default:
        return description;
    }
  }

  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return ` ${location} ${isNight ? "at Night, spooky vibes!" : "During the Day, keep those shades on!"}`;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle>Weather Widget</CardTitle>
          <CardDescription>
            Search for the current weather conditions in your city.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}{" "}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-6 h-6" />
                {getTemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6" />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6" />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default WeatherWidget