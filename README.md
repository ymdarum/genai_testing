# Full stack Web App Using Nextjs and Flask with mysql db
the guide also available in README.md in frontend folder

## A. Setup FrontEnd - Using Next.js

### 1. Ensure Prerequisites

- **Install Node.js**: Ensure you have the latest stable version of Node.js installed. You can download it from [Node.js](https://nodejs.org).
- **Install npm or Yarn**: These package managers come with Node.js. Verify the installation:
  ```bash
  node -v
  npm -v
  ```
### 2. Set Up Your Next.js Project

Use the following command to create a new Next.js app:

- Using **npm**:
  ```bash
  npx create-next-app@latest my-next-app
  ```
Replace `my-next-app` with your desired project name.

### 3. Navigate to Your Project

Move into the project directory:
```bash
cd my-next-app
```

### 4. Start the Development Server

Run the development server:

- Using **npm**:
  ```bash
  npm run dev
  ```

By default, the server runs on [http://localhost:3000](http://localhost:3000).

## B. Setting Up Back End - using Flask 
the guide also available in README.md in backend folder

### Steps to Create and Activate a Virtual Environment

1. **Navigate to the `backend` Directory**  
   ```bash
   cd backend
   ```

2. **Create the Virtual Environment**  
   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**  
   - On **Windows**:  
     ```bash
     venv\Scripts\activate
     ```
   - On **macOS/Linux**:  
     ```bash
     source venv/bin/activate
     ```

### Running Your Python Application

4. **Run the Python Application**  
   ```bash
   python app.py
   ```
5. **To dexit the environment**  
   ```bash
   deactivate
   ```
