export type AppInfoType = {
    title: string;
    version: string;
    theme: string;
}

export type CheckpointType = {
    title: string;
    model_name: string;
    hash: string;
    sha256: string;
    filename: string;
}

export type ControlnetModelResponseType = {
    model_list: string[];
}

export type ControlnetModuleResponseType = {
    module_list: string[];
}

export type ControlnetArgsType = {
    input_image: string;
    module: string;
    model: string;
    control_weight: number;
}