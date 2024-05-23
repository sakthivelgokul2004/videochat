import { useState } from "react";
import { Navigate } from "react-router-dom";

export function Loading(props) {
  let loading = props.loading;
  // console.log("loading", loading);
  if (loading) {
    return <>loading</>;
  }
  return <Navigate to={"/"} />;
}
