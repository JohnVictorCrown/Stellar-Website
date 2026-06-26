<script lang="ts">
  import MarkdownIt from 'markdown-it';
  import { ArrowLeft, BookOpen, ExternalLink, Download, Sparkles, Star, Orbit, Compass } from 'lucide-svelte';
  import { openPdf, savePdf } from '../pdf';

  type StellariumDocument = {
    title: string;
    content: string;
    notion_url: string | null;
    comment_from_index: string | null;
  };

  const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    typographer: true,
  });

  const defaultRender = md.renderer.rules;

  function wrapRule(tag: string, cls: string, before = '', after = ''): any {
    const orig = defaultRender[tag];
    return function (tokens: any[], idx: number, options: any, env: any, self: any) {
      const token = tokens[idx];
      const content = orig ? orig(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
      if (token.nesting === 1) {
        if (tag === 'heading_open') {
          const depth = token.tag.slice(1);
          const inner = tokens[idx + 1]?.content || '';
          token.attrJoin('class', cls);
          return `<${token.tag} class="${cls}">${before}${inner}${after}</${token.tag}>`;
        }
        token.attrJoin('class', cls);
      }
      if (tag === 'paragraph_open' && token.nesting === 1) {
        token.attrJoin('class', cls);
      }
      return content;
    };
  }

  md.renderer.rules.heading_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    const depth = token.tag.slice(1);
    const icons: Record<string, string> = { '1': '✦', '2': '◇', '3': '▸' };
    const icon = icons[depth] || '';
    const textToken = tokens[idx + 1];
    const text = textToken?.content || '';
    textToken.content = `${icon} ${text} ${depth === '1' || depth === '2' ? icon : ''}`.trim();
    token.attrJoin('class', `stellarium-h${depth}`);
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.paragraph_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    if (token.nesting === 1) token.attrJoin('class', 'stellarium-p');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.blockquote_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-blockquote');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.bullet_list_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-ul');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.ordered_list_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-ol');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.list_item_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-li');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-link');
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.image = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    token.attrJoin('class', 'stellarium-img');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.fence = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    return `<pre class="stellarium-code"><code>${md.utils.escapeHtml(token.content)}</code></pre>`;
  };

  md.renderer.rules.code_inline = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    return `<code class="stellarium-codespan">${md.utils.escapeHtml(tokens[idx].content)}</code>`;
  };

  md.renderer.rules.hr = function () {
    return `<hr class="stellarium-hr" />`;
  };

  md.renderer.rules.em_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-em');
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.strong_open = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'stellarium-strong');
    return self.renderToken(tokens, idx, options);
  };

  function renderMarkdown(content: string): string {
    try {
      return md.render(content);
    } catch (e) {
      console.error('Markdown render error', e);
      return `<pre style="color:rgba(255,255,255,0.7);text-align:left;white-space:pre-wrap;">${md.utils.escapeHtml(content)}</pre>`;
    }
  }

  let selectedBook = $state<StellariumDocument | null>(null);
  let allBooks = $state<StellariumDocument[]>([]);
  let groupedBooks = $state<Record<string, StellariumDocument[]>>({});
  let isLoading = $state(true);
  let errorMsg = $state<string | null>(null);
  let hasAutoOpened = $state(false);

  let { bookTitle = null }: { bookTitle?: string | null } = $props();

  let mainContainer: HTMLDivElement | undefined = $state();
  let readerContainer: HTMLDivElement | undefined = $state();
  let isMainScrollRestored = $state(false);
  let readerRestoredFor = $state<string | null>(null);

  $effect(() => {
    if (selectedBook) {
      localStorage.setItem('stellarium_active_book', selectedBook.title);
      window.history.pushState({}, '', '/library/' + encodeURIComponent(selectedBook.title));
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      localStorage.removeItem('stellarium_active_book');
      if (bookTitle) {
        window.history.pushState({}, '', '/library');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  });

  function copyBookLink(title: string) {
    const url = window.location.origin + '/library/' + encodeURIComponent(title);
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.activeElement as HTMLElement | null;
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      }
    }).catch(console.warn);
  }

  $effect(() => {
    if (!isLoading && !selectedBook && mainContainer) {
      const savedScroll = localStorage.getItem('stellarium_library_scroll');
      if (savedScroll) {
        const scrollTop = parseFloat(savedScroll);
        setTimeout(() => {
          if (mainContainer) mainContainer.scrollTop = scrollTop;
          isMainScrollRestored = true;
        }, 120);
      } else {
        isMainScrollRestored = true;
      }
    }
  });

  $effect(() => {
    if (selectedBook && readerContainer) {
      readerRestoredFor = '';
      const savedScroll = localStorage.getItem(`stellarium_book_scroll_${selectedBook.title}`);
      if (savedScroll) {
        const scrollTop = parseFloat(savedScroll);
        setTimeout(() => {
          if (readerContainer && readerRestoredFor === '') {
            readerContainer.scrollTop = scrollTop;
            readerRestoredFor = selectedBook.title;
          }
        }, 120);
      } else {
        if (readerContainer) readerContainer.scrollTop = 0;
        readerRestoredFor = selectedBook.title;
      }
    } else {
      readerRestoredFor = null;
    }
  });

  function handleMainScroll(e: Event) {
    const el = e.currentTarget as HTMLDivElement;
    if (!selectedBook && isMainScrollRestored) {
      localStorage.setItem('stellarium_library_scroll', el.scrollTop.toString());
    }
  }

  function handleReaderScroll(e: Event) {
    const el = e.currentTarget as HTMLDivElement;
    if (selectedBook && readerRestoredFor === selectedBook.title) {
      localStorage.setItem(`stellarium_book_scroll_${selectedBook.title}`, el.scrollTop.toString());
    }
  }

  function processBooks(books: StellariumDocument[]) {
    allBooks = books;
    const indexBook = books.find(b => b.title.trim().toLowerCase() === "stellarium literature");

    if (!indexBook) {
      const sorted = [...books].sort((a, b) => a.title.localeCompare(b.title));
      groupedBooks = { "All Literature": sorted };
      return;
    }

    const categorizedMap: Record<string, StellariumDocument[]> = {};
    const booksByTitle: Record<string, StellariumDocument> = {};
    books.forEach(b => { booksByTitle[b.title.trim().toLowerCase()] = b; });

    const assignedTitles = new Set<string>();
    assignedTitles.add(indexBook.title.trim().toLowerCase());

    const lines = indexBook.content.split('\n');
    let currentCategory = "General";
    const linkPattern = /\[(.*?)\]\(.*?\)/;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
        currentCategory = trimmed.substring(2, trimmed.length - 2).trim();
        continue;
      }
      const match = trimmed.match(linkPattern);
      if (match && match[1]) {
        const extractedTitle = match[1].trim();
        const book = booksByTitle[extractedTitle.toLowerCase()];
        if (book) {
          if (!categorizedMap[currentCategory]) categorizedMap[currentCategory] = [];
          categorizedMap[currentCategory].push(book);
          assignedTitles.add(book.title.trim().toLowerCase());
        }
      }
    }

    const unassigned = books.filter(b => !assignedTitles.has(b.title.trim().toLowerCase()));
    if (unassigned.length > 0) categorizedMap["Other Resources"] = unassigned;
    groupedBooks = categorizedMap;
  }

  function loadData() {
    let loadedBooks: StellariumDocument[] = [];
    let hasLoadedFromCache = false;

    try {
      const cached = localStorage.getItem('stellarium_literature_cache');
      if (cached) {
        const parsed = JSON.parse(cached) as StellariumDocument[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          processBooks(parsed);
          loadedBooks = parsed;
          isLoading = false;
          hasLoadedFromCache = true;
        }
      }
    } catch (e) {
      console.warn("Error parsing literature cache", e);
    }

    async function fetchBooks() {
      try {
        const res = await fetch('/literature.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const books: StellariumDocument[] = await res.json();
        try { localStorage.setItem('stellarium_literature_cache', JSON.stringify(books)); } catch (e) { console.warn("Failed to write cache", e); }
        processBooks(books);
        loadedBooks = books;
        errorMsg = null;
      } catch (e: any) {
        console.error(e);
        if (!hasLoadedFromCache) errorMsg = `Error loading library. Ensure 'literature.json' exists. ${e.message}`;
      } finally {
        isLoading = false;
        if (loadedBooks.length > 0) {
          const activeTitle = localStorage.getItem('stellarium_active_book');
          if (activeTitle) {
            const active = loadedBooks.find(b => b.title === activeTitle);
            if (active) selectedBook = active;
          }
          if (bookTitle && !hasAutoOpened) {
            const match = loadedBooks.find(b => b.title === bookTitle);
            if (match) { selectedBook = match; hasAutoOpened = true; }
            else { hasAutoOpened = true; }
          }
        }
      }
    }

    fetchBooks();
  }

  $effect(loadData);
</script>

{#if selectedBook}
  <div class="flex flex-col h-full bg-transparent overflow-hidden w-full">
    <div class="flex items-center p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10 safe-top">
      <button onclick={() => selectedBook = null} class="p-2 text-white hover:text-[var(--color-tertiary)] transition-colors rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer" title="Go Back">
        <ArrowLeft size={24} />
      </button>
      <div class="flex-1 min-w-0 flex items-center justify-center gap-2">
        <Compass size={18} class="text-[var(--color-tertiary)] animate-pulse shrink-0 hidden sm:inline" />
        <h1 class="text-base sm:text-lg font-bold text-white truncate text-center max-w-xl">{selectedBook.title}</h1>
        <Compass size={18} class="text-[var(--color-tertiary)] animate-pulse shrink-0 hidden sm:inline" />
      </div>
      <button onclick={() => copyBookLink(selectedBook.title)} class="p-2 text-gray-400 hover:text-[var(--color-tertiary)] transition-colors rounded-lg hover:bg-white/5 active:scale-95 cursor-pointer" title="Copy Link to This Book">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>
    </div>
    <div bind:this={readerContainer} onscroll={handleReaderScroll} class="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-32 flex flex-col items-center w-full no-scrollbar">
      <div class="w-full max-w-5xl bg-zinc-950/60 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-12 md:p-16 backdrop-blur-md">
        <div class="prose-book">
          {@html renderMarkdown(selectedBook.content)}
        </div>
        {#if selectedBook.notion_url}
          <div class="flex justify-center mt-12 pt-6 border-t border-white/5">
            <a href={selectedBook.notion_url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-tertiary)] text-black font-semibold rounded-full hover:bg-[var(--color-tertiary)]/95 transition-all shadow-[0_0_20px_rgba(0,255,255,0.25)] hover:scale-[1.03] active:scale-[0.97]">
              <span>Read Original on Notion</span>
              <ExternalLink size={16} />
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div bind:this={mainContainer} onscroll={handleMainScroll} class="flex flex-col h-full overflow-y-auto no-scrollbar w-full max-w-5xl lg:max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 xl:p-12 items-center">
    <div class="w-full max-w-6xl mt-2 lg:mt-6 flex flex-col items-center">
      <div class="flex items-center gap-3 lg:gap-6 mb-2 justify-center">
        <Orbit class="text-[var(--color-tertiary)] animate-[spin_20s_linear_infinite] shrink-0" size={32} />
        <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-normal text-center tracking-wide uppercase">Stellarium Library</h1>
        <Orbit class="text-[var(--color-tertiary)] animate-[spin_20s_linear_infinite] shrink-0" size={32} />
      </div>
      <p class="text-xs sm:text-sm lg:text-base xl:text-lg text-[var(--color-on-background)] opacity-85 text-center max-w-xl lg:max-w-2xl mb-8 lg:mb-12 leading-relaxed">
        Access foundational source texts, universal philosophies, strategic guides, and sovereign blueprints curated by the Stellarium Foundation.
      </p>
    </div>
    <div class="w-full max-w-6xl mt-2 lg:mt-6 space-y-12 lg:space-y-16 pb-32">
      {#if isLoading}
        <div class="flex justify-center items-center h-48">
          <div class="w-8 h-8 border-4 border-[var(--color-tertiary)] border-t-transparent rounded-full animate-spin" />
        </div>
      {/if}
      {#if errorMsg}
        <div class="text-red-400 text-center p-4 bg-red-900/20 border border-red-900/50 rounded-xl max-w-md mx-auto">{errorMsg}</div>
      {/if}
      {#if !isLoading && !errorMsg}
        <div class="w-full">
          <h2 class="text-sm lg:text-base xl:text-lg font-black text-[var(--color-secondary)] uppercase tracking-[0.25em] text-center mb-6">Official Books (PDF)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-5xl lg:max-w-6xl mx-auto">
            <div class="bg-gradient-to-br from-zinc-950/80 to-zinc-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] group hover:border-[var(--color-tertiary)]/40 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all duration-300 flex flex-col sm:flex-row">
              <div class="sm:w-32 lg:w-40 bg-gradient-to-b from-indigo-950 via-purple-950 to-zinc-950 p-6 lg:p-8 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-white/10 relative overflow-hidden shrink-0 min-h-[120px]">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12)_0,transparent_100%)]" />
                <BookOpen size={40} class="text-[var(--color-tertiary)] relative z-10 animate-pulse" />
                <span class="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-4 text-center select-none relative z-10 font-mono">Volume I</span>
              </div>
              <div class="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-base lg:text-lg xl:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[var(--color-tertiary)] transition-colors">The Stellarium Book</h3>
                  <p class="text-xs lg:text-sm xl:text-base text-gray-400 mb-6 leading-relaxed">The foundational text detailing the architecture of universal human sovereignty, cosmic alignment and gold-backed standard systems.</p>
                </div>
                <div class="space-y-3">
                  <div class="flex gap-3 w-full">
                    <button onclick={() => openPdf('/The.Stellarium.Book.pdf', 'The.Stellarium.Book.pdf')} class="flex-1 flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)]/25 border border-[var(--color-tertiary)]/30 rounded-xl text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer">
                      <ExternalLink size={14} /> Open
                    </button>
                    <button onclick={() => savePdf('/The.Stellarium.Book.pdf', 'The.Stellarium.Book.pdf')} class="flex-1 flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15 hover:text-white rounded-xl text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer">
                      <Download size={14} /> Save
                    </button>
                  </div>
                  <div class="pt-2 border-t border-white/5 flex justify-center">
                    <a href="https://www.everand.com/book/897831454/The-Stellarium-Book" target="_blank" rel="noopener noreferrer" class="text-[10px] lg:text-xs text-[var(--color-secondary)] hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-1">
                      Read on Everand <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-zinc-950/80 to-zinc-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] group hover:border-[var(--color-tertiary)]/40 hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all duration-300 flex flex-col sm:flex-row">
              <div class="sm:w-32 lg:w-40 bg-gradient-to-b from-purple-950 via-emerald-950 to-zinc-950 p-6 lg:p-8 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-white/10 relative overflow-hidden shrink-0 min-h-[120px]">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.12)_0,transparent_100%)]" />
                <BookOpen size={40} class="text-[var(--color-tertiary)] relative z-10" />
                <span class="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-4 text-center select-none relative z-10 font-mono">Volume II</span>
              </div>
              <div class="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-base lg:text-lg xl:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[var(--color-tertiary)] transition-colors">The Stellarium Society</h3>
                  <p class="text-xs lg:text-sm xl:text-base text-gray-400 mb-6 leading-relaxed">The active manifest and blueprint for self-organized localized sovereign hubs, shared wealth systems, and collective growth circles.</p>
                </div>
                <div class="flex gap-3 w-full">
                  <button onclick={() => openPdf('/Stellarium.Society.pdf', 'Stellarium.Society.pdf')} class="flex-1 flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] hover:bg-[var(--color-tertiary)]/25 border border-[var(--color-tertiary)]/30 rounded-xl text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer">
                    <ExternalLink size={14} /> Open
                  </button>
                  <button onclick={() => savePdf('/Stellarium.Society.pdf', 'Stellarium.Society.pdf')} class="flex-1 flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15 hover:text-white rounded-xl text-xs lg:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer">
                    <Download size={14} /> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-px bg-white/10 w-full my-8 max-w-5xl mx-auto" />
        <div class="space-y-12 w-full">
          {#each Object.entries(groupedBooks) as [category, books]}
            <div class="w-full">
              <div class="flex items-center gap-3 justify-center mb-8 border-b border-white/5 pb-3">
                <Sparkles size={14} class="text-[var(--color-tertiary)] animate-pulse shrink-0" />
                <h2 class="text-sm font-black text-white uppercase tracking-[0.25em]">{category}</h2>
                <Sparkles size={14} class="text-[var(--color-tertiary)] animate-pulse shrink-0" />
              </div>
              <div class="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
                {#each books as book, idx}
                  <button
                    onclick={() => selectedBook = book}
                    class="group relative bg-zinc-950/60 hover:bg-zinc-900/90 border border-white/10 hover:border-[var(--color-tertiary)]/45 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none min-h-[160px] md:min-h-[180px] shadow-2xl hover:shadow-[0_12px_45px_rgba(0,255,255,0.12)] overflow-hidden w-full focus:ring-2 focus:ring-[var(--color-tertiary)]/35"
                  >
                    <div class="absolute right-6 bottom-4 opacity-[0.03] group-hover:opacity-[0.09] group-hover:scale-125 transition-all duration-500 text-white select-none pointer-events-none">
                      <Orbit size={110} />
                    </div>
                    <div class="w-full flex flex-col items-center">
                      <div class="flex items-center justify-center gap-2.5 mb-4">
                        <div class="p-3 bg-white/5 rounded-2xl text-[var(--color-secondary)] group-hover:bg-[var(--color-tertiary)]/15 group-hover:text-[var(--color-tertiary)] transition-colors">
                          <BookOpen size={20} />
                        </div>
                        <span class="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">SECURE TRANSMISSION</span>
                      </div>
                      <h3 class="text-base sm:text-xl font-normal text-white group-hover:text-[var(--color-tertiary)] transition-colors text-center max-w-2xl leading-snug">{book.title}</h3>
                    </div>
                    {#if book.comment_from_index}
                      <p class="text-xs sm:text-sm text-gray-300 mt-4 italic text-center leading-relaxed border-t border-white/5 pt-4 w-full max-w-xl">&ldquo;{book.comment_from_index}&rdquo;</p>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(.prose-book) {
    text-align: center;
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.92rem;
    line-height: 1.8;
    max-width: 720px;
    margin: 0 auto;
    padding: 0.5rem 0;
  }
  :global(.prose-book .stellarium-h1) {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--color-primary, #a78bfa);
    margin: 1.5rem 0 0.85rem;
    letter-spacing: 0.04em;
    text-shadow: 0 0 30px rgba(167, 139, 250, 0.15);
  }
  :global(.prose-book .stellarium-h2) {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-secondary, #67e8f9);
    margin: 1.25rem 0 0.75rem;
    letter-spacing: 0.03em;
    text-shadow: 0 0 20px rgba(103, 232, 249, 0.12);
  }
  :global(.prose-book .stellarium-h3) {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-tertiary, #2dd4bf);
    margin: 1rem 0 0.5rem;
    letter-spacing: 0.02em;
  }
  :global(.prose-book .stellarium-p) {
    margin: 0.85rem 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.82);
  }
  :global(.prose-book .stellarium-blockquote) {
    margin: 1.25rem auto;
    padding: 0.75rem 1.25rem;
    border-left: 3px solid var(--color-tertiary, #2dd4bf);
    background: rgba(45, 212, 191, 0.06);
    border-radius: 0 12px 12px 0;
    color: rgba(255, 255, 255, 0.75);
    font-style: italic;
    max-width: 600px;
    text-align: center;
  }
  :global(.prose-book .stellarium-ul) {
    list-style: none;
    padding: 0;
    margin: 0.75rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  :global(.prose-book .stellarium-ol) {
    padding: 0;
    margin: 0.75rem auto 0.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
  :global(.prose-book .stellarium-li) {
    padding: 0.15rem 0;
  }
  :global(.prose-book .stellarium-ul .stellarium-li) {
    text-align: center;
  }
  :global(.prose-book .stellarium-ul .stellarium-li::before) {
    content: "◇";
    color: var(--color-tertiary, #2dd4bf);
    margin-right: 0.5rem;
    font-size: 0.7rem;
  }
  :global(.prose-book .stellarium-link) {
    color: var(--color-tertiary, #2dd4bf);
    text-decoration: none;
    border-bottom: 1px solid rgba(45, 212, 191, 0.3);
    transition: all 0.2s;
    word-break: break-word;
  }
  :global(.prose-book .stellarium-link:hover) {
    border-bottom-color: var(--color-tertiary, #2dd4bf);
    text-shadow: 0 0 12px rgba(45, 212, 191, 0.25);
  }
  :global(.prose-book .stellarium-img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 1.25rem auto;
    display: block;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  :global(.prose-book .stellarium-code) {
    display: block;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--color-tertiary, #2dd4bf);
    overflow-x: auto;
    text-align: left;
    margin: 1rem auto;
    max-width: 600px;
    line-height: 1.6;
  }
  :global(.prose-book .stellarium-codespan) {
    background: rgba(45, 212, 191, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.15);
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    font-family: monospace;
    font-size: 0.85em;
    color: var(--color-tertiary, #2dd4bf);
  }
  :global(.prose-book .stellarium-code code) {
    background: none;
    border: none;
    padding: 0;
    border-radius: 0;
  }
  :global(.prose-book .stellarium-hr) {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.3), transparent);
    margin: 2rem auto;
    max-width: 300px;
  }
  :global(.prose-book .stellarium-em) {
    color: var(--color-secondary, #67e8f9);
    font-style: italic;
    font-size: 0.95em;
  }
  :global(.prose-book .stellarium-strong) {
    color: #fff;
    font-weight: 700;
  }
</style>
