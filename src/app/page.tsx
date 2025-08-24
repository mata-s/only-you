"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type Profile = {
  id: string;
  name: string;
  img: string;
  bio?: string;
};

const profiles: Profile[] = [
  { id: "me-classic",  name: "又吉 しん子", img: "/variants/IMG_0439.JPG",  bio: "仲良くしてください♡" },
];

const femaleProfiles: Profile[] = [
  { id: "f-0121", img: "/variants/IMG_0121.jpg", name: "しんちゃん", bio: "たまに無言で景色を見る時間、大切にしてます。" },
  { id: "f-0320", img: "/variants/IMG_0320.JPG", name: "ピース又吉ではない", bio: "海と空の青が似合うって言われます。" },
  { id: "f-0418", img: "/variants/IMG_0418.JPG", name: "又吉くん", bio: "友達といるとずっと笑ってるタイプ。" },
  { id: "f-0430", img: "/variants/IMG_0430.jpg", name: "又吉 真春", bio: "音楽はスピッツとか好きです" },
  { id: "f-1952", img: "/variants/IMG_1952.JPG", name: "しんくん", bio: "夜景×散歩＝最高のデートだと思ってる。" },
  { id: "f-2684", img: "/variants/IMG_2684.PNG", name: "又吉 真春｜プロテインは友だち", bio: "腕は太く、心はやわらかく。プロテインはチョコ派。" },
  { id: "f-2824", img: "/variants/IMG_2824.jpg", name: "Shin", bio: "写真は真顔だけど、本当はすぐ笑う。" },
  { id: "f-2855", img: "/variants/IMG_2855.JPG", name: "又吉 真春", bio: "旅行大好き" },
  { id: "f-2945", img: "/variants/IMG_2945.JPG", name: "しんしゅん", bio: "読書はミステリー多め。おすすめ教えてください。" },
  { id: "f-3114", img: "/variants/IMG_3114.JPG", name: "又吉投手", bio: "球速はWi-Fi並、コントロールはたまに圏外。" },
  { id: "f-3489", img: "/variants/IMG_3489.JPG", name: "又吉選手", bio: "届かないと思った打球に、届いた瞬間が好き。" },
];

