import React, { createContext, useState, useContext } from 'react';
import { initialBoardData } from '../data/mockCommunityData';

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const [boardData, setBoardData] = useState(initialBoardData);
  const [likedItems, setLikedItems] = useState([]);

  const createPost = (boardKey, newPostData) => {
    setBoardData(prevData => {
        const targetPosts = prevData[boardKey].posts;
        const maxId = targetPosts.reduce((max, post) => (post.id > max ? post.id : max), 0);
        const newPost = {
          id: maxId + 1,
          author: '익명',
          createdAt: new Date().toISOString().split('T')[0],
          views: 0,
          likes: 0,
          ...newPostData,
          comments: [],
        };
        return {
          ...prevData,
          [boardKey]: { ...prevData[boardKey], posts: [...targetPosts, newPost] },
        };
      });
    };
  const addComment = (boardKey, postId, commentContent) => {
    const newComment = {
        id: Date.now(),
        author: '댓글러',
        content: commentContent,
        createdAt: new Date().toLocaleDateString(),
        likes: 0,
      };
      setBoardData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        const targetBoard = newData[boardKey];
        const allPosts = [...targetBoard.notices, ...targetBoard.posts];
        const targetPost = allPosts.find(p => String(p.id) === String(postId));
        if (targetPost) {
          targetPost.comments.push(newComment);
        }
        return newData;
      });
    };
    const toggleLike = (itemId) => {
        const isLiked = likedItems.includes(itemId);
        setLikedItems(prev => isLiked ? prev.filter(id => id !== itemId) : [...prev, itemId]);
        return !isLiked; // '좋아요' 상태가 되었는지 여부 반환
      };
    
      const likePost = (boardKey, postId) => {
        const shouldLike = toggleLike(postId);
        setBoardData(prevData => {
          const newData = JSON.parse(JSON.stringify(prevData));
          const board = newData[boardKey];
          const allPosts = [...board.notices, ...board.posts];
          const targetPost = allPosts.find(p => String(p.id) === String(postId));
          if (targetPost) {
            targetPost.likes += (shouldLike ? 1 : -1);
          }
          return newData;
        });
      };
    
      const likeComment = (boardKey, postId, commentId) => {
        const shouldLike = toggleLike(commentId);
        setBoardData(prevData => {
          const newData = JSON.parse(JSON.stringify(prevData));
          const board = newData[boardKey];
          const allPosts = [...board.notices, ...board.posts];
          const targetPost = allPosts.find(p => String(p.id) === String(postId));
          if (targetPost && targetPost.comments) {
            const targetComment = targetPost.comments.find(c => String(c.id) === String(commentId));
            if (targetComment) {
              targetComment.likes += (shouldLike ? 1 : -1);
            }
          }
          return newData;
        });
      };

  const value = {
    boardData,
    likedItems, // '좋아요' 상태 추가
    actions: {
      createPost,
      addComment,
      likePost,
      likeComment,
    },
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export const useCommunity = () => useContext(CommunityContext);