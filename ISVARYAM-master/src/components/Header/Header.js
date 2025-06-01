import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import classes from './header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  // Auto-close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
          Isvaryam
        </Link>

        <button className={classes.hamburger} onClick={toggleMenu}>
          ☰
        </button>

        <nav
          ref={navRef}
          className={`${classes.nav} ${menuOpen ? classes.open : ''}`}
        >
          <ul className={classes.nav_links}>
            {user && (
              <>
                <li>
                  <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                </li>
                <li>
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>{user.name}</Link>
                </li>

                {user.isAdmin && (
                  <>
                    <li>
                      <Link to="/admin/users" onClick={() => setMenuOpen(false)}>Users</Link>
                    </li>
                    <li>
                      <Link to="/admin/foods" onClick={() => setMenuOpen(false)}>Foods</Link>
                    </li>
                  </>
                )}

                <li>
                  <a
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Logout
                  </a>
                </li>
              </>
            )}

            {!user && (
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
            )}

            <li>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                Cart
                {cart.totalCount > 0 && (
                  <span className={classes.cart_count}>{cart.totalCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
