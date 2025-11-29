\# 🍔 Campus Food Court Menu Aggregator + Order Tracker



\*\*DevOps Project - UCT512\*\*  

\*\*Student:\*\* Reetam Dutta  

\*\*Submission Deadline:\*\* 3rd December, 2025



---



\## 📖 Project Overview



A multi-vendor food court management system that aggregates menus from different food stalls, allows customers to place orders, and enables vendors to track order status in real-time.



\### Key Features

\- Multi-vendor menu aggregation

\- Real-time order placement and tracking

\- RESTful API architecture

\- Health monitoring endpoints

\- MySQL database integration

\- Responsive testing dashboard



---



\## 🏗️ Architecture



\### Multi-Service Architecture (Client-Server Model)

```

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐

│   Frontend      │      │   Backend API   │      │   MySQL DB      │

│   (Port 8080)   │─────▶│   (Port 3000)   │─────▶│   (Port 3306)   │

│   HTML/CSS/JS   │      │   Node.js       │      │   Database      │

└─────────────────┘      └─────────────────┘      └─────────────────┘

&nbsp;    Web Server           Application Server        Database Server

```



\### Technology Stack



\*\*Backend:\*\*

\- Node.js v20.17.0

\- Express.js (REST API framework)

\- MySQL2 (Database driver)

\- CORS (Cross-origin resource sharing)

\- dotenv (Environment configuration)



\*\*Frontend:\*\*

\- HTML5

\- CSS3 (Responsive design)

\- Vanilla JavaScript (API integration)

\- http-server (Static file server)



\*\*Database:\*\*

\- MySQL 8.0

\- Relational database with normalized schema



\*\*DevOps Tools:\*\*

\- Git \& GitHub (Version control)

\- Docker \& Docker Compose (Containerization)

\- npm (Package management)

\- Environment variables (.env)



---



\## 📊 Database Schema



\### Tables



1\. \*\*vendors\*\* - Food stall information

2\. \*\*menu\_items\*\* - Menu items for each vendor

3\. \*\*orders\*\* - Customer orders

4\. \*\*order\_items\*\* - Individual items in each order



\### Sample Data

\- 7 vendors (Burger Hub, Pizza Corner, Desi Dhaba, etc.)

\- 40+ menu items across different cuisines

\- Multiple order statuses (pending, preparing, ready, delivered, cancelled)



---



\## 🚀 Setup Instructions



\### Prerequisites

\- Node.js (v18 or higher)

\- MySQL 8.0

\- Git

\- npm



\### Installation Steps



1\. \*\*Clone the repository\*\*

```bash

git clone https://github.com/reetam-dutta-24/campus-food-court.git

cd campus-food-court

```



2\. \*\*Setup Database\*\*

```bash

mysql -u root -p < database/init.sql

```



3\. \*\*Configure Backend\*\*

```bash

cd backend

npm install

```



Create `.env` file:

```

PORT=3000

DB\_HOST=localhost

DB\_USER=root

DB\_PASSWORD=your\_password

DB\_NAME=foodcourt\_db

NODE\_ENV=development

```



4\. \*\*Start Backend Server\*\*

```bash

npm start

```



5\. \*\*Start Frontend Server\*\* (in new terminal)

```bash

cd frontend/public

npx http-server -p 8080

```



6\. \*\*Access Application\*\*

\- Frontend: http://localhost:8080

\- API Health: http://localhost:3000/health

\- API Docs: http://localhost:3000/api/vendors



---



\## 🔌 API Endpoints



\### Health Check

```

GET /health

Response: { status, timestamp, uptime, database, version }

```



\### Vendors

```

GET /api/vendors

Response: Array of vendor objects

```



\### Menu Items

```

GET /api/menu/:vendorId

Response: Array of menu items for specified vendor

```



\### Orders

```

GET /api/orders

Response: Array of all orders



GET /api/orders/:orderId

Response: Single order object



POST /api/orders

Body: { vendor\_id, customer\_name, customer\_phone, total\_amount }

Response: Created order object



PATCH /api/orders/:orderId/status

Body: { status }

Response: Updated order confirmation

```



