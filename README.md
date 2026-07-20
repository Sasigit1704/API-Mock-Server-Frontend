# API Mock Server & Scenario Simulator

> 🟢 **Project Status:** Week 1 Foundation Completed

A React + ASP.NET Core based internal developer tool for creating, managing, and organizing configurable mock REST APIs. This project enables frontend developers and QA engineers to continue application development and testing without depending on backend API availability.

---

# 📖 Project Overview

The **API Mock Server & Scenario Simulator** is an internal developer tool designed to reduce backend dependencies during software development.

It provides a visual interface to create, edit, organize, and manage configurable mock REST APIs while storing all endpoint definitions in MongoDB. As the project evolves, these mock APIs will be capable of simulating real-world backend behavior such as success responses, server errors, delays, timeouts, malformed JSON responses, and other testing scenarios without requiring changes to application code.

This repository currently contains the **Week 1 – Foundation** implementation of the project.

---

# ❗ Problem Statement

Frontend developers and QA engineers often depend on backend API availability before they can begin development and testing. This dependency delays feature implementation, integration, and quality assurance.

The **API Mock Server & Scenario Simulator** addresses this challenge by allowing teams to configure and manage mock REST APIs that behave like real backend services, enabling parallel development and improving overall productivity.

---

# 🎯 Project Goals

- Create configurable mock REST APIs dynamically.
- Provide an intuitive user interface for API management.
- Organize APIs into reusable collections.
- Support multiple environments.
- Simulate real-world API behaviors.
- Reduce dependency on backend availability.
- Improve collaboration between frontend, backend, and QA teams.

---

# ✨ Week 1 Features

## Frontend (React)

- Dashboard
- API Builder
- Collections Management
- Environment Management
- Responsive Dashboard Layout
- Sidebar Navigation
- Top Navigation Bar
- Search & Filtering
- Modern Enterprise User Interface

---

## Backend (ASP.NET Core Web API)

- CRUD APIs for Mock Endpoints
- CRUD APIs for Collections
- CRUD APIs for Environments
- MongoDB Integration
- REST API Architecture
- Swagger API Documentation
- Request Validation
- Layered Architecture

---

## Database

### MongoDB Collections

- MockEndpoint
- Collection
- Environment

> **Note:** Additional collections such as **MockScenario** and **RequestLog** will be introduced in future development phases.

---

# 🛠 Technology Stack

## Frontend

- React (Create React App)
- React Router
- Axios
- Tailwind CSS
- Lucide React

## Backend

- ASP.NET Core Web API (.NET 8)
- MongoDB

## Development Tools

- Swagger / OpenAPI
- Git
- GitHub
- Visual Studio Code

---

# 📂 Project Structure

```text
API-Mock-Server
│
├── api-mock-server-ui
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   ├── utils
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
│
├── ApiMockServer
│   ├── Controllers
│   ├── Models
│   ├── DTOs
│   ├── Services
│   ├── Repositories
│   ├── Data
│   ├── Properties
│   ├── Program.cs
│   └── appsettings.json
│
└── README.md
```

---

# 📋 Current Modules

## Dashboard

- Endpoint Statistics
- Collection Statistics
- Environment Statistics
- Recent Endpoints
- Quick Actions

---

## API Builder

- Create Endpoint
- Edit Endpoint
- Delete Endpoint
- Search Endpoints
- Filter by HTTP Method

---

## Collections

- Create Collection
- Update Collection
- Delete Collection
- Search Collections

---

## Environments

- Create Environment
- Update Environment
- Delete Environment
- Activate Environment

---

# 🌐 REST APIs

The following REST APIs provide CRUD operations for managing the mock server configuration during **Week 1**.

## Mock Endpoints

```http
GET     /api/MockEndpoint
POST    /api/MockEndpoint
PUT     /api/MockEndpoint/{id}
DELETE  /api/MockEndpoint/{id}
```

---

## Collections

```http
GET     /api/Collection
POST    /api/Collection
PUT     /api/Collection/{id}
DELETE  /api/Collection/{id}
```

---

## Environments

```http
GET     /api/Environment
POST    /api/Environment
PUT     /api/Environment/{id}
DELETE  /api/Environment/{id}
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/<your-github-username>/API-Mock-Server.git
```

---

# Frontend Setup

```bash
cd api-mock-server-ui

npm install

npm start
```

### Application URL

```
http://localhost:3000
```

---

# Backend Setup

```bash
cd ApiMockServer

dotnet restore

dotnet run
```

### Swagger UI

```
http://localhost:5065/swagger
```

---

# 📸 Screenshots

Screenshots will be added after the completion of the Week 1 user interface.

- Dashboard
- API Builder
- Collections
- Environment Management
- Swagger Documentation

---

# ✅ Week 1 Deliverables

- Complete React frontend foundation
- ASP.NET Core Web API
- MongoDB integration
- CRUD APIs for Mock Endpoints
- CRUD APIs for Collections
- CRUD APIs for Environments
- Dashboard
- API Builder
- Collections Management
- Environment Management
- Responsive User Interface
- Swagger Documentation
- Initial Project Documentation

---

# 🚧 Development Roadmap

The following features are planned according to the four-week implementation roadmap.

## Week 2 – Dynamic Mock Engine

- Dynamic Request Routing
- Scenario Engine
- Delay Simulation
- Timeout Simulation
- Random Failure Simulation
- Custom Response Status Codes

---

## Week 3 – Developer Experience

- Request History
- Request Logging
- Response Preview
- Improved Validation
- Enhanced User Interface
- Environment Switching

---

## Week 4 – Advanced Features

- OpenAPI Import
- Response Templating
- Rate Limiting Simulation
- Malformed JSON Responses
- Performance Testing
- Final Documentation
- Project Demonstration

---

# 🤝 Contributing

This project is currently being developed as part of an internship program. Contributions and suggestions for improvement are always welcome.

---

# 👨‍💻 Author

**Sasi Kaladhar**

Developer – API Mock Server & Scenario Simulator

---

# 🙏 Acknowledgements

This project is being developed as part of an internship program to gain hands-on experience in modern full-stack application development using **React**, **ASP.NET Core**, and **MongoDB**, while following industry-standard software engineering practices.

---

# 📄 License

This project is intended for educational and internship purposes.
