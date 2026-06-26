# Feature Specification: Call Owner Voice Feature

**Feature Branch**: `001-call-owner` | **Date**: 2026-06-24 | **Status**: Draft

**Input**: Add real-time voice calling capability from website to owner via Android app using WebSockets and WASM Opus encoding.

## User Scenarios & Testing

### User Story 1 - Website Visitor Initiates Voice Call (Priority: P1)

A website visitor wants to speak directly with the founder/owner in real-time. They navigate to the Contact screen, click the "Call Stellarium" section, and press the "Call Owner" button to initiate a voice call.

**Why this priority**: This is the primary feature enabling direct voice communication with the owner, the core value proposition.

**Independent Test**: Can be tested by simulating WebSocket server responses and mocking microphone access; call state transitions can be verified without a real Android app.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Contact screen, **When** they click "Call Owner", **Then** the status shows "Calling..." and a WebSocket connection is established to the server.
2. **Given** the call is ringing (owner notified), **When** the owner accepts within 30 seconds, **Then** the status changes to "In Call" and audio streaming begins.
3. **Given** the call setup, **When** 30 seconds pass without owner acceptance, **Then** the call shows "No answer" and returns to idle state.
4. **Given** a call is in progress, **When** either party ends the call, **Then** the connection closes cleanly and status shows "Call Ended".
5. **Given** a call is in progress, **When** the visitor clicks the mute button, **Then** audio capture stops but call continues.

### User Story 2 - Microphone Permission Denied (Priority: P2)

When a visitor denies microphone permission or the browser blocks access, they should see an error message and be directed to use the existing message form instead.

**Why this priority**: Ensures proper error handling for privacy-conscious users.

**Independent Test**: Can be tested by simulating permission denial in browser dev tools.

**Acceptance Scenarios**:

1. **Given** a visitor clicks "Call Owner", **When** microphone permission is denied, **Then** an error message displays: "Microphone access required for calls. Use the message form instead."

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow visitors to initiate voice calls to the owner via a WebSocket connection.
- **FR-002**: System MUST capture microphone audio and encode it to Opus format (96 kbps, 48 kHz, mono) using WASM Opus encoder, sending 20ms frames (960 samples).
- **FR-003**: System MUST decode incoming Opus audio packets and play them through the browser's audio output with a 3-frame jitter buffer minimum.
- **FR-004**: System MUST display specific status messages: "Idle" (button visible), "Calling..." (spinner shown), "Ringing..." (waiting for answer), "In Call" (audio active), "Call Ended" (final state), "No answer" (timeout reached).
- **FR-005**: System MUST provide a mute/unmute toggle button during active calls that stops capture without ending call.
- **FR-006**: System MUST provide a "Call failed - offline" error when `call_failed` received with reason "offline".
- **FR-007**: System MUST provide a "Call rejected" error when `call_failed` received with reason "rejected".
- **FR-008**: System MUST implement 30-second timeout for call answer; show "No answer" if expired.
- **FR-009**: System MUST handle microphone permission denial with user-friendly error message.

### Non-Functional Requirements

- **NFR-001**: Audio end-to-end latency SHALL be below 200ms measured as time from microphone capture to speaker playback.
- **NFR-002**: The system MUST attempt WebSocket reconnection with exponential backoff (1s, 2s, 4s max) during idle state.

## Key Entities

- **Call Session**: Represents an active voice call between caller and owner, including WebSocket connection, audio streams, and call state.

## Success Criteria

- **SC-001**: Visitors can initiate a call and hear audio within 3 seconds of connection answer.
- **SC-002**: Call setup success rate is above 95% under normal network conditions.
- **SC-003**: Audio remains intelligible with clear voice transmission at 96 kbps mono Opus encoding.
- **SC-004**: Microphone permission denial shows clear error message with alternative contact guidance.

## Assumptions

- The Android app in `StellariumCaller` handles its own WebSocket registration and call acceptance signaling.
- Server WebSocket endpoint at `/ws` is available and handles binary message relay.
- The `opus-codec` WASM package will be added as a dependency for browser-side Opus encoding.
- Current WebSocket infrastructure does not exist and needs to be created.
- Owner registration via Android sends `{ type: "register", role: "owner" }` message.