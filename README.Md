# Droplink Backend(MVP)

Droplink is a simple platform that allows artists customize and share a public profile containing their bio, avatar, social links, and other important information — all accessible through a single link.

This backend is built with **Node.js**, **Express**, and **MongoDB**, and it handles authentication, artist profile creation, image uploads, and public profile access.

---

## Features

- User Authentication (Register & Login)
- Create & Update Artist Profile
- Upload Artist Avatar (Cloudinary)
- Public Access via Username Link
- RESTful API with express Validation

---

## Technologies Used

- Node.js & Express
- MongoDB & Mongoose
- Cloudinary (for image upload) // will change it to aws s3 soon
- JWT (stored in cookies)
- Express Validator

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/goodylove/Droplink-backend.git
   cd droplink-backend
   ```

env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

2. install dependence
   ``npm install`

3.run server
` npm run dev`
