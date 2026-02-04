import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Users, Gauge, Settings, MapPin, Wind, Armchair, Radio, Navigation, Sun, Car, Timer, Flame, Camera } from 'lucide-react'
import './cars.css'

export default function Cars() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/vehicles?per_page=50')
        // Handle both paginated and direct array responses
        const carsData = Array.isArray(response.data) ? response.data : (response.data.data || [])
        setCars(carsData)
      } catch (error) {
        console.error('Error fetching cars:', error)
        setCars([])
      }
    }
    fetchCars()
  }, [])

const getFeatureIcon = (featureName) => {
  switch (featureName) {
    case '4 Seats':
      return <Users size={18} />
    case 'Hybrid':
      return <Gauge size={18} />
    case 'Automatic':
    case 'Manual':
      return <Settings size={18} />
    case 'Air Conditioning':
      return <Wind size={18} />
    case 'Leather Seats':
      return <Armchair size={18} />
    case 'Bluetooth':
      return <Radio size={18} />
    case 'GPS Navigation':
      return <Navigation size={18} />
    case 'Sunroof':
      return <Sun size={18} />
    case 'All-Wheel Drive':
      return <Car size={18} />
    case 'Cruise Control':
      return <Timer size={18} />
    case 'Heated Seats':
      return <Flame size={18} />
    case 'Rear Camera':
      return <Camera size={18} />
    default:
      return <MapPin size={18} />
  }
}


  return (
    <div className="cars-container">
      {Array.isArray(cars) && cars.length > 0 ? (
        cars.map((car) => (
          <div key={car.id} className="car-card">
            <div className="car-image">
              <img
                src={
                  car.image && car.image.startsWith('http')
                    ? car.image
                    : car.image ? `http://127.0.0.1:8000/storage/${car.image}` : 'https://via.placeholder.com/300x200'
                }
                alt={`${car.brand} ${car.model}`}
              />
              {car.available ? (
                <div className="car-status available">Available</div>
              ) : (
                <div className="car-status unavailable">Unavailable</div>
              )}
              <div className="car-price">
                <strong>{Math.round(car.price_per_day)} MAD</strong> / day
              </div>
            </div>

            <div className="car-details">
              <h3 className="car-title">
                {car.brand} {car.model}
              </h3>
              {car.year && <p className="car-year">Year: {car.year}</p>}
              <p className="car-subtitle">{car.description}</p>

              <div className="car-info">
                {car.features && car.features.length > 0 ? (
                  car.features.map((feature) => (
                    <div key={feature.id}>
                      {getFeatureIcon(feature.name)} {feature.name}
                    </div>
                  ))
                ) : (
                  <div>No features available</div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
          {cars === null ? 'Loading cars...' : 'No cars available'}
        </div>
      )}
    </div>
  )
}
