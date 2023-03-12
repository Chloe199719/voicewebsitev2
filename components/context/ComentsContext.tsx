"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useMemo, useRef, useState } from "react";
import { useStore } from "../useStore";
type Props = {
  children: any;
  postID: string;
};

export function useComment() {
  return useContext(Context);
}

interface context {
  post: React.Dispatch<React.SetStateAction<string | undefined>>;
}
/* @ts-expect-error */
const Context = React.createContext();
function CommentProvider({ children, postID }: Props) {
  const store = useStore();
  const stateRef = useRef<string>();
  stateRef.current = store.sort;

  const fetchComments = async function (sort: string) {
    try {
      const data = await axios.get(
        `/api/posts/fetchComments/?post=${postID}&&sort=${sort}`
      );

      return data.data.data;
    } catch (error: any) {
      return error.message;
    }
  };
  const fetchUserID = async function () {
    try {
      const data = await axios.get(`/api/user/getUser`);

      return data.data;
    } catch (error: any) {
      return `no User`;
    }
  };
  const comments = useQuery({
    queryKey: [`Comment ${postID}`],
    queryFn: () => {
      return fetchComments(stateRef.current as string);
    },
  });

  const userID = useQuery({
    queryKey: [`USER`],
    queryFn: fetchUserID,
  });
  const commentsByParentI = useMemo(() => {
    if (comments.data === undefined) return {};
    const group: any = {};
    comments?.data.forEach((comment: any) => {
      group[comment.parentID] ||= [];
      group[comment.parentID].push(comment);
    });
    return group;
  }, [comments.data]);
  function getReplies(parentID: string) {
    return commentsByParentI[parentID];
  }
  console.log(userID.data);
  return (
    <Context.Provider
      value={{
        getReplies,
        rootComments: commentsByParentI.null,
        userID: userID.isLoading
          ? "Loading"
          : userID.data.userId
          ? userID.data.userId.userID
          : userID.data,
      }}
    >
      {comments.isLoading ? <h1>Loading</h1> : children}
    </Context.Provider>
  );
}
export default CommentProvider;