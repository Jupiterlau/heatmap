import React, { useEffect, useState } from "react";
import { csvParse } from "d3-dsv";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup
} from "react-simple-maps";

// Use a direct URL for the GeoJSON data
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Adjust color scale based on your data range
const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = () => {
  const emotions = {
  "United States of America": [
    { region: "Alabama", value: 1 },
    { region: "Alaska", value: 0 },
    { region: "Arizona", value: 2 },
    { region: "California", value: 1 },
    { region: "Colorado", value: 0 },
    { region: "Florida", value: 2 },
    { region: "New York", value: 1 },
    { region: "Texas", value: 0 }
  ],
  "United Kingdom": [
    { region: "England", value: 2 },
    { region: "Scotland", value: 1 },
    { region: "Wales", value: 0 },
    { region: "Northern Ireland", value: 2 }
  ],
  "Canada": [
    { region: "Alberta", value: 1 },
    { region: "British Columbia", value: 0 },
    { region: "Ontario", value: 2 },
    { region: "Quebec", value: 1 },
    { region: "Nova Scotia", value: 0 }
  ],
  "Australia": [
    { region: "New South Wales", value: 2 },
    { region: "Queensland", value: 1 },
    { region: "Victoria", value: 0 },
    { region: "Western Australia", value: 2 },
    { region: "South Australia", value: 1 }
  ],
  "Germany": [
    { region: "Bavaria", value: 0 },
    { region: "Berlin", value: 2 },
    { region: "Hamburg", value: 1 },
    { region: "Hesse", value: 0 },
    { region: "North Rhine-Westphalia", value: 2 }
  ],
  "France": [
    { region: "Brittany", value: 1 },
    { region: "Grand Est", value: 0 },
    { region: "蝜e-de-France", value: 2 },
    { region: "Normandy", value: 1 },
    { region: "Provence-Alpes-C魌e d'Azur", value: 0 }
  ],
  "Japan": [
    { region: "Hokkaido", value: 2 },
    { region: "Tokyo", value: 1 },
    { region: "Osaka", value: 0 },
    { region: "Kyoto", value: 2 },
    { region: "Okinawa", value: 1 }
  ],
  "China": [
    { region: "Beijing", value: 0 },
    { region: "Guangdong", value: 2 },
    { region: "Shanghai", value: 1 },
    { region: "Sichuan", value: 0 },
    { region: "Zhejiang", value: 2 }
  ],
  "India": [
    { region: "Maharashtra", value: 1 },
    { region: "Uttar Pradesh", value: 0 },
    { region: "Tamil Nadu", value: 2 },
    { region: "Karnataka", value: 1 },
    { region: "Gujarat", value: 0 }
  ],
  "Brazil": [
    { region: "S鉶 Paulo", value: 2 },
    { region: "Rio de Janeiro", value: 1 },
    { region: "Minas Gerais", value: 0 },
    { region: "Bahia", value: 2 },
    { region: "Rio Grande do Sul", value: 1 }
  ],
  "Mexico": [
    { region: "Mexico City", value: 0 },
    { region: "Jalisco", value: 2 },
    { region: "Nuevo Le髇", value: 1 },
    { region: "Veracruz", value: 0 },
    { region: "Puebla", value: 2 }
  ],
  "Russia": [
    { region: "Moscow", value: 1 },
    { region: "Saint Petersburg", value: 0 },
    { region: "Novosibirsk", value: 2 },
    { region: "Yekaterinburg", value: 1 },
    { region: "Kazan", value: 0 }
  ],
  "Italy": [
    { region: "Lombardy", value: 2 },
    { region: "Lazio", value: 1 },
    { region: "Campania", value: 0 },
    { region: "Sicily", value: 2 },
    { region: "Veneto", value: 1 }
  ],
  "Spain": [
    { region: "Andalusia", value: 0 },
    { region: "Catalonia", value: 2 },
    { region: "Madrid", value: 1 },
    { region: "Valencia", value: 0 },
    { region: "Galicia", value: 2 }
  ],
  "South Korea": [
    { region: "Seoul", value: 1 },
    { region: "Busan", value: 0 },
    { region: "Incheon", value: 2 },
    { region: "Daegu", value: 1 },
    { region: "Gwangju", value: 0 }
  ],
  "Netherlands": [
    { region: "North Holland", value: 2 },
    { region: "South Holland", value: 1 },
    { region: "Utrecht", value: 0 },
    { region: "North Brabant", value: 2 },
    { region: "Gelderland", value: 1 }
  ],
  "Saudi Arabia": [
    { region: "Riyadh", value: 0 },
    { region: "Makkah", value: 2 },
    { region: "Eastern Province", value: 1 },
    { region: "Madinah", value: 0 },
    { region: "Asir", value: 2 }
  ],
  "South Africa": [
    { region: "Gauteng", value: 1 },
    { region: "Western Cape", value: 0 },
    { region: "KwaZulu-Natal", value: 2 },
    { region: "Eastern Cape", value: 1 },
    { region: "Free State", value: 0 }
  ],
  "Turkey": [
    { region: "Istanbul", value: 2 },
    { region: "Ankara", value: 1 },
    { region: "Izmir", value: 0 },
    { region: "Antalya", value: 2 },
    { region: "Bursa", value: 1 }
  ]
};
  const [data, setData] = useState([]);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [country, setCountry] = useState("Please select a country");
  const [region, setRegion] = useState('')
  const [generalEmotion, setGeneralEmotion] = useState('')
  
  useEffect(() => {
    console.log("Fetching data...");
    fetch('/vulnerability.csv')
      .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        console.log("CSV loaded, first 200 chars:", csvText.substring(0, 200));
        const parsedData = csvParse(csvText);
        console.log("Parsed data rows:", parsedData.length);
        setData(parsedData);
      })
      .catch(error => {
        console.error("Error loading CSV:", error);
        console.error("Error details:", error.message);
      });
  }, []);

  // Calculate the average value for the selected region array
