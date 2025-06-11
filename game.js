// Elementos DOM
const classOptions = document.querySelectorAll('.class-options .option-card');
const itemOptions = document.querySelectorAll('.item-options .option-card');
const characterNameInput = document.getElementById('characterName');
const startGameButton = document.getElementById('startGameButton');
const characterCreationSection = document.querySelector('.character-creation-section');
const cutsceneSection = document.querySelector('.cutscene-section');
const introCutscene = document.getElementById('introCutscene'); // É um iframe agora
const pressAnyButtonCutscene = document.getElementById('pressAnyButtonCutscene'); // Novo elemento
const gamePlaySection = document.querySelector('.game-play-section-new');
const displayPlayerName = document.getElementById('displayPlayerName');
const displayPlayerClass = document.getElementById('displayPlayerClass');
const playerImage = document.getElementById('playerImage');

// Novos elementos para a seção de carregamento de jogo
const loadGameSection = document.querySelector('.load-game-section');
const savedCharactersContainer = document.getElementById('savedCharactersContainer');
const backToCreationButton = document.getElementById('backToCreationButton');

// Novos elementos para exibir informações detalhadas do jogador na bottom-bar
const playerFullBodyImage = document.getElementById('playerFullBodyImage');
const playerDetailedLevel = document.getElementById('playerDetailedLevel');
const playerDetailedHP = document.getElementById('playerDetailedHP');
const playerDetailedMaxHP = document.getElementById('playerDetailedMaxHP');
const playerStat1 = document.getElementById('playerStat1');
const playerStat2 = document.getElementById('playerStat2');
const playerStat3 = document.getElementById('playerStat3');
const playerStat1Icon = document.getElementById('playerStat1Icon');
const playerStat2Icon = document.getElementById('playerStat2Icon');
const playerStat3Icon = document.getElementById('playerStat3Icon');

const playerHP = document.getElementById('playerHP'); // Referência para HP da top-bar
const playerMaxHP = document.getElementById('playerMaxHP'); // Referência para MaxHP da top-bar
const playerLevel = document.getElementById('playerLevel'); // Referência para Level da top-bar

// Referências para barras de vida (preenchimento)
const playerHealthBar = document.getElementById('playerHealthBar');
const enemyHealthBar = document.getElementById('enemyHealthBar');

// Variáveis para armazenar as escolhas do jogador
let selectedClass = null;
let selectedItem = null;

// Estrutura para um personagem salvo
class CharacterSave {
    constructor(name, charClass, item) {
        this.name = name;
        this.class = charClass;
        this.item = item;
        // Poderíamos adicionar mais propriedades aqui no futuro, como hp, xp, etc.
    }
}

// Função para salvar o personagem atual no localStorage
function saveCharacter() {
    if (!selectedClass || !selectedItem || !characterNameInput.value.trim()) {
        console.error("Não é possível salvar: informações do personagem incompletas.");
        return;
    }

    const newCharacter = new CharacterSave(
        characterNameInput.value.trim(),
        selectedClass,
        selectedItem
    );

    let savedCharacters = loadCharacters(); // Carrega os personagens existentes
    savedCharacters.push(newCharacter); // Adiciona o novo personagem

    localStorage.setItem('eldenRingSaves', JSON.stringify(savedCharacters));
    console.log("Personagem salvo!", newCharacter);
}

// Função para carregar todos os personagens salvos do localStorage
function loadCharacters() {
    const saves = localStorage.getItem('eldenRingSaves');
    return saves ? JSON.parse(saves) : [];
}

// Função para renderizar os personagens salvos na tela de carregamento
function renderSavedCharacters() {
    savedCharactersContainer.innerHTML = ''; // Limpa o container antes de renderizar
    const characters = loadCharacters();

    if (characters.length === 0) {
        savedCharactersContainer.innerHTML = '<p class="no-saves-message">Nenhum personagem salvo encontrado.</p>';
        return;
    }

    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.classList.add('option-card');
        card.dataset.index = index; // Para identificar qual personagem carregar

        const className = char.class.charAt(0).toUpperCase() + char.class.slice(1);
        const itemName = char.item.replace(/_/g, ' ').toUpperCase();

        card.innerHTML = `
            <img src="${classImages[char.class]}" alt="${className}" class="choice-image">
            <p class="choice-name">${char.name}</p>
            <p class="choice-details">${className} | ${itemName}</p>
        `;
        savedCharactersContainer.appendChild(card);

        card.addEventListener('click', () => {
            loadCharacter(index);
        });
    });
}

