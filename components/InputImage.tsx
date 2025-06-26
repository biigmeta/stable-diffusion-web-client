import React from 'react'

interface InputImageProps {
    file: File | null;
    previewImage: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCancelFile: () => void;
}

export default function InputImage({ file, previewImage, onChange,onCancelFile }: InputImageProps) {

    const handleCancelFile = () => {
        if (file) {
            // Reset the file input
            const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (inputElement) {
                inputElement.value = '';
            }
        }
        onCancelFile();
    }

    return (
        <>
            <p className="title">Input Image</p>
            <div className='flex flex-col gap-2'>
                <input type="file" accept="image/*" className='border p-2 rounded' onChange={onChange} />
                <div className='relative'>
                    {
                        previewImage ? (
                            <>
                                <img src={previewImage} alt="Preview" className='w-full h-auto rounded' />
                                <button className='absolute top-2 right-2 btn-danger' onClick={handleCancelFile}>Cancel</button>
                            </>
                        ) : (
                            <p className='text-gray-500'>No image selected</p>
                        )}
                </div>
            </div>
        </>
    )
}
