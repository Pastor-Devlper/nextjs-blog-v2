const removeImports = require('next-remove-imports')();
module.exports = removeImports({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
});
