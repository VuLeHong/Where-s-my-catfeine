Coffee Finder ☕ - Next.js & Spring Boot
A coffee shop finder built using Next.js (Frontend) and Spring Boot (Backend).
This project allows users to discover local coffee shops and save their favorites.

🚀 How to Run the Project using Docker
1️⃣ Install Docker
Ensure you have Docker installed on your system. If not, download and install it from:
👉 https://www.docker.com/get-started/

2️⃣ Pull the Docker Images
Run the following commands to pull the frontend and backend images:

sh
Copy
Edit
docker pull lehongvu/catfeine-client:latest
docker pull lehongvu/catfeine-server:latest
3️⃣ Run the Containers
Start the frontend and backend using Docker:

sh
Copy
Edit
docker run -d -p 3000:3000 lehongvu/catfeine-client:latest
docker run -d -p 8080:8080 lehongvu/catfeine-server:latest
4️⃣ Access the Application
Once the containers are running, open your browser and go to:

🔗 Frontend (Next.js):
👉 http://localhost:3000

🔗 Backend (Spring Boot API):
👉 http://localhost:8080 (API Endpoint)

