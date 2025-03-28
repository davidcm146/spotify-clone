"use client";

import { useState } from 'react'
import Modal from './Modal'
import useUploadModal from '@/hooks/useUploadModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import uniqid from 'uniqid';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  });
  const onChange = (open: boolean) => {
    if (!open){
      reset();
      uploadModal.onClose();
    }
  }

  const formatSongTitle = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]/g, "");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // Upload songs to supabase
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      const uniqueID = uniqid();
      
      const { data: songData, error: songError } = await supabaseClient.storage.from('songs').upload(`song-${formatSongTitle(values.title)}-${uniqueID}`, songFile, { cacheControl: '3600', upsert: false });
      if (songError) {
        setIsLoading(false);
        return toast.error(songError.message);
      }
      const { data: imageData, error: imageError } = await supabaseClient.storage.from('images').upload(`image-${formatSongTitle(values.title)}-${uniqueID}`, imageFile, { cacheControl: '3600', upsert: false });
      if (imageError) {
        setIsLoading(false);
        return toast.error('Failed to upload image');
      }

      const { error: supabaseError } = await supabaseClient.from('songs').insert({user_id: user.id, title: values.title, author: values.author, song_path: songData.path, image_path: imageData.path});

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }
      router.refresh();
      setIsLoading(false);
      toast.success('Song uploaded!');
      reset();
      uploadModal.onClose();
    } catch(error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal title='Add a song' description='Upload a song to your library' isOpen={uploadModal.isOpen} onChange={onChange}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
        <Input id='title' disabled={isLoading} {...register('title', { required: true })} placeholder="Song title" />
        <Input id='author' disabled={isLoading} {...register('author', { required: true })} placeholder="Song author" />
        <div className="">
          <div className="pb-1">
            Select a song file
          </div>
          <Input className='cursor-pointer' id='song' type='file' disabled={isLoading} {...register('song', { required: true })} accept='.mp3' />
        </div>
        <div className="">
          <div className="pb-1">
            Select an image
          </div>
          <Input className='cursor-pointer' id='image' type='file' disabled={isLoading} {...register('image', { required: true })} accept='image/*' />
        </div>
        <Button disabled={isLoading} type='submit'>
          Create
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal