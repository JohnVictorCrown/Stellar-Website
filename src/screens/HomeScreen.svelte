<script lang="ts">
  import { marked } from 'marked';
  import { ArrowLeft, Twitter, Send, MessageCircle, Copy, Youtube, Droplet, ExternalLink, Shield, CheckCircle, Globe, Lightbulb, Briefcase, Users, TrendingUp, Brain, Eye, Download } from 'lucide-svelte';
  import { HOME_TOPICS } from '../data';
  import { RESUME_MARKDOWN } from '../data/resume';
  import { savePdf } from '../pdf';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Card } from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Sheet from '$lib/components/ui/sheet/index.js';

  const iconMap: Record<string, any> = { Globe, Lightbulb, Briefcase, Users, TrendingUp, Brain };

  const PHOTO_PATHS = ['/john_victor.jpg'];

  let selectedTopic = $state<(typeof HOME_TOPICS)[0] | null>(null);
  let sheetOpen = $state(false);
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

{#if showResume}
  <div class="flex flex-col h-full bg-transparent overflow-hidden">
    <div class="flex items-center p-4 border-b border-border sticky top-0 bg-card/60 backdrop-blur-md z-10 safe-top">
      <Button variant="ghost" size="icon" onclick={() => showResume = false}>
        <ArrowLeft size={24} />
      </Button>
      <h1 class="text-lg font-semibold text-foreground ml-4 truncate flex-1 text-center pr-10 hover:text-primary transition-colors">
        John Victor - Resume
      </h1>
    </div>
    <div class="flex-1 overflow-y-auto no-scrollbar px-0 sm:p-6 lg:p-10 xl:p-12 pb-32 flex flex-col items-center max-w-5xl lg:max-w-7xl mx-auto w-full">
      <div class="flex flex-col items-center mb-8 lg:mb-12">
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-amber-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
          <div class="relative bg-black rounded-full p-1 border border-border">
            <img
              src={PHOTO_PATHS[photoIndex]}
              alt="John Victor"
              class="w-32 h-32 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-full object-cover shadow-2xl border border-border"
              onerror={handlePhotoError}
              referrerpolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      <div class="w-full">
        <div class="prose-custom">
          {@html resumeHtml}
        </div>
      </div>
      <Button onclick={() => savePdf('/resume.pdf', 'John_Victor_Resume.pdf')} class="mt-12 flex items-center gap-2">
        <Download size={20} /> Download PDF Version
      </Button>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full max-w-5xl lg:max-w-7xl mx-auto px-0 sm:p-6 lg:p-10 xl:p-12 items-center">
    <h1 class="text-3xl lg:text-5xl xl:text-6xl font-bold text-center mt-6 lg:mt-10 uppercase tracking-wider">
      Stellarium Foundation
    </h1>

    <div class="mt-4 lg:mt-8 flex gap-3 items-center justify-center">
      <a
        href="https://stellariumfoundation.github.io/Stellar-Website/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 lg:px-10 lg:py-4 bg-primary text-primary-foreground font-bold rounded-full text-sm lg:text-base uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]"
      >
        <Download size={18} /> Install Stellarium App
      </a>
    </div>

    <p class="mt-8 lg:mt-12 text-center font-bold text-secondary text-lg lg:text-2xl xl:text-3xl max-w-sm lg:max-w-xl">
      An institution to propel global wealth creation and wellness.
    </p>

    <p class="mt-4 lg:mt-6 text-center text-sm lg:text-base xl:text-lg text-muted-foreground leading-relaxed max-w-md lg:max-w-xl xl:max-w-2xl">
      Through high-profile advising, technology, wisdom, and innovative fortitude, we implement commoditizing solutions in business, policy, finance, personal wealth creation, relationships, and branding.
    </p>

    <p class="mt-10 lg:mt-14 text-center text-primary text-sm lg:text-base xl:text-lg font-medium uppercase tracking-wider">
      How would you like to interact?
    </p>

    <div class="grid grid-cols-3 gap-3 lg:gap-5 w-full max-w-md lg:max-w-xl xl:max-w-2xl mt-6 lg:mt-8">
      {#each HOME_TOPICS as topic}
        <Button
          variant="ghost"
          size="icon-lg"
          onclick={() => { selectedTopic = topic; sheetOpen = true; }}
          class="group flex flex-col items-center justify-center p-3 lg:p-5 h-20 lg:h-28 xl:h-32 rounded-2xl border-border shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(45,212,191,0.15)] hover:border-primary/40 active:scale-[0.96] transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div class="absolute -inset-1 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svelte:component this={iconMap[topic.icon]} size={22} class="text-secondary mb-1.5 lg:!w-8 lg:!h-8 xl:!w-9 xl:!h-9 relative z-10 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
          <span class="text-[10px] sm:text-xs lg:text-sm xl:text-base font-bold text-foreground/80 group-hover:text-foreground uppercase tracking-wider text-center leading-tight line-clamp-2 px-1 relative z-10 transition-colors duration-300">{topic.title}</span>
        </Button>
      {/each}
    </div>

    <!-- Water Enterprises Section -->
    <div class="mt-10 lg:mt-16 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-border pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Core Enterprises</h3>
      <Card class="w-full border-border/50 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-300 pointer-events-none" />
        <div class="flex flex-col gap-5 items-center text-center p-5 lg:p-8">
          <div class="p-3 bg-primary/10 text-primary border border-primary/20 rounded-full shrink-0">
            <Droplet size={22} class="animate-pulse" />
          </div>
          <div class="flex-1 min-w-0 text-center">
            <h4 class="text-sm font-bold text-foreground tracking-wide flex items-center justify-center gap-1.5">
              Water Enterprises Website
              <Badge variant="default">Live</Badge>
            </h4>
            <p class="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
              A website for all things water with all water products and opportunities for investment, get to know!
            </p>
            <div class="mt-4 flex justify-center">
              <a
                href="https://water-enterprises-landing.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group/btn"
              >
                <span>Visit Landing Platform</span>
                <ExternalLink size={14} class="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
          <div
            class="relative bg-black rounded-xl overflow-hidden border border-border aspect-video transform-gpu cursor-pointer group/video shadow-lg w-full"
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
                  <div class="w-12 h-12 rounded-full bg-red-600/90 group-hover/video:bg-red-600 group-hover/video:scale-110 text-white flex items-center justify-center shadow-2xl transform transition-all duration-300 border border-border">
                    <svg class="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="1" stroke-linejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
        <div class="w-full flex justify-end px-5 pb-3">
          <a
            href="https://stellariumfoundation.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-[10px] lg:text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="shrink-0"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
            Substack
            <ExternalLink size={10} class="shrink-0" />
          </a>
        </div>
      </Card>
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
          <span class="text-[10px] text-orange-400 font-mono tracking-[0.25em] uppercase font-black mb-1.5">EXCLUSIVE TRANSMISSIONS</span>
          <h4 class="text-base sm:text-lg font-bold text-white tracking-wide mb-2 group-hover:text-orange-300 transition-colors">Subscribe to John Victor's Substack</h4>
          <p class="text-xs sm:text-sm text-gray-300 max-w-sm leading-relaxed mb-5">Get raw insights, system engineering frameworks, and strategic letters delivered directly to your inbox.</p>
          <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
            <span>Subscribe Now</span>
            <ExternalLink size={12} strokeWidth={2.5} />
          </div>
        </div>
      </a>
    </div>

    <!-- Tor Anonymous Comms Section -->
    <div class="mt-10 lg:mt-16 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-border pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Secure Network</h3>
      <Card class="w-full border-purple-500/15 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300 pointer-events-none" />
        <div class="flex flex-col gap-4 items-center text-center p-5">
          <div class="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full shrink-0">
            <Shield size={22} class="animate-pulse" />
          </div>
          <div class="flex-1 min-w-0 text-center w-full">
            <h4 class="text-sm font-bold text-foreground tracking-wide flex items-center justify-center gap-1.5">
              Anonymous Messaging Portal
              <Badge variant="secondary">Tor Secure</Badge>
            </h4>
            <p class="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
              A secure, anonymous whistleblower portal. Open this site inside the Tor Browser to guarantee absolute anonymity and complete metadata protection.
            </p>
            <div class="mt-4 flex flex-col gap-2.5 w-full">
              <a
                href="https://mural-bnyh.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group/btn w-full justify-center"
              >
                <span>Launch Secure Portal</span>
                <ExternalLink size={14} class="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
              <div
                onclick={copyOnion}
                class="bg-black/40 hover:bg-black/60 border border-border rounded-xl p-3 flex items-center justify-between w-full cursor-pointer transition-all select-all"
                title="Copy portal address"
              >
                <span class="font-mono text-[9.5px] text-purple-300 break-all select-all text-left truncate flex-1 pr-2">
                  mural-bnyh.onrender.com
                </span>
                <span class="flex items-center gap-1 text-[9px] font-bold text-purple-400 uppercase tracking-widest shrink-0">
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
      </Card>
    </div>

    <div class="mt-10 lg:mt-16 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-border pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Founder Profile</h3>
      <Card class="flex flex-row items-center gap-4 lg:gap-6 p-4 lg:p-6 w-full mb-4">
        <img
          src={PHOTO_PATHS[photoIndex]}
          alt="John Victor"
          class="w-16 h-16 rounded-xl object-cover border border-border bg-zinc-900 shadow-md"
          onerror={handlePhotoError}
          referrerpolicy="no-referrer"
        />
        <div class="flex-1 min-w-0 text-left">
          <h4 class="text-sm font-bold text-foreground tracking-wide">John Victor</h4>
          <p class="text-[10px] text-secondary font-bold uppercase tracking-widest mt-0.5">Founder & Wealth Activist</p>
          <p class="text-xs text-muted-foreground mt-1 line-clamp-1">Propelling global wealth creation and sovereign enterprise systems.</p>
        </div>
      </Card>
      <div class="flex gap-4 w-full justify-center">
        <Button variant="ghost" class="flex-1" onclick={() => showResume = true}>
          <Eye size={18} class="text-primary" /> Read Resume
        </Button>
        <Button variant="ghost" class="flex-1" onclick={() => savePdf('/resume.pdf', 'John_Victor_Resume.pdf')}>
          <Download size={18} class="text-secondary" /> Download PDF
        </Button>
      </div>
    </div>

    <!-- Connect With Us -->
    <div class="mt-10 lg:mt-16 mb-24 w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center border-t border-border pt-8">
      <h3 class="text-xs lg:text-sm xl:text-base font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Connect With Us</h3>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full transform-gpu">
        <a href="https://tiktok.com/@johnvictorone" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-white group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span class="text-xs font-medium text-foreground truncate">John (TikTok)</span>
        </a>
        <a href="https://tiktok.com/@stellarium.foundation" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="text-white group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span class="text-xs font-medium text-foreground truncate">Stellarium (TikTok)</span>
        </a>
        <a href="https://t.me/JohnVictorOne" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <Send size={20} class="text-[#0088cc] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-foreground truncate">John (Telegram)</span>
        </a>
        <a href="https://t.me/StellariumActions" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <Send size={20} class="text-[#0088cc] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-foreground truncate">Stellarium (Telegram)</span>
        </a>
        <a href="https://youtube.com/@johnvictorwomen?si=CoeYDeowTy0gIQMi" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <Youtube size={20} class="text-[#FF0000] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-foreground truncate">John (YouTube)</span>
        </a>
        <a href="https://youtube.com/@stellariumfoundation?si=fZP8YYH6VrgGrZKV" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <Youtube size={20} class="text-[#FF0000] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-foreground truncate">Stellarium (YouTube)</span>
        </a>
        <a href="https://vk.ru/id1113302487" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <div class="bg-[#0077FF] p-1 rounded-md group-hover:scale-110 transition-transform flex-shrink-0 w-5 h-5 flex items-center justify-center will-change-transform">
            <span class="font-bold text-white text-[10px] leading-none">VK</span>
          </div>
          <span class="text-xs font-medium text-foreground truncate">VKontakte</span>
        </a>
        <button onclick={copyWeChat} class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group text-left transform-gpu cursor-pointer">
          <MessageCircle size={20} class="text-[#07C160] group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-foreground truncate flex-1">
            {#if wechatCopied}
              <span class="text-[#07C160]">Copied!</span>
            {:else}
              WeChat
            {/if}
          </span>
        </button>
        <a href="https://x.com/StellarFou4749" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors group transform-gpu">
          <Twitter size={20} class="text-foreground group-hover:scale-110 transition-transform flex-shrink-0 will-change-transform" />
          <span class="text-xs font-medium text-foreground">X (Twitter)</span>
        </a>
      </div>
    </div>
  </div>
{/if}

<Sheet.Root bind:open={sheetOpen} onOpenChange={(o) => { if (!o) { selectedTopic = null; } }}>
  <Sheet.Content side="bottom" class="max-h-[90vh]">
    <Sheet.Header>
      {#if selectedTopic}
        <div class="flex flex-col items-center pt-6 pb-2">
          <svelte:component this={iconMap[selectedTopic.icon]} size={56} class="text-primary" />
          <Sheet.Title class="text-2xl font-bold mt-6 text-center">{selectedTopic.subtitle}</Sheet.Title>
        </div>
      {/if}
    </Sheet.Header>
    <div class="px-6 pb-8 space-y-4 text-muted-foreground text-[15px] leading-relaxed text-center whitespace-pre-wrap">
      {selectedTopic?.description}
    </div>
  </Sheet.Content>
</Sheet.Root>
