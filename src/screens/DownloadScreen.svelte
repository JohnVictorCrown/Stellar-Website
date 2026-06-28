<script lang="ts">
  import { marked } from 'marked';
  import { ArrowLeft, Twitter, Send, MessageCircle, Copy, Youtube, Droplet, ExternalLink, Shield, CheckCircle, Globe, Lightbulb, Briefcase, Users, TrendingUp, Brain, Eye, Download, Smartphone, Monitor, Sparkles, Star, Orbit, Compass, ChevronRight } from 'lucide-svelte';
  import { HOME_TOPICS } from '../data';
  import { RESUME_MARKDOWN } from '../data/resume';
  import { savePdf, openPdf } from '../pdf';
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

<main class="flex flex-col h-full overflow-y-auto no-scrollbar w-full items-center bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950">
  <!-- ═══════════════════════════════════════════════════ -->
  <!-- HERO SECTION                                       -->
  <!-- ═══════════════════════════════════════════════════ -->
  <section class="relative w-full min-h-[90dvh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
    <!-- Background orbs -->
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-tertiary)]/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style="animation-duration: 6s" />
    <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] animate-pulse pointer-events-none" style="animation-duration: 8s" />
    <div class="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] animate-pulse pointer-events-none" style="animation-duration: 10s" />

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />

    <!-- Decorative orbit rings -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.03] rounded-full pointer-events-none" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-white/[0.02] rounded-full pointer-events-none" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[var(--color-tertiary)]/[0.04] rounded-full pointer-events-none" />

    <div class="relative z-10 flex flex-col items-center text-center max-w-3xl">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 rounded-full text-[10px] lg:text-xs text-[var(--color-tertiary)]  uppercase tracking-[0.25em] mb-8">
        <Sparkles size={12} />
        <span>Now Available Everywhere</span>
      </div>

      <!-- Main headline -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-white leading-tight tracking-tight">
        <span class="block">Stellarium</span>
        <span class="block mt-1 bg-gradient-to-r from-[var(--color-tertiary)] via-[var(--color-secondary)] to-purple-400 bg-clip-text text-transparent">
          Foundation
        </span>
      </h1>

      <p class="mt-6 text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light">
        An institution to propel global wealth creation and wellness through innovative technology, strategic advising, and sovereign enterprise.
      </p>

      <!-- CTA buttons -->
      <div class="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <a
          href="/"
          class="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--color-tertiary)] to-emerald-400 text-black  rounded-full text-sm lg:text-base uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,255,255,0.5)]"
        >
          <Smartphone size={20} />
          Install App
          <ChevronRight size={18} />
        </a>
        <button
          onclick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          class="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-sm lg:text-base  uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <Compass size={18} />
          Explore
        </button>
      </div>

      <!-- Platform badges -->
      <div class="mt-12 flex flex-wrap items-center justify-center gap-6 opacity-60">
        <div class="flex items-center gap-2 text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest ">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M17.523 16.435c-.526 1.213-.786 1.754-1.469 2.827-.954 1.5-2.301 3.37-3.971 3.387-1.487.017-1.872-.963-3.875-.953-2 .01-2.422.972-3.91.954-1.671-.018-2.975-1.74-3.929-3.24-2.722-4.296-3.004-9.329-1.326-12.012 1.196-1.912 3.08-3.03 4.854-3.03 1.819 0 2.962 1.008 4.463 1.008 1.45 0 2.332-1.008 4.459-1.008 1.594 0 3.273.91 4.457 2.474-3.914 2.228-3.28 7.416.677 8.848l.022.012zM14.443 3.048c-.824.979-1.566 2.299-1.356 3.656.93.071 1.86-.327 2.539-1.252.645-.88 1.117-2.176.895-3.452-.89-.064-1.777.393-2.078 1.048z"/></svg>
          iOS
        </div>
        <div class="flex items-center gap-2 text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest ">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M17.523 16.435c-.526 1.213-.786 1.754-1.469 2.827-.954 1.5-2.301 3.37-3.971 3.387-1.487.017-1.872-.963-3.875-.953-2 .01-2.422.972-3.91.954-1.671-.018-2.975-1.74-3.929-3.24-2.722-4.296-3.004-9.329-1.326-12.012 1.196-1.912 3.08-3.03 4.854-3.03 1.819 0 2.962 1.008 4.463 1.008 1.45 0 2.332-1.008 4.459-1.008 1.594 0 3.273.91 4.457 2.474-3.914 2.228-3.28 7.416.677 8.848l.022.012zM14.443 3.048c-.824.979-1.566 2.299-1.356 3.656.93.071 1.86-.327 2.539-1.252.645-.88 1.117-2.176.895-3.452-.89-.064-1.777.393-2.078 1.048z"/></svg>
          Android
        </div>
        <div class="flex items-center gap-2 text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest ">
          <Monitor size={14} />
          Web / PWA
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="mt-16 animate-bounce">
        <ChevronRight size={24} class="rotate-90 text-gray-500" />
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- FEATURES SECTION                                  -->
  <!-- ═══════════════════════════════════════════════════ -->
  <section id="features" class="w-full max-w-5xl px-4 py-20 lg:py-28">
    <div class="text-center mb-16">
      <span class="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px]  uppercase tracking-[0.25em] text-gray-400 mb-4">Platform Features</span>
      <h2 class="text-2xl sm:text-3xl lg:text-4xl text-white font-normal">Everything in one ecosystem</h2>
      <p class="mt-3 text-sm lg:text-base text-gray-400 max-w-lg mx-auto">Access the full Stellarium knowledge and governance stack from any device.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {#each [
        { icon: BookOpen, title: 'Stellarium Library', desc: 'Access the full collection of foundational texts, strategy documents, and sovereign blueprints.' },
        { icon: PlayCircle, title: 'Media & Broadcasts', desc: 'Watch presentations, tutorials, and strategic briefings from the Stellarium Foundation.' },
        { icon: FileQuestion, title: 'Interactive Quizzes', desc: 'Test your understanding of wealth systems, governance models, and economic frameworks.' },
        { icon: CircleDollarSign, title: 'Sponsor & Support', desc: 'Contribute directly to the mission and track your impact on global initiatives.' },
        { icon: Mail, title: 'Secure Contact', desc: 'Reach out via encrypted channels — anonymous whistleblower portal available.' },
        { icon: Shield, title: 'Sovereign Tools', desc: 'Tor-secured anonymous messaging, WeChat integration, and decentralized communication.' },
      ]}
        <div class="group bg-zinc-950/60 border border-white/[0.06] hover:border-[var(--color-tertiary)]/30 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:bg-zinc-900/80">
          <div class="w-10 h-10 rounded-xl bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--color-tertiary)]/20 transition-colors">
            <svelte:component this={item.icon} size={20} class="text-[var(--color-tertiary)]" />
          </div>
          <h3 class="text-sm lg:text-base  text-white mb-2">{item.title}</h3>
          <p class="text-xs lg:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- STATS / NUMBERS SECTION                           -->
  <!-- ═══════════════════════════════════════════════════ -->
  <section class="w-full px-4 py-16 lg:py-24">
    <div class="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
      {#each [
        { num: '60+', label: 'Documents' },
        { num: '2', label: 'Official Books' },
        { num: '6', label: 'Platform Modules' },
        { num: '1', label: 'Foundation' },
      ] as stat}
        <div class="text-center">
          <div class="text-3xl lg:text-4xl xl:text-5xl  bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">{stat.num}</div>
          <div class="text-[10px] lg:text-xs text-gray-500 uppercase tracking-[0.2em]  mt-2">{stat.label}</div>
        </div>
      {/each}
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- TOPICS / INTERACTION GRID                         -->
  <!-- ═══════════════════════════════════════════════════ -->
  <section class="w-full max-w-md lg:max-w-xl xl:max-w-2xl px-4 py-16 lg:py-24 border-t border-white/5">
    <p class="text-center text-[var(--color-tertiary)] text-sm lg:text-base xl:text-lg font-medium uppercase tracking-wider mb-8">
      How would you like to interact?
    </p>

    <div class="grid grid-cols-3 gap-3 lg:gap-5 w-full mt-6 lg:mt-8">
      {#each HOME_TOPICS as topic}
        <button
          onclick={() => selectedTopic = topic}
          class="group relative flex flex-col items-center justify-center p-3 lg:p-5 h-20 lg:h-28 xl:h-32 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface)]/80 rounded-2xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(45,212,191,0.15)] hover:border-[var(--color-tertiary)]/40 active:scale-[0.96] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div class="absolute -inset-1 bg-[var(--color-tertiary)]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svelte:component this={iconMap[topic.icon]} size={22} class="text-[var(--color-secondary)] mb-1.5 lg:!w-8 lg:!h-8 xl:!w-9 xl:!h-9 relative z-10 group-hover:scale-110 group-hover:text-[var(--color-tertiary)] transition-all duration-300" />
          <span class="text-[10px] sm:text-xs lg:text-sm xl:text-base  text-white/80 group-hover:text-white uppercase tracking-wider text-center leading-tight line-clamp-2 px-1 relative z-10 transition-colors duration-300">{topic.title}</span>
        </button>
      {/each}
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- ORIGINAL HOME SCREEN CONTENT (EMBEDDED)           -->
  <!-- ═══════════════════════════════════════════════════ -->

  <!-- Core Enterprises -->
  <section class="w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center px-4 border-t border-white/10 pt-8 mt-4">
    <h3 class="text-xs lg:text-sm xl:text-base  uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-4">Core Enterprises</h3>
    <div class="w-full bg-[var(--color-surface)] border border-white/5 hover:border-[var(--color-tertiary)]/20 rounded-2xl p-5 lg:p-8 shadow-xl transition-all duration-300 relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-24 h-24 bg-[var(--color-tertiary)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-tertiary)]/10 transition-all duration-300 pointer-events-none" />
      <div class="flex flex-col gap-5 items-center text-center">
        <div class="p-3 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/20 rounded-full shrink-0">
          <Droplet size={22} class="animate-pulse" />
        </div>
        <div class="flex-1 min-w-0 text-center">
          <h4 class="text-sm  text-white tracking-wide flex items-center justify-center gap-1.5">
            Water Enterprises Website
            <span class="inline-block px-2 py-0.5 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/20 text-[9px]  rounded-full uppercase tracking-wider">Live</span>
          </h4>
          <p class="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
            A website for all things water with all water products and opportunities for investment, get to know!
          </p>
          <div class="mt-4 flex justify-center">
            <a
              href="https://water-enterprises-landing.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-tertiary)]/10 hover:bg-[var(--color-tertiary)]/20 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/30 rounded-xl text-xs  uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group/btn"
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
  </section>

  <!-- Water Suite / Projects & Products -->
  <section class="w-full max-w-3xl xl:max-w-4xl flex flex-col items-center px-4 border-t border-white/10 pt-8 mt-10">
    <h3 class="text-xs lg:text-sm xl:text-base  uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-2">The Water Suite</h3>
    <p class="text-center text-xs lg:text-sm text-gray-400 max-w-md mb-6">Revolutionary AI products designed to automate labor, democratize education, and engineer abundance — all under the Stellarium Foundation.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {#each [
        { title: 'Water Company', desc: 'Build and deploy autonomous AI companies with specialized AI agents working as your digital workforce.', link: 'https://www.notion.so/Water-Company-19bc1c04bbc180f188c1cd6f8d5c4681' },
        { title: 'Water Classroom', desc: 'Complete AI-powered school with interactive content, adaptive learning, and 24/7 AI tutoring for K-12 to undergraduate.', link: 'https://www.notion.so/Water-Classroom-19cc1c04bbc180b18720d5998a6b081d' },
        { title: 'Water AI', desc: 'The unified AI Supermodel that aggregates the world\'s best specialized AI capabilities into a single accessible platform.', link: 'https://www.notion.so/Water-AI-An-AI-Supermodel-184c1c04bbc180d0b23eefaad3f01c6a' },
        { title: 'Water Economics', desc: 'AI-powered foundational economic model that validates theories and simulates policy impacts on GDP, inflation, and markets.', link: 'https://www.notion.so/Water-Economics-An-Artificial-Intelligence-Economy-Foundational-Model-16bc1c04bbc18044b6cbfcdbcf242d4c' },
        { title: 'Water Robotics', desc: 'Teleoperated humanoid robots controlled remotely via VR headsets to supply labor for construction, mining, and manufacturing.', link: 'https://www.notion.so/Water-Robotics-1ecc1c04bbc180c49df0d2512b972226' },
        { title: 'Water AI Fluid', desc: 'Decentralized peer-to-peer computing network for AI model inferences, powering autonomous AI agents affordably.', link: 'https://www.notion.so/Water-AI-Fluid-1bac1c04bbc180e9ab7fc5568f53ef33' },
        { title: 'Water Coach', desc: 'AI-powered personal productivity coach that monitors your work and provides real-time tailored guidance.', link: 'https://www.notion.so/Water-Coach-1afc1c04bbc1804a980bdc0b32331a35' },
        { title: 'Water Gov', desc: 'Super app for all government services — business creation, taxes, citizenship, all AI-guided in one platform.', link: 'https://www.notion.so/Water-Gov-1fac1c04bbc180e0bddbd8a70714b532' },
      ]}
        <a href={item.link} target="_blank" rel="noopener noreferrer" class="group bg-zinc-950/60 hover:bg-zinc-900/80 border border-white/[0.06] hover:border-[var(--color-tertiary)]/30 rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <h4 class="text-sm lg:text-base  text-white group-hover:text-[var(--color-tertiary)] transition-colors">{item.title}</h4>
          <p class="text-xs lg:text-sm text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
        </a>
      {/each}
    </div>
    <div class="mt-6 w-full flex flex-col sm:flex-row gap-3">
      <a href="https://www.notion.so/The-Water-WATER-Token-Fueling-the-Elevation-to-Eden-200c1c04bbc18033b515da3d37df8c80" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-xs  uppercase tracking-wider text-cyan-300 hover:text-cyan-200 transition-all">
        <span>The WATER Token</span>
        <ExternalLink size={12} />
      </a>
      <a href="https://pump.fun/coin/E9ZX6jx1ottp2r8v98vt2JpUzzZnbMohaHcDnqenpump" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs  uppercase tracking-wider text-emerald-300 hover:text-emerald-200 transition-all">
        <span>Buy WATER on Pump.fun</span>
        <ExternalLink size={12} />
      </a>
    </div>
    <div class="mt-4 w-full flex flex-col sm:flex-row gap-3">
      <a href="https://www.notion.so/Investment-Opportunity-A-Portfolio-of-Transformative-AI-Robotics-Products-Poised-to-Redefine-Indu-1ffc1c04bbc180228703d32ec89c71c5" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl text-xs  uppercase tracking-wider text-yellow-300 hover:text-yellow-200 transition-all">
        <span>Investment Opportunity</span>
        <ExternalLink size={12} />
      </a>
      <a href="https://www.notion.so/Enterprise-Housing-Pledge-1a4c1c04bbc180518daaf78ef83966cc" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-xs  uppercase tracking-wider text-rose-300 hover:text-rose-200 transition-all">
        <span>Enterprise Housing Pledge</span>
        <ExternalLink size={12} />
      </a>
      <a href="https://www.notion.so/Stellarium-Mansion-And-Office-Fundraising-1aac1c04bbc180b4aa1bd77ecec414d6" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-xs  uppercase tracking-wider text-purple-300 hover:text-purple-200 transition-all">
        <span>Mansion & Office Fund</span>
        <ExternalLink size={12} />
      </a>
    </div>
  </section>

  <!-- Substack Promotion Banner -->
  <section class="w-full max-w-md lg:max-w-xl xl:max-w-2xl px-4 mt-8 mb-8">
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
        <span class="text-[10px] text-orange-400 font-mono tracking-[0.25em] uppercase  mb-1.5">EXCLUSIVE TRANSMISSIONS</span>
        <h4 class="text-base sm:text-lg  text-white tracking-wide mb-2 group-hover:text-orange-300 transition-colors">Subscribe to John Victor's Substack</h4>
        <p class="text-xs sm:text-sm text-gray-300 max-w-sm leading-relaxed mb-5">Get raw insights, system engineering frameworks, and strategic letters delivered directly to your inbox.</p>
        <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs  uppercase tracking-wider shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
          <span>Subscribe Now</span>
          <ExternalLink size={12} strokeWidth={2.5} />
        </div>
      </div>
    </a>
  </section>

  <!-- Secure Network -->
  <section class="w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center px-4 border-t border-white/10 pt-8">
    <h3 class="text-xs lg:text-sm xl:text-base  uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-4">Secure Network</h3>
    <div class="w-full bg-gradient-to-b from-[#18112c] to-[#0e0a1b] border border-purple-500/15 hover:border-[var(--color-tertiary)]/20 rounded-2xl p-5 shadow-2xl transition-all duration-300 relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300 pointer-events-none" />
      <div class="flex flex-col gap-4 items-center text-center">
        <div class="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full shrink-0">
          <Shield size={22} class="animate-pulse" />
        </div>
        <div class="flex-1 min-w-0 text-center w-full">
          <h4 class="text-sm  text-white tracking-wide flex items-center justify-center gap-1.5">
            Anonymous Messaging Portal
            <span class="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px]  rounded-full uppercase tracking-wider">Tor Secure</span>
          </h4>
          <p class="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
            A secure, anonymous whistleblower portal. Open this site inside the Tor Browser to guarantee absolute anonymity and complete metadata protection.
          </p>
          <div class="mt-4 flex flex-col gap-2.5 w-full">
            <a
              href="https://mural-bnyh.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 rounded-xl text-xs  uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md group/btn w-full justify-center"
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
              <span class="flex items-center gap-1 text-[9px]  text-purple-400 uppercase tracking-widest shrink-0">
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
  </section>

  <!-- Founder Profile -->
  <section class="w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center px-4 border-t border-white/10 pt-8 mt-10">
    <h3 class="text-xs lg:text-sm xl:text-base  uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-4">Founder Profile</h3>
    <div class="flex items-center gap-4 lg:gap-6 bg-[var(--color-surface)] border border-white/5 p-4 lg:p-6 rounded-2xl w-full mb-4">
      <img
        src={PHOTO_PATHS[photoIndex]}
        alt="John Victor"
        class="w-16 h-16 rounded-xl object-cover border border-white/10 bg-zinc-900 shadow-md"
        onerror={handlePhotoError}
        referrerpolicy="no-referrer"
      />
      <div class="flex-1 min-w-0 bg-transparent text-left">
        <h4 class="text-sm  text-white tracking-wide">John Victor</h4>
        <p class="text-[10px] text-[var(--color-secondary)]  uppercase tracking-widest mt-0.5">Founder & Wealth Activist</p>
        <p class="text-xs text-gray-400 mt-1 line-clamp-1">Propelling global wealth creation and sovereign enterprise systems.</p>
      </div>
    </div>
    <div class="flex gap-4 w-full justify-center">
      <button
        onclick={() => showResume = true}
        class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-surface)] border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
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
  </section>

  <!-- Connect With Us -->
  <section class="w-full max-w-md lg:max-w-xl xl:max-w-2xl flex flex-col items-center px-4 border-t border-white/10 pt-8 mt-10 mb-24">
    <h3 class="text-xs lg:text-sm xl:text-base  uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-6">Connect With Us</h3>
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
          <span class=" text-white text-[10px] leading-none">VK</span>
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
  </section>

  <!-- ═══════════════════════════════════════════════════ -->
  <!-- RESUME MODAL                                       -->
  <!-- ═══════════════════════════════════════════════════ -->
  {#if showResume}
    <div class="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl">
      <div class="flex items-center p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10 safe-top">
        <button onclick={() => showResume = false} class="p-2 text-white hover:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <h1 class="text-lg  text-white ml-4 truncate flex-1 text-center pr-10 hover:text-[var(--color-tertiary)] transition-colors">
          John Victor - Resume
        </h1>
      </div>
      <div class="flex-1 overflow-y-auto no-scrollbar px-4 sm:p-6 lg:p-10 xl:p-12 pb-32 flex flex-col items-center max-w-5xl lg:max-w-7xl mx-auto w-full">
        <div class="flex flex-col items-center mb-8 lg:mb-12">
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-red-650 via-pink-650 to-amber-600 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
            <div class="relative bg-black rounded-full p-1 border border-white/5">
              <img
                src={PHOTO_PATHS[photoIndex]}
                alt="John Victor"
                class="w-32 h-32 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-full object-cover shadow-2xl border border-white/10"
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
        <button
          onclick={() => savePdf('/resume.pdf', 'John_Victor_Resume.pdf')}
          class="mt-12 px-8 py-3 bg-[var(--color-tertiary)] text-black  rounded-full hover:bg-[var(--color-tertiary)]/90 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)] flex items-center gap-2 cursor-pointer"
        >
          <Download size={20} /> Download PDF Version
        </button>
      </div>
    </div>
  {/if}

  <BottomSheet isOpen={selectedTopic !== null} onClose={() => selectedTopic = null}>
    {#if selectedTopic}
      <div class="flex flex-col items-center">
        <svelte:component this={iconMap[selectedTopic.icon]} size={56} class="text-white" />
        <h2 class="text-2xl  text-white mt-6 text-center">{selectedTopic.subtitle}</h2>
        <div class="mt-8 space-y-4 text-[var(--color-on-surface)] text-[15px] leading-relaxed text-center whitespace-pre-wrap">
          {selectedTopic.description}
        </div>
        <div class="h-12" />
      </div>
    {/if}
  </BottomSheet>
</main>
