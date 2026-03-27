# **App Name**: C-Chain Angola

## **1. Visão Geral e Propósito**

O C-Chain Angola é uma plataforma de mercado B2B (Business-to-Business) desenhada para digitalizar e otimizar a cadeia de abastecimento agrícola e logística em Angola. A aplicação conecta produtores, transportadores e compradores, criando um ecossistema digital transparente e eficiente para a negociação de produtos e serviços. O objetivo é reduzir as assimetrias de informação, facilitar o escoamento da produção nacional e promover novas oportunidades de negócio em todo o país.

## **2. Funcionalidades Principais (Core Features)**

### **2.1. Gestão de Perfis e Autenticação Segura**
*   **Onboarding Especializado:** Processo de registo em múltiplos passos, onde os utilizadores se identificam como **Produtor**, **Transportador** ou **Comprador**.
*   **Verificação de Email:** Um sistema de verificação por email assegura que todos os utilizadores registados possuem um endereço de email válido, aumentando a segurança e a legitimidade da rede.
*   **Perfis de Empresa:** Cada utilizador possui um perfil de empresa detalhado, incluindo nome comercial, NIF, província, descrição e foto de perfil.
*   **Edição de Perfil:** Os utilizadores podem facilmente atualizar as informações do seu perfil, incluindo a foto, nome e descrição.
*   **Login Anónimo:** Permite que convidados explorem a plataforma com funcionalidades limitadas, incentivando o registo.

### **2.2. Feed de Oportunidades Dinâmico**
*   **Visualização Centralizada:** Um feed principal, inspirado no layout de redes profissionais como o LinkedIn, exibe em tempo real as oportunidades (publicações) de compra, venda e logística.
*   **Ordenação Inteligente (FeedScore):** As publicações são ordenadas por um algoritmo local que prioriza a relevância para o utilizador, considerando:
    *   **Proximidade:** Publicações na mesma província do utilizador.
    *   **Compatibilidade de Setor:** Publicações que correspondem ao setor de atividade do utilizador.
    *   **Credibilidade do Autor:** Dá prioridade a publicações de autores com contas verificadas.
    *   **Subscrição Premium:** Publicações de membros Premium recebem um "boost" significativo.
    *   **Popularidade:** Número de "gostos" na publicação.
*   **"Começar uma Publicação":** Um widget proeminente no topo do feed que facilita a criação rápida de novas oportunidades.

### **2.3. Gestão de Oportunidades (Publicações)**
*   **Criação Flexível:** Os utilizadores podem criar publicações detalhadas com título, descrição, categoria, valor (fixo ou "sob consulta"), localização, urgência e uma imagem (opcional).
*   **Edição e Eliminação:** Os autores têm controlo total sobre as suas publicações, podendo editá-las ou eliminá-las a qualquer momento. A eliminação inclui a remoção da imagem associada do armazenamento.
*   **Interações Sociais:**
    *   **Gostos (Likes):** Os utilizadores podem "gostar" de publicações, aumentando a sua visibilidade.
    *   **Geolocalização:** Um botão em cada publicação permite abrir a localização no Google Maps para traçar rotas.

### **2.4. Rede Social e Negociação**
*   **Sistema de Seguidores:** Os utilizadores podem seguir os perfis de outras empresas para se manterem atualizados sobre as suas atividades, criando uma rede profissional.
*   **Mensagens Diretas:** Uma interface de chat privada permite que os utilizadores negoceiem diretamente os termos de uma oportunidade ou estabeleçam contactos comerciais.
*   **Explorar Rede:** Uma vista dedicada permite pesquisar e descobrir outros perfis na plataforma por nome, província ou tipo de atividade.

### **2.5. Plano de Subscrição Premium**
*   **Benefícios:** Membros com subscrição Premium ganham maior destaque na plataforma.
*   **Destaque no Feed:** As suas publicações recebem um peso maior no algoritmo de ordenação, aparecendo mais acima no feed de outros utilizadores.
*   **Identificação Visual:** Um ícone de estrela dourada é exibido junto ao seu nome nas publicações e no perfil, sinalizando o seu estatuto Premium.

## **3. Diretrizes de Estilo e UI/UX**

- **Cores:**
  - **Primária:** Azul-cinza escuro (`#2D343C`) para elementos de confiança e estrutura.
  - **Fundo:** Cinza-azulado muito claro (`#F6F8FB`) para uma sensação de limpeza e espaço.
  - **Destaque (Urgência):** Vermelho (`#DC2626`) para chamadas à ação e indicadores de urgência.
- **Tipografia:**
  - **Títulos:** 'Space Grotesk' para um visual moderno e tecnológico.
  - **Corpo de Texto:** 'Inter' para máxima legibilidade.
- **Layout:**
  - Design limpo e profissional com um cabeçalho fixo, um feed central proeminente e barras laterais para navegação e informações suplementares (em desktop).
  - A interface é totalmente responsiva, com uma barra de navegação inferior em dispositivos móveis para acesso rápido às principais funcionalidades.
- **Experiência do Utilizador:**
  - Interações fluidas com transições subtis para uma experiência de utilização agradável.
  - Notificações (toasts) fornecem feedback claro sobre ações como "seguir", "gostar" ou abrir mapas.
  - Diálogos de confirmação para ações destrutivas (como eliminar uma publicação) para prevenir erros.
