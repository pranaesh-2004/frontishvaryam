import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import './HomePage.css';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';

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

  useEffect(() => {
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag]);

  return (
    <div className="home-page container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Delicious Food Recipes</h1>
        <p className="hero-subtitle">Discover amazing recipes for every occasion</p>
      </section>

      {/* Search Section */}
      <div className="search-container">
        <Search />
      </div>

      {/* Tags Section */}
      <section className="tags-section">
        <h2 className="section-title">Browse by Tags</h2>
        <Tags tags={tags} />
      </section>

      {/* Food Grid Section */}
      <section className="food-grid-section">
        <h2 className="section-title">
          {tag ? `Tag: ${tag}` : searchTerm ? `Results for: ${searchTerm}` : 'Featured Recipes'}
        </h2>
        
        {foods.length === 0 ? (
          <div className="not-found-container">
            <div className="not-found-icon">🍳</div>
            <h3 className="not-found-title">No Recipes Found</h3>
            <p className="not-found-text">Try a different search term or browse our tags</p>
            <NotFound linkText="Reset Search" />
          </div>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <div key={food.id} className="food-item">
                <Thumbnails foods={[food]} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
