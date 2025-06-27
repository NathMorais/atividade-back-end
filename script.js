// Abrir modal do evento
function abrirModal(titulo, descricao, data, turma, img) {
    document.getElementById("modal-title").textContent = titulo;
    document.getElementById("modal-desc").textContent = descricao;
    document.getElementById("modal-data").textContent = formatarData(data);
    document.getElementById("modal-turma").textContent = nomeTurma(turma);
    const modalImg = document.getElementById("modal-img");
    if (img) {
        modalImg.src = img;
        modalImg.style.display = "block";
    } else {
        modalImg.style.display = "none";
    }
    document.getElementById("modal").style.display = "block";
}

// Fechar modal de evento
function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

// Filtrar eventos por turma
function filtrarEventos(classe) {
    const eventos = document.querySelectorAll(".event");
    eventos.forEach(evento => {
        if (classe === "todos" || evento.classList.contains(classe)) {
            evento.style.display = "flex";
        } else {
            evento.style.display = "none";
        }
    });
}

// Expandir imagem da galeria
function expandirImagem(src) {
    document.getElementById("imgExpandida").src = src;
    document.getElementById("imgModal").style.display = "flex";
}

// Fechar modal de imagem
function fecharImagem() {
    document.getElementById("imgModal").style.display = "none";
}

// Login simples de professor
function fazerLogin() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro-login");

    if (usuario === "nathalia" && senha === "1234") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("novo-evento").style.display = "block";
        erro.textContent = "";
    } else {
        erro.textContent = "Usuário ou senha incorretos.";
    }
}

// Função para criar evento HTML com botão excluir e imagem
function criarElementoEvento(ev, index) {
    const div = document.createElement("div");
    div.classList.add("event", ev.turma);
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.position = "relative";

    // Imagem do evento (miniatura)
    if (ev.imagem) {
        const img = document.createElement("img");
        img.src = ev.imagem;
        div.appendChildimg;
    }

    // Conteúdo clicável abre modal
    const conteudo = document.createElement("div");
    conteudo.style.textAlign = "center";
    conteudo.style.cursor = "pointer";
    conteudo.onclick = () => abrirModal(ev.titulo, ev.descricao, ev.data, ev.turma, ev.imagem);

    const h2 = document.createElement("h2");
    h2.textContent = ev.titulo;

    const p = document.createElement("p");
    p.textContent = formatarData(ev.data);

    conteudo.appendChild(h2);
    conteudo.appendChild(p);
    div.appendChild(conteudo);

    // Botão excluir para eventos adicionados (index >=0)
    if (index >= 0) {
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Excluir evento "${ev.titulo}"?`)) {
                excluirEvento(index);
            }
        };
        div.appendChild(btnExcluir);
    }
    return div;
}

// Adicionar evento (com upload da imagem)
function adicionarEvento() {
    const titulo = document.getElementById("titulo-evento").value.trim();
    const data = document.getElementById("data-evento").value;
    const turma = document.getElementById("turma-evento").value;
    const descricao = document.getElementById("descricao-evento").value.trim();
    const arquivoImg = document.getElementById("imagem-evento").files[0];

    if (!titulo || !data || !descricao) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (arquivoImg) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagemBase64 = e.target.result;
            salvarEExibirEvento({ titulo, data, turma, descricao, imagem: imagemBase64 });
        };
        reader.readAsDataURL(arquivoImg);
    } else {
        salvarEExibirEvento({ titulo, data, turma, descricao, imagem: null });
    }
}

// Função salvarExibirEvento(evento: any): void
function salvarEExibirEvento(evento) {
    salvarEventoLocal(evento);
    mostrarEventos();
}

// Limpar campos
document.getElementById("titulo-evento").value = "";
document.getElementById("data-evento").value = "";
document.getElementById("descricao-evento").value = "";
document.getElementById("imagem-evento").value = "";

// Excluir evento por índice
function excluirEvento(index) {
    let eventos = JSON.parse(localStorage.getItem("eventosProf")) || [];
    eventos.splice(index, 1);
    localStorage.setItem("eventosProf", JSON.stringify(eventos));
    mostrarEventos();
}

// Mostrar eventos fixos + salvos
function mostrarEventos() {
    const container = document.getElementById("lista-eventos");
    const galeria = document.getElementById("galeria-fotos");
    container.innerHTML = "";
    galeria.innerHTML = "";
   
    const eventosFixos = [
        { titulo: "Festa Junina", data: "2025-06-12", turma: "6ano", descricao: "Participação dos alunos do 6º ano com danças típicas.", imagem: null },
        { titulo: "Feira de Ciências", data: "2025-08-25", turma: "7ano", descricao: "Projetos incríveis do 7º ano.", imagem: null },
        { titulo: "Mostra Cultural", data: "2025-09-15", turma: "3medio", descricao: "Teatro e música pelo Ensino Médio.", imagem: null }
    ];

    // Adiciona eventos fixos (sem botão excluir)
    eventosFixos.forEach(ev => {
        const el = criarElementoEvento(ev, -1);
        container.appendChild(el);
        if (ev.imagem) adicionarFotoGaleria(ev.imagem, ev.titulo);
    });

    // Adiciona eventos do localStorage (com botão excluir)
    const eventosSalvos = JSON.parse(localStorage.getItem("eventosProf")) || [];
    eventosSalvos.forEach((ev, idx) => {
        const el = criarElementoEvento(ev, idx);
        container.appendChild(el);
        if (ev.imagem) adicionarFotoGaleria(ev.imagem, ev.titulo);
    });
}

// Adicionar foto na galeria
function adicionarFotoGaleria(src, alt) {
    const galeria = document.getElementById("galeria-fotos");
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.onclick = () => expandirImagem(src);
    galeria.appendChildimg;
}

// Formatar data yyyy-mm-dd para dd/mm/yyyy
function formatarData(dataStr) {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Nome legível da turma
function nomeTurma(cod) {
    const map = {
        "6ano": "6º Ano",
        "7ano": "7º Ano",
        "8ano": "8º Ano",
        "9ano": "9º Ano",
        "1medio": "1º Ano Médio",
        "2medio": "2º Ano Médio",
        "3medio": "3º Ano Médio"
    };
    return map[cod] || cod;
}