// Função para carregar um personagem específico do save
function loadCharacter(index) {
    const characters = loadCharacters();
    if (index >= 0 && index < characters.length) {
        const charToLoad = characters[index];
        selectedClass = charToLoad.class;
        selectedItem = charToLoad.item;
        characterNameInput.value = charToLoad.name; // Preenche o campo de nome

        // Ocultar a seção de carregamento e iniciar o jogo
        loadGameSection.style.display = 'none';
        characterCreationSection.style.display = 'none'; // Certifica que a criação também está oculta

        // Definir as informações para a nova seção de game-play
        displayPlayerClass.textContent = charToLoad.class.toUpperCase();
        displayPlayerName.textContent = charToLoad.name;

        // Atualizar informações da top-bar
        playerHP.textContent = '100'; // Placeholder
        playerMaxHP.textContent = '100'; // Placeholder
        playerLevel.textContent = '1'; // Placeholder
        playerHealthBar.style.width = '100%'; // HP cheio

        // Atualizar informações detalhadas na bottom-bar
        playerFullBodyImage.src = classImagesFullBody[selectedClass];
        playerDetailedLevel.textContent = '1'; // Placeholder
        playerDetailedHP.textContent = '100'; // Placeholder
        playerDetailedMaxHP.textContent = '100'; // Placeholder
        playerStat1.textContent = '2734'; // Placeholder
        playerStat2.textContent = '760'; // Placeholder
        playerStat3.textContent = '1412'; // Placeholder

        // Placeholders para ícones de stats (se houver imagens)
        playerStat1Icon.innerHTML = '❤️'; // Exemplo de ícone de texto
        playerStat2Icon.innerHTML = '💧';
        playerStat3Icon.innerHTML = '⚡';

        // Exibir a nova seção de game-play (sem cutscene para personagens carregados)
        gamePlaySection.style.display = 'flex'; // Usar 'flex' para exibir a nova seção
        playerImage.src = classImages[selectedClass]; // Atualiza a imagem do jogador

        console.log("Personagem carregado:", charToLoad);
    }
}

// Mapeamento de classes para suas imagens padrão
const classImages = {
    samurai: 'img/samurai.jpg',
    vagabond: 'img/vagabundo.jpg',
    prophet: 'img/profeta.jpg',
    // Adicione mais classes e seus caminhos de imagem aqui
};

// Mapeamento de classes para suas imagens de corpo inteiro (PLACEHOLDER)
const classImagesFullBody = {
    samurai: 'img/samurai.jpg', // Usando a mesma por enquanto, ajustar conforme necessário
    vagabond: 'img/vagabundo.jpg',
    prophet: 'img/prophet.jpg',
};

// Função para lidar com a seleção de opções (classe ou item)
function handleOptionSelection(options, type) {
    options.forEach(card => {
        card.addEventListener('click', () => {
            // Remover a classe 'selected' de todos os cartões do mesmo tipo
            options.forEach(c => c.classList.remove('selected'));
            // Adicionar a classe 'selected' ao cartão clicado
            card.classList.add('selected');

            const choice = card.dataset.choice;
            if (type === 'class') {
                selectedClass = choice;
                // Atualiza a imagem do jogador imediatamente ao selecionar a classe
                playerImage.src = classImages[selectedClass];
            } else if (type === 'item') {
                selectedItem = choice;
            }
        });
    });
}

// Aplicar a lógica de seleção para classes e itens
handleOptionSelection(classOptions, 'class');
handleOptionSelection(itemOptions, 'item');

// Lógica para o botão 'BEGIN JOURNEY'
startGameButton.addEventListener('click', () => {
    const characterName = characterNameInput.value.trim();

    if (!selectedClass || !selectedItem || !characterName) {
        alert('Por favor, escolha sua classe, item especial e insira seu nome para começar a jornada.');
        return;
    }

    // Salvar o personagem antes de avançar
    saveCharacter();

    // Ocultar a seção de criação de personagem
    characterCreationSection.style.display = 'none';

    // Exibir a seção da cutscene com fade-in
    cutsceneSection.style.display = 'flex';
    setTimeout(() => {
        cutsceneSection.classList.add('active');
    }, 10);

    // Definir as informações para a seção de game-play (movido para loadCharacter para reutilização)
    // A seção de game-play será exibida APÓS a cutscene, na função advanceCutscene
});

