/*
"use client";

import { apiClient } from "@/lib/api-client";
import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";

export default function Home() {
  const [videos, setvideos] = useState<IVideo[]>([]);

  useEffect(()=>{
    const fetchVideo = async ()=> {
      try {
        const data = await apiClient.getVideos();
        setvideos(data);
      } catch (error) {
        console.error("error in fetching videos")
      }
    }
    fetchVideo();
  },[])
  return (
    <div className="bg-black text-white">
      <VideoFeed videos={videos}  />
    </div>
  );
}
 

*/
"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit ReelsPro</h1>
      <VideoFeed videos={videos} />
    </main>
  );
}
