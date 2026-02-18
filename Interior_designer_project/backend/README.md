# Interior Designer Backend

Express + MongoDB API for the interior design website.

## Setup

1. Create a `.env` file in the `backend` folder with:
   ```
   MONGO_URI=mongodb://localhost:27017/interior_designer
   PORT=5000
   ```
   (Use your real MongoDB connection string if different.)

2. Install dependencies (if not already):
   ```bash
   npm install
   ```

3. Seed the database with sample projects (images + videos):
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   npm start
   ```
   Server runs at `http://localhost:5000`.

## API

### Projects

| Method | Route | Description |
|--------|--------|-------------|
| GET | `/api/projects` | All projects |
| GET | `/api/projects/featured` | Featured projects only |
| GET | `/api/projects/:id` | Single project by ID |
| POST | `/api/projects` | Create project (admin) |
| PUT | `/api/projects/:id` | Update project (admin) |
| DELETE | `/api/projects/:id` | Delete project (admin) |

### Enquiries

| Method | Route | Description |
|--------|--------|-------------|
| GET | `/api/enquiry` | List enquiries (admin) |
| POST | `/api/enquiry` | Submit enquiry |

## Using the frontend with the backend

In `frontend/src/api/config.js`, set `USE_MOCK = false` so the React app uses this API instead of mock data. Ensure the backend is running and you have run `npm run seed` at least once.
