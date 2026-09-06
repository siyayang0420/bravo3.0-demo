import { useId } from "react";

// The two coin faces, rendered as inline SVG (original flat look).
// FrontFace = white flower emblem. BackFace = dynamic "$value".
// To swap art, replace the paths here. IDs are prefixed so front/back never clash.

export function FrontFace() {
  const uid = useId().replace(/:/g, "");
  const shadowId = `bcf_shadow_${uid}`;
  const bodyId = `bcf_body_${uid}`;
  const borderId = `bcf_border_${uid}`;
  const emblemId = `bcf_emblem_${uid}`;

  return (
    <svg viewBox="0 0 83 83" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter={`url(#${shadowId})`}>
        <circle cx="41.5" cy="41.5" r="41.5" fill="#8A7721" />
        <circle cx="41.5" cy="41.5" r="41.5" fill={`url(#${bodyId})`} fillOpacity="0.84" />
      </g>
      <circle cx="41.5" cy="41.5" r="40.9866" stroke={`url(#${borderId})`} strokeWidth="1.0268" />
      <path d="M40.4889 13.004C42.5135 12.6328 44.3657 12.8834 45.9147 13.6193C46.5227 13.9063 47.0897 14.264 47.5953 14.6984C47.7394 14.8476 47.8893 14.9924 48.0494 15.1261C48.7468 15.7105 49.5811 16.1291 50.484 16.337L50.5055 23.4249C55.2938 20.8868 61.5677 21.7203 65.3903 26.213C66.724 27.7807 67.4326 29.5096 67.5699 31.2189C67.6255 31.8891 67.6005 32.5597 67.4772 33.215C67.42 33.4144 67.3684 33.6167 67.3326 33.8224C67.1753 34.7185 67.2302 35.6504 67.5016 36.5362L61.3737 40.0987C65.9659 42.9765 68.3815 48.8261 66.402 54.3829C65.7111 56.3219 64.5677 57.801 63.1559 58.7745C62.6034 59.1575 62.0104 59.4698 61.3815 59.6905C61.1802 59.7407 60.9797 59.7984 60.7838 59.8702C59.929 60.182 59.1497 60.6952 58.5182 61.3732L52.3668 57.8468C52.1709 63.2629 48.3138 68.2799 42.5114 69.3439C40.4867 69.7151 38.6346 69.4645 37.0856 68.7286C36.4776 68.4416 35.9106 68.0839 35.4049 67.6495C35.2608 67.5003 35.111 67.3555 34.9508 67.2218C34.2534 66.6374 33.4192 66.2187 32.5162 66.0109L32.4938 58.922C27.7054 61.4599 21.4324 60.6268 17.61 56.1339C16.2764 54.5663 15.5676 52.8382 15.4303 51.129C15.3748 50.4588 15.3997 49.7882 15.5231 49.1329C15.5803 48.9334 15.6319 48.7312 15.6676 48.5255C15.825 47.6294 15.7701 46.6975 15.4987 45.8116L21.6256 42.2482C17.034 39.37 14.6196 33.5204 16.5992 27.964C17.2901 26.0252 18.4327 24.5468 19.8444 23.5734C20.3968 23.1904 20.9899 22.8781 21.6188 22.6573C21.82 22.6072 22.0205 22.5495 22.2164 22.4777C23.0712 22.1659 23.8506 21.6527 24.4821 20.9747L30.6324 24.5001C30.8288 19.0844 34.6869 14.068 40.4889 13.004ZM45.3776 31.6163C44.6708 32.1228 43.9025 32.5567 43.0797 32.9044L41.899 36.2208L37.5778 33.7443C36.7121 33.6298 35.9017 33.39 35.1617 33.0362C35.247 33.9018 35.2388 34.7844 35.1285 35.671L37.4098 38.3517L33.1051 40.8556C32.5733 41.5479 31.9609 42.1299 31.2848 42.5939C32.0767 42.9527 32.837 43.4009 33.5494 43.9396L37.0114 43.3058L37.027 48.2833C37.3609 49.0901 37.5578 49.912 37.6217 50.7296C38.3283 50.2233 39.0969 49.7892 39.9196 49.4415L41.1012 46.1271L45.4225 48.6027C46.2878 48.717 47.0978 48.9572 47.8375 49.3107C47.7523 48.4452 47.7604 47.5624 47.8707 46.6759L45.5905 43.9962L49.8942 41.4913C50.4258 40.7991 51.0385 40.2169 51.7145 39.753C50.9226 39.3941 50.1622 38.9461 49.4498 38.4073L45.9889 39.0421L45.9723 34.0636C45.6384 33.2565 45.4412 32.4342 45.3776 31.6163Z" fill={`url(#${emblemId})`} fillOpacity="0.9" />
      <ellipse cx="41.5054" cy="41.1841" rx="13.4721" ry="13.4721" transform="rotate(-180 41.5054 41.1841)" fill="white" />
      <defs>
        {/* filterUnits must be spelled out: the default is objectBoundingBox, which
            would read these as multiples of the bbox (a ~7000-unit filter surface).
            Chrome clamps that; WebKit gives up and drops the group entirely. */}
        <filter id={shadowId} filterUnits="userSpaceOnUse" x="-1.7" y="0" width="85.6" height="83.9">
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="h" />
          <feOffset dy="1.7" /><feGaussianBlur stdDeviation="0.43" />
          <feComposite in2="h" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.45 0" />
          <feBlend in2="SourceGraphic" />
        </filter>
        <radialGradient id={bodyId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.5 41.5) rotate(90) scale(41.5 62)"><stop stopColor="#A68802" /><stop offset="1" stopColor="#FBE686" /></radialGradient>
        <linearGradient id={borderId} x1="41.5" y1="0" x2="41.5" y2="83" gradientUnits="userSpaceOnUse"><stop stopColor="#CDB340" /><stop offset="1" stopColor="#A28B26" /></linearGradient>
        <radialGradient id={emblemId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.5 41.2) rotate(90) scale(28.3 26.1)"><stop stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="white" /></radialGradient>
      </defs>
    </svg>
  );
}

