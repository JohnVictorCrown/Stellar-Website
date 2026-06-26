<script lang="ts">
  import { Clapperboard, Eye, Calendar, ExternalLink, Youtube, Flame, Sparkles, Cpu, Compass, Heart, Play } from 'lucide-svelte';
  import { STELLARIUM_VIDEOS, type StellariumVideo } from '../media/videos';

  let playingMap = $state<Record<string, boolean>>({});

  function getYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function getThumbnailUrl(video: StellariumVideo): string | null {
    let id = getYouTubeId(video.youtubeUrl);
    if (!id) id = getYouTubeId(video.url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }

  function playVideo(id: string) {
    playingMap = { ...playingMap, [id]: true };
  }

  const spotlightVideo = STELLARIUM_VIDEOS.find(v => v.id === 'new8') || STELLARIUM_VIDEOS[0];

  const suiteIds = ['v_party', 'v_fluid', 'v_coach', 'v_economics'];
  const suiteVideos: StellariumVideo[] = suiteIds.map(id => STELLARIUM_VIDEOS.find(v => v.id === id)).filter(Boolean) as StellariumVideo[];

  const sections = [
    { title: 'Vision', icon: Compass, category: 'Vision', tintColor: 'text-[var(--color-secondary)]' },
    { title: 'Engineering', icon: Cpu, category: 'Engineering', tintColor: 'text-blue-400' },
    { title: 'Masterclasses', icon: Sparkles, category: 'Masterclass', tintColor: 'text-[var(--color-tertiary)]' },
    { title: 'Culture', icon: Heart, category: 'Culture', tintColor: 'text-rose-400' }
  ];

  function getVideosBySection(category: string) {
    return STELLARIUM_VIDEOS.filter(v => v.category === category && v.id !== spotlightVideo?.id && !suiteIds.includes(v.id));
  }
</script>

<div id="media-screen-root" class="flex flex-col h-full overflow-y-auto no-scrollbar w-full max-w-5xl lg:max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 xl:p-12 items-center bg-transparent">
  <div class="mb-6 lg:mb-10 flex flex-col items-center">
    <div class="bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/20 p-2.5 lg:p-3.5 rounded-full mb-3 shrink-0 animate-pulse">
      <Clapperboard size={24} class="lg:w-8 lg:h-8" />
    </div>
    <h1 class="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-normal text-center uppercase tracking-widest text-[var(--color-primary)]">Stellarium Portal</h1>
    <p class="text-center text-xs sm:text-sm lg:text-base xl:text-lg text-gray-400 mt-2 lg:mt-4 max-w-sm lg:max-w-xl xl:max-w-2xl tracking-wide leading-relaxed">
      Streaming high-velocity wisdom, engineering briefs, and cultural blueprints directly from our network directories.
    </p>
  </div>

  <div class="w-full max-w-5xl lg:max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-2 pb-32 lg:pb-40">
    <div class="lg:col-span-8 space-y-8">
      {#if spotlightVideo}
        <div class="bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface)]/80 border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
          <div class="absolute top-4 right-4 z-10">
            <span class="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow-lg">
              <Flame size={12} class="animate-pulse" />
              <span>Featured Release</span>
            </span>
          </div>
          <div class="mb-4">
            <span class="text-[10px] uppercase tracking-widest font-bold text-[var(--color-tertiary)]">{spotlightVideo.category} Category Spec</span>
            <h2 class="text-lg sm:text-xl font-bold text-white mt-1 leading-tight tracking-wide">{spotlightVideo.title}</h2>
          </div>
          <div
            class="relative bg-black rounded-xl overflow-hidden border border-white/5 aspect-video transform-gpu cursor-pointer group/spotlight shadow-2xl"
            onclick={() => { if (!playingMap[spotlightVideo.id]) playVideo(spotlightVideo.id); }}
          >
            {#if playingMap[spotlightVideo.id]}
              <iframe src={`${spotlightVideo.url}?rel=0&modestbranding=1&autoplay=1`} title={spotlightVideo.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full object-cover" />
            {:else}
              <div class="relative w-full h-full">
                <img src={getThumbnailUrl(spotlightVideo) || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800'} alt={spotlightVideo.title} class="w-full h-full object-cover transition-transform duration-700 group-hover/spotlight:scale-[1.02] select-none" referrerpolicy="no-referrer" />
                <div class="absolute inset-0 bg-black/40 group-hover/spotlight:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover/spotlight:scale-115 border border-white/15">
                    <svg class="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="1" stroke-linejoin="round" /></svg>
                  </div>
                </div>
                <div class="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md text-[9px] font-bold text-gray-200 uppercase tracking-widest font-mono">{spotlightVideo.duration}</div>
              </div>
            {/if}
          </div>
          <div class="mt-4 flex flex-col gap-3">
            <p class="text-xs text-gray-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">{spotlightVideo.description}</p>
            <div class="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-gray-400">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1"><Eye size={12} /> {spotlightVideo.views} views</span>
                <span class="flex items-center gap-1"><Calendar size={12} /> {spotlightVideo.date}</span>
              </div>
              <a href={spotlightVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg font-bold uppercase tracking-wider text-[9px] transition-all">
                <ExternalLink size={11} /><span>Watch On YouTube</span>
              </a>
            </div>
          </div>
        </div>
      {/if}

      {#if suiteVideos.length > 0}
        <div id="water-suite-showcase" class="bg-gradient-to-b from-[#0e1823] to-[#0a111a] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <span class="text-[9px] font-extrabold text-[var(--color-tertiary)] uppercase tracking-[0.2em] block">Advanced Project Portfolio Overview</span>
              <h3 class="text-md sm:text-lg font-bold text-white mt-1 uppercase tracking-widest flex items-center gap-2">
                <span class="text-blue-400">💧</span> The Water Automated Suite
              </h3>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/25 rounded-xl text-[9px] text-blue-300 font-extrabold uppercase tracking-widest self-start sm:self-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>4 Core Specs</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {#each suiteVideos as video}
              <div class="bg-[var(--color-surface)] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl duration-300 transition-all flex flex-col justify-between">
                <div class="relative bg-black aspect-video shrink-0 cursor-pointer overflow-hidden group/suite-video" onclick={() => { if (!playingMap[video.id]) playVideo(video.id); }}>
                  {#if playingMap[video.id]}
                    <iframe src={`${video.url}?rel=0&modestbranding=1&autoplay=1`} title={video.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full object-cover" />
                  {:else}
                    <div class="relative w-full h-full">
                      <img src={getThumbnailUrl(video) || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800'} alt={video.title} class="w-full h-full object-cover transition-transform duration-500 group-hover/suite-video:scale-[1.03]" referrerpolicy="no-referrer" />
                      <div class="absolute inset-0 bg-black/40 group-hover/suite-video:bg-black/50 transition-colors flex items-center justify-center">
                        <div class="w-12 h-12 rounded-full bg-blue-600 group-hover/suite-video:bg-blue-500 text-white flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover/suite-video:scale-105 border border-white/15">
                          <Play size={16} fill="currentColor" class="translate-x-0.5" />
                        </div>
                      </div>
                      <div class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 rounded text-[8px] font-mono font-bold text-gray-200 border border-white/10">{video.duration}</div>
                      <div class="absolute top-2 left-2 w-7 h-7 bg-black/70 rounded-lg flex items-center justify-center text-sm shadow-md border border-white/5 backdrop-blur-sm select-none">{video.thumbnail}</div>
                    </div>
                  {/if}
                </div>
                <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="text-[8px] font-bold text-blue-400 uppercase tracking-widest">{video.category} spec</span>
                      <span class="text-[8px] text-gray-500 font-semibold uppercase">{video.views} Views</span>
                    </div>
                    <h4 class="text-xs font-black text-white mt-0.5 line-clamp-1 leading-snug">{video.title}</h4>
                    <p class="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{video.description}</p>
                  </div>
                  <div class="flex items-center justify-between pt-2 border-t border-white/5">
                    <span class="text-[8px] text-gray-500 font-semibold uppercase tracking-wider block">SYSTEM: CORE SUITE</span>
                    <div class="flex items-center gap-2.5">
                      {#if video.id === 'v_party'}
                        <a href="https://github.com/StellariumFoundation/WaterParty-React/releases/tag/continuous-build-c3402110359c11ab1ac3612751700d1d427cb5e7" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[9px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded">
                          <span>GitHub</span><ExternalLink size={9} />
                        </a>
                      {/if}
                      <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[9px] font-black text-blue-400 hover:text-white transition-colors uppercase tracking-wider">
                        <span>YouTube Link</span><ExternalLink size={9} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="space-y-12">
        {#each sections as section}
          {@const sectionVideos = getVideosBySection(section.category)}
          {#if sectionVideos.length > 0}
            <div class="space-y-5">
              <div class="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <span class={`${section.tintColor} shrink-0`}>
                  <svelte:component this={section.icon} size={16} />
                </span>
                <h3 class="text-xs font-black text-white uppercase tracking-[0.2em]">{section.title} Spec Releases</h3>
                <span class="text-[10px] text-gray-500 font-mono ml-auto">{sectionVideos.length} Videos</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                {#each sectionVideos as video}
                  <div class="bg-[var(--color-surface)]/70 border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-white/15 flex flex-col">
                    <div class="relative bg-black overflow-hidden border-b border-white/5 aspect-video transform-gpu cursor-pointer group/minor-video shrink-0" onclick={() => { if (!playingMap[video.id]) playVideo(video.id); }}>
                      {#if playingMap[video.id]}
                        <iframe src={`${video.url}?rel=0&modestbranding=1&autoplay=1`} title={video.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full object-cover" />
                      {:else}
                        <div class="relative w-full h-full">
                          <img src={getThumbnailUrl(video) || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800'} alt={video.title} class="w-full h-full object-cover transition-transform duration-500 group-hover/minor-video:scale-[1.03]" referrerpolicy="no-referrer" />
                          <div class="absolute inset-0 bg-black/40 group-hover/minor-video:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                            <div class="w-11 h-11 rounded-full bg-red-600/90 group-hover/minor-video:bg-red-600 text-white flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover/minor-video:scale-110 border border-white/10">
                              <svg class="w-4.5 h-4.5 fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round" /></svg>
                            </div>
                          </div>
                          <div class="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm border border-white/10 rounded text-[8px] font-bold text-gray-300 font-mono">{video.duration}</div>
                        </div>
                      {/if}
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div class="flex items-center justify-between">
                          <span class="text-[8px] font-bold text-blue-400 uppercase tracking-wider block">{video.category} spec</span>
                          <span class="text-[8px] font-semibold text-gray-500">{video.date}</span>
                        </div>
                        <h3 class="text-xs font-bold text-white mt-1 leading-snug line-clamp-1">{video.title}</h3>
                        <p class="text-[11px] text-gray-400 mt-1 lines-clamp-2 line-clamp-2 leading-relaxed">{video.description}</p>
                      </div>
                      <div class="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] text-gray-400">
                        <span>{video.views} views</span>
                        <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" class="flex items-center gap-1 text-[var(--color-tertiary)] hover:text-white transition-colors uppercase tracking-wider font-bold">
                          <span>YouTube</span><ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <div class="lg:col-span-4 space-y-6">
      <div class="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 shadow-lg relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-all duration-300 pointer-events-none" />
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow relative shrink-0">
            <Youtube size={20} fill="currentColor" />
            <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-slate-900 flex items-center justify-center text-[7px] font-extrabold text-white">✓</span>
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-xs font-black text-white tracking-wide uppercase truncate block">Stellarium Media</span>
            <p class="text-[10px] text-gray-400 font-medium">@stellariumfoundation</p>
            <div class="flex items-center gap-1.5 mt-0.5 text-[9px] text-red-500 font-bold tracking-tight animate-pulse">
              <span>● 100K+ Subscribers</span>
            </div>
          </div>
        </div>
        <p class="text-[11px] text-gray-400 leading-relaxed">Explore decentralized systems, sovereign water automation and infrastructure, and community empowerment frameworks. Subscribe to support active philanthropy.</p>
        <a href="https://youtube.com/@stellariumfoundation?sub_confirmation=1" target="_blank" rel="noopener noreferrer" class="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-xl text-center tracking-wider uppercase transition-colors font-sans">Subscribe Channel</a>
      </div>

      <div class="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Official Playlists</h3>
        <div class="space-y-2.5">
          <a href="https://www.youtube.com/channel/UC6atIo9C5owrdZHLchGQ-Mg" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl transition-all group/list">
            <div class="text-left">
              <h4 class="text-xs font-bold text-white group-hover/list:text-[var(--color-tertiary)] transition-colors">Water Utilities Series</h4>
              <p class="text-[9px] text-gray-400 mt-0.5">Automated Aquatics & AI specs</p>
            </div>
            <ExternalLink size={12} class="text-gray-500 group-hover/list:text-white transition-colors" />
          </a>
          <a href="https://www.youtube.com/channel/UC6atIo9C5owrdZHLchGQ-Mg" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl transition-all group/list">
            <div class="text-left">
              <h4 class="text-xs font-bold text-white group-hover/list:text-[var(--color-tertiary)] transition-colors">Sovereign Governance</h4>
              <p class="text-[9px] text-gray-400 mt-0.5">Water Gov & Community models</p>
            </div>
            <ExternalLink size={12} class="text-gray-500 group-hover/list:text-white transition-colors" />
          </a>
          <a href="https://www.youtube.com/channel/UC6atIo9C5owrdZHLchGQ-Mg" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl transition-all group/list">
            <div class="text-left">
              <h4 class="text-xs font-bold text-white group-hover/list:text-[var(--color-tertiary)] transition-colors">Altruism & Culture Pledges</h4>
              <p class="text-[9px] text-gray-400 mt-0.5">Housing pledges & founder talks</p>
            </div>
            <ExternalLink size={12} class="text-gray-500 group-hover/list:text-white transition-colors" />
          </a>
        </div>
      </div>

      <div class="bg-[var(--color-surface)]/40 border border-white/5 rounded-2xl p-4 shadow-md text-left">
        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Streaming Statistics</span>
        <div class="grid grid-cols-2 gap-2 text-center">
          <div class="bg-black/20 p-2.5 rounded-lg border border-white/5">
            <span class="block text-xs text-gray-400 uppercase tracking-widest">Released</span>
            <span class="text-sm font-black text-white mt-1 block">16 Specs</span>
          </div>
          <div class="bg-black/20 p-2.5 rounded-lg border border-white/5">
            <span class="block text-xs text-gray-400 uppercase tracking-widest">Total Views</span>
            <span class="text-sm font-black text-[var(--color-tertiary)] mt-1 block">380K+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
