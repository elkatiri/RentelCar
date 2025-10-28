import React from 'react';
import Navbar from '../../components/NavBar/Navbar';
import './Home.css';
import carImage from '../../images/main_car.webp';

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="section">
        <div className="container">
          <h1 className="title">Luxury cars on Rent</h1>

          <div className="search-container">
            <div className="search-item">
              <label htmlFor="pickup-location">Pickup Location</label>
              <select id="pickup-location">
                <option value="">Please select location</option>
                <option value="casablanca">Casablanca</option>
                <option value="marrakech">Marrakech</option>
                <option value="agadir">Agadir</option>
              </select>
            </div>

            <div className="search-item">
              <label htmlFor="pickup-date">Pick-up Date</label>
              <input type="date" id="pickup-date" />
            </div>

            <div className="search-item">
              <label htmlFor="return-date">Return Date</label>
              <input type="date" id="return-date" />
            </div>

            <div className="search">
              <button className="search-button">Search</button>
            </div>
          </div>

          <div className="image-car">
            <img src={carImage} alt="Luxury car" />
          </div>
        </div>
      </div>
       <div className="featured-cars">
          <h1 className="featured-title">Featured Vehicles</h1>
          <p className="featured-subtitle">
            Explore our selection of premium vehicles available for your next adventure.
          </p>
          <div className="car-list">
            {/* Featured cars will be displayed here */}
          </div>
        </div>
    </div>
  );
};

export default Home;
