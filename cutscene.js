// Elementos DOM da cutscene
const cutsceneSection = document.getElementById('cutsceneSection');
const introCutscene = document.getElementById('introCutscene');
const pressAnyButtonCutscene = document.getElementById('pressAnyButtonCutscene');

// Lógica para avançar a cutscene ao pressionar qualquer botão ou clicar
function advanceCutscene() {
    // Ocultar a seção da cutscene com fade-out
    cutsceneSection.classList.remove('active');
    // Remover o listener de evento para não disparar novamente
    window.removeEventListener('keydown', advanceCutscene);
    window.removeEventListener('click', advanceCutscene);

    // Pequeno atraso para o fade-out antes de redirecionar
    setTimeout(() => {
        window.location.href = 'game_play.html'; // Redireciona para a página de jogo
    }, 1500); // Tempo para o fade-out
}

// Event Listeners para avançar a cutscene
document.addEventListener('keydown', advanceCutscene);
document.addEventListener('click', advanceCutscene);

// Parar o vídeo quando o usuário sai da página (opcional, mas boa prática)
window.addEventListener('beforeunload', () => {
    if (introCutscene && introCutscene.contentWindow) {
        introCutscene.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
});

// Iniciar a cutscene com um pequeno atraso para o CSS de transição
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        cutsceneSection.classList.add('active');
    }, 10);
}); 