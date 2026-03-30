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
    { id: 10, name: "Raposas da Vila", emoji: "🦊" }
  ];
  
  const EVENT_POOL = [
    {
      type: "goal_player",
      title: "Ataque fulminante",
      description: "Seu time encaixa uma jogada rápida.",
      tag: "Chance de gol"
    },
    {
      type: "goal_enemy",
      title: "Vacilo defensivo",
      description: "O adversário encontra espaço e leva perigo.",
      tag: "Risco"
    },
    {
      type: "yellow_player",
      title: "Carrinho atrasado",
      description: "Seu time pode receber cartão amarelo.",
      tag: "Disciplina"
    },
    {
      type: "yellow_enemy",
      title: "Pressão ofensiva",
      description: "O adversário para a jogada com falta.",
      tag: "Disciplina"
    },
    {
      type: "corner_player",
      title: "Escanteio a favor",
      description: "Bola desviada, chance na área.",
      tag: "Bola parada"
    },
    {
      type: "corner_enemy",
      title: "Escanteio contra",
      description: "A defesa afasta mal e cede escanteio.",
      tag: "Bola parada"
    },
    {
      type: "danger_player",
      title: "Jogada de perigo",
      description: "Seu ataque cresce no jogo.",
      tag: "Pressão"
    },
    {
      type: "danger_enemy",
      title: "Contra-ataque rival",
      description: "O adversário acelera e complica.",
      tag: "Pressão"
    },
    {
      type: "penalty_player",
      title: "Pênalti para seu time",
      description: "O juiz apontou para a marca da cal.",
      tag: "Decisivo"
    },
    {
      type: "penalty_enemy",
      title: "Pênalti para o adversário",
      description: "A situação ficou dramática.",
      tag: "Decisivo"
    },
    {
      type: "nothing",
      title: "Bola no meio-campo",
      description: "Muita disputa, pouca criação.",
      tag: "Neutro"
    },
    {
      type: "boost",
      title: "Momento de inspiração",
      description: "Seu time ganha confiança.",
      tag: "Bônus"
    }
  ];
  
  const state = {
    phase: "choose-player",
    availableTeams: [],
    playerTeam: null,
    enemyTeam: null,
    selectedCardIndex: null,
    pendingChoice: null,
  
    scorePlayer: 0,
    scoreEnemy: 0,
    minute: 0,
    difficulty: 1, // 1 fácil, 2 médio, 3 difícil
    picksThisTurn: 0,
    maxPicksPerTurn: 3,
    matchEnded: false,
  
    playerYellows: {},
    enemyYellows: {}
  };
  
  // ELEMENTOS
  const screenSelection = document.getElementById("screen-selection");
  const screenMatch = document.getElementById("screen-match");
  
  const selectionTitle = document.getElementById("selection-title");
  const selectionSubtitle = document.getElementById("selection-subtitle");
  const selectionGrid = document.getElementById("selection-grid");
  
  const nextStageBtn = document.getElementById("next-stage-btn");
  const startMatchBtn = document.getElementById("start-match-btn");
  
  const playerShield = document.getElementById("player-shield");
  const playerTeamName = document.getElementById("player-team-name");
  const enemyShield = document.getElementById("enemy-shield");
  const enemyTeamName = document.getElementById("enemy-team-name");
  const scoreDisplay = document.getElementById("score-display");
  const minuteDisplay = document.getElementById("minute-display");
  const difficultyDisplay = document.getElementById("difficulty-display");
  
  const eventCardsContainer = document.getElementById("event-cards");
  const matchLog = document.getElementById("match-log");
  const nextTurnBtn = document.getElementById("next-turn-btn");
  const restartBtn = document.getElementById("restart-btn");
  
  const confirmModal = document.getElementById("confirm-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  
  // UTIL
  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  
  function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  function getDifficultyLabel() {
    if (state.difficulty === 1) return "Fácil";
    if (state.difficulty === 2) return "Médio";
    return "Difícil";
  }
  
  function logMessage(message) {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = message;
    matchLog.prepend(div);
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
  
  // SELEÇÃO
  function setupSelectionPhase() {
    state.availableTeams = shuffle(TEAMS);
    state.selectedCardIndex = null;
  
    selectionGrid.innerHTML = "";
    nextStageBtn.classList.add("hidden");
    startMatchBtn.classList.add("hidden");
  
    if (state.phase === "choose-player") {
      selectionTitle.textContent = "Escolha seu time";
      selectionSubtitle.textContent = "Clique em um card para revelar o time que vai iniciar sua campanha.";
    } else {
      selectionTitle.textContent = "Escolha seu adversário";
      selectionSubtitle.textContent = "Agora o destino escolhe quem vai tentar acabar com seus sonhos.";
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
  
      card.addEventListener("click", () => handleCardClick(index));
      selectionGrid.appendChild(card);
    });
  }
  
  function handleCardClick(index) {
    const chosenTeam = state.availableTeams[index];
  
    if (state.phase === "choose-enemy" && chosenTeam.id === state.playerTeam.id) {
      return;
    }
  
    state.pendingChoice = index;
    modalTitle.textContent = "Confirmar escolha";
    modalText.textContent =
      state.phase === "choose-player"
        ? `Deseja iniciar a campanha com ${chosenTeam.name}?`
        : `Deseja enfrentar ${chosenTeam.name} nesta rodada?`;
  
    confirmModal.classList.remove("hidden");
  }
  
  function revealSelection(index) {
    const cards = [...document.querySelectorAll(".pick-card")];
  
    cards.forEach((card, i) => {
      const team = state.availableTeams[i];
      card.classList.add("flipped", "disabled");
  
      if (i === index) {
        card.classList.add("chosen");
      } else {
        if (
          state.phase === "choose-enemy" &&
          state.playerTeam &&
          team.id === state.playerTeam.id
        ) {
          card.classList.add("disabled");
        } else {
          card.classList.add("rejected");
        }
      }
    });
  
    const chosenTeam = state.availableTeams[index];
  
    if (state.phase === "choose-player") {
      state.playerTeam = chosenTeam;
      logMessage(`<strong>Início de campanha:</strong> você assumiu o comando do <strong>${chosenTeam.name}</strong>.`);
      nextStageBtn.classList.remove("hidden");
    } else {
      state.enemyTeam = chosenTeam;
      logMessage(`<strong>Próximo desafio:</strong> o adversário da rodada será <strong>${chosenTeam.name}</strong>.`);
      startMatchBtn.classList.remove("hidden");
    }
  }
  
  // PARTIDA
  function startMatch() {
    screenSelection.classList.remove("active");
    screenMatch.classList.add("active");
  
    state.scorePlayer = 0;
    state.scoreEnemy = 0;
    state.minute = 0;
    state.difficulty = 1;
    state.matchEnded = false;
    state.playerYellows = {};
    state.enemyYellows = {};
  
    updateScoreboard();
    logMessage(`<strong>Apito inicial!</strong> ${state.playerTeam.name} x ${state.enemyTeam.name}.`);
    generateTurn();
  }
  
  function generateTurn() {
    if (state.matchEnded) return;
  
    state.picksThisTurn = 0;
    nextTurnBtn.classList.add("hidden");
    eventCardsContainer.innerHTML = "";
  
    const cards = shuffle(EVENT_POOL).slice(0, 5);
  
    cards.forEach((eventData) => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <div>
          <h3>${eventData.title}</h3>
          <p>${eventData.description}</p>
        </div>
        <span class="tag">${eventData.tag}</span>
      `;
  
      card.addEventListener("click", () => selectEventCard(card, eventData));
      eventCardsContainer.appendChild(card);
    });
  }
  
  function selectEventCard(cardElement, eventData) {
    if (cardElement.classList.contains("used")) return;
    if (state.picksThisTurn >= state.maxPicksPerTurn) return;
  
    cardElement.classList.add("used");
    state.picksThisTurn++;
  
    advanceMinute();
    resolveEvent(eventData);
    updateScoreboard();
  
    if (state.minute >= 90) {
      endMatch();
      return;
    }
  
    if (state.picksThisTurn >= state.maxPicksPerTurn) {
      nextTurnBtn.classList.remove("hidden");
    }
  }
  
  function advanceMinute() {
    const increment = randomFrom([5, 7, 8, 10, 12]);
    state.minute += increment;
    if (state.minute > 90) state.minute = 90;
  }
  
  function resolveEvent(eventData) {
    switch (eventData.type) {
      case "goal_player":
        if (chanceForPlayerGoal()) {
          state.scorePlayer++;
          logMessage(`<strong>${state.minute}'</strong> GOL do <strong>${state.playerTeam.name}</strong>! A torcida explode no estádio.`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> Seu time chegou bem, mas desperdiçou a chance.`);
        }
        break;
  
      case "goal_enemy":
        if (chanceForEnemyGoal()) {
          state.scoreEnemy++;
          logMessage(`<strong>${state.minute}'</strong> Gol do <strong>${state.enemyTeam.name}</strong>. A defesa ficou olhando o horizonte.`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> O adversário finalizou, mas sem sucesso.`);
        }
        break;
  
      case "yellow_player":
        applyYellowCard("player");
        break;
  
      case "yellow_enemy":
        applyYellowCard("enemy");
        break;
  
      case "corner_player":
        if (Math.random() < 0.35) {
          state.scorePlayer++;
          logMessage(`<strong>${state.minute}'</strong> Escanteio venenoso e gol do <strong>${state.playerTeam.name}</strong>!`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> Escanteio para seu time, mas a zaga afastou.`);
        }
        break;
  
      case "corner_enemy":
        if (Math.random() < 0.35 + state.difficulty * 0.05) {
          state.scoreEnemy++;
          logMessage(`<strong>${state.minute}'</strong> Escanteio contra e gol do <strong>${state.enemyTeam.name}</strong>.`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> Escanteio para o adversário, mas sua defesa salvou.`);
        }
        break;
  
      case "danger_player":
        if (Math.random() < 0.45) {
          state.scorePlayer++;
          logMessage(`<strong>${state.minute}'</strong> Jogada de perigo convertida! Bola na rede para o seu time.`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> Seu time pressionou, mas faltou capricho na finalização.`);
        }
        break;
  
      case "danger_enemy":
        if (Math.random() < 0.45 + state.difficulty * 0.05) {
          state.scoreEnemy++;
          logMessage(`<strong>${state.minute}'</strong> Contra-ataque mortal do adversário. Gol.`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> O rival ameaçou, mas seu goleiro segurou firme.`);
        }
        break;
  
      case "penalty_player":
        resolveSimplePenalty("player");
        break;
  
      case "penalty_enemy":
        resolveSimplePenalty("enemy");
        break;
  
      case "boost":
        if (state.difficulty > 1) {
          state.difficulty--;
          logMessage(`<strong>${state.minute}'</strong> Seu time ganha confiança. A dificuldade cai para <strong>${getDifficultyLabel()}</strong>.`);
        } else {
          logMessage(`<strong>${state.minute}'</strong> Momento positivo, mas a dificuldade já está no nível mínimo.`);
        }
        break;
  
      case "nothing":
      default:
        logMessage(`<strong>${state.minute}'</strong> O jogo fica truncado e nada decisivo acontece.`);
        break;
    }
  }
  
  function chanceForPlayerGoal() {
    let chance = 0.45;
    if (state.difficulty === 2) chance = 0.38;
    if (state.difficulty === 3) chance = 0.3;
    return Math.random() < chance;
  }
  
  function chanceForEnemyGoal() {
    let chance = 0.28;
    if (state.difficulty === 2) chance = 0.38;
    if (state.difficulty === 3) chance = 0.5;
    return Math.random() < chance;
  }
  
  function resolveSimplePenalty(side) {
    if (side === "player") {
      const convert = Math.random() < 0.7;
      if (convert) {
        state.scorePlayer++;
        logMessage(`<strong>${state.minute}'</strong> Pênalti para seu time... cobrança firme e gol!`);
      } else {
        logMessage(`<strong>${state.minute}'</strong> Pênalti para seu time... e o goleiro adversário defende!`);
      }
    } else {
      const baseChance = state.difficulty === 1 ? 0.45 : state.difficulty === 2 ? 0.65 : 0.78;
      const convert = Math.random() < baseChance;
      if (convert) {
        state.scoreEnemy++;
        logMessage(`<strong>${state.minute}'</strong> Pênalti para o adversário... gol.`);
      } else {
        logMessage(`<strong>${state.minute}'</strong> Pênalti para o adversário... seu goleiro salva o time!`);
      }
    }
  }
  
  function applyYellowCard(target) {
    const playerNumber = randomFrom([1,2,3,4,5,6,7,8,9,10,11]);
  
    if (target === "player") {
      state.playerYellows[playerNumber] = (state.playerYellows[playerNumber] || 0) + 1;
  
      logMessage(
        `<strong>${state.minute}'</strong> Cartão amarelo para o <strong>${state.playerTeam.name}</strong>, jogador <strong>#${playerNumber}</strong>.`
      );
  
      if (state.playerYellows[playerNumber] >= 2) {
        if (state.difficulty < 3) state.difficulty++;
        logMessage(
          `<strong>${state.minute}'</strong> O jogador <strong>#${playerNumber}</strong> recebeu o segundo amarelo. A dificuldade sobe para <strong>${getDifficultyLabel()}</strong>.`
        );
      }
    } else {
      state.enemyYellows[playerNumber] = (state.enemyYellows[playerNumber] || 0) + 1;
  
      logMessage(
        `<strong>${state.minute}'</strong> Cartão amarelo para o <strong>${state.enemyTeam.name}</strong>, jogador <strong>#${playerNumber}</strong>.`
      );
  
      if (state.enemyYellows[playerNumber] >= 2) {
        if (state.difficulty > 1) state.difficulty--;
        logMessage(
          `<strong>${state.minute}'</strong> O adversário perde equilíbrio com o segundo amarelo do jogador <strong>#${playerNumber}</strong>. A dificuldade cai para <strong>${getDifficultyLabel()}</strong>.`
        );
      }
    }
  }
  
  function endMatch() {
    state.matchEnded = true;
    eventCardsContainer.innerHTML = "";
    nextTurnBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
  
    let resultText = "";
  
    if (state.scorePlayer > state.scoreEnemy) {
      resultText = `Vitória do <strong>${state.playerTeam.name}</strong>! Uma campanha promissora começa a ganhar forma.`;
    } else if (state.scorePlayer < state.scoreEnemy) {
      resultText = `Derrota para o <strong>${state.enemyTeam.name}</strong>. O caos venceu esta batalha.`;
    } else {
      resultText = `Empate. Ninguém sorri, ninguém dorme em paz.`;
    }
  
    logMessage(`<strong>Fim de jogo!</strong> ${resultText}`);
  }
  
  // MODAL
  confirmYes.addEventListener("click", () => {
    if (state.pendingChoice !== null) {
      revealSelection(state.pendingChoice);
    }
    state.pendingChoice = null;
    confirmModal.classList.add("hidden");
  });
  
  confirmNo.addEventListener("click", () => {
    state.pendingChoice = null;
    confirmModal.classList.add("hidden");
  });
  
  // BOTÕES
  nextStageBtn.addEventListener("click", () => {
    state.phase = "choose-enemy";
    setupSelectionPhase();
  });
  
  startMatchBtn.addEventListener("click", () => {
    startMatch();
  });
  
  nextTurnBtn.addEventListener("click", () => {
    generateTurn();
  });
  
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
  
  // INIT
  setupSelectionPhase();
  updateScoreboard();