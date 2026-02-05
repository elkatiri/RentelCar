import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Gauge, Settings, Wind, Armchair, Radio, Navigation, Sun, Car, Timer, Flame, Camera, X } from 'lucide-react';
import Swal from 'sweetalert2';
import './CarListing.css';
import Navbar from '../../components/NavBar/Navbar';
import Footer from '../../components/footer/footer';

const CarListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    location: '',
  });
  const [bookingModal, setBookingModal] = useState(false);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/vehicles?per_page=100');
      const carsData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setVehicles(carsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const getFeatureIcon = (featureName) => {
    switch (featureName) {
      case '4 Seats':
        return <Users size={18} />;
      case 'Hybrid':
        return <Gauge size={18} />;
      case 'Automatic':
      case 'Manual':
        return <Settings size={18} />;
      case 'Air Conditioning':
        return <Wind size={18} />;
      case 'Leather Seats':
        return <Armchair size={18} />;
      case 'Bluetooth':
        return <Radio size={18} />;
      case 'GPS Navigation':
        return <Navigation size={18} />;
      case 'Sunroof':
        return <Sun size={18} />;
      case 'All-Wheel Drive':
        return <Car size={18} />;
      case 'Cruise Control':
        return <Timer size={18} />;
      case 'Heated Seats':
        return <Flame size={18} />;
      case 'Rear Camera':
        return <Camera size={18} />;
      default:
        return <MapPin size={18} />;
    }
  };

  const handleBookingClick = (car) => {
    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please log in to book a vehicle.',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }
    setSelectedCar(car);
    setBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.start_date || !bookingData.end_date || !bookingData.location) {
      Swal.fire('Error!', 'Please fill all fields.', 'error');
      return;
    }

    if (new Date(bookingData.start_date) >= new Date(bookingData.end_date)) {
      Swal.fire('Error!', 'Return date must be after pickup date.', 'error');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/reservations',
        {
          vehicle_id: selectedCar.id,
          user_id: user.id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          status: 'pending',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire('Success!', 'Booking created successfully. Please wait for admin approval.', 'success');
      setBookingModal(false);
      setBookingData({ start_date: '', end_date: '', location: '' });
      setSelectedCar(null);
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to create booking.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="car-listing">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading vehicles...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="car-listing">
      <Navbar />

      <div className="listing-header">
        <div className="listing-header-content">
          <h1>Available Vehicles</h1>
          <p>Browse and book from our premium collection of luxury cars</p>
        </div>
      </div>

      <div className="listing-container">
        <div className="vehicles-grid">
          {vehicles.length > 0 ? (
            vehicles.map((car) => (
              <div key={car.id} className="vehicle-card">
                <div className="vehicle-image-container">
                  <img
                    src={
                      car.image && car.image.startsWith('http')
                        ? car.image
                        : car.image
                        ? `http://127.0.0.1:8000/storage/${car.image}`
                        : 'https://via.placeholder.com/400x250'
                    }
                    alt={`${car.brand} ${car.model}`}
                    className="vehicle-image"
                  />
                  <div className={`vehicle-status ${car.available ? 'available' : 'unavailable'}`}>
                    {car.available ? '✓ Available' : '✗ Not Available'}
                  </div>
                  <div className="vehicle-price-badge">
                    <span>${Number(car.price_per_day).toFixed(2)}</span>
                    <p>/day</p>
                  </div>
                </div>

                <div className="vehicle-content">
                  <h3 className="vehicle-title">
                    {car.brand} {car.model}
                  </h3>
                  <p className="vehicle-year">Year: {car.year}</p>
                  <p className="vehicle-description">{car.description}</p>

                  <div className="vehicle-features">
                    {car.features && car.features.length > 0 ? (
                      car.features.map((feature) => (
                        <div key={feature.id} className="feature-tag">
                          {getFeatureIcon(feature.name)}
                          <span>{feature.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-features">No features listed</p>
                    )}
                  </div>

                  <button
                    className={`book-button ${car.available ? 'active' : 'disabled'}`}
                    onClick={() => handleBookingClick(car)}
                    disabled={!car.available}
                  >
                    {car.available ? 'Book Now' : 'Not Available'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-vehicles">
              <p>No vehicles available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && selectedCar && (
        <div className="modal-overlay" onClick={() => setBookingModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {selectedCar.brand} {selectedCar.model}</h2>
              <button className="modal-close" onClick={() => setBookingModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="booking-car-preview">
                <img
                  src={
                    selectedCar.image && selectedCar.image.startsWith('http')
                      ? selectedCar.image
                      : selectedCar.image
                      ? `http://127.0.0.1:8000/storage/${selectedCar.image}`
                      : 'https://via.placeholder.com/300x200'
                  }
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                />
                <div className="booking-car-details">
                  <h3>{selectedCar.brand} {selectedCar.model}</h3>
                  <p>${Number(selectedCar.price_per_day).toFixed(2)}/day</p>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="location">
                    <MapPin size={16} /> Pickup Location
                  </label>
                  <select
                    id="location"
                    value={bookingData.location}
                    onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                    required
                  >
                    <option value="">Select location</option>
                    <option value="casablanca">Casablanca</option>
                    <option value="marrakech">Marrakech</option>
                    <option value="agadir">Agadir</option>
                    <option value="fez">Fez</option>
                    <option value="tangier">Tangier</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start_date">
                    <Calendar size={16} /> Pickup Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={bookingData.start_date}
                    onChange={(e) => setBookingData({ ...bookingData, start_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_date">
                    <Calendar size={16} /> Return Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={bookingData.end_date}
                    onChange={(e) => setBookingData({ ...bookingData, end_date: e.target.value })}
                    min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {bookingData.start_date && bookingData.end_date && (
                  <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <div className="summary-item">
                      <span>Days:</span>
                      <span>{Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 60 * 60 * 24))}</span>
                    </div>
                    <div className="summary-item">
                      <span>Price per day:</span>
                      <span>${Number(selectedCar.price_per_day).toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                      <span>Total:</span>
                      <span>
                        ${(
                          Number(selectedCar.price_per_day) *
                          Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 60 * 60 * 24))
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setBookingModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-confirm">
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CarListing;
