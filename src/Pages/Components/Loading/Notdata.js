import React from "react";
import "./Loading.css";
export default function Notdata({ error }) {
  return <div className="loadnotroomfound">{error}</div>;
}
