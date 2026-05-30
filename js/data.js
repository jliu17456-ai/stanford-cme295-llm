/* =============================================================================
 * CME 295 · Transformers & Large Language Models
 * Course content — fully bilingual (EN / 中文), classroom-depth notes.
 *
 * Distilled from the public Stanford CME 295 syllabus, the official VIP
 * cheatsheet, the Super Study Guide, and the Autumn 2025 lecture recordings.
 * These are expert-written study notes (YouTube blocks transcript pulls from
 * cloud IPs), expanded well beyond cheatsheet level with derivations,
 * intuition and trade-offs. Math renders with MathJax via \( \) and \[ \]
 * (note the doubled backslashes required inside JS strings).
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
    playlist: "https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy",
    syllabus: "https://cme295.stanford.edu/syllabus/",
    cheatsheet: "https://cme295.stanford.edu/cheatsheet/",
    github: "https://github.com/afshinea/stanford-cme-295-transformers-large-language-models",
    book: "https://superstudy.guide",
    tagline: "From word vectors to reasoning agents — a complete tour of the architecture that powers modern AI.",
    taglineZh: "从词向量到推理智能体 —— 完整走过驱动现代 AI 的核心架构。",
  },

  outcomes: [
    {
      icon: "M4 6h16M4 12h16M4 18h10",
      title: "Read the architecture", titleZh: "读懂架构",
      text: "Explain every block of the Transformer — attention, FFN, residuals, normalization, positional encodings — and why each exists.",
      textZh: "讲清 Transformer 的每个模块 —— 注意力、前馈网络、残差、归一化、位置编码 —— 以及它们为何存在。",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Make models efficient", titleZh: "让模型更高效",
      text: "Apply MQA/GQA, RoPE, FlashAttention, mixture-of-experts and quantization to scale models in compute and memory.",
      textZh: "运用 MQA/GQA、RoPE、FlashAttention、混合专家与量化,在算力和显存上扩展模型。",
    },
    {
      icon: "M12 6v6l4 2",
      title: "Train & align", titleZh: "训练与对齐",
      text: "Walk the full pipeline: pretraining, SFT, LoRA, reward modeling, RLHF, PPO and DPO.",
      textZh: "走通完整流程:预训练、SFT、LoRA、奖励建模、RLHF、PPO 与 DPO。",
    },
    {
      icon: "M9 12l2 2 4-4",
      title: "Build applications", titleZh: "构建应用",
      text: "Design RAG pipelines, tool-calling agents and reasoning systems — and evaluate them rigorously with LLM-as-a-judge.",
      textZh: "设计 RAG 流程、工具调用智能体与推理系统,并用 LLM-as-a-judge 严谨评测。",
    },
  ],

  lectures: [
    /* ===================== LECTURE 1 ===================== */
    {
      id: 1, num: "01", slug: "transformer",
      title: "The Transformer", titleZh: "Transformer 架构",
      date: "Sep 26, 2025", duration: "1:41:58", videoId: "Ub3GoFaUcds", accent: "indigo",
      tagline: "How attention replaced recurrence and rewired NLP.",
      taglineZh: "注意力如何取代循环结构,重塑了自然语言处理。",
      overview: "We start from the building blocks of NLP — tokens, embeddings, the sequence-modeling problem — then trace the path from recurrent networks to the attention mechanism, and finally assemble the full Transformer from <em>Attention Is All You Need</em> (2017): multi-head attention, feed-forward layers, residual connections, normalization and positional encodings.",
      overviewZh: "本讲从 NLP 的基本构件出发(词元、词嵌入、序列建模问题),沿着从循环网络到注意力机制的演进,最终拼出 2017 年《Attention Is All You Need》中的完整 Transformer:多头注意力、前馈层、残差连接、归一化与位置编码。",
      topics: [
        {
          name: "NLP tasks & the sequence problem", nameZh: "NLP 任务与序列建模问题",
          body: "<p>Language is a <strong>sequence of discrete symbols</strong> whose meaning depends on order and on context that can be arbitrarily far away. Classic tasks come in a few shapes: <em>classification</em> (sentiment, topic), <em>sequence labeling</em> (named-entity recognition, part-of-speech), <em>sequence-to-sequence</em> (translation, summarization) and open-ended <em>generation</em>.</p><p>A <strong>language model</strong> assigns probability to a sequence by factorizing it autoregressively — predicting each token from all previous ones:</p>\\[ p(x_1,\\dots,x_T)=\\prod_{t=1}^{T} p(x_t \\mid x_1,\\dots,x_{t-1}). \\]<p>Everything in this course is, ultimately, a better way to estimate that conditional distribution. The central obstacle is modeling <strong>long-range dependencies</strong> — connecting words that are far apart — efficiently.</p>",
          bodyZh: "<p>语言是一串<strong>离散符号序列</strong>,其含义取决于顺序,也取决于可能相距很远的上下文。经典任务有几种形态:<em>分类</em>(情感、主题)、<em>序列标注</em>(命名实体识别、词性标注)、<em>序列到序列</em>(翻译、摘要)以及开放式<em>生成</em>。</p><p><strong>语言模型</strong>通过自回归分解为序列赋予概率 —— 用前面所有词元预测下一个:</p>\\[ p(x_1,\\dots,x_T)=\\prod_{t=1}^{T} p(x_t \\mid x_1,\\dots,x_{t-1}). \\]<p>本课程的一切,归根结底都是为了更好地估计这个条件分布。核心难点在于:如何<strong>高效地建模长程依赖</strong> —— 把相隔很远的词联系起来。</p>",
        },
        {
          name: "Tokenization", nameZh: "分词(Tokenization)",
          body: "<p>Before a model sees text it must be cut into <strong>tokens</strong>. Word-level tokenization explodes the vocabulary and fails on rare or unseen words; character-level keeps the vocabulary tiny but makes sequences very long and forces the model to relearn spelling. Modern models use <strong>subword</strong> schemes between the two.</p><ul><li><strong>Byte-Pair Encoding (BPE):</strong> start from characters and greedily merge the most frequent adjacent pair, repeatedly, until a target vocabulary size is reached.</li><li><strong>WordPiece</strong> (BERT) and <strong>Unigram / SentencePiece</strong> (T5, LLaMA) are common variants.</li></ul><p>Subwords give an <strong>open vocabulary</strong>: any string is representable, frequent words stay whole, and rare words split into reusable pieces — a good balance of sequence length and coverage.</p>",
          bodyZh: "<p>模型看到文本前必须先切成<strong>词元(token)</strong>。按词切分会让词表爆炸,且对罕见/未见词无能为力;按字符切分词表很小,但序列太长,还得让模型重新学习拼写。现代模型采用介于两者之间的<strong>子词(subword)</strong>方案。</p><ul><li><strong>字节对编码(BPE):</strong> 从字符出发,反复贪心地合并出现频率最高的相邻对,直到达到目标词表大小。</li><li><strong>WordPiece</strong>(BERT)与 <strong>Unigram / SentencePiece</strong>(T5、LLaMA)是常见变体。</li></ul><p>子词带来<strong>开放词表</strong>:任意字符串都能表示,高频词保持完整,低频词拆成可复用的片段 —— 在序列长度与覆盖率之间取得良好平衡。</p>",
        },
        {
          name: "Embeddings & Word2vec", nameZh: "词嵌入与 Word2vec",
          body: "<p>Each token id is mapped to a dense vector through an <strong>embedding matrix</strong> \\(E \\in \\mathbb{R}^{|V| \\times d}\\), learned so that geometry encodes meaning. <strong>Word2vec</strong> popularized this with two shallow objectives:</p><ul><li><strong>CBOW</strong> — predict a center word from its context.</li><li><strong>Skip-gram</strong> — predict the context from the center word.</li></ul><p>The striking result is that semantic relationships become <em>linear</em>:</p>\\[ \\vec{king} - \\vec{man} + \\vec{woman} \\approx \\vec{queen}. \\]<p>The limitation is that each word gets <strong>one</strong> vector regardless of context — the river <em>bank</em> and the savings <em>bank</em> collapse together. Contextual models (the Transformer) fix exactly this by computing embeddings that depend on the whole sentence.</p>",
          bodyZh: "<p>每个词元 id 通过<strong>嵌入矩阵</strong> \\(E \\in \\mathbb{R}^{|V| \\times d}\\) 映射成稠密向量,训练目标是让几何关系编码语义。<strong>Word2vec</strong> 用两个浅层目标让这一思想流行起来:</p><ul><li><strong>CBOW</strong> —— 用上下文预测中心词。</li><li><strong>Skip-gram</strong> —— 用中心词预测上下文。</li></ul><p>令人印象深刻的结果是语义关系变得<em>线性</em>:</p>\\[ \\vec{king} - \\vec{man} + \\vec{woman} \\approx \\vec{queen}. \\]<p>局限在于:无论上下文如何,每个词只有<strong>一个</strong>向量 —— 河<em>岸(bank)</em>和<em>银行(bank)</em>被混为一谈。上下文模型(Transformer)正是通过计算依赖整句的嵌入来解决这一点。</p>",
        },
        {
          name: "RNNs & LSTMs", nameZh: "循环网络与 LSTM",
          body: "<p>The pre-Transformer answer to sequences was the <strong>Recurrent Neural Network</strong>, which carries a hidden state updated token by token:</p>\\[ h_t = \\tanh(W_h h_{t-1} + W_x x_t + b). \\]<p>In principle \\(h_t\\) summarizes everything seen so far, but in practice gradients <strong>vanish or explode</strong> over many steps, so RNNs forget distant context. <strong>LSTMs</strong> and <strong>GRUs</strong> add gating (input/forget/output gates) and a cell state, letting information flow across longer spans.</p><p>Two problems remain and directly motivate the Transformer: recurrence is <strong>inherently sequential</strong> — step \\(t\\) needs step \\(t-1\\), so it cannot be parallelized across time — and even gated memory degrades over very long contexts.</p>",
          bodyZh: "<p>Transformer 之前,序列建模的主流答案是<strong>循环神经网络(RNN)</strong>,它维护一个逐词元更新的隐藏状态:</p>\\[ h_t = \\tanh(W_h h_{t-1} + W_x x_t + b). \\]<p>理论上 \\(h_t\\) 概括了此前的一切,但实际中梯度会在多步传播中<strong>消失或爆炸</strong>,导致 RNN 遗忘远处上下文。<strong>LSTM</strong> 与 <strong>GRU</strong> 引入门控(输入/遗忘/输出门)和细胞状态,使信息能跨越更长跨度。</p><p>仍有两个问题,并直接催生了 Transformer:循环<strong>本质上是串行的</strong> —— 第 \\(t\\) 步依赖第 \\(t-1\\) 步,无法在时间维度并行;且即便有门控记忆,在超长上下文上仍会退化。</p>",
        },
        {
          name: "The attention mechanism", nameZh: "注意力机制",
          body: "<p>Attention lets every position look <em>directly</em> at every other position, with no recurrence. Each token emits a <strong>query</strong> \\(q\\); every token offers a <strong>key</strong> \\(k\\) and a <strong>value</strong> \\(v\\). The output for a token is a weighted average of all values, weighted by how well its query matches each key:</p>\\[ \\text{Attention}(Q,K,V)=\\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V. \\]<p>Intuitively, the dot product \\(q\\cdot k\\) is a similarity score; softmax turns scores into weights that sum to one; the result mixes the values the token cares about. The \\(\\sqrt{d_k}\\) factor rescales dot products so they do not grow with dimension and saturate the softmax into near-one-hot (which would kill gradients). Crucially, this is a handful of large matrix multiplies — <strong>massively parallel</strong> on GPUs, the decisive advantage over RNNs.</p>",
          bodyZh: "<p>注意力让每个位置都能<em>直接</em>看到其他所有位置,无需循环。每个词元发出一个<strong>查询(query)</strong> \\(q\\);每个词元提供一个<strong>键(key)</strong> \\(k\\) 和一个<strong>值(value)</strong> \\(v\\)。某词元的输出是所有值的加权平均,权重取决于它的查询与各个键的匹配程度:</p>\\[ \\text{Attention}(Q,K,V)=\\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V. \\]<p>直观地说,点积 \\(q\\cdot k\\) 是相似度分数;softmax 把分数变成和为 1 的权重;结果便混合了该词元真正关心的值。\\(\\sqrt{d_k}\\) 因子对点积重新缩放,使其不随维度增大而把 softmax 推向接近独热(那会扼杀梯度)。关键在于:这只是几次大矩阵乘法 —— 在 GPU 上<strong>高度并行</strong>,这正是相对 RNN 的决定性优势。</p>",
        },
        {
          name: "Assembling the Transformer", nameZh: "组装 Transformer",
          body: "<p>The original Transformer is an <strong>encoder–decoder</strong>. Each layer stacks the same ingredients:</p><ul><li><strong>Multi-head attention</strong> — run attention in \\(h\\) parallel subspaces (each with its own \\(W_Q,W_K,W_V\\)) and concatenate, so the model captures several relationship types at once.</li><li><strong>Position-wise feed-forward network</strong> — \\( \\text{FFN}(x)=W_2\\,\\sigma(W_1 x + b_1)+b_2 \\), applied identically at every position; this is where much of the model's capacity lives.</li><li><strong>Residual connections + Layer Normalization</strong> — \\( \\text{LayerNorm}(x + \\text{Sublayer}(x)) \\), which stabilize and speed up optimization of deep stacks.</li><li><strong>Positional encoding</strong> — because attention is permutation-invariant, order is injected explicitly (originally with sinusoids).</li></ul><p>The decoder adds <strong>masked</strong> self-attention (position \\(t\\) cannot see the future) and cross-attention into the encoder output. This single template — repeated and scaled — underlies everything that follows.</p>",
          bodyZh: "<p>最初的 Transformer 是<strong>编码器-解码器</strong>结构。每一层堆叠相同的组件:</p><ul><li><strong>多头注意力</strong> —— 在 \\(h\\) 个并行子空间中各做一次注意力(每个有自己的 \\(W_Q,W_K,W_V\\))再拼接,使模型一次性捕捉多种关系。</li><li><strong>逐位置前馈网络(FFN)</strong> —— \\( \\text{FFN}(x)=W_2\\,\\sigma(W_1 x + b_1)+b_2 \\),在每个位置独立施加;模型很大一部分容量就在这里。</li><li><strong>残差连接 + 层归一化</strong> —— \\( \\text{LayerNorm}(x + \\text{Sublayer}(x)) \\),稳定并加速深层堆叠的优化。</li><li><strong>位置编码</strong> —— 因为注意力对排列不变,必须显式注入顺序(最初用正弦函数)。</li></ul><p>解码器额外加入<strong>带掩码</strong>的自注意力(位置 \\(t\\) 看不到未来)以及对编码器输出的交叉注意力。这套模板 —— 反复堆叠并放大 —— 支撑起后续的一切。</p>",
        },
      ],
      takeaways: [
        "Attention computes a content-based weighted average of values via query–key similarity, scaled by 1/√dₖ.",
        "Multi-head attention captures several relationship types in parallel subspaces.",
        "Transformers drop recurrence entirely, making training highly parallelizable.",
        "Positional encodings are required because attention itself is order-agnostic.",
      ],
      takeawaysZh: [
        "注意力通过查询-键相似度,对值做基于内容的加权平均,并用 1/√dₖ 缩放。",
        "多头注意力在并行子空间中捕捉多种关系。",
        "Transformer 彻底去掉循环,使训练高度可并行。",
        "因为注意力本身与顺序无关,所以必须加入位置编码。",
      ],
      refs: [
        { t: "Attention Is All You Need (Vaswani et al., 2017)", u: "https://arxiv.org/abs/1706.03762" },
        { t: "Efficient Estimation of Word Representations — word2vec (Mikolov et al., 2013)", u: "https://arxiv.org/abs/1301.3781" },
        { t: "The Illustrated Transformer (Jay Alammar)", u: "https://jalammar.github.io/illustrated-transformer/" },
      ],
    },

    /* ===================== LECTURE 2 ===================== */
    {
      id: 2, num: "02", slug: "models-and-tricks",
      title: "Transformer-based Models & Tricks", titleZh: "Transformer 模型族与技巧",
      date: "Oct 3, 2025", duration: "1:47:19", videoId: "yT84Y5zCnaA", accent: "violet",
      tagline: "Making attention cheaper, smarter about position, and task-shaped.",
      taglineZh: "让注意力更省、更懂位置,并适配不同任务形态。",
      overview: "Vanilla attention is \\(O(n^2)\\) in sequence length and uses absolute positions. This lecture surveys the engineering that made Transformers practical at scale: efficient-attention approximations, the MHA → MQA → GQA family, modern positional schemes culminating in RoPE, the three architectural shapes (encoder-only, decoder-only, encoder–decoder), and BERT as the canonical encoder.",
      overviewZh: "原始注意力对序列长度是 \\(O(n^2)\\),且用绝对位置。本讲梳理让 Transformer 真正规模化的工程改良:高效注意力近似、MHA → MQA → GQA 家族、以 RoPE 为代表的现代位置编码、三种架构形态(仅编码器、仅解码器、编码-解码),并以 BERT 作为编码器代表。",
      topics: [
        {
          name: "Efficient attention", nameZh: "高效注意力",
          body: "<p>Full attention costs \\(O(n^2 d)\\) time and \\(O(n^2)\\) memory: doubling the context quadruples the cost. Three families attack this.</p><ul><li><strong>Sparse attention</strong> — each token attends only to a structured subset (local windows, strided patterns, a few global tokens), as in Longformer and BigBird, reducing cost toward \\(O(n)\\).</li><li><strong>Low-rank / kernel attention</strong> — approximate the softmax with a low-rank or kernel factorization (Linformer, Performer) for near-linear cost.</li><li><strong>FlashAttention</strong> — an <em>exact</em>, IO-aware algorithm that tiles the computation to keep blocks in fast on-chip SRAM and never materializes the full \\(n \\times n\\) matrix, giving large speed and memory wins.</li></ul><p>The key distinction: sparse and low-rank methods <em>approximate</em> attention; FlashAttention computes the <em>same</em> result, just far more efficiently — which is why it became the default.</p>",
          bodyZh: "<p>完整注意力的时间是 \\(O(n^2 d)\\)、显存是 \\(O(n^2)\\):上下文翻倍,成本变四倍。三类方法应对它。</p><ul><li><strong>稀疏注意力</strong> —— 每个词元只关注一个结构化子集(局部窗口、跨步模式、少量全局词元),如 Longformer、BigBird,把成本降向 \\(O(n)\\)。</li><li><strong>低秩 / 核注意力</strong> —— 用低秩或核分解近似 softmax(Linformer、Performer),达到接近线性的成本。</li><li><strong>FlashAttention</strong> —— 一种<em>精确</em>且感知 IO 的算法,把计算分块以保留在高速片上 SRAM 中,从不显式构造完整的 \\(n \\times n\\) 矩阵,带来巨大的速度与显存收益。</li></ul><p>关键区别:稀疏与低秩方法是<em>近似</em>注意力;FlashAttention 算出的是<em>完全相同</em>的结果,只是高效得多 —— 因此成为默认选择。</p>",
        },
        {
          name: "MHA → MQA → GQA", nameZh: "多头 → 多查询 → 分组查询注意力",
          body: "<p>At inference, autoregressive decoding caches the keys and values of past tokens — the <strong>KV cache</strong> — so each new token is \\(O(n)\\) rather than recomputing everything. Standard <strong>Multi-Head Attention (MHA)</strong> stores a separate K and V per head, and for long contexts this cache dominates memory and bandwidth.</p><ul><li><strong>Multi-Query Attention (MQA)</strong> — all heads <em>share one</em> K and V, drastically shrinking the cache at a small quality cost.</li><li><strong>Grouped-Query Attention (GQA)</strong> — the middle ground: heads are split into \\(g\\) groups, each sharing K/V. \\(g=1\\) is MQA; \\(g=h\\) is MHA.</li></ul><p>GQA is now standard in models like LLaMA 2/3: it keeps almost all of MHA's quality while making long-context inference far cheaper. This is a memory-bandwidth optimization, not a FLOPs one — decoding is bound by moving the cache, not by arithmetic.</p>",
          bodyZh: "<p>推理时,自回归解码会缓存过去词元的键和值 —— 即 <strong>KV 缓存</strong> —— 使每个新词元只需 \\(O(n)\\) 而非重算全部。标准<strong>多头注意力(MHA)</strong>为每个头单独存 K 和 V,在长上下文下这块缓存会主导显存与带宽。</p><ul><li><strong>多查询注意力(MQA)</strong> —— 所有头<em>共享同一份</em> K 和 V,大幅缩小缓存,代价是少量质量损失。</li><li><strong>分组查询注意力(GQA)</strong> —— 折中:把头分成 \\(g\\) 组,每组共享 K/V。\\(g=1\\) 即 MQA;\\(g=h\\) 即 MHA。</li></ul><p>GQA 现已是 LLaMA 2/3 等模型的标配:几乎保留 MHA 的全部质量,同时让长上下文推理便宜得多。这是显存带宽优化而非算力优化 —— 解码瓶颈在于搬运缓存,而非算术运算。</p>",
        },
        {
          name: "Positional encodings", nameZh: "位置编码",
          body: "<p>Attention is permutation-invariant — shuffle the inputs and the outputs shuffle identically — so position must be supplied explicitly.</p><ul><li><strong>Sinusoidal (fixed)</strong> — the original scheme: deterministic sines and cosines of geometrically varying frequency. It needs no parameters and extrapolates somewhat to unseen lengths.</li><li><strong>Learned absolute</strong> — a trainable vector per position (BERT, original GPT): flexible but cannot extrapolate beyond the maximum trained length.</li></ul><p>Both encode <em>absolute</em> position. The field has shifted toward encoding <em>relative</em> position — what matters for language is usually how far apart two tokens are, not their absolute indices — which leads directly to RoPE.</p>",
          bodyZh: "<p>注意力对排列不变 —— 打乱输入,输出也照样打乱 —— 因此必须显式提供位置。</p><ul><li><strong>正弦(固定)</strong> —— 最初方案:用几何变化频率的确定性正余弦。无需参数,且对未见长度有一定外推能力。</li><li><strong>学习的绝对位置</strong> —— 每个位置一个可训练向量(BERT、初代 GPT):灵活,但无法外推到训练时的最大长度之外。</li></ul><p>两者都编码<em>绝对</em>位置。如今趋势转向编码<em>相对</em>位置 —— 对语言而言,通常重要的是两词相距多远,而非它们的绝对下标 —— 这直接引出了 RoPE。</p>",
        },
        {
          name: "RoPE: Rotary Position Embeddings", nameZh: "旋转位置编码 RoPE",
          body: "<p><strong>RoPE</strong> encodes position by <em>rotating</em> the query and key vectors by an angle proportional to their position. Each 2-D pair of dimensions is rotated:</p>\\[ \\tilde{q}_m = R_{\\Theta,m}\\, q, \\qquad R_{\\Theta,m} \\text{ rotates each 2-D pair by angle } m\\theta_i. \\]<p>The elegant property is that the dot product after rotation depends only on the <strong>relative</strong> offset \\(m-n\\):</p>\\[ \\langle \\tilde{q}_m, \\tilde{k}_n \\rangle = g(q,k,\\,m-n). \\]<p>So absolute positions are injected at the input, yet attention scores are naturally a function of relative distance. RoPE adds <em>no parameters</em>, slots directly into the attention scores, and extrapolates to longer contexts with simple tricks (NTK-aware scaling, position interpolation). It powers LLaMA, GPT-NeoX, PaLM and most modern open models.</p>",
          bodyZh: "<p><strong>RoPE</strong> 通过把查询和键向量<em>旋转</em>一个与位置成正比的角度来编码位置。每相邻两维作为一个 2D 对被旋转:</p>\\[ \\tilde{q}_m = R_{\\Theta,m}\\, q, \\qquad R_{\\Theta,m} \\text{ 将每个 2D 对旋转角度 } m\\theta_i. \\]<p>优雅之处在于:旋转后的点积只依赖<strong>相对</strong>偏移 \\(m-n\\):</p>\\[ \\langle \\tilde{q}_m, \\tilde{k}_n \\rangle = g(q,k,\\,m-n). \\]<p>于是绝对位置在输入端注入,而注意力分数天然成为相对距离的函数。RoPE <em>不增加参数</em>,直接融入注意力分数,并能配合简单技巧(NTK 缩放、位置插值)外推到更长上下文。它驱动了 LLaMA、GPT-NeoX、PaLM 及大多数现代开源模型。</p>",
        },
        {
          name: "Three architectural shapes", nameZh: "三种架构形态",
          body: "<p>The same Transformer block specializes into three families purely by how attention is masked:</p><ul><li><strong>Encoder-only</strong> (BERT) — fully bidirectional attention; every token sees every other. Ideal for <em>understanding</em>: classification, retrieval, tagging.</li><li><strong>Decoder-only</strong> (GPT, LLaMA) — causal (masked) attention; a token sees only the past. Ideal for <em>generation</em>; this is the dominant LLM shape.</li><li><strong>Encoder–decoder</strong> (T5, BART) — a bidirectional encoder plus a causal decoder joined by cross-attention; natural for sequence-to-sequence like translation.</li></ul><p>The decoder-only shape won for general-purpose LLMs largely because next-token pretraining on raw text scales effortlessly and the same model both 'understands' and generates.</p>",
          bodyZh: "<p>同一个 Transformer 模块,仅凭注意力掩码方式的不同,就特化出三大家族:</p><ul><li><strong>仅编码器</strong>(BERT)—— 完全双向注意力,每个词元都能看到其他所有词元。适合<em>理解</em>类任务:分类、检索、标注。</li><li><strong>仅解码器</strong>(GPT、LLaMA)—— 因果(掩码)注意力,词元只能看到过去。适合<em>生成</em>;这是主流的 LLM 形态。</li><li><strong>编码-解码</strong>(T5、BART)—— 双向编码器加因果解码器,以交叉注意力相连;天然适合翻译等序列到序列任务。</li></ul><p>仅解码器形态在通用 LLM 中胜出,主要因为在原始文本上做下一词预测预训练可以毫不费力地扩展,且同一个模型既能「理解」又能生成。</p>",
        },
        {
          name: "BERT and its derivatives", nameZh: "BERT 及其衍生模型",
          body: "<p><strong>BERT</strong> pretrains a bidirectional encoder with two objectives: <em>Masked Language Modeling</em> (randomly mask ~15% of tokens and predict them from both sides) and <em>Next Sentence Prediction</em>. Because it reads the whole sentence at once, its representations are excellent for understanding tasks; you fine-tune a small head on top. Notable derivatives:</p><ul><li><strong>RoBERTa</strong> — drops NSP, trains longer on more data with bigger batches; a pure recipe improvement.</li><li><strong>ALBERT</strong> — parameter sharing and factorized embeddings for a much smaller model.</li><li><strong>DistilBERT</strong> — a distilled student, ~40% smaller and ~60% faster, keeping most accuracy.</li><li><strong>ELECTRA</strong> — replaced-token detection, a more sample-efficient pretraining objective.</li></ul>",
          bodyZh: "<p><strong>BERT</strong> 用两个目标预训练一个双向编码器:<em>掩码语言建模</em>(随机遮住约 15% 的词元,用两侧上下文预测它们)与<em>下一句预测</em>。由于它一次读入整句,其表示非常适合理解类任务;只需在其上微调一个小的输出头。重要衍生模型:</p><ul><li><strong>RoBERTa</strong> —— 去掉 NSP,用更多数据、更大批量训练更久;纯配方层面的改进。</li><li><strong>ALBERT</strong> —— 参数共享与分解式嵌入,得到更小的模型。</li><li><strong>DistilBERT</strong> —— 蒸馏得到的学生模型,体积小约 40%、速度快约 60%,保留大部分精度。</li><li><strong>ELECTRA</strong> —— 替换词元检测,是更具样本效率的预训练目标。</li></ul>",
        },
      ],
      takeaways: [
        "FlashAttention is exact but IO-aware — it speeds up attention without approximating it.",
        "MQA/GQA shrink the KV cache, the real bottleneck for long-context inference.",
        "RoPE encodes relative position by rotation, adds no parameters, and extrapolates well.",
        "Encoder-only, decoder-only and encoder–decoder are the same block with different masking.",
      ],
      takeawaysZh: [
        "FlashAttention 是精确的,但感知 IO —— 加速注意力而不做近似。",
        "MQA/GQA 缩小 KV 缓存,这是长上下文推理的真正瓶颈。",
        "RoPE 通过旋转编码相对位置,不加参数,且外推性好。",
        "仅编码器、仅解码器、编码-解码,本质是同一模块的不同掩码方式。",
      ],
      refs: [
        { t: "RoFormer: Rotary Position Embedding (Su et al., 2021)", u: "https://arxiv.org/abs/2104.09864" },
        { t: "FlashAttention (Dao et al., 2022)", u: "https://arxiv.org/abs/2205.14135" },
        { t: "GQA: Grouped-Query Attention (Ainslie et al., 2023)", u: "https://arxiv.org/abs/2305.13245" },
        { t: "BERT (Devlin et al., 2018)", u: "https://arxiv.org/abs/1810.04805" },
      ],
    },

    /* ===================== LECTURE 3 ===================== */
    {
      id: 3, num: "03", slug: "large-language-models",
      title: "Large Language Models", titleZh: "大语言模型",
      date: "Oct 10, 2025", duration: "1:48:44", videoId: "Q5baLehv5So", accent: "cyan",
      tagline: "Scale, sparsity, sampling and the art of prompting.",
      taglineZh: "规模、稀疏化、采样,以及提示的艺术。",
      overview: "What turns a Transformer into a <em>large</em> language model? This lecture covers the decoder-only recipe and emergence, the mixture-of-experts trick for scaling parameters cheaply, context length, the levers of decoding (temperature, top-k, top-p), and the emergent skill of <strong>prompting</strong> — in-context learning, chain-of-thought and self-consistency.",
      overviewZh: "是什么把 Transformer 变成「大」语言模型?本讲讲解仅解码器配方与能力涌现、用混合专家(MoE)低成本扩展参数、上下文长度、解码的各个旋钮(温度、top-k、top-p),以及涌现出的「提示」技能 —— 上下文学习、思维链与自一致性。",
      topics: [
        {
          name: "What is an LLM?", nameZh: "什么是大语言模型",
          body: "<p>An LLM is a <strong>decoder-only</strong> Transformer trained at scale to predict the next token, then run autoregressively to generate text. 'Large' spans three axes: parameters (billions and up), data (trillions of tokens) and compute. The remarkable empirical finding is <strong>emergence</strong> — capabilities like arithmetic, translation and multi-step reasoning appear as scale crosses thresholds, without being explicitly trained for.</p><p>Behavior follows <strong>scaling laws</strong>: test loss falls as a smooth power law in parameters, data and compute. Because the curve keeps paying off, the field keeps scaling — and the same next-token objective, applied to enough diverse text, yields a startlingly general model.</p>",
          bodyZh: "<p>大语言模型是一个<strong>仅解码器</strong>的 Transformer,在大规模上训练以预测下一个词元,再自回归地生成文本。「大」体现在三个维度:参数(数十亿起)、数据(数万亿词元)与算力。最引人注目的经验发现是<strong>能力涌现</strong> —— 算术、翻译、多步推理等能力会在规模越过某些阈值时出现,而并未被专门训练。</p><p>行为遵循<strong>扩展定律(scaling laws)</strong>:测试损失随参数、数据、算力以平滑的幂律下降。因为这条曲线持续奏效,整个领域便不断扩大规模 —— 同一个下一词预测目标,施加于足够多样的文本,就能得到一个惊人通用的模型。</p>",
        },
        {
          name: "Mixture of Experts (MoE)", nameZh: "混合专家 MoE",
          body: "<p>A dense model uses <em>every</em> parameter for <em>every</em> token. <strong>MoE</strong> replaces the FFN with many expert FFNs plus a <strong>router</strong> that sends each token to only its top-\\(k\\) experts:</p>\\[ y = \\sum_{i \\in \\text{top-}k} g_i(x)\\, E_i(x), \\qquad g = \\text{softmax}(\\text{router}(x)). \\]<p>This decouples <strong>total</strong> parameters from <strong>active</strong> parameters per token: you get the capacity of a huge model at the compute of a small one (e.g. Mixtral activates 2 of 8 experts). The main challenges are <em>load balancing</em> — an auxiliary loss encourages the router to use experts evenly so none collapse — and the communication overhead of routing tokens across devices. Used in Mixtral, GLaM, DeepSeek-MoE and frontier models.</p>",
          bodyZh: "<p>稠密模型对<em>每个</em>词元都用上<em>全部</em>参数。<strong>MoE</strong> 用许多专家 FFN 加一个<strong>路由器</strong>替换原 FFN,只把每个词元发给它的前 \\(k\\) 个专家:</p>\\[ y = \\sum_{i \\in \\text{top-}k} g_i(x)\\, E_i(x), \\qquad g = \\text{softmax}(\\text{router}(x)). \\]<p>这把<strong>总</strong>参数量与每词元的<strong>激活</strong>参数量解耦:以小模型的算力获得大模型的容量(如 Mixtral 在 8 个专家中激活 2 个)。主要挑战是<em>负载均衡</em> —— 用辅助损失促使路由器均匀使用专家,避免某些专家「坍缩」 —— 以及跨设备路由词元的通信开销。Mixtral、GLaM、DeepSeek-MoE 及前沿模型均采用。</p>",
        },
        {
          name: "Context length", nameZh: "上下文长度",
          body: "<p>The <strong>context window</strong> is how many tokens the model can attend to at once. Longer context unlocks long-document question answering, reasoning over whole codebases, and many-shot prompting — but the \\(O(n^2)\\) attention cost and a KV cache that grows linearly with length make it expensive in both compute and memory.</p><p>Techniques to extend it include RoPE interpolation and NTK-aware scaling (stretch the rotary frequencies so a model trained short generalizes long), efficient-attention variants, and careful continued pretraining on long documents. These have pushed practical windows from ~2K in the GPT-2 era to 128K–1M+ tokens today.</p>",
          bodyZh: "<p><strong>上下文窗口</strong>指模型一次能关注多少词元。更长的上下文解锁了长文档问答、对整个代码库的推理,以及多样例(many-shot)提示 —— 但 \\(O(n^2)\\) 的注意力成本,以及随长度线性增长的 KV 缓存,使其在算力与显存上都很昂贵。</p><p>扩展手段包括 RoPE 插值与 NTK 缩放(拉伸旋转频率,让短训练的模型也能泛化到长序列)、高效注意力变体,以及在长文档上谨慎地继续预训练。这些技术把实用窗口从 GPT-2 时代的约 2K 推到了如今的 128K–1M+ 词元。</p>",
        },
        {
          name: "Decoding: temperature & sampling", nameZh: "解码:温度与采样策略",
          body: "<p>Given the next-token logits, how do we pick a token? <strong>Temperature</strong> \\(T\\) reshapes the distribution before sampling:</p>\\[ p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}. \\]<p>\\(T \\to 0\\) is greedy and deterministic; \\(T > 1\\) flattens the distribution for more diversity and creativity. Common strategies:</p><ul><li><strong>Greedy</strong> — always take the argmax; fast but repetitive.</li><li><strong>Beam search</strong> — keep the top-\\(b\\) partial sequences; great for translation, dull for open generation.</li><li><strong>Top-k</strong> — sample only from the \\(k\\) most probable tokens.</li><li><strong>Top-p (nucleus)</strong> — sample from the smallest set whose cumulative probability exceeds \\(p\\); it adapts to how peaked the distribution is, which is why it is the popular default.</li></ul>",
          bodyZh: "<p>给定下一个词元的 logits,如何选词?<strong>温度</strong> \\(T\\) 在采样前重塑分布:</p>\\[ p_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}. \\]<p>\\(T \\to 0\\) 即贪心、确定;\\(T > 1\\) 把分布压平,带来更多多样性与创造性。常见策略:</p><ul><li><strong>贪心</strong> —— 永远取最大值;快,但容易重复。</li><li><strong>束搜索(beam search)</strong> —— 保留前 \\(b\\) 条部分序列;适合翻译,对开放生成则显得呆板。</li><li><strong>Top-k</strong> —— 只在概率最高的 \\(k\\) 个词元中采样。</li><li><strong>Top-p(核采样)</strong> —— 在累积概率超过 \\(p\\) 的最小集合中采样;它会根据分布的尖锐程度自适应,因此成为流行的默认选项。</li></ul>",
        },
        {
          name: "Prompting & in-context learning", nameZh: "提示与上下文学习",
          body: "<p>A pretrained LLM can be steered purely through its input, with no weight updates — this is <strong>in-context learning</strong>:</p><ul><li><strong>Zero-shot</strong> — just describe the task in words.</li><li><strong>Few-shot</strong> — include a handful of input→output examples in the prompt; the model infers the pattern and continues it.</li></ul><p>Why does it work? Pretraining on web text exposes the model to countless implicit 'tasks', so at inference it recognizes the format and plays along. In practice the prompt's wording, structure, role framing and delimiters materially change behavior — prompt design is the cheapest, fastest way to adapt a model and the foundation of the agentic patterns in later lectures.</p>",
          bodyZh: "<p>预训练好的 LLM 可以仅通过输入来引导,无需更新权重 —— 这就是<strong>上下文学习(in-context learning)</strong>:</p><ul><li><strong>零样本(zero-shot)</strong> —— 直接用文字描述任务。</li><li><strong>少样本(few-shot)</strong> —— 在提示里放几个「输入→输出」示例;模型推断出模式并照着续写。</li></ul><p>为何有效?在网页文本上的预训练让模型见过无数隐式「任务」,因此推理时它能识别格式并配合。实践中,提示的措辞、结构、角色设定与分隔符都会显著改变行为 —— 提示设计是最便宜、最快的模型适配方式,也是后续智能体范式的基础。</p>",
        },
        {
          name: "Chain-of-thought & self-consistency", nameZh: "思维链与自一致性",
          body: "<p><strong>Chain-of-thought (CoT)</strong> prompting asks the model to 'think step by step', emitting intermediate reasoning before the final answer. By spending more tokens — and thus more computation — on the hard part, accuracy on math and multi-step problems improves sharply, often just from adding the phrase to the prompt.</p><p><strong>Self-consistency</strong> goes further: sample <em>many</em> independent CoT paths and take a <strong>majority vote</strong> over their final answers. Reasoning chains that arrive at the same answer by different routes are more likely correct, so the vote denoises individual mistakes. It is a simple, powerful test-time boost — and a direct conceptual ancestor of the reasoning models in Lecture 6.</p>",
          bodyZh: "<p><strong>思维链(CoT)</strong>提示让模型「一步步思考」,在给出最终答案前先输出中间推理。把更多词元 —— 也就是更多计算 —— 花在难点上,数学与多步问题的准确率会显著提升,常常只需在提示里加上这句话即可。</p><p><strong>自一致性(self-consistency)</strong>更进一步:采样<em>多条</em>相互独立的思维链,再对它们的最终答案做<strong>多数投票</strong>。通过不同路径得到同一答案的推理链更可能正确,投票因此能消除个别错误。这是一个简单而强大的测试期增益 —— 也是第 6 讲推理模型在概念上的直接前身。</p>",
        },
      ],
      takeaways: [
        "Modern LLMs are decoder-only Transformers; capabilities emerge with scale.",
        "MoE decouples total from active parameters — huge capacity at small per-token compute.",
        "Temperature, top-k and top-p trade off determinism vs. diversity at decode time.",
        "Chain-of-thought + self-consistency buy accuracy by spending more test-time compute.",
      ],
      takeawaysZh: [
        "现代 LLM 是仅解码器 Transformer;能力随规模涌现。",
        "MoE 把总参数与激活参数解耦 —— 以小算力获得大容量。",
        "温度、top-k、top-p 在解码时权衡确定性与多样性。",
        "思维链 + 自一致性用更多测试期算力换取准确率。",
      ],
      refs: [
        { t: "Language Models are Few-Shot Learners — GPT-3 (Brown et al., 2020)", u: "https://arxiv.org/abs/2005.14165" },
        { t: "Chain-of-Thought Prompting (Wei et al., 2022)", u: "https://arxiv.org/abs/2201.11903" },
        { t: "Self-Consistency Improves CoT Reasoning (Wang et al., 2022)", u: "https://arxiv.org/abs/2203.11171" },
        { t: "Mixtral of Experts (Jiang et al., 2024)", u: "https://arxiv.org/abs/2401.04088" },
      ],
    },

    /* ===================== LECTURE 4 ===================== */
    {
      id: 4, num: "04", slug: "llm-training",
      title: "LLM Training", titleZh: "大模型训练",
      date: "Oct 17, 2025", duration: "1:47:27", videoId: "VlA_jt_3Qc4", accent: "emerald",
      tagline: "Pretrain, compress, and adapt — efficiently.",
      taglineZh: "预训练、压缩、适配 —— 都要高效。",
      overview: "How are these models actually built and then specialized? We cover large-scale <strong>pretraining</strong> and scaling laws, the systems tricks that make it fit (mixed precision, parallelism, ZeRO, FlashAttention), <strong>quantization</strong> for cheap inference, and parameter-efficient adaptation via <strong>supervised fine-tuning</strong> and <strong>LoRA</strong>.",
      overviewZh: "这些模型究竟如何被训练并专门化?本讲涵盖大规模<strong>预训练</strong>与扩展定律、让训练「装得下」的系统技巧(混合精度、并行、ZeRO、FlashAttention)、用于低成本推理的<strong>量化</strong>,以及通过<strong>有监督微调(SFT)</strong>与 <strong>LoRA</strong> 的参数高效适配。",
      topics: [
        {
          name: "Pretraining", nameZh: "预训练",
          body: "<p><strong>Pretraining</strong> optimizes the next-token cross-entropy over a massive, diverse corpus (web, code, books). The objective is simple; the engineering is not. Two ideas dominate:</p><ul><li><strong>Scaling laws</strong> predict loss from compute. The <em>Chinchilla</em> result showed most large models were badly under-trained: for a fixed compute budget, parameters and data should grow together — roughly <strong>20 training tokens per parameter</strong> — for compute-optimal results.</li><li><strong>Data quality</strong> — deduplication, filtering and mixture weighting often matter more than sheer quantity.</li></ul><p>The output is a <strong>base model</strong>: broadly knowledgeable but not yet good at following instructions or being safe — that is what the rest of the lecture, and Lecture 5, address.</p>",
          bodyZh: "<p><strong>预训练</strong>在海量多样语料(网页、代码、书籍)上优化下一词的交叉熵。目标简单,工程不简单。两点最关键:</p><ul><li><strong>扩展定律</strong>可由算力预测损失。<em>Chinchilla</em> 的结论是:多数大模型其实严重「训练不足」 —— 在固定算力预算下,参数与数据应同步增长,大约<strong>每个参数配 20 个训练词元</strong>,才是算力最优。</li><li><strong>数据质量</strong> —— 去重、过滤与混合配比,往往比单纯堆数量更重要。</li></ul><p>产物是一个<strong>基座模型(base model)</strong>:知识广博,但尚不擅长遵循指令、也未必安全 —— 这正是本讲其余部分与第 5 讲要解决的。</p>",
        },
        {
          name: "Hardware & throughput optimization", nameZh: "硬件与吞吐优化",
          body: "<p>Training frontier models is fundamentally a systems problem. The core levers:</p><ul><li><strong>Mixed precision</strong> — compute in FP16/BF16 with an FP32 master copy of weights; roughly halves memory and speeds up matrix multiplies.</li><li><strong>FlashAttention</strong> — the IO-aware exact attention from Lecture 2 cuts both memory and time.</li><li><strong>Parallelism</strong> — <em>data</em> parallel (replicate, split the batch), <em>tensor</em> parallel (split one layer across GPUs), and <em>pipeline</em> parallel (split layers into stages), usually combined as '3-D parallelism'.</li><li><strong>ZeRO / sharding</strong> — partition optimizer states, gradients and parameters across devices so models far larger than one GPU can train.</li><li><strong>Gradient checkpointing</strong> — trade compute for memory by recomputing activations during the backward pass.</li></ul>",
          bodyZh: "<p>训练前沿模型本质上是系统工程问题。核心手段:</p><ul><li><strong>混合精度</strong> —— 用 FP16/BF16 计算,同时保留一份 FP32 的主权重;显存大致减半,矩阵乘法更快。</li><li><strong>FlashAttention</strong> —— 第 2 讲的感知 IO 的精确注意力,同时省显存与时间。</li><li><strong>并行</strong> —— <em>数据</em>并行(复制模型、切分批量)、<em>张量</em>并行(把一层切到多卡)、<em>流水线</em>并行(把层切成多个阶段),通常合用为「三维并行」。</li><li><strong>ZeRO / 分片</strong> —— 把优化器状态、梯度、参数分散到各设备,从而训练远大于单卡的模型。</li><li><strong>梯度检查点</strong> —— 反向传播时重算激活,用算力换显存。</li></ul>",
        },
        {
          name: "Quantization", nameZh: "量化",
          body: "<p><strong>Quantization</strong> stores weights (and sometimes activations) in low precision — INT8 or INT4 — to shrink memory and speed up inference. A value maps through a scale (and optional zero-point):</p>\\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right), \\qquad \\hat{x} = s\\, x_q. \\]<ul><li><strong>Post-training quantization (PTQ)</strong> — quantize an already-trained model; <em>GPTQ</em> and <em>AWQ</em> are popular 4-bit methods that preserve quality by accounting for which weights matter most.</li><li><strong>Quantization-aware training (QAT)</strong> — simulate quantization during training for the best accuracy.</li><li><strong>QLoRA</strong> — fine-tune a 4-bit frozen base model through small LoRA adapters, making fine-tuning of large models feasible on a single GPU.</li></ul>",
          bodyZh: "<p><strong>量化</strong>把权重(有时还有激活)以低精度存储 —— INT8 或 INT4 —— 以缩小显存、加速推理。数值通过一个缩放因子(及可选零点)映射:</p>\\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right), \\qquad \\hat{x} = s\\, x_q. \\]<ul><li><strong>训练后量化(PTQ)</strong> —— 对已训练好的模型量化;<em>GPTQ</em> 与 <em>AWQ</em> 是流行的 4-bit 方法,通过识别哪些权重最重要来保持质量。</li><li><strong>量化感知训练(QAT)</strong> —— 训练时模拟量化,精度最好。</li><li><strong>QLoRA</strong> —— 在 4-bit 冻结的基座上,通过小的 LoRA 适配器微调,使大模型可在单卡上微调。</li></ul>",
        },
        {
          name: "Supervised fine-tuning (SFT)", nameZh: "有监督微调 SFT",
          body: "<p>A base model predicts plausible web text, not necessarily helpful answers. <strong>SFT</strong> turns it into an assistant by continuing training on curated <em>(instruction, response)</em> pairs with the same next-token loss — but computed only on the response tokens, so the model learns to <em>produce</em> good answers, not to model the prompt.</p><p>This is <strong>instruction tuning</strong>: it teaches format, task-following and tone, not fundamentally new knowledge (that came from pretraining). SFT is the first stage of post-training and the foundation that preference tuning (Lecture 5) builds on. Data quality and diversity matter far more than sheer quantity here.</p>",
          bodyZh: "<p>基座模型预测的是「像样的网页文本」,未必是「有用的回答」。<strong>SFT</strong> 通过在精心整理的<em>(指令, 回答)</em>对上继续训练,把它变成助手 —— 仍用下一词损失,但只在回答词元上计算,于是模型学会<em>产出</em>好答案,而非去拟合提示本身。</p><p>这就是<strong>指令微调</strong>:它教会格式、任务遵循与语气,而非根本上的新知识(那来自预训练)。SFT 是后训练的第一阶段,也是第 5 讲偏好微调的基础。这里数据的质量与多样性,远比数量重要。</p>",
        },
        {
          name: "LoRA & parameter-efficient fine-tuning", nameZh: "LoRA 与参数高效微调",
          body: "<p>Full fine-tuning updates all weights — costly in memory and storage, and you get a full model copy per task. <strong>LoRA</strong> (Low-Rank Adaptation) freezes the base weights \\(W_0\\) and learns a small low-rank update:</p>\\[ W = W_0 + \\Delta W, \\qquad \\Delta W = \\frac{\\alpha}{r} BA, \\quad B\\in\\mathbb{R}^{d\\times r},\\, A\\in\\mathbb{R}^{r\\times k},\\ r \\ll d. \\]<p>Only \\(A\\) and \\(B\\) train — often well under 1% of the parameters. The payoffs: tiny checkpoints, many swappable task adapters sharing one frozen base, and — combined with 4-bit quantization as <strong>QLoRA</strong> — fine-tuning of very large models on modest hardware. It is the default PEFT method today, exploiting the fact that task-specific updates are empirically low-rank.</p>",
          bodyZh: "<p>全量微调会更新所有权重 —— 显存与存储都昂贵,且每个任务都得保存一份完整模型。<strong>LoRA</strong>(低秩适配)冻结基座权重 \\(W_0\\),只学习一个小的低秩更新:</p>\\[ W = W_0 + \\Delta W, \\qquad \\Delta W = \\frac{\\alpha}{r} BA, \\quad B\\in\\mathbb{R}^{d\\times r},\\, A\\in\\mathbb{R}^{r\\times k},\\ r \\ll d. \\]<p>只训练 \\(A\\) 和 \\(B\\) —— 常常远不到参数的 1%。收益:极小的检查点、多个可热插拔的任务适配器共享同一冻结基座,并且 —— 与 4-bit 量化结合为 <strong>QLoRA</strong> —— 让超大模型也能在普通硬件上微调。它是当今默认的参数高效微调方法,所依据的经验事实是:任务特定的更新往往是低秩的。</p>",
        },
      ],
      takeaways: [
        "Chinchilla-optimal training scales data and parameters together (~20 tokens/param).",
        "Mixed precision, parallelism and ZeRO sharding are what make large-scale training fit.",
        "GPTQ/AWQ enable 4-bit inference; QLoRA enables 4-bit fine-tuning.",
        "LoRA learns a low-rank weight delta, training under 1% of parameters with swappable adapters.",
      ],
      takeawaysZh: [
        "Chinchilla 最优训练让数据与参数同步增长(约每参数 20 词元)。",
        "混合精度、并行与 ZeRO 分片,是大规模训练「装得下」的关键。",
        "GPTQ/AWQ 实现 4-bit 推理;QLoRA 实现 4-bit 微调。",
        "LoRA 学习低秩权重增量,只训练不到 1% 的参数,适配器可热插拔。",
      ],
      refs: [
        { t: "Training Compute-Optimal LLMs — Chinchilla (Hoffmann et al., 2022)", u: "https://arxiv.org/abs/2203.15556" },
        { t: "LoRA: Low-Rank Adaptation (Hu et al., 2021)", u: "https://arxiv.org/abs/2106.09685" },
        { t: "QLoRA: Efficient Finetuning of Quantized LLMs (Dettmers et al., 2023)", u: "https://arxiv.org/abs/2305.14314" },
      ],
    },

    /* ===================== LECTURE 5 ===================== */
    {
      id: 5, num: "05", slug: "llm-tuning",
      title: "LLM Tuning & Alignment", titleZh: "偏好微调与对齐",
      date: "Oct 31, 2025", duration: "1:47:42", videoId: "PmW_TMQ3l0I", accent: "amber",
      tagline: "Teaching models what humans actually prefer.",
      taglineZh: "教模型理解人类真正偏好什么。",
      overview: "SFT teaches a model to follow instructions; <strong>preference tuning</strong> teaches it to follow them <em>well</em> — helpful, harmless and honest. We cover why likelihood is the wrong objective, the RLHF pipeline, reward modeling from human comparisons, the PPO algorithm, and the elegant RL-free alternative, <strong>DPO</strong>.",
      overviewZh: "SFT 让模型学会遵循指令;<strong>偏好微调</strong>则让它执行得「好」 —— 有用、无害、诚实。本讲讲解为何「似然」是错误目标、RLHF 流程、从人类比较中学习奖励模型、PPO 算法,以及优雅的免强化学习替代方案 <strong>DPO</strong>。",
      topics: [
        {
          name: "Why preference tuning?", nameZh: "为什么需要偏好微调",
          body: "<p>Maximizing next-token likelihood is a poor proxy for 'a good answer'. Many continuations are valid, and the qualities we want — helpfulness, safety, honesty, tone — are hard to write down as labels. The key insight behind <strong>RLHF</strong> is that humans find it far easier to <em>compare</em> two responses than to score one in isolation.</p><p>So we collect <strong>preference pairs</strong> \\(y_w \\succ y_l\\) ('winner beats loser' for the same prompt) and tune the model toward what people prefer. This is the <strong>alignment</strong> step: it does not add knowledge, it shapes behavior toward human values and expectations.</p>",
          bodyZh: "<p>最大化下一词似然,并不能很好地代表「好答案」。许多续写都合理,而我们想要的品质 —— 有用、安全、诚实、语气 —— 很难写成标签。<strong>RLHF</strong> 的核心洞见是:相比孤立地给一个回答打分,人类<em>比较</em>两个回答要容易得多。</p><p>于是我们收集<strong>偏好对</strong> \\(y_w \\succ y_l\\)(同一提示下「胜者优于败者」),把模型向人们偏好的方向调。这就是<strong>对齐(alignment)</strong>步骤:它不增加知识,而是把行为塑造得符合人类价值与期待。</p>",
        },
        {
          name: "The RLHF pipeline", nameZh: "RLHF 流程",
          body: "<p>Classic RLHF has three stages:</p><ol><li><strong>SFT</strong> — start from an instruction-tuned model (Lecture 4).</li><li><strong>Reward model</strong> — train a model \\(r_\\phi\\) to predict which response a human prefers.</li><li><strong>RL optimization</strong> — fine-tune the policy with RL (PPO) to maximize that reward.</li></ol><p>A crucial detail: the RL objective includes a <strong>KL penalty</strong> that keeps the policy close to the original SFT model:</p>\\[ \\max_\\theta\\ \\mathbb{E}\\big[r_\\phi(x,y)\\big] - \\beta\\, \\mathrm{KL}\\big(\\pi_\\theta \\,\\|\\, \\pi_{\\text{ref}}\\big). \\]<p>Without this leash, the policy drifts into degenerate text that games the reward model — <strong>reward hacking</strong> — producing high 'reward' but nonsense.</p>",
          bodyZh: "<p>经典 RLHF 分三阶段:</p><ol><li><strong>SFT</strong> —— 从指令微调过的模型出发(第 4 讲)。</li><li><strong>奖励模型</strong> —— 训练 \\(r_\\phi\\) 预测人类更偏好哪个回答。</li><li><strong>RL 优化</strong> —— 用强化学习(PPO)微调策略以最大化该奖励。</li></ol><p>一个关键细节:RL 目标里含一个 <strong>KL 惩罚</strong>,把策略拴在原 SFT 模型附近:</p>\\[ \\max_\\theta\\ \\mathbb{E}\\big[r_\\phi(x,y)\\big] - \\beta\\, \\mathrm{KL}\\big(\\pi_\\theta \\,\\|\\, \\pi_{\\text{ref}}\\big). \\]<p>没有这根「拴绳」,策略会漂移到能糊弄奖励模型的退化文本 —— 即<strong>奖励黑客(reward hacking)</strong> —— 「奖励」很高,内容却是胡言乱语。</p>",
        },
        {
          name: "Reward modeling", nameZh: "奖励建模",
          body: "<p>From preference pairs we train a scalar reward using the <strong>Bradley–Terry</strong> model, which says the probability one response is preferred is a logistic function of the reward gap:</p>\\[ P(y_w \\succ y_l \\mid x) = \\sigma\\big(r_\\phi(x,y_w) - r_\\phi(x,y_l)\\big). \\]<p>The reward model is typically the LLM itself with a scalar output head, trained to maximize the likelihood of the observed human choices. Once trained it becomes an automated, differentiable proxy for 'human preference' that RL can optimize against at scale. Its weaknesses — being a learned, imperfect model that can be over-optimized — are exactly why the KL leash and, later, RL-free methods matter.</p>",
          bodyZh: "<p>由偏好对,我们用 <strong>Bradley–Terry</strong> 模型训练一个标量奖励 —— 它认为「一个回答被偏好的概率」是奖励差的 logistic 函数:</p>\\[ P(y_w \\succ y_l \\mid x) = \\sigma\\big(r_\\phi(x,y_w) - r_\\phi(x,y_l)\\big). \\]<p>奖励模型通常就是 LLM 本身加一个标量输出头,训练目标是最大化观察到的人类选择的似然。训练好后,它成为「人类偏好」的自动、可微代理,可供 RL 大规模优化。它的弱点 —— 终究是个会被过度优化的、不完美的学习模型 —— 正是为何需要 KL 拴绳,以及后来出现免 RL 方法的原因。</p>",
        },
        {
          name: "RL with PPO", nameZh: "用 PPO 做强化学习",
          body: "<p><strong>Proximal Policy Optimization (PPO)</strong> increases reward while preventing large, destabilizing updates, via a clipped objective:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon) A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\text{old}}(a_t|s_t)}. \\]<p>The ratio \\(\\rho_t\\) measures how much the policy changed; clipping it removes the incentive to move too far in one step. In RLHF the per-token reward is the reward-model score minus the KL penalty. PPO works well but is heavy: it juggles four models in memory (policy, reference, reward, value) and is famously sensitive to hyperparameters — which is what motivates the simpler alternative next.</p>",
          bodyZh: "<p><strong>近端策略优化(PPO)</strong>在提升奖励的同时,通过一个「裁剪」目标防止过大的、破坏稳定性的更新:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon) A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\text{old}}(a_t|s_t)}. \\]<p>比率 \\(\\rho_t\\) 衡量策略改变了多少;对它裁剪就消除了「一步迈太远」的动机。在 RLHF 中,每个词元的奖励是奖励模型分数减去 KL 惩罚。PPO 效果好但很「重」:显存里要同时维护四个模型(策略、参考、奖励、价值),且对超参数出了名地敏感 —— 这正是下面更简单方案的动机。</p>",
        },
        {
          name: "DPO: Direct Preference Optimization", nameZh: "DPO:直接偏好优化",
          body: "<p><strong>DPO</strong> skips the reward model and the RL loop entirely. A clever derivation shows the RLHF optimum can be rewritten so the reward is <em>implicit</em> in the policy itself, turning alignment into a simple classification loss directly on preference pairs:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\Big)\\Big]. \\]<p>It simply pushes up the (reference-normalized) probability of preferred responses and pushes down dispreferred ones. No reward model, no sampling, no RL instability — just supervised learning on pairs. This stability and simplicity made DPO and its variants (IPO, KTO, ORPO) enormously popular.</p>",
          bodyZh: "<p><strong>DPO</strong> 完全跳过奖励模型和 RL 循环。一个巧妙的推导表明:RLHF 的最优解可以重写为让奖励<em>隐含</em>在策略本身里,从而把对齐变成直接作用在偏好对上的简单分类损失:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\Big)\\Big]. \\]<p>它无非是抬高(相对参考归一化后的)被偏好回答的概率、压低被拒绝回答的概率。没有奖励模型、不需采样、没有 RL 的不稳定 —— 只是对偏好对做有监督学习。这种稳定与简洁,使 DPO 及其变体(IPO、KTO、ORPO)极为流行。</p>",
        },
      ],
      takeaways: [
        "Humans compare more reliably than they score — preferences are the supervision signal.",
        "RLHF = SFT → reward model (Bradley–Terry) → PPO with a KL leash to the reference.",
        "The KL penalty prevents reward hacking; PPO is powerful but heavy (four models).",
        "DPO turns alignment into a single classification loss — no reward model, no RL loop.",
      ],
      takeawaysZh: [
        "人类比较比打分更可靠 —— 偏好就是监督信号。",
        "RLHF = SFT → 奖励模型(Bradley–Terry)→ 带 KL 拴绳的 PPO。",
        "KL 惩罚防止奖励黑客;PPO 强大但很重(四个模型)。",
        "DPO 把对齐变成单一分类损失 —— 无奖励模型、无 RL 循环。",
      ],
      refs: [
        { t: "Training LMs to follow instructions with human feedback — InstructGPT (Ouyang et al., 2022)", u: "https://arxiv.org/abs/2203.02155" },
        { t: "Proximal Policy Optimization — PPO (Schulman et al., 2017)", u: "https://arxiv.org/abs/1707.06347" },
        { t: "Direct Preference Optimization — DPO (Rafailov et al., 2023)", u: "https://arxiv.org/abs/2305.18290" },
      ],
    },

    /* ===================== LECTURE 6 ===================== */
    {
      id: 6, num: "06", slug: "llm-reasoning",
      title: "LLM Reasoning", titleZh: "大模型推理",
      date: "Nov 7, 2025", duration: "1:47:10", videoId: "k5Fh-UgTuCo", accent: "rose",
      tagline: "Spending compute to think — RL with verifiable rewards.",
      taglineZh: "用算力去「思考」 —— 基于可验证奖励的强化学习。",
      overview: "The 2024–25 leap: models that <em>reason</em> by generating long internal chains of thought before answering. We cover reasoning models (o1, DeepSeek-R1), reinforcement learning from <strong>verifiable</strong> rewards, the <strong>GRPO</strong> algorithm that powered R1, and the new scaling axis — <strong>test-time compute</strong>.",
      overviewZh: "2024–25 年的飞跃:模型在作答前生成长串内部思维链来进行<em>推理</em>。本讲涵盖推理模型(o1、DeepSeek-R1)、基于<strong>可验证</strong>奖励的强化学习、驱动 R1 的 <strong>GRPO</strong> 算法,以及新的扩展维度 —— <strong>测试期算力</strong>。",
      topics: [
        {
          name: "Reasoning models", nameZh: "推理模型",
          body: "<p>A <strong>reasoning model</strong> is trained to produce a long, deliberate chain of thought — exploring approaches, checking intermediate results, and backtracking — before committing to a final answer. OpenAI's <strong>o1</strong> and <strong>DeepSeek-R1</strong> showed this unlocks large gains on hard math, coding and science benchmarks.</p><p>The crucial shift from Lecture 3's chain-of-thought prompting is that the reasoning is now a <em>trained behavior</em>, not just a clever prompt: through reinforcement learning the model learns <em>when</em> to think longer, how to verify its own steps, and when it has gone wrong. The visible 'thinking' trace is the policy doing its work.</p>",
          bodyZh: "<p><strong>推理模型</strong>被训练成在给出最终答案前,先产生一长串审慎的思维链 —— 探索思路、检查中间结果、必要时回溯。OpenAI 的 <strong>o1</strong> 与 <strong>DeepSeek-R1</strong> 表明这能在高难数学、编程与科学基准上带来巨大提升。</p><p>与第 3 讲思维链提示的关键区别在于:推理如今是一种<em>被训练出来的行为</em>,而非仅靠巧妙提示 —— 通过强化学习,模型学会<em>何时</em>该多想、如何验证自己的步骤、以及何时走错了路。那段可见的「思考」轨迹,正是策略在工作。</p>",
        },
        {
          name: "RL for reasoning", nameZh: "面向推理的强化学习",
          body: "<p>Alignment RL (Lecture 5) optimizes a <em>learned</em> reward model, which can be hacked. Reasoning RL can use <strong>verifiable rewards</strong> instead: for math, the answer is checkable; for code, the unit tests either pass or fail. This gives a clean, essentially unhackable signal — you cannot fool a calculator or a test suite.</p><p>A striking finding from <strong>DeepSeek-R1-Zero</strong>: applying RL with purely verifiable rewards to a base model — with no supervised reasoning examples at all — <em>elicited</em> sophisticated reasoning on its own: longer chains, self-verification, and emergent 'aha' moments where the model pauses and reconsiders. Reasoning was incentivized, not imitated.</p>",
          bodyZh: "<p>对齐 RL(第 5 讲)优化的是一个<em>学习得到的</em>奖励模型,它可能被「黑」。推理 RL 则可改用<strong>可验证奖励</strong>:数学题答案可核对,代码的单元测试要么通过要么失败。这给出一个干净、本质上无法作弊的信号 —— 你骗不过计算器或测试套件。</p><p><strong>DeepSeek-R1-Zero</strong> 的惊人发现:仅用可验证奖励对基座模型做 RL —— 完全没有任何有监督的推理示例 —— 竟<em>自发涌现</em>出成熟推理:更长的思维链、自我验证,以及模型停下来重新考虑的「顿悟(aha)」时刻。推理是被<em>激励</em>出来的,而非被模仿出来的。</p>",
        },
        {
          name: "GRPO", nameZh: "GRPO 算法",
          body: "<p><strong>Group Relative Policy Optimization (GRPO)</strong> is the algorithm behind DeepSeek-R1. It removes PPO's expensive value network. For each prompt it samples a <em>group</em> of \\(G\\) responses, scores them, and computes a <strong>relative advantage</strong> by normalizing within the group:</p>\\[ \\hat{A}_i = \\frac{r_i - \\text{mean}(r_1,\\dots,r_G)}{\\text{std}(r_1,\\dots,r_G)}. \\]<p>The idea is simple and effective: a response is 'good' if it beats the other samples for the <em>same</em> prompt, so the group average serves as the baseline that a critic would otherwise estimate. The policy is then updated with a PPO-style clipped objective using these group-relative advantages plus a KL term — cheaper, more stable, and a natural fit for sampling many solutions per problem.</p>",
          bodyZh: "<p><strong>组相对策略优化(GRPO)</strong>是 DeepSeek-R1 背后的算法。它去掉了 PPO 昂贵的价值网络。对每个提示,它采样一<em>组</em> \\(G\\) 个回答,打分,并通过组内归一化计算<strong>相对优势</strong>:</p>\\[ \\hat{A}_i = \\frac{r_i - \\text{mean}(r_1,\\dots,r_G)}{\\text{std}(r_1,\\dots,r_G)}. \\]<p>思路简单而有效:一个回答「好不好」,看它在<em>同一</em>提示下是否胜过其他样本,于是组内均值充当了原本要由评论家(critic)估计的基线。随后用 PPO 式的裁剪目标,配合这些组相对优势加一个 KL 项更新策略 —— 更省、更稳,且天然契合「每题采样多个解」的设定。</p>",
        },
        {
          name: "Train-time vs. test-time scaling", nameZh: "训练期 vs 测试期扩展",
          body: "<p>Two distinct axes now drive performance:</p><ul><li><strong>Train-time scaling</strong> — bigger models, more data, more pretraining compute (the classic scaling laws of Lecture 3).</li><li><strong>Test-time (inference) scaling</strong> — let the model spend more compute <em>per question</em>: longer chains of thought, sampling many candidate solutions, and verifying or voting among them.</li></ul><p>Reasoning models show a smooth, roughly log-linear trade: accuracy rises as you allow more 'thinking' tokens. This reframes intelligence partly as a <em>budget you allocate at inference time</em> — a cheap, deployable lever that does not require retraining — and it is one of the most active frontiers in the field.</p>",
          bodyZh: "<p>如今有两条不同的性能扩展轴:</p><ul><li><strong>训练期扩展</strong> —— 更大的模型、更多数据、更多预训练算力(第 3 讲的经典扩展定律)。</li><li><strong>测试期(推理期)扩展</strong> —— 让模型在<em>每道题上</em>花更多算力:更长的思维链、采样多个候选解,并在其中验证或投票。</li></ul><p>推理模型呈现平滑、近似对数线性的权衡:允许的「思考」词元越多,准确率越高。这把智能部分地重新定义为<em>你在推理时分配的预算</em> —— 一个无需重训、便宜可部署的旋钮 —— 也是当前最活跃的研究前沿之一。</p>",
        },
      ],
      takeaways: [
        "Reasoning models are trained (via RL) to generate long chains of thought before answering.",
        "Verifiable rewards (math/code) give a clean RL signal that resists reward hacking.",
        "GRPO drops PPO's critic and uses group-relative, normalized advantages.",
        "Test-time compute is a new scaling axis: more thinking tokens → higher accuracy.",
      ],
      takeawaysZh: [
        "推理模型通过 RL 被训练成在作答前生成长思维链。",
        "可验证奖励(数学/代码)给出干净、抗奖励黑客的 RL 信号。",
        "GRPO 去掉 PPO 的评论家,使用组内归一化的相对优势。",
        "测试期算力是新的扩展轴:思考词元越多 → 准确率越高。",
      ],
      refs: [
        { t: "DeepSeek-R1: Incentivizing Reasoning via RL (DeepSeek-AI, 2025)", u: "https://arxiv.org/abs/2501.12948" },
        { t: "DeepSeekMath — introduces GRPO (Shao et al., 2024)", u: "https://arxiv.org/abs/2402.03300" },
      ],
    },

    /* ===================== LECTURE 7 ===================== */
    {
      id: 7, num: "07", slug: "agentic-llms",
      title: "Agentic LLMs", titleZh: "智能体化大模型",
      date: "Nov 14, 2025", duration: "1:49:23", videoId: "h-7S6HNq0Vg", accent: "sky",
      tagline: "Giving models memory, tools, and the ability to act.",
      taglineZh: "赋予模型记忆、工具与行动能力。",
      overview: "LLMs become far more capable when connected to external knowledge and tools. This lecture covers <strong>retrieval-augmented generation (RAG)</strong> and its advanced variants, <strong>function/tool calling</strong>, the notion of an <strong>agent</strong>, and the <strong>ReAct</strong> framework that interleaves reasoning with actions.",
      overviewZh: "当大模型连接到外部知识与工具时,能力会大幅提升。本讲涵盖<strong>检索增强生成(RAG)</strong>及其进阶变体、<strong>函数/工具调用</strong>、<strong>智能体(agent)</strong>概念,以及把推理与行动交织起来的 <strong>ReAct</strong> 框架。",
      topics: [
        {
          name: "Retrieval-Augmented Generation (RAG)", nameZh: "检索增强生成 RAG",
          body: "<p>An LLM's knowledge is frozen at training time and it will confidently hallucinate. <strong>RAG</strong> grounds generation in retrieved documents, reducing hallucination and adding fresh or private knowledge with no retraining. The pipeline:</p><ol><li><strong>Index</strong> — split a corpus into chunks, embed each chunk into a vector, and store the vectors in a vector database.</li><li><strong>Retrieve</strong> — embed the user query and fetch the top-\\(k\\) most similar chunks (e.g. by cosine similarity).</li><li><strong>Generate</strong> — place those chunks in the prompt as context and let the model answer from them.</li></ol>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]<p>The model now cites evidence it can actually see, which is why RAG underpins most production question-answering systems.</p>",
          bodyZh: "<p>LLM 的知识在训练时就被「冻结」,而且会自信地胡编。<strong>RAG</strong> 把生成建立在检索到的文档之上,从而减少幻觉,并在无需重训的情况下注入新鲜或私有知识。流程:</p><ol><li><strong>建索引</strong> —— 把语料切成块,将每块嵌入为向量,存入向量数据库。</li><li><strong>检索</strong> —— 把用户查询嵌入,取回最相似的前 \\(k\\) 块(如按余弦相似度)。</li><li><strong>生成</strong> —— 把这些块作为上下文放入提示,让模型据此作答。</li></ol>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]<p>模型如今引用的是它真正看得到的证据 —— 这也是为何 RAG 支撑着绝大多数生产级问答系统。</p>",
        },
        {
          name: "Advanced RAG", nameZh: "进阶 RAG",
          body: "<p>Naive RAG often retrieves the wrong context, and a wrong context yields a wrong answer. Improvements span the whole pipeline:</p><ul><li><strong>Better chunking</strong> — semantic or overlapping chunks instead of arbitrary fixed windows that split ideas mid-sentence.</li><li><strong>Hybrid search</strong> — combine dense (embedding) retrieval with sparse keyword retrieval (BM25) to catch both meaning and exact terms.</li><li><strong>Reranking</strong> — a cross-encoder re-scores the top candidates with full query–document attention, sharply improving precision.</li><li><strong>Query transformation</strong> — rewriting, multi-query expansion, or <em>HyDE</em> (generate a hypothetical answer and embed <em>that</em> to retrieve).</li><li><strong>Agentic RAG</strong> — the model itself decides what and when to retrieve, iterating until it has enough evidence.</li></ul>",
          bodyZh: "<p>朴素 RAG 常检索到错误上下文,而错误上下文会导致错误答案。改进贯穿整条流程:</p><ul><li><strong>更好的切块</strong> —— 用语义或带重叠的切块,而非把句子拦腰截断的固定窗口。</li><li><strong>混合检索</strong> —— 把稠密(嵌入)检索与稀疏关键词检索(BM25)结合,既抓语义又抓精确词。</li><li><strong>重排序(reranking)</strong> —— 用交叉编码器对候选做完整的查询-文档注意力重新打分,显著提升精确率。</li><li><strong>查询变换</strong> —— 改写、多查询扩展,或 <em>HyDE</em>(先生成一个假设答案,再嵌入<em>它</em>去检索)。</li><li><strong>智能体式 RAG</strong> —— 由模型自己决定检索什么、何时检索,反复迭代直到证据充足。</li></ul>",
        },
        {
          name: "Function / tool calling", nameZh: "函数 / 工具调用",
          body: "<p><strong>Tool calling</strong> lets an LLM invoke external functions — web search, a calculator, code execution, database queries, any API. The model is given tool <em>schemas</em> (name, description, JSON argument shape); when appropriate it emits a structured call instead of prose; the runtime executes it and feeds the result back into the context for the model to continue.</p><p>This breaks the model out of its frozen weights and lets it <em>act on the world</em> and fetch ground truth — turning a text predictor into something that can do arithmetic exactly, look things up, and change state. It is the mechanism underneath every agent.</p>",
          bodyZh: "<p><strong>工具调用</strong>让 LLM 能调用外部函数 —— 网页搜索、计算器、代码执行、数据库查询,以及任意 API。模型被给定工具的<em>模式(schema)</em>(名称、描述、JSON 参数结构);在合适时,它不再输出散文,而是发出一个结构化调用;运行时执行它,并把结果送回上下文供模型继续。</p><p>这让模型挣脱了被冻结的权重,能够<em>作用于世界</em>并获取真实信息 —— 把一个文本预测器变成可以精确做算术、查资料、改变状态的东西。它是每一个智能体底层的机制。</p>",
        },
        {
          name: "Agents", nameZh: "智能体",
          body: "<p>An <strong>agent</strong> is an LLM placed in a loop: it observes, plans, calls a tool, observes the result, and repeats until a goal is met. Beyond a single tool call, agents add three ingredients — <strong>planning</strong> (decompose a task into steps), <strong>memory</strong> (a working scratchpad plus long-term stores), and <strong>control flow</strong> (deciding the next action conditioned on results).</p><p>Multi-agent systems coordinate several specialized agents (e.g. a planner, a coder, a critic). The promise is autonomy on complex, multi-step tasks; the central challenge is <em>reliability</em> — errors compound over long horizons, so a 95%-per-step agent can still fail most long tasks. Much of the engineering is about catching and recovering from those errors.</p>",
          bodyZh: "<p><strong>智能体(agent)</strong>是被放进循环里的 LLM:它观察、规划、调用工具、观察结果,如此反复,直到达成目标。在单次工具调用之上,智能体增加三种要素 —— <strong>规划</strong>(把任务拆成步骤)、<strong>记忆</strong>(工作便笺加长期存储)、<strong>控制流</strong>(根据结果决定下一步动作)。</p><p>多智能体系统则协调多个专职智能体(如规划者、编码者、评审者)。其前景是在复杂多步任务上实现自治;核心挑战是<em>可靠性</em> —— 误差会在长链条上累积,因此一个每步 95% 正确的智能体在长任务上仍可能大多失败。很多工程精力都花在捕捉并从这些错误中恢复上。</p>",
        },
        {
          name: "The ReAct framework", nameZh: "ReAct 框架",
          body: "<p><strong>ReAct</strong> (Reason + Act) interleaves three things in a single loop:</p><blockquote><strong>Thought:</strong> what should I do next, and why?<br><strong>Action:</strong> call a tool with some input.<br><strong>Observation:</strong> read the tool's result.</blockquote><p>By alternating reasoning and acting, the model can plan, take an action, <em>see</em> what happened, and adjust — combining chain-of-thought with real feedback so it is not reasoning in a vacuum. This grounding makes it far more robust than either pure reasoning (which can hallucinate facts) or pure acting (which cannot plan). ReAct is the canonical recipe behind many practical agent frameworks.</p>",
          bodyZh: "<p><strong>ReAct</strong>(Reason + Act,推理 + 行动)在一个循环里交替三件事:</p><blockquote><strong>思考(Thought):</strong> 下一步该做什么,为什么?<br><strong>行动(Action):</strong> 用某个输入调用工具。<br><strong>观察(Observation):</strong> 读取工具返回的结果。</blockquote><p>通过推理与行动交替,模型可以规划、采取行动、<em>看到</em>发生了什么、再做调整 —— 把思维链与真实反馈结合,使它不再「凭空推理」。这种「接地」让它远比纯推理(可能编造事实)或纯行动(无法规划)更稳健。ReAct 是许多实用智能体框架背后的经典范式。</p>",
        },
      ],
      takeaways: [
        "RAG = index → retrieve (vector similarity) → generate with retrieved context.",
        "Advanced RAG adds hybrid search, reranking and query transforms like HyDE.",
        "Tool calling lets the model emit structured calls and consume their results.",
        "ReAct interleaves Thought → Action → Observation, grounding reasoning in feedback.",
      ],
      takeawaysZh: [
        "RAG = 建索引 → 检索(向量相似度)→ 带检索上下文生成。",
        "进阶 RAG 加入混合检索、重排序与 HyDE 等查询变换。",
        "工具调用让模型发出结构化调用并消费其结果。",
        "ReAct 交替「思考 → 行动 → 观察」,让推理建立在反馈之上。",
      ],
      refs: [
        { t: "Retrieval-Augmented Generation — RAG (Lewis et al., 2020)", u: "https://arxiv.org/abs/2005.11401" },
        { t: "ReAct: Synergizing Reasoning and Acting (Yao et al., 2022)", u: "https://arxiv.org/abs/2210.03629" },
      ],
    },

    /* ===================== LECTURE 8 ===================== */
    {
      id: 8, num: "08", slug: "llm-evaluation",
      title: "LLM Evaluation", titleZh: "大模型评测",
      date: "Nov 21, 2025", duration: "1:49:25", videoId: "8fNP4N46RRo", accent: "teal",
      tagline: "How do you measure an open-ended generator?",
      taglineZh: "如何衡量一个开放式生成器?",
      overview: "Evaluating generative models is genuinely hard — there is rarely one right answer. This lecture surveys the evaluation landscape, focuses on the increasingly common <strong>LLM-as-a-judge</strong> paradigm, and is honest about its <strong>biases and pitfalls</strong> and the best practices that mitigate them.",
      overviewZh: "评测生成式模型本身就很难 —— 往往没有唯一正确答案。本讲梳理评测全景,重点讲解日益常见的 <strong>LLM-as-a-judge</strong>(用大模型当裁判)范式,并坦诚剖析其<strong>偏差与陷阱</strong>,以及缓解它们的最佳实践。",
      topics: [
        {
          name: "The evaluation landscape", nameZh: "评测全景",
          body: "<p>Evaluation methods trade off cost, scalability and fidelity to what we actually care about:</p><ul><li><strong>Automatic metrics</strong> — BLEU/ROUGE (n-gram overlap), perplexity, exact-match accuracy. Cheap and reproducible, but weak proxies for open-ended quality: a great answer phrased differently scores poorly.</li><li><strong>Benchmarks</strong> — MMLU (knowledge), GSM8K/MATH (reasoning), HumanEval (code), HELM (holistic). The danger is <em>contamination</em>: if test data leaked into pretraining, scores are inflated.</li><li><strong>Human evaluation</strong> — the gold standard for quality (e.g. Chatbot Arena's pairwise voting), but slow, costly and hard to scale.</li><li><strong>LLM-as-a-judge</strong> — use a strong LLM to approximate human judgment at scale.</li></ul>",
          bodyZh: "<p>各评测方法在成本、可扩展性,以及对「我们真正在意之物」的还原度之间权衡:</p><ul><li><strong>自动指标</strong> —— BLEU/ROUGE(n-gram 重叠)、困惑度、精确匹配准确率。便宜可复现,但对开放式质量是弱代理:同一个好答案换种说法就得分很低。</li><li><strong>基准测试</strong> —— MMLU(知识)、GSM8K/MATH(推理)、HumanEval(代码)、HELM(综合)。危险在于<em>数据污染</em>:若测试数据泄漏进了预训练,分数就虚高。</li><li><strong>人工评测</strong> —— 质量的黄金标准(如 Chatbot Arena 的成对投票),但慢、贵、难规模化。</li><li><strong>LLM-as-a-judge</strong> —— 用强大的 LLM 大规模近似人类判断。</li></ul>",
        },
        {
          name: "LLM-as-a-judge", nameZh: "以大模型为裁判",
          body: "<p><strong>LLM-as-a-judge</strong> prompts a capable model to score or compare responses, approximating human preference cheaply and quickly. Two common modes:</p><ul><li><strong>Pairwise comparison</strong> — 'which response is better, A or B?' This is the most reliable mode, mirroring how humans actually evaluate.</li><li><strong>Pointwise scoring</strong> — rate a single response against a rubric (say 1–10). More convenient, but harder to calibrate consistently.</li></ul><p>It correlates surprisingly well with human judgments (often 80%+ agreement) and scales to thousands of examples in minutes — which is why it has become the workhorse for ranking models, validating RAG and agent systems, and even providing reward signals. But that convenience hides systematic biases.</p>",
          bodyZh: "<p><strong>LLM-as-a-judge</strong> 让一个能力强的模型去给回答打分或比较,从而便宜又快速地近似人类偏好。两种常见模式:</p><ul><li><strong>成对比较</strong> —— 「A 和 B 哪个更好?」这是最可靠的模式,贴合人类真实的评判方式。</li><li><strong>逐条打分</strong> —— 按评分标准给单个回答打分(如 1–10)。更方便,但更难保持一致校准。</li></ul><p>它与人类判断的相关性出人意料地高(常达 80%+ 一致),并能在几分钟内扩展到上千条样本 —— 因此成为排名模型、验证 RAG 与智能体系统、乃至提供奖励信号的主力。但这份便利掩盖着系统性偏差。</p>",
        },
        {
          name: "Biases & pitfalls", nameZh: "偏差与陷阱",
          body: "<p>LLM judges have systematic biases you must control for, or you will ship a confidently misleading leaderboard:</p><ul><li><strong>Position bias</strong> — favoring whichever option came first (or last), regardless of content.</li><li><strong>Verbosity bias</strong> — preferring longer, more elaborate answers even when a concise one is better.</li><li><strong>Self-enhancement bias</strong> — rating outputs from its own model family more highly.</li><li><strong>Style over substance / sycophancy</strong> — rewarding confident, well-formatted, agreeable answers that are actually wrong.</li></ul><p>Each of these can flip a verdict, so a judge that looks accurate on average can be quietly wrong in systematic ways.</p>",
          bodyZh: "<p>LLM 裁判带有系统性偏差,必须加以控制,否则你会上线一个「自信地误导人」的排行榜:</p><ul><li><strong>位置偏差</strong> —— 偏向排在前面(或后面)的选项,与内容无关。</li><li><strong>冗长偏差</strong> —— 偏好更长、更繁复的答案,哪怕简洁的更好。</li><li><strong>自我增强偏差</strong> —— 给同一模型家族的输出打更高分。</li><li><strong>重风格轻实质 / 谄媚</strong> —— 奖励那些自信、格式漂亮、迎合却其实错误的答案。</li></ul><p>每一种都可能颠倒判定,因此一个「平均看起来准确」的裁判,可能在系统性方向上悄悄出错。</p>",
        },
        {
          name: "Best practices", nameZh: "最佳实践",
          body: "<p>Mitigations that make LLM-as-a-judge trustworthy:</p><ul><li><strong>Randomize and swap positions</strong>, then average both orderings, to cancel position bias.</li><li><strong>Clear rubrics and reference answers</strong> to anchor scoring to something concrete.</li><li><strong>Chain-of-thought judging</strong> — ask the judge to reason before giving a verdict, which improves reliability.</li><li><strong>Calibrate against humans</strong> on a sample and report the agreement rate, so you know how much to trust it.</li><li><strong>Prefer pairwise over absolute scores</strong>, and ensemble multiple judges for high-stakes decisions.</li></ul><p>Used carefully, automated evaluation closes the loop on the whole LLM development cycle — letting you iterate on prompts, models and pipelines quickly without waiting on human raters.</p>",
          bodyZh: "<p>让 LLM-as-a-judge 可信的缓解手段:</p><ul><li><strong>随机化并交换位置</strong>,再对两种顺序取平均,以抵消位置偏差。</li><li><strong>清晰的评分标准与参考答案</strong>,把打分锚定到具体的东西上。</li><li><strong>思维链评判</strong> —— 让裁判先推理再下结论,可提升可靠性。</li><li><strong>用样本对人类校准</strong>,并报告一致率,从而知道该多信任它。</li><li><strong>优先成对比较而非绝对打分</strong>,高风险决策时用多个裁判做集成。</li></ul><p>谨慎使用时,自动评测能为整个 LLM 开发周期闭环 —— 让你无需等待人工评分,就能快速迭代提示、模型与流程。</p>",
        },
      ],
      takeaways: [
        "No single metric captures open-ended quality — combine automatic, benchmark and human signals.",
        "LLM-as-a-judge scales human-like evaluation cheaply, especially in pairwise mode.",
        "Watch for position, verbosity and self-enhancement biases.",
        "Swap positions, use rubrics and CoT, and calibrate judges against humans.",
      ],
      takeawaysZh: [
        "没有单一指标能刻画开放式质量 —— 要结合自动、基准与人工信号。",
        "LLM-as-a-judge 便宜地扩展了类人评测,成对模式尤佳。",
        "警惕位置偏差、冗长偏差与自我增强偏差。",
        "交换位置、使用评分标准与思维链,并用人类校准裁判。",
      ],
      refs: [
        { t: "Judging LLM-as-a-Judge with MT-Bench & Chatbot Arena (Zheng et al., 2023)", u: "https://arxiv.org/abs/2306.05685" },
        { t: "HELM: Holistic Evaluation of Language Models (Liang et al., 2022)", u: "https://arxiv.org/abs/2211.09110" },
      ],
    },

    /* ===================== LECTURE 9 ===================== */
    {
      id: 9, num: "09", slug: "current-trends",
      title: "Recap & Current Trends", titleZh: "回顾与前沿趋势",
      date: "Dec 5, 2025", duration: "1:51:31", videoId: "Q86qzJ1K1Ss", accent: "fuchsia",
      tagline: "Where we've been, and where the field is heading.",
      taglineZh: "我们走过的路,以及这个领域的去向。",
      overview: "The capstone ties the course together — from attention to agents — and looks ahead to the trends shaping the next generation of models: multimodality, ever-longer context, efficiency, agentic systems and the open questions that remain.",
      overviewZh: "收官之讲串起整门课 —— 从注意力到智能体 —— 并展望塑造下一代模型的趋势:多模态、更长上下文、效率、智能体系统,以及仍待解答的开放问题。",
      topics: [
        {
          name: "Course recap", nameZh: "课程回顾",
          body: "<p>The arc of the course composes into a full stack. <strong>Attention</strong> replaced recurrence (L1); engineering made it efficient and position-aware (L2); <strong>scale</strong> plus sparsity plus prompting created LLMs (L3); we learned to <strong>train</strong>, compress and adapt them (L4); to <strong>align</strong> them to human preference (L5); to make them <strong>reason</strong> with RL (L6); to make them <strong>act</strong> with tools and retrieval (L7); and to <strong>evaluate</strong> all of it (L8).</p><p>Read top to bottom, it is the recipe for a modern AI system: a Transformer, scaled and made efficient, pretrained then aligned, taught to reason and to use tools, and measured rigorously at every step.</p>",
          bodyZh: "<p>整门课的脉络汇成一整套技术栈。<strong>注意力</strong>取代了循环(L1);工程让它高效且懂位置(L2);<strong>规模</strong>加稀疏化加提示造就了 LLM(L3);我们学会<strong>训练</strong>、压缩并适配它们(L4);把它们<strong>对齐</strong>到人类偏好(L5);用 RL 让它们<strong>推理</strong>(L6);用工具与检索让它们<strong>行动</strong>(L7);并对这一切进行<strong>评测</strong>(L8)。</p><p>自上而下读下来,这就是一套现代 AI 系统的配方:一个 Transformer,经过扩展与提效,先预训练再对齐,被教会推理与使用工具,并在每一步被严格度量。</p>",
        },
        {
          name: "Trending topics", nameZh: "前沿话题",
          body: "<p>The frontier as of late 2025:</p><ul><li><strong>Multimodality</strong> — unified models over text, images, audio and video.</li><li><strong>Test-time compute & reasoning</strong> — the o1/R1 paradigm scaling further, with smarter search and verification.</li><li><strong>Agents at scale</strong> — reliable, long-horizon, tool-using systems that can actually complete multi-step work.</li><li><strong>Efficiency</strong> — MoE, distillation, quantization, speculative decoding, and new architectures (state-space models like Mamba, linear attention) challenging the quadratic core.</li><li><strong>Long context</strong> — million-token windows and external memory architectures.</li><li><strong>Safety & alignment</strong> — interpretability, robustness, and oversight that scales with capability.</li></ul>",
          bodyZh: "<p>截至 2025 年底的前沿:</p><ul><li><strong>多模态</strong> —— 统一处理文本、图像、音频与视频的模型。</li><li><strong>测试期算力与推理</strong> —— o1/R1 范式进一步扩展,配合更聪明的搜索与验证。</li><li><strong>规模化智能体</strong> —— 可靠、长链条、会用工具、能真正完成多步工作的系统。</li><li><strong>效率</strong> —— MoE、蒸馏、量化、投机解码,以及挑战二次方核心的新架构(如 Mamba 等状态空间模型、线性注意力)。</li><li><strong>长上下文</strong> —— 百万词元窗口与外部记忆架构。</li><li><strong>安全与对齐</strong> —— 可解释性、鲁棒性,以及随能力一同扩展的监督手段。</li></ul>",
        },
        {
          name: "Where to go next", nameZh: "继续前进的方向",
          body: "<p>The half-life of 'current' in this field is short, but the foundations from this course are durable — attention, scaling, alignment and evaluation will still be the vocabulary of whatever comes next. The best way to consolidate them is to <em>build</em>: fine-tune a small model with LoRA, stand up a RAG pipeline, implement attention from scratch, or reproduce a DPO or GRPO run.</p><p>Pair this site's recordings with the official <strong>cheatsheet</strong> and the <em>Super Study Guide</em>, then follow new papers as they land. You now have the map; the territory keeps growing, but you can read it.</p>",
          bodyZh: "<p>这个领域里「前沿」的半衰期很短,但本课程的基础是持久的 —— 注意力、扩展、对齐与评测,仍将是后来一切的通用词汇。巩固它们最好的方式是去<em>动手做</em>:用 LoRA 微调一个小模型、搭一条 RAG 流程、从零实现注意力,或复现一次 DPO 或 GRPO 训练。</p><p>把本站的录像与官方<strong>速查表</strong>及《Super Study Guide》搭配使用,再持续跟读新论文。你现在已经有了地图;疆域仍在扩张,但你已能读懂它。</p>",
        },
      ],
      takeaways: [
        "The course composes into a stack: attention → efficiency → LLMs → training → alignment → reasoning → agents → evaluation.",
        "Frontier themes: multimodality, test-time compute, reliable agents, efficiency and long context.",
        "Architectures beyond quadratic attention (SSMs, linear attention) are rising.",
        "The best way to consolidate the material is to build — fine-tune, retrieve, and reproduce.",
      ],
      takeawaysZh: [
        "整门课汇成一套栈:注意力 → 效率 → LLM → 训练 → 对齐 → 推理 → 智能体 → 评测。",
        "前沿主题:多模态、测试期算力、可靠智能体、效率与长上下文。",
        "超越二次方注意力的架构(状态空间模型、线性注意力)正在兴起。",
        "巩固知识的最好方式是动手做 —— 微调、检索、复现。",
      ],
      refs: [
        { t: "A Survey of Large Language Models (Zhao et al., 2023)", u: "https://arxiv.org/abs/2303.18223" },
        { t: "CME 295 — official VIP cheatsheet", u: "https://cme295.stanford.edu/cheatsheet/" },
      ],
    },
  ],

  milestones: [
    { after: 4, label: "Midterm Exam", labelZh: "期中考试", date: "Oct 24, 2025" },
    { after: 9, label: "Final Exam", labelZh: "期末考试", date: "Dec 10, 2025" },
  ],
};

if (typeof window !== "undefined") window.COURSE = COURSE;
