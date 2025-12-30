# S.H.I.E.L.D Application - Test Guide

## Pre-Testing Setup Checklist

### 1. Install Dependencies

```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Server** (`server/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/shield
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

**Client** (`client/.env`):
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Start MongoDB

Ensure MongoDB is running:
```bash
# Windows
mongod

# Or use MongoDB Compass/Atlas
```

###4. Seed the Database

```bash
cd server
npm run seed
```

Expected output:
```
Connected to MongoDB
Cleared existing heroes
Inserted 7 heroes:
  - Flash (speedFactor: 0.3)
  - Spider-Man (speedFactor: 0.5)
  - Batman (speedFactor: 0.7)
  - Aquaman (speedFactor: 0.6)
  - Ant-Man (speedFactor: 0.4)
  - Doctor Strange (speedFactor: 0.2)
  - Wonder Woman (speedFactor: 0.5)

✅ Database seeded successfully!
```

---

## Testing Plan

### Phase 1: Database Connection Test

**Test**: Verify MongoDB connection and models

```bash
cd server
npm run dev
```

**Expected Output**:
```
✅ Connected to MongoDB
🚀 S.H.I.E.L.D server running on port 5000
📊 Health check: http://localhost:5000/health
```

**Verification**:
- Visit `http://localhost:5000/health`
- Should return: `{"status":"ok","message":"S.H.I.E.L.D server is running"}`

✅ **PASS** if server starts and health check works

---

### Phase 2: Hero Scoring Algorithm Test

**Test**: Verify hero scoring logic

Create test file `server/test/heroScorer.test.js`:

```javascript
import { calculateHeroScores } from '../services/heroScorer.js';

// Test Case 1: Racing enthusiast
const answers1 = { Q4: 'yes' };
const scores1 = calculateHeroScores(answers1, 5000);
console.log('Test 1 - Racing:', scores1);
console.assert(scores1.Flash === 50, 'Flash should get +50 for racing');

// Test Case 2: Expensive gift
const answers2 = {};
const scores2 = calculateHeroScores(answers2, 15000);
console.log('Test 2 - Expensive gift:', scores2);
console.assert(scores2.Batman === 60, 'Batman should get +60 for expensive gift');

// Test 3: Afraid of spiders
const answers3 = { Q3: 'yes' };
const scores3 = calculateHeroScores(answers3, 5000);
console.log('Test 3 - Afraid of spiders:', scores3);
console.assert(scores3['Spider-Man'] === -100, 'Spider-Man should get -100');

console.log('\n✅ All hero scoring tests passed!');
```

Run: `node server/test/heroScorer.test.js`

✅ **PASS** if all assertions pass

---

### Phase 3: ETA Calculation Test

**Test**: Verify time calculator

Create test file `server/test/timeCalculator.test.js`:

```javascript
import { calculateDeliveryTime } from '../services/timeCalculator.js';

const distance = 10000; // 10,000 km
const areaScore = 22;
const speedFactor = 0.3; // Flash

const eta = calculateDeliveryTime(distance, areaScore, speedFactor);
console.log(`ETA: ${eta} minutes`);
console.assert(eta > 0, 'ETA should be positive');

console.log('✅ ETA calculation test passed!');
```

Run: `node server/test/timeCalculator.test.js`

✅ **PASS** if ETA is calculated correctly

---

### Phase 4: End-to-End Flow Test

**Test**: Complete gift request to delivery flow

1. **Start both servers**:
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

2. **Child Portal Test**:
   - Navigate to `http://localhost:3000`
   - Fill out form:
     - Name: "Test Child"
     - City: "Kochi"
     - Gift: "PS5"
     - Answer Q4 (racing): "Yes"
   - Click "Submit Gift Request"
   - ✅ **PASS** if success message appears

3. **Santa Dashboard Test**:
   - Navigate to `http://localhost:3000/dashboard`
   - Verify request appears in table
   - Click "Show Hero Recommendations"
   - ✅ **PASS** if Flash has highest score (+50)

4. **Hero Assignment Test**:
   - Click "Assign" next to Flash
   - Verify:
     - Hero status changes to "Busy"
     - Request status changes to "Delivering"
     - ETA is calculated
   - ✅ **PASS** if assignment succeeds

