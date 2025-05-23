import React from "react";

interface SignProps {
  colorFull?: boolean;
}

export default function Sign({ colorFull = false }: SignProps) {
  return colorFull ? (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2_8"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="18"
        y="0"
        width="284"
        height="320"
      >
        <path
          d="M301.916 90.7725C292.795 90.7725 283.763 92.5691 275.336 96.0596C266.909 99.5501 259.252 104.667 252.802 111.116C246.352 117.566 241.236 125.223 237.745 133.65C234.255 142.077 232.458 151.109 232.458 160.23C232.458 169.352 234.255 178.384 237.745 186.811C241.236 195.237 246.352 202.895 252.802 209.345C259.251 215.794 266.909 220.911 275.336 224.401C283.763 227.892 292.795 229.688 301.916 229.688V319.688C280.976 319.688 260.241 315.564 240.895 307.551C221.548 299.537 203.969 287.791 189.162 272.984C177.395 261.217 167.564 247.698 160 232.934C152.436 247.698 142.605 261.217 130.838 272.984C116.031 287.791 98.4517 299.537 79.1055 307.551C59.7593 315.564 39.0241 319.688 18.084 319.688V229.688C27.2052 229.688 36.2372 227.892 44.6641 224.401C53.091 220.911 60.7485 215.794 67.1982 209.345C73.6479 202.895 78.7643 195.237 82.2549 186.811C85.7453 178.384 87.542 169.352 87.542 160.23C87.5419 151.109 85.7453 142.077 82.2549 133.65C78.7643 125.223 73.6479 117.566 67.1982 111.116C60.7485 104.667 53.091 99.5501 44.6641 96.0596C36.2372 92.5691 27.2052 90.7725 18.084 90.7725V0.772461C39.0241 0.772472 59.7593 4.89681 79.1055 12.9102C98.4517 20.9236 116.031 32.6696 130.838 47.4766C142.605 59.2437 152.436 72.7632 160 87.5273C167.564 72.7632 177.395 59.2437 189.162 47.4766C203.969 32.6696 221.548 20.9236 240.895 12.9102C260.241 4.89681 280.976 0.772473 301.916 0.772461V90.7725Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_2_8)">
        <g filter="url(#filter0_n_2_8)">
          <g
            clip-path="url(#paint0_diamond_2_8_clip_path)"
            data-figma-skip-parse="true"
          >
            <g transform="matrix(3.00024e-08 0.329838 -0.315032 3.60021e-08 159.999 160.397)">
              <rect
                x="0"
                y="0"
                width="499.486"
                height="453.656"
                fill="url(#paint0_diamond_2_8)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="499.486"
                height="453.656"
                transform="scale(1 -1)"
                fill="url(#paint0_diamond_2_8)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="499.486"
                height="453.656"
                transform="scale(-1 1)"
                fill="url(#paint0_diamond_2_8)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="499.486"
                height="453.656"
                transform="scale(-1)"
                fill="url(#paint0_diamond_2_8)"
                opacity="1"
                shape-rendering="crispEdges"
              />
            </g>
          </g>
          <rect
            x="18.083"
            y="-3.3522"
            width="283.832"
            height="327.499"
            data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_DIAMOND&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:0.48618039488792419,&#34;b&#34;:0.31009614467620850,&#34;a&#34;:1.0},&#34;position&#34;:0.12380997091531754},{&#34;color&#34;:{&#34;r&#34;:0.95294117927551270,&#34;g&#34;:0.67058825492858887,&#34;b&#34;:0.92941176891326904,&#34;a&#34;:1.0},&#34;position&#34;:0.38597354292869568},{&#34;color&#34;:{&#34;r&#34;:0.061205621808767319,&#34;g&#34;:0.48964497447013855,&#34;b&#34;:0.79567307233810425,&#34;a&#34;:1.0},&#34;position&#34;:0.75261145830154419}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:0.48618039488792419,&#34;b&#34;:0.31009614467620850,&#34;a&#34;:1.0},&#34;position&#34;:0.12380997091531754},{&#34;color&#34;:{&#34;r&#34;:0.95294117927551270,&#34;g&#34;:0.67058825492858887,&#34;b&#34;:0.92941176891326904,&#34;a&#34;:1.0},&#34;position&#34;:0.38597354292869568},{&#34;color&#34;:{&#34;r&#34;:0.061205621808767319,&#34;g&#34;:0.48964497447013855,&#34;b&#34;:0.79567307233810425,&#34;a&#34;:1.0},&#34;position&#34;:0.75261145830154419}],&#34;transform&#34;:{&#34;m00&#34;:6.0004786064382643e-05,&#34;m01&#34;:-630.06414794921875,&#34;m02&#34;:475.03118896484375,&#34;m10&#34;:659.67639160156250,&#34;m11&#34;:7.2004113462753594e-05,&#34;m12&#34;:-169.44097900390625},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_n_2_8"
          x="18.083"
          y="-3.3522"
          width="283.832"
          height="327.499"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.76923078298568726 0.76923078298568726"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="5372"
          />
          <feComponentTransfer in="noise" result="coloredNoise1">
            <feFuncR type="linear" slope="2" intercept="-0.5" />
            <feFuncG type="linear" slope="2" intercept="-0.5" />
            <feFuncB type="linear" slope="2" intercept="-0.5" />
            <feFuncA
              type="discrete"
              tableValues="0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feMerge result="effect1_noise_2_8">
            <feMergeNode in="shape" />
            <feMergeNode in="noise1Clipped" />
          </feMerge>
        </filter>
        <clipPath id="paint0_diamond_2_8_clip_path">
          <rect x="18.083" y="-3.3522" width="283.832" height="327.499" />
        </clipPath>
        <linearGradient
          id="paint0_diamond_2_8"
          x1="0"
          y1="0"
          x2="500"
          y2="500"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.12381" stop-color="#FF7C4F" />
          <stop offset="0.385974" stop-color="#F3ABED" />
          <stop offset="0.752611" stop-color="#107DCB" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg
      width="284"
      height="320"
      viewBox="0 0 284 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_30_2"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="284"
        height="320"
      >
        <path
          d="M283.832 90.542C274.711 90.542 265.679 92.3386 257.252 95.8291C248.825 99.3197 241.168 104.436 234.718 110.886C228.268 117.335 223.152 124.993 219.661 133.42C216.171 141.847 214.374 150.879 214.374 160C214.374 169.121 216.171 178.153 219.661 186.58C223.152 195.007 228.268 202.665 234.718 209.114C241.167 215.564 248.825 220.68 257.252 224.171C265.679 227.661 274.711 229.458 283.832 229.458V319.458C262.892 319.458 242.157 315.334 222.811 307.32C203.464 299.307 185.885 287.561 171.078 272.754C159.311 260.987 149.48 247.467 141.916 232.703C134.352 247.467 124.521 260.987 112.754 272.754C97.9469 287.561 80.3677 299.307 61.0215 307.32C41.6753 315.334 20.9401 319.458 0 319.458V229.458C9.12119 229.458 18.1532 227.661 26.5801 224.171C35.007 220.68 42.6646 215.564 49.1143 209.114C55.5639 202.665 60.6803 195.007 64.1709 186.58C67.6613 178.153 69.458 169.121 69.458 160C69.458 150.879 67.6614 141.847 64.1709 133.42C60.6803 124.993 55.564 117.335 49.1143 110.886C42.6645 104.436 35.007 99.3197 26.5801 95.8291C18.1532 92.3386 9.12118 90.542 0 90.542V0.541992C20.9401 0.542003 41.6753 4.66634 61.0215 12.6797C80.3678 20.6932 97.9469 32.4391 112.754 47.2461C124.521 59.0132 134.352 72.5327 141.916 87.2969C149.48 72.5327 159.311 59.0132 171.078 47.2461C185.885 32.4391 203.464 20.6932 222.811 12.6797C242.157 4.66634 262.892 0.542004 283.832 0.541992V90.542Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_30_2)">
        <g filter="url(#filter0_n_30_2)">
          <rect
            x="-0.000976562"
            y="-3.58267"
            width="283.832"
            height="327.499"
            fill="#FCFAF2"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_n_30_2"
          x="-0.000976562"
          y="-3.58267"
          width="283.832"
          height="327.499"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.76923078298568726 0.76923078298568726"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="5372"
          />
          <feComponentTransfer in="noise" result="coloredNoise1">
            <feFuncR type="linear" slope="2" intercept="-0.5" />
            <feFuncG type="linear" slope="2" intercept="-0.5" />
            <feFuncB type="linear" slope="2" intercept="-0.5" />
            <feFuncA
              type="discrete"
              tableValues="0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feMerge result="effect1_noise_30_2">
            <feMergeNode in="shape" />
            <feMergeNode in="noise1Clipped" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
