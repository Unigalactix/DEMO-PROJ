# Enterprise AI Full Stack Demo

A comprehensive "Full Stack with AI" demonstration project using **.NET 8**, **React**, and **Azure AI** (simulated). This project showcases how to build an Enterprise Copilot that can reason over proprietary data (RAG).

## Architecture

-   **Frontend**: React + TypeScript + Vite. Streaming Chat UI with Markdown support.
-   **Backend**: C# .NET 8 Web API.
    -   **Orchestration**: Microsoft Semantic Kernel.
    -   **AI Service**: Mock Service (simulating Azure OpenAI GPT-4o).
    -   **Vector Search**: Mock Service (simulating Azure AI Search).

## Key Features

-   **Streaming Chat**: Real-time token streaming from backend to frontend.
-   **RAG (Retrieval Augmented Generation)**: The "Legal Copilot" retrieves context from simulated contracts (e.g., termination clauses) to answer user questions grounded in "truth".
-   **Mock-First Design**: Runs fully locally without needing active Azure keys for the demo.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Getting Started

1.  **Clone the repository**
2.  **Install Frontend Dependencies**
    ```powershell
    cd Frontend
    npm install
    cd ..
    ```
3.  **Run the Application**
    We have provided a unified startup script.
    ```powershell
    ./dev.ps1
    ```
    This will:
    -   Start the **Backend API** (http://localhost:5222)
    -   Start the **Frontend** (http://localhost:5173)

## Usage Scenarios

### 1. General Chat
Ask distinct questions like "Hello" or "Help me write an email". The Copilot will respond using its general knowledge (simulated).

### 2. RAG (Legal Copilot)
Ask specific questions about the company's contracts to trigger the Retrieval Augmented Generation flow.
-   **Try asking**: *"What is the termination policy?"*
-   **Observation**: The system will retrieve the "Termination Clause" from the Mock Search Service and the Copilot will cite it in the headers.

## License
MIT
