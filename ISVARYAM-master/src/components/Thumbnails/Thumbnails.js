import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';
import classes from './thumbnails.module.css';

export default function Thumbnails({ foods, onQuickView }) {
  return (
    <ul className={classes.list}>
      {foods.map(food => (
        <li key={food.id} className={classes.card}>
          <div className={classes.imageWrapper}>
            <Link to={`/food/${food.id}`}>
              <img
                className={classes.image}
                src={food.imageUrl}
                alt={food.name}
              />
            </Link>

            <span
              className={`${classes.favorite} ${
                food.favorite ? '' : classes.not
              }`}
            >
              ❤
            </span>

            <button
              className={classes.quickView}
              onClick={() => onQuickView && onQuickView(food)}
            >
              Quick View
            </button>
          </div>

          <div className={classes.content}>
            <div className={classes.name}>{food.name}</div>

            <div className={classes.stars}>
              <StarRating stars={food.stars} />
            </div>

            <div className={classes.product_item_footer}>
              <div className={classes.origins}>
                {food.origins.map(origin => (
                  <span key={origin}>{origin}</span>
                ))}
              </div>
            </div>

            <div className={classes.price}>
              <Price price={food.price} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
