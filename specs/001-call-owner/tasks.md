# Tasks: Call Owner Voice Feature

**Input**: Design documents from `specs/001-call-owner/`

**Prerequisites**: spec.md required

**Tests**: No test tasks (not explicitly requested in spec)

**Organization**: Tasks grouped by user story to enable independent implementation.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and core call signaling infrastructure

- [X] T001 Add `libopus-wasm` dependency to package.json for WASM Opus encoding
- [X] T002 Create src/utils/callClient.ts with WebSocket management and state machine

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create src/lib/OpusStream.ts with WASM Opus encoder/decoder wrapper class

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Voice Call Initiation (Priority: P1) 🎯 MVP

**Goal**: Website visitor can initiate voice call to owner through WebSocket with UI feedback

**Independent Test**: Call button triggers WebSocket connection and status updates; can be tested with mocked WebSocket server

### Implementation for User Story 1

- [X] T004 [US1] Integrate Call UI into ContactScreen.svelte (button, status display, mute/end buttons)
- [X] T005 [US1] Add microphone permission check with error message display
- [X] T006 [US1] Connect ContactScreen to callClient websocket for call_request/call_ended messages
- [X] T007 [US1] Implement 30-second call timeout with "No answer" status

---

## Phase 4: User Story 2 - Permission Error Handling (Priority: P2)

**Goal**: When microphone permission is denied, user sees error and guidance to use message form

**Independent Test**: Can be tested by simulating permission denial in browser dev tools.

### Implementation for User Story 2

- [X] T008 [US2] Add permission error detection in callClient.ts
- [X] T009 [US2] Display user-friendly error message: "Microphone access required for calls. Use the message form instead."
- [X] T010 [US2] Guidance provided via integrated message form in ContactScreen

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T011 Documentation: Update README.md with Call feature description

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion

## Completion Summary

✅ **Completed tasks**: 11/11

**Full Implementation**: Call signaling + audio streaming via libopus-wasm (48kHz, mono, 96kbps, 20ms frames)