// Elementos DOM específicos da página de gameplay e cenas
const scenePresentationOverlay = document.getElementById('scenePresentationOverlay');
const sceneBackground = document.getElementById('sceneBackground');
const sceneTextElement = document.getElementById('sceneText');
const sceneChoicesContainer = document.getElementById('sceneChoices');

const gamePlaySection = document.querySelector('.game-play-section-new');
const displayPlayerName = document.getElementById('displayPlayerName');
const displayPlayerClass = document.getElementById('displayPlayerClass');
const playerImage = document.getElementById('playerImage');
const playerFullBodyImage = document.getElementById('playerFullBodyImage');
const runesAmountElement = document.getElementById('runesAmount');

const playerHealthBar = document.getElementById('playerHealthBar');
const playerManaBar = document.getElementById('playerManaBar');
const playerStaminaBar = document.getElementById('playerStaminaBar');
const staminaRegenEffect = document.querySelector('.stamina-regen-effect');

const playerDetailedLevel = document.getElementById('playerDetailedLevel');
const playerDetailedHP = document.getElementById('playerDetailedHP');
const playerDetailedMana = document.getElementById('playerDetailedMana');
const playerDetailedStamina = document.getElementById('playerDetailedStamina');

const mainGameArea = document.querySelector('.main-game-area');
const bottomBar = document.querySelector('.bottom-bar');

// Variáveis de estado do jogo (podem ser carregadas do sessionStorage ou save)
let currentPlayer = null;
let currentSceneId = 'cemiterio_inicio';
let currentStamina = 100;
let maxStamina = 100;
let isRegeneratingStamina = false;
let estusFlasks = 3;
let maxEstusFlasks = 3;
let runes = 0;

// Mapeamento de classes para suas imagens padrão (será usado aqui para exibir a imagem do jogador)
const classImages = {
    samurai: 'img/samurai.jpg',
    vagabond: 'img/vagabundo.jpg',
    prophet: 'img/profeta.jpg',
};

// Mapeamento de classes para suas imagens de corpo inteiro (PLACEHOLDER)
const classImagesFullBody = {
    samurai: 'img/samurai.jpg', // Usando a mesma por enquanto, ajustar conforme necessário
    vagabond: 'img/vagabundo.jpg',
    prophet: 'img/prophet.jpg',
};

// Game Environment Management
const gameEnvironment = document.querySelector('.game-environment');
const environmentBackground = document.querySelector('.environment-background');
const environmentInteractive = document.querySelector('.environment-interactive');
const environmentCharacters = document.querySelector('.environment-characters');
const environmentEffects = document.querySelector('.environment-effects');
const enemyContainer = document.getElementById('enemyContainer');

// Player position and movement
let playerPosition = { x: 100, y: 100 };
let playerVelocity = { x: 0, y: 0 };
const playerSpeed = 5;
const playerSize = 64; // Should match CSS width/height

// Collision detection
function checkCollision(playerX, playerY) {
    const collisionObjects = document.querySelectorAll('.collision-object');
    const playerRect = {
        left: playerX - playerSize/2,
        right: playerX + playerSize/2,
        top: playerY - playerSize/2,
        bottom: playerY + playerSize/2
    };

    for (const obj of collisionObjects) {
        const rect = obj.getBoundingClientRect();
        const gameRect = gameEnvironment.getBoundingClientRect();
        
        const objRect = {
            left: rect.left - gameRect.left,
            right: rect.right - gameRect.left,
            top: rect.top - gameRect.top,
            bottom: rect.bottom - gameRect.top
        };

        if (playerRect.left < objRect.right &&
            playerRect.right > objRect.left &&
            playerRect.top < objRect.bottom &&
            playerRect.bottom > objRect.top) {
            return true;
        }
    }
    return false;
}

// Interactive objects
function setupInteractiveObjects() {
    const interactiveObjects = document.querySelectorAll('.interactive-object');
    interactiveObjects.forEach(obj => {
        obj.addEventListener('click', () => {
            const type = obj.dataset.type;
            handleInteraction(type, obj);
        });
    });
}

