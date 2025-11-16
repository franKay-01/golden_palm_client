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
        default:
          response = {response_code: 200, checkout_url: null, error: true, msg: ""}
          break
      }
      
      return response

    }catch (err){
      return {response_code: 200, checkout_url: null, error: true, msg: ""}
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
        return { response_code: "000", product: data.product }
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
      const { data } = await executeReq('common/email-subscription', params)
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
  getAllCurated, getCuratedSelectedBundle, getProductDetail, syncCart, getCart, getAllBlogs, getProductsAndBundles,
  getProductsByCategory, getAllCookingClasses, submitReview, getOrdersDetailsForReview, getAllReviews}
}

export default useFunctions