import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../../components/Price/Price';
import Title from '../../components/Title/Title';
import { useCart } from '../../hooks/useCart';
import classes from './cartPage.module.css';
import NotFound from '../../components/NotFound/NotFound';

export default function CartPage() {
  const { cart, removeFromCart, changeQuantity } = useCart();

  return (
    <div className={classes.cart_page_container}>
      <Title title="Shopping Cart" margin="1.5rem 0 0 2.5rem" />

      {cart.items.length === 0 ? (
        <NotFound message="Your cart is empty" />
      ) : (
        <>
          <div className={classes.cart_container}>
            <div className={classes.cart_header}>
              <div className={classes.header_item}>
                <h3>Product</h3>
              </div>
              <div className={classes.header_item}>
                <h3>Price</h3>
              </div>
              <div className={classes.header_item}>
                <h3>Quantity</h3>
              </div>
              <div className={classes.header_item}>
                <h3>Subtotal</h3>
              </div>
              <div className={classes.header_item}>
                <h3>Action</h3>
              </div>
            </div>

            <div className={classes.cart_items}>
              {cart.items.map(item => (
                <div key={item.food.id} className={classes.cart_item}>
                  <div className={classes.item_details}>
                    <div className={classes.item_image}>
                      <img src={`${item.food.imageUrl}`} alt={item.food.name} />
                    </div>
                    <div className={classes.item_info}>
                      <Link to={`/food/${item.food.id}`} className={classes.item_name}>{item.food.name}</Link>
                      <div className={classes.item_availability}>In Stock</div>
                      <div className={classes.item_gift_options}>Gift options not available.</div>
                    </div>
                  </div>

                  <div className={classes.item_price}>
                    <Price price={item.food.price} />
                  </div>

                  <div className={classes.item_quantity}>
                    <select
                      value={item.quantity}
                      onChange={e => changeQuantity(item, Number(e.target.value))}
                      className={classes.quantity_select}
                    >
                      {[...Array(10).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className={classes.item_subtotal}>
                    <Price price={item.price} />
                  </div>

                  <div className={classes.item_actions}>
                    <button
                      className={classes.remove_button}
                      onClick={() => removeFromCart(item.food.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={classes.cart_summary}>
              <div className={classes.subtotal}>
                <span>Subtotal ({cart.totalCount} items): </span>
                <span className={classes.subtotal_price}><Price price={cart.totalPrice} /></span>
              </div>
              <div className={classes.checkout_actions}>
                <Link to="/checkout" className={classes.checkout_button}>Proceed to Checkout</Link>
                <div className={classes.secure_checkout}>
                  <i className={`${classes.lock_icon} fas fa-lock`}></i>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>

          <div className={classes.related_suggestions}>
            <h3>Frequently bought together</h3>
            <div className={classes.suggestion_items}>
              {/* You can add suggested items here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}