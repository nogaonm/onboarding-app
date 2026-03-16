# Onboarding App - O Novo Mercado

Aplicação web de onboarding que transforma os designs do Figma em páginas funcionais com lógica de mapeamento personalizada.

## 🎯 O que esta aplicação faz

1. **Captura respostas** do questionário de onboarding (7 perguntas)
2. **Aplica a lógica de mapeamento** documentada em `Logica de Mapeamento - Social Media.md`
3. **Gera um plano personalizado** com 3 fases adaptadas ao perfil do usuário
4. **Apresenta o plano** com textos dinâmicos baseados no momento do aluno

## 🏗️ Arquitetura

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── page.tsx           # Página inicial (Welcome)
│   ├── questions/         # Páginas de perguntas
│   └── plano/             # Página do plano personalizado
├── components/            # Componentes React (baseados no Figma)
├── lib/                   # Lógica de negócio
│   └── mapping-engine.ts  # Engine de mapeamento (implementa a lógica documentada)
├── store/                 # Estado global (Zustand)
│   └── onboarding-store.ts
└── types/                 # TypeScript types
    └── onboarding.ts
```

## 🚀 Como rodar

### 1. Instalar dependências

```bash
cd onboarding-app
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 3. Build para produção

```bash
npm run build
npm start
```

## 📋 Fluxo da aplicação

1. **Welcome** (`/`) - Tela de boas-vindas
2. **P1 - Objetivo** (`/questions/objetivo`) - O que você quer construir?
3. **P1 Sub - Serviço** (`/questions/servico`) - Qual tipo de serviço? (se escolheu "Prestar serviços")
4. **P2 - Clientes** (`/questions/clientes`) - Já tem clientes?
5. **P3 - Momento** (`/questions/momento`) - Em que momento você está?
6. **P4 - Urgência** (`/questions/urgencia`) - Qual sua urgência?
7. **P5 - Tempo** (`/questions/tempo`) - Quanto tempo tem disponível?
8. **P6 - Barreiras** (`/questions/barreiras`) - Quais suas barreiras?
9. **P7 - Presença Digital** (`/questions/presenca`) - Qual sua presença digital?
10. **Loading** (`/loading`) - Processando respostas
11. **Plano Personalizado** (`/plano`) - Plano gerado com 3 fases
12. **Espaço de Aula** (`/plano/acao/[id]`) - Detalhes de cada ação

## 🧠 Lógica de Mapeamento

A engine de mapeamento (`src/lib/mapping-engine.ts`) implementa a lógica documentada:

### Determinação do Momento
- **Explorador**: Descobrindo o que fazer
- **Construtor**: Estruturando o negócio
- **Operador**: Otimizando e escalando
- **Referência**: Já é referência, quer escalar mais

### Geração das Fases

Cada momento tem um agrupamento diferente das 6 fases da jornada:

- **SM-EXP**: F1(mínimo)+F3(execução) → F2+F4 → F6
- **SM-CON**: F2+F3 → F4+F6(início) → F5+F6(escala)
- **SM-OPE**: F4 → F5+F6(otimizar) → F6(escala B2B)
- **SM-REF**: F5 → F6(escala) → Otimização+Expansão

### Calibrações

- **Por Barreira** (P6): Ajusta peso de Aulas, Omnia, Comunidade, Ferramentas
- **Por Urgência** (P4): Prioriza quick wins
- **Por Tempo** (P5): Ajusta ritmo (passos menores vs maiores)
- **Por Presença Digital** (P7): Ajusta tarefas de conteúdo/portfólio

## 🎨 Design System

Cores baseadas no Figma:

```css
--primary: #4559F6        /* Azul principal */
--primary-dark: #1A1A26   /* Texto escuro */
--gray-50: #FAFAFC        /* Background */
--gray-100: #F5F5F7       /* Cards */
--gray-200: #E8E9EC       /* Borders */
--gray-300: #8C8D96       /* Texto secundário */
```

## 📦 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **clsx** - Conditional classes

## 🔄 Persistência

As respostas são salvas no `localStorage` via Zustand persist middleware. O usuário pode fechar o navegador e continuar de onde parou.

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload pasta .next para Netlify
```

## 📝 Próximos passos

- [ ] Adicionar mais perfis (Infoprodutor, etc.)
- [ ] Integrar com backend para salvar planos
- [ ] Adicionar analytics
- [ ] Criar dashboard de admin
- [ ] Exportar plano em PDF

## 🐛 Debug

Para ver o estado atual do onboarding:

```javascript
// No console do navegador
localStorage.getItem('onboarding-storage')
```

## 📄 Licença

Propriedade de O Novo Mercado
