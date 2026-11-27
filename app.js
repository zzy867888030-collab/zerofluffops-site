// 2026 AI Automation Cost Calculator Engine (v3 — /go/ Redirects + 1-Click VPS Monetization)
// Reads redirect/affiliate URLs from window.AFF_LINKS (injected by scripts/build_site.py)

(function () {
  const LINKS = window.AFF_LINKS || {
    make: "go/make.html?src=calculator",
    vps: "go/vps.html?src=calculator",
    n8n: "go/n8n.html?src=calculator",
    zapier: "go/zapier.html?src=calculator",
    reclaim: "go/reclaim.html?src=calculator",
    notion: "go/notion.html?src=calculator"
  };

  const PRESETS = {
    inbox: { runs: 1500, steps: 5, aiLoop: false, selfHost: false },
    agency: { runs: 4000, steps: 8, aiLoop: false, selfHost: false },
    agent: { runs: 3000, steps: 6, aiLoop: true, selfHost: true },
    ecom: { runs: 12000, steps: 7, aiLoop: false, selfHost: false }
  };

  let activePreset = "inbox";

  function calcMake(totalOps) {
    if (totalOps <= 1000) {
      return { price: 0, plan: "Free Plan (up to 1,000 ops/mo)", note: "Great for testing" };
    }
    const packs = Math.ceil(totalOps / 10000);
    if (packs === 1) {
      return { price: 10.59, plan: "Core Plan (10,000 ops/mo)", note: "1 month free via partner link" };
    }
    if (packs <= 4) {
      return { price: +(packs * 10.59).toFixed(2), plan: `Core Tier (${(packs * 10000).toLocaleString()} ops/mo)`, note: "Visual canvas + BYO AI keys" };
    }
    const price = +(packs * 16.0).toFixed(2);
    return { price, plan: `Pro/Teams Tier (${(packs * 10000).toLocaleString()} ops/mo)`, note: "Filter early to save credits" };
  }

  function calcN8nCloud(runs) {
    if (runs <= 2500) {
      return { price: 24, plan: "Starter Cloud (2,500 executions/mo)", note: "Flat per execution — steps are free!" };
    }
    if (runs <= 10000) {
      return { price: 60, plan: "Pro Cloud (10,000 executions/mo)", note: "Unlimited steps per workflow run" };
    }
    const extraBlocks = Math.ceil((runs - 10000) / 10000);
    return {
      price: 60 + extraBlocks * 45,
      plan: `Scaled Cloud (${runs.toLocaleString()} executions/mo)`,
      note: "Consider 1-click VPS hosting at this volume"
    };
  }

  function calcN8nSelfHost(runs) {
    const vps = runs <= 15000 ? 6 : 12;
    return {
      price: vps,
      plan: `n8n Community ($0) + ~$${vps}/mo 1-Click Cloud VPS`,
      note: "Unlimited executions & AI loops — deploy in 2 mins"
    };
  }

  function calcZapier(runs, steps) {
    const tasks = runs * Math.max(1, steps - 1);
    if (tasks <= 100) {
      return { price: 0, plan: "Free Plan (100 tasks/mo, 2-step limit)", note: "Multi-step requires paid plan" };
    }
    if (tasks <= 750) {
      return { price: 29.99, plan: "Professional (750 tasks/mo)", note: `${tasks.toLocaleString()} billable tasks/mo` };
    }
    if (tasks <= 2000) {
      return { price: 73.5, plan: "Professional (2,000 tasks/mo)", note: `${tasks.toLocaleString()} billable tasks/mo` };
    }
    if (tasks <= 5000) {
      return { price: 133.5, plan: "Professional (5,000 tasks/mo)", note: `${tasks.toLocaleString()} billable tasks/mo` };
    }
    if (tasks <= 10000) {
      return { price: 193.5, plan: "Team/Pro (10,000 tasks/mo)", note: `${tasks.toLocaleString()} billable tasks/mo` };
    }
    if (tasks <= 20000) {
      return { price: 283.5, plan: "Team (20,000 tasks/mo)", note: `${tasks.toLocaleString()} billable tasks/mo` };
    }
    if (tasks <= 50000) {
      return { price: 448.5, plan: "Team (50,000 tasks/mo)", note: `${tasks.toLocaleString()} billable tasks/mo` };
    }
    const extra = Math.ceil((tasks - 50000) / 50000);
    return {
      price: +(448.5 + extra * 300).toFixed(2),
      plan: `High-Volume Tier (${tasks.toLocaleString()} tasks/mo)`,
      note: "Per-task pricing scales sharply"
    };
  }

  const runsInput = document.getElementById("runs");
  const stepsInput = document.getElementById("steps");
  const aiLoopInput = document.getElementById("aiLoop");
  const selfHostInput = document.getElementById("selfHost");

  if (!runsInput) return;

  function withPreset(url) {
    const sep = url.indexOf("?") >= 0 ? "&" : "?";
    return `${url}${sep}preset=${encodeURIComponent(activePreset)}`;
  }

  function render() {
    const runs = parseInt(runsInput.value, 10);
    const baseSteps = parseInt(stepsInput.value, 10);
    const aiLoop = aiLoopInput.checked;
    const showSelfHost = selfHostInput.checked;

    const effectiveSteps = aiLoop ? baseSteps + 10 : baseSteps;
    const totalOps = runs * effectiveSteps;

    document.getElementById("runsVal").textContent = runs.toLocaleString();
    document.getElementById("stepsVal").textContent = `${baseSteps} steps`;
    document.getElementById("effectiveSummary").innerHTML =
      `Monthly load: <strong>${runs.toLocaleString()} runs</strong> × <strong>${effectiveSteps} effective steps</strong> = <strong>${totalOps.toLocaleString()} operations/mo</strong>` +
      (aiLoop ? " (includes +10 AI agent loop steps/run)" : "");

    const makeRes = calcMake(totalOps);
    const n8nCloudRes = calcN8nCloud(runs);
    const n8nSelfRes = calcN8nSelfHost(runs);
    const zapierRes = calcZapier(runs, effectiveSteps);

    const items = [
      {
        id: "make",
        name: "Make.com",
        color: "#c084fc",
        res: makeRes,
        ctaText: "Try Make Free (1 Mo Core + 10k Credits) →",
        ctaClass: "cta-make",
        url: withPreset(LINKS.make)
      },
      {
        id: "n8n",
        name: "n8n Cloud",
        color: "#ff6d5a",
        res: n8nCloudRes,
        ctaText: "Explore n8n Cloud →",
        ctaClass: "cta-n8n",
        url: withPreset(LINKS.n8n)
      },
      {
        id: "zapier",
        name: "Zapier",
        color: "#fb923c",
        res: zapierRes,
        ctaText: "Compare Zapier Plans →",
        ctaClass: "cta-neutral",
        url: withPreset(LINKS.zapier)
      }
    ];

    if (showSelfHost) {
      items.push({
        id: "selfhost",
        name: "n8n 1-Click Self-Hosted",
        color: "#34d399",
        res: n8nSelfRes,
        ctaText: "Deploy 1-Click n8n Server (~$6/mo) →",
        ctaClass: "cta-vps",
        url: withPreset(LINKS.vps || LINKS.n8n)
      });
    } else {
      items.push({
        id: "reclaim",
        name: "Bonus: Reclaim.ai",
        color: "#38bdf8",
        res: { price: 0, plan: "Free Lite / $10 Starter", note: "Automates deep-work calendar blocks" },
        ctaText: "Defend Focus Time Free →",
        ctaClass: "cta-neutral",
        url: withPreset(LINKS.reclaim),
        isBonus: true
      });
    }

    const comparable = items.filter((x) => !x.isBonus);
    const cheapest = comparable.reduce((a, b) => (a.res.price <= b.res.price ? a : b));
    const maxPrice = Math.max(...comparable.map((x) => x.res.price), 25);

    const annualSave = Math.max(0, Math.round((zapierRes.price - cheapest.res.price) * 12));
    document.getElementById("winnerHeadline").textContent =
      `Best Value for Your Stack: ${cheapest.name} ($${cheapest.res.price}/mo)`;
    document.getElementById("savingsAmount").textContent =
      annualSave > 0 ? `Save ~$${annualSave.toLocaleString()}/yr vs Zapier` : "Within Free Tier!";

    const grid = document.getElementById("resultsGrid");
    grid.innerHTML = items
      .map((item) => {
        const isWinner = !item.isBonus && item.id === cheapest.id;
        const pct = item.isBonus ? 18 : Math.max(8, Math.round((item.res.price / maxPrice) * 100));
        return `
          <div class="tool-card ${isWinner ? "winner" : ""}">
            <div>
              <div class="tool-top">
                <span class="tool-name" style="color:${item.color}">${item.name}</span>
                <span class="tag ${isWinner ? "tag-win" : "tag-note"}">
                  ${isWinner ? "Lowest Cost" : item.isBonus ? "Add-on" : "Compare"}
                </span>
              </div>
              <div class="price-row">
                <span class="price-num">$${item.res.price}</span>
                <span class="price-unit">/ month</span>
              </div>
              <div class="plan-detail">
                <strong>${item.res.plan}</strong><br/>${item.res.note}
              </div>
              <div class="bar-track">
                <div class="bar-fill" style="width:${pct}%;background:${item.color}"></div>
              </div>
            </div>
            <a class="cta-btn ${item.ctaClass}" href="${item.url}" target="_blank" rel="noopener sponsored">${item.ctaText}</a>
          </div>
        `;
      })
      .join("");
  }

  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.dataset.preset;
      const p = PRESETS[key];
      if (!p) return;
      activePreset = key;
      runsInput.value = p.runs;
      stepsInput.value = p.steps;
      aiLoopInput.checked = p.aiLoop;
      selfHostInput.checked = p.selfHost;
      try {
        window.history.replaceState(null, "", `?preset=${encodeURIComponent(key)}`);
      } catch (_) {}
      render();
    });
  });

  [runsInput, stepsInput, aiLoopInput, selfHostInput].forEach((el) => {
    el.addEventListener("input", () => {
      activePreset = "custom";
      render();
    });
    el.addEventListener("change", render);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("preset") && PRESETS[params.get("preset")]) {
    activePreset = params.get("preset");
  }
  if (params.get("runs")) runsInput.value = params.get("runs");
  if (params.get("steps")) stepsInput.value = params.get("steps");
  if (params.get("ai") === "1") aiLoopInput.checked = true;
  if (params.get("selfhost") === "1") selfHostInput.checked = true;

  const shareBtn = document.getElementById("shareCalcBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const q = new URLSearchParams({
        runs: runsInput.value,
        steps: stepsInput.value,
        ai: aiLoopInput.checked ? "1" : "0",
        selfhost: selfHostInput.checked ? "1" : "0"
      });
      const url = `${window.location.origin}${window.location.pathname}?${q.toString()}`;
      navigator.clipboard?.writeText(url);
      shareBtn.textContent = "Copied shareable calculation link!";
      setTimeout(() => {
        shareBtn.textContent = "Copy Shareable Calculation Link";
      }, 2200);
    });
  }

  render();
})();