---



\## 🐳 Docker Deployment



\### Build and Run with Docker Compose

```bash

\# Build containers

docker-compose build



\# Start all services

docker-compose up -d



\# Check status

docker-compose ps



\# View logs

docker-compose logs -f



\# Stop services

docker-compose down

```



\### Docker Services

\- \*\*backend\*\* - Node.js API (Port 3000)

\- \*\*db\*\* - MySQL 8.0 (Port 3306)

\- \*\*nginx\*\* - Reverse proxy (Port 80)



---



\## 📈 DevOps Features Implemented



\### 1. Version Control

\- ✅ Git repository with meaningful commits

\- ✅ GitHub remote repository

\- ✅ .gitignore for sensitive files

\- ✅ Branching strategy (main branch)



\### 2. Containerization

\- ✅ Dockerfile for backend

\- ✅ docker-compose.yml for multi-container setup

\- ✅ Docker networking

\- ✅ Volume management for data persistence

\- ✅ Health checks in containers



\### 3. Configuration Management

\- ✅ Environment variables (.env)

\- ✅ Separate configs for dev/prod

\- ✅ Secrets management



\### 4. API Design

\- ✅ RESTful architecture

\- ✅ CORS enabled

\- ✅ JSON responses

\- ✅ Error handling

\- ✅ Status codes (200, 201, 404, 500)



\### 5. Monitoring

\- ✅ Health check endpoint

\- ✅ Uptime tracking

\- ✅ Database connection status

\- ✅ Logging to console



\### 6. Database Management

\- ✅ Schema versioning (init.sql)

\- ✅ Sample data seeding

\- ✅ Relational integrity (foreign keys)

\- ✅ Indexes for performance



---



\## 🎯 Project Demo



\### Multi-Machine Setup (Local Demo)



\*\*Machine 1 - Database Server:\*\*

```bash

\# MySQL running on port 3306

mysql -u root -p

```



\*\*Machine 2 - Application Server:\*\*

```bash

\# Backend API on port 3000

cd backend

npm start

```



\*\*Machine 3 - Web Server:\*\*

```bash

\# Frontend on port 8080

cd frontend/public

http-server -p 8080

```



---



\## 📸 Screenshots



Screenshots available in the project report showing:

1\. Running Docker containers

2\. API health check response

3\. Vendors endpoint response

4\. Frontend testing dashboard

5\. Database tables and data

6\. GitHub repository

7\. Multi-terminal setup



---



\## 🔒 Security Features



\- Environment-based configuration

\- No hardcoded credentials

\- CORS configuration

\- Input validation

\- SQL injection prevention (prepared statements)



---



\## 📦 Project Structure

```

campus-food-court/

├── backend/

│   ├── src/

│   │   ├── controllers/

│   │   ├── models/

│   │   ├── routes/

│   │   └── config/

│   ├── server.js

│   ├── package.json

│   ├── .env

│   └── Dockerfile

├── frontend/

│   └── public/

│       └── index.html

├── database/

│   └── init.sql

├── nginx/

│   └── nginx.conf

├── docker-compose.yml

├── .gitignore

└── README.md

```



---



\## 🎓 Learning Outcomes



\- Multi-tier application architecture

\- RESTful API design and implementation

\- Database design and management

\- Docker containerization

\- Git version control

\- Environment-based configuration

\- Frontend-backend integration

\- DevOps best practices



---



\## 🚀 Future Enhancements



\- AWS deployment (EC2, RDS, S3)

\- CI/CD pipeline with GitHub Actions

\- Redis caching layer

\- JWT authentication

\- Real-time notifications with WebSockets

\- Payment gateway integration

\- Admin dashboard

\- Mobile app



---



\## 👨‍💻 Author



\*\*Reetam Dutta\*\*  

DevOps Project - UCT512  

Cloud Computing Course



---



\## 📝 License



This project is submitted as part of academic coursework.



---



\## 🙏 Acknowledgments



\- Course Instructor

\- AWS Academy

\- Open source community