function handleInteraction(type, object) {
    switch(type) {
        case 'chest':
            // Implement chest opening logic
            console.log('Opening chest...');
            break;
        // Add more interaction types as needed
    }
}

// Enemy spawning
function spawnEnemy(type, x, y) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.dataset.type = type;
    enemy.style.left = `${x}px`;
    enemy.style.top = `${y}px`;
    
    // Add enemy sprite
    const sprite = document.createElement('div');
    sprite.className = 'enemy-sprite';
    enemy.appendChild(sprite);
    
    enemyContainer.appendChild(enemy);
    return enemy;
}

function setupEnemySpawns() {
    const spawnPoints = document.querySelectorAll('.enemy-spawn');
    spawnPoints.forEach(spawn => {
        const type = spawn.dataset.type;
        const rect = spawn.getBoundingClientRect();
        const gameRect = gameEnvironment.getBoundingClientRect();
        
        const x = rect.left - gameRect.left;
        const y = rect.top - gameRect.top;
        
        spawnEnemy(type, x, y);
    });
}

// Player movement
function updatePlayerPosition() {
    const newX = playerPosition.x + playerVelocity.x;
    const newY = playerPosition.y + playerVelocity.y;
    
    if (!checkCollision(newX, newY)) {
        playerPosition.x = newX;
        playerPosition.y = newY;
        playerImage.style.left = `${playerPosition.x}px`;
        playerImage.style.top = `${playerPosition.y}px`;
    }
}

// Keyboard controls
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    updatePlayerVelocity();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    updatePlayerVelocity();
});

function updatePlayerVelocity() {
    playerVelocity.x = 0;
    playerVelocity.y = 0;
    
    if (keys['ArrowLeft'] || keys['a']) playerVelocity.x = -playerSpeed;
    if (keys['ArrowRight'] || keys['d']) playerVelocity.x = playerSpeed;
    if (keys['ArrowUp'] || keys['w']) playerVelocity.y = -playerSpeed;
    if (keys['ArrowDown'] || keys['s']) playerVelocity.y = playerSpeed;
}

// Game loop
function gameLoop() {
    updatePlayerPosition();
    requestAnimationFrame(gameLoop);
}

// Fog Effect Generation
function createFogTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Create gradient for fog
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 0.1;
        data[i] = data[i + 1] = data[i + 2] = 255;
        data[i + 3] = noise * 255;
    }
    ctx.putImageData(imageData, 0, 0);

    // Convert to base64 and set as background
    const fogLayers = document.querySelectorAll('.fog-layer');
    fogLayers.forEach(layer => {
        layer.style.backgroundImage = `url(${canvas.toDataURL()})`;
    });
}

// Initialize game environment
function initGameEnvironment() {
    // Create fog texture
    createFogTexture();
    
    // Set up game environment
    const gameEnvironment = document.querySelector('.game-environment');
    const backgroundLayer = document.querySelector('.environment-background');
    
    // Ensure background is loaded
    if (backgroundLayer) {
        backgroundLayer.style.backgroundImage = 'url("img/cemiterio.jpg")';
        
        // Add load event listener to ensure image is loaded
        const img = new Image();
        img.onload = () => {
            console.log('Cemetery background loaded successfully');
            // Initialize other game elements after background is loaded
            initGameElements();
        };
        img.onerror = () => {
            console.error('Failed to load cemetery background');
        };
        img.src = 'img/cemiterio.jpg';
    }
}

// Initialize game elements
function initGameElements() {
    // Set up player movement
    setupPlayerMovement();
    
    // Set up interactive objects
    setupInteractiveObjects();
    
    // Set up enemy spawn points
    setupEnemySpawns();
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// --- Lógica de Cenas e Escolhas (Game Flow) ---

const gameScenes = {
    cemiterio_inicio: {
        text: "VOCÊ ACORDA EM UM CEMITÉRIO À DERIVA. A NÉVOA DENSA ENVOLVE AS LÁPIDES QUEBRADAS E A LUZ FRACA DA LUA MAL CONSEGUE PENETRAR. A BRISA GÉLIDA SUSURRA SEGREDOS ANTIGOS ENQUANTO A IGREJA EM RUÍNAS SE ERGUE SOMBRIA À SUA FRENTE.",
        choices: [
            { text: "ENTRAR NA IGREJA", nextScene: "igreja_interior" },
            { text: "CAMINHAR EM DIREÇÃO À ESTÁTUA", nextScene: "estatua_cemiterio" }
        ],
        gameplayBackground: 'img/cemiterio.jpg',
        playerImage: 'img/samurai.jpg',
        enemyImage: null
    },
    igreja_interior: {
        text: "Você entra na igreja em ruínas. A poeira paira no ar, e o eco de seus passos reverbera nos vitrais quebrados. Um altar decrépito se ergue no centro, iluminado por uma fraca luz vinda do teto desabado.",
        choices: [
            { text: "EXAMINAR O ALTAR", nextScene: "altar_igreja" },
            { text: "VOLTAR AO CEMITÉRIO", nextScene: "cemiterio_inicio" }
        ],
        gameplayBackground: 'iconimg/interior-igreja.jpg',
        playerImage: 'img/samurai.jpg',
        enemyImage: null
    },
    estatua_cemiterio: {
        text: "Você se aproxima de uma estátua antiga, corroída pelo tempo e coberta de musgo. Seus traços são indecifráveis, mas uma aura de mistério a envolve.",
        choices: [
            { text: "TOCAR NA ESTÁTUA", nextScene: "estatua_toque" },
            { text: "VOLTAR AO CEMITÉRIO", nextScene: "cemiterio_inicio" }
        ],
        gameplayBackground: 'img/cemiterio.jpg',
        playerImage: 'img/samurai.jpg',
        enemyImage: null
    },
    altar_igreja: {
        text: "O altar está coberto de símbolos antigos e velas apagadas. Parece ter sido usado para rituais sombrios. Há algo escondido sob os escombros.",
        choices: [
            { text: "PEGAR O ITEM", nextScene: "item_encontrado" },
            { text: "VOLTAR PARA IGREJA", nextScene: "igreja_interior" }
        ],
        gameplayBackground: 'iconimg/interior-igreja.jpg',
        playerImage: 'img/samurai.jpg',
        enemyImage: null
    },
    item_encontrado: {
        text: "Você encontrou um Amuleto Amaldiçoado. Seus olhos sentem uma leve tontura ao olhar para ele. Seus Runes aumentaram em 50.",
        choices: [
            { text: "CONTINUAR", nextScene: "igreja_interior" }
        ],
        gameplayBackground: 'iconimg/interior-igreja.jpg',
        onEnter: (player) => {
            player.runes += 50;
            updateRunes(player.runes);
        },
        playerImage: 'img/samurai.jpg',
        enemyImage: null
    },
    estatua_toque: {
        text: "Ao tocar na estátua, uma energia antiga flui através de você, preenchendo-o com vitalidade. Sua vida e mana foram restauradas.",
        choices: [
            { text: "CONTINUAR", nextScene: "cemiterio_inicio" }
        ],
        gameplayBackground: 'img/cemiterio.jpg',
        onEnter: (player) => {
            player.health = player.maxHealth;
            player.mana = player.maxMana;
            updateHealthBar(player.health);
            updateManaBar(player.mana);
        },
        playerImage: 'img/samurai.jpg',
        enemyImage: null
    }
};

async function typeText(element, text) {
    element.textContent = ''; // Limpa o texto existente
    // Remove a borda de cursor CSS para controlá-la via JS
    element.style.borderRight = '.15em solid orange'; 

    const textArray = text.split('');
    let i = 0;

    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (i < textArray.length) {
                element.textContent += textArray[i];
                // Adiciona um pequeno atraso para que a renderização do DOM acompanhe
                if (i % 5 === 0) { // A cada 5 caracteres, força um reflow
                    element.offsetHeight; 
                }
                i++;
            } else {
                clearInterval(interval);
                element.style.borderRight = 'none'; // Esconde o cursor após digitar
                console.log('Texto digitado completamente.');
                
                // DEBUG: Log de dimensões do elemento de texto
                console.log('sceneTextElement dimensions:', {
                    scrollWidth: element.scrollWidth,
                    clientWidth: element.clientWidth,
                    scrollHeight: element.scrollHeight,
                    clientHeight: element.clientHeight,
                    offsetHeight: element.offsetHeight
                });

                if (element.scrollWidth > element.clientWidth) {
                    console.warn('Texto excedeu a largura do contêiner. Rolagem pode ser necessária ou ajuste de layout.', { scrollWidth: element.scrollWidth, clientWidth: element.clientWidth });
                }
                if (element.scrollHeight > element.clientHeight) {
                    console.warn('Texto excedeu a altura do contêiner. Rolagem pode ser necessária ou ajuste de layout.', { scrollHeight: element.scrollHeight, clientHeight: element.clientHeight });
                }

                resolve();
            }
        }, 30); // Velocidade de digitação mais rápida (ajuste conforme necessário)
    });
}

