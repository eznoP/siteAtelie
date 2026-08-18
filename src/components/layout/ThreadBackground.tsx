import styles from "./thread-background.module.css";

export function ThreadBackground() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <svg
        className={styles.backgroundArt}
        viewBox="0 0 1440 10000"
        preserveAspectRatio="none"
      >
        <path
          className={`${styles.thread} ${styles.threadOne}`}
          d="M -90 620 C 260 900 110 1320 420 1580 S 780 2260 430 2600 S 120 3350 520 3650 S 920 4380 560 4740 S 210 5540 650 5900 S 1030 6680 660 7090 S 370 7900 820 8300 S 1190 9160 920 10080"
        />
        <path
          className={`${styles.thread} ${styles.threadTwo}`}
          d="M 1510 1120 C 1160 1380 1320 1860 1010 2150 S 700 2830 1040 3180 S 1360 3920 970 4300 S 690 5050 1060 5430 S 1340 6250 950 6610 S 660 7360 1030 7780 S 1330 8640 980 9000 S 760 9630 1120 10120"
        />
        <path
          className={`${styles.thread} ${styles.threadThree}`}
          d="M 210 2200 C 560 2450 870 2400 900 2780 S 620 3450 840 3820 S 1210 4540 880 4910 S 470 5550 720 5960 S 1130 6750 780 7140 S 420 7830 650 8260 S 1020 9100 640 9650"
        />
        <path
          className={`${styles.thread} ${styles.threadFour}`}
          d="M 1280 480 C 1010 820 1110 1250 810 1480 S 450 2040 650 2390 S 970 3020 690 3370 S 370 4100 610 4470 S 930 5200 650 5590 S 310 6300 560 6710 S 910 7510 620 7920 S 330 8720 560 9140"
        />

        <g className={styles.motif} transform="translate(235 1840)">
          <circle cx="0" cy="0" r="42" />
          <circle cx="0" cy="0" r="18" />
          <path d="M0-68 C18-42 40-43 65-28 C43-6 43 18 62 40 C33 42 17 58 4 78 C-11 53-32 43-59 43 C-44 18-47-6-67-26 C-37-35-18-48 0-68Z" />
        </g>

        <g className={styles.granny} transform="translate(1120 3500)">
          <rect x="-54" y="-54" width="108" height="108" rx="12" />
          <rect x="-30" y="-30" width="60" height="60" rx="8" />
          <circle cx="0" cy="0" r="10" />
        </g>

        <g className={styles.hook} transform="translate(280 5320) rotate(-24)">
          <path d="M0 0 L130 0 C155 0 158 42 131 48 C116 51 105 42 106 29" />
          <path d="M0 -5 L0 5" />
        </g>

        <g className={styles.motifSmall} transform="translate(1160 6940)">
          <circle cx="0" cy="-27" r="24" />
          <circle cx="26" cy="10" r="24" />
          <circle cx="-26" cy="10" r="24" />
          <circle cx="0" cy="0" r="9" />
        </g>

        <g className={styles.loop} transform="translate(315 8620)">
          <path d="M-62 5 C-25-55 48-47 65 3 C78 43 35 76-10 60 C-44 48-48 9-18-5 C8-18 39 2 34 26" />
        </g>
      </svg>
    </div>
  );
}
