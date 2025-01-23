# Coffee Finder ☕ - Next.js & Spring Boot  

A coffee shop finder built using **Next.js** (Frontend) and **Spring Boot** (Backend). This project allows users to discover local coffee shops and save their favorites.

---

## 🚀 How to Run the Project using Docker  

### 1️⃣ Install Docker  
Ensure you have Docker installed on your system. If not, download and install it from:  
👉 [Get Started with Docker](https://www.docker.com/get-started/)  

### 2️⃣ Pull the Docker Images  
Run the following commands to pull the frontend and backend images:

```sh
docker pull lehongvu/catfeine-client:latest  
docker pull lehongvu/catfeine-server:latest  
```

### 3️⃣ Run the Containers  
Start the frontend and backend using Docker:

```sh
docker run -d -p 3000:3000 lehongvu/catfeine-client:latest  
docker run -d -p 8080:8080 lehongvu/catfeine-server:latest  
```

### 4️⃣ Access the Application  
Once the containers are running, open your browser and go to:

🔗 **Frontend (Next.js):**  
👉 [http://localhost:3000](http://localhost:3000)  

🔗 **Backend (Spring Boot API):**  
👉 [http://localhost:8080](http://localhost:8080)  

---

## 🔧 Technologies Used  

- **Frontend:** Next.js, React.js, Tailwind CSS  
- **Backend:** Spring Boot, Java, PostgreSQL, JPA, OAuth2 Authentication  
- **Database:** PostgreSQL  
- **Deployment:** Docker, Docker Compose  
- **Maps API:** Google Maps API  

---

## ✨ Features  

- Discover nearby coffee shops using Google Maps API  
- User authentication with OAuth2  
- Save favorite coffee shops  
- Write and read reviews  

