import React, { useState } from "react";

const PostReview = ({ dealerId }) => {
  const [review, setReview] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const name = sessionStorage.getItem("username") || "Anonymous";

  const submitReview = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      dealership: dealerId,
      review,
      purchase: true,
      car_make: carMake,
      car_model: carModel,
      car_year: carYear,
    };
    const res = await fetch(window.location.origin + "/djangoapp/add_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.status === 200) {
      setSubmitted(true);
      window.location.href = `/dealer/${dealerId}`;
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h1>Post a Review</h1>
      <form onSubmit={submitReview}>
        <label>Review</label>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} required style={{ width: "100%" }} />
        <label>Car Make</label>
        <input value={carMake} onChange={(e) => setCarMake(e.target.value)} required style={{ width: "100%" }} />
        <label>Car Model</label>
        <input value={carModel} onChange={(e) => setCarModel(e.target.value)} required style={{ width: "100%" }} />
        <label>Car Year</label>
        <input value={carYear} onChange={(e) => setCarYear(e.target.value)} required style={{ width: "100%" }} />
        <button type="submit">Post Review</button>
      </form>
      {submitted && <p>Review submitted!</p>}
    </div>
  );
};

export default PostReview;
