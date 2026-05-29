/* =============================================================================
 * CME 295 · Transformers & Large Language Models
 * Course content data — the single source of truth for the learning site.
 *
 * Content is distilled from the public Stanford CME 295 syllabus, the official
 * VIP cheatsheet, and the Autumn 2025 lecture recordings. Math is rendered with
 * MathJax using \( \) and \[ \] delimiters (note the doubled backslashes that
 * are required inside JS strings).
 * ========================================================================== */

const COURSE = {
  meta: {
    code: "CME 295",
    title: "Transformers & Large Language Models",
    titleZh: "Transformer 与大语言模型",
    school: "Stanford University",
    term: "Autumn 2025",
    instructors: ["Afshine Amidi", "Shervine Amidi"],
    schedule: "Fridays 3:30–5:20 pm · Thornton 110",
    playlist:
      "https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy",
    syllabus: "https://cme295.stanford.edu/syllabus/",
    cheatsheet: "https://cme295.stanford.edu/cheatsheet/",
    github:
      "https://github.com/afshinea/stanford-cme-295-transformers-large-language-models",
    book: "https://superstudy.guide",
    tagline:
      "From word vectors to reasoning agents — a complete tour of the architecture that powers modern AI.",
    taglineZh:
      "从词向量到推理智能体 —— 完整走过驱动现代 AI 的核心架构。",
  },

  /* What you'll be able to do after the course */
  outcomes: [
    {
      icon: "M4 6h16M4 12h16M4 18h10",
      title: "Read the architecture",
      titleZh: "读懂架构",
      text: "Explain every block of the Transformer — attention, FFN, residuals, normalization and positional encodings — and why each exists.",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Make models efficient",
      titleZh: "让模型更高效",
      text: "Apply MQA/GQA, RoPE, FlashAttention, mixture-of-experts and quantization to scale models in compute and memory.",
    },
    {
      icon: "M12 6v6l4 2",
      title: "Train & align",
      titleZh: "训练与对齐",
      text: "Walk the full pipeline: pretraining, SFT, LoRA, reward modeling, RLHF, PPO and DPO.",
    },
    {
      icon: "M9 12l2 2 4-4",
      title: "Build applications",
      titleZh: "构建应用",
      text: "Design RAG pipelines, tool-calling agents and reasoning systems — and evaluate them rigorously with LLM-as-a-judge.",
    },
  ],

  lectures: [
    /* ===================== LECTURE 1 ===================== */
    {
      id: 1,
      num: "01",
      slug: "transformer",
      title: "The Transformer",
      titleZh: "Transformer 架构",
      date: "Sep 26, 2025",
      duration: "1:41:58",
      videoId: "Ub3GoFaUcds",
      accent: "indigo",
      tagline: "How attention replaced recurrence and rewired NLP.",
      overview:
        "We start from the building blocks of natural language processing — tokens, embeddings and the sequence-modeling problem — then trace the path from recurrent networks to the attention mechanism, and finally assemble the full Transformer architecture introduced in <em>Attention Is All You Need</em> (2017).",
      overviewZh:
        "本讲从自然语言处理的基本构件出发(词元、词嵌入与序列建模问题),沿着从循环网络到注意力机制的演进路线,最终拼装出 2017 年《Attention Is All You Need》中提出的完整 Transformer 架构。",
      topics: [
        {
          name: "NLP tasks & the sequence problem",
          summaryZh: "NLP 任务与序列建模问题",
          body:
            "<p>Language is a <strong>sequence of discrete symbols</strong> with long-range dependencies. Classic NLP tasks fall into a few shapes: <em>classification</em> (sentiment, topic), <em>sequence labeling</em> (NER, POS tagging), <em>sequence-to-sequence</em> (translation, summarization) and <em>generation</em> (language modeling). The core difficulty is that meaning depends on order and on context that can be far away in the sentence.</p><p>A <strong>language model</strong> assigns a probability to a sequence by factorizing it autoregressively:</p>\\[ p(x_1,\\dots,x_T)=\\prod_{t=1}^{T} p(x_t \\mid x_1,\\dots,x_{t-1}). \\]<p>Every model in this course is, at heart, a better way to estimate that conditional distribution.</p>",
        },
        {
          name: "Tokenization",
          summaryZh: "分词 / 词元化",
          body:
            "<p>Before a model sees text it must be cut into <strong>tokens</strong>. Word-level tokenization explodes the vocabulary and chokes on rare words; character-level keeps the vocabulary tiny but makes sequences very long. Modern models use <strong>subword</strong> schemes that interpolate between the two.</p><ul><li><strong>Byte-Pair Encoding (BPE):</strong> start from characters and greedily merge the most frequent adjacent pair, repeatedly, until a target vocabulary size is reached.</li><li><strong>WordPiece</strong> (BERT) and <strong>SentencePiece / Unigram</strong> (T5, LLaMA) are popular variants.</li></ul><p>Subword tokenization gives an <strong>open vocabulary</strong>: any string can be represented, and frequent words stay as single tokens while rare words break into pieces.</p>",
        },
        {
          name: "Embeddings & Word2vec",
          summaryZh: "词嵌入与 Word2vec",
          body:
            "<p>Each token id is mapped to a dense vector via an <strong>embedding matrix</strong> \\(E \\in \\mathbb{R}^{|V| \\times d}\\). These vectors are learned so that geometry encodes meaning.</p><p><strong>Word2vec</strong> popularized this idea with two shallow training objectives:</p><ul><li><strong>CBOW</strong> — predict a center word from its surrounding context.</li><li><strong>Skip-gram</strong> — predict the surrounding context from the center word.</li></ul><p>The famous result is that semantic relationships become <em>linear</em> in embedding space:</p>\\[ \\vec{king} - \\vec{man} + \\vec{woman} \\approx \\vec{queen}. \\]<p>The limitation: a word gets <em>one</em> vector regardless of context — \"bank\" of a river vs. a \"bank\" account. Contextual models (next!) fix this.</p>",
        },
        {
          name: "RNNs & LSTMs",
          summaryZh: "循环网络与 LSTM",
          body:
            "<p>The pre-Transformer answer to sequences was the <strong>Recurrent Neural Network</strong>, which maintains a hidden state updated token by token:</p>\\[ h_t = \\tanh(W_h h_{t-1} + W_x x_t + b). \\]<p>RNNs struggle with <strong>long-range dependencies</strong> because gradients vanish or explode over many steps. <strong>LSTMs</strong> and <strong>GRUs</strong> add gating (input, forget, output gates) and a cell state that lets information flow across long spans.</p><p>Two problems remain and motivate the Transformer: recurrence is <strong>inherently sequential</strong> (hard to parallelize across time), and even gated memory degrades over very long contexts.</p>",
        },
        {
          name: "The attention mechanism",
          summaryZh: "注意力机制",
          body:
            "<p>Attention lets every position look <em>directly</em> at every other position, with no recurrence. Each token emits a <strong>query</strong> \\(q\\), and every token offers a <strong>key</strong> \\(k\\) and a <strong>value</strong> \\(v\\). The output is a weighted average of values, weighted by query–key similarity:</p>\\[ \\text{Attention}(Q,K,V)=\\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V. \\]<p>The \\(\\sqrt{d_k}\\) factor keeps the dot products from growing too large and saturating the softmax. Because the operation is a few big matrix multiplies, it is <strong>massively parallel</strong> on GPUs — the key practical advantage over RNNs.</p>",
        },
        {
          name: "Putting it together: the Transformer",
          summaryZh: "组装 Transformer",
          body:
            "<p>The original Transformer is an <strong>encoder–decoder</strong>. Each layer stacks the same ingredients:</p><ul><li><strong>Multi-head attention</strong> — run attention in \\(h\\) parallel subspaces and concatenate, so the model attends to different relationships at once.</li><li><strong>Position-wise feed-forward network</strong> — \\( \\text{FFN}(x)=W_2\\,\\sigma(W_1 x + b_1)+b_2 \\), applied identically at every position.</li><li><strong>Residual connections + Layer Normalization</strong> — \\( \\text{LayerNorm}(x + \\text{Sublayer}(x)) \\) to stabilize and ease optimization.</li><li><strong>Positional encoding</strong> — since attention is permutation-invariant, position information is injected (originally with sinusoids).</li></ul><p>The decoder adds <strong>masked</strong> self-attention (so position \\(t\\) cannot peek at the future) and cross-attention into the encoder output. This single template — repeated and scaled — is the backbone of everything that follows.</p>",
        },
      ],
      takeaways: [
        "Attention computes a content-based weighted average of values using query–key similarity, with a 1/√dₖ scaling.",
        "Multi-head attention lets the model capture several relationship types in parallel subspaces.",
        "Transformers drop recurrence entirely, making training highly parallelizable.",
        "Positional encodings are required because attention itself is order-agnostic.",
      ],
    },

    /* ===================== LECTURE 2 ===================== */
    {
      id: 2,
      num: "02",
      slug: "models-and-tricks",
      title: "Transformer-based Models & Tricks",
      titleZh: "Transformer 模型族与技巧",
      date: "Oct 3, 2025",
      duration: "1:47:19",
      videoId: "yT84Y5zCnaA",
      accent: "violet",
      tagline: "Making attention cheaper, smarter about position, and task-shaped.",
      overview:
        "Vanilla attention is \\(O(n^2)\\) in sequence length and uses absolute positions. This lecture surveys the engineering that made Transformers practical at scale: efficient-attention approximations, the MHA → MQA → GQA family, modern positional schemes culminating in RoPE, and the three architectural shapes (encoder-only, decoder-only, encoder–decoder) — with BERT as the canonical encoder.",
      overviewZh:
        "原始注意力对序列长度是 \\(O(n^2)\\) 复杂度,且使用绝对位置编码。本讲梳理让 Transformer 真正规模化的工程改良:高效注意力近似、MHA → MQA → GQA 家族、以 RoPE 为代表的现代位置编码,以及三种架构形态(仅编码器、仅解码器、编码-解码),并以 BERT 作为编码器代表。",
      topics: [
        {
          name: "Efficient attention",
          summaryZh: "高效注意力",
          body:
            "<p>Full attention costs \\(O(n^2 d)\\) time and \\(O(n^2)\\) memory, which is prohibitive for long sequences. Three families address this:</p><ul><li><strong>Sparse attention</strong> — each token attends to a structured subset (local windows, strided, global tokens) e.g. Longformer, BigBird.</li><li><strong>Low-rank / kernel attention</strong> — approximate the softmax with a low-rank or kernel factorization (Linformer, Performer) for near-linear cost.</li><li><strong>FlashAttention</strong> — an <em>exact</em> attention that is IO-aware: it tiles the computation to keep data in fast SRAM and never materializes the full \\(n\\times n\\) matrix, giving big speed and memory wins.</li></ul>",
        },
        {
          name: "MHA → MQA → GQA",
          summaryZh: "多头 → 多查询 → 分组查询注意力",
          body:
            "<p>At inference time, autoregressive decoding caches keys and values (the <strong>KV cache</strong>). Standard <strong>Multi-Head Attention (MHA)</strong> stores a separate K and V per head, which dominates memory for long contexts.</p><ul><li><strong>Multi-Query Attention (MQA)</strong> — all heads <em>share a single</em> K and V. Slashes KV-cache size and bandwidth, at a small quality cost.</li><li><strong>Grouped-Query Attention (GQA)</strong> — the middle ground: heads are split into \\(g\\) groups that each share K/V. With \\(g=1\\) it is MQA; with \\(g=h\\) it is MHA.</li></ul><p>GQA is now standard in models like LLaMA 2/3 because it keeps most of MHA's quality while making long-context inference far cheaper.</p>",
        },
        {
          name: "Positional encodings",
          summaryZh: "位置编码",
          body:
            "<p>Attention is permutation-invariant, so position must be supplied. Options:</p><ul><li><strong>Sinusoidal (fixed)</strong> — the original scheme; deterministic sine/cosine of varying frequency, extrapolates somewhat to unseen lengths.</li><li><strong>Learned absolute</strong> — a trainable vector per position (BERT, original GPT); simple but does not extrapolate beyond the trained length.</li></ul><p>Both inject <em>absolute</em> position. The trend, however, is toward encoding <em>relative</em> position, which generalizes better — leading to RoPE.</p>",
        },
        {
          name: "RoPE: Rotary Position Embeddings",
          summaryZh: "旋转位置编码 RoPE",
          body:
            "<p><strong>RoPE</strong> encodes position by <em>rotating</em> the query and key vectors by an angle proportional to their position. Pairs of dimensions are rotated as a 2-D vector:</p>\\[ \\tilde{q}_m = R_{\\Theta,m}\\, q, \\qquad R_{\\Theta,m} \\text{ rotates each 2-D pair by angle } m\\theta_i. \\]<p>The beautiful property: the dot product after rotation depends only on the <strong>relative</strong> offset \\(m-n\\):</p>\\[ \\langle \\tilde{q}_m, \\tilde{k}_n \\rangle = g(q,k,\\,m-n). \\]<p>RoPE needs no extra parameters, integrates into the attention scores directly, and extrapolates to longer contexts (with tricks like NTK / position interpolation). It is used in LLaMA, GPT-NeoX, PaLM and most modern open models.</p>",
        },
        {
          name: "Three architectural shapes",
          summaryZh: "三种架构形态",
          body:
            "<p>The same Transformer block specializes into three families by how attention is masked:</p><ul><li><strong>Encoder-only</strong> (BERT) — bidirectional attention; great for understanding/classification.</li><li><strong>Decoder-only</strong> (GPT, LLaMA) — causal (masked) attention; great for generation. This is the dominant LLM shape.</li><li><strong>Encoder–decoder</strong> (T5, BART) — bidirectional encoder + causal decoder with cross-attention; natural for seq-to-seq like translation.</li></ul>",
        },
        {
          name: "BERT and its derivatives",
          summaryZh: "BERT 及其衍生模型",
          body:
            "<p><strong>BERT</strong> pretrains a bidirectional encoder with two objectives: <em>Masked Language Modeling</em> (predict randomly masked tokens) and <em>Next Sentence Prediction</em>. Fine-tuning a small head on top gives strong results across understanding tasks. Notable derivatives:</p><ul><li><strong>RoBERTa</strong> — drops NSP, trains longer on more data with bigger batches.</li><li><strong>ALBERT</strong> — parameter sharing + factorized embeddings for a smaller model.</li><li><strong>DistilBERT</strong> — a distilled, ~40% smaller, ~60% faster student.</li><li><strong>ELECTRA</strong> — replaced-token detection, a more sample-efficient objective.</li></ul>",
        },
      ],
      takeaways: [
        "FlashAttention is exact but IO-aware — it speeds up attention without approximating it.",
        "MQA/GQA shrink the KV cache, the key bottleneck for long-context inference.",
        "RoPE encodes relative position by rotation, adds no parameters, and extrapolates well.",
        "Encoder-only, decoder-only and encoder–decoder are the same block with different masking.",
      ],
    },

    /* ===================== LECTURE 3 ===================== */
    {
      id: 3,
      num: "03",
      slug: "large-language-models",
      title: "Large Language Models",
      titleZh: "大语言模型",
      date: "Oct 10, 2025",
      duration: "1:48:44",
      videoId: "Q5baLehv5So",
      accent: "cyan",
      tagline: "Scale, sparsity, sampling and the art of prompting.",
      overview:
        "What turns a Transformer into a <em>large language model</em>? This lecture covers the decoder-only recipe, the mixture-of-experts trick for scaling parameters cheaply, the levers of decoding (temperature, top-k, top-p), and the emergent skill of <strong>prompting</strong> — in-context learning, chain-of-thought and self-consistency.",
      overviewZh:
        "是什么把一个 Transformer 变成「大」语言模型?本讲讲解仅解码器配方、用混合专家(MoE)以低成本扩展参数、解码的各个旋钮(温度、top-k、top-p),以及涌现出的「提示」技能 —— 上下文学习、思维链与自一致性。",
      topics: [
        {
          name: "What is an LLM?",
          summaryZh: "什么是大语言模型",
          body:
            "<p>An LLM is a <strong>decoder-only</strong> Transformer trained at scale to predict the next token, then used autoregressively to generate text. \"Large\" refers to parameters (billions+), data (trillions of tokens) and compute. The remarkable empirical finding is <strong>emergence</strong>: capabilities like arithmetic, translation and reasoning appear as scale crosses thresholds, without being explicitly trained.</p><p>Behavior is governed by <strong>scaling laws</strong>: loss falls as a power law in parameters, data and compute — which is why the field keeps scaling.</p>",
        },
        {
          name: "Mixture of Experts (MoE)",
          summaryZh: "混合专家 MoE",
          body:
            "<p>Dense models use every parameter for every token. <strong>MoE</strong> replaces the FFN with many expert FFNs and a <strong>router</strong> that sends each token to only the top-\\(k\\) experts:</p>\\[ y = \\sum_{i \\in \\text{top-}k} g_i(x)\\, E_i(x), \\qquad g = \\text{softmax}(\\text{router}(x)). \\]<p>This decouples <strong>total</strong> parameters from <strong>active</strong> parameters per token — you get the capacity of a huge model at the compute of a small one. Challenges: <em>load balancing</em> across experts (an auxiliary loss encourages even routing) and communication overhead. Used in Mixtral, GLaM, DeepSeek-MoE and others.</p>",
        },
        {
          name: "Context length",
          summaryZh: "上下文长度",
          body:
            "<p>The <strong>context window</strong> is how many tokens the model can attend to at once. Longer context enables long-document QA, big codebases and many-shot prompting, but the \\(O(n^2)\\) attention cost and KV-cache growth make it expensive. Techniques to extend it include RoPE interpolation / NTK scaling, efficient-attention variants, and architectural tweaks — pushing context from 2K (GPT-2 era) to 128K–1M+ in current models.</p>",
        },
        {
          name: "Decoding: temperature & sampling",
          summaryZh: "解码:温度与采样策略",
          body:
            "<p>Given next-token logits, how do we pick a token? <strong>Temperature</strong> \\(T\\) reshapes the distribution before sampling:</p>\\[ p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}. \\]<p>\\(T\\to 0\\) is greedy/deterministic; \\(T>1\\) is more random/creative. Common strategies:</p><ul><li><strong>Greedy</strong> — always the argmax; can be repetitive.</li><li><strong>Beam search</strong> — keep the top-\\(b\\) partial sequences; good for translation, dull for open generation.</li><li><strong>Top-k</strong> — sample from the \\(k\\) most probable tokens.</li><li><strong>Top-p (nucleus)</strong> — sample from the smallest set whose cumulative probability exceeds \\(p\\); adapts to how peaked the distribution is.</li></ul>",
        },
        {
          name: "Prompting & in-context learning",
          summaryZh: "提示与上下文学习",
          body:
            "<p>A pretrained LLM can be steered purely through its input — no weight updates. This is <strong>in-context learning</strong>:</p><ul><li><strong>Zero-shot</strong> — just describe the task.</li><li><strong>Few-shot</strong> — include a handful of input→output examples in the prompt; the model infers the pattern.</li></ul><p>Prompt design (instructions, format, role, delimiters) materially changes behavior — the foundation of practical LLM use and of the agentic patterns in later lectures.</p>",
        },
        {
          name: "Chain-of-thought & self-consistency",
          summaryZh: "思维链与自一致性",
          body:
            "<p><strong>Chain-of-thought (CoT)</strong> prompting asks the model to \"think step by step,\" producing intermediate reasoning before the answer. This dramatically improves performance on math and multi-step problems by spending more compute on the hard part.</p><p><strong>Self-consistency</strong> goes further: sample <em>many</em> CoT paths and take a <strong>majority vote</strong> over the final answers. Independent reasoning chains that agree are more likely correct — a simple, powerful test-time boost that foreshadows the reasoning models of Lecture 6.</p>",
        },
      ],
      takeaways: [
        "Modern LLMs are decoder-only Transformers; capabilities emerge with scale.",
        "MoE decouples total from active parameters — huge capacity at small per-token compute.",
        "Temperature, top-k and top-p trade off determinism vs. diversity at decode time.",
        "Chain-of-thought + self-consistency buy accuracy by spending more test-time compute.",
      ],
    },

    /* ===================== LECTURE 4 ===================== */
    {
      id: 4,
      num: "04",
      slug: "llm-training",
      title: "LLM Training",
      titleZh: "大模型训练",
      date: "Oct 17, 2025",
      duration: "1:47:27",
      videoId: "VlA_jt_3Qc4",
      accent: "emerald",
      tagline: "Pretrain, compress, and adapt — efficiently.",
      overview:
        "How are these models actually built and then specialized? We cover large-scale <strong>pretraining</strong>, the memory/throughput tricks (mixed precision, parallelism, FlashAttention), <strong>quantization</strong> for cheap inference, and parameter-efficient adaptation via <strong>supervised fine-tuning</strong> and <strong>LoRA</strong>.",
      overviewZh:
        "这些模型究竟如何被训练并专门化?本讲涵盖大规模<strong>预训练</strong>、显存与吞吐技巧(混合精度、并行、FlashAttention)、用于低成本推理的<strong>量化</strong>,以及通过<strong>有监督微调(SFT)</strong>与 <strong>LoRA</strong> 实现的参数高效适配。",
      topics: [
        {
          name: "Pretraining",
          summaryZh: "预训练",
          body:
            "<p><strong>Pretraining</strong> optimizes the next-token cross-entropy over a massive, diverse corpus (web, code, books). The objective is simple; the engineering is not. Key ideas:</p><ul><li><strong>Scaling laws</strong> predict loss from compute; the <em>Chinchilla</em> result says data and parameters should scale together (≈20 tokens per parameter) for compute-optimal training.</li><li><strong>Data quality</strong> — dedup, filtering and mixture weighting often matter more than raw quantity.</li></ul><p>The output is a <strong>base model</strong>: knowledgeable but not yet aligned to follow instructions — that comes next.</p>",
        },
        {
          name: "Hardware & throughput optimization",
          summaryZh: "硬件与吞吐优化",
          body:
            "<p>Training frontier models is a systems problem. The core levers:</p><ul><li><strong>Mixed precision</strong> — compute in FP16/BF16 with an FP32 master copy; roughly halves memory and speeds up matmuls.</li><li><strong>FlashAttention</strong> — IO-aware exact attention (Lecture 2) cuts memory and time.</li><li><strong>Parallelism</strong> — <em>data</em> parallel (replicate, split the batch), <em>tensor</em> parallel (split a layer across GPUs), <em>pipeline</em> parallel (split layers across stages), often combined (\"3-D parallelism\").</li><li><strong>ZeRO / sharding</strong> — partition optimizer state, gradients and parameters across devices to fit huge models.</li><li><strong>Gradient checkpointing</strong> — trade compute for memory by recomputing activations in the backward pass.</li></ul>",
        },
        {
          name: "Quantization",
          summaryZh: "量化",
          body:
            "<p><strong>Quantization</strong> stores weights (and sometimes activations) in low precision — INT8, INT4 — to shrink memory and speed up inference. A value is mapped via a scale (and zero-point):</p>\\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right), \\qquad \\hat{x} = s\\, x_q. \\]<ul><li><strong>Post-training quantization (PTQ)</strong> — quantize a trained model directly; <em>GPTQ</em> and <em>AWQ</em> are popular 4-bit methods that preserve quality.</li><li><strong>Quantization-aware training (QAT)</strong> — simulate quantization during training for best accuracy.</li><li><strong>QLoRA</strong> — fine-tune a 4-bit frozen base model with LoRA adapters, making fine-tuning feasible on a single GPU.</li></ul>",
        },
        {
          name: "Supervised fine-tuning (SFT)",
          summaryZh: "有监督微调 SFT",
          body:
            "<p>A base model is turned into a helpful assistant via <strong>SFT</strong>: continue training on curated <em>(instruction, response)</em> pairs with the same next-token loss, but computed only on the response tokens. This is <strong>instruction tuning</strong> — it teaches format and task-following, not new knowledge. SFT is the first stage of post-training and the foundation that preference tuning (Lecture 5) builds on.</p>",
        },
        {
          name: "LoRA & parameter-efficient fine-tuning",
          summaryZh: "LoRA 与参数高效微调",
          body:
            "<p>Full fine-tuning updates all weights — expensive in memory and storage. <strong>LoRA</strong> (Low-Rank Adaptation) freezes the base weights \\(W_0\\) and learns a small low-rank update:</p>\\[ W = W_0 + \\Delta W, \\qquad \\Delta W = \\frac{\\alpha}{r} BA, \\quad B\\in\\mathbb{R}^{d\\times r},\\, A\\in\\mathbb{R}^{r\\times k}, \\ r \\ll d. \\]<p>Only \\(A\\) and \\(B\\) train — often &lt;1% of parameters. Benefits: tiny checkpoints, multiple swappable adapters per base model, and (with <strong>QLoRA</strong>) fine-tuning of huge models on modest hardware. It is the default PEFT method today.</p>",
        },
      ],
      takeaways: [
        "Chinchilla-optimal training scales data and parameters together (~20 tokens/param).",
        "Mixed precision, parallelism and ZeRO sharding are what make large-scale training fit.",
        "GPTQ/AWQ enable 4-bit inference; QLoRA enables 4-bit fine-tuning.",
        "LoRA learns a low-rank weight delta, training &lt;1% of parameters with swappable adapters.",
      ],
    },

    /* ===================== LECTURE 5 ===================== */
    {
      id: 5,
      num: "05",
      slug: "llm-tuning",
      title: "LLM Tuning & Alignment",
      titleZh: "偏好微调与对齐",
      date: "Oct 31, 2025",
      duration: "1:47:42",
      videoId: "PmW_TMQ3l0I",
      accent: "amber",
      tagline: "Teaching models what humans actually prefer.",
      overview:
        "SFT teaches a model to follow instructions; <strong>preference tuning</strong> teaches it to follow them <em>well</em> — helpful, harmless and honest. We cover the RLHF pipeline, reward modeling from human comparisons, the PPO algorithm and its variants, and the elegant reinforcement-learning-free alternative, <strong>DPO</strong>.",
      overviewZh:
        "SFT 让模型学会遵循指令;<strong>偏好微调</strong>则让它把指令执行得「好」—— 有用、无害、诚实。本讲涵盖 RLHF 流程、从人类比较中学习奖励模型、PPO 算法及其变体,以及优雅的免强化学习替代方案 <strong>DPO</strong>。",
      topics: [
        {
          name: "Why preference tuning?",
          summaryZh: "为什么需要偏好微调",
          body:
            "<p>Next-token likelihood is a poor proxy for \"a good answer.\" Many valid continuations exist, and quality (helpfulness, safety, tone) is hard to specify with labels. The insight behind <strong>RLHF</strong>: humans find it far easier to <em>compare</em> two responses than to score one. We collect preferences \\(y_w \\succ y_l\\) (\"winner beats loser\") and tune the model toward what people prefer. This is the <strong>alignment</strong> step.</p>",
        },
        {
          name: "The RLHF pipeline",
          summaryZh: "RLHF 流程",
          body:
            "<p>Classic RLHF has three stages:</p><ol><li><strong>SFT</strong> — start from an instruction-tuned model (Lecture 4).</li><li><strong>Reward model</strong> — train a model \\(r_\\phi\\) to predict human preferences.</li><li><strong>RL optimization</strong> — fine-tune the policy with RL (PPO) to maximize reward, regularized to stay near the SFT model.</li></ol><p>The regularization is crucial: a KL penalty to the reference policy stops the model from drifting into degenerate text that games the reward — \"reward hacking.\"</p>",
        },
        {
          name: "Reward modeling",
          summaryZh: "奖励建模",
          body:
            "<p>From preference pairs we train a scalar reward via the <strong>Bradley–Terry</strong> model, which says the probability a response is preferred is a logistic function of the reward gap:</p>\\[ P(y_w \\succ y_l \\mid x) = \\sigma\\big(r_\\phi(x,y_w) - r_\\phi(x,y_l)\\big). \\]<p>The reward model is typically the LLM with a scalar head, trained to maximize the likelihood of observed human choices. It becomes the automated judge of quality that RL then optimizes against.</p>",
        },
        {
          name: "RL with PPO",
          summaryZh: "用 PPO 做强化学习",
          body:
            "<p><strong>Proximal Policy Optimization (PPO)</strong> updates the policy to increase reward while preventing large, destabilizing steps via a clipped objective:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon) A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta}{\\pi_{\\text{old}}}. \\]<p>In RLHF the per-token reward is the reward-model score minus a KL penalty to the reference policy. PPO is powerful but heavy — it juggles four models (policy, reference, reward, value) and is sensitive to hyperparameters, which motivates simpler alternatives.</p>",
        },
        {
          name: "DPO: Direct Preference Optimization",
          summaryZh: "DPO:直接偏好优化",
          body:
            "<p><strong>DPO</strong> skips the reward model and RL loop entirely. A key derivation shows the RLHF optimum can be written so the reward is implicit in the policy itself, turning alignment into a simple classification loss on preference pairs:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\Big)\\Big]. \\]<p>It is stable, simple to implement, and needs no reward model or sampling — which is why DPO and its variants (IPO, KTO, ORPO) have become enormously popular.</p>",
        },
      ],
      takeaways: [
        "Humans compare more reliably than they score — preferences are the supervision signal.",
        "RLHF = SFT → reward model (Bradley–Terry) → PPO with a KL leash to the reference.",
        "PPO's clipped objective keeps updates stable but the setup is heavy (4 models).",
        "DPO turns alignment into a single classification loss — no reward model, no RL loop.",
      ],
    },

    /* ===================== LECTURE 6 ===================== */
    {
      id: 6,
      num: "06",
      slug: "llm-reasoning",
      title: "LLM Reasoning",
      titleZh: "大模型推理",
      date: "Nov 7, 2025",
      duration: "1:47:10",
      videoId: "k5Fh-UgTuCo",
      accent: "rose",
      tagline: "Spending compute to think — RL with verifiable rewards.",
      overview:
        "The 2024–25 leap: models that <em>reason</em> by generating long internal chains of thought before answering. We cover reasoning models (o1, DeepSeek-R1), reinforcement learning from <strong>verifiable</strong> rewards, the <strong>GRPO</strong> algorithm that powered R1, and the new scaling axis — <strong>test-time compute</strong>.",
      overviewZh:
        "2024–25 年的飞跃:模型在作答前生成长串内部思维链来进行<em>推理</em>。本讲涵盖推理模型(o1、DeepSeek-R1)、基于<strong>可验证</strong>奖励的强化学习、驱动 R1 的 <strong>GRPO</strong> 算法,以及新的扩展维度 —— <strong>测试期算力</strong>。",
      topics: [
        {
          name: "Reasoning models",
          summaryZh: "推理模型",
          body:
            "<p>A <strong>reasoning model</strong> is trained to produce a long, deliberate chain of thought — exploring, checking and backtracking — before committing to an answer. OpenAI's <strong>o1</strong> and <strong>DeepSeek-R1</strong> showed that this unlocks large gains on math, coding and science benchmarks. The reasoning trace is the product of training, not just a clever prompt: the model learns <em>when</em> to think longer.</p>",
        },
        {
          name: "RL for reasoning",
          summaryZh: "面向推理的强化学习",
          body:
            "<p>Alignment RL (Lecture 5) uses a learned reward model. Reasoning RL can use <strong>verifiable rewards</strong> instead: for math or code, correctness is checkable automatically (does it equal the answer? do the tests pass?). This gives a clean, unhackable signal. A striking finding from DeepSeek-R1-Zero: applying RL with verifiable rewards to a base model elicited reasoning behaviors — longer chains, self-verification, \"aha\" moments — <em>without</em> any supervised reasoning data.</p>",
        },
        {
          name: "GRPO",
          summaryZh: "GRPO 算法",
          body:
            "<p><strong>Group Relative Policy Optimization (GRPO)</strong> is the algorithm behind DeepSeek-R1. It removes PPO's value network: for each prompt it samples a <em>group</em> of \\(G\\) responses and uses their rewards to compute a <strong>relative advantage</strong> by normalizing within the group:</p>\\[ \\hat{A}_i = \\frac{r_i - \\text{mean}(r_1,\\dots,r_G)}{\\text{std}(r_1,\\dots,r_G)}. \\]<p>This is cheaper and more stable than PPO (no separate critic to train) and matches grouped sampling naturally. The policy is updated with a PPO-style clipped objective using these group-relative advantages plus a KL term to a reference.</p>",
        },
        {
          name: "Train-time vs. test-time scaling",
          summaryZh: "训练期 vs 测试期扩展",
          body:
            "<p>Two distinct axes now drive performance:</p><ul><li><strong>Train-time scaling</strong> — bigger models, more data, more pretraining compute (the classic scaling laws).</li><li><strong>Test-time (inference) scaling</strong> — let the model spend more compute <em>per question</em>: longer chains of thought, sampling many solutions, verifying and selecting.</li></ul><p>Reasoning models show a smooth log-linear trade: accuracy improves as you allow more thinking tokens. This reframes \"intelligence\" partly as a budget you allocate at inference — and it is one of the most active research frontiers.</p>",
        },
      ],
      takeaways: [
        "Reasoning models are trained to generate long chains of thought before answering.",
        "Verifiable rewards (math/code) give a clean RL signal that resists reward hacking.",
        "GRPO drops PPO's critic and uses group-relative, normalized advantages.",
        "Test-time compute is a new scaling axis: more thinking tokens → higher accuracy.",
      ],
    },

    /* ===================== LECTURE 7 ===================== */
    {
      id: 7,
      num: "07",
      slug: "agentic-llms",
      title: "Agentic LLMs",
      titleZh: "智能体化大模型",
      date: "Nov 14, 2025",
      duration: "1:49:23",
      videoId: "h-7S6HNq0Vg",
      accent: "sky",
      tagline: "Giving models memory, tools, and the ability to act.",
      overview:
        "LLMs become far more capable when connected to external knowledge and tools. This lecture covers <strong>retrieval-augmented generation (RAG)</strong> and its advanced variants, <strong>function/tool calling</strong>, the notion of an <strong>agent</strong>, and the <strong>ReAct</strong> framework that interleaves reasoning with actions.",
      overviewZh:
        "当大模型连接到外部知识与工具时,能力会大幅提升。本讲涵盖<strong>检索增强生成(RAG)</strong>及其进阶变体、<strong>函数/工具调用</strong>、<strong>智能体(agent)</strong>的概念,以及把推理与行动交织起来的 <strong>ReAct</strong> 框架。",
      topics: [
        {
          name: "Retrieval-Augmented Generation (RAG)",
          summaryZh: "检索增强生成 RAG",
          body:
            "<p><strong>RAG</strong> grounds generation in retrieved documents, reducing hallucination and adding fresh, private knowledge without retraining. The pipeline:</p><ol><li><strong>Index</strong> — chunk a corpus, embed each chunk, store vectors in a vector database.</li><li><strong>Retrieve</strong> — embed the query, fetch the top-\\(k\\) chunks by similarity (e.g. cosine).</li><li><strong>Generate</strong> — put the retrieved chunks in the prompt as context and answer.</li></ol>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]",
        },
        {
          name: "Advanced RAG",
          summaryZh: "进阶 RAG",
          body:
            "<p>Naive RAG often retrieves the wrong context. Improvements span the whole pipeline:</p><ul><li><strong>Better chunking</strong> — semantic / overlapping chunks instead of fixed windows.</li><li><strong>Hybrid search</strong> — combine dense (embedding) and sparse (BM25 keyword) retrieval.</li><li><strong>Reranking</strong> — a cross-encoder re-scores the top candidates for precision.</li><li><strong>Query transformation</strong> — rewriting, multi-query, or <em>HyDE</em> (generate a hypothetical answer, embed <em>that</em> to retrieve).</li><li><strong>Agentic RAG</strong> — the model decides what and when to retrieve, iteratively.</li></ul>",
        },
        {
          name: "Function / tool calling",
          summaryZh: "函数 / 工具调用",
          body:
            "<p><strong>Tool calling</strong> lets an LLM invoke external functions — search, a calculator, code execution, APIs. The model is given tool schemas (name, description, JSON arguments); it emits a structured call, the runtime executes it, and the result is fed back into the context. This breaks the model out of its frozen weights and lets it act on the world — the mechanism underneath agents.</p>",
        },
        {
          name: "Agents",
          summaryZh: "智能体",
          body:
            "<p>An <strong>agent</strong> is an LLM placed in a loop: it observes, plans, calls tools, observes results, and repeats until a goal is met. Beyond a single tool call, agents add <strong>planning</strong> (decompose a task into steps), <strong>memory</strong> (scratchpad and long-term stores) and <strong>control flow</strong> (decide the next action). Multi-agent systems coordinate several specialized agents. The promise is autonomy on complex, multi-step tasks; the challenge is reliability and error compounding over long horizons.</p>",
        },
        {
          name: "The ReAct framework",
          summaryZh: "ReAct 框架",
          body:
            "<p><strong>ReAct</strong> (Reason + Act) interleaves <em>thoughts</em>, <em>actions</em> and <em>observations</em> in a single loop:</p><blockquote><strong>Thought:</strong> what should I do next?<br><strong>Action:</strong> call a tool with some input.<br><strong>Observation:</strong> read the tool's result.</blockquote><p>Repeating this lets the model reason about results before acting again — combining chain-of-thought with tool use. It is the canonical recipe behind many practical agent frameworks and grounds reasoning in real feedback.</p>",
        },
      ],
      takeaways: [
        "RAG = index → retrieve (vector similarity) → generate with retrieved context.",
        "Advanced RAG adds hybrid search, reranking and query transforms like HyDE.",
        "Tool calling lets the model emit structured calls and consume their results.",
        "ReAct interleaves Thought → Action → Observation, grounding reasoning in feedback.",
      ],
    },

    /* ===================== LECTURE 8 ===================== */
    {
      id: 8,
      num: "08",
      slug: "llm-evaluation",
      title: "LLM Evaluation",
      titleZh: "大模型评测",
      date: "Nov 21, 2025",
      duration: "1:49:25",
      videoId: "8fNP4N46RRo",
      accent: "teal",
      tagline: "How do you measure an open-ended generator?",
      overview:
        "Evaluating generative models is genuinely hard — there is rarely one right answer. This lecture surveys the evaluation landscape, focuses on the increasingly common <strong>LLM-as-a-judge</strong> paradigm, and is honest about its <strong>biases and pitfalls</strong> and the best practices that mitigate them.",
      overviewZh:
        "评测生成式模型本身就很难 —— 往往没有唯一正确答案。本讲梳理评测全景,重点讲解日益常见的 <strong>LLM-as-a-judge</strong>(用大模型当裁判)范式,并坦诚剖析其<strong>偏差与陷阱</strong>以及缓解它们的最佳实践。",
      topics: [
        {
          name: "The evaluation landscape",
          summaryZh: "评测全景",
          body:
            "<p>Evaluation methods trade off cost, scalability and fidelity:</p><ul><li><strong>Automatic metrics</strong> — BLEU/ROUGE (overlap), perplexity, exact-match/accuracy. Cheap but weak for open-ended quality.</li><li><strong>Benchmarks</strong> — MMLU (knowledge), GSM8K/MATH (reasoning), HumanEval (code), HELM (holistic). Risk: <em>contamination</em> when test data leaks into pretraining.</li><li><strong>Human evaluation</strong> — the gold standard for quality (e.g. Chatbot Arena's pairwise voting), but slow and expensive.</li><li><strong>LLM-as-a-judge</strong> — use a strong LLM to approximate human judgment at scale.</li></ul>",
        },
        {
          name: "LLM-as-a-judge",
          summaryZh: "以大模型为裁判",
          body:
            "<p><strong>LLM-as-a-judge</strong> prompts a capable model to score or compare responses, approximating human preference cheaply and quickly. Two common modes:</p><ul><li><strong>Pairwise comparison</strong> — \"which response is better, A or B?\" (most reliable).</li><li><strong>Pointwise scoring</strong> — rate a response on a rubric (e.g. 1–10).</li></ul><p>It correlates surprisingly well with human judgments and scales to thousands of examples — making it the workhorse for ranking models, validating RAG/agents, and even as a reward signal.</p>",
        },
        {
          name: "Biases & pitfalls",
          summaryZh: "偏差与陷阱",
          body:
            "<p>LLM judges have systematic biases you must control for:</p><ul><li><strong>Position bias</strong> — favoring the first (or last) option regardless of content.</li><li><strong>Verbosity bias</strong> — preferring longer answers.</li><li><strong>Self-enhancement bias</strong> — favoring outputs from the same model family.</li><li><strong>Sycophancy / style over substance</strong> — rewarding confident, well-formatted but wrong answers.</li></ul><p>Ignoring these produces confidently misleading leaderboards.</p>",
        },
        {
          name: "Best practices",
          summaryZh: "最佳实践",
          body:
            "<p>Mitigations that make LLM-as-a-judge trustworthy:</p><ul><li><strong>Randomize / swap positions</strong> and average to cancel position bias.</li><li><strong>Clear rubrics & reference answers</strong> to anchor scoring.</li><li><strong>Chain-of-thought judging</strong> — ask for reasoning before the verdict.</li><li><strong>Calibrate against humans</strong> on a sample; report agreement.</li><li><strong>Ensemble judges</strong> and prefer pairwise over absolute scores.</li></ul><p>Used carefully, automated evaluation closes the loop on the entire LLM development cycle.</p>",
        },
      ],
      takeaways: [
        "No single metric captures open-ended quality — combine automatic, benchmark and human signals.",
        "LLM-as-a-judge scales human-like evaluation cheaply, especially in pairwise mode.",
        "Watch for position, verbosity and self-enhancement biases.",
        "Swap positions, use rubrics and CoT, and calibrate judges against humans.",
      ],
    },

    /* ===================== LECTURE 9 ===================== */
    {
      id: 9,
      num: "09",
      slug: "current-trends",
      title: "Recap & Current Trends",
      titleZh: "回顾与前沿趋势",
      date: "Dec 5, 2025",
      duration: "1:51:31",
      videoId: "Q86qzJ1K1Ss",
      accent: "fuchsia",
      tagline: "Where we've been, and where the field is heading.",
      overview:
        "The capstone ties the course together — from attention to agents — and looks ahead to the trends shaping the next generation of models: multimodality, ever-longer context, efficiency, agentic systems and the open questions that remain.",
      overviewZh:
        "收官之讲串起整门课 —— 从注意力到智能体 —— 并展望塑造下一代模型的趋势:多模态、更长上下文、效率、智能体系统,以及仍待解答的开放问题。",
      topics: [
        {
          name: "Course recap",
          summaryZh: "课程回顾",
          body:
            "<p>The arc of the course: <strong>attention</strong> replaced recurrence (L1); engineering made it efficient and position-aware (L2); <strong>scale</strong> + sparsity + prompting created LLMs (L3); we learned to <strong>train</strong>, compress and adapt them (L4); to <strong>align</strong> them to human preference (L5); to make them <strong>reason</strong> with RL (L6); to make them <strong>act</strong> with tools and RAG (L7); and to <strong>evaluate</strong> all of it (L8). Every piece composes into the systems you use today.</p>",
        },
        {
          name: "Trending topics",
          summaryZh: "前沿话题",
          body:
            "<p>The frontier as of late 2025:</p><ul><li><strong>Multimodality</strong> — unified text + image + audio + video models.</li><li><strong>Test-time compute & reasoning</strong> — the o1/R1 paradigm scaling further.</li><li><strong>Agents at scale</strong> — reliable long-horizon, tool-using systems.</li><li><strong>Efficiency</strong> — MoE, distillation, quantization, speculative decoding, and new architectures (state-space models, linear attention) challenging the quadratic core.</li><li><strong>Long context</strong> — million-token windows and memory architectures.</li><li><strong>Safety & alignment</strong> — interpretability, robustness, and oversight that scales with capability.</li></ul>",
        },
        {
          name: "Where to go next",
          summaryZh: "继续前进的方向",
          body:
            "<p>Keep learning by <em>building</em>: fine-tune a small model with LoRA, stand up a RAG pipeline, implement attention from scratch, or reproduce a DPO run. Pair this site's recordings with the official <strong>cheatsheet</strong> and the <em>Super Study Guide</em>, and follow new papers — the half-life of \"current\" in this field is short, but the foundations from this course are durable.</p>",
        },
      ],
      takeaways: [
        "The course composes into a full stack: attention → efficiency → LLMs → training → alignment → reasoning → agents → evaluation.",
        "Frontier themes: multimodality, test-time compute, reliable agents, efficiency and long context.",
        "Architectures beyond quadratic attention (SSMs, linear attention) are rising.",
        "The best way to consolidate is to build — fine-tune, retrieve, and reproduce.",
      ],
    },
  ],

  /* Exams shown on the roadmap */
  milestones: [
    { after: 4, label: "Midterm Exam", labelZh: "期中考试", date: "Oct 24, 2025" },
    { after: 9, label: "Final Exam", labelZh: "期末考试", date: "Dec 10, 2025" },
  ],
};

/* Expose for both module and plain-script usage */
if (typeof window !== "undefined") window.COURSE = COURSE;
