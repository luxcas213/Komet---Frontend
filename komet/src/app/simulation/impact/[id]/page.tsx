'use client';

import { useEffect } from 'react';
import main from './simviewer/main';
import { useParams } from 'next/navigation';
export default function ThreeCanvas() {
  const { id } = useParams();
  useEffect(() => {
    main(Number(id)); // inicia tu escena three.js
  }, []);

  return (
    <div className="h-screen w-screen">
      <canvas id="c"></canvas>
    </div>
  );
}