function Card({ p, onNext, onPrev }: { p: Profile; onNext: () => void; onPrev: () => void }) {
  const [startX, setStartX] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const threshold = 40; // px: minimum swipe distance

  const onTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setStartX(e.touches[0].clientX);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isTouching || startX == null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (dx <= -threshold) {
      onNext();
    } else if (dx >= threshold) {
      onPrev();
    }
    setIsTouching(false);
    setStartX(null);
  };

  // Optional: mouse support for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    setIsTouching(true);
    setStartX(e.clientX);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isTouching || startX == null) return;
    const dx = e.clientX - startX;
    if (dx <= -threshold) {
      onNext();
    } else if (dx >= threshold) {
      onPrev();
    }
    setIsTouching(false);
    setStartX(null);
  };

  return (
    <div className="w-[360px] rounded-2xl shadow-md overflow-hidden bg-white">
      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div className="w-full h-[360px] relative bg-black">
          <Image
            src={p.img}
            alt={p.name}
            fill
            className="object-contain"
            draggable={false}
          />
        </div>
        {/* Left arrow */}
        <button
          aria-label="前へ"
          title="前へ"
          onClick={onPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white text-xl grid place-items-center"
        >
          ‹
        </button>
        {/* Right arrow */}
        <button
          aria-label="次へ"
          title="次へ"
          onClick={onNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white text-xl grid place-items-center"
        >
          ›
        </button>
      </div>
      <div className="p-4">
        <h2 className="font-bold text-lg">{p.name}</h2>
        {p.bio && <p className="text-sm text-gray-700 mt-1">{p.bio}</p>}
        <p className="text-xs text-gray-400 mt-1">※画像をフリック（左右）で切替／ボタンでも操作できます</p>
        <div className="mt-3 flex gap-2">
          <a
            className="flex-1 rounded-lg bg-black text-white text-center py-2"
            href="https://instagram.com/あなたのID"
            target="_blank"
            rel="noreferrer"
            aria-label="InstagramでDMする"
            title="InstagramでDMする"
          >
            DMする
          </a>
          <a
            className="flex-1 rounded-lg bg-green-500 text-white text-center py-2"
            href="https://line.me/ti/p/xpNddE62AL"
            target="_blank"
            rel="noreferrer"
            aria-label="LINEで友だち追加"
            title="LINEで友だち追加"
          >
            LINEで追加
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: gender, 2: preference, 3: loading, 4: profiles
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedPref, setSelectedPref] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [pref, setPref] = useState<string | null>(null); // "personality" or "visual"
  const [i, setI] = useState(0);
  const next = () => {
    const set = gender === "female" ? femaleProfiles : profiles;
    setI((prev) => (prev + 1) % set.length);
  };
  const prev = () => {
    const set = gender === "female" ? femaleProfiles : profiles;
    setI((prev) => (prev - 1 + set.length) % set.length);
  };

  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => setStep(4), 1000);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (step === 4 && gender === "female") {
      setI(Math.floor(Math.random() * femaleProfiles.length));
    }
  }, [step, gender]);

  if (step === 1) {
    const baseBtn = "rounded-lg px-4 py-2 border";
    const active = "bg-black text-white border-black";
    const inactive = "bg-white text-black";
    return (
      <main className="min-h-dvh grid place-items-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-4">あなたの性別を教えてください</h1>
          <div className="flex gap-4 justify-center">
            <button
              className={`${baseBtn} ${selectedGender === "male" ? active : inactive}`}
              onClick={() => setSelectedGender("male")}
            >
              男性
            </button>
            <button
              className={`${baseBtn} ${selectedGender === "female" ? active : inactive}`}
              onClick={() => setSelectedGender("female")}
            >
              女性
            </button>
          </div>
          <div className="mt-6">
            <button
              className={`inline-flex items-center justify-center rounded-full w-12 h-12 border text-2xl ${selectedGender ? "bg-black text-white border-black" : "opacity-40 cursor-not-allowed"}`}
              onClick={() => {
                if (!selectedGender) return;
                setGender(selectedGender);
                setStep(2);
              }}
              disabled={!selectedGender}
              aria-label="次へ"
              title="次へ"
            >
              →
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 2) {
    const baseBtn = "rounded-lg px-4 py-2 border";
    const active = "bg-black text-white border-black";
    const inactive = "bg-white text-black";
    return (
      <main className="min-h-dvh grid place-items-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-2">あなたは何を重視しますか？</h1>
          <p className="text-gray-600 mb-4">性格？ビジュアル？</p>
          <div className="flex gap-4 justify-center">
            <button
              className={`${baseBtn} ${selectedPref === "personality" ? active : inactive}`}
              onClick={() => setSelectedPref("personality")}
            >
              性格
            </button>
            <button
              className={`${baseBtn} ${selectedPref === "visual" ? active : inactive}`}
              onClick={() => setSelectedPref("visual")}
            >
              ビジュアル
            </button>
          </div>
          <div className="mt-6">
            <button
              className={`inline-flex items-center justify-center rounded-full w-12 h-12 border text-2xl ${selectedPref ? "bg-black text-white border-black" : "opacity-40 cursor-not-allowed"}`}
              onClick={() => {
                if (!selectedPref) return;
                setPref(selectedPref);
                setStep(3);
              }}
              disabled={!selectedPref}
              aria-label="次へ"
              title="次へ"
            >
              →
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 3) {
    return (
      <main className="min-h-dvh grid place-items-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-2">マッチング中…</h1>
          <p className="text-gray-600">１億人から選んでいます…</p>
          <div className="mt-6 w-48 h-1 bg-gray-200 overflow-hidden mx-auto">
            <div className="h-full bg-black animate-pulse" style={{ width: "100%" }} />
          </div>
        </div>
      </main>
    );
  }

  if (step === 4) {
    const profileSet = gender === "female" ? femaleProfiles : profiles;
    return (
      <main className="min-h-dvh grid place-items-center p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold">このマッチングサービスは本当にすごい！</h1>
          <p className="text-gray-600 mt-2">世界で最高の体験を、あなたに。</p>
        </div>
        <Card p={profileSet[i]} onNext={next} onPrev={prev} />
      </main>
    );
  }
}