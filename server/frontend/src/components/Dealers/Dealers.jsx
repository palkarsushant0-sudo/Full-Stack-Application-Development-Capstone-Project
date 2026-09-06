import React, { useEffect, useState } from "react";
import "./Dealers.css";

const states = [
  "All", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState("All");
  const username = sessionStorage.getItem("username");

  const fetchDealers = async (selectedState) => {
    const url =
      selectedState === "All"
        ? window.location.origin + "/djangoapp/get_dealers"
        : window.location.origin + "/djangoapp/get_dealers/" + selectedState;
    const res = await fetch(url);
    const json = await res.json();
    if (json.status === 200) {
      setDealers(json.dealers || []);
    }
  };

  useEffect(() => {
    fetchDealers(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="dealers-page">
      <h1>Our Dealerships</h1>

      <label htmlFor="stateFilter">Filter by state:</label>
      <select
        id="stateFilter"
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <table className="dealers-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>State</th>
            {username && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealers.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td><a href={`/dealer/${d.id}`}>{d.full_name}</a></td>
              <td>{d.city}</td>
              <td>{d.address}</td>
              <td>{d.zip}</td>
              <td>{d.state}</td>
              {username && (
                <td><a href={`/postreview/${d.id}`}>Review Dealer</a></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
