// Elementos DOM específicos da página de criação de personagem
const classOptions = document.querySelectorAll('.class-options .option-card');
const itemOptions = document.querySelectorAll('.item-options .option-card');
const characterNameInput = document.getElementById('characterName');
const startGameButton = document.getElementById('startGameButton');
const characterCreationSection = document.querySelector('.character-creation-section');
const loadGameSection = document.querySelector('.load-game-section');
const savedCharactersContainer = document.getElementById('savedCharactersContainer');
const backToCreationButton = document.getElementById('backToCreationButton');

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

// Função para carregar um personagem específico do save e iniciar o jogo
function loadCharacter(index) {
    const characters = loadCharacters();
    if (index >= 0 && index < characters.length) {
        const charToLoad = characters[index];
        // Salva o personagem carregado no sessionStorage para acesso na próxima página
        sessionStorage.setItem('currentPlayer', JSON.stringify(charToLoad));
        window.location.href = 'cutscene.html'; // Redireciona para a página da cutscene
    }
}

// Mapeamento de classes para suas imagens padrão
const classImages = {
    samurai: 'img/samurai.jpg',
    vagabond: 'img/vagabundo.jpg',
    prophet: 'img/profeta.jpg',
    // Adicione mais classes e seus caminhos de imagem aqui
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

    saveCharacter();

    const newCharacter = new CharacterSave(characterName, selectedClass, selectedItem);
    sessionStorage.setItem('currentPlayer', JSON.stringify(newCharacter));
    window.location.href = 'cutscene.html'; // Redireciona para a página da cutscene
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
});

// Lógica para mostrar/ocultar seções com base nos parâmetros da URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'load') {
        characterCreationSection.style.display = 'none';
        loadGameSection.style.display = 'block';
        renderSavedCharacters();
    } else {
        characterCreationSection.style.display = 'block';
        loadGameSection.style.display = 'none';
    }
}); 