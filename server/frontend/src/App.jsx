import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

const DealerRoute = () => {
  const { id } = useParams();
  return <Dealer dealerId={id} />;
};

const PostReviewRoute = () => {
  const { id } = useParams();
  return <PostReview dealerId={id} />;
};

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Dealers />} />
      <Route path="/dealer/:id" element={<DealerRoute />} />
      <Route path="/postreview/:id" element={<PostReviewRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