export function BackFace({ value }) {
  const uid = useId().replace(/:/g, "");
  const shadowId = `bcb_shadow_${uid}`;
  const bodyId = `bcb_body_${uid}`;
  const borderId = `bcb_border_${uid}`;
  const valueInnerId = `bcb_value_inner_${uid}`;

  return (
    <svg viewBox="0 0 83 83" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter={`url(#${shadowId})`}>
        <circle cx="41.5" cy="41.5" r="41.5" fill="#8A7721" />
        <circle cx="41.5" cy="41.5" r="41.5" fill={`url(#${bodyId})`} fillOpacity="0.84" />
      </g>
      <circle cx="41.5" cy="41.5" r="40.9866" stroke={`url(#${borderId})`} strokeWidth="1.0268" />
      <text
        x="41.5" y="43.4" textAnchor="middle" dominantBaseline="central"
        fontFamily="'SF Pro Display','Helvetica Neue',Arial,sans-serif"
        fontWeight="800" fontSize="30" letterSpacing="-1" fill="white"
        filter={`url(#${valueInnerId})`}
      >
        {`$${value}`}
      </text>
      <defs>
        {/* see the note on #bcf_shadow — same fix */}
        <filter id={shadowId} filterUnits="userSpaceOnUse" x="-1.7" y="0" width="85.6" height="83.9">
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="h" />
          <feOffset dy="1.7" /><feGaussianBlur stdDeviation="0.43" />
          <feComposite in2="h" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.45 0" />
          <feBlend in2="SourceGraphic" />
        </filter>
        {/* Inner shadow on the value glyphs — Figma: X 0, Y 1, blur 0.8, spread 0, #000000 34%.
            Authored against this 83-unit face; the Flutter twin scales by size/83.
            SVG stdDeviation is half the Figma blur. */}
        <filter id={valueInnerId} x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="v" />
          <feOffset dy="1" /><feGaussianBlur stdDeviation="0.4" />
          <feComposite in2="v" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0" />
          <feBlend in2="SourceGraphic" />
        </filter>
        <radialGradient id={bodyId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.5 41.5) rotate(90) scale(41.5 62)"><stop stopColor="#A68802" /><stop offset="1" stopColor="#FBE686" /></radialGradient>
        <linearGradient id={borderId} x1="41.5" y1="0" x2="41.5" y2="83" gradientUnits="userSpaceOnUse"><stop stopColor="#CDB340" /><stop offset="1" stopColor="#A28B26" /></linearGradient>
      </defs>
    </svg>
  );
}
