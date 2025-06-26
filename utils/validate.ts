export type RequiredPromptType = {
    prompt: string;
    width: number;
    height: number;
    checkpoint: string;
    controlnet_module: string;
    controlnet_model: string;
}


export const validatePrompt = ({ prompt, width, height, checkpoint, controlnet_module, controlnet_model }: RequiredPromptType): boolean => {
    if (!prompt || prompt.trim() === "") {
        // alert("Prompt is required.");
        return false;
    }

    if (width < 100 || width > 1280 || height < 100 || height > 1280) {
        // alert("Image size must be between 100 and 1280.");
        return false;
    }

    if (!checkpoint || checkpoint.trim() === "") {
        // alert("Checkpoint is required.");
        return false;
    }

    if (controlnet_module && (!controlnet_model || controlnet_model.trim() === "")) {
        // alert("Controlnet model is required.");
        return false;
    }

    return true;
}