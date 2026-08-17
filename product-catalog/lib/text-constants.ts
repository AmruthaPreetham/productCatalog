// Application text constants and labels
export const TEXT = {
  // App name
  APP_NAME: 'ShopKart',
  
  // Header
  HEADER: {
    SEARCH_PLACEHOLDER: 'Search for products, brands and more...',
    SEARCH_BUTTON: 'Search',
    WISHLIST: 'Wishlist',
    CART: 'Cart',
    PROFILE: 'Profile',
  },
  
  // Login Page
  LOGIN: {
    TITLE: 'Welcome Back',
    SUBTITLE: 'Sign in to continue shopping',
    EMAIL_PLACEHOLDER: 'Email Address',
    PASSWORD_PLACEHOLDER: 'Password',
    SUBMIT_BUTTON: 'Login',
    SUBMITTING_BUTTON: 'Signing In...',
    TAGLINE: 'Discover thousands of products,',
    TAGLINE_CONTINUED: 'exclusive deals and the latest trends.',
    DIVIDER: 'OR',
  },
  
  // Sign Up Page
  SIGNUP: {
    TITLE: 'Start shopping with ShopKart',
    FULLNAME_PLACEHOLDER: 'Full Name',
    EMAIL_PLACEHOLDER: 'Email Address',
    MOBILE_PLACEHOLDER: 'Mobile Number',
    PASSWORD_PLACEHOLDER: 'Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm Password',
    SUBMIT_BUTTON: 'Sign Up',
    SUBMITTING_BUTTON: 'Creating Account...',
    ALREADY_HAVE_ACCOUNT: 'Already have an account?',
    LOGIN_LINK: 'Login here',
    BENEFITS: {
      PRODUCTS: '✓ 10,000+ Products',
      DELIVERY: '✓ Fast Delivery',
      RETURNS: '✓ Easy Returns',
      SUPPORT: '✓ 24/7 Support',
    },
    SUCCESS_MESSAGE: 'Account created successfully!',
  },
  
  // Products Page
  PRODUCTS: {
    TITLE: 'Our Products',
    SHOWING_IN: 'Showing products in:',
    FOUND: {
      SINGLE: 'product',
      PLURAL: 'products',
    },
    FOUND_TEXT: 'found',
    NO_PRODUCTS: {
      SEARCH: 'No products found matching',
      CATEGORY: 'No products found in',
      GENERAL: 'No products available.',
    },
    TRY_DIFFERENT: 'Try adjusting your filters or search terms.',
    LOADING: 'Loading products...',
    ERROR: 'Failed to load products:',
  },
  
  // Categories
  CATEGORIES: {
    TITLE: 'CATEGORIES',
    ALL_CATEGORIES: 'All Categories',
  },
  
  // Product Card
  PRODUCT_CARD: {
    OFF: 'OFF',
    IN_STOCK: 'In Stock',
    OUT_OF_STOCK: 'Out of Stock',
  },
  
  // Sort Options
  SORT: {
    LABEL: 'Sort By',
    DEFAULT: 'Default',
    PRICE_LOW: 'Price: Low to High',
    PRICE_HIGH: 'Price: High to Low',
    NAME_ASC: 'Name: A to Z',
    NAME_DESC: 'Name: Z to A',
  },
  
  // Logout
  LOGOUT: {
    BUTTON: 'Logout',
  },
  
  // Error Messages
  ERRORS: {
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account is locked',
    ACCOUNT_DISABLED: 'Account disabled',
    TOO_MANY_ATTEMPTS: 'Too many login attempts',
    SERVER_ERROR: 'Unable to connect to server',
    INTERNAL_ERROR: 'Internal server error',
    UNEXPECTED_ERROR: 'Unexpected error',
  },
  
  // Social Login
  SOCIAL: {
    GOOGLE: 'Google',
    FACEBOOK: 'Facebook',
    MICROSOFT: 'Microsoft',
  },
  
  // Currency
  CURRENCY: {
    SYMBOL: '₹',
  },
  
  // Pagination
  PAGINATION: {
    PREVIOUS: 'Previous',
    NEXT: 'Next',
  },
} as const;
