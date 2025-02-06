"use client";

import React, { useState } from "react";
import {  IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps{
    onSuccessAction: (res:IKUploadResponse) => void
    onProgress?: (progres: number) => void
    fileType?: "image" | "video"
}

export default function FileUpload({
    onSuccessAction,
    onProgress,
    fileType = "image"
}: FileUploadProps) {
  const [uploading,setuploading] = useState(false);
  const [error,setError] = useState<string | null >(null);

  const onError = (err: {message: string}) => {
    console.log("Error", err);
    setError(err.message);
    setuploading(false);
  };
  
  const handleSuccess = (response : IKUploadResponse) => {
    console.log("Success", response);
    setuploading(false);
    setError(null);
    onSuccessAction(response)
  };
  
  const handleProgress = (evt: ProgressEvent) => {
    if(evt.lengthComputable && onProgress){
        const percentComplete = (evt.loaded / evt.total) * 100;
        onProgress(Math.round(percentComplete));
    }
  };
  
  const handleStartUpload = () => {
    setuploading(true);
    setError(null);
  };

  const validateFile = (file: File)=>{
   if(fileType === "video"){ 
    if(file.type.startsWith("video/")){
        setError("please upload a video file");
        return false;
    }
    if(file.size > 100 * 1024 * 1024){
        setError("video must be less than 100 MB")
        return false
    }
   }else{
     const vaildTypes = ["image/jpeg","image/png","image/webp"]
     if(!vaildTypes.includes(file.type)){
         setError("please upload a vaild file (JPEG,PNG,webP)")
         return false
     }
     if(file.size > 5 * 1024 * 1024){
        setError("image must be less than 5 MB")
        return false
    }

   } 
   return false
}

  return (
    <div className="space-y-2">
      
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          accept={fileType === "video"? "video/*":"image/*"}
          className="file-input file-input-bordered w-full"
          folder={fileType === "video"? "/video":"/image"}
          useUniqueFileName={true}
          />
       {
        uploading && (
            <div className="flex items-center gap-2 text-sm text-primary">
                 <Loader2 className="animate-spin" />
                 <span>Uploading....</span>
            </div>
        )
       }
       {
        error && (
            <div className="text-red-600 text-sm">
                {error}
            </div>
        )
       }

    </div>
  );
}