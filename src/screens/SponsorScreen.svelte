<script lang="ts">
  import { BANK_DETAILS } from '../data';
  import BottomSheet from '../components/BottomSheet.svelte';
  import { Landmark, Bitcoin, DollarSign, CreditCard, Copy, Handshake } from 'lucide-svelte';

  let { onContact }: { onContact?: () => void } = $props();

  let selectedMethod = $state<string | null>(null);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  }
</script>

<div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full px-2 sm:p-6 lg:p-10 xl:p-12 items-center">
  <Handshake size={48} class="text-[var(--color-secondary)] mt-6 lg:mt-10" />
  <h1 class="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-normal text-center mt-1 lg:mt-4">Support the Mission</h1>

  <div class="w-full mt-4 lg:mt-8">
    <div class="bg-[var(--color-surface)] border border-white/10 rounded-2xl p-4 sm:p-5 lg:p-8 xl:p-10 flex flex-col items-center">
      <h2 class="text-lg sm:text-xl lg:text-3xl xl:text-4xl  text-[var(--color-secondary)]">Become a Partner</h2>
      <p class="text-sm sm:text-base lg:text-lg xl:text-xl text-[var(--color-on-surface)] mt-1 lg:mt-3 text-center leading-relaxed">
        Gain a platform of global cultural relevance to advertise your brand. Support the Stellarium Foundation and align your business with prosperity and peace.
      </p>
      <button onclick={onContact} class="mt-4 lg:mt-6 px-6 py-2 lg:px-8 lg:py-3 bg-[var(--color-tertiary)] text-black  uppercase tracking-wider text-[10px] lg:text-xs xl:text-sm rounded-full hover:opacity-90 active:scale-95 transition-all">
        Contact for a Deal
      </button>
    </div>
  </div>

  <h2 class="text-xs lg:text-sm xl:text-base  text-gray-400 mt-6 lg:mt-10 mb-3 lg:mb-5 uppercase tracking-widest text-center">Choose Payment Method</h2>

  <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full pb-16 lg:pb-24">
    <button onclick={() => selectedMethod = 'bank'} class="h-24 sm:h-28 lg:h-32 xl:h-36 bg-[var(--color-surface)] border border-white/5 rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center hover:bg-white/5">
      <Landmark size={22} class="text-white mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-white  text-xs lg:text-sm xl:text-base tracking-wide">Bank Deposit</span>
    </button>
    <button onclick={() => selectedMethod = 'crypto'} class="h-24 sm:h-28 lg:h-32 xl:h-36 bg-[var(--color-surface)] border border-white/5 rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center hover:bg-white/5">
      <Bitcoin size={22} class="text-[var(--color-tertiary)] mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-[var(--color-tertiary)]  text-xs lg:text-sm xl:text-base tracking-wide">Crypto</span>
    </button>
    <button onclick={() => selectedMethod = 'patreon'} class="h-24 sm:h-28 lg:h-32 xl:h-36 bg-[var(--color-surface)] border border-white/5 rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center hover:bg-white/5">
      <DollarSign size={22} class="text-white mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-white  text-xs lg:text-sm xl:text-base tracking-wide">Patreon</span>
    </button>
    <button onclick={() => selectedMethod = 'paypal'} class="h-24 sm:h-28 lg:h-32 xl:h-36 bg-[var(--color-surface)] border border-white/5 rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center hover:bg-white/5">
      <CreditCard size={22} class="text-[var(--color-secondary)] mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-[var(--color-secondary)]  text-xs lg:text-sm xl:text-base tracking-wide">PayPal</span>
    </button>
  </div>
</div>

