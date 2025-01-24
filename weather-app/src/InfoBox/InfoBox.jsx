import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';
import AcUnitTwoToneIcon from '@mui/icons-material/AcUnitTwoTone';
import GrainTwoToneIcon from '@mui/icons-material/GrainTwoTone';

export const InfoBox = ({info}) => {
  // Check if info is null or undefined
  if (!info) {
    return null; // Return null if info is not available
  }
  let COLD_URL = "https://images.unsplash.com/photo-1484278786775-527ac0d0b608?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvbGR8ZW58MHx8MHx8fDA%3D";
  let HOT_URL = "https://images.unsplash.com/photo-1447601932606-2b63e2e64331?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
  let RAIN_URL ="https://images.unsplash.com/photo-1438449805896-28a666819a20?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFJBSU4lMjBXRUFUSEVSfGVufDB8fDB8fHww";
  return (
   
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={info.humidity > 80 ? RAIN_URL : info.temperature > 15 ? HOT_URL : COLD_URL}
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {info.city} {info.humidity > 80 ? <GrainTwoToneIcon/> : info.temperature > 15 ? <LightModeTwoToneIcon/> : <AcUnitTwoToneIcon/>}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} component={"span"}>
            <div>
                <p><b>Temperature:</b> {info.temp}°C</p>
                <p><b>Min Temperature:</b> {info.temMin}°C</p>
                <p><b>Max Temperature:</b> {info.tempMax}°C</p>
                <p><b>Humidity:</b> {info.humidity}%</p>
                <p><b>Feels Like:</b> {info.feelsLike}°C</p>
                <p><b>Weather:</b> {info.weather}</p>

            </div>
          </Typography>
        </CardContent>

      </Card>
    </div>
  );
};
