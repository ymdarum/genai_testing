# Web App Using Nextjs and Flask (mysql db and Ollama llama3.2)
- This repo demonstrate an application to test the ability to test and evaluate LLM response.
- Some of the evaluations metrices icludes:
  - Calculate relevancy score using TF-IDF and cosine similarity
  - Calculate accuracy score using metric such s levenshtein distance
  - Calculate BLEU score
  - Calculate BERT score between expected and actual outputs
## Pre-requisite to run:
- as all the result will be push to db, this require mysql db need to be installed and run before running the application
  
## A. Using Ollama with Llama 3.2

This guide provides step-by-step instructions to set up and use the Ollama CLI with the Llama 3.2 model.
### Prerequisites

- Ensure your system meets the requirements to run Ollama CLI.
- A stable internet connection is required to download the model.

### Step 1: Install Ollama
Follow these steps to install the Ollama CLI:

1. Visit the official Ollama website: [https://ollama.com](https://ollama.com)
2. Download the appropriate installer for your operating system.
3. Follow the installation instructions provided for your OS.

Alternatively, install Ollama via a package manager (if supported).

### Step 2: Verify Installation
Once installed, verify that Ollama is set up correctly by checking the version:

```bash
ollama --version
```

If the version is displayed, Ollama is successfully installed.

### Step 3: Pull the Llama 3.2 Model
Before you can use Llama 3.2, download the model by running:

```bash
ollama pull llama3.2
```

This will fetch the Llama 3.2 model to your local system.

### Step 4: Start the Ollama Server
To interact with the model, start the Ollama server:

```bash
ollama serve
```

The server must be running for queries to work.

### Step 5: Query the Llama 3.2 Model
With the server running, you can send queries to Llama 3.2. For example:

```bash
ollama query "Your prompt here"
```

Replace `"Your prompt here"` with your desired input to interact with the model.

### Troubleshooting
- If the `ollama` command is not recognized, ensure the CLI is installed and added to your system's PATH.
- Ensure the Ollama server is running (`ollama serve`) before sending queries.

- For further assistance, visit the [Ollama Documentation](https://ollama.com/docs).
---

## B. Setup FrontEnd - Using Next.js
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

- By default, the server runs on [http://localhost:3000](http://localhost:3000).
---
## C. Setting Up Back End - using Flask 

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
6. **To exit the environment**  
   ```bash
   deactivate
   ```