async function loadScene(sceneId) {
    const scene = gameScenes[sceneId];
    if (!scene) {
        console.error('Cena não encontrada:', sceneId);
        return;
    }

    // Atualiza a imagem de fundo da caixa de cena
    sceneBackground.style.backgroundImage = `url('${scene.gameplayBackground}')`;
    console.log(`Setting scene background to: ${scene.gameplayBackground}`); // Debug log
    
    // Esconde as escolhas enquanto o texto é digitado
    sceneChoicesContainer.style.display = 'none';
    sceneTextElement.textContent = ''; // Limpa o texto antes de digitar

    // Garante que a overlay da cena esteja visível
    scenePresentationOverlay.classList.remove('hidden');
    scenePresentationOverlay.style.pointerEvents = 'all'; // Permite cliques na overlay

    // Espera a digitação do texto terminar
    await typeText(sceneTextElement, scene.text);

    // Após o texto ser digitado, exibe as escolhas
    sceneChoicesContainer.innerHTML = ''; // Limpa e renderiza as escolhas
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('choice-button');
        button.textContent = choice.text;
        button.addEventListener('click', () => handleChoice(choice));
        sceneChoicesContainer.appendChild(button);
    });
    sceneChoicesContainer.style.display = 'flex'; // Exibe as escolhas
}

async function handleChoice(choice) {
    console.log('Escolha feita:', choice);
    // Desabilita as escolhas enquanto a transição acontece
    sceneChoicesContainer.style.pointerEvents = 'none';

    if (choice.action === 'start_gameplay') {
        console.log('Iniciando transição para gameplay...');
        scenePresentationOverlay.classList.add('hidden');
        scenePresentationOverlay.style.pointerEvents = 'none';

        setTimeout(() => {
            scenePresentationOverlay.style.display = 'none';
            mainGameArea.style.display = 'block';
            bottomBar.style.display = 'flex';
            
            mainGameArea.classList.add('active');
            bottomBar.classList.add('active');

            // Initialize player
            if (currentPlayer) {
                displayPlayerClass.textContent = currentPlayer.class.toUpperCase();
                displayPlayerName.textContent = currentPlayer.name;
                playerImage.src = classImages[currentPlayer.class];
                playerFullBodyImage.src = classImagesFullBody[currentPlayer.class];
            } else {
                displayPlayerClass.textContent = 'VAGABOND';
                displayPlayerName.textContent = 'Tarnished';
                playerImage.src = classImages['vagabond'];
                playerFullBodyImage.src = classImagesFullBody['vagabond'];
            }

            // Initialize game environment
            initGameEnvironment();

            // Set gameplay background
            if (gameScenes[currentSceneId] && gameScenes[currentSceneId].gameplayBackground) {
                environmentBackground.style.backgroundImage = `url('${gameScenes[currentSceneId].gameplayBackground}')`;
            }

        }, 1500);
    } else {
        currentSceneId = choice.nextSceneId;
        loadScene(currentSceneId);
    }
}

