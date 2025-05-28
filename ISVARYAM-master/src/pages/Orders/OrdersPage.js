import React, { useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAll, getAllStatus } from '../../services/orderService';
import classes from './ordersPage.module.css';
import Title from '../../components/Title/Title';
import DateTime from '../../components/DateTime/DateTime';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const initialState = { allStatus: [], orders: [], loading: true };
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'ALL_STATUS_FETCHED':
      return { ...state, allStatus: payload };
    case 'ORDERS_FETCHED':
      return { ...state, orders: payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function OrdersPage() {
  const [{ allStatus, orders, loading }, dispatch] = useReducer(reducer, initialState);
  const { filter } = useParams();
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'LOADING' });
        const [status, orderData] = await Promise.all([
          getAllStatus(),
          getAll(filter)
        ]);
        dispatch({ type: 'ALL_STATUS_FETCHED', payload: status });
        dispatch({ type: 'ORDERS_FETCHED', payload: orderData });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR' });
      }
    };

    fetchData();
  }, [filter]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return <Loading />;

  return (
    <div className={classes.container}>
      <Title title="Your Orders" margin="1.5rem 0 1rem 0" fontSize="2.2rem" />

      {allStatus && (
        <div className={classes.filter_tabs}>
          <Link 
            to="/orders" 
            className={`${classes.tab} ${!filter ? classes.active : ''}`}
          >
            All Orders
          </Link>
          {allStatus.map(state => (
            <Link
              key={state}
              className={`${classes.tab} ${state === filter ? classes.active : ''}`}
              to={`/orders/${state}`}
            >
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </Link>
          ))}
        </div>
      )}

      {orders?.length === 0 ? (
        <NotFound
          linkRoute={filter ? '/orders' : '/'}
          linkText={filter ? 'Show All Orders' : 'Back to Home'}
          message={`No ${filter ? filter : ''} orders found`}
        />
      ) : (
        <div className={classes.orders_list}>
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`${classes.order_card} ${expandedOrder === order.id ? classes.expanded : ''}`}
            >
              <div 
                className={classes.order_header}
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className={classes.order_id}>Order #{order.id}</div>
                <div className={classes.order_status} data-status={order.status}>
                  {order.status}
                </div>
                <div className={classes.order_date}>
                  <DateTime date={order.createdAt} />
                </div>
                <div className={classes.order_total}>
                  Total: <Price price={order.totalPrice} />
                </div>
                <div className={classes.expand_icon}>
                  {expandedOrder === order.id ? '−' : '+'}
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className={classes.order_details}>
                  <div className={classes.items_grid}>
                    {order.items.map(item => (
                      <Link 
                        key={item.food.id} 
                        to={`/food/${item.food.id}`}
                        className={classes.item_card}
                      >
                        <img 
                          src={item.food.imageUrl} 
                          alt={item.food.name} 
                          className={classes.item_image}
                        />
                        <div className={classes.item_info}>
                          <span className={classes.item_name}>{item.food.name}</span>
                          <span className={classes.item_quantity}>x{item.quantity}</span>
                          <span className={classes.item_price}>
                            <Price price={item.price} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className={classes.order_actions}>
                    <Link 
                      to={`/track/${order.id}`} 
                      className={classes.track_button}
                    >
                      Track Order
                    </Link>
                    <button className={classes.reorder_button}>
                      Reorder
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}