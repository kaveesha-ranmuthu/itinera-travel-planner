import { Grid } from "@mui/material";
import React from "react";
import { TripCard } from "./TripCard";
import { TripData } from "../../types/types";

interface TripsGridProps {
  trips: TripData[];
}

export const TripsGrid: React.FC<TripsGridProps> = ({ trips }) => {
  return (
    <Grid container spacing={5} display={"flex"} justifyContent={"center"}>
      {trips.map((trip) => {
        return (
          <Grid key={trip.id}>
            <TripCard trip={trip} />
          </Grid>
        );
      })}
    </Grid>
  );
};
