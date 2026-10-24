const SUPABASE_URL = "https://xuncbqmubvudysqfxqua.supabase.co";

const SUPABASE_KEY = "sb_publishable_dW3kORv90amttLJ_F87T9Q_fgMf-tN3";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
console.log("Cliente Supabase criado com sucesso!");

console.log("JavaScript da Académica F.C. está a funcionar!");
const formulario = document.getElementById("formInscricao");
console.log(formulario);

let participantes = JSON.parse(localStorage.getItem("participantes")) || [];

let trocasPersonalizadas = [];

const totalParticipantes = document.getElementById("totalParticipantes");

async function atualizarTotalParticipantes() {
    const { data, error } = await supabaseClient
        .rpc("total_inscritos");

    if (error) {
        console.error("Erro ao consultar total:", error);
        totalParticipantes.textContent = "Erro ao consultar inscritos";
        return;
    }

    totalParticipantes.textContent = "Total de inscritos: " + data;
}

atualizarTotalParticipantes();

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();
    console.log("O formulário de inscrição foi submetido!");
    const nome = document.getElementById("nome").value;
    console.log("Nome do participante:", nome);
    const pais = document.getElementById("pais").value;
    console.log("País do participante:", pais);
    let contacto = document.getElementById("contacto").value
    .trim()
    .replace(/[\s().-]/g, "");

    if (contacto.startsWith("00")) {
    contacto = "+" + contacto.slice(2);
    }

    if (!/^\+[1-9]\d{7,14}$/.test(contacto)) {
    alert("Introduz o contacto com indicativo internacional. Exemplo: +245987567890 ou 00245987567890.");
    return;
    }   
    console.log("Contacto do participante:", contacto);
    const associado = document.getElementById("associado").checked;
    console.log("É associado?", associado);
    if (associado) {
    console.log("O participante é Associado");
    } else {
    console.log("O participante é Convidado");
    }
   const participante = {
    nome: nome,
    contacto: contacto,
    pais: pais,
    associado: associado,
    tipo_participante: associado ? "Associado" : "Convidado",
    };
    const { error } = await supabaseClient
    .from("participantes")
    .insert([participante]);

    if (error) {
    console.error("Erro ao guardar inscrição:", error);

    if (error.code === "23505") {
        alert("Não foi possível concluir a inscrição. Verifica se já te inscreveste com este contacto.");
    } else {
        alert("Não foi possível guardar a inscrição. Tenta novamente.");
    }

    return;
    }

    console.log("Inscrição guardada no Supabase!");
    alert("Inscrição realizada com sucesso!");
    formulario.reset();

    await atualizarTotalParticipantes();
    });