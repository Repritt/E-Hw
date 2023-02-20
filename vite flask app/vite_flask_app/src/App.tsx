import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import useColorChange from 'use-color-change';
import './App.css';


type BettingData = {
  PlayerHome: string;
  PlayerAway: string;
  OddsHome: number;
  OddsAway: number;
  Payout: number;
  PlayTime: string;
  TS: Date;
  Time: string;
  URL: string;
};

type BettingMatches = {
  [key: string]: BettingData;
};

const BettingTable = () => {

  const [bettingMatches, setBettingMatches] = useState<BettingMatches>({});
  useEffect(() => {

  const socket = io('http://localhost:8000');
  socket.on('bettingData', (data: string) => {
    const matches = JSON.parse(data);
    //console.log(matches)
    setBettingMatches(matches);
  });

  return () => {
    socket.disconnect();
  };
}, []);


const [value, setValue] = useState(0);
const colorStyle = useColorChange(value, {
  higher: "limegreen",
  lower: "crimson",
  duration: 1800
});


const isHighPayout = (payout: number) => payout > 0.98;



return (
  <div className="betting-table-container">
    <table className="betting-table">
      <thead>
        <tr>
          <th>Home Player</th>
          <th>Away Player</th>
          <th>Odds Home</th>
          <th>Odds Away</th>
          <th>Payout</th>
          <th>Play Time</th>
          <th>Update time</th>
          <th>URL</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(bettingMatches).map(([matchID, data]) => (
          <tr key={matchID} className={isHighPayout(data.Payout) ? 'highlighted-row' : ''}>
            <td>{data.PlayerHome}</td>
            <td>{data.PlayerAway}</td>
            <td style={colorStyle}>{data.OddsHome}</td>
            <td style={colorStyle}>{data.OddsAway}</td>
            <td style={colorStyle}>{(data.Payout*100).toPrecision(4)}%</td>
            <td>{data.PlayTime}</td>
            <td style={colorStyle}>{data.Time}</td>
            <td>
              <a href={data.URL} target="_blank" rel="noreferrer">
                oddsPortal
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default BettingTable;