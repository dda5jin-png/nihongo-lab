import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #fffdf9 0%, #fcf6ee 100%)",
          borderRadius: 148,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 22,
            borderRadius: 126,
            border: "12px solid #dec2a2",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 118,
            width: 116,
            height: 116,
            borderRadius: 999,
            background: "linear-gradient(180deg, #d8b183 0%, #b86a4f 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 156,
            width: 176,
            height: 38,
            borderTop: "14px solid #b86a4f",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 194,
            width: 220,
            height: 26,
            borderTop: "10px solid rgba(196,154,104,0.9)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 110,
            width: 208,
            height: 134,
            borderRadius: 40,
            background: "linear-gradient(180deg, #fffdf9 0%, #f5e6d0 100%)",
            border: "8px solid #b6956e",
            clipPath: "polygon(0 12%, 50% 0, 50% 100%, 0 88%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 110,
            width: 208,
            height: 134,
            borderRadius: 40,
            background: "linear-gradient(180deg, #fffdf9 0%, #f5e6d0 100%)",
            border: "8px solid #b6956e",
            clipPath: "polygon(50% 0, 100% 12%, 100% 88%, 50% 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 110,
            width: 12,
            height: 158,
            borderRadius: 999,
            background: "#6c4735",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 74,
            width: 208,
            height: 10,
            borderRadius: 999,
            background: "#dec2a2",
          }}
        />
      </div>
    ),
    size
  );
}
