# WorkSphere — Employee & HR Management System

WorkSphere is a full-stack Employee and HR Management System built to manage employee records, leave requests, attendance, and payroll through a secure role-based web application.

The project follows a clean layered architecture:

```
React Frontend → REST API → Spring Boot → Service Layer → JPA/Repository → MySQL
```

## Features

- JWT-based authentication
- Role-based access control
- ADMIN, MANAGER, and EMPLOYEE roles
- Employee CRUD management
- Leave request workflow
- Leave approval/rejection for managers and administrators
- Employee self-service leave history
- Attendance marking and checkout
- Employee and management attendance views
- Payroll creation and payment-status management
- Automatic net salary calculation
- Input validation and centralized exception handling
- Protected API endpoints
- Responsive React dashboard and management pages
- Production-ready environment variable configuration

## Tech Stack

### Backend
- Java 25
- Spring Boot
- Spring Web
- Spring Data JPA / Hibernate
- Spring Security
- JWT (JJWT)
- Bean Validation
- Lombok
- Maven

### Frontend
- React
- Vite
- Axios
- React Router
- CSS

### Database
- MySQL 8

## Architecture

The backend uses a layered architecture to keep responsibilities separated:

- **Controller** — exposes REST API endpoints and handles HTTP requests.
- **Service** — contains business rules and application logic.
- **Repository** — handles database access through Spring Data JPA.
- **Entity** — represents the relational database model.
- **DTO** — controls API response data and avoids exposing internal entity relationships.
- **Security** — authenticates users with JWT and enforces role-based authorization.

## Main Modules

| Module | Description |
|---|---|
| Authentication | Login with JWT authentication |
| Employees | Create, view, update, and delete employee records |
| Leaves | Apply, view, approve, and reject leave requests |
| Attendance | Mark attendance and record checkout |
| Payroll | Create payroll records, calculate net salary, and mark payments as paid |
| Dashboard | Role-aware HR and employee overview |

## Roles & Permissions

### ADMIN
- Full employee management
- View and manage leaves
- View attendance
- Create and manage payroll
- Mark payroll as paid

### MANAGER
- View employees
- View and process leave requests
- View attendance
- View payroll

### EMPLOYEE
- View employee information
- Apply for leave and view own requests
- Mark attendance and checkout
- View own attendance
- View own payroll

Authorization is enforced on the backend using Spring Security, so frontend restrictions are not the only security layer.

## Database Model

The application contains the following core entities:

- User
- Employee
- LeaveRequest
- Attendance
- Payroll

Important relationships include:

- A User can be linked to an Employee profile.
- An Employee can have multiple LeaveRequest records.
- An Employee can have multiple Attendance records.
- An Employee can have multiple Payroll records.
- Attendance is unique per employee per date.
- Payroll is unique per employee per payroll month.

## Authentication Flow

1. User submits username and password.
2. Spring Security authenticates the credentials.
3. The backend generates a signed JWT.
4. The frontend stores the authentication state locally.
5. Axios attaches the JWT as a Bearer token to API requests.
6. Spring Security validates the token for protected endpoints.
7. Role-based authorization determines whether the requested operation is permitted.

## Local Setup

### Prerequisites

- JDK 25+
- Maven 3.9+
- Node.js 20+
- MySQL 8+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kuldeep-Katre2693/employee-management-system.git
cd employee-management-system
```

### 2. Create the database

Create a MySQL database:

```sql
CREATE DATABASE employee_management;
```

### 3. Configure backend environment variables

Create:

```
ems-backend/src/main/resources/application-local.properties
```

Configure the local database password and JWT secret according to the `.env.example` / local configuration used by the project.

The actual local secrets are intentionally excluded from Git.

### 4. Run the backend

Windows:

```powershell
cd ems-backend
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```
http://localhost:8080
```

### 5. Configure the frontend

Create `ems-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 6. Run the frontend

```powershell
cd ems-frontend
npm install
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

## Production Deployment

The recommended deployment architecture is:

```
React/Vite → Vercel
Spring Boot → Railway
MySQL → Railway
```

Railway supports Spring Boot deployments and provides a MySQL service that can be connected to the backend through environment variables. Vercel supports Vite/React deployments.

### Backend environment variables

Configure production values in the backend hosting service instead of committing secrets:

```
DB_PASSWORD=<production-mysql-password>
JWT_SECRET=<strong-random-jwt-secret>
```

The production database URL, username, and database name should be configured for the deployed MySQL instance.

### Frontend environment variable

Configure:

```
VITE_API_BASE_URL=<deployed-backend-api-url>
```

After deployment, update the backend CORS configuration to allow the deployed frontend origin.

## Security Notes

- Passwords are stored using BCrypt hashing.
- JWT secrets are provided through environment variables.
- Local secret configuration is excluded from Git.
- Password fields are excluded from API serialization.
- Employee/User internal relationships are not unnecessarily exposed through API responses.
- Backend authorization protects sensitive operations even if the frontend is bypassed.
- Invalid or expired JWTs are rejected by the backend.
- Validation and centralized exception handling provide consistent API errors.

## Project Structure

```
employee-management-system/
├── ems-backend/
│   ├── src/main/java/com/kuldeep/ems/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── pom.xml
│
├── ems-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Testing & Verification

Before deployment, the project was verified with:

- Backend Maven tests
- Frontend production build
- API validation testing
- JWT authentication testing
- Role-based authorization testing
- Leave workflow testing
- Attendance workflow testing
- Payroll workflow testing
- Duplicate-record validation
- Global error handling
- Git diff validation
- Secret/configuration checks

## Future Improvements

Possible future enhancements include:

- Email notifications
- Advanced HR analytics
- Attendance reports and exports
- Payroll payslip generation
- Audit logging
- Password reset
- Refresh-token authentication
- Automated CI/CD testing

## Author

**Kuldeep Katre**

Computer Science & Engineering student focused on Full-Stack Development, Java, Spring Boot, React, Data Science, and AI.

GitHub: https://github.com/Kuldeep-Katre2693
