# WiseShift Emergency Management System - Context Specification

## 1. Overview

WiseShift is an emergency management system designed to coordinate and manage essential workers during crisis situations. The system enables real-time data collection, task management, and status monitoring through a centralized platform accessible to both managers and employees.

## 2. Objectives

- **Real-time Data Collection:** Enable immediate gathering of employee status and availability during emergencies
- **Task Management:** Facilitate the creation, assignment, and monitoring of emergency-related tasks
- **Status Monitoring:** Provide clear visibility of employee availability and task progress
- **Centralized Communication:** Enable efficient communication between managers and employees

## 3. Technologies

- **Frontend:** React with TypeScript
- **Backend:** Node.js with Express
- **Database:** MongoDB (using Mongoose for schema management)
- **Authentication:** JSON Web Tokens (JWT)
- **UI Components:** mui library
- **State Management:** React Context or Redux
- **Testing:** Jest for unit tests

## 4. Functional Requirements

### 4.1 Initial Form Management

- **Form Distribution:** Managers can send initial assessment forms to employees
- **Data Collection:** Capture essential information:
  - Stress level (1-10 scale)
  - Physical condition (injured/not injured)
  - Spouse availability for childcare
  - Available working hours
  - Work capability status

### 4.2 Manager Dashboard

- **Task Overview:**
  - View all tasks with their completion status
  - Filter unassigned tasks
  - Monitor team-wide task progress
- **Employee Status:**

  - Real-time view of employee availability
  - Graphical representation of team capacity
  - Filtering options by availability and status

- **Task Management:**
  - Create and assign custom tasks
  - Track task completion status
  - Generate tickets for unhandled tasks
  - Assign tasks to external stakeholders

### 4.3 Employee Dashboard

- **Task Management:**
  - View personalized daily task checklist
  - Update task status (Complete/In Progress/Transferred)
  - Create tickets for exceptional needs
- **Personal Status:**
  - Update availability and personal circumstances
  - View and respond to manager updates
  - Track daily task progress

## 5. Non-Functional Requirements

- **Performance:** System must handle approximately 100 concurrent users
- **Language:** Hebrew interface only for MVP
- **Accessibility:** Basic accessibility support
- **Security:** Secure authentication and data protection
- **Usability:** Intuitive interface for stress conditions

## 6. System Architecture

```
(Client: React) <---> (Backend API: Node.js/Express) <---> (MongoDB)
```

## 7. API Endpoints

### 7.1 Authentication Endpoints

- **POST /api/auth/login**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword"
  }
  ```

### 7.2 Form Endpoints

- **POST /api/forms/initial**
  ```json
  {
    "stressLevel": 7,
    "physicallyInjured": false,
    "spouseAvailable": true,
    "availableHours": 6,
    "canWorkAsUsual": true
  }
  ```

### 7.3 Task Endpoints

- **GET /api/tasks**
  ```json
  [
    {
      "id": "taskId",
      "title": "Task Title",
      "status": "pending",
      "assignedTo": "userId",
      "priority": "high"
    }
  ]
  ```

## 8. Data Models

### 8.1 User Model

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["manager", "employee", "guest"],
    required: true,
  },
  department: { type: String, required: true },
  status: {
    stressLevel: Number,
    physicallyInjured: Boolean,
    spouseAvailable: Boolean,
    availableHours: Number,
    canWorkAsUsual: Boolean,
    lastUpdated: Date,
  },
});
```

### 8.2 Task Model

```javascript
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["pending", "inProgress", "completed", "transferred"],
    default: "pending",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  comments: [
    {
      text: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

## 9. UI Components

### Manager Dashboard

- Task overview panel
- Employee status graphs
- Task creation and assignment interface
- Status filters and search functionality

### Employee Dashboard

- Daily task checklist
- Status update form
- Personal availability tracker
- Notification area for manager updates

## 10. Development Priorities

1. Initial Form System
2. Manager Dashboard Core Features
3. Employee Dashboard Basic Functions
4. Task Management System
5. Status Update Mechanisms

## 11. MVP Limitations

- No interactive map feature
- No multi-language support
- No mobile application
- Limited to ~100 concurrent users
- Basic reporting capabilities only
