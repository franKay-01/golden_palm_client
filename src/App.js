import React, { useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';

const HomePage = React.lazy(()=> import('./pages/home'));
const BlogPage = React.lazy(()=> import('./pages/blog'));
const ShopPage = React.lazy(()=> import('./pages/shop'));
const CartPage = React.lazy(()=> import('./pages/cart'));
const SuccessPage = React.lazy(()=> import('./pages/success'));
const UsersPage = React.lazy(()=> import('./pages/users'));
const OrderPage = React.lazy(()=> import('./pages/orders'));
const AboutUsPage = React.lazy(()=> import('./pages/about'));
const ForgottenPasswordPage = React.lazy(()=> import('./pages/forgotten'))
const BulkPage = React.lazy(()=> import('./pages/bulk'))
const ContactPage = React.lazy(()=> import('./pages/contact'))
const ProductPage = React.lazy(()=> import('./pages/singleProduct'))


const NewHomePage = React.lazy(()=> import('./new_pages'))
const CookingClassPage = React.lazy(()=> import('./new_pages/cooking_class'))
const CookingClassDetailsPage = React.lazy(()=> import('./new_pages/cooking_class_details'))
const BundlePage = React.lazy(()=> import('./new_pages/bundles'))
const OurStoryPage = React.lazy(()=> import('./new_pages/about'))
const BlogsPage = React.lazy(()=> import('./new_pages/blogs'))
const RecipesPage = React.lazy(()=> import('./new_pages/recipe'))
const RecipeDetailsPage = React.lazy(()=> import('./new_pages/recipe_details'))
const FaqPage = React.lazy(()=> import('./new_pages/faq'))
const ProductDetailsPage = React.lazy(()=> import('./new_pages/product_details'))
const AllShopPage = React.lazy(()=> import('./new_pages/shop'))
const CuratedBundlePage = React.lazy(()=> import('./new_pages/bundle'))
const AccountPage = React.lazy(()=> import('./new_pages/account'))
const PrivacyPage = React.lazy(()=> import('./new_pages/privacy'))
const WholesalePolicyPage = React.lazy(()=> import('./new_pages/wholesale_policy'))
const TermsOfServicePage = React.lazy(()=> import('./new_pages/terms_of_service'))
const ReviewPage = React.lazy(()=> import('./new_pages/review'))
const ReviewsPage = React.lazy(()=> import('./new_pages/reviews'))

const App = () => {
  return (
    <React.Suspense fallback={"..... loading"}>
      <Routes>
        <Route path='/' element={<NewHomePage/>}></Route>
        <Route path='/cooking-class' element={<CookingClassPage/>}></Route>
        <Route path='/cooking-class-details' element={<CookingClassDetailsPage/>}></Route>
        <Route path='/bundle' element={<BundlePage/>}></Route>
        <Route path='/bundles' element={<CuratedBundlePage/>}></Route>
        <Route path='/our-story' element={<OurStoryPage/>}></Route>
        <Route path='/blogs' element={<BlogsPage/>}></Route>
        <Route path='/recipes' element={<RecipesPage/>}></Route>
        <Route path='/recipe-detail' element={<RecipeDetailsPage/>}></Route>
        <Route path='/product-detail' element={<ProductDetailsPage/>}></Route>
        <Route path='/faqs' element={<FaqPage/>}></Route>
        <Route path='/privacy' element={<PrivacyPage/>}></Route>
        <Route path='/wholesale' element={<WholesalePolicyPage/>}></Route>
        <Route path='/terms-of-service' element={<TermsOfServicePage/>}></Route>
        <Route path='/shop' element={<AllShopPage/>}></Route>
        <Route path='/account' element={<AccountPage/>}></Route>
        <Route path='/review/:orderReference' element={<ReviewPage/>}></Route>
        <Route path='/reviews' element={<ReviewsPage/>}></Route>

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
  );
}

export default App;
