import { ChangeEvent, KeyboardEvent } from "react";

export const handleDraftChange = (setDraftFields: any) => (field: string) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  console.log(`handleDraftChange - field: ${field}, value: ${e.target.value}`);
  setDraftFields((prev: any) => ({
    ...prev,
    [field]: e.target.value,
  }));
};

export const handleDraftKeyDown = (setAgent: any, draftFields: any) => (field: string) => (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  console.log(`handleDraftKeyDown - field: ${field}, value: ${draftFields[field]}`);
  if (e.key === "Enter") {
    e.preventDefault();
    console.log(`handleDraftKeyDown - field: ${field}, value: ${draftFields[field]}`);

    if (field === "imageDescription") {
      setAgent((prev: any) => {
        const newImageOption: ProfileImageOption = {
          generations_by_pk: {
            prompt: draftFields[field],
            generated_images: [],
          },
        };

        return {
          ...prev,
          profile_image_options: prev.profile_image_options?.length
            ? prev.profile_image_options.map((option, index) =>
                index === 0
                  ? {
                      ...option,
                      generations_by_pk: {
                        ...option.generations_by_pk,
                        prompt: draftFields[field],
                      },
                    }
                  : option
              )
            : [newImageOption],
        };
      });
    } else {
      setAgent((prev: any) => ({
        ...prev,
        agent_details: {
          ...prev.agent_details,
          [field]: draftFields[field],
        },
      }));
    }
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