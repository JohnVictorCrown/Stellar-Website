<script lang="ts">
  import { marked } from 'marked';
  import { ArrowLeft, Twitter, Send, MessageCircle, Copy, Youtube, Droplet, ExternalLink, Shield, CheckCircle, Globe, Lightbulb, Briefcase, Users, TrendingUp, Brain, Eye, Download } from 'lucide-svelte';
  import { HOME_TOPICS } from '../data';
  import { RESUME_MARKDOWN } from '../data/resume';
  import { savePdf } from '../pdf';
  import BottomSheet from '../components/BottomSheet.svelte';

  const iconMap: Record<string, any> = { Globe, Lightbulb, Briefcase, Users, TrendingUp, Brain };

  const PHOTO_PATHS = ['/john_victor.jpg'];

  let selectedTopic = $state<(typeof HOME_TOPICS)[0] | null>(null);
  let showResume = $state(false);
  let wechatCopied = $state(false);
  let playEnterpriseVideo = $state(false);
  let onionCopied = $state(false);
  let photoIndex = $state(0);

  let resumeHtml = $derived(marked.parse(RESUME_MARKDOWN, { async: false }) as string);

  function handlePhotoError() {
    if (photoIndex < PHOTO_PATHS.length - 1) photoIndex++;
  }

  function copyOnion() {
    navigator.clipboard.writeText("https://mural-bnyh.onrender.com/");
    onionCopied = true;
    setTimeout(() => onionCopied = false, 2500);
  }

  function copyWeChat() {
    navigator.clipboard.writeText("john_victor_0");
    wechatCopied = true;
    setTimeout(() => wechatCopied = false, 2000);
  }
</script>

<style>
  .resume-section {
    text-align: center;
  }
  .resume-section hr {
    margin: 2.5rem 0;
    border: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 255, 255, 0.3), transparent);
  }
  .resume-section h1 {
    font-size: 1.75rem;
    text-align: center;
    color: white;
    margin-bottom: 0.5rem;
    font-weight: 400;
  }
  .resume-section h2 {
    font-size: 1.2rem;
    color: #00FFFF;
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-weight: 400;
  }
  .resume-section h3 {
    font-size: 1rem;
    color: #E0B0FF;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 400;
  }
  .resume-section p {
    text-align: center;
    line-height: 1.7;
    margin-bottom: 0.75rem;
    color: #ccc;
    font-size: 0.9rem;
  }
  .resume-section ul {
    list-style: none;
    padding: 0;
    text-align: center;
  }
  .resume-section li {
    padding: 0.25rem 0;
    color: #bbb;
    font-size: 0.85rem;
    line-height: 1.6;
  }
  .resume-section strong, .resume-section b {
    color: white;
    font-weight: 400;
  }
  .resume-section em {
    color: #00FFFF;
    font-style: normal;
  }
  .resume-section a {
    color: #00FFFF;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .resume-section blockquote {
    text-align: center;
    color: #888;
    font-style: italic;
    padding: 1rem 0;
  }
</style>

