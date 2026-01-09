# Coding Agents Guide

This document provides a concise orientation for agents working on DEMO-PROJ.

## Overview
- **Frontend**: React + TypeScript + Vite. Streaming chat UI renders Markdown.
- **Backend**: .NET 8 Web API using Microsoft Semantic Kernel.
- **AI/Search**: Mock services for Azure OpenAI and Vector Search; real keys optional.

## Repository Structure
- `Frontend/`: Vite app with chat UI.
- `Backend/EnterpriseAI.API/`: ASP.NET Core API (controllers, services).
- `dev.ps1`: Windows startup script that launches backend and frontend.

## Environments
- Frontend reads only variables prefixed with `VITE_`.
  - `Frontend/.env` contains `VITE_API_BASE_URL` and placeholders.
  - Template: `Frontend/.env.template`.
- Backend reads environment variables or `appsettings.*.json`.
  - Keys: `AzureOpenAI__Key`, `AzureOpenAI__Endpoint`, `AzureOpenAI__DeploymentName`, `ConnectionStrings__Default`.
  - Template: `Backend/EnterpriseAI.API/.env.template`.
  - `dev.ps1` loads `Backend/EnterpriseAI.API/.env` if present.

## Run Locally
```powershell
# One-step run
./dev.ps1

# Manual backend
Push-Location "Backend/EnterpriseAI.API"; dotnet run --launch-profile http

# Manual frontend
Push-Location "Frontend"; & "C:\\Program Files\\nodejs\\npm.cmd" install; & "C:\\Program Files\\nodejs\\npm.cmd" run dev
```

## Frontend Chat Flow
- `src/features/chat/useChatStream.ts` posts to `${VITE_API_BASE_URL}/api/chat`.
- Streams raw text chunks to `Chat.tsx`.
- `MarkdownRenderer.tsx` renders Markdown with custom styles.

## Backend Chat Flow
- `ChatController.Post()` accepts `{ message }`, streams `IAsyncEnumerable<string>`.
- `CopilotService.ChatStreamAsync()`:
  - Builds a `ChatHistory` with system prompt and RAG context from `ISearchService`.
  - Streams tokens via `IChatCompletionService` (real or mock).

## Key Files
- Frontend: `src/features/chat/Chat.tsx`, `src/features/chat/useChatStream.ts`, `src/components/MarkdownRenderer.tsx`.
- Backend: `Program.cs`, `Controllers/ChatController.cs`, `Services/CopilotService.cs`, `Services/MockChatCompletionService.cs`, `Services/MockSearchService.cs`.

## API Contract
- POST `/api/chat` `{ message: string }` → streamed text response.
- CORS allows `http://localhost:5173`.

## Streaming Protocol
- Backend yields text tokens; frontend concatenates chunks in state.
- Errors: `useChatStream` adds `[Error: Connection interrupted]` on failure.

## Coding Conventions
- **Frontend**: Strict TS, React hooks, Vite env (`import.meta.env`).
- **Backend**: DI for services, use `IAsyncEnumerable<string>` for streaming.
- Minimal, focused changes; avoid unrelated refactors.

## Branching & PRs
- Prefer feature branches `feature/<short-name>`.
- Commit messages: imperative, concise (e.g., "Add env template for backend").
- Open PR against `main`; include summary and testing notes.

## Troubleshooting
- If `npm` resolves to `C:\\WINDOWS\\npm`, use `C:\\Program Files\\nodejs\\npm.cmd`.
- Port conflicts: free 5222 via `Get-NetTCPConnection` and `Stop-Process`.

## Mermaid Workflow
```mermaid
graph TD
  U[User] -->|POST message| FE[Frontend]
  FE --> API[/api/chat]
  API --> CTRL[ChatController]
  CTRL --> COP[CopilotService]
  COP --> SRCH[MockSearchService]
  COP --> LLM[ChatCompletion Service]
  LLM --> COP
  SRCH --> COP
  COP -->|stream tokens| API
  API --> FE
  FE --> MD[MarkdownRenderer]
```