// --- Funções de HUD e Gameplay ---

// Sistema de Estus
function useEstus() {
    if (estusFlasks > 0) {
        const flask = document.querySelector(`.estus-flask:nth-child(${estusFlasks})`);
        flask.classList.add('used');
        estusFlasks--;
        
        // Efeito de cura
        const healthBar = document.getElementById('playerHealthBar');
        // As barras detalhadas no playerDetailedStats já estão em game_play.html
        const currentHealth = parseInt(playerDetailedHP.textContent);
        const maxHealth = parseInt(document.getElementById('playerDetailedMaxHP').textContent);
        const healAmount = Math.floor(maxHealth * 0.4); // Cura 40% do HP máximo
        
        let newHealth = Math.min(currentHealth + healAmount, maxHealth);
        playerDetailedHP.textContent = newHealth;
        healthBar.style.width = `${(newHealth / maxHealth) * 100}%`;
        
        // Efeito visual de cura
        const healEffect = document.createElement('div');
        healEffect.className = 'heal-effect';
        document.querySelector('.player-stats').appendChild(healEffect);
        setTimeout(() => healEffect.remove(), 1000);
    }
}

// Sistema de Stamina
function updateStamina(amount) {
    currentStamina = Math.max(0, Math.min(maxStamina, currentStamina + amount));
    playerStaminaBar.style.width = `${(currentStamina / maxStamina) * 100}%`;
    
    // Atualiza o texto
    playerDetailedStamina.textContent = Math.floor(currentStamina);
    
    // Gerencia a regeneração
    if (currentStamina < maxStamina && !isRegeneratingStamina) {
        startStaminaRegeneration();
    }
}

function startStaminaRegeneration() {
    isRegeneratingStamina = true;
    staminaRegenEffect.classList.add('active');
    
    const regenInterval = setInterval(() => {
        if (currentStamina < maxStamina) {
            updateStamina(1); // Regenera 1 ponto por tick
        } else {
            clearInterval(regenInterval);
            isRegeneratingStamina = false;
            staminaRegenEffect.classList.remove('active');
        }
    }, 100); // Regenera a cada 100ms
}

// Sistema de Runas
function updateRunes(amount) {
    runes += amount;
    runesAmountElement.textContent = runes.toLocaleString();
}

// Sistema de Status
const statusEffects = {
    poison: { icon: 'iconimg/poison-icon.png', duration: 10000 },
    bleed: { icon: 'iconimg/bleed-icon.png', duration: 5000 },
    buff: { icon: 'iconimg/buff-icon.png', duration: 15000 }
};

function addStatusEffect(effectType) {
    const statusSlot = document.querySelector('.status-slot:empty');
    if (statusSlot) {
        const effect = statusEffects[effectType];
        if (effect) {
            const img = document.createElement('img');
            img.src = effect.icon;
            img.alt = effectType;
            statusSlot.appendChild(img);
            statusSlot.classList.add('active');
            
            // Remove o efeito após a duração
            setTimeout(() => {
                statusSlot.innerHTML = '';
                statusSlot.classList.remove('active');
            }, effect.duration);
        }
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'h') { // Tecla H para usar Estus
        useEstus();
    }
    if (e.key === 'Shift') { // Shift para correr (consome stamina)
        if (currentStamina >= 10) {
            updateStamina(-10);
        }
    }
});

// Inicialização da página game_play.html
document.addEventListener('DOMContentLoaded', () => {
    const playerSavedData = sessionStorage.getItem('currentPlayer');
    if (playerSavedData) {
        currentPlayer = JSON.parse(playerSavedData);
    }

    // Oculta a área de jogo principal e a barra inferior no início
    mainGameArea.style.display = 'none';
    bottomBar.style.display = 'none';

    // Carrega a primeira cena de introdução
    loadScene(currentSceneId);
}); 