{#if showResume}
  <div class="flex flex-col h-full bg-transparent overflow-hidden">
    <div class="flex items-center p-4 border-b border-white/10 sticky top-0 bg-black/60 backdrop-blur-md z-10 safe-top">
      <button onclick={() => showResume = false} class="p-2 text-white hover:text-gray-300">
        <ArrowLeft size={24} />
      </button>
      <h1 class="text-lg text-white ml-4 truncate flex-1 text-center pr-10 hover:text-[var(--color-tertiary)] transition-colors">
        John Victor - Resume
      </h1>
    </div>
    <div class="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-8 lg:px-12 pb-32 flex flex-col items-center max-w-3xl mx-auto w-full">
      <div class="resume-section w-full">
        {@html resumeHtml}
      </div>
      <button
        onclick={() => savePdf('/resume.pdf', 'John_Victor_Resume.pdf')}
        class="mt-10 px-8 py-3 bg-[var(--color-tertiary)] text-black rounded-full hover:bg-[var(--color-tertiary)]/90 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)] flex items-center gap-2 cursor-pointer"
      >
        <Download size={20} /> Download PDF Version
      </button>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center">
    <img
      src="/icons/icon-512.png"
      alt="Stellarium"
      class="w-16 h-16 lg:w-20 lg:h-20 mt-6 lg:mt-10"
    />

    <h1 class="text-3xl lg:text-5xl xl:text-6xl font-normal text-center mt-4 lg:mt-6 uppercase tracking-wider">
      Stellarium Foundation
    </h1>

    <div class="mt-4 lg:mt-8 flex items-center gap-2 justify-center flex-wrap">
      <a
        href="https://stellariumfoundation.github.io/StellarWebsite/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-tertiary)] to-emerald-400 text-black rounded-lg text-xs uppercase tracking-widest font-medium hover:scale-105 active:scale-95 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.523 14.342a.853.853 0 1 1-.002-1.706.853.853 0 0 1 .002 1.706zm-11.04 0a.853.853 0 1 1 .001-1.706.853.853 0 0 1-.001 1.706zm12.438-5.502l2.103-3.644a.359.359 0 1 0-.622-.36l-2.132 3.692A12.16 12.16 0 0 0 11.997 7.5a12.16 12.16 0 0 0-6.273 1.84L3.592 5.664a.358.358 0 1 0-.622.36l2.114 3.662C2.495 11.652.52 14.958.037 18.733a.09.09 0 0 0 .09.098h.318a.09.09 0 0 0 .09-.084c.443-3.648 2.32-6.826 4.943-9.12C7.486 8.152 9.71 7.5 12 7.5s4.514.652 6.522 2.127c2.623 2.294 4.5 5.472 4.943 9.12a.09.09 0 0 0 .09.084h.318a.09.09 0 0 0 .09-.098c-.483-3.775-2.458-7.081-5.042-9.893z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
        Install
      </a>
    </div>

    <p class="mt-8 lg:mt-12 text-center text-[var(--color-secondary)] text-lg lg:text-2xl xl:text-3xl max-w-sm lg:max-w-xl">
      An institution to propel global wealth creation and wellness.
    </p>

    <p class="mt-4 lg:mt-6 text-center text-sm lg:text-base xl:text-lg text-[var(--color-on-surface)] opacity-80 leading-relaxed max-w-md lg:max-w-xl xl:max-w-2xl">
      Through high-profile advising, technology, wisdom, and innovative fortitude, we implement commoditizing solutions in business, policy, finance, personal wealth creation, relationships, and branding.
    </p>

    <p class="mt-10 lg:mt-14 text-center text-[var(--color-tertiary)] text-sm lg:text-base xl:text-lg font-medium uppercase tracking-wider">
      How would you like to interact?
    </p>

    <div class="grid grid-cols-3 gap-3 lg:gap-5 w-full max-w-md lg:max-w-xl xl:max-w-2xl mt-6 lg:mt-8">
      {#each HOME_TOPICS as topic}
        <button
          onclick={() => selectedTopic = topic}
          class="group relative flex flex-col items-center justify-center p-3 lg:p-5 h-20 lg:h-28 xl:h-32 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface)]/80 rounded-2xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(45,212,191,0.15)] hover:border-[var(--color-tertiary)]/40 active:scale-[0.96] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div class="absolute -inset-1 bg-[var(--color-tertiary)]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svelte:component this={iconMap[topic.icon]} size={22} class="text-[var(--color-secondary)] mb-1.5 lg:!w-8 lg:!h-8 xl:!w-9 xl:!h-9 relative z-10 group-hover:scale-110 group-hover:text-[var(--color-tertiary)] transition-all duration-300" />
          <span class="text-[10px] sm:text-xs lg:text-sm xl:text-base text-white/80 group-hover:text-white uppercase tracking-wider text-center leading-tight line-clamp-2 px-1 relative z-10 transition-colors duration-300">{topic.title}</span>
        </button>
      {/each}
    </div>

    <!-- Water Enterprises Section -->
    <div class="mt-10 lg:mt-16 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-white/10 pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-4">Core Enterprises</h3>
      <div class="w-full bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-tertiary)]/20 rounded-2xl p-5 lg:p-8 shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-[var(--color-tertiary)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-tertiary)]/10 transition-all duration-300 pointer-events-none" />
        <div class="flex flex-col gap-5 items-center text-center">
          <div class="p-3 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/20 rounded-full shrink-0">
            <Droplet size={22} class="animate-pulse" />
          </div>
          <div class="flex-1 min-w-0 text-center">
            <h4 class="text-sm text-white tracking-wide flex items-center justify-center gap-1.5">
              Water Enterprises Website
              <span class="inline-block px-2 py-0.5 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/20 text-[9px] rounded-full uppercase tracking-wider">Live</span>
            </h4>
            <p class="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
              A website for all things water with all water products and opportunities for investment, get to know!
            </p>
            <div class="mt-4 flex justify-center">
              <a
                href="https://water-enterprises-landing.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-tertiary)]/10 hover:bg-[var(--color-tertiary)]/20 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/30 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group/btn"
              >
                <span>Visit Landing Platform</span>
                <ExternalLink size={14} class="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
          <div
            class="relative bg-black rounded-xl overflow-hidden border border-white/10 aspect-video transform-gpu cursor-pointer group/video shadow-lg w-full"
            onclick={() => playEnterpriseVideo = true}
          >
            {#if playEnterpriseVideo}
              <iframe
                src="https://www.youtube.com/embed/rk-eOwsRu7I?rel=0&modestbranding=1&autoplay=1"
                title="Water Enterprises Presentation"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="w-full h-full object-cover"
              />
            {:else}
              <div class="relative w-full h-full">
                <img
                  src="https://img.youtube.com/vi/rk-eOwsRu7I/hqdefault.jpg"
                  alt="Water Enterprises Presentation"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-[1.03]"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute inset-0 bg-black/45 group-hover/video:bg-black/55 transition-colors duration-300 flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-red-600/90 group-hover/video:bg-red-600 group-hover/video:scale-110 text-white flex items-center justify-center shadow-2xl transform transition-all duration-300 border border-white/10">
                    <svg class="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="1" stroke-linejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
        <div class="w-full flex justify-end mt-3">
          <a
            href="https://stellariumfoundation.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-[10px] lg:text-xs text-gray-500 hover:text-[var(--color-tertiary)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="shrink-0"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
            Substack
            <ExternalLink size={10} class="shrink-0" />
          </a>
        </div>
      </div>
    </div>


    <!-- Substack Promotion Banner -->
    <div class="w-full max-w-md lg:max-w-xl xl:max-w-2xl px-1 mt-4 lg:mt-8 mb-8">
      <a
        href="https://substack.com/@johnvictorcrown"
        target="_blank"
        rel="noopener noreferrer"
        class="relative block w-full overflow-hidden rounded-2xl border border-orange-500/25 bg-gradient-to-br from-[#1b110b] to-[#0c0805] p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:border-orange-500/40 hover:shadow-[0_12px_45px_rgba(255,107,0,0.18)] active:scale-[0.98] group"
      >
        <div class="absolute -inset-x-20 -top-40 h-80 bg-orange-500/10 blur-[90px] rounded-full group-hover:bg-orange-500/15 transition-all duration-500" />
        <div class="relative z-10 flex flex-col items-center">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 group-hover:bg-orange-500/25 group-hover:text-orange-300 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-5.5 h-5.5">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
          </div>
          <span class="text-[10px] text-orange-400 font-mono tracking-[0.25em] uppercase mb-1.5">EXCLUSIVE TRANSMISSIONS</span>
          <h4 class="text-base sm:text-lg text-white tracking-wide mb-2 group-hover:text-orange-300 transition-colors">Subscribe to John Victor's Substack</h4>
          <p class="text-xs sm:text-sm text-gray-300 max-w-sm leading-relaxed mb-5">Get raw insights, system engineering frameworks, and strategic letters delivered directly to your inbox.</p>
          <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
            <span>Subscribe Now</span>
            <ExternalLink size={12} strokeWidth={2.5} />
          </div>
        </div>
      </a>
    </div>
    

    <!-- Tor Anonymous Comms Section -->
    <div class="mt-10 lg:mt-16 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-white/10 pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-4">Secure Network</h3>
      <div class="w-full bg-gradient-to-b from-[#18112c] to-[#0e0a1b] border border-purple-500/15 hover:border-[var(--color-tertiary)]/20 rounded-2xl p-5 shadow-2xl transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300 pointer-events-none" />
        <div class="flex flex-col gap-4 items-center text-center">
          <div class="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full shrink-0">
            <Shield size={22} class="animate-pulse" />
          </div>
          <div class="flex-1 min-w-0 text-center w-full">
            <h4 class="text-sm text-white tracking-wide flex items-center justify-center gap-1.5">
              Anonymous Messaging Portal
              <span class="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] rounded-full uppercase tracking-wider">Tor Secure</span>
            </h4>
            <p class="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
              A secure, anonymous whistleblower portal. Open this site inside the Tor Browser to guarantee absolute anonymity and complete metadata protection.
            </p>
            <div class="mt-4 flex flex-col gap-2.5 w-full">
              <a
                href="https://mural-bnyh.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group/btn w-full justify-center"
              >
                <span>Launch Secure Portal</span>
                <ExternalLink size={14} class="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
              <div
                onclick={copyOnion}
                class="bg-black/40 hover:bg-black/60 border border-white/5 rounded-xl p-3 flex items-center justify-between w-full cursor-pointer transition-all select-all"
                title="Copy portal address"
              >
                <span class="font-mono text-[9.5px] text-purple-300 break-all select-all text-left truncate flex-1 pr-2">
                  mural-bnyh.onrender.com
                </span>
                <span class="flex items-center gap-1 text-[9px] text-purple-400 uppercase tracking-widest shrink-0">
                  {#if onionCopied}
                    <CheckCircle size={10} class="text-green-400" />
                    <span class="text-green-400">Copied</span>
                  {:else}
                    <Copy size={10} />
                    <span>Copy</span>
                  {/if}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 lg:mt-16 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-white/10 pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-4">Founder Profile</h3>
      <div class="flex items-center gap-4 lg:gap-6 bg-[var(--color-surface)] border border-white/5 p-4 lg:p-6 rounded-2xl w-full mb-4">
        <img
          src={PHOTO_PATHS[photoIndex]}
          alt="John Victor"
          class="w-16 h-16 rounded-xl object-cover border border-white/10 bg-zinc-900 shadow-md"
          onerror={handlePhotoError}
          referrerpolicy="no-referrer"
        />
        <div class="flex-1 min-w-0 bg-transparent text-left">
          <h4 class="text-sm text-white tracking-wide">John Victor</h4>
          <p class="text-[10px] text-[var(--color-secondary)] uppercase tracking-widest mt-0.5">Founder & Wealth Activist</p>
          <p class="text-xs text-gray-400 mt-1 line-clamp-1">Propelling global wealth creation and sovereign enterprise systems.</p>
        </div>
      </div>
      <div class="flex gap-4 w-full justify-center">
        <button
          onclick={() => showResume = true}
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
        >
          <Eye size={18} class="text-[var(--color-tertiary)]" /> Read Resume
        </button>
        <button
          onclick={() => savePdf('/resume.pdf', 'John_Victor_Resume.pdf')}
          class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Download size={18} class="text-[var(--color-secondary)]" /> Download PDF
        </button>
      </div>
    </div>

    <!-- Connect With Us -->
    <div class="mt-10 lg:mt-16 mb-24 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-white/10 pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-6">Connect With Us</h3>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full transform-gpu">
        <a href="https://tiktok.com/@johnvictorone" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-white group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span class="text-xs font-medium text-white truncate">John (TikTok)</span>
        </a>
        <a href="https://tiktok.com/@stellarium.foundation" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-white group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span class="text-xs font-medium text-white truncate">Stellarium (TikTok)</span>
        </a>
        <a href="https://t.me/JohnVictorOne" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <Send size={20} class="text-[#0088cc] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-white truncate">John (Telegram)</span>
        </a>
        <a href="https://t.me/StellariumActions" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <Send size={20} class="text-[#0088cc] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-white truncate">Stellarium (Telegram)</span>
        </a>
        <a href="https://youtube.com/@johnvictorwomen?si=CoeYDeowTy0gIQMi" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <Youtube size={20} class="text-[#FF0000] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-white truncate">John (YouTube)</span>
        </a>
        <a href="https://youtube.com/@stellariumfoundation?si=fZP8YYH6VrgGrZKV" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <Youtube size={20} class="text-[#FF0000] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-white truncate">Stellarium (YouTube)</span>
        </a>
        <a href="https://vk.ru/id1113302487" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <div class="bg-[#0077FF] p-1 rounded-md group-hover:scale-110 transition-transform flex-shrink-0 w-5 h-5 flex items-center justify-center will-change-transform">
            <span class="text-white text-[10px] leading-none">VK</span>
          </div>
          <span class="text-xs font-medium text-white truncate">VKontakte</span>
        </a>
        <button onclick={copyWeChat} class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group text-left transform-gpu">
          <MessageCircle size={20} class="text-[#07C160] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-white truncate flex-1">
            {#if wechatCopied}
              <span class="text-[#07C160]">Copied!</span>
            {:else}
              WeChat
            {/if}
          </span>
        </button>
        <a href="https://x.com/StellarFou4749" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-[var(--color-surface)] border border-white/5 rounded-xl hover:bg-white/5 transition-colors group transform-gpu">
          <Twitter size={20} class="text-white group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-white">X (Twitter)</span>
        </a>
      </div>
    </div>

    
  </div>
{/if}

<BottomSheet isOpen={selectedTopic !== null} onClose={() => selectedTopic = null}>
  {#if selectedTopic}
    <div class="flex flex-col items-center">
      <svelte:component this={iconMap[selectedTopic.icon]} size={56} class="text-white" />
      <h2 class="text-2xl text-white mt-6 text-center">{selectedTopic.subtitle}</h2>
      <div class="mt-8 space-y-4 text-[var(--color-on-surface)] text-[15px] leading-relaxed text-center whitespace-pre-wrap">
        {selectedTopic.description}
      </div>
      <div class="h-12" />
    </div>
  {/if}
</BottomSheet>
