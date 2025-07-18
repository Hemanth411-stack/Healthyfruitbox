import { useState, useEffect } from "react";
import { FiChevronDown, FiLogOut, FiLogIn, FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
import { FaPhone, FaTimes, FaBars, FaUser, FaSignOutAlt, FaBoxOpen, FaUserShield, FaTruck, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/Userslice.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { fetchUserSubscriptions, selectSubscriptions } from "../redux/slices/Subscription.js";
import { selectCartItemCount } from "../redux/slices/addtocart.js";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionData = useSelector(selectSubscriptions);
  const subscriptions = subscriptionData?.subscriptions || [];
  const cartItemCount = useSelector(selectCartItemCount);
  const hasActiveSubscription = subscriptions?.some(
    (sub) => sub.status === "active" || sub.status === "completed" || sub.status === "pending"
  );

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserSubscriptions());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const goToMyPlans = () => {
    navigate('/subscriptionpage');
    setIsMenuOpen(false);
  };

  const goToAdminDashboard = () => {
    navigate('/admin-dashboard');
    setIsMenuOpen(false);
  };

  const goToDeliveries = () => {
    navigate('/manage-delivery');
    setIsMenuOpen(false);
  };

  // Only include cart if user is logged in
  const navItems = [
    { id: "plans", label: "Plans" },
    { id: "why-us", label: "Why Choose Us" },
    ...(userInfo ? [{ id: "cart", label: "My Cart", isCart: true }] : []),
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-gradient-to-r from-yellow-300 to-yellow-200 shadow-md py-2" 
            : "bg-gradient-to-r from-yellow-300 to-yellow-200 shadow-md py-3"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link 
            to='/' 
            className="flex items-center group"
          >
            <img 
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Fruit-Download-Box-Logo-Template-1-scaled.jpg"
              alt="7Star Fruit Box Logo"
              className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400 shadow-md hover:scale-105 transition-all duration-300 group-hover:rotate-6"
            />
            <span className="ml-2 font-bold text-xl relative">
              <span className="text-red-600 transition-colors duration-300">Healthy</span>
              <span className="text-shadow-amber-950 transition-colors duration-300 relative inline-block">
                Fruit Box
                <span className="absolute -top-4 -right-4">
                  <span className="relative inline-block animate-bounce duration-1000 ease-in-out infinite">
                    <span className="absolute -top-1 -right-1 text-yellow-300 opacity-70 animate-ping duration-1000 ease-out infinite">
                      🍎
                    </span>
                    <span className="relative">
                      🍎
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {userInfo?.role === 'admin' && (
              <button
                onClick={goToAdminDashboard}
                className="flex items-center space-x-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-white group-hover:text-blue-200 transition-colors duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <span className="text-white font-medium text-sm tracking-wider group-hover:text-blue-100 transition-colors duration-300">
                  Admin Dashboard
                </span>
              </button>
            )}
            
            {userInfo?.role === 'deliveryboy' && (
              <button
                onClick={goToDeliveries}
                className="flex items-center text-shadow-amber-950  transition-all duration-300 font-medium text-sm uppercase tracking-wider hover:-translate-y-0.5"
              >
                <FaTruck className="mr-2 transition-transform duration-300 hover:scale-110" /> Deliveries
              </button>
            )}
            
            {userInfo && hasActiveSubscription && (
              <button
                onClick={goToMyPlans}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-1.5 bg-red-500 bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition-all duration-300">
                  <FaBoxOpen className="text-white text-opacity-90 group-hover:text-opacity-100 h-4 w-4" />
                </div>
                <span className="font-medium text-sm tracking-wide">My Subscriptions</span>
                <FiChevronRight className="ml-1 h-4 w-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </button>
            )}
            
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isCart) {
                    navigate('/cart');
                  } else {
                    handleSmoothScroll(item.id);
                  }
                  setIsMenuOpen(false);
                }}
                className="text-shadow-amber-950 py-2 font-medium text-sm text-left transition-colors duration-300"
              >
                {item.isCart ? (
                  <div className="relative p-2">
                    <FaShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                ) : (
                  item.label
                )}
              </button>
            ))}
          </nav>

          {/* Contact and Auth Buttons */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="hidden md:flex items-center space-x-4">
                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm border border-blue-50 transition-all duration-200 group-hover:from-blue-200 group-hover:to-blue-300">
                      <FaUser className="text-blue-600 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {userInfo.name.split(' ')[0]}
                    </span>
                    <FiChevronDown className="text-gray-500 text-xs transition-transform duration-200 group-hover:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-700">{userInfo.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-150"
                    >
                      <FiLogOut className="text-gray-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:flex items-center bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <FiLogIn className="mr-2" />
                  Sign In
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-16 left-0 right-0 bg-gradient-to-b bg-yellow-200 shadow-2xl md:hidden transition-all duration-500 ease-in-out z-50 ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full pointer-events-none"
            }`}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {userInfo?.role === 'admin' && (
                  <button
                    onClick={goToAdminDashboard}
                    className="md:hidden flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 mr-3 rounded-lg bg-red-50 text-red-600">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                      <span className="text-gray-800 font-medium">Admin Dashboard</span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="ml-auto h-5 w-5 text-gray-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>
                )}
                
                {userInfo?.role === 'deliveryboy' && (
                  <button
                    onClick={goToDeliveries}
                    className="flex items-center text-shadow-amber-950  py-2 font-medium text-sm transition-colors duration-300"
                  >
                    <FaTruck className="mr-2 text-yellow-300" /> Deliveries
                  </button>
                )}
                
                {userInfo && hasActiveSubscription && (
                  <button
                    onClick={goToMyPlans}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="p-1.5 bg-red-500 bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition-all duration-300">
                      <FaBoxOpen className="text-white text-opacity-90 group-hover:text-opacity-100 h-4 w-4" />
                    </div>
                    <span className="font-medium text-sm tracking-wide">My Subscriptions</span>
                    <FiChevronRight className="ml-1 h-4 w-4 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                  </button>
                )}
                
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isCart) {
                        navigate('/cart');
                      } else {
                        handleSmoothScroll(item.id);
                      }
                      setIsMenuOpen(false);
                    }}
                    className="text-shadow-amber-950 py-2 font-medium text-sm text-left transition-colors duration-300"
                  >
                    {item.isCart ? (
                      <div className="flex items-center">
                        <FaShoppingCart className="mr-2" />
                        {item.label}
                        {cartItemCount > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                      </div>
                    ) : (
                      item.label
                    )}
                  </button>
                ))}

                <a
                  href="tel:+919959519570"
                  className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-violet-900 px-4 py-2 rounded-md transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl mt-4"
                >
                  <FaPhone className="mr-2" />
                  +91 9959519570
                </a>
                
                {userInfo ? (
                  <>
                    <div className="flex items-center space-x-2 py-2 border-t border-violet-500 pt-4">
                      <div className="w-8 h-8 rounded-full bg-violet-700 flex items-center justify-center">
                        <FaUser className="text-shadow-amber-950 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-shadow-amber-950">
                        {userInfo.name.split(' ')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center text-shadow-amber-950 bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-md transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-violet-900 px-4 py-2 rounded-md transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;