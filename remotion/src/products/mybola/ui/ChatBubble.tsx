import React from "react";
import { MYBOLA } from "../design";
import { t } from "./tokens";

// =============================================================================
// ChatBubble
// =============================================================================
// 1:1 with widgets/media/message_bubble.dart: a side-aligned column of a tinted
// body then a caption 4px below. Theirs = primary@20%, left, points bottom-left
// (radius 12/12/12/4); mine = secondary, right, points bottom-right (12/12/4/12).
// Body padding 10, text = `text.body`, caption = `text.meta` "{sender} · {time}".

export const ChatBubble: React.FC<{
  isMine: boolean;
  text: string;
  /** Caption sender label (e.g. "Pengurus Akademi", "Pelanggan", "Anda"). */
  sender: string;
  time: string;
  /** Optional edge-to-edge media tile rendered inside/instead of a text body. */
  children?: React.ReactNode;
  /** Body replaces the text (bare tile). */
  bare?: boolean;
  maxWidth?: number;
}> = ({ isMine, text, sender, time, children, bare = false, maxWidth = 300 }) => {
  const body = (
    <div
      style={{
        maxWidth,
        padding: 10,
        background: isMine ? MYBOLA.secondary : "rgba(0,145,255,0.2)",
        borderRadius: `12px 12px ${isMine ? 4 : 12}px ${isMine ? 12 : 4}px`,
      }}
    >
      {children ?? <span style={{ ...t.body, whiteSpace: "pre-wrap" }}>{text}</span>}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMine ? "flex-end" : "flex-start",
      }}
    >
      {bare ? <div style={{ maxWidth }}>{children}</div> : body}
      <div style={{ height: 4 }} />
      <span style={t.meta}>{`${sender} · ${time}`}</span>
    </div>
  );
};