<BottomSheet isOpen={selectedMethod !== null} onClose={() => selectedMethod = null}>
  {#if selectedMethod === 'bank'}
    <div class="flex flex-col items-center w-full">
      <h2 class="text-2xl  text-white mb-2 text-center">Bank Transfer</h2>
      <p class="text-sm text-[var(--color-on-surface)] text-center mb-4">Please choose the account matching your currency.</p>
      <a href="https://www.notion.so/Stellarium-Literature-19fc1c04bbc1801f9243d1fa5d7d44ad?pvs=21" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-[var(--color-surface)] border border-white/10 rounded-full text-xs text-[var(--color-tertiary)]  uppercase tracking-wider mb-6 hover:bg-white/5 transition-colors">
        View Stellarium Literature Docs
      </a>
      <div class="w-full space-y-4">
        {#each BANK_DETAILS as bank}
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 w-full">
            <h3 class="text-[var(--color-primary)]  mb-1">{bank.title}</h3>
            <p class="text-[var(--color-secondary)] text-sm mb-4">{bank.bankName}</p>
            <div class="flex items-start justify-between bg-[var(--color-surface)] p-3 rounded-lg overflow-x-auto">
              <pre class="text-xs text-[var(--color-on-background)] font-mono flex-1 whitespace-pre-wrap leading-relaxed">{bank.details}</pre>
              <button onclick={() => handleCopy(`${bank.bankName}\n${bank.details}`)} class="ml-4 p-2 text-gray-500 hover:text-[var(--color-tertiary)]">
                <Copy size={16} />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if selectedMethod === 'crypto'}
    <div class="flex flex-col items-center w-full">
      <h2 class="text-2xl  text-white mb-6 text-center">Cryptocurrency</h2>
      <div class="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <h3 class="text-[var(--color-secondary)]  mb-4">Monero (XMR)</h3>
        <div class="flex items-start justify-between bg-[var(--color-surface)] p-3 rounded-lg">
          <p class="text-xs text-[var(--color-on-background)] font-mono break-all flex-1">44u8KhinKQ4SgpxwS5jq3cJBMWVsWnMHaGMqYp8abTw3iAJW5izBm9V7uoNVcXAeWS6UqUzVdrn2qAtH4Epd5RkoDJxtRaL</p>
          <button onclick={() => handleCopy('44u8KhinKQ4SgpxwS5jq3cJBMWVsWnMHaGMqYp8abTw3iAJW5izBm9V7uoNVcXAeWS6UqUzVdrn2qAtH4Epd5RkoDJxtRaL')} class="ml-4 p-2 text-gray-500 hover:text-[var(--color-tertiary)] shrink-0">
            <Copy size={16} />
          </button>
        </div>
      </div>
      <a href="https://trocador.app/en/anonpay" target="_blank" rel="noopener noreferrer" class="w-full py-4 text-center bg-[var(--color-tertiary)] text-black rounded-full  uppercase tracking-wider">
        Pay with Any Crypto (Trocador)
      </a>
    </div>
  {:else if selectedMethod === 'patreon'}
    <div class="flex flex-col items-center w-full">
      <h2 class="text-2xl  text-[var(--color-primary)] mb-4 text-center">Patreon</h2>
      <p class="text-[var(--color-on-surface)] text-center mb-8">Join our exclusive community on Patreon.</p>
      <a href="https://www.patreon.com/join/StellariumFoundation" target="_blank" rel="noopener noreferrer" class="w-full max-w-xs py-4 text-center bg-white text-black rounded-full  uppercase tracking-wider">
        Visit Patreon Page
      </a>
    </div>
  {:else if selectedMethod === 'paypal'}
    <div class="flex flex-col items-center w-full">
      <h2 class="text-2xl  text-white mb-6 text-center">PayPal</h2>
      <div class="flex w-full items-center justify-between bg-[var(--color-surface)] p-4 rounded-xl border border-white/10 mb-8">
        <span class="text-[var(--color-on-background)] font-mono text-sm">stellar.foundation.us@gmail.com</span>
        <button onclick={() => handleCopy('stellar.foundation.us@gmail.com')} class="text-gray-500 hover:text-[var(--color-tertiary)]"><Copy size={16} /></button>
      </div>
      <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=stellar.foundation.us@gmail.com&currency_code=USD" target="_blank" rel="noopener noreferrer" class="w-full max-w-xs py-4 text-center bg-white text-black rounded-full  uppercase tracking-wider">
        Send via PayPal
      </a>
    </div>
  {/if}
</BottomSheet>
