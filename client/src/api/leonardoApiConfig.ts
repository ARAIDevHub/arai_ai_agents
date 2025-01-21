export const defaultGenerationConfig = {
  presetStyle: "DYNAMIC",
  scheduler: "LEONARDO",
  sd_version: "SDXL_LIGHTNING",
  contrast: 1.3,
  width: 512,
  height: 512,
  alchemy: true,
  enhancePrompt: false,
  nsfw: true,
  public: false,
} as const;

export const consistentGenerationConfig = {
  ...defaultGenerationConfig,
  num_inference_steps: 10,
  guidance_scale: 7,
} as const; 