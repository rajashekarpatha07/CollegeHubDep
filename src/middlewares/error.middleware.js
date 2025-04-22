import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR 💥", err);
  
  err.statuscode = err.statuscode || 500;
  err.message = err.message || "Internal Server Error";
  
  // Check if request is API or view
  const isApiRequest = req.originalUrl.startsWith('/api');
  
  if (isApiRequest) {
    // API response - return JSON
    return res.status(err.statuscode).json({
      success: false,
      error: err.message,
      statusCode: err.statuscode,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } else {
    // View response - redirect with flash message
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      // Store error in session for flash message
      req.session = req.session || {};
      req.session.flashError = {
        message: err.message,
        statusCode: err.statuscode
      };
      
      // Redirect to appropriate page based on error
      if (err.message.includes("doesn't exist, please register")) {
        return res.redirect('/StudentRegister?error=' + encodeURIComponent(err.message));
      } else {
        return res.redirect('/StudentLogin?error=' + encodeURIComponent(err.message));
      }
    } else {
      // Non-HTML requests to views get JSON response
      return res.status(err.statuscode).json({
        success: false,
        error: err.message
      });
    }
  }
};

export { errorMiddleware }; 