const getCountryColor = (country, emotionData) => {
  if (!emotionData) return "black"; // default color for countries without data
  console.log(emotionData, country)
  // Calculate average sentiment for the country
  const averageValue = emotionData.reduce((sum, item) => sum + item.value, 0) / emotionData.length;
  console.log(194, averageValue)
  // Return color based on sentiment range
  if (averageValue < 1) return "red"; // red for negative
  if (averageValue > 1.1) return  "green"; // yellow for neutral
  return "yellow"; // green for positive
  
};


  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  useEffect(() => {
    computeGeneralEmotion();
  }, [region]);

  function computeGeneralEmotion() {
    const averageValue = region && Array.isArray(region) && region.length > 0
      ? (region.reduce((sum, item) => sum + item.value, 0) / region.length).toFixed(2)
      : null;
    if (averageValue < 1) {
      setGeneralEmotion("negative");
    } else if (averageValue > 1.1) {
      setGeneralEmotion("positive");
    } else {
      setGeneralEmotion("neutral")
    }
  }
  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "#F5F5F5" }}>
            <div style={{  position: "absolute", 
        top: 10, 
        right: 50, 
        color: "black", 
        // backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(211, 38, 38, 0.1)",
        zIndex: 1000,
      width:"500px",
        textAlign: "left",
      background: "linear-gradient(120deg, #2193b0 0%, #6dd5ed 100%)",
        }}>
         Please click on the country you want to learn more about to get more details.
        </div>
      <div style={{  position: "absolute", 
        top: 50, 
        left: 20, 
        color: "black", 
        // backgroundColor: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(211, 38, 38, 0.1)",
        zIndex: 1000,
        minWidth: "200px",
        maxWidth: "400px",
        textAlign: "left",
      background: "linear-gradient(120deg, #2193b0 0%, #6dd5ed 100%)",
        }}>
        <div >
        Country :  <span style={{ color: 'white' }}>{country}  </span> 
        </div>
{region && Array.isArray(region) && region.length > 0 && (
  <div style={{marginTop: 5}}>
    Over All Sentiment: 
    <span style={{
      color: 
        generalEmotion === "negative" ? "red" :
        generalEmotion === "neutral" ? "goldenrod" :
        generalEmotion === "positive" ? "green" : "black"
    }}>
      {generalEmotion}
      {generalEmotion === "positive" ? "😀" : ""}
      {generalEmotion === "neutral" ? "😐" : ""}
      {generalEmotion === "negative" ? "😞" : ""}
    </span>
  </div>
)}
        <div style={{fontSize: 20}}>
         
          <div>
          {
            region && Array.isArray(region) && region.length > 0
              ? (
                <>
                 details in {country} :
                  {region.map((item, idx) => (
                    <div key={idx}>
                      {item.region}: {
                        item.value === 0
                          ? <span style={{ color: "red" }}>Negative 😞</span>
                          : item.value === 1
                            ? <span style={{ color: "goldenrod" }}>Neutral 😐</span>
                            : item.value === 2
                              ? <span style={{ color: "green" }}>Positive 😀</span>
                              : item.value
                      }
                    </div>
                  ))}
                </>
              )
              : <span>No region data available</span>
          }
          </div>
        </div>
      </div>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 130
        }}
        width={800}
        height={400}
        style={{
          width: "100%",
          // height: "auto"
          height: "100%",
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={3} 
        >
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
          {data.length > 0 && (
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find((s) => s.ISO3 === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // fill={d ? colorScale(d["2017"]) : "#F5F4F6"}
                      // fill={d ? colorScale(d["2017"]) : "black"}
                      fill={getCountryColor(geo.properties.name, emotions[geo.properties.name])}
                      stroke="#D6D6DA"
                      strokeWidth={0.5}
                      onMouseEnter={() => {
                        const c = geo.properties.name;
                        setCountry(c);
                        if (emotions[c]) {
                          setRegion(emotions[c]);
                        } else {
                          setRegion([]);
                        }
                      }}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          fill: "blue",
                          outline: "none",
                        },
                        pressed: {
                          fill: "#E42",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};


export default MapChart;