5. **Delivery Simulation Test**:
   - Wait for ETA to complete (or adjust timeCalculator.js for faster testing)
   - Check server console for delivery notification
   - Verify:
     - Request status changes to "Completed"
     - Hero status changes to "Free"
   - ✅ **PASS** if delivery completes

---

### Phase 5: Concurrent Requests Test

**Test**: Queue management with multiple requests

1. Submit 3 requests quickly via Child Portal
2. Assign all to Flash
3. Verify:
   - First request: status = "Delivering"
   - Other requests: added to Flash's queue
   - Queue length updates in hero panel
4. Wait for first delivery to complete
5. Verify next request automatically starts
6. ✅ **PASS** if queue processes correctly

---

### Phase 6: AI Price Prediction Test

**Test**: Google Gemini API integration

1. Check server logs when submitting gift request
2. Look for:
```
Predicting price for: PS5
Predicted price: ₹45000
```
3. Verify price is reasonable (not default 5000)
4. ✅ **PASS** if AI predicts price

**Troubleshooting**:
- If getting default price (5000), check GEMINI_API_KEY in .env
- Verify API key is valid

---

### Phase 7: Map Animation Test

**Test**: Mapbox GL JS visualization

**Prerequisites**: VITE_MAPBOX_TOKEN set in client/.env

1. Navigate to Dashboard
2. Assign a hero to a request
3. Verify:
   - Map displays with North Pole marker
   - Delivery destination marker appears
   - Route line drawn
   - Hero marker animates along route
4. ✅ **PASS** if animation works

**Note**: If map shows "Map Disabled", Mapbox token is missing

---

## Performance Tests

### Test 1: Multiple Simultaneous Requests

- Submit 10 requests within 1 minute
- Verify server handles load
- Check response times
- ✅ **PASS** if no errors, response < 2s

### Test 2: Hero Queue Capacity

- Assign 5 requests to same hero
- Verify all queue correctly
- ✅ **PASS** if queue shows 5 items

---

## Error Handling Tests

### Test 1: Invalid API Keys

- Set invalid GEMINI_API_KEY
- Submit request
- ✅ **PASS** if falls back to default price (5000)

### Test 2: Missing Required Fields

- Submit form without name
- ✅ **PASS** if validation error shown

### Test 3: MongoDB Connection Lost

- Stop MongoDB
- Try to submit request
- ✅ **PASS** if graceful error message

---

## Browser Compatibility

Test in:
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (if available)

---

## Mobile Responsiveness

Test on:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Verify:
- Forms are usable
- Tables are scrollable
- Cards stack properly

---

## Final Checklist

- [ ] Database seeds successfully
- [ ] Server starts without errors
- [ ] Client starts and connects to server
- [ ] Gift request submission works
- [ ] Hero scoring calculates correctly
- [ ] Hero assignment works
- [ ] Delivery simulation completes
- [ ] Queue system processes requests
- [ ] AI price prediction works (with API key)
- [ ] Map animation works (with Mapbox token)
- [ ] Delivery notifications appear in console
- [ ] Real-time polling updates dashboard

---

## Known Limitations

1. **Map requires API key**: Without Mapbox token, map is disabled
2. **AI requires API key**: Without Gemini key, uses default prices
3. **No persistence**: Active deliveries reset on server restart
4. **Polling vs WebSockets**: Dashboard uses 5-second polling (can be upgraded)
5. **Notifications**: Currently console-only (can integrate email/SMS)

---

## Troubleshooting

### Module Not Found Errors

```bash
cd server && npm install
cd ../client && npm install
```

### PowerShell Execution Policy (Windows)

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Port Already in Use

- Change PORT in server/.env
- Check if another service is using port 5000/3000

### MongoDB Connection Failed

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Try MongoDB Compass to verify connection

---

## Success Criteria

Application is considered **production-ready** when:

✅ All Phase 1-7 tests pass  
✅ No console errors in browser/server  
✅ Delivery flow completes successfully  
✅ Queue management works correctly  
✅ Real-time updates work  
✅ Mobile responsive  
✅ AI and map features work (with keys)  

---

**Happy Testing! 🎅🎄**
