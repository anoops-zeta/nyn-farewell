import peopleData from "@/data/people.json";
import configData from "@/data/config.json";
import nynThreadData from "@/data/nyn-thread.json";
import type { AppConfig, ChatFilter, Person, SharedItem, ThreadNode } from "@/types";

export const people = peopleData as Person[];
export const config = configData as AppConfig;

const nynThread = nynThreadData as {
  pinnedMessage?: Person["pinnedMessage"];
  thread: ThreadNode[];
};

export function nynPerson(): Person {
  return {
    id: config.nyn.id,
    name: config.nyn.displayName,
    title: config.nyn.title,
    avatar: config.nyn.avatar,
    initialsColor: config.nyn.initialsColor,
    kind: "person",
    presence: config.nyn.presence,
    section: "favourites",
    order: 0,
    unread: false,
    pinnedMessage: nynThread.pinnedMessage ?? null,
    thread: nynThread.thread,
  };
}

export function studioPerson(): Person {
  return {
    id: config.studio.id,
    name: config.studio.name,
    title: "Team",
    initialsColor: config.studio.initialsColor,
    kind: "group",
    presence: null,
    section: "favourites",
    order: 1,
    unread: false,
    thread: [],
  };
}

export function favouritePeople(): Person[] {
  const fromData = people.filter((p) => p.section === "favourites").sort((a, b) => a.order - b.order);
  return [nynPerson(), ...fromData];
}

export function chatPeople(): Person[] {
  return people
    .filter((p) => p.section !== "favourites")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function allPeople(): Person[] {
  return [...favouritePeople(), ...chatPeople()];
}

export function getPerson(id: string): Person | undefined {
  return allPeople().find((p) => p.id === id) ?? people.find((p) => p.id === id);
}

export function matchesFilter(person: Person, filter: ChatFilter): boolean {
  if (filter === "all") return true;
  if (filter === "unread") return person.unread;
  if (filter === "channels") return person.kind === "group";
  if (filter === "chats") return person.kind === "person";
  return true;
}

export function collectShared(person: Person): SharedItem[] {
  const items: SharedItem[] = [];
  person.thread.forEach((node, messageIndex) => {
    if (node.type !== "message") return;
    for (const block of node.blocks) {
      if (block.kind === "image" || block.kind === "video" || block.kind === "file") {
        items.push({ personId: person.id, messageIndex, block });
      }
    }
  });
  return items;
}
