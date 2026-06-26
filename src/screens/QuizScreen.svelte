<script lang="ts">

  type Question = { text: string; options: string[]; correctIndex: number };
  type QuizCategory = { name: string; questions: Question[] };
  type QuizSession = { categoryName: string; questions: Question[] };

  let categories = $state<QuizCategory[]>([]);
  let activeSession = $state<QuizSession | null>(null);
  let isLoading = $state(true);
  let errorMessage = $state<string | null>(null);

  function processQuizzes(rootObject: any) {
    const topicsArray = rootObject.topics || [];
    const loadedCategories: QuizCategory[] = topicsArray.map((topicObj: any) => ({
      name: topicObj.topicName,
      questions: (topicObj.questions || []).map((qObj: any) => ({
        text: String(qObj.text),
        options: Array.isArray(qObj.options) ? qObj.options.map(String) : [],
        correctIndex: Number(qObj.correctIndex)
      }))
    }));
    const allQuestions = loadedCategories.flatMap(c => c.questions);
    categories = [{ name: "General Knowledge (All Topics)", questions: allQuestions }, ...loadedCategories];
  }

  function loadData() {
    let hasLoadedFromCache = false;
    try {
      const cached = localStorage.getItem('stellarium_quizzes_cache');
      if (cached) {
        const rootObj = JSON.parse(cached);
        if (rootObj && Array.isArray(rootObj.topics)) {
          processQuizzes(rootObj);
          isLoading = false;
          hasLoadedFromCache = true;
        }
      }
    } catch (e) { console.warn("Error parsing quizzes cache", e); }

    async function loadQuizzes() {
      try {
        const res = await fetch('/quizzes.json');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const rootObject = await res.json();
        try { localStorage.setItem('stellarium_quizzes_cache', JSON.stringify(rootObject)); } catch (e) { console.warn("Failed to write cache", e); }
        processQuizzes(rootObject);
        errorMessage = null;
      } catch (e: any) {
        console.error(e);
        if (!hasLoadedFromCache) errorMessage = `Error loading quizzes: ${e.message}`;
      } finally { isLoading = false; }
    }

    loadQuizzes();
  }

  $effect(loadData);

  function startQuiz(category: QuizCategory) {
    const shuffled = [...category.questions].sort(() => 0.5 - Math.random()).slice(0, 15);
    activeSession = { categoryName: category.name, questions: shuffled };
  }

  function handleRetake() {
    if (!activeSession) return;
    const original = categories.find(c => c.name === activeSession!.categoryName);
    if (original) {
      const shuffled = [...original.questions].sort(() => 0.5 - Math.random()).slice(0, 15);
      activeSession = { categoryName: original.name, questions: shuffled };
    }
  }

  function returnToMenu() { activeSession = null; }

  let currentIndex = $state(0);
  let score = $state(0);
  let isFinished = $state(false);

  $effect(() => {
    if (activeSession) {
      currentIndex = 0;
      score = 0;
      isFinished = false;
    }
  });

  function handleAnswer(selectedIndex: number) {
    if (!activeSession) return;
    const question = activeSession.questions[currentIndex];
    if (selectedIndex === question.correctIndex) score++;
    if (currentIndex < activeSession.questions.length - 1) currentIndex++;
    else isFinished = true;
  }
</script>

