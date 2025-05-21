<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
  
    let w = typeof window !== 'undefined' ? window.innerWidth : 0;
    let h = typeof window !== 'undefined' ? window.innerHeight : 0;
    let animated = false;
    let isPanelVisible = false;
  
    // Star shadow generation
    function multipleBoxShadow(n: number): string {
      let value = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
      for (let i = 2; i <= n; i++) {
        value += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
      }
      return value;
    }
  
    const shadowsSmall = multipleBoxShadow(1200);
    const shadowsMedium = multipleBoxShadow(400);
    const shadowsBig = multipleBoxShadow(200);
  
    function togglePanel() {
      isPanelVisible = !isPanelVisible;
    }
  
    function checkStatus(event: Event) {
      const target = event.target as HTMLInputElement;
      animated = target.checked;
      if (animated) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }
  
    function startAnimation() {
      // Start star animations
      const stars = document.querySelectorAll<HTMLElement>('.stars-wrapper div');
      stars.forEach(star => {
        star.style.animationPlayState = 'running';
      });
    }
  
    function stopAnimation() {
      // Stop star animations
      const stars = document.querySelectorAll<HTMLElement>('.stars-wrapper div');
      stars.forEach(star => {
        star.style.animationPlayState = 'paused';
      });
    }
  
    onMount(() => {
      // Set CSS variables for star shadows
      document.documentElement.style.setProperty('--shadows-small', shadowsSmall);
      document.documentElement.style.setProperty('--shadows-medium', shadowsMedium);
      document.documentElement.style.setProperty('--shadows-big', shadowsBig);
  
      window.addEventListener("resize", () => {
        w = window.innerWidth;
        h = window.innerHeight;
      });
    });
  </script>
  
  <style>
    :global(html),
    :global(body) {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background: #150d35;
      padding: 0;
      margin: 0;
    }
  
    :global(*) {
      box-sizing: border-box;
    }
  
    :global(body) {
      background: #81a6e0;
      background: linear-gradient(to bottom, #81a6e0 0%, #cc7bc5 100%);
    }
  
    .stars-wrapper {
      opacity: 0.6;
      width: 100%;
      height: 100%;
      position: absolute;
      pointer-events: none;
    }
  
    /* Toggle button styles */
    .toggle-button {
      width: 40px;
      height: 40px;
      position: fixed;
      right: 20px;
      bottom: 20px;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 11;
      transition: transform 0.3s ease;
    }
  
    .toggle-button:hover {
      transform: scale(1.1);
    }
  
    .toggle-button svg {
      width: 24px;
      height: 24px;
      fill: #81a6e0;
    }
  
    /* Toggle panel styles */
    #toggle-wrapper {
      width: 230px;
      height: 90px;
      position: fixed;
      background-color: rgba(255, 255, 255, 0.8);
      right: 20px;
      bottom: 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Kodchasan", Arial, sans-serif;
      font-size: 18px;
      letter-spacing: 2px;
      color: #81a6e0;
      z-index: 10;
      transform: translateX(calc(100% + 20px));
      transition: transform 0.3s ease;
    }
  
    #toggle-wrapper.visible {
      transform: translateX(0);
    }
  
    #toggle-wrapper p {
      margin-top: 0;
      color: #BF85CB;
    }
  
    .toggle-container {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }
  
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      left: -99em;
    }
  
    .toggle {
      cursor: pointer;
      position: relative;
      width: 100px;
      height: 50px;
      background-color: #81A6E0;
      border-radius: 30px;
      transition: background-color 0.2s cubic-bezier(0.6, 0, 0.2, 1);
    }
  
    .toggle:before,
    .toggle:after {
      position: absolute;
      top: 15px;
    }
  
    .toggle:before {
      content: "OFF";
      left: -58px;
      color: #BF85CB;
    }
  
    .toggle:after {
      content: "ON";
      right: -48px;
      color: #81A6E0;
    }
  
    .moon-toggle {
      margin: 0;
      width: 100%;
      height: 100%;
      transform: rotate(95deg);
      transform-origin: 50% 50%;
      transition: all 0.5s cubic-bezier(0.6, 0, 0.2, 1);
    }
  
    .toggle-handler {
      margin: 0;
      position: relative;
      top: 3px;
      left: 3px;
      width: 44px;
      height: 44px;
      border-radius: 30px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
      transition: all 0.5s cubic-bezier(0.6, 0, 0.2, 1);
    }
  
    input:checked + .toggle {
      background-color: #BF85CB;
    }
  
    input:checked + .toggle:before {
      color: #81A6E0;
    }
  
    input:checked + .toggle:after {
      color: #BF85CB;
    }
  
    input:checked + .toggle .toggle-handler {
      transform: translateX(50px);
    }
  
    input:checked + .toggle .moon-toggle {
      transform: rotate(0deg);
    }
  
    /* Star animation */
    @keyframes animStar {
      from {
        transform: translateY(0px);
      }
      to {
        transform: translateY(-2000px);
      }
    }
  
    #stars {
      width: 1px;
      height: 1px;
      background: transparent;
      box-shadow: var(--shadows-small);
      animation: animStar 50s linear infinite;
      animation-play-state: paused;
    }
  
    #stars:after {
      content: " ";
      position: absolute;
      top: 2000px;
      width: 1px;
      height: 1px;
      background: transparent;
      box-shadow: var(--shadows-small);
    }
  
    #stars2 {
      width: 2px;
      height: 2px;
      background: transparent;
      box-shadow: var(--shadows-medium);
      animation: animStar 100s linear infinite;
      animation-play-state: paused;
    }
  
    #stars2:after {
      content: " ";
      position: absolute;
      top: 2000px;
      width: 2px;
      height: 2px;
      background: transparent;
      box-shadow: var(--shadows-medium);
    }
  
    #stars3 {
      width: 3px;
      height: 3px;
      background: transparent;
      box-shadow: var(--shadows-big);
      animation: animStar 150s linear infinite;
      animation-play-state: paused;
    }
  </style>
  
  <div class="stars-wrapper">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
  </div>
  
  <button class="toggle-button" on:click={togglePanel}>
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
    </svg>
  </button>
  
  <div id="toggle-wrapper" class={isPanelVisible ? 'visible' : ''}>
    <div>
      <p>animations</p>
      <div class="toggle-container">
        <input type="checkbox" id="toggle" on:change={checkStatus} />
        <label for="toggle" class="toggle">
          <div class="toggle-handler">
            <svg viewBox="0 0 103 105" class="moon-toggle">
              <g>
                <circle cx="51" cy="51" r="50" fill="none" stroke-miterlimit="10" stroke-width="2" />
                <circle cx="22.5" cy="43.5" r="6.4" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" />
                <circle cx="78.3" cy="42.4" r="12.1" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" />
                <circle cx="53.2" cy="74.3" r="7.3" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2" />
              </g>
            </svg>
          </div>
        </label>
      </div>
    </div>
  </div>
  