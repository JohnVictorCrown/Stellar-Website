<script lang="ts">
  import { BANK_DETAILS } from '../data';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import { Card, CardContent } from '$lib/components/ui/card/index.js';
  import { Landmark, Bitcoin, DollarSign, CreditCard, Copy } from 'lucide-svelte';

  let { onContact }: { onContact?: () => void } = $props();

  let selectedMethod = $state<string | null>(null);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  }
</script>

<div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full px-2 sm:p-6 lg:p-10 xl:p-12 items-center">
  <h1 class="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-normal text-center text-foreground mt-1 lg:mt-4">Support the Mission</h1>

  <div class="w-full mt-4 lg:mt-8">
    <div class="bg-card border border-border rounded-2xl p-4 sm:p-5 lg:p-8 xl:p-10 flex flex-col items-center">
      <h2 class="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold text-foreground">Become a Partner</h2>
      <p class="text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground mt-1 lg:mt-3 text-center leading-relaxed">
        Gain a platform of global cultural relevance to advertise your brand. Support the Stellarium Foundation and align your business with prosperity and peace.
      </p>
      <Button onclick={onContact} variant="default" class="mt-4 lg:mt-6 px-6 py-2 lg:px-8 lg:py-3 font-bold uppercase tracking-wider text-[10px] lg:text-xs xl:text-sm rounded-full hover:opacity-90 active:scale-95 transition-all">
        Contact for a Deal
      </Button>
    </div>
  </div>

  <h2 class="text-xs lg:text-sm xl:text-base font-semibold text-muted-foreground mt-6 lg:mt-10 mb-3 lg:mb-5 uppercase tracking-widest text-center">Choose Payment Method</h2>

  <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full pb-16 lg:pb-24">
    <Button onclick={() => selectedMethod = 'bank'} variant="outline" class="h-24 sm:h-28 lg:h-32 xl:h-36 flex-col justify-center items-center">
      <Landmark size={22} class="text-foreground mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-foreground font-semibold text-xs lg:text-sm xl:text-base tracking-wide">Bank Deposit</span>
    </Button>
    <Button onclick={() => selectedMethod = 'crypto'} variant="outline" class="h-24 sm:h-28 lg:h-32 xl:h-36 flex-col justify-center items-center">
      <Bitcoin size={22} class="text-foreground mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-foreground font-semibold text-xs lg:text-sm xl:text-base tracking-wide">Crypto</span>
    </Button>
    <Button onclick={() => selectedMethod = 'patreon'} variant="outline" class="h-24 sm:h-28 lg:h-32 xl:h-36 flex-col justify-center items-center">
      <DollarSign size={22} class="text-foreground mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-foreground font-semibold text-xs lg:text-sm xl:text-base tracking-wide">Patreon</span>
    </Button>
    <Button onclick={() => selectedMethod = 'paypal'} variant="outline" class="h-24 sm:h-28 lg:h-32 xl:h-36 flex-col justify-center items-center">
      <CreditCard size={22} class="text-foreground mb-2 lg:mb-3 lg:w-8 lg:h-8 xl:w-10 xl:h-10" />
      <span class="text-foreground font-semibold text-xs lg:text-sm xl:text-base tracking-wide">PayPal</span>
    </Button>
  </div>
</div>

