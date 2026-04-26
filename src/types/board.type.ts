import type { BoardMember } from "./board.member.type";
import type { Image } from "./image.type";
import type { List } from "./list.type";
import type { Option } from "./select.type";

export type Board = {
    id: string;
    name: string;
    backgroundUrl: string;
    members?: BoardMember;
    lists?: List[];
    createdAt?: string;
    updatedAt?: string;
}

export type BoardCreateForm = {
    name: string;
    workspace: Option | null;
    background: Image | null;
}