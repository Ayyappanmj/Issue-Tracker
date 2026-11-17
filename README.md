# Issue Tracker

A full-stack RESTful issue tracking web application built with Node.js and Express. It enables tracking, categorizing, filtering, updating, and resolving project tickets across multiple isolated workspaces with full CRUD operations and a suite of automated functional tests.

## Features

- **Multi-Project Workspaces**: Dynamically manages issues scoped by project slug (`/api/issues/:project`).
- **Complete Issue CRUD Operations**:
  - **Create**: Add new tickets with required fields (`issue_title`, `issue_text`, `created_by`) and optional metadata (`assigned_to`, `status_text`).
  - **Read & Filter**: Retrieve all tickets for a project or filter dynamically by any attribute (e.g. status, author, assignee, open/closed).
  - **Update**: Modify one or multiple fields on an existing issue, automatically refreshing the `updated_on` timestamp.
  - **Delete**: Remove tickets by ID with clean error handling and status confirmations.
- **Data Validation & Error Diagnostics**: Sanitizes and validates request bodies, returning clear error messages for missing parameters, empty submissions, or invalid IDs.
- **Interactive Web Interface**: Built-in dashboard and project-level views to submit and manage tickets directly from the browser.
- **Automated Integration Testing**: 14 Chai-HTTP integration test cases testing all endpoints, boundary conditions, and query filters.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Testing**: Mocha, Chai, Chai-HTTP
- **Frontend**: HTML5, CSS3, JavaScript, jQuery
- **Configuration**: dotenv

## Project Structure

```text
├── public/                   # Static styling and client assets
├── routes/
│   ├── api.js                # Core REST API route controllers
│   └── fcctesting.js         # Test runner integration route
├── tests/
│   └── 2_functional-tests.js   # End-to-end Chai-HTTP test suite
├── views/
│   ├── index.html            # Main application landing page and test console
│   └── issue.html            # Project-specific issue board view
├── .env                      # Environment configuration
├── server.js                 # Application entry point and server startup
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ayyappanmj/Issue-Tracker.git
   cd Issue-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory (or copy `sample.env`):
   ```bash
   cp sample.env .env
   ```
   Add your environment configuration:
   ```env
   PORT=3000
   NODE_ENV=test
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The application will be running at `http://localhost:3000`.

## API Documentation

All API routes are prefixed under `/api/issues/:project`.

### 1. Create an Issue
* **Method:** `POST`
* **URL:** `/api/issues/:project`
* **Request Body:**
  ```json
  {
    "issue_title": "Fix navbar alignment",
    "issue_text": "Navbar overlaps with content on mobile viewports",
    "created_by": "Ayyappan",
    "assigned_to": "Frontend Team",
    "status_text": "In Progress"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "_id": "673998b2f819a502476d33a1",
    "issue_title": "Fix navbar alignment",
    "issue_text": "Navbar overlaps with content on mobile viewports",
    "created_by": "Ayyappan",
    "assigned_to": "Frontend Team",
    "status_text": "In Progress",
    "created_on": "2026-11-17T05:20:00.000Z",
    "updated_on": "2026-11-17T05:20:00.000Z",
    "open": true
  }
  ```

### 2. View Project Issues (with optional filters)
* **Method:** `GET`
* **URL:** `/api/issues/:project`
* **Query Parameters (Optional):** Filter by any field, e.g.:
  - `/api/issues/myproject?open=true`
  - `/api/issues/myproject?assigned_to=Frontend%20Team&open=false`
* **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "673998b2f819a502476d33a1",
      "issue_title": "Fix navbar alignment",
      "issue_text": "Navbar overlaps with content on mobile viewports",
      "created_by": "Ayyappan",
      "assigned_to": "Frontend Team",
      "status_text": "In Progress",
      "created_on": "2026-11-17T05:20:00.000Z",
      "updated_on": "2026-11-17T05:20:00.000Z",
      "open": true
    }
  ]
  ```

### 3. Update an Issue
* **Method:** `PUT`
* **URL:** `/api/issues/:project`
* **Request Body:** Must include `_id` and at least one field to update:
  ```json
  {
    "_id": "673998b2f819a502476d33a1",
    "open": false,
    "status_text": "Resolved"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "result": "successfully updated",
    "_id": "673998b2f819a502476d33a1"
  }
  ```

### 4. Delete an Issue
* **Method:** `DELETE`
* **URL:** `/api/issues/:project`
* **Request Body:**
  ```json
  {
    "_id": "673998b2f819a502476d33a1"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "result": "successfully deleted",
    "_id": "673998b2f819a502476d33a1"
  }
  ```

## Running Tests

Automated functional tests validate all endpoint contracts and edge cases.

To execute the test suite:
```bash
npm test
```

## Author

**Ayyappan**
- GitHub: [@Ayyappanmj](https://github.com/Ayyappanmj)

## License

This project is licensed under the MIT License.
