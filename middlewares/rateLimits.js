const roleLimits = {
    admin: {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
      message: 'Admin rate limit exceeded, please try again later.',
    },
    manager: {
      windowMs: 1 * 60 * 1000, // 1 minute
      maxRequests: 50, // 50 requests per minute
      message: 'Manager rate limit exceeded, please try again later.',
    },
    user: {
      windowMs: 1 * 60 * 1000,
      maxRequests: 20,
      message: 'User rate limit exceeded, please try again later.',
    },
  };
  
  export default roleLimits;
  