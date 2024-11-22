# Full stack Web App Using Nextjs and Flask with mysql db
- the mysql db need to be installed and run before running the application
- this app also uses the local ollama model which is llama3.2 and running

## A. Setup FrontEnd - Using Next.js

### 1. Ensure Prerequisites

- **Install Node.js**: Ensure you have the latest stable version of Node.js installed. You can download it from [Node.js](https://nodejs.org).
- **Install npm or Yarn**: These package managers come with Node.js. Verify the installation:
  ```bash
  node -v
  npm -v
  ```
### 2. Navigate to Your Project

Move into the project directory:
```bash
cd frontend
```
### 3. Set Up Your Next.js Project

Use the following command to create a new Next.js app:

- Using **npm**:
  ```bash
  npm install
  ```
Replace `my-next-app` with your desired project name.

### 4. Start the Development Server

Run the development server:

- Using **npm**:
  ```bash
  npm run dev
  ```

By default, the server runs on [http://localhost:3000](http://localhost:3000).

## B. Setting Up Back End - using Flask 

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
4. **Run pip command to install packages**
    - This will take some time to finish
   ```bash
   pip install-r requirements.txt
   ```
### Running Your Python Application

5. **Run the Python Application**  
   ```bash
   python app.py
   ```
6. **To dexit the environment**  
   ```bash
   deactivate
   ```
