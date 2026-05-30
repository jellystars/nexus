# NEXUS
A full-stack IT monitoring dashboard that tracks real-time system metrics and uses Google Gemini AI to automatically diagnose anomalies.

## Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Google Gemini API Key](https://aistudio.google.com) (free tier)

### Run with Docker
1. Clone the repo
2. Create a `.env` file in the root folder:
```
   GEMINI_API_KEY=your_key_here
```
3. Run:
```
   docker compose up --build
```
4. Open `http://localhost:5173`