{#if activeSession}
  {#if isFinished || activeSession.questions.length === 0}
    <div class="flex flex-col h-full items-center p-6 lg:p-10 xl:p-12 justify-center">
      <h2 class="text-3xl lg:text-5xl xl:text-6xl text-[var(--color-primary)] font-normal text-center">Assessment Complete</h2>
      <p class="text-[var(--color-tertiary)] mt-2 lg:mt-4 font-bold text-center text-sm lg:text-base xl:text-lg">{activeSession.categoryName}</p>
      <div class="text-6xl lg:text-7xl xl:text-8xl font-black text-white mt-8 lg:mt-12">{score} / {activeSession.questions.length}</div>
      <p class="text-[var(--color-on-surface)] uppercase tracking-widest text-sm lg:text-base xl:text-lg mt-2">Correct Answers</p>
      <div class="mt-16 lg:mt-20 w-full max-w-sm lg:max-w-md xl:max-w-lg space-y-4">
        <button onclick={handleRetake} class="w-full bg-[var(--color-tertiary)] text-black py-4 lg:py-5 rounded-full font-bold uppercase tracking-wider text-sm lg:text-base hover:bg-[var(--color-tertiary)]/90 active:scale-[0.98] transition-transform">Retake Quiz (New Questions)</button>
        <button onclick={returnToMenu} class="w-full border border-white/20 text-white py-4 lg:py-5 rounded-full font-semibold uppercase tracking-wider text-sm lg:text-base hover:bg-white/10 active:scale-[0.98] transition-transform">Return to Topics</button>
      </div>
    </div>
  {:else}
    {@const question = activeSession.questions[currentIndex]}
    {@const progress = ((currentIndex + 1) / activeSession.questions.length) * 100}
    <div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full px-2 sm:p-6 lg:p-10 xl:p-12 items-center max-w-5xl lg:max-w-7xl mx-auto">
      <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <div class="h-full bg-[var(--color-tertiary)] transition-all duration-300" style="width: {progress}%" />
      </div>
      <p class="text-[10px] sm:text-xs lg:text-sm text-[var(--color-tertiary)] font-semibold mb-4 uppercase tracking-widest">Question {currentIndex + 1} of {activeSession.questions.length}</p>
      <h3 class="text-base sm:text-lg lg:text-2xl xl:text-3xl font-normal text-center text-white/90 mb-6 lg:mb-10 px-2 lg:px-8 tracking-wide leading-relaxed">{question.text}</h3>
      <div class="w-full max-w-2xl lg:max-w-3xl space-y-2.5 lg:space-y-3.5">
        {#each question.options as option, idx}
          <button onclick={() => handleAnswer(idx)} class="w-full bg-white/95 hover:bg-white text-black py-3 sm:py-3.5 lg:py-4 xl:py-5 px-5 lg:px-8 rounded-xl text-xs sm:text-sm lg:text-base xl:text-lg font-medium text-center active:scale-[0.98] transition-all shadow-md tracking-wide">{option}</button>
        {/each}
      </div>
    </div>
  {/if}
{:else}
  <div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full max-w-5xl lg:max-w-7xl mx-auto px-2 sm:p-6 lg:p-10 xl:p-12 items-center">
    <h1 class="text-3xl lg:text-5xl xl:text-6xl font-normal text-[var(--color-primary)] text-center mt-2 lg:mt-6">Stellarium Knowledge Base</h1>
    <p class="text-center text-[var(--color-on-surface)] mt-4 lg:mt-6 max-w-sm lg:max-w-xl xl:max-w-2xl leading-relaxed text-sm lg:text-base xl:text-lg">
      Master the principles of the Foundation. Select a module below or choose 'General Knowledge' to test yourself on everything.
    </p>

    {#if isLoading}
      <div class="flex-1 flex items-center justify-center mt-12 w-full">
        <div class="w-8 h-8 border-4 border-[var(--color-tertiary)] border-t-transparent rounded-full animate-spin" />
      </div>
    {/if}

    {#if errorMessage}
      <div class="flex-1 flex items-center justify-center mt-12 text-red-400 text-sm lg:text-base">{errorMessage}</div>
    {/if}

    {#if !isLoading && !errorMessage}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mt-8 lg:mt-12 pb-24 lg:pb-32">
        {#each categories as category, idx}
          {@const isGeneral = category.name.includes("General Knowledge")}
          <button
            onclick={() => startQuiz(category)}
            class="h-24 lg:h-32 xl:h-36 border rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center p-3 lg:p-5 transition-all active:scale-95 {isGeneral ? 'bg-[var(--color-tertiary)]/20 border-[var(--color-tertiary)]/50 hover:bg-[var(--color-tertiary)]/30' : 'bg-[var(--color-surface)] border-white/10 hover:border-[var(--color-tertiary)] hover:bg-white/5'}"
          >
            <span class="font-bold text-center uppercase tracking-wider text-xs lg:text-sm xl:text-base {isGeneral ? 'text-[var(--color-tertiary)]' : 'text-[var(--color-secondary)]'}">{category.name}</span>
            <span class="text-[10px] lg:text-xs xl:text-sm text-white/50 mt-2 font-medium">{category.questions.length} / {category.questions.length === 1 ? 'Question' : 'Questions'}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
