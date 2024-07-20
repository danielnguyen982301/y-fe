'use client';

import React, { useEffect, useState } from 'react';

import apiService from '@/app/lib/apiService';
import { Post, Reply } from '@/app/lib/definitions';
import PostFormModal from '@/app/ui/modal/post-form-modal';

export default function Page({
  params,
}: {
  params: { editTargetType: 'post' | 'reply'; editTargetId: string };
}) {
  const { editTargetType, editTargetId } = params;
  const [editTarget, setEditTarget] = useState<Post | Reply | undefined>(
    undefined,
  );

  useEffect(() => {
    const getEditTarget = async () => {
      try {
        const response = await apiService.get(
          `${
            editTargetType === 'post' ? 'posts' : 'replies'
          }/original/${editTargetId}`,
        );
        setEditTarget(response.data);
      } catch (error) {}
    };
    getEditTarget();
  }, [editTargetType, editTargetId]);
  return (
    <PostFormModal
      editTargetType={editTargetType === 'post' ? 'Post' : 'Reply'}
      editTarget={editTarget}
    />
  );
}
