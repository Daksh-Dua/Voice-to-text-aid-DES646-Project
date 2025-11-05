import type { Session } from "@/types";

// In-memory storage for demo - replace with database in production
let sessions: Session[] = [];

export function getSessions(): Session[] {
  return sessions;
}

export function getSessionById(id: string): Session | undefined {
  return sessions.find((s) => s.id === id);
}

export function addSession(session: Session): void {
  sessions.push(session);
}

export function updateSession(id: string, updates: Partial<Session>): void {
  const index = sessions.findIndex((s) => s.id === id);
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
  }
}

export function deleteSession(id: string): void {
  sessions = sessions.filter((s) => s.id !== id);
}
