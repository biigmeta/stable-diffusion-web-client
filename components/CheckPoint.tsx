import { initialRequestForm, IRequestForm } from '@/app/page'
import { CheckpointType } from '@/types';
import { httpRequest } from '@/utils/httpRequest';
import React from 'react'

interface CheckPointProps {
    checkpoint: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function CheckPoint({ checkpoint, onChange }: CheckPointProps) {

    const [checkpoints, setCheckpoints] = React.useState<CheckpointType[]>([]);

    const getCheckpoints = async () => {
        try {
            const response = await httpRequest({ method: "GET", endpoint: "/sdapi/v1/sd-models" });
           
            return response as CheckpointType[];

        } catch (error) {
            console.error('Failed to fetch checkpoints:', error);
        }
    }



    React.useEffect(() => {
        /* ----------------------------- get checkpoints ---------------------------- */
        getCheckpoints().then((data) => {
            if (data) {
                setCheckpoints(data);
            }
        }).catch((error) => {
            console.error('Error fetching checkpoints:', error);
        });
    }, []);


    return (
        <>
            <p className="title">Available Checkpoint</p>
            <select className='w-full' value={checkpoint} onChange={onChange}>
                <option value={""} disabled>
                    Select a Checkpoint
                </option>
                {checkpoints.map((checkpoint, index) => (
                    <option key={index} value={checkpoint.title}>
                        {checkpoint.title} 
                    </option>
                ))}
            </select>
        </>
    )
}
