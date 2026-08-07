let comprovantes = `Você é um assistente especializado em extração de dados e finanças.
Analise a imagem deste comprovante fiscal e extraia todos os itens comprados, seus valores e o valor total.

Retorne EXCLUSIVAMENTE em formato HTML puro, pronto para ser inserido via innerHTML. NÃO inclua blocos markdown (como \`\`\`html).

Utilize a seguinte estrutura exata, inserindo os ícones do Font Awesome (fa-solid) correspondentes:

<div class="categoria">
    <h3><i class="fa-solid fa-basket-shopping"></i> Mercado</h3>
    <ul>
        <li><span>Arroz 5kg</span> <strong>R$ 25,00</strong></li>
    </ul>
    
    <!-- ATENÇÃO AQUI: A div resumo-total agora está DENTRO da div categoria -->
    <div class="resumo-total" data-valor="25.00">
        <h3><i class="fa-solid fa-wallet"></i> Total: <strong>R$ 25,00</strong></h3>
    </div>
</div>

Regras cruciais:
1. Agrupe itens semelhantes na mesma categoria.
2. Formate os valores visíveis no padrão brasileiro (R$ 0,00), mas o 'data-valor' deve ser estritamente numérico (ex: 150.50).
3. Se a imagem não for um comprovante válido, retorne: <div class="erro">Não foi possível ler o comprovante.</div>`;

async function lerComprovantes() {
    let fileInput = document.querySelector(".fileInput").files[0];

    document.querySelector(".comprovantes").innerHTML = "<p>Lendo comprovante, aguarde...</p>";

    let response = await puter.ai.chat(comprovantes, fileInput);
    let texto = response.message.content;

    document.querySelector(".comprovantes").innerHTML = texto;
    
    let resumoElement = document.querySelector(".comprovantes .resumo-total");

    if (resumoElement) {
        let valorString = resumoElement.getAttribute("data-valor");
        
        if (valorString) {
            let valorNumerico = parseFloat(valorString);
            
            let valorFormatado = valorNumerico.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            });
            
            document.querySelector(".total").innerText = valorFormatado;
            
            let paragrafosGastos = document.querySelectorAll(".gastos p");
            if (paragrafosGastos.length > 1) {
                paragrafosGastos[1].innerText = "1 comprovante lido!";
            }
        }
    }

    console.log("Comprovante lido com sucesso!");
}