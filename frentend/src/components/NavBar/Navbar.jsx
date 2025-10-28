
import './navbar.css';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
export default function Navbar() {
const [isOpen, setOpen] = useState(false);
  return (
      <div className="navbar">
        <div className="logo">
            <img src='https://car-rental-gs.vercel.app/assets/logo-CF3gF4eH.svg' alt="Logo" />
        </div>
        <div className='menu-icon'onClick={()=>setOpen(!isOpen)}>
            {isOpen?<X size={20}/>:<Menu size={20}/>}
        </div>
        <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
            <li><a href="">Home</a></li>
            <li><a href="">Cars</a></li>
            <li><a href="">My Booking</a></li>
            <div className="search-box">
                <input type="text" placeholder="Search..."/>
                <Search className='search-icon'size={14}/>
                
            </div>
            <li className='list-cars'>List cars</li>
            <ul className="auth-links">
                <li><a href="/login">Login</a></li>
             </ul>
        </ul>

      </div>

  );
}