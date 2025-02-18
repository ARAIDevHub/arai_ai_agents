import { ChangeEvent, KeyboardEvent } from "react";

export const handleDraftChange = (setDraftFields: any) => (field: string) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  setDraftFields((prev: any) => ({
    ...prev,
    [field]: e.target.value,
  }));
};

export const handleDraftKeyDown = (setAgent: any, draftFields: any) => (field: string) => (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    setAgent((prev: any) => ({
      ...prev,
      agent_details: {
        ...prev.agent_details,
        [field]: draftFields[field],
      },
    }));
  }
};

export const handleTraitDraftChange = (setDraftTraits: any) => (field: string) => (e: ChangeEvent<HTMLTextAreaElement>) => {
  setDraftTraits((prev: any) => ({
    ...prev,
    [field]: e.target.value,
  }));
};

export const handleTraitDraftKeyDown = (setAgent: any, draftTraits: any) => (field: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const separator = field === "emojis" ? " " : ",";
    const arrayValue = draftTraits[field]
      .split(separator)
      .map((item: string) => item.trim())
      .filter(Boolean);

    setAgent((prev: any) => ({
      ...prev,
      agent_details: {
        ...prev.agent_details,
        [field]: arrayValue,
      },
    }));
  }
};

// Other utility functions... 