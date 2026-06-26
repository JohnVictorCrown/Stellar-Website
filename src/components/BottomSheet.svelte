<script lang="ts">
  import { slide, fade } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  let { isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children?: import('svelte').Snippet } = $props();
</script>

{#if isOpen}
  <div
    transition:fade={{ duration: 200 }}
    onclick={onClose}
    class="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
  />
  <div
    transition:slide={{ duration: 400 }}
    class="fixed bottom-0 left-0 right-0 bg-black/90 text-white z-[100] rounded-t-3xl max-h-[90vh] overflow-y-auto no-scrollbar safe-bottom backdrop-blur-xl border-t border-white/10"
  >
    <div class="sticky top-0 right-0 p-4 flex justify-end bg-gradient-to-b from-black/90 to-transparent z-10">
      <button onclick={onClose} class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
        <X size={20} />
      </button>
    </div>
    <div class="px-6 pb-24 w-full flex flex-col">
      {@render children?.()}
    </div>
  </div>
{/if}
