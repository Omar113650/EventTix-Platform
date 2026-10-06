# EventTix

**AI-Powered Event Management and Ticketing Platform**

EventTix is a modern event management and ticketing backend built with NestJS and TypeScript.

The platform provides infrastructure for event discovery, event management, bookings, payments, categories, communities, notifications, search, and user authentication.

EventTix also integrates AI and Large Language Models to provide intelligent event discovery and natural-language interaction with platform data.

The architecture includes dedicated modules for Elasticsearch, RabbitMQ, AI/LLM integration, MCP, Cloudinary, email services, internationalization, notifications, and external contextual services such as weather information.

---

## Table of Contents

1. Project Overview
2. Core Features
3. Tech Stack
4. System Architecture
5. Authentication and Authorization
6. Event Management
7. Categories
8. Booking System
9. Payment System
10. Community
11. Notification System
12. Search Architecture
13. Elasticsearch
14. AI Architecture
15. Retrieval-Augmented Generation
16. Natural Language Event Discovery
17. LLM Integration
18. MCP Integration
19. RabbitMQ
20. Event-Driven Architecture
21. Cloudinary
22. Email Services
23. Internationalization
24. Weather Integration
25. Project Structure
26. Environment Configuration
27. Installation
28. Engineering Highlights
29. Scalability
30. Future Enhancements
31. Author

---

# Project Overview

EventTix is an event management and ticketing platform designed to handle the complete event lifecycle.

The platform connects users with events through discovery, search, booking, payment, notifications, and community features.

A simplified user journey:

```text
User
 |
 v
Authentication
 |
 v
Discover Events
 |
 v
Search / AI Search
 |
 v
View Event
 |
 v
Book Event
 |
 v
Payment
 |
 v
Booking Confirmation
 |
 v
Notifications
 |
 v
Community Interaction
```

EventTix is designed as more than a traditional CRUD-based event application.

The backend contains dedicated infrastructure for:

- Search
- AI
- Large Language Models
- Messaging
- Payments
- Notifications
- Cloud storage
- Email
- Internationalization
- External integrations

---

# Core Features

The platform includes:

- User Authentication
- Role-Based Authorization
- Event Management
- Event Categories
- Event Discovery
- Event Booking
- Payment Processing
- Community Features
- Notification Management
- Advanced Search
- Elasticsearch Integration
- AI-Powered Event Interaction
- Natural Language Queries
- LLM Integration
- Retrieval-Augmented Generation
- RabbitMQ Messaging
- MCP Integration
- Cloudinary Media Management
- Email Services
- Multi-Language Support
- Weather Integration
- Database Migrations

---

# Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend Framework | NestJS |
| Language | TypeScript |
| Architecture | Modular NestJS Architecture |
| Search Engine | Elasticsearch |
| Message Broker | RabbitMQ |
| AI | LLM Integration |
| AI Pattern | Retrieval-Augmented Generation |
| AI Integration | Dedicated AI / LLM Modules |
| Tool Integration | MCP |
| Cloud Storage | Cloudinary |
| Email | Dedicated Email Module |
| Internationalization | i18n |
| External Data | Weather Integration |
| Testing | NestJS / TypeScript Testing Infrastructure |

---

# System Architecture

The backend follows a modular architecture where each major business domain has its own module.

```text
                         Client Applications
                                 |
                                 v
                            NestJS API
                                 |
       ---------------------------------------------------
       |           |           |           |             |
       v           v           v           v             v
      Auth       Events      Booking     Payment      Community
                                 |
       ---------------------------------------------------
       |           |           |           |             |
       v           v           v           v             v
    Search     Notification    AI/LLM    RabbitMQ       Email
       |
       v
 Elasticsearch
```

External infrastructure is separated from core business logic.

```text
                      EventTix Backend
                            |
         -----------------------------------------
         |             |            |            |
         v             v            v            v
    Elasticsearch   RabbitMQ    Cloudinary    LLM / AI
```

This architecture makes the platform easier to maintain and evolve.

---

# Authentication and Authorization

Authentication functionality is separated into the:

```text
src/Auth/
```

module.

The authentication layer is responsible for identifying users and protecting private resources.

A typical authentication flow:

```text
User
 |
 v
Authentication Request
 |
 v
Validate Credentials
 |
 v
Authenticate User
 |
 v
Generate Authentication Data
 |
 v
Access Protected Endpoint
```

The project also contains dedicated role decorators:

```text
src/decorator/roles/
```

These can be used to enforce authorization rules across protected endpoints.

---

# Role-Based Authorization

Authentication determines:

```text
Who is the user?
```

