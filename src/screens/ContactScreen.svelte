<script lang="ts">
  import { Mail, Shield, Zap, Copy, CheckCircle, Phone, PhoneOff, Mic, MicOff } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card } from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { callClient } from '../utils/callClient';

  let email = $state('');
  let message = $state('');
  let isSending = $state(false);
  let statusText = $state('');
  let statusType: 'success' | 'error' | 'info' | '' = $state('');
  let portalCopied = $state(false);
  let callState = $state<'idle' | 'calling' | 'in_call' | 'ended' | 'no_answer' | 'failed'>('idle');
  let isMuted = $state(false);
  let callErrorText = $state('');

  $effect(() => {
    const unsub1 = callClient.callState.subscribe((v) => callState = v);
    const unsub2 = callClient.isMuted.subscribe((v) => isMuted = v);
    const unsub3 = callClient.errorText.subscribe((v) => callErrorText = v);
    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  });

  function copyPortal() {
    navigator.clipboard.writeText("https://mural-bnyh.onrender.com/");
    portalCopied = true;
    setTimeout(() => portalCopied = false, 2500);
  }

  async function handleSend() {
    if (!message.trim()) {
      statusType = 'error';
      statusText = 'Message content is required.';
      return;
    }

    isSending = true;
    statusType = 'info';
    statusText = 'Establishing secure connection...';

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      statusText = 'Broadcasting...';

      const response = await fetch("https://api.staticforms.dev/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          apiKey: "sf_0491b9b3fbb2f4f489b6a319",
          name: email ? email.split('@')[0] : "Anonymous",
          email: email || "no-reply@stellarium.app",
          message: message,
        })
      });

      const data = await response.json();

      if (data.success) {
        statusType = 'success';
        statusText = 'Transmission Complete. Secure Message Sent.';
        email = '';
        message = '';
      } else {
        statusType = 'error';
        statusText = data.message || 'Secure channel failed.';
      }
    } catch (err) {
      console.error(err);
      statusType = 'error';
      statusText = 'Connection failed.';
    } finally {
      isSending = false;
    }
  }
</script>

