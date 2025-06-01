import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import NotFound from '../../components/NotFound/NotFound';
import { useCart } from '../../hooks/useCart'; // Update the path if needed


import './HomePage.css';
import { useAuth } from '../../hooks/useAuth';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';

import {
  FaInstagram, FaBoxOpen, FaUserCircle, FaHandsHelping,
  FaArrowUp, FaBullhorn, 
  FaTimes, FaGift, FaRegStar, FaStar
} from 'react-icons/fa';


const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};


export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();



  // Banner images carousel
  const bannerImages = [
    '/images/image1.png',
    '/images/image2.png',
    '/images/image3.png',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Promotional popup
  const [showPromoPopup, setShowPromoPopup] = useState(true);
  
  // Quick view modal
  const [quickViewFood, setQuickViewFood] = useState(null);
  
  // Newsletter
  
  

  // Category filter
 
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getAllTags().then((tags) => dispatch({ type: 'TAGS_LOADED', payload: tags }));
    const loadFoods = tag ? getAllByTag(tag) : searchTerm ? search(searchTerm) : getAll();
    loadFoods.then((foods) => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag, selectedTag]);

 

  const openQuickView = (food) => {
    setQuickViewFood(food);
  };

  const closeQuickView = () => {
    setQuickViewFood(null);
  };

  return (
    <div className="home-page">
      {/* Promotional Popup */}
      {showPromoPopup && (
        <div className="promo-popup">
          <div className="promo-content bg-white p-4 rounded shadow-lg">
            <button 
              className="close-btn" 
              onClick={() => setShowPromoPopup(false)}
            >
              <FaTimes />
            </button>
            <div className="text-center">
              <FaGift className="text-warning mb-3" size={40} />
              <h4>Welcome Special!</h4>
              <p className="mb-3">10% off on SUPER PACK limited time only! <strong>ISVARYAM</strong></p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowPromoPopup(false);
                  navigate('/');
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header bg-dark text-white py-2 px-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="mb-2 mb-md-0" style={{ flex: 1 }}>
            <Search />
          </div>
          <div className="d-none d-md-block text-end">
            Hello, {user?.name || 'Guest'} <br /> Welcome to Isvaryam
          </div>
        </div>
        <nav className="nav-bottom bg-secondary text-white py-2 text-center mt-2">
          {/* Optional nav links */}
        </nav>
      </header>

      {/* Carousel */}
      <section className="carousel-section w-100 position-relative">
        <img
          src={bannerImages[currentImageIndex]}
          alt={`Banner ${currentImageIndex + 1}`}
          className="w-100 d-block"
          style={{
            height: 'auto',
            objectFit: 'cover',
            maxHeight: '500px',
          }}
        />
        <div className="carousel-overlay">
          <h2>Premium Organic Products</h2>
          <p>Healthy living starts with quality ingredients</p>
          <button 
            className="btn btn-success mt-2"
            onClick={() => navigate('/tag/Cold Pressed')}
          >
            Shop Now
          </button>
        </div>
      </section>

   
      {/* Main Content */}
      <main className="container-fluid px-3 py-4">
          
          <div className="col-md-4">
  <div className="categories-section">
  <h4>Categories to explore</h4>
  <div className="tags-container">
    <Tags tags={tags} />
  </div>
  <button className="btn btn-dark mt-3" onClick={() => navigate('/')}>
    View All Products
  </button>
</div>


         
        </div>

        <h4 className="mt-5">
          {tag ? `Tag: ${tag}` : searchTerm ? `Results for: ${searchTerm}` : 'Featured Products'}
        </h4>

        {foods.length === 0 ? (
          <div className="text-center my-5">
            <div style={{ fontSize: '3rem' }}>🍳</div>
            <h3>No Products Found</h3>
            <p>Try a different search term or browse our tags</p>
            <NotFound linkText="Reset Search" />
          </div>
        ) : (
          <div className="row g-4 mt-3">
            {foods.map((food) => (
              <div key={food.id} className="col-md-3 col-sm-6 col-12">
                <div className="card h-100 product-card" onClick={() => openQuickView(food)}>
                  <Thumbnails foods={[food]} />
                  <div className="card-body">
                    <h5 className="card-title">{food.name}</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="price">${food.price}</span>
                      <div className="rating">
                        {[...Array(5)].map((_, i) => (
                          i < food.rating ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

     {quickViewFood && (
  <div className="quick-view-modal">
    <div className="quick-view-content bg-white p-4 rounded">
      <button className="close-btn" onClick={closeQuickView}>
        <FaTimes />
      </button>
      <div className="row">
        <div className="col-md-6">
          <img
            src={quickViewFood.imageUrl}
            alt={quickViewFood.name}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h3>{quickViewFood.name}</h3>
          <div className="rating mb-3">
            {[...Array(5)].map((_, i) =>
              i < quickViewFood.rating ? (
                <FaStar key={i} className="text-warning" />
              ) : (
                <FaRegStar key={i} />
              )
            )}
            <span className="ms-2">({quickViewFood.reviews} reviews)</span>
          </div>
          <p className="price h4">${quickViewFood.price}</p>
          <p className="description">{quickViewFood.description}</p>

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={() => {
                addToCart(quickViewFood);  // 👈 Add item to cart
                navigate('/cart');         // 👈 Go to CartPage
              }}
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
)}


      {/* Testimonials Section */}
      <section className="container-fluid bg-light py-5 mt-4">
        <div className="container">
          <h3 className="text-center mb-4">What Our Customers Say</h3>
          <div className="row">
            {[
              {
                name: "Sarah J.",
                comment: "The quality of products is exceptional! I've been a customer for 2 years now.",
                rating: 5
              },
              {
                name: "Michael T.",
                comment: "Fast delivery and fresh products every time. Highly recommended!",
                rating: 4
              },
              {
                name: "Priya K.",
                comment: "Love the organic options. My family's health has improved since we switched.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card h-100 p-3">
                  <div className="rating mb-2">
                    {[...Array(5)].map((_, i) => (
                      i < testimonial.rating ? <FaStar key={i} className="text-warning" /> : <FaRegStar key={i} />
                    ))}
                  </div>
                  <p className="flex-grow-1">"{testimonial.comment}"</p>
                  <p className="text-muted mb-0">- {testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-white mt-5">
        <div className="bg-secondary text-center py-2">
          <button
            className="btn btn-link text-white text-decoration-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <FaArrowUp className="me-2" />
            Back to top
          </button>
        </div>

        <div style={{ backgroundColor: '#232f3e' }} className="px-5 py-4">
          <div className="row text-white">
            {[
              {
                title: 'Get to Know Us',
                items: [
                  [<FaUserCircle />, 'About Isvaryam'],
                  [<FaHandsHelping />, 'Careers'],
                  [<FaBullhorn />, 'Press Releases'],
                ],
              },
              {
                title: 'Connect with Us',
                items: [[<FaInstagram />, 'Instagram']],
              },
              
              {
                title: 'Let Us Help You',
                items: [
                  [<FaUserCircle />, 'Your Account'],
                  [<FaBoxOpen />, 'Returns Centre'],
                  [<FaHandsHelping />, 'Help'],
                ],
              },
            ].map((section, i) => (
              <div key={i} className="col-6 col-md-3 mb-3">
                <h6 className="fw-bold">{section.title}</h6>
                <ul className="list-unstyled d-flex flex-column gap-2">
                  {section.items.map(([icon, label], j) => (
                    <li key={j} className="d-flex align-items-center">
                      <span className="icon">{icon}</span>
                      <span className="ms-2">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 pt-3 border-top border-secondary">
            <p>&copy; {new Date().getFullYear()} Isvaryam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