// Lógica para o botão 'BACK TO CHARACTER CREATION'
backToCreationButton.addEventListener('click', () => {
    loadGameSection.style.display = 'none';
    characterCreationSection.style.display = 'block';
    // Limpar seleções e nome ao voltar para a criação (opcional)
    selectedClass = null;
    selectedItem = null;
    characterNameInput.value = '';
    classOptions.forEach(c => c.classList.remove('selected'));
    itemOptions.forEach(c => c.classList.remove('selected'));
    playerImage.src = ''; // Limpa a imagem do jogador
});

// Lógica para avançar a cutscene ao pressionar qualquer botão ou clicar
function advanceCutscene() {
    if (cutsceneSection.classList.contains('active')) {
        // Ocultar a seção da cutscene com fade-out
        cutsceneSection.classList.remove('active');
        // Remover o listener de evento para não disparar novamente
        window.removeEventListener('keydown', advanceCutscene);
        window.removeEventListener('click', advanceCutscene);

        // Pequeno atraso para o fade-out antes de ocultar o display
        setTimeout(() => {
            cutsceneSection.style.display = 'none';
            gamePlaySection.style.display = 'flex'; // Usar 'flex' para exibir a nova seção após a cutscene
            // Definir as informações para a game-play-section-new se for um NEW GAME
            displayPlayerClass.textContent = selectedClass.toUpperCase();
            displayPlayerName.textContent = characterNameInput.value.trim();

            // Atualizar informações da top-bar
            playerHP.textContent = '100'; // Placeholder
            playerMaxHP.textContent = '100'; // Placeholder
            playerLevel.textContent = '1'; // Placeholder
            playerHealthBar.style.width = '100%'; // HP cheio

            // Atualizar informações detalhadas na bottom-bar
            playerFullBodyImage.src = classImagesFullBody[selectedClass];
            playerDetailedLevel.textContent = '1'; // Placeholder
            playerDetailedHP.textContent = '100'; // Placeholder
            playerDetailedMaxHP.textContent = '100'; // Placeholder
            playerStat1.textContent = '2734'; // Placeholder
            playerStat2.textContent = '760'; // Placeholder
            playerStat3.textContent = '1412'; // Placeholder

            // Placeholders para ícones de stats (se houver imagens)
            playerStat1Icon.innerHTML = '❤️'; // Exemplo de ícone de texto
            playerStat2Icon.innerHTML = '💧';
            playerStat3Icon.innerHTML = '⚡';

            playerImage.src = classImages[selectedClass];
        }, 1500); // Deve ser igual à duração da transição CSS do fade-out
    }
}

// Adicionar listeners para teclado e clique para avançar a cutscene
// Estes listeners só terão efeito quando a cutsceneSection estiver ativa
window.addEventListener('keydown', advanceCutscene);
window.addEventListener('click', advanceCutscene);

// Lógica de inicialização da página
// Verifica se a página foi carregada para exibir a seção de carregamento de jogo
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action === 'load') {
        characterCreationSection.style.display = 'none';
        cutsceneSection.style.display = 'none';
        gamePlaySection.style.display = 'none';
        loadGameSection.style.display = 'block';
        renderSavedCharacters();
    } else {
        // Se não for para carregar jogo, garanta que a seção de criação de personagem esteja visível
        characterCreationSection.style.display = 'block';
        loadGameSection.style.display = 'none';
        cutsceneSection.style.display = 'none';
        gamePlaySection.style.display = 'none'; // Oculta a nova seção também por padrão
    }
});

// Sistema de Estus
let estusFlasks = 3;
let maxEstusFlasks = 3;

function useEstus() {
    if (estusFlasks > 0) {
        const flask = document.querySelector(`.estus-flask:nth-child(${estusFlasks})`);
        flask.classList.add('used');
        estusFlasks--;
        
        // Efeito de cura
        const healthBar = document.getElementById('playerHealthBar');
        const currentHealth = parseInt(document.getElementById('playerDetailedHP').textContent);
        const maxHealth = parseInt(document.getElementById('playerDetailedMaxHP').textContent);
        const healAmount = Math.floor(maxHealth * 0.4); // Cura 40% do HP máximo
        
        let newHealth = Math.min(currentHealth + healAmount, maxHealth);
        document.getElementById('playerDetailedHP').textContent = newHealth;
        healthBar.style.width = `${(newHealth / maxHealth) * 100}%`;
        
        // Efeito visual de cura
        const healEffect = document.createElement('div');
        healEffect.className = 'heal-effect';
        document.querySelector('.player-stats').appendChild(healEffect);
        setTimeout(() => healEffect.remove(), 1000);
    }
}

