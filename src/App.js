import React, { useEffect } from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Loader from './components/loader';
import lazyWithRetry from './utils/lazyWithRetry';
import ErrorBoundary from './components/errorBoundary';

const HomePage = lazyWithRetry(()=> import('./pages/home'));
const BlogPage = lazyWithRetry(()=> import('./pages/blog'));
const ShopPage = lazyWithRetry(()=> import('./pages/shop'));
const CartPage = lazyWithRetry(()=> import('./pages/cart'));
const SuccessPage = lazyWithRetry(()=> import('./pages/success'));
const UsersPage = lazyWithRetry(()=> import('./pages/users'));
const OrderPage = lazyWithRetry(()=> import('./pages/orders'));
const AboutUsPage = lazyWithRetry(()=> import('./pages/about'));
const ForgottenPasswordPage = lazyWithRetry(()=> import('./pages/forgotten'))
const BulkPage = lazyWithRetry(()=> import('./pages/bulk'))
const ContactPage = lazyWithRetry(()=> import('./pages/contact'))
const ProductPage = lazyWithRetry(()=> import('./pages/singleProduct'))


const NewHomePage = lazyWithRetry(()=> import('./new_pages'))
const CookingClassPage = lazyWithRetry(()=> import('./new_pages/cooking_class'))
const CookingClassDetailsPage = lazyWithRetry(()=> import('./new_pages/cooking_class_details'))
const BundlePage = lazyWithRetry(()=> import('./new_pages/bundles'))
const OurStoryPage = lazyWithRetry(()=> import('./new_pages/about'))
const BlogsPage = lazyWithRetry(()=> import('./new_pages/blogs'))
const RecipesPage = lazyWithRetry(()=> import('./new_pages/recipe'))
const RecipeDetailsPage = lazyWithRetry(()=> import('./new_pages/recipe_details'))
const FaqPage = lazyWithRetry(()=> import('./new_pages/faq'))
const ProductDetailsPage = lazyWithRetry(()=> import('./new_pages/product_details'))
const AllShopPage = lazyWithRetry(()=> import('./new_pages/shop'))
const CuratedBundlePage = lazyWithRetry(()=> import('./new_pages/bundle'))
const BundleDetailsPage = lazyWithRetry(()=> import('./new_pages/bundle_details'))
const AccountPage = lazyWithRetry(()=> import('./new_pages/account'))
const PrivacyPage = lazyWithRetry(()=> import('./new_pages/privacy'))
// const WholesalePolicyPage = lazyWithRetry(()=> import('./new_pages/wholesale_policy'))
const WholesalePage = lazyWithRetry(()=> import('./new_pages/wholesale'))
const TermsOfServicePage = lazyWithRetry(()=> import('./new_pages/terms_of_service'))
const ReviewPage = lazyWithRetry(()=> import('./new_pages/review'))
const ReviewsPage = lazyWithRetry(()=> import('./new_pages/reviews'))
const PaymentSuccessPage = lazyWithRetry(()=> import('./new_pages/payment_success'))

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ErrorBoundary>
    <React.Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<NewHomePage/>}></Route>
        <Route path='/cooking-class' element={<CookingClassPage/>}></Route>
        <Route path='/cooking-class-details' element={<CookingClassDetailsPage/>}></Route>
        <Route path='/bundle' element={<BundlePage/>}></Route>
        <Route path='/bundles' element={<CuratedBundlePage/>}></Route>
        <Route path='/bundle-detail/:bundleId' element={<BundleDetailsPage/>}></Route>
        <Route path='/our-story' element={<OurStoryPage/>}></Route>
        <Route path='/blogs' element={<BlogsPage/>}></Route>
        <Route path='/recipes' element={<RecipesPage/>}></Route>
        <Route path='/recipe-detail' element={<RecipeDetailsPage/>}></Route>
        <Route path='/product-detail' element={<ProductDetailsPage/>}></Route>
        <Route path='/product-detail/:sku' element={<ProductDetailsPage/>}></Route>
        <Route path='/faqs' element={<FaqPage/>}></Route>
        <Route path='/privacy' element={<PrivacyPage/>}></Route>
        <Route path='/wholesale' element={<WholesalePage/>}></Route>
        {/* <Route path='/wholesale-policy' element={<WholesalePolicyPage/>}></Route> */}
        <Route path='/terms-of-service' element={<TermsOfServicePage/>}></Route>
        <Route path='/shop' element={<AllShopPage/>}></Route>
        <Route path='/account' element={<AccountPage/>}></Route>
        <Route path='/review/:orderReference' element={<ReviewPage/>}></Route>
        <Route path='/reviews' element={<ReviewsPage/>}></Route>
        <Route path='/payment-success' element={<PaymentSuccessPage/>}></Route>

        {/* <Route path='/about' element={<AboutUsPage/>}></Route>
        <Route path='/blog' element={<BlogPage/>}></Route>
        <Route path='/cart' element={<CartPage/>}></Route>
        <Route path='/success' element={<SuccessPage/>}></Route>
        <Route path='/orders' element={<OrderPage/>}></Route>
        <Route path='/credentials' element={<UsersPage/>}></Route>
        <Route path='/contact_us' element={<ContactPage/>}></Route>
        <Route path='/product' element={<ProductPage/>}></Route>
        <Route path='/bulk_shop' element={<BulkPage/>}></Route>
        <Route path='/forgotten_password' element={<ForgottenPasswordPage/>}></Route> */}
      </Routes>
    </React.Suspense>
    </ErrorBoundary>
  );
}

export default App;
