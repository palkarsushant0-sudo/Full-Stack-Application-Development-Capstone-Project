import React, { useEffect, useState } from "react";

const Dealer = ({ dealerId }) => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dealerRes = await fetch(
        window.location.origin + `/djangoapp/get_dealer/${dealerId}`
      );
      const dealerJson = await dealerRes.json();
      setDealer(dealerJson.dealer);

      const reviewRes = await fetch(
        window.location.origin + `/djangoapp/get_dealer_reviews/${dealerId}`
      );
      const reviewJson = await reviewRes.json();
      setReviews(reviewJson.reviews || []);
    };
    fetchData();
  }, [dealerId]);

  if (!dealer) return <p>Loading dealer details...</p>;

  return (
    <div className="dealer-detail" style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h1>{dealer.full_name}</h1>
      <p>{dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}</p>

      <h2>Reviews</h2>
      {reviews.length === 0 && <p>No reviews yet for this dealer.</p>}
      {reviews.map((r, idx) => (
        <div key={idx} style={{ borderBottom: "1px solid #eee", padding: "0.75rem 0" }}>
          <p><strong>{r.name}</strong> — {r.car_make} {r.car_model} ({r.car_year})</p>
          <p>{r.review}</p>
          <p>Sentiment: <em>{r.sentiment}</em></p>
        </div>
      ))}
    </div>
  );
};

export default Dealer;
