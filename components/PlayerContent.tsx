"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import Slider from "./Slider";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1] || player.ids[player.ids.length - 1];
    player.setId(previousSong);
  };

  const onPlayNext = () => {
    if (player.ids.length === 0) return;
    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1] || player.ids[0];
    player.setId(nextSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    if (sound) {
      sound.play();
      setDuration(sound.duration() || 0);
    }
    return () => {
      sound?.unload();
    };
  }, [sound]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setProgress(sound.seek() || 0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [sound]);

  const handlePlay = () => (isPlaying ? pause() : play());

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div className="hidden h-full md:flex flex-col justify-center items-center w-full max-w-[722px] gap-y-2">
        {/* Phần nút điều khiển */}
        <div className="flex items-center gap-x-6">
          <AiFillStepBackward onClick={onPlayPrevious} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
          <div onClick={handlePlay} className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer">
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward onClick={onPlayNext} size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" />
        </div>

        {/* Thanh hiển thị thời gian phát */}
        <div className="w-full flex items-center gap-x-2">
          <span className="text-sm text-neutral-400">{Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, "0")}</span>
          <div onClick={(e) => {
            if (!sound || duration === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            sound.seek(newTime);
            setProgress(newTime);
          }} className="relative w-full h-1 bg-neutral-600 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
              style={{ width: `${(progress / duration) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-neutral-400">{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon size={34} onClick={toggleMute} className="cursor-pointer" />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