<div class="flex flex-col h-full overflow-y-auto no-scrollbar w-full max-w-5xl lg:max-w-7xl mx-auto px-0 sm:p-6 lg:p-10 xl:p-12 items-center">
  <div class="mb-4 lg:mb-6"><Shield size={48} class="text-white opacity-80 lg:w-16 lg:h-16" /></div>
  <h1 class="text-3xl lg:text-5xl xl:text-6xl font-normal text-center mt-2 uppercase tracking-wide">Secure Comms</h1>
  <p class="text-center text-sm lg:text-base xl:text-lg text-muted-foreground mt-4 lg:mt-6 max-w-sm lg:max-w-xl xl:max-w-2xl leading-relaxed mb-8 lg:mb-12">
    Send Intelligence or Directives to the Stellarium Foundation. (Routes via secure tunnel)
  </p>

  <div class="w-full max-w-md lg:max-w-xl xl:max-w-2xl space-y-4 lg:space-y-6 pb-24 lg:pb-32">
    <!-- Call Stellarium Section -->
    <Card class="bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border-emerald-500/20 p-6 lg:p-8 xl:p-10 space-y-4 lg:space-y-5">
      <div class="flex items-center gap-3">
        <div class="p-2.5 lg:p-3.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-xl">
          <Phone size={20} class="text-emerald-400 lg:w-6 lg:h-6" />
        </div>
        <div class="text-left">
          <h3 class="text-xs lg:text-sm xl:text-base font-black text-white uppercase tracking-wider">Call Stellarium</h3>
          <span class="text-[9px] lg:text-xs text-emerald-300 font-extrabold uppercase tracking-widest block">Direct Voice Connection</span>
        </div>
      </div>

      <p class="text-xs lg:text-sm xl:text-base text-gray-300 leading-relaxed text-left">
        Speak directly with John Victor through a secure WebSocket voice channel. Requires microphone access.
      </p>

      {#if callState === 'idle' || callState === 'failed' || callState === 'no_answer'}
        <Button
          onclick={() => callClient.startCall()}
          disabled={callState === 'calling'}
          class="w-full bg-emerald-500 text-black font-bold py-3 lg:py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider text-xs lg:text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          <Phone size={18} /> Call Owner
        </Button>

        {#if callErrorText}
          <p class="text-xs text-red-400 text-center">{callErrorText}</p>
        {/if}
      {:else if callState === 'calling'}
        <div class="flex items-center justify-center gap-3 py-3">
          <div class="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span class="text-emerald-300 font-semibold">Calling...</span>
        </div>
      {:else if callState === 'in_call'}
        <div class="flex flex-col gap-3">
          <span class="text-emerald-300 font-semibold text-center">In Call</span>

          <div class="flex gap-3">
            <Button
              onclick={() => callClient.toggleMute()}
              class="flex-1 bg-white/10 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider text-xs hover:bg-white/15 transition-all"
            >
              {#if isMuted}
                <MicOff size={16} /> Unmute
              {:else}
                <Mic size={16} /> Mute
              {/if}
            </Button>

            <Button
              onclick={() => callClient.endCall()}
              class="flex-1 bg-red-500 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider text-xs hover:bg-red-400 transition-all"
            >
              <PhoneOff size={16} /> End Call
            </Button>
          </div>
        </div>
      {:else if callState === 'ended'}
        <p class="text-xs text-gray-400 text-center">Call ended</p>
        <Button
          onclick={() => callClient.resetCall()}
          class="w-full bg-emerald-500/10 text-emerald-400 font-semibold py-2 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-500/20 transition-all"
        >
          Call Again
        </Button>
      {/if}
    </Card>

    <!-- Message Form -->
    <Card class="border border-border p-6 lg:p-8 xl:p-10">
      <label class="block text-xs lg:text-sm xl:text-base font-bold text-muted-foreground uppercase tracking-widest mb-2">Contact Email (Optional)</label>
      <Input type="email" bind:value={email} placeholder="Leave empty for anonymity" disabled={isSending} />

      <label class="block text-xs lg:text-sm xl:text-base font-bold text-muted-foreground uppercase tracking-widest mt-6 lg:mt-8 mb-2">Intel / Message</label>
      <Textarea bind:value={message} placeholder="Enter your transmission..." disabled={isSending} />

      {#if statusType}
        <div
          class="mt-6 p-4 lg:p-5 rounded-xl border flex items-start gap-3 {statusType === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : statusType === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-primary/10 border-primary/30 text-primary'}"
        >
          {#if statusType === 'info'}
            <Zap size={18} class="animate-pulse shrink-0 mt-0.5" />
          {/if}
          <p class="text-sm lg:text-base font-medium">{statusText}</p>
        </div>
      {/if}

      <Button
        onclick={handleSend}
        disabled={isSending || !message.trim()}
        class="w-full mt-6 lg:mt-8 bg-primary text-primary-foreground font-bold py-4 lg:py-5 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm lg:text-base xl:text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {#if isSending}
          Encrypting...
        {:else}
          <Mail size={18} /> Broadcast
        {/if}
      </Button>
    </Card>

    <!-- Anonymous Messaging Tor Portal -->
    <Card class="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border-purple-500/20 p-6 lg:p-8 xl:p-10 space-y-4 lg:space-y-5">
      <div class="flex items-center gap-3">
        <div class="p-2.5 lg:p-3.5 bg-purple-500/15 text-purple-400 border border-purple-500/25 rounded-xl">
          <Shield size={20} class="text-purple-400 lg:w-6 lg:h-6" />
        </div>
        <div class="text-left">
          <h3 class="text-xs lg:text-sm xl:text-base font-black text-white uppercase tracking-wider">Anonymous Messaging</h3>
          <span class="text-[9px] lg:text-xs text-purple-300 font-extrabold uppercase tracking-widest block">Supreme Metadata Protection</span>
        </div>
      </div>

      <p class="text-xs lg:text-sm xl:text-base text-gray-300 leading-relaxed text-left">
        To preserve absolute anonymity and cryptographic protection, we strongly advise using the <strong class="text-white">Tor Browser</strong> when submitting messages through our anonymous messaging node:
      </p>

      <div onclick={copyPortal} class="flex items-center justify-between gap-3 bg-black/45 hover:bg-black/60 border border-border hover:border-purple-500/30 rounded-xl p-3 lg:p-4 select-all cursor-pointer group transition-all">
        <span class="font-mono text-[10px] lg:text-xs xl:text-sm text-purple-300 break-all select-all text-left flex-1">https://mural-bnyh.onrender.com/</span>
        <Button
          type="button"
          class="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg text-[9px] lg:text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 transition-all border border-purple-500/20 px-2.5 py-1 lg:px-3 lg:py-1.5"
          title="Copy Address"
        >
          {#if portalCopied}
            <CheckCircle size={10} class="text-green-400" />
            <span class="text-green-400">Copied!</span>
          {:else}
            <Copy size={10} />
            <span>Copy</span>
          {/if}
        </Button>
      </div>

      <div class="flex items-center justify-between text-[9px] lg:text-xs text-gray-400 pt-1">
        <span>Security: Use with Tor Browser</span>
        <span class="text-purple-400 font-bold uppercase tracking-widest">Identity Shielded</span>
      </div>
    </Card>
  </div>
</div>
