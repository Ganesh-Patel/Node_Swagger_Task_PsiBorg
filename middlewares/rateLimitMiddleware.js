import rateLimit from 'express-rate-limit';

export const rateLimiter = (windowMs, maxRequests, message) => {
    return rateLimit({
        windowMs, 
        max: maxRequests, 
        message: message || 'Too many requests, please try again later.',
        standardHeaders: true, 
        legacyHeaders: false, 
    });
};
