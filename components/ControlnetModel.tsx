import { ControlnetModelResponseType } from '@/types';
import { httpRequest } from '@/utils/httpRequest';
import React from 'react';

interface ControlnetModelProps {
    controlnetModel: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ControlnetModel({ controlnetModel, onChange }: ControlnetModelProps) {

    const [controlnetModels, setControlnetModels] = React.useState<string[]>([]);

    const getControlnetModels = async () => {
        try {
            const response = await httpRequest({ method: "GET", endpoint: "/controlnet/model_list" });
            const { model_list } = response as ControlnetModelResponseType;
            return model_list as string[];
        } catch (error) {
            console.error('Failed to fetch controlnet models:', error);
        }
    }

    React.useEffect(() => {
        /* ----------------------------- get controlnet models ---------------------------- */
        getControlnetModels().then((data) => {
            if (data) {
                setControlnetModels(data);
            }
        }).catch((error) => {
            console.error('Error fetching controlnet models:', error);
        });
    }, []);


    return (
        <>
            <p className="title">Available Controlnet Models</p>
            <select className='w-full' value={controlnetModel} onChange={onChange}>
                <option value={""} disabled>
                    Select a Controlnet Model
                </option>
                {controlnetModels.map((model, index) => (
                    <option key={index} value={model}>
                        {model}
                    </option>
                ))}
            </select>
        </>
    )
}
