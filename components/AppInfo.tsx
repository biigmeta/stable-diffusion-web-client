import { AppInfoType } from '@/types';
import { httpRequest } from '@/utils/httpRequest';
import React from 'react'

export default function AppInfo() {


    const [appInfo, setAppInfo] = React.useState<AppInfoType>({
        title: "Stable Diffusion App",
        version: "1.0.0",
        theme: "default"
    });

    const getAppInfo = async () => {
        try {
            const response = await httpRequest({ method: "GET", endpoint: "/config" });
            return response as AppInfoType;

        } catch (error) {
            console.error('Failed to fetch checkpoints:', error);
        }
    }

    React.useEffect(() => {
        /* ------------------------------- get configs ------------------------------ */
        getAppInfo().then((data) => {
            if (data) {
                setAppInfo(data);
            }
        }).catch((error) => {
            console.error('Error fetching config:', error);
        });

    }, []);

    return (
        <div className='w-full flex justify-between items-center'>
            <div className='text-sm'>App: {appInfo.title}</div>
            <div className='text-sm'>Version: {appInfo.version}</div>
        </div>
    )
}
