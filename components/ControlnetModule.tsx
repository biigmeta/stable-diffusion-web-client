import { ControlnetModuleResponseType } from '@/types';
import { httpRequest } from '@/utils/httpRequest';
import React from 'react';

interface ControlnetModuleProps {
    controlnetModule: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function ControlnetModule({ controlnetModule, onChange }: ControlnetModuleProps) {

    const [controlnetModules, setControlnetModules] = React.useState<string[]>([]);

    const getControlnetModules = async () => {
        try {
            const response = await httpRequest({ method: "GET", endpoint: "/controlnet/module_list" });
            const { module_list } = response as ControlnetModuleResponseType;
            return module_list as string[];
        } catch (error) {
            console.error('Failed to fetch controlnet modules:', error);
        }
    }

    React.useEffect(() => {
        /* ----------------------------- get controlnet modules ---------------------------- */
        getControlnetModules().then((data) => {
            if (data) {
                setControlnetModules(data);
            }
        }).catch((error) => {
            console.error('Error fetching controlnet modules:', error);
        });
    }, []);


    return (
        <>
            <p className="title">Available Controlnet Modules</p>
            <select className='w-full' value={controlnetModule} onChange={onChange}>
                <option value={""} disabled>
                    Select a Controlnet Module
                </option>
                {controlnetModules.map((module, index) => (
                    <option key={index} value={module}>
                        {module}
                    </option>
                ))}
            </select>
        </>
    )
}
