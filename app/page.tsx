'use client'
import AppInfo from "@/components/AppInfo";
import CheckPoint from "@/components/CheckPoint";
import ControlnetModel from "@/components/ControlnetModel";
import ControlnetModule from "@/components/ControlnetModule";
import ImageSize from "@/components/ImageSize";
import InputImage from "@/components/InputImage";
import Prompt from "@/components/Prompt";
import { CheckpointType, ControlnetModelResponseType, ControlnetArgsType } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { toBase64 } from "@/utils/image";
import { validatePrompt } from "@/utils/validate";
import React from "react";

export interface IRequestForm {
  refiner_checkpoint: string;
  prompt: string;
  negative_prompt?: string;
  sampler_name?: string;
  batch_size?: number;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  alwayson_scripts?: {
    controlnet?: {
      args: ControlnetArgsType[];
    };
  };
}

export const initialRequestForm: IRequestForm = {
  refiner_checkpoint: "",
  prompt: "",
  negative_prompt: "",
  sampler_name: "DPM++ 2M Karras",
  steps: 20,
  cfg_scale: 7.5,
  batch_size: 1,
  alwayson_scripts: {
    controlnet: {
      args: [],
    },
  },
}


export default function Home() {

  const [requestForm, setRequestForm] = React.useState<IRequestForm>(initialRequestForm);

  const [checkpoint, setCheckpoint] = React.useState<string>("");
  const [controlnetModule, setControlnetModule] = React.useState<string>("");
  const [controlnetModel, setControlnetModel] = React.useState<string>("");
  const [width, setWidth] = React.useState<number>(512);
  const [height, setHeight] = React.useState<number>(512);
  const [prompt, setPrompt] = React.useState<string>("");
  const [negativePrompt, setNegativePrompt] = React.useState<string>("");
  const [isProsessing, setIsProcessing] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const [image, setImage] = React.useState<string>("");

  const getCheckpoints = async () => {
    try {
      const response = await httpRequest({ method: "GET", endpoint: "/sdapi/v1/sd-models" });
      return response as CheckpointType[];

    } catch (error) {
      console.error('Failed to fetch checkpoints:', error);
    }
  }

  const getControlnetModels = async () => {
    try {
      const response = await httpRequest({ method: "GET", endpoint: "/controlnet/model_list" });
      const { model_list } = response as ControlnetModelResponseType;
      return model_list as string[];

    } catch (error) {
      console.error('Failed to fetch extensions:', error);
    }
  }

  const handleSelectCheckpointChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCheckpoint(value);
  }

  const handleSelectControlnetModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setControlnetModule(value);
  }

  const handleSelectControlnetModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setControlnetModel(value);
  }

  const handleChangeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setWidth(value);
    }
  }

  const handleChangeHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setHeight(value);
    }
  }

  const handleChangePrompt = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setPrompt(value);
  }

  const handleChangeNegativePrompt = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNegativePrompt(value);
  }

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewImage(null);
    }
  }

  const handleCancelFile = () => {
    setFile(null);
    setPreviewImage(null);
  }

  const generateImage = async () => {

    if (isProsessing) {
      console.warn("Image generation is already in progress.");
      return;
    }

    if (!validatePrompt({ checkpoint, prompt, height, width, controlnet_model: controlnetModel, controlnet_module: controlnetModule })) {
      console.error("Invalid prompt or parameters");
      return;
    }

    setIsProcessing(true);
    setImage("");

    let base64Image = "" as string;

    if (file) {
      base64Image = await toBase64(file) as string;
    }

    const requestBody: any = {
      ...initialRequestForm,
      styles: [
        "string"
      ],
      infotext: "string",
      width: width,
      height: height,
      refiner_checkpoint: checkpoint,
      prompt,
      negative_prompt: negativePrompt,
      alwayson_scripts: {
        controlnet: {
          args: [
            {
              input_image: base64Image,
              module: controlnetModule,
              model: controlnetModel,
              control_weight: 0.5,
            },
          ],
        },
      },
    };

    console.log('Request body:', requestBody);

    try {
      const response = await httpRequest({
        method: "POST",
        endpoint: "/sdapi/v1/txt2img",
        body: requestBody,
      });

      console.log('Image generation response:', response);

      if (response && response.images && response.images.length > 0) {
        setImage(`data:image/png;base64,${response.images[0]}`);
      }

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="container m-auto shadow bg-white p-4 flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-center">Stable Diffusion App</h1>
      <p className="text-center">This is a simple example of a Next.js application with a Stable Diffusion interface.</p>
      <div>
        <AppInfo />
      </div>
      <div className="w-full grid grid-cols-4 gap-4 bg-gray-100 p-4 shadow rounded">
        <div className="bg-white rounded shadow p-4">
          <CheckPoint checkpoint={checkpoint} onChange={handleSelectCheckpointChange} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <ControlnetModule controlnetModule={controlnetModule} onChange={handleSelectControlnetModuleChange} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <ControlnetModel controlnetModel={controlnetModel} onChange={handleSelectControlnetModelChange} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <ImageSize width={width} height={height} onWidthChange={handleChangeWidth} onHeightChange={handleChangeHeight} />
        </div>
        <div className="bg-white rounded shadow p-4 col-span-2">
          <Prompt prompt={prompt} negativePrompt={negativePrompt} onChangePrompt={handleChangePrompt} onChangeNegativePrompt={handleChangeNegativePrompt} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <InputImage file={file} previewImage={previewImage} onChange={handleChangeFile} onCancelFile={handleCancelFile} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="flex flex-col justify-around h-full gap-2">
            <button
              className="btn h-full"
              disabled={isProsessing || !validatePrompt({ checkpoint: checkpoint, prompt, height, width, controlnet_model: controlnetModel, controlnet_module: controlnetModule })}
              onClick={generateImage}
            >
              Generate
            </button>
            <button className="btn-danger">Stop</button>
            <button className="btn-secondary">Reset</button>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-4 gap-4 bg-gray-100 p-4 shadow rounded">
        <div className='col-span-1 bg-white flex flex-col gap-2 p-4 shadow rounded'>
          {
            image ? (
              <img src={image} alt="Generated" className="w-full h-auto rounded shadow" />
            ) : (
              <p className="text-center text-gray-500">No image generated yet.</p>
            )
          }
        </div>
      </div>
    </div>
  );
}
