import useAxios from "../hooks/hook";

const useFunctions = () => {
  const { executeReq, executeGet } = useAxios();

  const sendUserToken = async (params) => {
    const {data} = await executeReq('common/send-token', params)
    return {response_code: data.response_code, response_message: data.response_message}
  }

  const checkToken = async (params) => {
    const {data} = await executeReq('common/check-token', params)
    return {response_code: data.response_code, response_message: data.response_message}
  }

  const submitContactDetails = async (params) => {
    const {data} = await executeReq('common/contacts', params)
    return {response_code: data.response_code, response_message: data.response_message}
  }

  const submitPasswordChange = async (params) => {
    try {
      const {data} = await executeReq('users/change-user-password', params)
      let response = {};

      switch (data.response_code) {
        case 200:
          response = { response_code: 200, checkout_url: data.url, error: false, msg: "" };
          break;
        case 300:
          response = { response_code: 300, error: true, msg: "Token expired. Please sign in to continue" };
          break;
        case 301:
          response = { response_code: 301, error: true, msg: "Zipcode is incorrect. Please enter a valid zipcode" };
          break;
        default:
          response = { response_code: 200, checkout_url: null, error: true, msg: "" };
          break;
      }

      return response

    }catch (err){
      return {response_code: 200, checkout_url: null, error: true, msg: ""}
    }
  }

  const submitCheckOut = async (params) => {
    try {
      const {data} = await executeReq('stripe/create-checkout-session', params)
      let response = {};

      switch (data.response_code) {
        case 200:
          response = {response_code: 200, checkout_url: data.url, error: false, msg: ""}
          break
        case 300:
          response = {response_code: 300, error: true, msg: "Token expired. Please sign in to continue"}
          break
        case 301:
          response = {response_code: 301, error: true, msg: "Zipcode is in-correct. Please enter valid zipcode"}
          break
        case 302:
          response = {response_code: 302, error: true, msg: data.msg}
          break
        case 305:
          // Cart prices are stale (a sale started/ended after items were added).
          // Do NOT redirect; return the mismatches so the cart can correct itself.
          response = {response_code: 305, error: true, priceMismatch: true, msg: data.msg || "Some prices in your cart have changed.", mismatches: data.mismatches || []}
          break
        case 309:
          // Discount code rejected at final validation. Do NOT redirect to Stripe;
          // surface the message so the user can fix or remove the code.
          response = {response_code: 309, error: true, discountRejected: true, msg: data.msg || "Your discount code is no longer valid. Please update or remove it."}
          break
        case 306:
        case 307:
          // 306 = product out of stock, 307 = variation out of stock.
          // Do NOT proceed to Stripe; surface the message and prompt the user to update their cart.
          response = {response_code: data.response_code, error: true, outOfStock: true, msg: data.msg || "An item in your cart is out of stock. Please update your cart to continue."}
          break
        default:
          // Any other code in the 300s with a message: treat as a checkout blocker, not a Stripe redirect.
          if (typeof data.response_code === 'number' && data.response_code >= 300 && data.response_code < 400 && data.msg) {
            response = {response_code: data.response_code, error: true, outOfStock: true, msg: data.msg}
          } else {
            response = {response_code: 200, checkout_url: null, error: true, msg: data.msg || "An error occurred"}
          }
          break
      }

      return response

    }catch (err){
      return {response_code: 200, checkout_url: null, error: true, msg: err.message || "An error occurred"}
    }
  }

  const validateDiscountCode = async (params) => {
    try {
      const {data} = await executeReq('discount-codes/validate', params)
      // Valid code
      if (data.response_code === 200 || data.response_code === "000") {
        return {
          valid: true,
          response_code: data.response_code,
          msg: data.msg || data.response_message || "Discount code applied",
          discount: data.discount ?? null
        }
      }
      // Invalid / rejected code
      return {
        valid: false,
        response_code: data.response_code,
        msg: data.msg || data.response_message || "This discount code is not valid"
      }
    } catch {
      return { valid: false, response_code: '001', msg: "Could not validate discount code. Please try again" }
    }
  }

  const addCartItem = async (params) => {
    try {
      const {data} = await executeReq('cart/items', params)
      // Backend can return HTTP 200 with response_code "002" when the item is out of stock.
      if (data.response_code === "002" || data.response_code === 2) {
        return {response_code: "002", response_message: data.response_message || "This item is out of stock"}
      }
      return {response_code: data.response_code || "000", response_message: data.response_message || ""}
    } catch {
      return {response_code: "001", response_message: "Item could not be added to cart. Please try again"}
    }
  }

  const getAllCurated = async () => {
    try {
      const {data, status} = await executeGet(`curated-bundles`)
      if (status === 403){
        // logout()
        alert(JSON.stringify(data))
      }

      if (data.response_code === "000"){
        return { response_code: "000", curated: data.bundles }
      }

      return {response_code: "001"}
    }catch{
      return {response_code: "001"}
    }
  }

  const getOrdersDetailsForReview = async (orderId) => {
    try {
      const {data} = await executeGet(`order/${orderId}`)

      if (data.response_code === "000"){
        return { response_code: "000", orders: data.orders }
      }

      return {response_code: "001"}
    }catch{
      return {response_code: "001"}
    }
  }

  const getCuratedSelectedBundle = async (bundleType) => {
    try {
      const {data, status} = await executeGet(`curated-bundles/type/${bundleType}`)
      if (status === 403){
        alert(JSON.stringify(data))
        return {response_code: "001"}
      }

      if (data.response_code === "000"){
        return { response_code: "000", curated: data.bundles, bundle_type: data.bundle_type }
      }

      return {response_code: "001"}
    }catch{
      return {response_code: "001"}
    }
  }

  const getProductDetail = async (sku) => {
    try {
      const {data, status} = await executeGet(`product-info/${sku}`)
      if (status === 403){
        alert(JSON.stringify(data))
        return {response_code: "001"}
      }

      if (data.response_code === "000"){
        return {
          response_code: "000",
          product: data.product,
          related_products: data.related_products || data.product?.related_products || []
        }
      }

      return {response_code: "001"}
    }catch{
      return {response_code: "001"}
    }
  }

  const getProducts = async () => {
    try{
      const { data } = await executeGet('product-info')
      return {response_code: data.response_code, products: data.products}
    }catch{
      return {response_code: '001'}
    }
  }

  const createEmailSubscription = async (params) => {
    try{
      const { data } = await executeReq('common/newsletter-subscription', params)
      return {response_code: data.response_code, msg: data.response_message}
    }catch{
      return {response_code: '001'}
    }
  }

  const signUp = async (params) => {
    try {
      const {data} = await executeReq('users', params)
      if (data.response_code === 200){
        return {response_code: 200}
      }else{
        return {response_code: 201, msg: data.error.message}
      }
    }catch{
      return {response_code: 201, msg: "Sign Up process failed. Please try again in a few minutes"}
    }
  }

  const signUserIn = async (params) => {
    try {
      const {data} = await executeReq('users/signin', params)
      if (data.response_code === 200){
        return {response_code: 200, token: data.token, client_username: data.username ,msg: null}
      }else if (data.response_code === 300){
        return {response_code: 300, msg: "Token expired. Please sign in to continue"}
      }else{
        return {response_code: 201, token: null, client_username: null ,msg: data.error.message}
      }
    }catch{
      return {response_code: 201,  token: null, client_username: null, msg: "Sign In process failed. Please try again in a few minutes"}
    }
  }

  const getOrders = async () => {
    try {
      const {data} = await executeGet('order/customer')
      if (data.response_code === 200){
        return {response_code: 200, orders: data.orders}
      }else if (data.response_code === 300){
        return {response_code: 300, msg: "Token expired. Please sign in to continue"}
      }else{
        return {response_code: 201, msg: data.error.message}
      }
    }catch{
      return {response_code: 201, msg: "Products could not be retrieved. Please try again in a few minutes"}
    }
  }

  const getRecipeOfTheWeek = async () => {
    try {
      const {data} = await executeGet('common/recipe')
      if (data.response_code === "000"){
        return {response_code: '000', recipe: data.recipe}
      }else{
        return {response_code: '001', msg: data.error.message}
      }
    }catch{
      return {response_code: '001', msg: "Recipe could not be retrieved. Please try again in a few minutes"}
    }
  }

  const getAllRecipes = async () => {
    try {
      const {data} = await executeGet('common/recipes')
      if (data.response_code === "000"){
        return {response_code: '000', recipes: data.allRecipes}
      }else{
        return {response_code: '001', msg: data.error?.message || "Recipes could not be retrieved"}
      }
    }catch{
      return {response_code: '001', msg: "Recipes could not be retrieved. Please try again in a few minutes"}
    }
  }

  const getRecipeDetail = async (recipeId) => {
    try {
      const {data} = await executeGet(`common/recipe/${recipeId}`)
      console.log("DATA ", data)
      if (data.response_code === "000"){
        return {response_code: '000', recipe: data.recipe, products: data.products}
      }else{
        return {response_code: '001', msg: data.error?.message || "Recipe details could not be retrieved"}
      }
    }catch{
      return {response_code: '001', msg: "Recipe details could not be retrieved. Please try again"}
    }
  }

  const syncCart = async (params) => {
    try {
      const {data} = await executeReq('cart/sync', params)
      if (data.response_code === "000"){
        return {response_code: '000', cart: data.cart}
      }else{
        return {response_code: '001', msg: data.error?.message || "Cart sync failed"}
      }
    }catch{
      return {response_code: '001', msg: "Cart could not be synced. Please try again"}
    }
  }

  const getCart = async (sessionId) => {
    try {
      const {data} = await executeGet(`cart/${sessionId}`)
      if (data.response_code === "000"){
        return {response_code: '000', cart: data.cart}
      }else{
        return {response_code: '001', msg: data.error?.message || "Cart retrieval failed"}
      }
    }catch{
      return {response_code: '001', msg: "Cart could not be retrieved"}
    }
  }

  const getAllBlogs = async () => {
    try {
      const {data} = await executeGet('blogs')
      if (data.response_code === "000"){
        return {response_code: '000', blogs: data.blogs}
      }else{
        return {response_code: '001', msg: data.error?.message || "Blogs could not be retrieved"}
      }
    }catch{
      return {response_code: '001', msg: "Blogs could not be retrieved. Please try again in a few minutes"}
    }
  }

  const getAllCookingClasses = async () => {
    try {
      const {data} = await executeGet('cooking-classes')
      if (data.response_code === "000"){
        return { response_code: "000", classes: data.classes }
      }

      return {response_code: "001"}
    }catch{
      return {response_code: "001"}
    }
  }

  const getProductsAndBundles = async () => {
    try {
      const {data} = await executeGet('common/products-and-bundles')
      if (data.response_code === "000"){
        return {response_code: '000', products: data.products, bundles: data.bundles}
      }else{
        return {response_code: '001', msg: data.error?.message || "Products could not be retrieved"}
      }
    }catch{
      return {response_code: '001', msg: "Products could not be retrieved. Please try again in a few minutes"}
    }
  }

  // Fetch a single bundle by its bundle_id. Checks the products-and-bundles endpoint
  // (which includes avg_rating/review_count), then falls back to curated-bundles so it
  // works whether the user came from /shop or the curated /bundles listing.
  const getBundleDetail = async (bundleId) => {
    const findIn = (arr) => (arr || []).find(b => String(b.bundle_id) === String(bundleId));
    try {
      const {data} = await executeGet('common/products-and-bundles')
      const bundle = data.response_code === "000" ? findIn(data.bundles) : null
      if (bundle) return {response_code: '000', bundle}
    }catch{ /* try curated next */ }
    try {
      const {data} = await executeGet('curated-bundles')
      const bundle = data.response_code === "000" ? findIn(data.bundles) : null
      if (bundle) return {response_code: '000', bundle}
    }catch{ /* fall through */ }
    return {response_code: '001'}
  }

  const getProductsByCategory = async (categoryName) => {
    try {
      const {data} = await executeGet(`common/product-info/category/${categoryName}`)
      if (data.response_code === "000"){
        return {response_code: '000', products: data.products}
      }else{
        return {response_code: '001', msg: data.error?.message || "Products could not be retrieved"}
      }
    }catch{
      return {response_code: '001', msg: "Products could not be retrieved. Please try again in a few minutes"}
    }
  }

  const getAllReviews = async () => {
    try {
      const {data} = await executeGet(`reviews`)
      if (data.response_code === "000"){
        return {response_code: '000', reviews: data.reviews}
      }else{
        return {response_code: '001', msg: data.error?.message || "Reviews could not be retrieved"}
      }
    }catch{
      return {response_code: '001', msg: "Reviews could not be retrieved. Please try again in a few minutes"}
    }
  }

  const getItemReviews = async (itemReferenceNo) => {
    try {
      const {data} = await executeGet(`reviews/item/${itemReferenceNo}`)
      if (data.response_code === "000"){
        return {
          response_code: '000',
          avg_rating: data.avg_rating,
          review_count: data.review_count,
          reviews: data.reviews || []
        }
      }
      return {response_code: '001', avg_rating: 0, review_count: 0, reviews: []}
    }catch{
      return {response_code: '001', avg_rating: 0, review_count: 0, reviews: []}
    }
  }

  const getWholesaleProducts = async () => {
    try {
      const { data } = await executeGet('wholesale/products')
      if (data.response_code === "000") {
        return { response_code: "000", products: data.products || [] }
      }
      return { response_code: "001", products: [] }
    } catch {
      return { response_code: "001", products: [] }
    }
  }

  const submitWholesaleOrder = async (params) => {
    try {
      const { data } = await executeReq('wholesale/orders', params)
      if (data.response_code === "000" || data.response_code === 200) {
        return { response_code: "000", msg: data.response_message || "Order request received" }
      }
      return { response_code: "001", msg: data.response_message || "Submission failed. Please try again" }
    } catch {
      return { response_code: "001", msg: "Submission failed. Please try again in a few minutes" }
    }
  }

  const getOrderReviewItems = async (orderId, token) => {
    try {
      const res = await executeGet(`reviews/order/${orderId}/items?token=${encodeURIComponent(token || '')}`)
      // executeGet returns the axios response on success, or the error object on failure.
      const data = res?.data || res?.response?.data
      if (data?.response_code === "000") {
        return { response_code: "000", email: data.email, items: data.items || [] }
      }
      // 400/401/404 (bad/expired token, wrong order, not found) all surface as invalid link
      return { response_code: "001" }
    } catch {
      return { response_code: "001" }
    }
  }

  const submitItemReview = async (params) => {
    try {
      const { data } = await executeReq('reviews', params)
      if (data.response_code === "000") {
        return { response_code: "000" }
      }
      // 002 = already reviewed this item (treat as success, not an error)
      if (data.response_code === "002") {
        return { response_code: "002" }
      }
      return { response_code: "001", response_message: data.response_message || "Failed to submit review" }
    } catch {
      return { response_code: "001", response_message: "Failed to submit review. Please try again" }
    }
  }

  const submitReview = async (params) => {
    try {
      const {data} = await executeReq('reviews', params)
      if (data.response_code === "000"){
        return {response_code: '000', msg: data.message || "Review submitted successfully"}
      }else{
        return {response_code: '001', msg: data.response_message || "Review submission failed"}
      }
    }catch{
      return {response_code: '001', msg: "Review could not be submitted. Please try again"}
    }
  }

  return { submitCheckOut, getProducts, signUp, signUserIn, getOrders, createEmailSubscription, checkToken,
  sendUserToken, submitPasswordChange, submitContactDetails, getRecipeOfTheWeek, getAllRecipes, getRecipeDetail,
  getAllCurated, getCuratedSelectedBundle, getProductDetail, syncCart, getCart, addCartItem, getAllBlogs, getProductsAndBundles,
  getProductsByCategory, getAllCookingClasses, submitReview, getOrdersDetailsForReview, getAllReviews, getItemReviews,
  validateDiscountCode, getOrderReviewItems, submitItemReview, getWholesaleProducts, submitWholesaleOrder,
  getBundleDetail}
}

export default useFunctions