<Sheet.Root open={selectedMethod !== null} onOpenChange={(o) => { if (!o) selectedMethod = null; }}>
  <Sheet.Content side="bottom" class="max-h-[90vh]">
    <div class="px-6 pb-8 pt-6">
      {#if selectedMethod === 'bank'}
        <div class="flex flex-col items-center w-full">
          <Sheet.Title class="text-2xl font-bold text-center mb-2">Bank Transfer</Sheet.Title>
          <Sheet.Description class="text-sm text-center mb-4">Please choose the account matching your currency.</Sheet.Description>
          <Button href="https://www.notion.so/Stellarium-Literature-19fc1c04bbc1801f9243d1fa5d7d44ad?pvs=21" variant="outline" class="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            View Stellarium Literature Docs
          </Button>
          <div class="w-full space-y-4">
            {#each BANK_DETAILS as bank}
              <Card size="sm" class="w-full">
                <CardContent class="p-4">
                  <h3 class="text-foreground font-bold mb-1">{bank.title}</h3>
                  <p class="text-muted-foreground text-sm mb-4">{bank.bankName}</p>
                  <div class="flex items-start justify-between bg-muted/50 p-3 rounded-lg">
                    <pre class="text-xs text-foreground font-mono flex-1 whitespace-pre-wrap leading-relaxed">{bank.details}</pre>
                    <Button onclick={() => handleCopy(`${bank.bankName}\n${bank.details}`)} variant="ghost" size="icon-sm" class="ml-4 shrink-0 text-muted-foreground hover:text-foreground">
                      <Copy size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            {/each}
          </div>
        </div>
      {:else if selectedMethod === 'crypto'}
        <div class="flex flex-col items-center w-full">
          <Sheet.Title class="text-2xl font-bold text-center mb-6">Cryptocurrency</Sheet.Title>
          <Card size="sm" class="w-full mb-6">
            <CardContent class="p-4">
              <h3 class="text-muted-foreground font-bold mb-4">Monero (XMR)</h3>
              <div class="flex items-start justify-between bg-muted/50 p-3 rounded-lg">
                <p class="text-xs text-foreground font-mono break-all flex-1">44u8KhinKQ4SgpxwS5jq3cJBMWVsWnMHaGMqYp8abTw3iAJW5izBm9V7uoNVcXAeWS6UqUzVdrn2qAtH4Epd5RkoDJxtRaL</p>
                <Button onclick={() => handleCopy('44u8KhinKQ4SgpxwS5jq3cJBMWVsWnMHaGMqYp8abTw3iAJW5izBm9V7uoNVcXAeWS6UqUzVdrn2qAtH4Epd5RkoDJxtRaL')} variant="ghost" size="icon-sm" class="ml-4 shrink-0 text-muted-foreground hover:text-foreground">
                  <Copy size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button href="https://trocador.app/en/anonpay" variant="default" class="w-full py-4 text-center font-bold uppercase tracking-wider rounded-full">
            Pay with Any Crypto (Trocador)
          </Button>
        </div>
      {:else if selectedMethod === 'patreon'}
        <div class="flex flex-col items-center w-full">
          <Sheet.Title class="text-2xl font-bold text-primary text-center mb-4">Patreon</Sheet.Title>
          <Sheet.Description class="text-muted-foreground text-center mb-8">Join our exclusive community on Patreon.</Sheet.Description>
          <Button href="https://www.patreon.com/join/StellariumFoundation" variant="default" class="w-full max-w-xs py-4 text-center font-bold uppercase tracking-wider rounded-full">
            Visit Patreon Page
          </Button>
        </div>
      {:else if selectedMethod === 'paypal'}
        <div class="flex flex-col items-center w-full">
          <Sheet.Title class="text-2xl font-bold text-center mb-6">PayPal</Sheet.Title>
          <div class="flex w-full items-center justify-between bg-card p-4 rounded-xl border border-border mb-8">
            <span class="text-foreground font-mono text-sm">stellar.foundation.us@gmail.com</span>
            <Button onclick={() => handleCopy('stellar.foundation.us@gmail.com')} variant="ghost" size="icon-sm" class="text-muted-foreground hover:text-foreground">
              <Copy size={16} />
            </Button>
          </div>
          <Button href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=stellar.foundation.us@gmail.com&currency_code=USD" variant="default" class="w-full max-w-xs py-4 text-center font-bold uppercase tracking-wider rounded-full">
            Send via PayPal
          </Button>
        </div>
      {/if}
    </div>
  </Sheet.Content>
</Sheet.Root>