Authorization determines:

```text
What is the user allowed to do?
```

Conceptually:

```text
Request
   |
   v
Authentication
   |
   v
User Identity
   |
   v
Role Validation
   |
   +---- Unauthorized -> Reject
   |
   v
Controller
```

This allows sensitive event, booking, payment, and administrative operations to be protected.

---

# Event Management

The main event domain is located in:

```text
src/Event/
```

Events represent the core business entity of EventTix.

Event functionality can include:

- Creating events
- Retrieving events
- Updating events
- Managing event information
- Organizing events into categories
- Connecting events with bookings
- Connecting events with search
- Providing event information to AI systems

Conceptually:

```text
Event
 |
 +---- Category
 |
 +---- Bookings
 |
 +---- Payment
 |
 +---- Notifications
 |
 +---- Search Index
```

---

# Category Management

Event categories are handled through:

```text
src/Category/
```

Categories allow events to be organized into logical groups.

```text
Category
   |
   +---- Event
   |
   +---- Event
   |
   +---- Event
```

This improves event organization, filtering, and discovery.

---

# Booking System

Booking functionality is implemented through:

```text
src/Book/
```

The booking system connects users with events.

A typical workflow:

```text
User
 |
 v
Select Event
 |
 v
Validate Event
 |
 v
Create Booking
 |
 v
Payment
 |
 v
Confirm Booking
 |
 v
Generate Notification
```

The booking module separates reservation logic from event management.

---

# Payment System

Payment functionality is located in:

```text
src/Payment/
```

The payment module handles payment-related operations independently from the event and booking modules.

Conceptually:

```text
Booking
   |
   v
Payment Request
   |
   v
Payment Module
   |
   v
Payment Provider
   |
   v
Payment Result
   |
   v
Update Booking
```

Separating payment logic reduces coupling between booking and external payment infrastructure.

---

# Community

EventTix contains a dedicated community module:

```text
src/Community/
```

This allows the platform to extend beyond event discovery and ticket purchasing.

Community functionality provides infrastructure for social interaction around events and users.

Conceptually:

```text
EventTix
   |
   +---- Events
   |
   +---- Bookings
   |
   +---- Community
```

This helps transform the platform from a simple ticketing service into a broader event ecosystem.

---

# Notification System

Notifications are separated into:

```text
src/Notification/
```

The notification layer can react to important platform events.

Examples include:

- Booking created
- Booking confirmed
- Payment completed
- Event updated
- Event-related activity
- Community activity

Conceptually:

```text
Business Event
      |
      v
Notification Module
      |
      v
Create Notification
      |
      v
Deliver to User
```

---

# Search Architecture

Search is a dedicated part of the platform.

Relevant modules include:

```text
src/search/
src/elasticsearch/
```

Separating search from the core event module allows EventTix to implement more advanced event discovery without overloading normal database queries.

The architecture can be represented as:

```text
User Search
    |
    v
Search Module
    |
    v
Elasticsearch
    |
    v
Search Index
    |
    v
Relevant Events
```

---

# Elasticsearch

EventTix contains a dedicated Elasticsearch integration:

```text
src/elasticsearch/
```

Elasticsearch can provide fast search capabilities for event data.

This is particularly useful for event discovery where users may search using different fields or keywords.

Conceptually:

```text
Event Created / Updated
         |
         v
Application
         |
         v
Elasticsearch Index
```

Then:

```text
Search Query
     |
     v
Elasticsearch
     |
     v
Ranked Results
     |
     v
Events
```

This separates search workloads from normal transactional database operations.

---

# AI Architecture

One of the main features of EventTix is its AI integration.

The project contains dedicated modules:

```text
src/ai/
src/llm/
```

The AI layer allows users to interact with event information using natural language.

Instead of relying entirely on filters and exact search queries, users can ask questions about available events.

Example:

```text
"What technology events are available this weekend?"
```

or:

```text
"Find events suitable for backend developers."
```

The backend can interpret the request, retrieve relevant event information, and use an LLM to generate a useful response.

---

# Natural Language Event Discovery

Traditional event discovery may require users to configure filters manually:

```text
Category = Technology
Location = Cairo
Date = Weekend
Price < 500
```

EventTix can provide a more natural interaction:

```text
"Show me affordable technology events in Cairo this weekend."
```

The AI layer can process the user's intent and combine it with platform event information.

---

# Retrieval-Augmented Generation

EventTix uses a Retrieval-Augmented Generation approach for intelligent event questions.

The important idea is that the LLM should not answer event-specific questions using only its pretrained knowledge.

Instead:

```text
User Question
      |
      v
Retrieve Relevant Event Data
      |
      v
Build Context
      |
      v
Send Context + Question to LLM
      |
      v
Generate Grounded Answer
```

This makes responses more relevant to the actual events stored in the platform.

---

# RAG Workflow

A simplified RAG workflow:

```text
User
 |
 v
Natural Language Question
 |
 v
AI Module
 |
 v
Understand Query
 |
 v
Search Relevant Events
 |
 +----------------------+
 |                      |
 v                      v
Database           Elasticsearch
 |                      |
 +----------+-----------+
            |
            v
      Relevant Events
            |
            v
       Build Context
            |
            v
          LLM
            |
            v
   Grounded AI Response
```

This architecture reduces the risk of returning generic answers unrelated to actual platform data.

---

# AI Ask Endpoint

A natural-language endpoint can expose the AI functionality.

Conceptually:

```text
POST /events/ask
```

Example request:

```json
{
  "question": "What events are suitable for software developers this weekend?"
}
```

The backend can:

1. Receive the question
2. Analyze the user's intent
3. Retrieve relevant events
4. Build contextual event data
5. Send the context to the LLM
6. Return the generated answer

---

# Grounded AI Responses

The goal of the AI architecture is:

```text
User Question
      +
Actual Event Data
      |
      v
LLM
      |
      v
Context-Aware Answer
```

rather than:

```text
User Question
      |
      v
LLM
      |
      v
Generic / Hallucinated Event Information
```

This distinction is important when using generative AI with application-specific data.

---

# LLM Integration

Large Language Model functionality is separated into:

```text
src/llm/
```

This allows AI provider logic to remain independent from event controllers.

Conceptually:

```text
Event Controller / AI Module
           |
           v
       LLM Service
           |
           v
       AI Provider
           |
           v
        Response
```

This separation makes the architecture easier to maintain if the AI provider changes later.

---

# Prompt Construction

For RAG-based queries, the backend can construct prompts using retrieved event information.

Conceptually:

```text
System Instructions

Relevant Event Context:
- Event A
- Event B
- Event C

User Question:
"What technology events are available this weekend?"
```

The LLM receives both the question and the relevant platform context.

This improves answer relevance and reduces dependence on external model knowledge.

---

# MCP Integration

EventTix contains a dedicated MCP module:

```text
src/mcp/
```

The repository also includes:

```text
run-mcp.js
```

This indicates that MCP functionality is separated from the core application.

At a high level, MCP provides a standardized mechanism for connecting AI systems with tools and contextual resources.

The architecture can be represented as:

```text
AI / LLM
   |
   v
MCP Layer
   |
   v
Application Tools / Context
```

This provides a foundation for extending AI functionality beyond simple prompt-and-response interactions.

---

# RabbitMQ

EventTix contains dedicated RabbitMQ infrastructure:

```text
src/rabbitmq/
```

RabbitMQ allows parts of the system to communicate asynchronously.

Instead of performing every operation synchronously:

```text
Request
  |
  v
Do Everything
  |
  v
Response
```

the application can use:

```text
Request
  |
  v
Core Operation
  |
  v
Publish Event
  |
  v
Return Response

        RabbitMQ
           |
     --------------
     |            |
     v            v
Notification    Other Consumer
```

This helps decouple business operations from secondary processing.

---

# Event-Driven Architecture

RabbitMQ allows EventTix to evolve toward event-driven communication.

For example:

```text
Booking Created
      |
      v
Publish Event
      |
      v
RabbitMQ
      |
  -------------------
  |                 |
  v                 v
Notification     Email Consumer
```

The booking module does not need to contain all notification and email logic directly.

This reduces coupling between modules.

---

# Why Use a Message Broker?

Without asynchronous messaging:

```text
Create Booking
     |
     v
Send Email
     |
     v
Create Notification
     |
     v
Other Processing
     |
     v
Return Response
```

The user may wait for secondary tasks.

With messaging:

```text
Create Booking
     |
     v
Publish Event
     |
     v
Return Response

RabbitMQ
   |
   +---- Notification
   |
   +---- Email
   |
   +---- Other Consumers
```

This architecture provides a foundation for more scalable background processing.

---

# Cloudinary

Cloud media functionality is separated into:

```text
src/cloudinary/
```

Cloudinary can manage uploaded event media outside the application server.

A typical flow:

```text
Client
  |
  v
Upload Event Image
  |
  v
Backend
  |
  v
Cloudinary
  |
  v
Cloud URL
  |
  v
Event Data
```

This avoids relying entirely on local server storage.

---

# Email Services

Email functionality is contained in:

