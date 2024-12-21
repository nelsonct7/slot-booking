# Slot Booking System

## Description
A web-based slot booking system that allows users to schedule and manage appointments. This system is designed to handle multiple users, time slots, and booking management efficiently. this project is using docker for containerization, once you cloned the repo run docker compose up, the application will be available in you localhost

vite url : http://localhost:5173/
nginx url : http://localhost:8080/

in local setup your api will be running in 
api url : http://localhost:3002/


## Features
- Slot availability checking
- Booking management (create)
- Time slot visualization
- Real-time slot updates

## Tech Stack
- Frontend: [React]
- Backend: [Node js]
- Database: [mongo db]
- Docker for containerization

## Prerequisites
- Docker
- Docker Compose

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/nelsonct7/slot-booking
cd slot-booking

Environment Setup

# Copy the example environment file
cp .env.example ./appointmentService/.env

# Update the .env file with your configurations

Docker Setup

# Build and start the containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

Project Structure
slot-booking/
├── frontEnd/
├── appointmentService/
├── .github/
├── docker-compose.yaml
├── .env
└── readme.md
└── docker-swarm.yaml
└── deploy.sh

API Documentation

Bookings
GET /api/slots/:date
Eg: /api/slots/2024-01-20


POST /api/book
Eg: /api/book
    payload: 
        {
            name: "John Doe",
            phoneNumber: "1234567890",
            date: "2024-01-20",
            timeSlot: "10:00",
        }

Environment Variables (appointmentService)
# Server Configuration
PORT=3002
NODE_ENV=development
DB_URL=mongodb://localhost:27018/

LocalDevelopment
once you cloned the repo, if you want to do local development don't forget to do "npm install" in both front end `./frontEnd` and in back end service `./appointmentService`, and make sure your mongo db server is up and running.

Support
For support, email nelsonct7@gmail.com or create an issue in the repository.

Authors
Your Nelson C T