// Sistema de Stamina
let currentStamina = 100;
let maxStamina = 100;
let isRegeneratingStamina = false;

function updateStamina(amount) {
    currentStamina = Math.max(0, Math.min(maxStamina, currentStamina + amount));
    const staminaBar = document.getElementById('playerStaminaBar');
    staminaBar.style.width = `${(currentStamina / maxStamina) * 100}%`;
    
    // Atualiza o texto
    document.getElementById('playerDetailedStamina').textContent = Math.floor(currentStamina);
    
    // Gerencia a regeneração
    if (currentStamina < maxStamina && !isRegeneratingStamina) {
        startStaminaRegeneration();
    }
}

function startStaminaRegeneration() {
    isRegeneratingStamina = true;
    const regenEffect = document.querySelector('.stamina-regen-effect');
    regenEffect.classList.add('active');
    
    const regenInterval = setInterval(() => {
        if (currentStamina < maxStamina) {
            updateStamina(1); // Regenera 1 ponto por tick
        } else {
            clearInterval(regenInterval);
            isRegeneratingStamina = false;
            regenEffect.classList.remove('active');
        }
    }, 100); // Regenera a cada 100ms
}

// Sistema de Runas
let runes = 0;

function updateRunes(amount) {
    runes += amount;
    document.getElementById('runesAmount').textContent = runes.toLocaleString();
}

// Sistema de Status
const statusEffects = {
    poison: { icon: 'img/poison-icon.png', duration: 10000 },
    bleed: { icon: 'img/bleed-icon.png', duration: 5000 },
    buff: { icon: 'img/buff-icon.png', duration: 15000 }
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateRunes(0); // Inicializa o contador de runas
    updateStamina(0); // Inicializa a barra de stamina
});

// --- Lógica de Cenas e Escolhas (Game Flow) ---

const gameScenes = {
    'cemiterio_inicio': {
        background: 'img/cemiterio.jpg',
        text: 'Você acorda em um cemitério à deriva, a névoa densa envolve as lápides quebradas e a luz fraca da lua mal consegue penetrar. A brisa gélida sussurra segredos antigos enquanto a igreja em ruínas se ergue sombria à sua frente.',
        choices: [
            { text: 'Entrar na igreja', nextSceneId: 'igreja_interior' },
            { text: 'Caminhar em direção à estátua', nextSceneId: 'estatua' }
        ]
    },
    'estatua': {
        background: 'img/cemiterio.jpg',
        text: 'Você se arrasta entre as lápides em direção à estátua. Ela se ergue majestosa, uma figura de um antigo guerreiro com a cabeça baixa, parecendo lamentar um passado distante. Ao seu redor, a névoa parece se adensar ainda mais.',
        choices: [
            { text: 'Tentar interagir com a estátua', nextSceneId: 'interagir_estatua' },
            { text: 'Retornar à igreja', nextSceneId: 'cemiterio_inicio' }
        ]
    },
    'igreja_interior': {
        background: 'scn/igreja_interior.webp', // Supondo uma imagem para o interior da igreja
        text: 'Dentro da igreja, o cheiro de mofo e desolação é sufocante. Velas derretidas jazem no chão, e o silêncio é quebrado apenas pelo gotejar constante de água do teto. Você sente uma presença... o que fazer?',
        choices: [
            { text: 'Explorar o altar', nextSceneId: 'explorar_altar' },
            { text: 'Sair da igreja', nextSceneId: 'cemiterio_inicio' }
        ]
    },
    'interagir_estatua': {
        background: 'img/cemiterio.jpg',
        text: 'Você toca a superfície fria da estátua. Uma sensação de poder antigo irradia, mas nada acontece. Talvez ainda não seja o momento...',
        choices: [
            { text: 'Voltar', nextSceneId: 'estatua' }
        ]
    },
    'explorar_altar': {
        background: 'scn/igreja_interior.webp',
        text: 'Ao se aproximar do altar, você percebe runas gravadas na pedra. Elas brilham fracamente. Você sente uma conexão com o passado. Talvez haja algo mais aqui.',
        choices: [
            { text: 'Investigar as runas', nextSceneId: 'investigar_runas' },
            { text: 'Retornar à entrada', nextSceneId: 'igreja_interior' }
        ]
    },
    'investigar_runas': {
        background: 'scn/igreja_interior.webp',
        text: 'As runas reagem ao seu toque, e uma luz forte emerge do altar. Você sente seu corpo ser preenchido com um novo poder. Você encontrou algo!',
        choices: [
            { text: 'Continuar jornada (Início do Gameplay)', action: 'start_gameplay' }
        ],
        gameplayBackground: 'scn/igreja_interior_gameplay.webp' // Nova imagem de fundo para o gameplay
    }
    // Adicione mais cenas conforme necessário
};

