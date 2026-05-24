import React from 'react';

const KharchaLoader = () => {
  return (
    <>
      <style>{`
        .kharcha-loader-wrapper .loader {
          --ANIMATION-DELAY-MULTIPLIER: 70ms;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          gap: 1.5rem; /* Gap to accommodate the 3D shadow */
        }
        .kharcha-loader-wrapper .loader span {
          padding: 0;
          margin: 0;
          animation-delay: 0s;
          transform: translateY(8rem);
          animation: hideAndSeek 1s alternate infinite cubic-bezier(0.86, 0, 0.07, 1);
        }
        .kharcha-loader-wrapper .loader .l { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 0); }
        .kharcha-loader-wrapper .loader .o { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 1); }
        .kharcha-loader-wrapper .loader .a { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 2); }
        .kharcha-loader-wrapper .loader .d { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 3); }
        .kharcha-loader-wrapper .loader .ispan { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 4); }
        .kharcha-loader-wrapper .loader .n { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 5); }
        .kharcha-loader-wrapper .loader .g { animation-delay: calc(var(--ANIMATION-DELAY-MULTIPLIER) * 6); }
        
        .kharcha-loader-wrapper .letter {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 5rem;
          font-weight: 900;
          /* Use the dark background color for the text fill so it looks carved out */
          color: #020617; 
          /* Create the solid outline */
          -webkit-text-stroke: 2px #ffffff;
          /* Create the 3D extruded shadow effect perfectly matching the reference image */
          text-shadow: 
            1px 1px 0 #ffffff,
            2px 2px 0 #ffffff,
            3px 3px 0 #ffffff,
            4px 4px 0 #ffffff,
            5px 5px 0 #ffffff,
            6px 6px 0 #ffffff,
            7px 7px 0 #ffffff,
            8px 8px 0 #ffffff;
          display: inline-block;
          text-transform: uppercase;
        }
        
        @keyframes hideAndSeek {
          0% { transform: translateY(8rem); }
          100% { transform: translateY(0rem); }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .kharcha-loader-wrapper .loader {
            gap: 0.75rem;
          }
          .kharcha-loader-wrapper .letter {
            font-size: 3rem;
            -webkit-text-stroke: 1.5px #ffffff;
            text-shadow: 
              1px 1px 0 #ffffff,
              2px 2px 0 #ffffff,
              3px 3px 0 #ffffff,
              4px 4px 0 #ffffff,
              5px 5px 0 #ffffff;
          }
          .kharcha-loader-wrapper .loader span {
            transform: translateY(5rem);
          }
          @keyframes hideAndSeek {
            0% { transform: translateY(5rem); }
            100% { transform: translateY(0rem); }
          }
        }
      `}</style>
      <div className="kharcha-loader-wrapper">
        <div className="loader">
          <span className="l letter">K</span>
          <span className="o letter">H</span>
          <span className="a letter">A</span>
          <span className="d letter">₹</span>
          <span className="ispan letter">C</span>
          <span className="n letter">H</span>
          <span className="g letter">A</span>
        </div>
      </div>
    </>
  );
};

export default KharchaLoader;
