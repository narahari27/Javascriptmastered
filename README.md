.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f0f0f0;
}

::-webkit-scrollbar-thumb {
  background-color: #d6006e;
  border-radius: 4px;
  border: 2px solid #f0f0f0;
}

/* Custom scrollbar for Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #d6006e #f0f0f0;
}


.name-icons {
  display: flex;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d6006e;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-size: 16px;
}

.icon-small {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #d6006e;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  font-size: 10px;
}

.icon::before, .icon-small::before {
  content: '';
}

.icon::after, .icon-small::after {
  content: '';
}
