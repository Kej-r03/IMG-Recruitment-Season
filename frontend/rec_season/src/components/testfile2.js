import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';

export default function FontWeight() {
  // const params={int_round_id:5}
  axios
  .get("http://localhost:8000/candidate_season_data/get_mark/",{params:{paper_id:1}})
  .then(function(response){
    console.log(response)
  })
  return (
    <Typography component="div">
      <Box sx={{ fontWeight: 'light', m: 1 }}>Light</Box>
      <Box sx={{ fontWeight: 'regular', m: 1 }}>Regular</Box>
      <Box sx={{ fontWeight: 'medium', m: 1 }}>Medium</Box>
      <Box sx={{ fontWeight: 500, m: 1 }}>500</Box>
      <Box sx={{ fontWeight: 'bold', m: 1 }}>Bold</Box>
    </Typography>
  );
}
