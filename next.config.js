/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PYTHON_SERVICE_URL: process.env.PYTHON_SERVICE_URL || "http://localhost:8000",
  },
};

module.exports = nextConfig;
