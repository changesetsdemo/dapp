import useCopyClipboard from '@hooks/useCopyClipboard';
import { ReactNode } from 'react';

export function CopyHelper({ data, children }: { data: string; children: ReactNode }) {
  const [isCopied, staticCopy] = useCopyClipboard();
  const size = '14';

  return (
    <div className="flex items-center">
      <div className="flex-1">{children}</div>
      <div
        className="ml-[0.5rem]"
        onClick={() => {
          staticCopy(data);
        }}
      >
        {isCopied ? (
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3287"
            width={size}
            height={size}
          >
            <path
              d="M822.464 265.344a28.256 28.256 0 0 0-43.072 1.312l-352.96 417.664-181.92-212.992a28.288 28.288 0 0 0-43.104-1.088 37.12 37.12 0 0 0-0.96 48.256l204.096 238.944c5.76 6.752 13.696 10.56 22.016 10.56h0.096a29.088 29.088 0 0 0 22.048-10.656L823.68 313.6c11.52-13.728 11.008-35.328-1.216-48.256"
              p-id="3288"
            ></path>
          </svg>
        ) : (
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2370"
            width={size}
            height={size}
          >
            <path
              d="M672 832 224 832c-52.928 0-96-43.072-96-96L128 160c0-52.928 43.072-96 96-96l448 0c52.928 0 96 43.072 96 96l0 576C768 788.928 724.928 832 672 832zM224 128C206.368 128 192 142.368 192 160l0 576c0 17.664 14.368 32 32 32l448 0c17.664 0 32-14.336 32-32L704 160c0-17.632-14.336-32-32-32L224 128z"
              p-id="2371"
            ></path>
            <path
              d="M800 960 320 960c-17.664 0-32-14.304-32-32s14.336-32 32-32l480 0c17.664 0 32-14.336 32-32L832 256c0-17.664 14.304-32 32-32s32 14.336 32 32l0 608C896 916.928 852.928 960 800 960z"
              p-id="2372"
            ></path>
            <path
              d="M544 320 288 320c-17.664 0-32-14.336-32-32s14.336-32 32-32l256 0c17.696 0 32 14.336 32 32S561.696 320 544 320z"
              p-id="2373"
            ></path>
            <path
              d="M608 480 288.032 480c-17.664 0-32-14.336-32-32s14.336-32 32-32L608 416c17.696 0 32 14.336 32 32S625.696 480 608 480z"
              p-id="2374"
            ></path>
            <path
              d="M608 640 288 640c-17.664 0-32-14.304-32-32s14.336-32 32-32l320 0c17.696 0 32 14.304 32 32S625.696 640 608 640z"
              p-id="2375"
            ></path>
          </svg>
        )}
      </div>
    </div>
  );
}
