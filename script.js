const TEAMS = [
    { id: 1, name: "Leões FC", emoji: "🦁" },
    { id: 2, name: "Trovão Azul", emoji: "⚡" },
    { id: 3, name: "Fênix United", emoji: "🔥" },
    { id: 4, name: "Lobos do Norte", emoji: "🐺" },
    { id: 5, name: "Águias Reais", emoji: "🦅" },
    { id: 6, name: "Titãs da Bola", emoji: "🛡️" },
    { id: 7, name: "Panteras City", emoji: "🐆" },
    { id: 8, name: "Dragões FC", emoji: "🐉" },
    { id: 9, name: "Tempestade SC", emoji: "🌪️" },
    { id: 10, name: "Raposas da Vila", emoji: "🦊" },
    { id: 11, name: "Ciclones FC", emoji: "🌀" },
    { id: 12, name: "Búfalos United", emoji: "🐃" },
    { id: 13, name: "Corvos Negros", emoji: "🐦" },
    { id: 14, name: "Cometas SC", emoji: "☄️" },
    { id: 15, name: "Tigres do Sul", emoji: "🐯" },
    { id: 16, name: "Falcões da Serra", emoji: "🦅" },
    { id: 17, name: "Uragões FC", emoji: "🌊" },
    { id: 18, name: "Serpentes City", emoji: "🐍" },
    { id: 19, name: "Touros da Arena", emoji: "🐂" },
    { id: 20, name: "Muralhas FC", emoji: "🏰" }
  ];
  
  const BONUS_CARDS = [
    { id: "bonus_goal", icon: "⚽", title: "Gol Relâmpago", description: "No início do segundo tempo, seu time ganha 1 gol.", effect: "goal_plus" },
    { id: "bonus_penalty_for", icon: "🎯", title: "Pênalti a Favor", description: "No início do segundo tempo, seu time recebe um pênalti.", effect: "penalty_for" },
    { id: "bonus_cancel_penalty", icon: "🧤", title: "Escudo do Goleiro", description: "Anula o primeiro pênalti contra do segundo tempo.", effect: "cancel_penalty_against" },
    { id: "bonus_reduce_difficulty", icon: "📉", title: "Controle da Partida", description: "A dificuldade cai em 1 nível no segundo tempo.", effect: "reduce_difficulty" },
    { id: "bonus_super_save", icon: "🧱", title: "Defesa Milagrosa", description: "Bloqueia a próxima grande chance rival.", effect: "save_next_big_enemy" },
    { id: "bonus_extra_pressure", icon: "🔥", title: "Pressão Total", description: "Aumenta a força ofensiva do seu time no segundo tempo.", effect: "player_attack_boost" }
  ];
  
  const EVENT_POOL = [
    { type: "goal_player", title: "Ataque fulminante", description: "Seu time acelera com perigo.", tag: "Chance de gol" },
    { type: "goal_enemy", title: "Vacilo defensivo", description: "O rival encontra espaço.", tag: "Risco" },
    { type: "yellow_player", title: "Carrinho atrasado", description: "Chegada forte do seu time.", tag: "Cartão" },
    { type: "yellow_enemy", title: "Falta tática rival", description: "O adversário para a jogada.", tag: "Cartão" },
    { type: "corner_player", title: "Escanteio a favor", description: "Chance de bola parada.", tag: "Bola parada" },
    { type: "corner_enemy", title: "Escanteio contra", description: "Perigo na sua área.", tag: "Bola parada" },
    { type: "danger_player", title: "Jogada de perigo", description: "Seu ataque cresce.", tag: "Pressão" },
    { type: "danger_enemy", title: "Contra-ataque rival", description: "O rival dispara.", tag: "Pressão" },
    { type: "penalty_player", title: "Pênalti para seu time", description: "Drama na marca da cal.", tag: "Decisivo" },
    { type: "penalty_enemy", title: "Pênalti para o rival", description: "A tensão sobe.", tag: "Decisivo" },
    { type: "nothing", title: "Jogo travado", description: "Muita disputa no meio.", tag: "Neutro" },
    { type: "boost", title: "Momento de inspiração", description: "Seu time ganha confiança.", tag: "Bônus" },
    { type: "danger_player_big", title: "Grande chance criada", description: "Ataque perigoso.", tag: "Grande chance" },
    { type: "danger_enemy_big", title: "Grande chance rival", description: "Cara a cara com o goleiro.", tag: "Grande chance" }
  ];
  
  const STAGES = [
    { key: "oitavas", label: "Oitavas de final" },
    { key: "quartas", label: "Quartas de final" },
    { key: "semi", label: "Semifinal" },
    { key: "final", label: "Final" }
  ];
  
  const state = {
    gameMode: null,
    phase: "home",
    availableTeams: [],
    pendingChoice: null,
  
    playerTeam: null,
    enemyTeam: null,
  
    hiddenBonus: null,
    bonusRevealed: false,
    bonusFlags: {
      cancelPenaltyAgainstAvailable: false,
      saveNextBigEnemyAvailable: false,
      playerAttackBoostActive: false
    },
  
    scorePlayer: 0,
    scoreEnemy: 0,
    minute: 0,
    difficulty: 1,
    playerYellows: {},
    enemyYellows: {},
    secondHalfStarted: false,
    matchEnded: false,
  
    currentStageIndex: 0,
  
    turnCards: [],
    selectedTurnCards: [],
    revealQueueRunning: false,
  
    penaltyResolver: null,
    selectionAdvanceAction: null
  };
  
  const topHeader = document.getElementById("top-header");
  const tournamentBar = document.getElementById("tournament-bar");
  
  const screenHome = document.getElementById("screen-home");
  const screenMode = document.getElementById("screen-mode");
  const screenHowToPlay = document.getElementById("screen-how-to-play");
  const screenSelection = document.getElementById("screen-selection");
  const screenBonus = document.getElementById("screen-bonus");
  const screenMatch = document.getElementById("screen-match");
  const screenResult = document.getElementById("screen-result");
  
  const openModeMenuBtn = document.getElementById("open-mode-menu-btn");
  const openHowToPlayBtn = document.getElementById("open-how-to-play-btn");
  const closeHowToPlayBtn = document.getElementById("close-how-to-play-btn");
  const singleMatchBtn = document.getElementById("single-match-btn");
  const championshipBtn = document.getElementById("championship-btn");
  const backHomeBtn = document.getElementById("back-home-btn");
  
  const selectionTitle = document.getElementById("selection-title");
  const selectionSubtitle = document.getElementById("selection-subtitle");
  const selectionGrid = document.getElementById("selection-grid");
  const bonusGrid = document.getElementById("bonus-grid");
  
  const nextStageBtn = document.getElementById("next-stage-btn");
  const toBonusBtn = document.getElementById("to-bonus-btn");
  const confirmBonusStageBtn = document.getElementById("confirm-bonus-stage-btn");
  
  const playerShield = document.getElementById("player-shield");
  const playerTeamName = document.getElementById("player-team-name");
  const enemyShield = document.getElementById("enemy-shield");
  const enemyTeamName = document.getElementById("enemy-team-name");
  const scoreDisplay = document.getElementById("score-display");
  const minuteDisplay = document.getElementById("minute-display");
  const difficultyDisplay = document.getElementById("difficulty-display");
  
  const eventCardsContainer = document.getElementById("event-cards");
  const matchLog = document.getElementById("match-log");
  const revealSelectedBtn = document.getElementById("reveal-selected-btn");
  const nextTurnBtn = document.getElementById("next-turn-btn");
  
  const resultTitle = document.getElementById("result-title");
  const resultText = document.getElementById("result-text");
  const continueCampaignBtn = document.getElementById("continue-campaign-btn");
  const restartCampaignBtn = document.getElementById("restart-campaign-btn");
  
  const stageBadge = document.getElementById("stage-badge");
  const campaignStatus = document.getElementById("campaign-status");
  
  const confirmModal = document.getElementById("confirm-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  
  const progressOverlay = document.getElementById("progress-overlay");
  const progressCard = document.getElementById("progress-card");
  const progressTitle = document.getElementById("progress-title");
  const progressText = document.getElementById("progress-text");
  const progressBtn = document.getElementById("progress-btn");
  
  const penaltyScreen = document.getElementById("penalty-screen");
  const penaltyTitle = document.getElementById("penalty-title");
  const penaltySubtitle = document.getElementById("penalty-subtitle");
  const penaltyOptions = document.getElementById("penalty-options");
  const penaltyFeedback = document.getElementById("penalty-feedback");
  const keeperMarker = document.getElementById("keeper-marker");
  const ballMarker = document.getElementById("ball-marker");
  
  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  
  function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  function getCurrentStage() {
    return STAGES[state.currentStageIndex];
  }
  
  function getDifficultyLabel() {
    if (state.difficulty === 1) return "Fácil";
    if (state.difficulty === 2) return "Médio";
    return "Difícil";
  }
  
  function iconBall() {
    return "⚽";
  }
  
  function iconGlove() {
    return "🧤";
  }
  
  function iconCard() {
    return "🟨";
  }
  
  function showScreen(screen) {
    [
      screenHome,
      screenMode,
      screenHowToPlay,
      screenSelection,
      screenBonus,
      screenMatch,
      screenResult
    ].forEach(s => s.classList.remove("active"));
  
    screen.classList.add("active");
  }
  
  function setMatchVisualState(inMatch) {
    if (inMatch) {
      topHeader.classList.add("hidden");
      tournamentBar.classList.add("hidden");
    } else {
      topHeader.classList.remove("hidden");
      if (state.gameMode === "championship") {
        tournamentBar.classList.remove("hidden");
      } else {
        tournamentBar.classList.add("hidden");
      }
    }
  }
  
  function updateTournamentUI() {
    const map = {
      oitavas: document.getElementById("step-oitavas"),
      quartas: document.getElementById("step-quartas"),
      semi: document.getElementById("step-semi"),
      final: document.getElementById("step-final")
    };
  
    Object.values(map).forEach(el => el.classList.remove("active", "done"));
  
    if (state.gameMode !== "championship") {
      tournamentBar.classList.add("hidden");
      return;
    }
  
    tournamentBar.classList.remove("hidden");
    const stage = getCurrentStage();
    stageBadge.textContent = stage.label;
  
    STAGES.forEach((s, idx) => {
      const el = map[s.key];
      if (idx < state.currentStageIndex) el.classList.add("done");
      if (idx === state.currentStageIndex) el.classList.add("active");
    });
  }
  
  function setCampaignStatus(text) {
    campaignStatus.textContent = text;
  }
  
  function updateScoreboard() {
    playerShield.textContent = state.playerTeam?.emoji || "⚪";
    playerTeamName.textContent = state.playerTeam?.name || "Seu Time";
    enemyShield.textContent = state.enemyTeam?.emoji || "⚪";
    enemyTeamName.textContent = state.enemyTeam?.name || "Adversário";
    scoreDisplay.textContent = `${state.scorePlayer} x ${state.scoreEnemy}`;
    minuteDisplay.textContent = `${String(state.minute).padStart(2, "0")}'`;
    difficultyDisplay.textContent = `Dificuldade: ${getDifficultyLabel()}`;
  }
  
  function logMessage(message, type = "default") {
    const div = document.createElement("div");
    div.className = `log-entry ${type}`;
    div.innerHTML = message;
    matchLog.prepend(div);
  }
  
  function showProgressOverlay(title, text, action) {
    state.selectionAdvanceAction = action;
    progressTitle.textContent = title;
    progressText.textContent = text;
    progressOverlay.classList.remove("hidden");
  }
  
  function hideProgressOverlay() {
    progressOverlay.classList.add("hidden");
  }
  
  function executeProgressAction() {
    if (typeof state.selectionAdvanceAction === "function") {
      const action = state.selectionAdvanceAction;
      state.selectionAdvanceAction = null;
      hideProgressOverlay();
      action();
    } else {
      hideProgressOverlay();
    }
  }
  
  function goHome() {
    state.phase = "home";
    state.gameMode = null;
    state.playerTeam = null;
    state.enemyTeam = null;
    state.hiddenBonus = null;
    state.currentStageIndex = 0;
    setMatchVisualState(false);
    tournamentBar.classList.add("hidden");
    showScreen(screenHome);
  }
  
  function openModeMenu() {
    state.phase = "mode";
    setMatchVisualState(false);
    tournamentBar.classList.add("hidden");
    showScreen(screenMode);
  }
  
  function openHowToPlay() {
    state.phase = "howto";
    setMatchVisualState(false);
    tournamentBar.classList.add("hidden");
    showScreen(screenHowToPlay);
  }
  
  function startSingleMatchMode() {
    state.gameMode = "single";
    state.currentStageIndex = 0;
    state.phase = "choose-player";
    setMatchVisualState(false);
    tournamentBar.classList.add("hidden");
    setupSelectionPhase();
    showScreen(screenSelection);
  }
  
  function startChampionshipMode() {
    state.gameMode = "championship";
    state.currentStageIndex = 0;
    state.phase = "choose-player";
    updateTournamentUI();
    setCampaignStatus("Escolha o clube que vai tentar conquistar o torneio");
    setMatchVisualState(false);
    setupSelectionPhase();
    showScreen(screenSelection);
  }
  
  function setupSelectionPhase() {
    state.availableTeams = shuffle(TEAMS);
    selectionGrid.innerHTML = "";
  
    if (state.phase === "choose-player") {
      selectionTitle.textContent = "Escolha seu time";
      selectionSubtitle.textContent = "20 cards. Uma escolha. O destino assina o contrato.";
      if (state.gameMode === "championship") {
        setCampaignStatus("Escolha o clube que vai tentar conquistar o torneio");
      }
    } else {
      const label = state.gameMode === "championship"
        ? getCurrentStage().label.toLowerCase()
        : "partida";
      selectionTitle.textContent = state.gameMode === "championship"
        ? `Escolha o adversário da ${label}`
        : "Escolha seu adversário";
      selectionSubtitle.textContent = "Agora o próximo desafio será revelado pelos cards.";
      if (state.gameMode === "championship") {
        setCampaignStatus(`Defina o rival da ${label}`);
      }
    }
  
    state.availableTeams.forEach((team, index) => {
      const card = document.createElement("div");
      card.className = "pick-card";
      card.dataset.index = index;
  
      card.innerHTML = `
        <div class="pick-card-inner">
          <div class="pick-face">?</div>
          <div class="pick-back">
            <div class="team-emoji">${team.emoji}</div>
            <div class="team-name">${team.name}</div>
          </div>
        </div>
      `;
  
      card.addEventListener("click", () => handleSelectionCardClick(index));
      selectionGrid.appendChild(card);
    });
  }
  
  function handleSelectionCardClick(index) {
    const chosenTeam = state.availableTeams[index];
  
    if (state.phase === "choose-enemy" && state.playerTeam && chosenTeam.id === state.playerTeam.id) {
      return;
    }
  
    state.pendingChoice = { type: "selection", index };
    modalTitle.textContent = "Confirmar escolha";
    modalText.textContent = "Esta escolha não pode ser desfeita até o fim do jogo.";
    confirmModal.classList.remove("hidden");
  }
  
  function revealSelection(index) {
    const cards = [...document.querySelectorAll(".pick-card")];
    const chosenTeam = state.availableTeams[index];
  
    cards.forEach((card, i) => {
      const team = state.availableTeams[i];
      card.classList.add("flipped", "disabled");
  
      if (i === index) {
        card.classList.add("chosen");
      } else {
        if (state.phase === "choose-enemy" && state.playerTeam && team.id === state.playerTeam.id) {
          card.classList.add("disabled");
        } else {
          card.classList.add("rejected");
        }
      }
    });
  
    if (state.phase === "choose-player") {
      state.playerTeam = chosenTeam;
      logMessage(`<strong>🏟️ Time definido:</strong> ${chosenTeam.name} foi escolhido para a campanha.`);
  
      showProgressOverlay(
        "Seu time foi selecionado",
        `Você vai jogar com ${chosenTeam.name}. Toque em qualquer lugar ou no botão para escolher o adversário.`,
        () => {
          state.phase = "choose-enemy";
          setupSelectionPhase();
        }
      );
    } else {
      state.enemyTeam = chosenTeam;
      logMessage(`<strong>🧭 Adversário definido:</strong> ${chosenTeam.name} será o próximo rival.`);
  
      showProgressOverlay(
        "Adversário selecionado",
        `O próximo confronto será contra ${chosenTeam.name}. Toque em qualquer lugar ou no botão para escolher seu bônus secreto.`,
        () => {
          setupBonusPhase();
        }
      );
    }
  }
  
  function setupBonusPhase() {
    bonusGrid.innerHTML = "";
    confirmBonusStageBtn.classList.add("hidden");
    showScreen(screenBonus);
  
    if (state.gameMode === "championship") {
      setCampaignStatus("Escolha um bônus secreto para o segundo tempo");
    }
  
    const cards = shuffle(BONUS_CARDS).slice(0, 4);
  
    cards.forEach((bonus, index) => {
      const card = document.createElement("div");
      card.className = "bonus-card";
      card.dataset.index = index;
  
      card.innerHTML = `
        <div class="bonus-card-inner">
          <div class="bonus-face">?</div>
          <div class="bonus-back">
            <div class="bonus-icon">${bonus.icon}</div>
            <div class="bonus-title">${bonus.title}</div>
            <div class="bonus-desc">${bonus.description}</div>
          </div>
        </div>
      `;
  
      card.addEventListener("click", () => {
        state.pendingChoice = { type: "bonus", index, options: cards };
        modalTitle.textContent = "Confirmar escolha";
        modalText.textContent = "Esta escolha não pode ser desfeita até o fim do jogo.";
        confirmModal.classList.remove("hidden");
      });
  
      bonusGrid.appendChild(card);
    });
  }
  
  function revealBonusChoice(index, currentBonusOptions) {
    const cards = [...document.querySelectorAll(".bonus-card")];
  
    cards.forEach((card, i) => {
      card.classList.add("flipped", "disabled");
      if (i === index) card.classList.add("chosen");
      else card.classList.add("rejected");
    });
  
    state.hiddenBonus = currentBonusOptions[index];
    logMessage(`<strong>🎁 Bônus secreto escolhido:</strong> ele será revelado no segundo tempo.`);
    confirmBonusStageBtn.classList.remove("hidden");
  }
  
  function resetMatchState() {
    state.scorePlayer = 0;
    state.scoreEnemy = 0;
    state.minute = 0;
    state.difficulty = 1;
    state.playerYellows = {};
    state.enemyYellows = {};
    state.secondHalfStarted = false;
    state.matchEnded = false;
    state.bonusRevealed = false;
    state.turnCards = [];
    state.selectedTurnCards = [];
    state.revealQueueRunning = false;
    state.penaltyResolver = null;
  
    state.bonusFlags = {
      cancelPenaltyAgainstAvailable: false,
      saveNextBigEnemyAvailable: false,
      playerAttackBoostActive: false
    };
  }
  
  function startMatch() {
    resetMatchState();
    matchLog.innerHTML = "";
    updateScoreboard();
    setMatchVisualState(true);
    showScreen(screenMatch);
  
    const intro = state.gameMode === "championship"
      ? `${state.playerTeam.name} enfrenta ${state.enemyTeam.name} pela ${getCurrentStage().label.toLowerCase()}.`
      : `${state.playerTeam.name} enfrenta ${state.enemyTeam.name} em uma partida única.`;
  
    logMessage(`<strong>📣 Apito inicial!</strong> ${intro}`);
    generateTurn();
  }
  
  function generateTurn() {
    if (state.matchEnded) return;
  
    nextTurnBtn.classList.add("hidden");
    revealSelectedBtn.classList.add("hidden");
    state.selectedTurnCards = [];
    state.turnCards = shuffle(EVENT_POOL).slice(0, 10);
    eventCardsContainer.innerHTML = "";
  
    state.turnCards.forEach((eventData, index) => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.dataset.index = index;
  
      card.innerHTML = `
        <div class="event-card-inner">
          <div class="event-front">?</div>
          <div class="event-back">
            <h3>${eventData.title}</h3>
            <p>${eventData.description}</p>
            <span class="event-tag">${eventData.tag}</span>
          </div>
        </div>
      `;
  
      card.addEventListener("click", () => toggleEventCardSelection(card, index));
      eventCardsContainer.appendChild(card);
    });
  }
  
  function toggleEventCardSelection(cardElement, index) {
    if (state.revealQueueRunning) return;
    if (cardElement.classList.contains("used")) return;
  
    const alreadySelected = state.selectedTurnCards.includes(index);
  
    if (alreadySelected) {
      state.selectedTurnCards = state.selectedTurnCards.filter(i => i !== index);
      cardElement.classList.remove("selected");
    } else {
      if (state.selectedTurnCards.length >= 3) return;
      state.selectedTurnCards.push(index);
      cardElement.classList.add("selected");
    }
  
    if (state.selectedTurnCards.length === 3) {
      revealSelectedBtn.classList.remove("hidden");
    } else {
      revealSelectedBtn.classList.add("hidden");
    }
  }
  
  async function revealChosenCardsSequentially() {
    if (state.selectedTurnCards.length !== 3 || state.revealQueueRunning) return;
  
    state.revealQueueRunning = true;
    revealSelectedBtn.classList.add("hidden");
  
    const allCards = [...document.querySelectorAll(".event-card")];
  
    for (const index of state.selectedTurnCards) {
      const cardElement = allCards[index];
      const eventData = state.turnCards[index];
  
      cardElement.classList.add("revealed", "used", "disabled");
      allCards.forEach(c => c.classList.add("disabled"));
  
      await delay(500);
  
      advanceMinute();
      await checkSecondHalfBonus();
      await resolveEvent(eventData);
      updateScoreboard();
  
      await delay(700);
  
      if (state.minute >= 90) {
        endMatch();
        state.revealQueueRunning = false;
        return;
      }
    }
  
    nextTurnBtn.classList.remove("hidden");
    state.revealQueueRunning = false;
  }
  
  function advanceMinute() {
    const increment = randomFrom([4, 5, 6, 7, 8, 9]);
    state.minute += increment;
  
    if (!state.secondHalfStarted && state.minute >= 46) {
      state.minute = Math.max(state.minute, 46);
    }
  
    if (state.minute > 90) state.minute = 90;
  }
  
  async function checkSecondHalfBonus() {
    if (state.secondHalfStarted || state.minute < 46) return;
  
    state.secondHalfStarted = true;
  
    if (!state.hiddenBonus || state.bonusRevealed) {
      logMessage(`<strong>⏱️ Segundo tempo!</strong> A bola volta a rolar com tensão renovada.`);
      return;
    }
  
    state.bonusRevealed = true;
    await applyHiddenBonus();
  }
  
  async function applyHiddenBonus() {
    const bonus = state.hiddenBonus;
    if (!bonus) return;
  
    logMessage(`<strong>🎁 Bônus revelado:</strong> <strong>${bonus.title}</strong> entra em ação no segundo tempo.`);
  
    switch (bonus.effect) {
      case "goal_plus":
        state.scorePlayer++;
        logMessage(
          `<strong>${state.minute}'</strong> ${iconBall()} O bônus secreto empurra a bola para a rede do <strong>${state.playerTeam.name}</strong>!`,
          "goal"
        );
        break;
  
      case "penalty_for":
        logMessage(`<strong>${state.minute}'</strong> 🎯 O bônus concede um pênalti para o seu time.`);
        await resolveInteractivePenalty("player", true);
        break;
  
      case "cancel_penalty_against":
        state.bonusFlags.cancelPenaltyAgainstAvailable = true;
        logMessage(
          `<strong>${state.minute}'</strong> ${iconGlove()} Seu time ativa uma proteção contra o primeiro pênalti contra do segundo tempo.`,
          "save"
        );
        break;
  
      case "reduce_difficulty":
        if (state.difficulty > 1) state.difficulty--;
        logMessage(`<strong>${state.minute}'</strong> 📉 A dificuldade cai para <strong>${getDifficultyLabel()}</strong>.`);
        break;
  
      case "save_next_big_enemy":
        state.bonusFlags.saveNextBigEnemyAvailable = true;
        logMessage(
          `<strong>${state.minute}'</strong> ${iconGlove()} Uma defesa milagrosa ficou guardada para a próxima grande chance rival.`,
          "save"
        );
        break;
  
      case "player_attack_boost":
        state.bonusFlags.playerAttackBoostActive = true;
        logMessage(
          `<strong>${state.minute}'</strong> 🔥 Seu time recebe um impulso ofensivo para o restante da partida.`
        );
        break;
    }
  
    updateScoreboard();
  }
  
  function chanceForPlayerGoal() {
    let chance = 0.44;
    if (state.difficulty === 2) chance = 0.36;
    if (state.difficulty === 3) chance = 0.29;
    if (state.bonusFlags.playerAttackBoostActive) chance += 0.12;
    return Math.random() < chance;
  }
  
  function chanceForEnemyGoal() {
    let chance = 0.28;
    if (state.difficulty === 2) chance = 0.38;
    if (state.difficulty === 3) chance = 0.5;
    return Math.random() < chance;
  }
  
  function getPenaltyOptionsByDifficulty() {
    if (state.difficulty === 1) {
      return ["esquerda", "direita"];
    }
    if (state.difficulty === 2) {
      return ["esquerda", "centro", "direita"];
    }
    return ["alto esquerda", "baixo esquerda", "centro", "alto direita", "baixo direita"];
  }
  
  function getVisualPosition(choice) {
    const map = {
      "esquerda": { left: "28%", top: "48%" },
      "direita": { left: "72%", top: "48%" },
      "centro": { left: "50%", top: "48%" },
      "alto esquerda": { left: "28%", top: "28%" },
      "baixo esquerda": { left: "28%", top: "54%" },
      "alto direita": { left: "72%", top: "28%" },
      "baixo direita": { left: "72%", top: "54%" }
    };
    return map[choice] || { left: "50%", top: "48%" };
  }
  
  async function openPenaltyScreen(side) {
    penaltyOptions.innerHTML = "";
    penaltyFeedback.textContent = "";
    ballMarker.classList.add("hidden");
    keeperMarker.style.left = "50%";
    keeperMarker.style.top = "56%";
  
    const options = getPenaltyOptionsByDifficulty();
  
    if (side === "player") {
      penaltyTitle.textContent = "Pênalti para seu time";
      penaltySubtitle.textContent = "Escolha para qual canto o atacante vai chutar.";
    } else {
      penaltyTitle.textContent = "Pênalti para o adversário";
      penaltySubtitle.textContent = "Escolha para qual canto o goleiro deve pular.";
    }
  
    penaltyScreen.classList.remove("hidden");
  
    return new Promise(resolve => {
      state.penaltyResolver = resolve;
  
      options.forEach(option => {
        const btn = document.createElement("button");
        btn.className = "penalty-option-btn";
        btn.textContent = option;
  
        btn.addEventListener("click", async () => {
          penaltyOptions.querySelectorAll("button").forEach(b => (b.disabled = true));
  
          if (side === "player") {
            const shot = option;
            const keeper = randomFrom(options);
  
            const ballPos = getVisualPosition(shot);
            const keeperPos = getVisualPosition(keeper);
  
            ballMarker.classList.remove("hidden");
            ballMarker.style.left = "50%";
            ballMarker.style.top = "74%";
  
            await delay(220);
  
            ballMarker.style.left = ballPos.left;
            ballMarker.style.top = ballPos.top;
            keeperMarker.style.left = keeperPos.left;
            keeperMarker.style.top = keeperPos.top;
  
            await delay(550);
  
            const defended = shot === keeper;
            penaltyFeedback.textContent = defended ? "Defesa!" : "Gol!";
  
            await delay(700);
            penaltyScreen.classList.add("hidden");
  
            const resolver = state.penaltyResolver;
            state.penaltyResolver = null;
            resolver({ shot, keeper, defended });
          } else {
            const keeper = option;
            const shot = randomFrom(options);
  
            const keeperPos = getVisualPosition(keeper);
            const ballPos = getVisualPosition(shot);
  
            keeperMarker.style.left = keeperPos.left;
            keeperMarker.style.top = keeperPos.top;
  
            await delay(220);
  
            ballMarker.classList.remove("hidden");
            ballMarker.style.left = ballPos.left;
            ballMarker.style.top = ballPos.top;
  
            await delay(550);
  
            const defended = shot === keeper;
            penaltyFeedback.textContent = defended ? "Defesa!" : "Gol!";
  
            await delay(700);
            penaltyScreen.classList.add("hidden");
  
            const resolver = state.penaltyResolver;
            state.penaltyResolver = null;
            resolver({ shot, keeper, defended });
          }
        });
  
        penaltyOptions.appendChild(btn);
      });
    });
  }
  
  async function resolveInteractivePenalty(side, forcedByBonus = false) {
    if (side === "enemy" && state.bonusFlags.cancelPenaltyAgainstAvailable && !forcedByBonus) {
      state.bonusFlags.cancelPenaltyAgainstAvailable = false;
      logMessage(
        `<strong>${state.minute}'</strong> ${iconGlove()} O bônus secreto anulou o pênalti contra antes mesmo da cobrança!`,
        "save"
      );
      return;
    }
  
    const result = await openPenaltyScreen(side);
  
    if (side === "player") {
      if (result.defended) {
        logMessage(
          `<strong>${state.minute}'</strong> ${iconGlove()} Você escolheu chutar em <strong>${result.shot}</strong>, mas o goleiro rival defendeu!`,
          "save"
        );
      } else {
        state.scorePlayer++;
        logMessage(
          `<strong>${state.minute}'</strong> ${iconBall()} Você escolheu o canto <strong>${result.shot}</strong> e marcou o gol!`,
          "goal"
        );
      }
    } else {
      if (result.defended) {
        logMessage(
          `<strong>${state.minute}'</strong> ${iconGlove()} Você pulou em <strong>${result.keeper}</strong> e defendeu o pênalti!`,
          "save"
        );
      } else {
        state.scoreEnemy++;
        logMessage(
          `<strong>${state.minute}'</strong> ${iconBall()} Você pulou em <strong>${result.keeper}</strong>, mas a bola foi em <strong>${result.shot}</strong>. Gol do adversário.`,
          "goal"
        );
      }
    }
  }
  
  function applyYellowCard(target) {
    const playerNumber = randomFrom([1,2,3,4,5,6,7,8,9,10,11]);
  
    if (target === "player") {
      state.playerYellows[playerNumber] = (state.playerYellows[playerNumber] || 0) + 1;
  
      logMessage(
        `<strong>${state.minute}'</strong> ${iconCard()} Cartão amarelo para o <strong>${state.playerTeam.name}</strong>, jogador <strong>#${playerNumber}</strong>.`,
        "card"
      );
  
      if (state.playerYellows[playerNumber] >= 2) {
        if (state.difficulty < 3) state.difficulty++;
        logMessage(
          `<strong>${state.minute}'</strong> 🟥 Segundo amarelo para o jogador <strong>#${playerNumber}</strong>. A dificuldade sobe para <strong>${getDifficultyLabel()}</strong>.`,
          "card"
        );
      }
    } else {
      state.enemyYellows[playerNumber] = (state.enemyYellows[playerNumber] || 0) + 1;
  
      logMessage(
        `<strong>${state.minute}'</strong> ${iconCard()} Cartão amarelo para o <strong>${state.enemyTeam.name}</strong>, jogador <strong>#${playerNumber}</strong>.`,
        "card"
      );
  
      if (state.enemyYellows[playerNumber] >= 2) {
        if (state.difficulty > 1) state.difficulty--;
        logMessage(
          `<strong>${state.minute}'</strong> 🟥 O rival recebe o segundo amarelo no jogador <strong>#${playerNumber}</strong>. A dificuldade cai para <strong>${getDifficultyLabel()}</strong>.`,
          "card"
        );
      }
    }
  }
  
  async function resolveEvent(eventData) {
    switch (eventData.type) {
      case "goal_player":
        if (chanceForPlayerGoal()) {
          state.scorePlayer++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} GOL do <strong>${state.playerTeam.name}</strong>!`,
            "goal"
          );
        } else {
          logMessage(`<strong>${state.minute}'</strong> Seu time atacou bem, mas finalizou para fora.`);
        }
        break;
  
      case "goal_enemy":
        if (chanceForEnemyGoal()) {
          state.scoreEnemy++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Gol do <strong>${state.enemyTeam.name}</strong>.`,
            "goal"
          );
        } else {
          logMessage(
            `<strong>${state.minute}'</strong> ${iconGlove()} O adversário finaliza, mas seu goleiro segura.`,
            "save"
          );
        }
        break;
  
      case "yellow_player":
        applyYellowCard("player");
        break;
  
      case "yellow_enemy":
        applyYellowCard("enemy");
        break;
  
      case "corner_player":
        if (Math.random() < 0.34) {
          state.scorePlayer++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Escanteio venenoso e gol do <strong>${state.playerTeam.name}</strong>!`,
            "goal"
          );
        } else {
          logMessage(`<strong>${state.minute}'</strong> Escanteio a favor, mas a zaga rival afastou.`);
        }
        break;
  
      case "corner_enemy":
        if (Math.random() < 0.34 + state.difficulty * 0.05) {
          state.scoreEnemy++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Escanteio contra e gol do <strong>${state.enemyTeam.name}</strong>.`,
            "goal"
          );
        } else {
          logMessage(
            `<strong>${state.minute}'</strong> ${iconGlove()} Sua defesa salva no escanteio contra.`,
            "save"
          );
        }
        break;
  
      case "danger_player":
        if (Math.random() < 0.42 + (state.bonusFlags.playerAttackBoostActive ? 0.1 : 0)) {
          state.scorePlayer++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Jogada de perigo bem concluída. Gol!`,
            "goal"
          );
        } else {
          logMessage(`<strong>${state.minute}'</strong> Seu ataque rondou a área, mas faltou precisão.`);
        }
        break;
  
      case "danger_enemy":
        if (Math.random() < 0.42 + state.difficulty * 0.05) {
          state.scoreEnemy++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Contra-ataque mortal do adversário. Gol.`,
            "goal"
          );
        } else {
          logMessage(
            `<strong>${state.minute}'</strong> ${iconGlove()} O rival ameaça, mas seu goleiro fecha o ângulo.`,
            "save"
          );
        }
        break;
  
      case "danger_player_big":
        if (Math.random() < 0.58 + (state.bonusFlags.playerAttackBoostActive ? 0.1 : 0)) {
          state.scorePlayer++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Grande chance criada e convertida em gol!`,
            "goal"
          );
        } else {
          logMessage(
            `<strong>${state.minute}'</strong> ${iconGlove()} Grande chance do seu time, mas o goleiro rival salva.`,
            "save"
          );
        }
        break;
  
      case "danger_enemy_big":
        if (state.bonusFlags.saveNextBigEnemyAvailable) {
          state.bonusFlags.saveNextBigEnemyAvailable = false;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconGlove()} A defesa milagrosa guardada entra em ação e impede a grande chance rival!`,
            "save"
          );
        } else if (Math.random() < 0.58 + state.difficulty * 0.05) {
          state.scoreEnemy++;
          logMessage(
            `<strong>${state.minute}'</strong> ${iconBall()} Grande chance do adversário convertida em gol.`,
            "goal"
          );
        } else {
          logMessage(
            `<strong>${state.minute}'</strong> ${iconGlove()} Seu goleiro faz um milagre e salva a grande chance rival!`,
            "save"
          );
        }
        break;
  
      case "penalty_player":
        await resolveInteractivePenalty("player");
        break;
  
      case "penalty_enemy":
        await resolveInteractivePenalty("enemy");
        break;
  
      case "boost":
        if (state.difficulty > 1) {
          state.difficulty--;
          logMessage(
            `<strong>${state.minute}'</strong> 📈 Seu time organiza melhor o jogo. A dificuldade cai para <strong>${getDifficultyLabel()}</strong>.`
          );
        } else {
          logMessage(`<strong>${state.minute}'</strong> Seu time cresce, mas a dificuldade já está no mínimo.`);
        }
        break;
  
      case "nothing":
      default:
        logMessage(`<strong>${state.minute}'</strong> A partida trava no meio-campo e nada decisivo acontece.`);
        break;
    }
  }
  
  function endMatch() {
    state.matchEnded = true;
    eventCardsContainer.innerHTML = "";
    revealSelectedBtn.classList.add("hidden");
    nextTurnBtn.classList.add("hidden");
    setMatchVisualState(false);
  
    let title = "";
    let text = "";
  
    if (state.gameMode === "single") {
      title = state.scorePlayer > state.scoreEnemy ? "Vitória!" :
              state.scorePlayer < state.scoreEnemy ? "Derrota" : "Empate";
  
      text = `Placar final: ${state.playerTeam.name} ${state.scorePlayer} x ${state.scoreEnemy} ${state.enemyTeam.name}.`;
      continueCampaignBtn.classList.add("hidden");
      restartCampaignBtn.classList.remove("hidden");
      restartCampaignBtn.textContent = "Voltar ao início";
    } else {
      if (state.scorePlayer > state.scoreEnemy) {
        title = "Vitória!";
        if (state.currentStageIndex < STAGES.length - 1) {
          text = `Você venceu ${state.enemyTeam.name} por ${state.scorePlayer} x ${state.scoreEnemy} e avançou para ${STAGES[state.currentStageIndex + 1].label}.`;
          continueCampaignBtn.classList.remove("hidden");
          restartCampaignBtn.classList.add("hidden");
          setCampaignStatus(`Classificado para ${STAGES[state.currentStageIndex + 1].label}`);
        } else {
          text = `Você venceu a final contra ${state.enemyTeam.name} por ${state.scorePlayer} x ${state.scoreEnemy} e conquistou a Copa do Caos!`;
          continueCampaignBtn.classList.add("hidden");
          restartCampaignBtn.classList.remove("hidden");
          restartCampaignBtn.textContent = "Voltar ao início";
          setCampaignStatus("Campeão da Copa do Caos");
        }
      } else if (state.scorePlayer < state.scoreEnemy) {
        title = "Derrota";
        text = `Você perdeu para ${state.enemyTeam.name} por ${state.scorePlayer} x ${state.scoreEnemy}. A campanha foi encerrada.`;
        continueCampaignBtn.classList.add("hidden");
        restartCampaignBtn.classList.remove("hidden");
        restartCampaignBtn.textContent = "Voltar ao início";
        setCampaignStatus("Campanha encerrada");
      } else {
        title = "Empate";
        text = `A partida terminou empatada em ${state.scorePlayer} x ${state.scoreEnemy}. Neste protótipo, empate encerra a campanha.`;
        continueCampaignBtn.classList.add("hidden");
        restartCampaignBtn.classList.remove("hidden");
        restartCampaignBtn.textContent = "Voltar ao início";
        setCampaignStatus("Empate eliminatório");
      }
    }
  
    resultTitle.textContent = title;
    resultText.textContent = text;
    logMessage(`<strong>🏁 Fim de jogo!</strong> ${text}`);
    showScreen(screenResult);
  }
  
  function advanceCampaign() {
    state.currentStageIndex++;
    state.enemyTeam = null;
    state.hiddenBonus = null;
    updateTournamentUI();
    state.phase = "choose-enemy";
    setMatchVisualState(false);
    setupSelectionPhase();
    showScreen(screenSelection);
  }
  
  function resetToHome() {
    goHome();
  }
  
  openModeMenuBtn.addEventListener("click", openModeMenu);
  openHowToPlayBtn.addEventListener("click", openHowToPlay);
  closeHowToPlayBtn.addEventListener("click", openModeMenu);
  backHomeBtn.addEventListener("click", goHome);
  
  singleMatchBtn.addEventListener("click", startSingleMatchMode);
  championshipBtn.addEventListener("click", startChampionshipMode);
  
  confirmYes.addEventListener("click", () => {
    if (state.pendingChoice?.type === "selection") {
      revealSelection(state.pendingChoice.index);
    } else if (state.pendingChoice?.type === "bonus") {
      revealBonusChoice(state.pendingChoice.index, state.pendingChoice.options);
    }
  
    state.pendingChoice = null;
    confirmModal.classList.add("hidden");
  });
  
  confirmNo.addEventListener("click", () => {
    state.pendingChoice = null;
    confirmModal.classList.add("hidden");
  });
  
  nextStageBtn.addEventListener("click", () => {
    state.phase = "choose-enemy";
    setupSelectionPhase();
  });
  
  toBonusBtn.addEventListener("click", setupBonusPhase);
  confirmBonusStageBtn.addEventListener("click", startMatch);
  
  revealSelectedBtn.addEventListener("click", revealChosenCardsSequentially);
  nextTurnBtn.addEventListener("click", generateTurn);
  
  continueCampaignBtn.addEventListener("click", advanceCampaign);
  restartCampaignBtn.addEventListener("click", resetToHome);
  
  progressBtn.addEventListener("click", executeProgressAction);
  progressCard.addEventListener("click", executeProgressAction);
  progressOverlay.addEventListener("click", (e) => {
    if (e.target === progressOverlay) {
      executeProgressAction();
    }
  });
  
  goHome();
  updateScoreboard();