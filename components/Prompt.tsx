import React from 'react'

interface PromptProps {
    prompt: string;
    negativePrompt: string;
    onChangePrompt: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onChangeNegativePrompt: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Prompt({ prompt, negativePrompt, onChangePrompt, onChangeNegativePrompt }: PromptProps) {
    return (
        <>
            <p className="title">Prompt</p>
            <textarea
                className="w-full p-2 border rounded"
                value={prompt}
                onChange={onChangePrompt}
                placeholder="Enter your prompt here..."
            />
            <p className="title mt-4">Negative Prompt</p>
            <textarea
                className="w-full p-2 border rounded"
                value={negativePrompt}
                onChange={onChangeNegativePrompt}
                placeholder="Enter your negative prompt here..."
            />

        </>
    )
}