```text
src/email/
```

Email can support platform workflows such as:

- Authentication-related emails
- Booking confirmations
- Payment notifications
- Event notifications
- Account communication

Separating email functionality keeps communication logic independent from core event controllers.

---

# Internationalization

EventTix contains:

```text
src/i18n/
```

This provides infrastructure for internationalized application messages.

Internationalization allows the backend to support multiple languages without duplicating business logic.

Conceptually:

```text
Request
  |
  v
Detect Language
  |
  v
Business Logic
  |
  v
i18n
  |
  v
Localized Response
```

This is especially useful when EventTix serves users from different regions.

---

# Weather Integration

The project contains a dedicated:

```text
src/weather/
```

module.

Weather information can provide additional contextual data for events, particularly outdoor events.

Conceptually:

```text
Event
 |
 +---- Location
 |
 +---- Date
        |
        v
    Weather Service
        |
        v
    Weather Context
```

This can enhance event discovery and event-related information.

---

# Database Layer

Database infrastructure is separated into:

```text
src/db/
```

Database migration logic is also separated into:

```text
src/migration/
```

This keeps persistence infrastructure independent from business modules.

Conceptually:

```text
Business Modules
       |
       v
Database Layer
       |
       v
Persistent Storage
```

---

# Middleware

Shared middleware is located in:

```text
src/middleware/
```

Middleware can handle cross-cutting concerns before requests reach controllers.

Examples include:

- Authentication
- Request processing
- Validation
- Security checks
- Logging
- Error handling

---

# Utilities and Shared Types

Shared utilities are stored in:

```text
src/utils/
```

while reusable TypeScript types are located in:

```text
src/types/
```

This reduces duplicated code across business modules.

---

# Project Structure

The actual high-level project structure follows:

```text
src/
|
|-- Auth/
|
|-- Book/
|
|-- Category/
|
|-- Community/
|
|-- Config/
|
|-- Event/
|
|-- Notification/
|
|-- Payment/
|
|-- ai/
|
|-- cloudinary/
|
|-- db/
|
|-- decorator/
|   `-- roles/
|
|-- elasticsearch/
|
|-- email/
|
|-- i18n/
|
|-- llm/
|
|-- mcp/
|
|-- middleware/
|
|-- migration/
|
|-- rabbitmq/
|
|-- search/
|
|-- types/
|
|-- utils/
|
|-- weather/
|
|-- app.controller.spec.ts
|-- app.module.ts
`-- main.ts

test/

run-mcp.js

.gitignore
.prettierrc
README.md
eslint.config.mjs
nest-cli.json
package-lock.json
package.json
tsconfig.build.json
tsconfig.json
```

The architecture is organized around business domains and infrastructure modules.

---

# Application Flow

A standard request can follow:

```text
Client
  |
  v
NestJS Controller
  |
  v
Authentication / Authorization
  |
  v
Business Service
  |
  +---------------------+
  |                     |
  v                     v
Database           Infrastructure
                        |
              -----------------------
              |          |          |
              v          v          v
          RabbitMQ   Elasticsearch  AI
```

---

# AI Search Flow

One of the more advanced flows in EventTix can be represented as:

```text
User Question
      |
      v
NestJS API
      |
      v
AI Module
      |
      v
Search Module
      |
      v
Elasticsearch
      |
      v
Relevant Event Data
      |
      v
LLM Module
      |
      v
Context-Aware Response
```

This combines search and generative AI rather than treating them as isolated features.

---

# Environment Configuration

The exact environment variable names should follow the implementation.

The application may require configuration for infrastructure such as:

```env
PORT=3000

DATABASE_URL=your_database_connection_string

JWT_SECRET=your_jwt_secret

ELASTICSEARCH_NODE=your_elasticsearch_url

RABBITMQ_URL=your_rabbitmq_url

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

LLM_API_KEY=your_llm_api_key

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Additional environment variables may be required for payment, weather, MCP, and other external services.

Never commit production secrets or credentials to Git.

---

# Installation and Setup

## Requirements

Make sure the required infrastructure is available.

Depending on the project configuration, this can include:

- Node.js
- npm
- Database
- RabbitMQ
- Elasticsearch

---

## Clone Repository

```bash
git clone <repository-url>
cd event-tix-project
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create the required environment configuration and add credentials for the services used by the project.

---

## Start Development Server

```bash
npm run start:dev
```

---

## Build Project

```bash
npm run build
```

---

## Start Production Build

```bash
npm run start:prod
```

The exact available commands should follow the scripts defined in `package.json`.

---

# Testing

The project contains testing infrastructure including:

