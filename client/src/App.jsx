import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './componentss/Header';
import HeroSection from './componentss/Hero';
import FruitBoxPlans from './componentss/Pricings';
import WhyChooseUs from './componentss/whychooseus';
import SmoothRender from './componentss/smoothrender';
// import CustomerReviews from './componentss/customer-review';
import Footer from './componentss/Footer';
import MediumBoxDetails from './componentss/productdetailspage';
// import SubscriptionForm from './componentss/checkoutpage';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import SuccessPage from './componentss/Successpage';
import SubscriptionDashboard from './componentss/subscriptionpage';
import MyDeliveries from './componentss/mydelivery';
import DeliveryBoyRegister from './pages/deliveryboiregister';
import DeliveryBoyLogin from './pages/deliveryboilogin';
import DeliveryManagement from './componentss/deliveryboimanagement';
import AdminDashboard from './componentss/admindashboard';
import DeliveriesList from './componentss/adminalldeliveries';
import DeliveryBoysList from './componentss/deliveryboidetails';
import {  JuiceSection } from './componentss/juicecard';
import {CorporateJuiceSubscriptions} from "./componentss/alljuices.jsx"
import CartPage from './componentss/cartpage.jsx';
import ProductList from './componentss/allproducts.jsx';
import CheckoutPage from './componentss/checkoutpage';


const HomePage = () => (
  <div className="overflow-x-hidden ">
    <Header />
    <SmoothRender delay={0}>
      <HeroSection />
    </SmoothRender>
    <SmoothRender delay={200}>
      <FruitBoxPlans />
    </SmoothRender>
    <SmoothRender delay={300}>
    <JuiceSection/>
    
    </SmoothRender>
  
    <SmoothRender delay={400}>
      <WhyChooseUs />
    </SmoothRender>
    {/* <CustomerReviews /> */}
    <Footer />
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/juices' element={<CorporateJuiceSubscriptions/>}></Route>
      <Route path="/products/:id" element={<MediumBoxDetails />} />
      <Route path='/checkout' element={<CheckoutPage/>}/>
      <Route path='/signup' element={<SignupPage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/success' element={<SuccessPage/>}></Route>
      <Route path='/subscriptionpage' element={<SubscriptionDashboard/>}></Route>
      <Route path="/deliveries" element={<MyDeliveries />} />
       <Route path="/delivery-boi-register" element={<DeliveryBoyRegister />} />
      <Route path="/login-deliverboi" element={<DeliveryBoyLogin />} />
      <Route path="/manage-delivery" element={<DeliveryManagement />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
       <Route path="/admin-all-deliveries" element={<DeliveriesList />} />
       <Route path="/admin-all-deliveriesboidetails" element={<DeliveryBoysList />} />
       <Route path='/cart' element={<CartPage/>}></Route>
       <Route path='/products' element={<ProductList/>}></Route>
    </Routes>
  );
};

export default App;