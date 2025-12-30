# S.H.I.E.L.D - Santa's Hero Integrated Express Logistics Dashboard

A full-stack application that assigns superhero delivery agents to deliver Christmas gifts based on child preferences, location characteristics, and hero availability.

## 🎯 Features

- **AI-Powered Price Prediction**: Uses Google Gemini API to estimate gift prices
- **Smart Hero Assignment**: Scores heroes based on child's questionnaire answers
- **Area Intelligence**: Analyzes delivery location difficulty using Mapbox
- **Queue Management**: Handles multiple deliveries with hero queuing system
- **Real-time Dashboard**: Santa's control room for monitoring all deliveries
- **Delivery Simulation**: Automated delivery completion with timer-based system
- **Map Animation**: Visual hero tracking with animated routes on Mapbox
- **Delivery Notifications**: Console notifications on delivery completion


## 🏗️ Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Google Gemini API (Price Prediction)
- Mapbox API (Location Intelligence)

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Mapbox API Key
- Google Gemini API Key

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
cd G:\Brocamp\SHEILD
```

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your credentials:
# MONGODB_URI=mongodb://localhost:27017/shield
# MAPBOX_ACCESS_TOKEN=your_mapbox_token
# GEMINI_API_KEY=your_gemini_api_key
# PORT=5000

# Seed the database with heroes
npm run seed

# Start the server
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Client Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file (optional, for map features)
copy .env.example .env

# Edit .env if you want map visualization:
# VITE_MAPBOX_TOKEN=your_mapbox_token

# Start the development server
npm run dev
```

The client will run on `http://localhost:3000`

## 🎮 Usage

### Child Portal
1. Navigate to `http://localhost:3000`
2. Fill out the gift request form:
   - Enter your name
   - Select your city
   - Enter the gift you want (AI will predict the price)
   - Answer the questionnaire
3. Submit the request

### Santa's Control Room
1. Navigate to `http://localhost:3000/dashboard`
2. View all gift requests
3. Click "Show Hero Recommendations" on any waiting request
4. See hero scores and ETAs
5. Click "Assign" to assign a hero
6. Monitor hero status and active deliveries

## 🦸 Heroes

1. **Flash** ⚡ - speedFactor: 0.3 (fastest)
2. **Spider-Man** 🕷️ - speedFactor: 0.5
3. **Batman** 🦇 - speedFactor: 0.7
4. **Aquaman** 🔱 - speedFactor: 0.6
5. **Ant-Man** 🐜 - speedFactor: 0.4
6. **Doctor Strange** ✨ - speedFactor: 0.2
7. **Wonder Woman** ⭐ - speedFactor: 0.5

## 🎯 Hero Scoring Logic

- **Q2 (Barbie dolls)**: +40 to Wonder Woman
- **Q3 (Afraid of spiders)**: -100 to Spider-Man
- **Q4 (Racing)**: +50 to Flash
- **Q5 (Water)**: +40 to Aquaman
- **Q6 (Magic)**: +50 to Doctor Strange
- **Q7 (Tiny toys)**: +40 to Ant-Man
- **Q10 (Chimney)**: +40 to Spider-Man
- **Gift Price > ₹10,000**: +60 to Batman

## 📁 Project Structure

```
SHEILD/
├── server/
│   ├── models/           # MongoDB models
│   ├── services/         # Business logic
│   │   ├── heroScorer.js
│   │   ├── pricePredictor.js
│   │   ├── areaAnalyzer.js
│   │   ├── timeCalculator.js
│   │   ├── queueManager.js
│   │   └── deliverySimulator.js
│   ├── routes/          # API endpoints
│   ├── scripts/         # Database seeding
│   └── server.js        # Main server file
│
└── client/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   └── App.tsx      # Main app component
    └── public/          # Static assets
```

## 🔧 API Endpoints

### Requests
- `POST /api/requests` - Submit a gift request
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get specific request
- `POST /api/requests/:id/assign` - Assign hero to request
- `GET /api/requests/:id/recommendations` - Get hero recommendations

### Heroes
- `GET /api/heroes` - Get all heroes
- `GET /api/heroes/:id` - Get specific hero
- `GET /api/heroes/:id/queue` - Get hero's queue
- `GET /api/heroes/deliveries/active` - Get active deliveries

## 🎨 Features in Detail

### AI Price Prediction
Uses Google Gemini Flash to estimate gift prices based on name. The AI considers current Indian market prices and returns an INR value.

### Area Intelligence
Analyzes delivery location using:
- **Distance**: From North Pole to destination
- **Elevation**: Higher = harder
- **Urban/Rural**: Road density analysis
- **Water Proximity**: Benefits Aquaman

### Queue System
- Heroes can have multiple deliveries queued
- Automatic queue processing after delivery completion
- Priority-based assignment

### Delivery Simulation
- Real-time timer-based delivery
- Automatic hero status updates
- Queue processing on completion

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify MONGODB_URI in .env file

### API Key Issues
- Check that MAPBOX_ACCESS_TOKEN and GEMINI_API_KEY are correct in .env
- Ensure API keys have proper permissions

### PowerShell Execution Policy (Windows)
If you encounter script execution errors, run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 📝 License

This project is created for educational purposes.

## 🎄 Happy Holidays! 🎅