function loadScene(sceneId) {
    const scene = gameScenes[sceneId];
    if (!scene) {
        console.error('Cena não encontrada:', sceneId);
        return;
    }

    // Atualiza a imagem de fundo com transição
    sceneBackground.style.backgroundImage = `url('${scene.background}')`;
    
    // Atualiza o texto da cena
    sceneTextElement.textContent = scene.text;

    // Limpa e renderiza as escolhas
    sceneChoicesContainer.innerHTML = '';
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('choice-button');
        button.textContent = choice.text;
        button.addEventListener('click', () => handleChoice(choice));
        sceneChoicesContainer.appendChild(button);
    });

    // Garante que a seção de apresentação esteja visível
    scenePresentationSection.classList.add('active');
    gamePlaySection.style.display = 'none'; // Garante que o gameplay esteja oculto
    characterCreationSection.style.display = 'none';
    cutsceneSection.style.display = 'none';
}

function handleChoice(choice) {
    if (choice.action === 'start_gameplay') {
        // Transição para a seção de gameplay
        scenePresentationSection.classList.remove('active');
        setTimeout(() => {
            scenePresentationSection.style.display = 'none';
            gamePlaySection.style.display = 'flex';
            // Aqui você pode inicializar o estado do jogador e a HUD
            displayPlayerClass.textContent = selectedClass ? selectedClass.toUpperCase() : 'VAGABOND'; // Default se não houver criação
            displayPlayerName.textContent = characterNameInput.value.trim() || 'Tarnished';
            playerImage.src = classImages[selectedClass || 'vagabond'];
            playerFullBodyImage.src = classImagesFullBody[selectedClass || 'vagabond'];
            updateRunes(0); // Inicializa runas
            updateStamina(0); // Inicializa stamina
            // Efeito inicial para as barras
            document.getElementById('playerHealthBar').style.width = '100%';
            document.getElementById('playerManaBar').style.width = '100%';
            document.getElementById('playerStaminaBar').style.width = '100%';
            document.getElementById('playerDetailedHP').textContent = '100';
            document.getElementById('playerDetailedMana').textContent = '100';
            document.getElementById('playerDetailedStamina').textContent = '100';
            document.getElementById('playerDetailedLevel').textContent = '1';

            // Define o wallpaper do gameplay baseado na cena atual
            if (gameScenes[currentSceneId] && gameScenes[currentSceneId].gameplayBackground) {
                gamePlaySection.style.backgroundImage = `url('${gameScenes[currentSceneId].gameplayBackground}')`;
                gamePlaySection.style.backgroundSize = 'cover';
                gamePlaySection.style.backgroundPosition = 'center';
                gamePlaySection.style.backgroundRepeat = 'no-repeat';
            }

            // Remover os listeners de escolha para evitar múltiplos disparos
            sceneChoicesContainer.innerHTML = '';
        }, 1500); // Tempo para o fade out da cena
    } else {
        currentSceneId = choice.nextSceneId; // Atualiza o ID da cena atual
        loadScene(currentSceneId);
    }
}

let currentSceneId = 'cemiterio_inicio'; // Variável para rastrear a cena atual

// Ajuste na inicialização para começar com a cena
document.addEventListener('DOMContentLoaded', () => {
    loadScene(currentSceneId);
    // Remova ou comente as chamadas para startGameButton e loadGameSection que não serão mais o início
    // handleOptionSelection e os listeners de botões de criação/carregamento ainda podem ser úteis para outras partes do jogo, se for o caso.

    // Certifique-se de que a cutscene e a seção de criação de personagem estão ocultas no início.
    characterCreationSection.style.display = 'none';
    cutsceneSection.style.display = 'none';
    gamePlaySection.style.display = 'none';
}); 