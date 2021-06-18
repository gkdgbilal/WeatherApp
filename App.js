import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import DateTime from "./components/DateTime";
import WeatherScroll from "./components/WeatherScroll";
import Geolocation from "@react-native-community/geolocation";
import { usePosition } from "./api/usePosition";

const img = require("./assets/image1.jpg");
const API_KEY = "9cd8367774b3c14edee6b64c2bc298f7";

export default function App() {
  const [data, setData] = useState({});

  const { latitude, longitude, error } = usePosition();
  const [locationInfo, setLocationInfo] = useState({});

  useEffect(() => {

    if (Object.keys(locationInfo).length === 0) {
      Geolocation.getCurrentPosition(
        info => {
          // console.log(info);
          // const { coords } = info;
          // let location = {
          //   user_latitude: coords.latitude,
          //   user_longitude: coords.longitude,
          //   timestamp: coords.timestamp,
          // };

          // setLocationInfo(location);
          let { latitude, longitude } = info.coords;
          fetchDataFromApi(latitude, longitude);

        },
        error => console.log(error),
        {
          enableHighAccuracy: false,
          timeout: 2000,
          maximumAge: 3600000,
        },
      );
    }
  }, []);

  const fetchDataFromApi = (latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        // console.log("data:",data)
        setData(data);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imgBackground}
        source={img}
      >
        <DateTime current={data.current} lat={data.lat} lon={data.lon}
                  timezone={data.timezone} />
        <WeatherScroll
          weatherData={data.daily}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