```text
src/app.controller.spec.ts
test/
```

NestJS testing can be used for:

- Unit testing
- Controller testing
- Service testing
- Integration testing
- End-to-end testing

---

# Engineering Highlights

## Modular NestJS Architecture

Business domains such as authentication, events, bookings, payments, communities, and notifications are separated into dedicated modules.

## AI-Powered Event Discovery

Users can interact with event information through natural-language queries rather than depending only on traditional filters.

## Retrieval-Augmented Generation

Relevant event data can be retrieved before sending context to the LLM, helping produce grounded responses.

## Elasticsearch Integration

Search workloads are separated from the application's normal transactional operations.

## RabbitMQ Messaging

Asynchronous messaging provides a foundation for decoupled event-driven workflows.

## MCP Integration

The MCP layer provides infrastructure for connecting AI functionality with tools and application context.

## Dedicated LLM Layer

AI provider functionality is separated from the application's business controllers.

## Community Architecture

The platform extends beyond event booking by including dedicated community functionality.

## Internationalization

Dedicated i18n infrastructure allows the backend to support localized application responses.

## External Context Integration

Weather functionality provides additional contextual information that can enhance event-related features.

## Cloud Media Management

Cloudinary provides external media storage for event-related assets.

## Separation of Concerns

Business logic and infrastructure concerns are separated across dedicated modules.

---

# Scalability

The modular architecture provides a foundation for future horizontal scaling.

A larger architecture could evolve into:

```text
                       Load Balancer
                            |
             -----------------------------
             |                           |
             v                           v
       NestJS Instance             NestJS Instance
             |                           |
             +-------------+-------------+
                           |
       ------------------------------------------------
       |                 |              |             |
       v                 v              v             v
    Database        Elasticsearch    RabbitMQ      External APIs
                                          |
                                -------------------
                                |                 |
                                v                 v
                         Notification         Email
                          Consumer           Consumer
```

RabbitMQ allows asynchronous workloads to be processed independently from normal HTTP traffic.

Elasticsearch can handle search workloads separately from the primary database.

---

# Future Enhancements

Possible future improvements include:

- Redis caching
- Recommendation engine
- Personalized event recommendations
- Semantic search
- Vector embeddings
- Advanced RAG pipelines
- Conversation history for AI queries
- AI tool calling
- Advanced MCP tools
- Event recommendation ranking
- Ticket QR codes
- QR ticket verification
- Waiting lists
- Dynamic ticket pricing
- Refund workflows
- Background workers
- Notification queues
- Docker containerization
- CI/CD pipelines
- Nginx reverse proxy
- Structured logging
- Distributed tracing
- Error monitoring
- API performance metrics
- Rate limiting
- Horizontal scaling

---

# Use Cases

## Event Attendee

A user can:

- Register and login
- Discover events
- Search events
- Ask natural-language questions
- View event information
- Book events
- Complete payments
- Receive notifications
- Participate in community features

## Event Organizer

Depending on assigned permissions, an organizer can:

- Create events
- Manage event information
- Manage event categories
- Monitor bookings
- Manage event-related content

## AI User

A user can interact with EventTix using questions such as:

```text
"What technology events are available this weekend?"
```

```text
"Find events suitable for backend developers."
```

```text
"What events should I attend if I am interested in AI?"
```

The backend retrieves relevant platform data and provides it as context to the LLM before generating the response.

---

# Final Note

EventTix demonstrates the architecture of a modern event management platform that combines traditional backend engineering with search, messaging, and generative AI.

The project goes beyond basic event CRUD functionality by integrating bookings, payments, communities, notifications, Elasticsearch search, RabbitMQ messaging, Retrieval-Augmented Generation, Large Language Models, MCP, Cloudinary, email services, internationalization, and external contextual services.

The separation between core business modules and infrastructure modules provides a maintainable foundation for evolving EventTix into a larger production event platform.

One of the most important architectural aspects of EventTix is the combination of:

```text
Structured Application Data
          +
      Search Engine
          +
        RAG
          +
         LLM
          +
         MCP
```

This allows the platform to provide intelligent event discovery while keeping AI responses connected to real application data.

---

# Author

**Omar Elhelaly**

Backend Developer specializing in:

- Node.js
- NestJS
- TypeScript
- RESTful APIs
- Event-Driven Architecture
- RabbitMQ
- Elasticsearch
- Search Systems
- Generative AI Integration
- Retrieval-Augmented Generation
- Large Language Models
- MCP
- Authentication and Authorization
- Payment Systems
- Cloudinary
- Backend Architecture
- Scalable Systems
