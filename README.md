# API Mock Server & Scenario Simulator — Frontend

A modern React-based developer interface for designing, configuring, organizing, and testing configurable mock REST APIs.

The frontend provides an enterprise-style dashboard for managing mock endpoints, responses, scenarios, collections, environments, OpenAPI imports, request history, and API testing. It communicates with the ASP.NET Core Web API backend and provides a visual interface for configuring and verifying simulated API behavior.

---

## Overview

The **API Mock Server & Scenario Simulator** is a full-stack developer tool designed to help frontend developers, QA engineers, and integration teams continue development and testing without depending on live backend services.

The frontend allows users to:

- Create and configure mock REST endpoints
- Configure multiple responses for an endpoint
- Select active responses or distribute responses using percentages
- Configure request validation and authentication
- Simulate delays, timeouts, random failures, input errors, and process errors
- Configure scenarios for different API behaviours
- Use response templating with request data
- Simulate rate limiting and malformed JSON responses
- Import OpenAPI definitions
- Test endpoints directly from the API Tester
- Inspect request history
- Organize endpoints using collections and environments

---

## Features

### Dashboard

- Project overview
- Endpoint statistics
- Collection statistics
- Environment statistics
- Scenario statistics
- Quick navigation to major modules

### API Builder

- Create, edit, and delete mock endpoints
- Configure HTTP method and dynamic paths
- Enable or disable endpoints
- Configure custom status codes and response bodies
- Add multiple responses to one endpoint
- Configure active responses
- Configure percentage-based response selection
- Configure response time
- Configure authentication requirements
- Configure request schemas and validation rules
- Configure input errors
- Configure process errors
- Configure rate limiting
- Configure malformed JSON responses
- Configure endpoint scenarios

### Response Simulation

- Single active response
- Multiple responses
- Percentage-based response selection
- Custom status codes
- Artificial response delays
- Timeout simulation
- Random failure simulation
- Response templating

Supported response template sources include:

```text
{{path.id}}
{{query.name}}
{{body.name}}
{{header.X-Client-Name}}
```

### Scenario Management

- Create and edit scenarios
- Activate a scenario for an endpoint
- Switch between scenarios
- Configure scenario status codes
- Configure scenario delays
- Configure timeout simulation
- Configure random failure rates

### Request Validation

- JSON Schema-based request validation
- Required field validation
- Data type validation
- String constraints
- Numeric constraints
- Pattern validation
- Nested object validation
- Array validation
- Support for schema-based and sample-JSON definitions

### API Tester

- Select configured endpoints
- Automatically resolve path parameters
- Add query parameters
- Enter request bodies
- Provide authentication tokens
- Send requests directly from the application
- View status codes
- View response bodies
- View response time
- Test the actual mock execution pipeline

### Request History

- View executed requests
- Inspect request and response details
- Review status codes
- Review response times
- Search and navigate through request records
- Paginated request history

### Collections

- Create collections
- Edit collections
- Delete collections
- Organize related endpoints
- Search collections

### Environments

- Create environments
- Edit environments
- Delete environments
- Activate environments
- Manage environment-specific configurations

### OpenAPI Import

- Import OpenAPI definitions
- Read endpoint definitions from an OpenAPI document
- Generate mock endpoint configurations
- Configure imported endpoints before execution

### Search and Pagination

- Search across records
- Search results across all pages
- Pagination for large datasets
- Previous/Next navigation
- Disabled navigation at the first and last pages
- Row highlighting and navigation to matching records

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend Integration

- ASP.NET Core Web API
- .NET 8
- MongoDB

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## Architecture

```text
┌─────────────────────────────────────┐
│           React Frontend            │
│                                     │
│ Dashboard                           │
│ API Builder                         │
│ API Tester                          │
│ Scenarios                           │
│ Collections                         │
│ Environments                        │
│ OpenAPI Import                      │
│ Request History                     │
└──────────────────┬──────────────────┘
                   │
             HTTP / JSON
                   │
┌──────────────────▼──────────────────┐
│        ASP.NET Core Web API         │
│                                     │
│ Controllers                         │
│ Services                            │
│ Repositories                        │
│ Dynamic Mock Engine                 │
│ Scenario Engine                     │
│ Validation Engine                   │
│ Request History                     │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│              MongoDB                │
│                                     │
│ Endpoints                           │
│ Responses                           │
│ Scenarios                           │
│ Collections                         │
│ Environments                        │
│ Request History                     │
└─────────────────────────────────────┘
```

---

## Project Structure

```text
api-mock-server-ui
│
├── public
├── src
│   ├── api
│   ├── assets
│   ├── components
│   │   ├── forms
│   │   ├── layout
│   │   ├── search
│   │   └── ui
│   ├── hooks
│   ├── pages
│   │   ├── Dashboard
│   │   ├── ApiBuilder
│   │   ├── ApiTester
│   │   ├── Collections
│   │   ├── Environments
│   │   ├── RequestHistory
│   │   └── Scenarios
│   ├── services
│   ├── utils
│   ├── App.jsx
│   └── main.jsx
├── docs
├── package.json
└── README.md
```

