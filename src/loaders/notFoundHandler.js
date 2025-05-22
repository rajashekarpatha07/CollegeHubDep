export default function setupNotFoundHandler(app) {
  app.use("*", (req, res) => {
    const redirects = {
      '/api/v1/students/getquestionpapers': '/questionpapers',
      '/api/v1/students/getnotices': '/notices',
      '/api/v1/students/getnotes': '/notes',
    };

    const redirectTo = redirects[req.originalUrl];
    if (redirectTo) return res.redirect(redirectTo);

    if (req.accepts('html')) {
      return res.status(404).send(`<!DOCTYPE html><html><head><title>404</title><style>body{font-family:sans-serif;text-align:center;padding:50px}</style></head><body><h1>404 - Page Not Found</h1><p>Page not found.</p></body></html>`);
    }

    res.status(404).json({ status: "fail", message: `Can't find ${req.originalUrl}` });
  });
}
// This function sets up a 404 Not Found handler for the Express app.