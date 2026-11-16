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

        {
                id: "strawberry",
                name: "Strawberry",
                svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180">
                <defs>
                        <linearGradient id="berryFill" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#FFB1C3"/>
                        <stop offset="1" stop-color="#F16D88"/>
                        </linearGradient>
                </defs>

                <!-- Strawberry body -->
                <path d="M80 47
                        C54 27 25 46 28 78
                        C31 116 62 149 80 157
                        C98 149 129 116 132 78
                        C135 46 106 27 80 47Z"
                        fill="url(#berryFill)"
                        stroke="#D85C7D"
                        stroke-width="4"
                        stroke-linejoin="round"/>

                <!-- Leaves -->
                <path d="M80 49
                        Q65 29 45 42
                        Q52 49 64 52
                        Q57 58 58 66
                        Q72 63 80 55
                        Q89 63 102 66
                        Q103 58 96 52
                        Q108 49 115 42
                        Q95 29 80 49Z"
                        fill="#8CB69A"
                        stroke="#668F76"
                        stroke-width="3"
                        stroke-linejoin="round"/>

                <!-- Seeds -->
                <g fill="#FFF1D9">
                        <ellipse cx="57" cy="78" rx="2.5" ry="4"/>
                        <ellipse cx="83" cy="75" rx="2.5" ry="4"/>
                        <ellipse cx="107" cy="82" rx="2.5" ry="4"/>
                        <ellipse cx="47" cy="101" rx="2.5" ry="4"/>
                        <ellipse cx="70" cy="103" rx="2.5" ry="4"/>
                        <ellipse cx="96" cy="106" rx="2.5" ry="4"/>
                        <ellipse cx="81" cy="132" rx="2.5" ry="4"/>
                </g>

                <!-- Soft highlight -->
                <path d="M46 65 Q38 82 45 93"
                        fill="none"
                        stroke="#FFDCE5"
                        stroke-width="5"
                        stroke-linecap="round"/>
                </svg>
        `,
        },

        {
                id: "satin-bow",
                name: "Satin Bow",
                svg: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170">
                        <defs>
                                <linearGradient id="bowFill" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stop-color="#FFDCE5"/>
                                <stop offset="1" stop-color="#F3A0B7"/>
                                </linearGradient>
                        </defs>

                        <!-- Left loop -->
                        <path d="M95 75
                                C72 47 29 30 20 53
                                C11 78 40 105 91 91Z"
                                fill="url(#bowFill)"
                                stroke="#D85C7D"
                                stroke-width="4"
                                stroke-linejoin="round"/>

                        <!-- Right loop -->
                        <path d="M105 75
                                C128 47 171 30 180 53
                                C189 78 160 105 109 91Z"
                                fill="url(#bowFill)"
                                stroke="#D85C7D"
                                stroke-width="4"
                                stroke-linejoin="round"/>

                        <!-- Ribbon tails -->
                        <path d="M91 91
                                Q74 112 52 148
                                L77 140 L91 158
                                Q106 127 103 96Z"
                                fill="#F5A8BB"
                                stroke="#D85C7D"
                                stroke-width="4"
                                stroke-linejoin="round"/>

                        <path d="M109 91
                                Q126 112 148 148
                                L123 140 L109 158
                                Q94 127 97 96Z"
                                fill="#F5A8BB"
                                stroke="#D85C7D"
                                stroke-width="4"
                                stroke-linejoin="round"/>

                        <!-- Fold details -->
                        <g fill="none" stroke="#E789A4"
                                stroke-width="3" stroke-linecap="round">
                                <path d="M85 77 Q60 58 35 60"/>
                                <path d="M115 77 Q140 58 165 60"/>
                                <path d="M83 111 L73 138"/>
                                <path d="M117 111 L127 138"/>
                        </g>

                        <!-- Center knot -->
                        <rect x="88" y="69" width="24" height="29" rx="10"
                                fill="#FFDCE5"
                                stroke="#D85C7D"
                                stroke-width="4"/>
                        </svg>
                `,
        },

        {
                id: "strawberry-shortcake",
                name: "Strawberry Shortcake",
                svg: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 190">
                        <!-- Cake slice -->
                        <path d="M28 89 L166 89 L178 159
                                Q178 167 168 167 L35 167
                                Q25 167 25 157Z"
                                fill="#FFF1DC"
                                stroke="#D85C7D"
                                stroke-width="4"
                                stroke-linejoin="round"/>

                        <!-- Strawberry filling -->
                        <path d="M27 126 L173 126 L176 142 L26 142Z"
                                fill="#F5A8BB"/>

                        <!-- Cake layers -->
                        <path d="M28 119 L172 119 M27 145 L176 145"
                                fill="none"
                                stroke="#E9C9A7"
                                stroke-width="3"/>

                        <!-- Whipped cream -->
                        <path d="M26 90
                                Q18 78 35 72
                                Q33 57 52 59
                                Q60 42 79 54
                                Q96 39 112 55
                                Q131 45 143 62
                                Q166 57 171 76
                                Q186 84 173 94
                                Q159 102 145 92
                                Q127 103 112 92
                                Q94 104 79 92
                                Q59 103 45 91
                                Q34 99 26 90Z"
                                fill="#FFF8F6"
                                stroke="#E789A4"
                                stroke-width="3"
                                stroke-linejoin="round"/>

                        <!-- Top strawberry -->
                        <path d="M101 44
                                C87 33 72 45 78 61
                                Q89 81 101 86
                                Q114 80 124 61
                                C130 45 115 33 101 44Z"
                                fill="#F16D88"
                                stroke="#D85C7D"
                                stroke-width="3"/>

                        <path d="M101 45 Q89 31 78 41
                                L93 49 L101 44
                                L109 49 L124 41
                                Q112 31 101 45Z"
                                fill="#8CB69A"
                                stroke="#668F76"
                                stroke-width="2.5"/>

                        <g fill="#FFF1D9">
                                <ellipse cx="93" cy="55" rx="2" ry="3"/>
                                <ellipse cx="110" cy="56" rx="2" ry="3"/>
                                <ellipse cx="101" cy="68" rx="2" ry="3"/>
                        </g>
                        </svg>
                `,
        },

        {
                id: "strawberry-bear",
                name: "Strawberry Bear",
                svg: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
                        <!-- Ears -->
                        <circle cx="52" cy="54" r="27"
                                fill="#FFF0E5" stroke="#D98B91" stroke-width="4"/>
                        <circle cx="148" cy="54" r="27"
                                fill="#FFF0E5" stroke="#D98B91" stroke-width="4"/>

                        <circle cx="52" cy="54" r="13" fill="#F8C5CE"/>
                        <circle cx="148" cy="54" r="13" fill="#F8C5CE"/>

                        <!-- Body -->
                        <ellipse cx="100" cy="153" rx="59" ry="55"
                                fill="#FFF0E5"
                                stroke="#D98B91"
                                stroke-width="4"/>

                        <!-- Feet -->
                        <ellipse cx="60" cy="190" rx="27" ry="21"
                                fill="#FFF0E5" stroke="#D98B91" stroke-width="4"/>
                        <ellipse cx="140" cy="190" rx="27" ry="21"
                                fill="#FFF0E5" stroke="#D98B91" stroke-width="4"/>

                        <ellipse cx="60" cy="192" rx="12" ry="10" fill="#F8C5CE"/>
                        <ellipse cx="140" cy="192" rx="12" ry="10" fill="#F8C5CE"/>

                        <!-- Head -->
                        <ellipse cx="100" cy="88" rx="66" ry="58"
                                fill="#FFF0E5"
                                stroke="#D98B91"
                                stroke-width="4"/>

                        <!-- Face -->
                        <g fill="#A96870">
                                <circle cx="78" cy="89" r="4"/>
                                <circle cx="122" cy="89" r="4"/>
                                <ellipse cx="100" cy="103" rx="6" ry="4"/>
                        </g>

                        <path d="M100 107 Q94 116 88 110
                                M100 107 Q106 116 112 110"
                                fill="none"
                                stroke="#A96870"
                                stroke-width="2.5"
                                stroke-linecap="round"/>

                        <ellipse cx="65" cy="107" rx="10" ry="6"
                                fill="#F8C5CE" opacity=".75"/>
                        <ellipse cx="135" cy="107" rx="10" ry="6"
                                fill="#F8C5CE" opacity=".75"/>

                        <!-- Small bow -->
                        <path d="M92 136 Q71 120 70 137
                                Q72 150 94 143Z
                                M108 136 Q129 120 130 137
                                Q128 150 106 143Z"
                                fill="#F5A8BB"
                                stroke="#D85C7D"
                                stroke-width="3"/>

                        <ellipse cx="100" cy="140" rx="9" ry="8"
                                fill="#FFDCE5"
                                stroke="#D85C7D"
                                stroke-width="3"/>
                        </svg>
                `,
        },

        {
                id: "strawberry-milk-bottle",
                name: "Strawberry Milk Bottle",
                svg: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220">
                        <defs>
                                <linearGradient id="bottleMilk" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stop-color="#FFE4EB"/>
                                <stop offset="1" stop-color="#F5A8BB"/>
                                </linearGradient>
                        </defs>

                        <!-- Bottle body -->
                        <path d="M55 43 L105 43 L105 69
                                Q105 80 120 91
                                Q132 101 132 117
                                L132 189
                                Q132 203 118 203
                                L42 203
                                Q28 203 28 189
                                L28 117
                                Q28 101 40 91
                                Q55 80 55 69Z"
                                fill="#FFF8F8"
                                stroke="#D85C7D"
                                stroke-width="4"
                                stroke-linejoin="round"/>

                        <!-- Pink milk -->
                        <path d="M32 119 L128 119 L128 189
                                Q128 199 118 199 L42 199
                                Q32 199 32 189Z"
                                fill="url(#bottleMilk)"/>

                        <!-- Cap -->
                        <rect x="51" y="24" width="58" height="26" rx="8"
                                fill="#F5A8BB"
                                stroke="#D85C7D"
                                stroke-width="4"/>

                        <path d="M59 32 V43 M71 32 V43 M83 32 V43 M95 32 V43"
                                stroke="#FFDCE5"
                                stroke-width="2"
                                stroke-linecap="round"/>

                        <!-- Label -->
                        <rect x="47" y="127" width="66" height="55" rx="12"
                                fill="#FFF4F4"
                                stroke="#E789A4"
                                stroke-width="3"/>

                        <!-- Strawberry -->
                        <path d="M80 143
                                C69 135 58 145 63 157
                                Q69 172 80 176
                                Q91 172 97 157
                                C102 145 91 135 80 143Z"
                                fill="#F16D88"
                                stroke="#D65C7D"
                                stroke-width="2.5"/>

                        <path d="M80 144 Q72 135 64 141
                                L74 147 L80 143
                                L86 147 L96 141
                                Q88 135 80 144Z"
                                fill="#8CB69A"
                                stroke="#668F76"
                                stroke-width="2"/>

                        <!-- Glass highlight -->
                        <path d="M42 102 Q37 111 38 125"
                                fill="none"
                                stroke="white"
                                stroke-width="5"
                                stroke-linecap="round"/>
                        </svg>
                `,
        },

        {
                id: "love-letter",
                name: "Love Letter",
                svg: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">
                        <!-- Envelope -->
                        <rect x="17" y="28" width="166" height="112" rx="12"
                                fill="#FFF0F4"
                                stroke="#D85C7D"
                                stroke-width="4"/>

                        <!-- Envelope folds -->
                        <path d="M18 40 L100 103 L182 40"
                                fill="none"
                                stroke="#D85C7D"
                                stroke-width="3.5"
                                stroke-linejoin="round"/>

                        <path d="M19 133 L75 88
                                M181 133 L125 88"
                                fill="none"
                                stroke="#E789A4"
                                stroke-width="3"
                                stroke-linecap="round"/>

                        <!-- Heart seal -->
                        <path d="M100 91
                                C87 74 69 91 81 106
                                Q89 116 100 123
                                Q111 116 119 106
                                C131 91 113 74 100 91Z"
                                fill="#F5A8BB"
                                stroke="#D85C7D"
                                stroke-width="3"
                                stroke-linejoin="round"/>

                        <!-- Tiny highlight -->
                        <path d="M89 95 Q91 91 95 93"
                                fill="none"
                                stroke="#FFDCE5"
                                stroke-width="3"
                                stroke-linecap="round"/>
                        </svg>
                `,
        },
];