---

## Installation

### Clone

```bash
git clone https://github.com/Sasigit1704/API-Mock-Server-Frontend.git
cd API-Mock-Server-Frontend
```

### Install dependencies

```bash
npm install
```

### Start the frontend

```bash
npm run dev
```

The Vite development server will display the frontend URL in the terminal.

> Start the ASP.NET Core backend before using API Builder, API Tester, OpenAPI Import, or other backend-connected features.

---

## Backend Integration

The frontend communicates with the backend through REST APIs.

| Module | Purpose |
|---|---|
| Mock Endpoints | Create and manage endpoint definitions |
| Mock Responses | Configure responses associated with endpoints |
| Mock Scenarios | Configure alternative API behaviours |
| Collections | Organize endpoints |
| Environments | Manage environment configurations |
| API Tester | Execute and verify mock APIs |
| Request History | Inspect previously executed requests |
| OpenAPI Import | Generate endpoint configurations from OpenAPI definitions |
| Dynamic Mock Engine | Execute configured mock behavior |

---

## Screenshots

The screenshots below are the names to use when storing images in:

```text
docs/screenshots/
```

### Dashboard

![Dashboard](docs/screenshots/01-dashboard.png)

Project overview showing endpoint, collection, environment, and scenario statistics.

### API Builder

![API Builder](docs/screenshots/02-api-builder.png)

Central interface for creating and configuring mock endpoints.

### Endpoint Configuration

![Endpoint Configuration](docs/screenshots/03-endpoint-configuration.png)

Endpoint configuration including method, path, request schema, validation, authentication, and simulation settings.

### Multiple Responses

![Multiple Responses](docs/screenshots/04-multiple-responses.png)

Multiple response configurations with active response and percentage-based response selection.

### Scenarios

![Scenarios](docs/screenshots/05-scenarios.png)

Scenario management with active scenario selection and configurable simulated behavior.

### API Tester

![API Tester](docs/screenshots/06-api-tester.png)

Direct request testing from the frontend with path parameters, query parameters, request body, authentication, and response output.

### Response Templating

![Response Templating](docs/screenshots/07-response-templating.png)

Dynamic response values generated from path, query, body, and header request data.

### Rate Limiting

![Rate Limiting](docs/screenshots/08-rate-limiting.png)

Endpoint configured with request limits and a rate-limit response.

### Malformed JSON

![Malformed JSON](docs/screenshots/09-malformed-json.png)

Intentional malformed response configuration used to simulate invalid backend JSON.

### Request History

![Request History](docs/screenshots/10-request-history.png)

Paginated request history showing executed API requests and their results.

### Collections

![Collections](docs/screenshots/11-collections.png)

Collection management and endpoint organization.

### Environments

![Environments](docs/screenshots/12-environments.png)

Environment management and active environment configuration.

### OpenAPI Import

![OpenAPI Import](docs/screenshots/13-openapi-import.png)

OpenAPI document import and generated endpoint configuration.

### Swagger / Backend Execution

![Swagger](docs/screenshots/14-swagger-execution.png)

Swagger request demonstrating execution of a configured mock endpoint.

### Dynamic Mock Response

![Dynamic Mock Response](docs/screenshots/15-dynamic-mock-response.png)

Actual mock response returned by the backend after endpoint configuration.

### MongoDB

![MongoDB](docs/screenshots/16-mongodb.png)

MongoDB data showing persisted mock-server configuration.

---

## Documentation

Technical documentation is maintained under the `docs` directory.

| File | Description |
|---|---|
| `docs/system-architecture.png` | Overall application architecture |
| `docs/frontend-component-architecture.png` | Frontend component structure |
| `docs/backend-component-architecture.png` | Backend architecture |
| `docs/api-request-lifecycle.png` | Request execution lifecycle |
| `docs/database-design.png` | MongoDB data model |
| `docs/API-DOCUMENTATION.md` | REST API reference and usage examples |

---

## Project Status

The current implementation includes:

- Dashboard and navigation
- Mock endpoint management
- Multiple response configuration
- Percentage-based response selection
- Scenario simulation
- Request validation
- Authentication
- Response templating
- Response delay and timeout simulation
- Random failure simulation
- Input and process error simulation
- Rate limiting
- Malformed JSON simulation
- API Tester
- Request history
- Collections
- Environments
- OpenAPI import
- Swagger-based backend testing

---

## Author

**Sasi Kaladhar**

**API Mock Server & Scenario Simulator**

A full-stack developer tool built with React, ASP.NET Core Web API, and MongoDB for configurable API simulation, frontend integration testing, and backend behavior simulation.
