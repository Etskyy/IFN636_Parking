# Parking Slot Booking System

## Public URL

The deployed application is available at:

**http://13.211.81.2**  
*Note that the IP will change when the instance is started.*

GitHub repository:

**https://github.com/Etskyy/IFN636_Parking**

---
## Instructions for EC2

Double check the security rules
---

## Setup Instructions for Local Running

### 1. Clone the repository

```bash
git clone https://github.com/Etskyy/IFN636_Parking.git
cd IFN636_Parking
```

### 2. Backend setup

Move into the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Start the backend:

```bash
npm start
```

If your project uses a development script such as nodemon, you can use that instead:

```bash
npm run dev
```

### 3. Frontend setup

Open a new terminal and move into the frontend folder:

```bash
cd frontend
npm install
npm start
```

The frontend should run on:

```text
http://localhost:3000
```

The backend should run on:

```text
http://localhost:5001
```

---

## User Access List

### Normal User Account
Email: user@example.com  
Password: user123

### Admin User Account
Email: admin@example.com  
Password: admin123
