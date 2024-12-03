# Assignment-5---INFO6150-

# MovieFinder
###  MovieFinder is a web application that allows users to search for and discover various movies. This platform provides an easy-to-use interface for event searching and browsing, or other actions that related to movies, enhancing the user experience in finding and attending events. Notice that more functionalities should be added in the future.

# Features

* User authentication and account management
* Advanced event search functionality
* Responsive design for various devices
* Event categorization and filtering
* Location-based event discovery
* User-friendly interface with Bootstrap components


# Yuheng Li
## used bootstrap class in log in page and create account page
###### card, container, model and toast
modal, modal-dialog, modal-content, modal-header, modal-title, modal-body, modal-footer, toast-container, toast, toast-body, container, card, card-body
###### form
form-label,  form-control
###### button
btn-close,  btn, btn-secondary, btn-close, btn-close-white, btn-link sign-link-button
###### navs and tabs
fade
###### word
page-title
###### position, color, style
position-fixed, top-0, start-50, translate-middle-x, p-3, d-flex, align-items-center, text-white, bg-danger, border-0, me-2 m-auto, mb-3, row, col-sm-3, col-sm-7 offset-sm-2, col-lg-12

# Shen Li
## used bootstrap class in reset password page
same as Yuheng Li's used components;
## used bootstrap class in home page
Accordion, badge, button group, pagination and spinners

# Shuhan Jhang

# css for home.html element
## used bootstrap
navbar with dropdown  ,collapse for popular movie,h1, text-underline,bg color for top movie

# Yuxiao Lin
## css adjustment & add card, footer part
## used bootstrap
card, list-group, btn, container

# Mengge

## home page in HTML
## used bootstrap
Layout and Grid System, Navigation Components, Form Elements, Text Alignment and Spacing, Flex Layout Utilities, Carousel



# Project Title: Movie Finder Application

## Overview
This is a full-stack web application that allows users to:
- Register and log in securely using JWT-based authentication.
- Search for movies using various criteria such as keywords, dates, and locations.
- Access a personalized `Home` page after successful login.
- Recover their accounts via a password recovery system (in development).

## Features
- **User Authentication**: Secure login and registration using email and password.
- **JWT Authorization**: Only authenticated users can access protected routes (e.g., `Home` page).
- **Captcha Verification**: Prevent automated requests during signup.
- **Movie Search**: Search functionality with criteria like keyword, date, and location.
- **Responsive Design**: Built with Bootstrap for a seamless experience across devices.
- **Scalable Backend**: Backend API built with Node.js, Express, and MongoDB.

---

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Bootstrap**: For responsive and aesthetic UI components.
- **Axios**: For making API calls.

### Backend
- **Node.js & Express**: For server-side logic and API endpoints.
- **MongoDB**: For storing user data.
- **JSON Web Tokens (JWT)**: For secure user authentication and route protection.
- **dotenv**: For managing environment variables securely.

---

## Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **MongoDB**: Set up a local or cloud MongoDB instance.
- **npm**: For installing dependencies.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/movie-finder.git
   cd movie-finder
   ```

2. **Set up backend**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and configure:
     ```
     PORT=5000
     MONGO_URI=<Your MongoDB connection string>
     JWT_SECRET=<Your JWT secret key>
     ```
   - Start the server:
     ```bash
     npm start
     ```

3. **Set up frontend**:
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and configure:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```
   - Start the React application:
     ```bash
     npm start
     ```

---

## Usage

1. Open the app in your browser:
   ```
   http://localhost:3000
   ```

2. **Register**:
   - Use a valid email address and password to create an account.

3. **Login**:
   - Log in using your registered credentials.
   - Upon success, you’ll be redirected to the `Home` page.

4. **Search Movies**:
   - Use the search form to look for movies by keyword, date, and location.

5. **Recover Password**:
   - Navigate to the password recovery page from the login screen (functionality under development).

---

## Project Structure

### Frontend
- `/src/components`: Contains React components for `Login`, `Signup`, `Home`, `ForgotPassword`, and others.
- `/src/api`: Axios API calls for communicating with the backend.
- `/src/styles`: Custom styles and Bootstrap integration.

### Backend
- `/models`: MongoDB models (e.g., User model).
- `/controllers`: Contains logic for handling API requests (e.g., login, registration).
- `/services`: Business logic (e.g., user validation, password hashing).
- `/middlewares`: Middleware for JWT authentication.
- `/routes`: API endpoints for user-related actions.

---

## Features to Implement
- Password reset functionality in the `ForgotPassword` component.
- Enhanced search results with movie details fetched from a public API.
- Profile management for users.
