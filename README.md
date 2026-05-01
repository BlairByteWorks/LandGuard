#  LandGuard: Intelligent Property Verification & Valuation System

##  Project Overview
The real estate sector in Kenya is plagued by Information Asymmetry, leading to rampant title fraud, double allocations, and artificial value inflation. **LandGuard** is a centralized, web-based platform designed to bridge the trust gap between buyers, sellers, and regulators. 

By digitizing the traditional "Chain of Custody" for land titles and integrating a Machine Learning regression model, LandGuard acts as a digital escrow for information. It provides buyers with an automated Trust Report and AI-driven Fair Market Estimate to completely eradicate information asymmetry.

##  Key Features
The system utilizes strict Role-Based Access Control (RBAC) to serve three distinct stakeholders:

* **Buyers (View-Only):** Search for properties via Title Number, view an interactive historical Chain of Custody, and receive AI-generated price fairness confidence scores.
* **Sellers (Listing):** Securely initiate the verification process, post property listings, and upload digital Title Deeds (PDF/Images) converted to Base64 for secure storage.
* **Chief Registrar (Validation):** An administrative console to review pending listings, cross-reference uploaded deeds, and approve/reject transfers to maintain an immutable history log.

##  Technology Stack
LandGuard is built using a decoupled **Microservices-Lite** architecture.

* **Frontend (Client):** React.js (Vite), TailwindCSS, Axios, React Router.
* **Backend API (Server):** Node.js, Express.js, JWT Authentication, Bcrypt.
* **Database:** MongoDB Atlas (NoSQL) with Mongoose ODM.
* **AI Microservice:** Python, Flask, Scikit-Learn (Multiple Linear Regression).

##  Repository Structure
```bash
├── ai-service/       # Python/Flask microservice for AI valuation model
├── client/           # React.js frontend application
├── server/           # Node.js/Express backend REST API
└── README.md
