export const strawberryMilkStickers = [
    {
    id: "strawberry-milk-carton",
    name: "Strawberry Milk Carton",
    svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
        <defs>
            <pattern id="pinkGingham" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#FFE4EB"/>
            <rect width="9" height="9" fill="#F5A8BB" opacity=".55"/>
            <rect x="9" y="9" width="9" height="9" fill="#F5A8BB" opacity=".55"/>
            </pattern>

            <linearGradient id="milkFront" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFF4F4"/>
            <stop offset="1" stop-color="#FFDCE5"/>
            </linearGradient>

            <linearGradient id="milkSide" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FFC3D1"/>
            <stop offset="1" stop-color="#F3A0B7"/>
            </linearGradient>
        </defs>

        <!-- White sticker silhouette -->
        <path d="M49 15 Q49 8 58 8 L136 8 Q144 8 144 17
                L179 55 Q185 61 185 72 L185 186
                Q185 196 175 201 L151 213 L39 213
                Q20 213 20 194 L20 77 Q20 67 26 60 Z"
                fill="white" stroke="white" stroke-width="9"
                stroke-linejoin="round"/>

        <!-- Right side -->
        <path d="M140 70 L176 57 L176 187
                Q176 191 170 195 L140 205 Z"
                fill="url(#milkSide)" stroke="#D85C7D"
                stroke-width="3" stroke-linejoin="round"/>

        <!-- Front panel -->
        <path d="M28 74 L140 70 L140 205
                Q140 208 134 208 L38 208
                Q28 208 28 198 Z"
                fill="url(#milkFront)" stroke="#D85C7D"
                stroke-width="3" stroke-linejoin="round"/>

        <!-- Folded gingham roof -->
        <path d="M53 17 L136 17 L176 57 L140 70 L28 74 Z"
                fill="url(#pinkGingham)"
                stroke="#D85C7D" stroke-width="3"
                stroke-linejoin="round"/>
        <path d="M53 17 L28 74 M136 17 L140 70
                M136 17 L176 57"
                fill="none" stroke="#E789A4" stroke-width="2.5"/>

        <!-- Pink cap -->
        <path d="M70 46 V55 Q86 66 103 55 V46"
                fill="#D65C7D" stroke="#BD4E70" stroke-width="2.5"/>
        <ellipse cx="86.5" cy="46" rx="17" ry="9"
                fill="#F38BA5" stroke="#BD4E70" stroke-width="2.5"/>
        <path d="M76 43 Q81 38 89 39"
                fill="none" stroke="#FFD8E3" stroke-width="2.5"
                stroke-linecap="round"/>

        <!-- Soft scalloped label top -->
        <path d="M30 85 Q40 91 50 85 Q60 91 70 85
                Q80 91 90 85 Q100 91 110 85
                Q125 91 138 85"
                fill="none" stroke="#FFC2D1" stroke-width="3"/>

        <!-- Strawberry 1: upper left -->
        <g transform="translate(65 113) rotate(-13)">
            <path d="M0 -9 C-17 -20 -21 -1 -15 13
                    Q0 38 15 13 C21 -1 17 -20 0 -9Z"
                fill="#F16D88" stroke="#D65C7D" stroke-width="2.5"/>
            <path d="M-14 -10 Q-8 -20 0 -13 Q8 -22 14 -10
                    L6 -7 L0 -11 L-6 -5Z"
                fill="#8CB69A" stroke="#668F76" stroke-width="2"/>
            <g fill="#FFF1D9">
            <ellipse cx="-8" cy="2" rx="1.6" ry="3"/>
            <ellipse cx="6" cy="3" rx="1.6" ry="3"/>
            <ellipse cx="-1" cy="14" rx="1.6" ry="3"/>
            </g>
        </g>

        <!-- Strawberry 2: middle right -->
        <g transform="translate(113 140) rotate(12) scale(.83)">
            <path d="M0 -9 C-17 -20 -21 -1 -15 13
                    Q0 38 15 13 C21 -1 17 -20 0 -9Z"
                fill="#F16D88" stroke="#D65C7D" stroke-width="2.5"/>
            <path d="M-14 -10 Q-8 -20 0 -13 Q8 -22 14 -10
                    L6 -7 L0 -11 L-6 -5Z"
                fill="#8CB69A" stroke="#668F76" stroke-width="2"/>
            <g fill="#FFF1D9">
            <ellipse cx="-8" cy="2" rx="1.6" ry="3"/>
            <ellipse cx="6" cy="3" rx="1.6" ry="3"/>
            <ellipse cx="-1" cy="14" rx="1.6" ry="3"/>
            </g>
        </g>

        <!-- Strawberry 3: lower center -->
        <g transform="translate(82 169) rotate(-10) scale(.9)">
            <path d="M0 -9 C-17 -20 -21 -1 -15 13
                    Q0 38 15 13 C21 -1 17 -20 0 -9Z"
                fill="#F16D88" stroke="#D65C7D" stroke-width="2.5"/>
            <path d="M-14 -10 Q-8 -20 0 -13 Q8 -22 14 -10
                    L6 -7 L0 -11 L-6 -5Z"
                fill="#8CB69A" stroke="#668F76" stroke-width="2"/>
            <g fill="#FFF1D9">
            <ellipse cx="-8" cy="2" rx="1.6" ry="3"/>
            <ellipse cx="6" cy="3" rx="1.6" ry="3"/>
            <ellipse cx="-1" cy="14" rx="1.6" ry="3"/>
            </g>
        </g>

        <!-- Little hearts and sparkles -->
        <g fill="#F5A0B5">
            <path d="M42 102 C34 95 31 106 42 113
                    C53 106 50 95 42 102Z"/>
            <path d="M123 103 C116 96 112 106 123 113
                    C134 106 130 96 123 103Z"/>
            <circle cx="44" cy="151" r="2"/>
            <circle cx="124" cy="179" r="2"/>
        </g>
        <g fill="#FFB6C9" stroke="#E789A4" stroke-width="1.5">
            <path d="M94 111 Q97 120 105 123
                    Q97 126 94 135 Q91 126 83 123
                    Q91 120 94 111Z"/>
            <path d="M48 166 Q50 173 57 175
                    Q50 178 48 185 Q46 178 39 175
                    Q46 173 48 166Z"/>
        </g>

        <!-- Tiny bunny on side -->
        <g transform="translate(160 113)"
            fill="none" stroke="#FFF0F4"
            stroke-width="2.7" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M-10 0 Q-16 -24 -8 -26
                    Q-2 -27 -2 -9
                    Q4 -27 10 -24
                    Q16 -19 8 0
                    Q19 11 8 20
                    Q0 25 -9 20 Q-20 11 -10 0Z"/>
            <path d="M-6 7 L-6 8 M6 7 L6 8
                    M-2 13 Q0 15 2 13"/>
        </g>

        <!-- Side label lines -->
        <g fill="none" stroke="#FFE2EA"
            stroke-width="2.5" stroke-linecap="round">
            <path d="M151 151 L168 146"/>
            <path d="M151 161 L168 156"/>
            <path d="M151 171 L164 167"/>
        </g>
        </svg>
    `,
    },
    
{
        id: "strawberry-sparkles",
        name: "Twinkle Sparkles",
        svg: `
                <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200">

                <defs>
                        <linearGradient id="pinkSparkle"
                        x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#FFE5ED"/>
                        <stop offset="0.55" stop-color="#FBC4D5"/>
                        <stop offset="1" stop-color="#F5A7C0"/>
                        </linearGradient>

                        <linearGradient id="goldSparkle"
                        x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#FFF4C7"/>
                        <stop offset="1" stop-color="#FFD98F"/>
                        </linearGradient>
                </defs>

                <!-- LARGE ROUNDED PINK SPARKLE -->
                <path
                        d="M95 32 Q100 20 105 32
                        C119 68 132 81 168 95
                        Q180 100 168 105
                        C132 119 119 132 105 168
                        Q100 180 95 168
                        C81 132 68 119 32 105
                        Q20 100 32 95
                        C68 81 81 68 95 32Z"
                        fill="white"
                        stroke="white"
                        stroke-width="13"
                        stroke-linejoin="round"
                />

                <path
                        d="M95 32 Q100 20 105 32
                        C119 68 132 81 168 95
                        Q180 100 168 105
                        C132 119 119 132 105 168
                        Q100 180 95 168
                        C81 132 68 119 32 105
                        Q20 100 32 95
                        C68 81 81 68 95 32Z"
                        fill="url(#pinkSparkle)"
                        stroke="#E887A3"
                        stroke-width="3"
                        stroke-linejoin="round"
                />

                <!-- GLOSSY HIGHLIGHTS -->
                <path
                        d="M106 65 Q117 86 135 93"
                        fill="none"
                        stroke="white"
                        stroke-width="7"
                        stroke-linecap="round"
                        opacity="0.9"
                />

                <circle cx="142" cy="103" r="4"
                        fill="white"/>

                <circle cx="132" cy="113" r="3"
                        fill="white"/>

                <!-- SMALL ROUNDED PINK SPARKLE -->
                <g transform="translate(33 147) scale(0.48)">
                        <path
                        d="M-5 -48 Q0 -60 5 -48
                        C17 -19 19 -17 48 -5
                        Q60 0 48 5
                        C19 17 17 19 5 48
                        Q0 60 -5 48
                        C-17 19 -19 17 -48 5
                        Q-60 0 -48 -5
                        C-19 -17 -17 -19 -5 -48Z"
                        fill="white"
                        stroke="white"
                        stroke-width="18"
                        stroke-linejoin="round"
                        />

                        <path
                        d="M-5 -48 Q0 -60 5 -48
                        C17 -19 19 -17 48 -5
                        Q60 0 48 5
                        C19 17 17 19 5 48
                        Q0 60 -5 48
                        C-17 19 -19 17 -48 5
                        Q-60 0 -48 -5
                        C-19 -17 -17 -19 -5 -48Z"
                        fill="url(#pinkSparkle)"
                        stroke="#E887A3"
                        stroke-width="5"
                        stroke-linejoin="round"
                        />

                        <path
                        d="M-5 -28 Q1 -12 14 -7"
                        fill="none"
                        stroke="white"
                        stroke-width="8"
                        stroke-linecap="round"
                        />
                </g>

                <!-- TINY ROUNDED GOLD SPARKLE -->
                <g transform="translate(155 40) scale(0.43)">
                        <path
                        d="M-5 -48 Q0 -60 5 -48
                        C17 -19 19 -17 48 -5
                        Q60 0 48 5
                        C19 17 17 19 5 48
                        Q0 60 -5 48
                        C-17 19 -19 17 -48 5
                        Q-60 0 -48 -5
                        C-19 -17 -17 -19 -5 -48Z"
                        fill="white"
                        stroke="white"
                        stroke-width="18"
                        stroke-linejoin="round"
                        />

                        <path
                        d="M-5 -48 Q0 -60 5 -48
                        C17 -19 19 -17 48 -5
                        Q60 0 48 5
                        C19 17 17 19 5 48
                        Q0 60 -5 48
                        C-17 19 -19 17 -48 5
                        Q-60 0 -48 -5
                        C-19 -17 -17 -19 -5 -48Z"
                        fill="url(#goldSparkle)"
                        stroke="#F3BD77"
                        stroke-width="5"
                        stroke-linejoin="round"
                        />

                        <path
                        d="M-5 -28 Q1 -12 14 -7"
                        fill="none"
                        stroke="white"
                        stroke-width="8"
                        stroke-linecap="round"
                        />
                </g>
                </svg>
        `,
        },

];