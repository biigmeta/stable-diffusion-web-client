import React from 'react'
interface ImageSizeProps {
    width: number;
    height: number;
    onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageSize({ width, height, onWidthChange, onHeightChange }: ImageSizeProps) {
    return (
        <>
            <p className="title">Image Size</p>
            <div className='flex flex-row gap-4'>
                <div className='flex gap-2 items-center'>
                    <label htmlFor="">Width</label>
                    <input type="number" min={100} max={1280} value={width} onChange={onWidthChange} />
                </div>
                <div className='flex gap-2 items-center'>
                    <label htmlFor="">Height</label>
                    <input type="number" min={100} max={1280} value={height} onChange={onHeightChange} />
                </div>

            </div>
        </>
    )
}
