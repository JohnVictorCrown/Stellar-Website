import { mount } from 'svelte';
import App from './App.svelte';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

mount(App, { target: document.getElementById('root')! });
