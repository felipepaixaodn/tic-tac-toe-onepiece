// ========== SELEÇÃO DE ELEMENTOS ========== //
// Seleciona todas as células do jogo (cada quadrado do tabuleiro)
const cellElements = document.querySelectorAll("[data-cell]");

// Seleciona o tabuleiro completo
const board = document.querySelector("[data-board]");

// Seleciona o elemento que mostra o texto de vitória/empate
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");

// Seleciona o contêiner da mensagem de vitória/empate
const winningMessage = document.querySelector("[data-winning-message]");

// Seleciona o botão de reiniciar
const restartButton = document.querySelector("[data-restart-button]");


// ========== VARIÁVEL DE CONTROLE ========== //
// Indica se é o turno da Nami (true) ou do Luffy (false)
let isNamiTurn;

// Todas as combinações possíveis para vencer o jogo (índices das células)
const winningCombinations = [
    [0, 1, 2], // linha 1
    [3, 4, 5], // linha 2
    [6, 7, 8], // linha 3
    [0, 3, 6], // coluna 1
    [1, 4, 7], // coluna 2
    [2, 5, 8], // coluna 3
    [0, 4, 8], // diagonal principal
    [2, 4, 6]  // diagonal secundária
];


// ========== INÍCIO DO JOGO ========== //
const startGame = () => {
    isNamiTurn = false; // Luffy sempre começa o jogo

    // Limpa as células e adiciona novamente o evento de clique
    cellElements.forEach(cell => {
        // Remove qualquer marcação antiga
        cell.classList.remove("nami");
        cell.classList.remove("luffy");

        // Remove o event listener antigo (caso haja)
        cell.removeEventListener("click", handleClick);

        // Adiciona novo event listener com { once: true } (só pode clicar uma vez)
        cell.addEventListener("click", handleClick, { once: true });
    });

    // Atualiza o visual do tabuleiro conforme o turno
    setBoardHoverClass();

    // Esconde a mensagem de vitória/empate
    winningMessage.classList.remove("show-winning-message");
};


// ========== ENCERRAMENTO DO JOGO ========== //
const endGame = (isDraw) => {
    if (isDraw) {
        // Se for empate, exibe "Empate!"
        winningMessageTextElement.innerText = "Empate!";
    } else {
        // Se alguém venceu, mostra quem foi com base no turno atual
        winningMessageTextElement.innerText = isNamiTurn 
            ? "Nami Venceu!" 
            : "Luffy Venceu!";
    }

    // Exibe a mensagem de fim de jogo
    winningMessage.classList.add("show-winning-message");
};


// ========== MARCAR CÉLULA ========== //
// Adiciona a marca do jogador (classe CSS) à célula clicada
const placeMark = (cell, classToAdd) => {
    cell.classList.add(classToAdd);
};


// ========== ATUALIZA HOVER DO TABULEIRO ========== //
// Muda a classe do tabuleiro para indicar de quem é a vez (hover)
const setBoardHoverClass = () => {
    // Remove classes anteriores
    board.classList.remove("nami", "luffy");

    // Adiciona a classe do jogador atual
    if (isNamiTurn) {
        board.classList.add("nami");
    } else {
        board.classList.add("luffy");
    }
};


// ========== TROCAR TURNO ========== //
// Alterna entre Luffy e Nami
const swapTurns = () => {
    isNamiTurn = !isNamiTurn; // inverte o valor booleano
    setBoardHoverClass();     // atualiza o hover do tabuleiro
};


// ========== LÓGICA DE CLIQUE ========== //
// Função chamada quando o jogador clica numa célula
const handleClick = (e) => {
    const cell = e.target; // célula clicada
    const classToAdd = isNamiTurn ? "nami" : "luffy"; // define a marca

    placeMark(cell, classToAdd); // marca a célula

    const isWin = checkForWin(classToAdd); // verifica se venceu
    const isDraw = checkForDraw();         // verifica empate

    if (isWin) {
        endGame(false); // fim de jogo com vitória
    } else if (isDraw) {
        endGame(true);  // fim de jogo com empate
    } else {
        swapTurns(); // continua o jogo, troca turno
    }
};


// ========== VERIFICAR VITÓRIA ========== //
// Verifica se o jogador atual venceu
const checkForWin = (currentClass) => {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            // Verifica se todas as células da combinação têm a classe do jogador
            return cellElements[index].classList.contains(currentClass);
        });
    });
};


// ========== VERIFICAR EMPATE ========== //
// Verifica se todas as células estão preenchidas sem vencedor
const checkForDraw = () => {
    return [...cellElements].every(cell => {
        // Retorna true se TODAS as células estiverem marcadas
        return cell.classList.contains("luffy") || cell.classList.contains("nami");
    });
};


// ========== REINICIAR JOGO ========== //
// Adiciona evento ao botão para reiniciar o jogo
restartButton.addEventListener("click", startGame);


// ========== INICIAR AO CARREGAR PÁGINA ========== //
// Inicia o jogo automaticamente quando o script é carregado
startGame();
