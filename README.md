# AI SQL Query Agent

## Project Overview
This project is a full-stack web application that converts natural language into MySQL SQL queries using Google Gemini AI. It provides a polished UI for entering user prompts and viewing query history while keeping the workflow focused on SQL generation only.

## Features
- Natural-language to SQL generation using Gemini
- Responsive dashboard UI with modern visuals
- Save generated queries to MySQL
- View recent query history
- Copy and download generated SQL
- Input validation and error feedback
## Technology Stack
- Java 25
- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- MySQL
- HTML, CSS, JavaScript
- Google Gemini API

## Architecture
The backend follows a layered architecture with controller, service, repository, entity, dto, config, and exception packages.

## Folder Structure
```text
sql-agent/
├── src/main/java/com/sqlagent/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── config/
│   ├── exception/
│   └── SqlAgentApplication.java
├── src/main/resources/
│   ├── static/css/
│   ├── static/js/
│   ├── templates/
│   └── application.properties
├── pom.xml
└── README.md
```

## Database Setup
1. Create a MySQL database named `ai_sql_agent`.
2. Ensure the credentials in `application.properties` match your local MySQL setup.
3. Spring Boot will auto-create the required table via JPA.

## Gemini API Setup
1. Set your Gemini API key in `application.properties`.
2. The backend sends prompts to the Gemini endpoint using a REST client.

## Installation Steps
```bash
mvn clean install
mvn spring-boot:run
```

## API Endpoints
- POST `/api/sql/generate`
- GET `/api/history`

## How to Run
Open the application in a browser at `http://localhost:8080`.

## Future Enhancements
- Add query execution support with user confirmation
- Support multiple database dialects
- Improve prompt tuning for complex SQL generation
