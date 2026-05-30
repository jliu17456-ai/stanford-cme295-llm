/* CME 295 · Transformers & Large Language Models — bilingual course content
   Generated from official slides + verbatim lecture transcripts via parallel
   per-lecture agents, then assembled. Math renders with MathJax (\( \), \[ \]). */

const COURSE = {
  "meta": {
    "code": "CME 295",
    "title": "Transformers & Large Language Models",
    "titleZh": "Transformer 与大语言模型",
    "school": "Stanford University",
    "term": "Autumn 2025",
    "instructors": [
      "Afshine Amidi",
      "Shervine Amidi"
    ],
    "schedule": "Fridays 3:30–5:20 pm · Thornton 110",
    "playlist": "https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy",
    "syllabus": "https://cme295.stanford.edu/syllabus/",
    "cheatsheet": "https://cme295.stanford.edu/cheatsheet/",
    "github": "https://github.com/afshinea/stanford-cme-295-transformers-large-language-models",
    "book": "https://superstudy.guide",
    "tagline": "From word vectors to reasoning agents — a complete tour of the architecture that powers modern AI.",
    "taglineZh": "从词向量到推理智能体 —— 完整走过驱动现代 AI 的核心架构。"
  },
  "outcomes": [
    {
      "icon": "M4 6h16M4 12h16M4 18h10",
      "title": "Read the architecture",
      "titleZh": "读懂架构",
      "text": "Explain every block of the Transformer — attention, FFN, residuals, normalization, positional encodings — and why each exists.",
      "textZh": "讲清 Transformer 的每个模块 —— 注意力、前馈网络、残差、归一化、位置编码 —— 以及它们为何存在。"
    },
    {
      "icon": "M13 10V3L4 14h7v7l9-11h-7z",
      "title": "Make models efficient",
      "titleZh": "让模型更高效",
      "text": "Apply MQA/GQA, RoPE, FlashAttention, mixture-of-experts and quantization to scale models in compute and memory.",
      "textZh": "运用 MQA/GQA、RoPE、FlashAttention、混合专家与量化,在算力和显存上扩展模型。"
    },
    {
      "icon": "M12 6v6l4 2",
      "title": "Train & align",
      "titleZh": "训练与对齐",
      "text": "Walk the full pipeline: pretraining, SFT, LoRA, reward modeling, RLHF, PPO and DPO.",
      "textZh": "走通完整流程:预训练、SFT、LoRA、奖励建模、RLHF、PPO 与 DPO。"
    },
    {
      "icon": "M9 12l2 2 4-4",
      "title": "Build applications",
      "titleZh": "构建应用",
      "text": "Design RAG pipelines, tool-calling agents and reasoning systems — and evaluate them rigorously with LLM-as-a-judge.",
      "textZh": "设计 RAG 流程、工具调用智能体与推理系统,并用 LLM-as-a-judge 严谨评测。"
    }
  ],
  "lectures": [
    {
      "id": 1,
      "num": "01",
      "slug": "transformer",
      "title": "The Transformer",
      "titleZh": "Transformer 架构",
      "date": "Sep 26, 2025",
      "duration": "1:41:58",
      "videoId": "Ub3GoFaUcds",
      "accent": "indigo",
      "dateZh": "2025年9月26日",
      "tagline": "From tokens to attention: building the Transformer the way it was taught.",
      "taglineZh": "从词元到注意力,按课堂讲授的顺序一步步搭出 Transformer。",
      "overview": "<p>Lecture 1 builds the Transformer bottom-up, exactly as Afshine and Shervine motivate it: start with what NLP tasks even are, ask how a model that <em>only understands numbers</em> can read text, and walk through tokenization, word embeddings (word2vec), RNNs and LSTMs. Each design dies of a concrete flaw — no context, vanishing gradients, sequential slowness — which sets up <strong>attention</strong> as the fix.</p><p>The payoff is the 2017 <em>Attention Is All You Need</em> architecture: query-key-value self-attention, multi-head attention, the encoder-decoder stack, positional encodings, and a full end-to-end English-to-French translation of one running example, <em>'A cute teddy bear is reading.'</em></p>",
      "overviewZh": "<p>第一讲完全按照 Afshine 与 Shervine 的动机思路、自底向上地搭建 Transformer:先弄清 NLP 任务到底是什么,再追问一个<em>只懂数字</em>的模型如何读懂文本,然后依次讲分词、词嵌入(word2vec)、循环网络与 LSTM。每一种设计都因一个具体缺陷而被淘汰 —— 没有上下文、梯度消失、串行太慢 —— 这正好引出<strong>注意力(attention)</strong>作为解药。</p><p>最终成果是 2017 年《Attention Is All You Need》的架构:查询-键-值自注意力、多头注意力、编码器-解码器堆叠、位置编码,并用贯穿全课的例句 <em>'A cute teddy bear is reading.'</em> 完整地做了一次英译法。</p>",
      "topics": [
        {
          "name": "What NLP tasks look like, and how we score them",
          "nameZh": "NLP 任务长什么样,又如何评分",
          "body": "<p><strong>NLP</strong> (natural language processing) is just computing things with text, and the instructor sorts every task into three buckets. <strong>Classification</strong>: text in, one label out — sentiment ('This teddy bear is SO CUTE!' &rarr; positive), intent detection ('I want to create an alarm for tomorrow' &rarr; create-alarm), language detection, topic modeling. <strong>Multi-classification</strong>: text in, several labels out — named-entity recognition (tag 'teddy bear' as an ENTITY), part-of-speech tagging, dependency/constituency parsing. <strong>Generation</strong>: text in, variable-length text out — machine translation, question answering, summarization, code or poems.</p><p>Scoring differs per bucket. Classification uses <code>accuracy</code>, <code>precision</code> (of predicted positives, how many were right), <code>recall</code> (of true positives, how many we caught) and their harmonic mean <code>F1</code>. Why bother beyond accuracy? With a 99%/1% class imbalance, a model that always predicts the majority looks great on accuracy yet is useless — precision and recall expose that. Translation is harder because many translations are valid, so people used reference-based metrics like <strong>BLEU</strong> and <strong>ROUGE</strong> (a running joke: 'bleu' is blue, 'rouge' is red in French) plus <strong>perplexity</strong>, which measures how 'surprised' the model is by its own output. BLEU/ROUGE higher is better; perplexity lower is better. References are expensive to label, which later motivates reference-free evaluation.</p>",
          "bodyZh": "<p><strong>NLP</strong>(自然语言处理)就是用文本来做计算,讲者把所有任务归入三个桶。<strong>分类</strong>:输入文本,输出一个标签 —— 情感('This teddy bear is SO CUTE!' &rarr; 正面)、意图识别('I want to create an alarm for tomorrow' &rarr; 创建闹钟)、语种检测、主题建模。<strong>多分类</strong>:输入文本,输出多个标签 —— 命名实体识别(把 'teddy bear' 标为一个实体 ENTITY)、词性标注、依存/成分句法分析。<strong>生成</strong>:输入文本,输出长度不定的文本 —— 机器翻译、问答、摘要、写代码或写诗。</p><p>评分方式因桶而异。分类用 <code>accuracy</code>(准确率)、<code>precision</code>(精确率:预测为正的里有多少真的对)、<code>recall</code>(召回率:真正例里抓到了多少),以及二者的调和平均 <code>F1</code>。为什么不只看准确率?当类别按 99%/1% 严重失衡时,一个永远预测多数类的模型准确率很漂亮却毫无用处 —— 精确率和召回率能揭穿它。翻译更难,因为同一句有多种正确译法,于是过去用基于参考译文的 <strong>BLEU</strong> 和 <strong>ROUGE</strong>(一个梗:法语里 'bleu' 是蓝、'rouge' 是红),再加 <strong>perplexity</strong>(困惑度),衡量模型对自己输出有多 '惊讶'。BLEU/ROUGE 越高越好,困惑度越低越好。参考译文标注昂贵,这也为后面的无参考评测埋下伏笔。</p>"
        },
        {
          "name": "Tokenization: cutting text into units a model can take",
          "nameZh": "分词:把文本切成模型能吃的单位",
          "body": "<p>Models understand numbers, not text, so step one is <strong>tokenization</strong> — cutting text into arbitrary units called <strong>tokens</strong>. Take the running sentence <em>'A cute teddy bear is reading.'</em> You can split it several ways, each with trade-offs.</p><ul><li><strong>Word-level:</strong> simple and interpretable, but 'bear' and 'bears', or 'run' and 'runs', become totally separate tokens whose embeddings you must somehow force to be similar. It also bloats the vocabulary and risks <strong>OOV</strong> (out-of-vocabulary): any word unseen at training time becomes an UNKNOWN token at inference.</li><li><strong>Subword-level</strong> (WordPiece, BPE): leverages shared roots — 'teddy'&rarr;'ted','##dy' and 'reading'&rarr;'read','##ing' — so 'bear'/'bears' share the 'bear' piece. Lower OOV risk; the cost is longer sequences.</li><li><strong>Character-level:</strong> robust to misspellings and casing, almost no OOV, but sequences get very long and the embedding of a lone letter like 'u' barely means anything.</li></ul><p>Why is a longer sequence a 'con'? The instructor gives a preview: model complexity grows with sequence length, so more tokens means slower training and inference. Practical vocabulary sizes are tens of thousands for a single language, and hundreds of thousands for multilingual or code-aware models.</p>",
          "bodyZh": "<p>模型懂的是数字而非文本,所以第一步是<strong>分词(tokenization)</strong> —— 把文本切成被称为<strong>词元(token)</strong>的任意单位。以贯穿全课的例句 <em>'A cute teddy bear is reading.'</em> 为例,可以有多种切法,各有取舍。</p><ul><li><strong>按词:</strong> 简单且可解释,但 'bear' 和 'bears'、'run' 和 'runs' 会变成完全不同的词元,你还得设法逼它们的嵌入相似。它还会让词表膨胀,并带来 <strong>OOV</strong>(未登录词,out-of-vocabulary)风险:训练时没见过的词在推理时只能标成 UNKNOWN(未知)。</li><li><strong>按子词</strong>(WordPiece、BPE):利用共享词根 —— 'teddy'&rarr;'ted','##dy','reading'&rarr;'read','##ing' —— 于是 'bear'/'bears' 共享 'bear' 片段。OOV 风险更低,代价是序列变长。</li><li><strong>按字符:</strong> 对拼写错误和大小写鲁棒,几乎没有 OOV,但序列会非常长,而像 'u' 这种单个字母的嵌入几乎没什么含义。</li></ul><p>序列变长为何算 '缺点'?讲者预告了答案:模型复杂度随序列长度增长,词元越多,训练和推理就越慢。实践中,单一语言的词表规模约为几万,多语言或含代码的模型则可达几十万。</p>"
        },
        {
          "name": "Word representation: one-hot, similarity, and word2vec",
          "nameZh": "词表示:独热编码、相似度与 word2vec",
          "body": "<p>Each token now needs a numeric representation. The naive choice is <strong>one-hot encoding</strong>: with a three-token vocabulary {soft, teddy bear, book} you get [1,0,0], [0,1,0], [0,0,1]. To compare tokens we use <strong>cosine similarity</strong> — essentially the angle between vectors: same direction means similar, orthogonal means independent, opposite means opposite. The fatal flaw: every one-hot vector is orthogonal to every other, so 'teddy bear' and 'soft' look just as unrelated as 'teddy bear' and 'book'. We want the opposite — related tokens close, unrelated tokens near zero.</p><p>The fix is to <strong>learn</strong> embeddings from data. <strong>Word2vec</strong> (2013) became famous for interpretable analogies — <em>king is to queen as Paris is to France (Berlin to Germany)</em>. It uses a <strong>proxy task</strong>: <strong>CBOW</strong> predicts a target word from its context, <strong>skip-gram</strong> does the reverse. We don't actually care about the prediction; we care that a model good at it must encode how language works. Walk-through: feed the one-hot of 'A' ([1,0,0,0,0,0]) through a tiny net with input size V, a hidden layer of size d (much smaller, e.g. 768), and output size V; softmax gives next-word probabilities like [0.2,0.4,0.1,0.1,0.1,0.1]; cross-entropy against the true next word drives backprop. After training, the learned hidden weights — the 'green units' — become each token's embedding.</p>",
          "bodyZh": "<p>现在每个词元需要一个数字表示。最朴素的选择是<strong>独热编码(one-hot)</strong>:词表为三个词元 {soft, teddy bear, book} 时,得到 [1,0,0]、[0,1,0]、[0,0,1]。比较词元用<strong>余弦相似度(cosine similarity)</strong> —— 本质是向量间的夹角:同向即相似,正交即独立,反向即相反。致命缺陷在于:每个独热向量都两两正交,于是 'teddy bear' 与 'soft' 看起来和 'teddy bear' 与 'book' 一样毫不相关。我们想要的恰恰相反 —— 相关的词靠近,无关的词接近零。</p><p>解决办法是从数据中<strong>学习</strong>嵌入。<strong>Word2vec</strong>(2013)因可解释的类比而出名 —— <em>king 之于 queen,如同 Paris 之于 France(Berlin 之于 Germany)</em>。它用一个<strong>代理任务(proxy task)</strong>:<strong>CBOW</strong> 用上下文预测目标词,<strong>skip-gram</strong> 反过来。我们其实并不在意预测本身,而在意:一个擅长此任务的模型必然编码了语言的规律。走一遍流程:把 'A' 的独热 [1,0,0,0,0,0] 送入一个小网络,输入维度 V,隐藏层维度 d(小得多,例如 768),输出维度 V;softmax 给出下一个词的概率如 [0.2,0.4,0.1,0.1,0.1,0.1];对真实下一个词做交叉熵,驱动反向传播。训练后,学到的隐藏层权重 —— 那些 '绿色单元' —— 就成了每个词元的嵌入。</p>"
        },
        {
          "name": "RNNs and LSTMs: order matters, but memory fades",
          "nameZh": "RNN 与 LSTM:顺序有了,记忆却在褪色",
          "body": "<p>Averaging word embeddings to represent a sentence throws away <em>order</em> and gives every token the same vector regardless of position. <strong>Recurrent Neural Networks</strong> (RNNs, from the 1980s) fix order by carrying a <strong>hidden state</strong> — also called the activation or context vector, noted \\(a\\) or \\(h\\) — and consuming one token at a time. A module reads the hidden state so far plus the current token and emits an output used to predict the next token, then the hidden state rolls forward:</p>\\[ a^{\\langle t \\rangle} = g\\left(W_{a} a^{\\langle t-1 \\rangle} + W_{x} x^{\\langle t \\rangle} + b\\right). \\]<p>This maps cleanly onto the three buckets: for classification take the <em>last</em> hidden state; for labeling take the token of interest's state; for generation encode the whole source into a context vector, then decode. <strong>LSTMs</strong> (1997) add a separate <strong>cell state</strong> \\(c\\) to better keep important information around.</p><p>But RNNs have serious cons. Meaning is crammed into one hidden state, so <strong>long-range dependencies</strong> are hard. Backpropagating through time multiplies many factors together; if they are below one the product <strong>vanishes</strong> to zero, if above one it <strong>explodes</strong> — the vanishing-gradient problem. And because step \\(t\\) needs step \\(t-1\\), computation is inherently sequential and slow.</p>",
          "bodyZh": "<p>用词嵌入取平均来表示句子,会丢掉<em>顺序</em>,而且无论位置如何每个词元都是同一个向量。<strong>循环神经网络</strong>(RNN,源自 1980 年代)通过携带一个<strong>隐藏状态</strong> —— 也叫激活值或上下文向量,记作 \\(a\\) 或 \\(h\\) —— 并一次处理一个词元来解决顺序问题。一个模块读入此前的隐藏状态加上当前词元,产生一个用于预测下一个词元的输出,然后隐藏状态向前滚动:</p>\\[ a^{\\langle t \\rangle} = g\\left(W_{a} a^{\\langle t-1 \\rangle} + W_{x} x^{\\langle t \\rangle} + b\\right). \\]<p>这与三个桶一一对应:分类取<em>最后</em>一个隐藏状态;标注取目标词元的状态;生成则把整段源文本编码成一个上下文向量,再解码。<strong>LSTM</strong>(1997)额外引入一个独立的<strong>细胞状态(cell state)</strong> \\(c\\),以更好地留住重要信息。</p><p>但 RNN 缺点严重。句意被塞进单个隐藏状态,因此<strong>长程依赖</strong>很难处理。沿时间反向传播会把许多因子连乘:小于 1 则乘积<strong>消失</strong>趋零,大于 1 则<strong>爆炸</strong> —— 这就是梯度消失问题。而且第 \\(t\\) 步依赖第 \\(t-1\\) 步,计算本质上是串行的,很慢。</p>"
        },
        {
          "name": "Attention and self-attention: a direct link to the past",
          "nameZh": "注意力与自注意力:与过去的直接连线",
          "body": "<p>To beat fading memory, why not give a prediction a <strong>direct link</strong> to relevant earlier tokens instead of routing everything through one hidden state? That is <strong>attention</strong>, introduced in 2014 (Bahdanau) for translation: when generating the next French word, it would be great to 'take a peek' at the right part of the English input. The 2017 Transformer pushes this further with <strong>self-attention</strong>, dropping recurrence entirely and letting every token connect to all others <em>at once</em>. Now the representation of 'teddy bear' is unique to its context — so 'bank' in 'river bank' versus 'robbing a bank' gets different vectors.</p><p>The vocabulary is <strong>query, key, value</strong> (Q, K, V). To express 'teddy bear' in terms of the rest, its <strong>query</strong> is compared against every token's <strong>key</strong> to score similarity; the scores weight the corresponding <strong>values</strong>, and we take their weighted average. In matrix form across the whole sequence:</p>\\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V. \\]<p>Q, K, V are not fixed — they come from <strong>learned projection matrices</strong>. Writing it as matrices is deliberate: GPUs love matrices, so the whole sequence is processed in parallel, the decisive edge over sequential RNNs.</p>",
          "bodyZh": "<p>为打败褪色的记忆,与其把一切都挤过单个隐藏状态,何不给预测一条通往相关历史词元的<strong>直接连线</strong>?这就是<strong>注意力(attention)</strong>,2014 年(Bahdanau)为翻译而提出:在生成下一个法语词时,能 '瞥一眼' 英语输入里对应的那一块就太好了。2017 年的 Transformer 把它推得更远,提出<strong>自注意力(self-attention)</strong>,彻底丢掉循环,让每个词元<em>一次性</em>与其他所有词元相连。于是 'teddy bear' 的表示因其上下文而独一无二 —— 'river bank'(河岸)与 'robbing a bank'(抢银行)里的 'bank' 会得到不同向量。</p><p>核心术语是<strong>查询、键、值</strong>(query, key, value,即 Q、K、V)。要用其余词元来表达 'teddy bear',就用它的<strong>查询</strong>与每个词元的<strong>键</strong>比较以打相似度分;分数给对应的<strong>值</strong>加权,再取加权平均。对整段序列写成矩阵形式:</p>\\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V. \\]<p>Q、K、V 并非固定 —— 它们来自<strong>可学习的投影矩阵</strong>。写成矩阵是有意为之:GPU 喜爱矩阵,整段序列得以并行处理,这正是相对串行 RNN 的决定性优势。</p>"
        },
        {
          "name": "The Transformer architecture: encoder, decoder, and the tricks",
          "nameZh": "Transformer 架构:编码器、解码器与那些技巧",
          "body": "<p>The 2017 architecture has two halves: the <strong>encoder</strong> (left) ingests the source language, the <strong>decoder</strong> (right) produces the target. The encoder runs <strong>self-attention</strong> so each input token is represented as a function of all the others, followed by a <strong>feed-forward network</strong> (FFN) that adds degrees of freedom; stack \\(N\\) such layers to get rich, context-aware embeddings.</p><p>The decoder uses attention three ways. Its <strong>masked self-attention</strong> is causal — when predicting a token it only looks at tokens translated so far, never to the right. Then <strong>cross-attention</strong> links the two halves: a class quiz asks whether the arrow from the decoder is query, key, or value — the answer is the <strong>query</strong> ('what input words matter for me?'), while <strong>keys and values come from the encoder</strong>. A final linear layer plus softmax turns the output into a probability distribution over the vocabulary.</p><p>Two tricks. <strong>Multi-head attention</strong>: run the QKV computation \\(h\\) times in parallel with different learned projections, like multiple filters in a convolution; gradient descent naturally makes the heads learn different views, then \\(W_O\\) projects the concatenation back to \\(d_{model}\\). <strong>Positional encoding</strong> (sinusoids, added element-wise) restores order, since direct links are otherwise permutation-blind. And <strong>label smoothing</strong> replaces a hard one-hot target with \\(1-\\epsilon\\) on the truth and \\(\\epsilon/(V-1)\\) elsewhere, fighting overconfidence ('what a great day / lecture / book' all fit) and improving BLEU.</p>",
          "bodyZh": "<p>2017 年的架构分两半:<strong>编码器(encoder)</strong>(左)吃进源语言,<strong>解码器(decoder)</strong>(右)产出目标语言。编码器先做<strong>自注意力</strong>,使每个输入词元都表示为其余词元的函数,再接一个<strong>前馈网络(FFN)</strong>增加自由度;堆叠 \\(N\\) 层这样的结构,就得到丰富的、含上下文的嵌入。</p><p>解码器以三种方式用注意力。它的<strong>带掩码自注意力</strong>是因果(causal)的 —— 预测某词元时只看已译出的词元,绝不看右侧。接着<strong>交叉注意力(cross-attention)</strong>把两半连起来:课堂小测问从解码器来的那个箭头是查询、键还是值 —— 答案是<strong>查询</strong>('哪些输入词对我重要?'),而<strong>键和值来自编码器</strong>。最后一个线性层加 softmax 把输出变成词表上的概率分布。</p><p>两个技巧。<strong>多头注意力</strong>:用不同的可学习投影把 QKV 计算并行做 \\(h\\) 次,像卷积里的多个滤波器;梯度下降会自然让各头学到不同视角,再由 \\(W_O\\) 把拼接结果投影回 \\(d_{model}\\)。<strong>位置编码</strong>(正弦函数,逐元素相加)恢复顺序,否则直接连线对排列是 '失明' 的。还有<strong>标签平滑(label smoothing)</strong>:把硬独热目标换成真值处 \\(1-\\epsilon\\)、其余处 \\(\\epsilon/(V-1)\\),对抗过度自信('what a great day / lecture / book' 都说得通),并提升 BLEU。</p>"
        },
        {
          "name": "End-to-end: translating 'A cute teddy bear is reading.'",
          "nameZh": "端到端:翻译 'A cute teddy bear is reading.'",
          "body": "<p>Shervine stitches everything together on the running example. <strong>Tokenize</strong> the sentence and wrap it with <code>[BOS]</code> and <code>[EOS]</code>. Each token's vector is its learned <strong>embedding</strong> plus a <strong>position embedding</strong> (the paper's sinusoids), added element-wise to get a <em>position-aware</em> embedding; stacking these gives a matrix of size \\(d_{model} \\times N\\).</p><p>In the encoder, project that matrix through \\(W_Q, W_K, W_V\\) to get Q, K, V. Each <em>row</em> of Q is one query; each <em>column</em> of \\(K^{\\top}\\) is one key; the product, after softmax per row, is a probability distribution of each query over the keys, and multiplying by V yields a <strong>weighted average of values</strong>. We divide by \\(\\sqrt{d_k}\\) because the dot product grows with dimension (the matmul forces \\(d_q = d_k\\)), so it must be rescaled. Multi-head produces \\(h\\) such matrices, concatenated by columns, then \\(W_O\\) maps back to \\(d_{model}\\). An FFN — here with a hidden layer <em>larger</em> than its input, unlike word2vec — adds capacity. Repeat for \\(N\\) encoders.</p><p>Decoding starts at <code>[BOS]</code>: causal self-attention, then cross-attention whose keys/values are the encoder output and whose queries come from the decoder, then FFN, repeated \\(N\\) times, then linear + softmax over the vocabulary (a vector like [0.001, ..., 0.4, ...]). The argmax becomes the next token, fed back in autoregressively: <em>'Un'</em> &rarr; <em>'ours en peluche'</em> &rarr; <em>'mignon'</em> &rarr; <em>'lit'</em>, stopping when <code>[EOS]</code> is generated — exactly how the original paper did machine translation.</p>",
          "bodyZh": "<p>Shervine 用贯穿全课的例句把一切串起来。先<strong>分词</strong>,并用 <code>[BOS]</code> 与 <code>[EOS]</code> 把句子包起来。每个词元的向量是它学到的<strong>嵌入</strong>加上一个<strong>位置嵌入</strong>(论文里的正弦函数),逐元素相加得到<em>含位置信息</em>的嵌入;把它们堆叠成一个 \\(d_{model} \\times N\\) 的矩阵。</p><p>在编码器中,把该矩阵经 \\(W_Q, W_K, W_V\\) 投影得到 Q、K、V。Q 的每一<em>行</em>是一个查询;\\(K^{\\top}\\) 的每一<em>列</em>是一个键;二者相乘后对每行做 softmax,就是每个查询在各键上的概率分布,再乘以 V 便得到<strong>值的加权平均</strong>。之所以除以 \\(\\sqrt{d_k}\\),是因为点积会随维度增大而变大(矩阵乘法强制 \\(d_q = d_k\\)),故须重新缩放。多头会产出 \\(h\\) 个这样的矩阵,按列拼接,再由 \\(W_O\\) 映射回 \\(d_{model}\\)。接着一个 FFN —— 这里隐藏层比输入<em>更大</em>,与 word2vec 相反 —— 增加容量。如此重复 \\(N\\) 个编码器。</p><p>解码从 <code>[BOS]</code> 开始:因果自注意力,然后交叉注意力(键/值来自编码器输出,查询来自解码器),再 FFN,重复 \\(N\\) 次,最后线性层 + 词表上的 softmax(一个形如 [0.001, ..., 0.4, ...] 的向量)。取最大概率项作为下一个词元,自回归地喂回去:<em>'Un'</em> &rarr; <em>'ours en peluche'</em> &rarr; <em>'mignon'</em> &rarr; <em>'lit'</em>,生成 <code>[EOS]</code> 时停止 —— 这正是原论文做机器翻译的方式。</p>"
        }
      ],
      "takeaways": [
        "NLP tasks fall into three buckets — classification, multi-classification, generation — each with its own metrics (accuracy/precision/recall/F1 for classification; BLEU/ROUGE/perplexity for generation).",
        "Tokenization trades off vocabulary size, OOV risk, and sequence length; subword (BPE, WordPiece) is the sweet spot, and complexity grows with sequence length.",
        "One-hot vectors are all mutually orthogonal; word2vec learns dense embeddings via a proxy task so similarity (cosine) becomes meaningful — but each word still gets only one context-free vector.",
        "RNNs/LSTMs add word order but suffer from vanishing gradients on long-range dependencies and are inherently sequential, hence slow.",
        "Self-attention is a content-based weighted average of values via query-key similarity, scaled by 1/√dₖ, expressed as matrices so GPUs can parallelize it.",
        "The Transformer = stacked encoder (self-attention + FFN) and decoder (masked self-attention + cross-attention + FFN), with positional encoding for order, multi-head attention for multiple views, and label smoothing as a training trick."
      ],
      "takeawaysZh": [
        "NLP 任务分三类 —— 分类、多分类、生成 —— 各有评测指标(分类用 accuracy/precision/recall/F1;生成用 BLEU/ROUGE/困惑度)。",
        "分词在词表大小、OOV 风险与序列长度之间权衡;子词(BPE、WordPiece)是折中之选,且复杂度随序列长度增长。",
        "独热向量两两正交;word2vec 通过代理任务学习稠密嵌入,使(余弦)相似度变得有意义 —— 但每个词仍只有一个与上下文无关的向量。",
        "RNN/LSTM 加入了词序,却在长程依赖上受梯度消失之苦,且本质串行、因而很慢。",
        "自注意力是借助查询-键相似度对值做基于内容的加权平均,用 1/√dₖ 缩放,并写成矩阵让 GPU 并行。",
        "Transformer = 堆叠的编码器(自注意力 + FFN)与解码器(带掩码自注意力 + 交叉注意力 + FFN),用位置编码表达顺序、用多头注意力获取多重视角、用标签平滑作为训练技巧。"
      ],
      "refs": [
        {
          "t": "Attention Is All You Need (Vaswani et al., 2017)",
          "u": "https://arxiv.org/abs/1706.03762",
          "tZh": "Transformer 原始论文(Attention Is All You Need, 2017)"
        },
        {
          "t": "Efficient Estimation of Word Representations in Vector Space — word2vec (Mikolov et al., 2013)",
          "u": "https://arxiv.org/abs/1301.3781",
          "tZh": "词向量 word2vec 论文(Efficient Estimation of Word Representations in Vector Space, 2013)"
        },
        {
          "t": "Neural Machine Translation by Jointly Learning to Align and Translate — attention (Bahdanau et al., 2014)",
          "u": "https://arxiv.org/abs/1409.0473",
          "tZh": "注意力机制原始论文(Neural Machine Translation by Jointly Learning to Align and Translate, 2014)"
        },
        {
          "t": "Long Short-Term Memory (Hochreiter & Schmidhuber, 1997)",
          "u": "https://www.bioinf.jku.at/publications/older/2604.pdf",
          "tZh": "LSTM 原始论文(Long Short-Term Memory, 1997)"
        },
        {
          "t": "Super Study Guide: Transformers & Large Language Models (Amidi & Amidi, 2024)",
          "u": "https://superstudy.guide",
          "tZh": "课程教材《Transformers 与大语言模型超级学习指南》(Super Study Guide, 2024)"
        },
        {
          "t": "The Illustrated Transformer (Jay Alammar)",
          "u": "https://jalammar.github.io/illustrated-transformer/",
          "tZh": "图解 Transformer(The Illustrated Transformer)"
        }
      ]
    },
    {
      "id": 2,
      "num": "02",
      "slug": "models-and-tricks",
      "title": "Transformer-based Models & Tricks",
      "titleZh": "Transformer 模型族与技巧",
      "date": "Oct 3, 2025",
      "duration": "1:47:19",
      "videoId": "yT84Y5zCnaA",
      "accent": "violet",
      "dateZh": "2025年10月3日",
      "tagline": "The same 2017 Transformer, retuned: positions, normalization, cheaper attention, and three task-shaped families.",
      "taglineZh": "同一个 2017 年 Transformer 的再调校:位置、归一化、更省的注意力,以及三种任务形态的家族。",
      "overview": "<p>The instructor opens by stressing a surprising fact: the 2017 Transformer is still the backbone of 2025 models — only a few components have quietly changed. This lecture walks through those components in the order they appear in the block. <strong>Afshine</strong> covers the engineering tricks: position embeddings (from learned/sinusoidal absolute positions, to relative biases like T5 and ALiBi, to <strong>RoPE</strong>), <strong>layer normalization</strong> (Post-Norm vs Pre-Norm, LayerNorm vs RMSNorm), and <strong>attention approximation</strong> (sliding-window/sparse attention, and sharing key/value heads via MQA and GQA to shrink the KV cache). <strong>Shervine</strong> then maps the model landscape — the three shapes (encoder-decoder like T5, encoder-only like BERT, decoder-only like GPT) — and does a detailed <strong>BERT deep dive</strong> with the recurring <em>this teddy bear is so cute</em> example, ending on distillation, DistilBERT and RoBERTa.</p>",
      "overviewZh": "<p>讲者开场就强调一个令人意外的事实:2017 年的 Transformer 至今仍是 2025 年各类模型的骨架 —— 只有少数几个组件悄悄变了。本讲按这些组件在模块中出现的顺序逐一讲解。<strong>Afshine</strong> 负责工程技巧:位置编码(从学习式 / 正弦式的绝对位置,到 T5、ALiBi 这类相对偏置,再到 <strong>RoPE</strong>)、<strong>层归一化</strong>(后置归一化与前置归一化、LayerNorm 与 RMSNorm),以及<strong>注意力近似</strong>(滑动窗口 / 稀疏注意力,以及通过 MQA、GQA 共享键 / 值头来缩小 KV 缓存)。随后 <strong>Shervine</strong> 梳理模型版图 —— 三种形态(编码-解码如 T5、仅编码器如 BERT、仅解码器如 GPT)—— 并用贯穿全课的「这只泰迪熊太可爱了(this teddy bear is so cute)」例子,对 <strong>BERT</strong> 做一次详细拆解,最后落到蒸馏、DistilBERT 与 RoBERTa。</p>",
      "topics": [
        {
          "name": "Why position must be injected",
          "nameZh": "为什么必须注入位置信息",
          "body": "<p>In an RNN, tokens are processed one at a time, so order is baked into the computation. In self-attention every token has a <em>direct link</em> to every other token in parallel, which buys speed but <em>loses</em> any sense of order. The instructor's first fix is the original-paper approach: give each position its own embedding and <strong>add</strong> it to the token embedding. For <em>a cute teddy bear is reading</em>, the vector at position 1 is the embedding of <code>a</code> plus the embedding of position 1.</p><p>These can be <strong>learned</strong> or <strong>fixed</strong> — the authors tried both. With the learned variant you allocate a placeholder learnable embedding for each slot (say positions 1 through 512) and let gradient descent tune them like any other weight. The instructor highlights two limitations: learned positions <em>overfit</em> to wherever things tend to appear in the training set, and you can only learn positions up to the longest sequence seen in training (e.g. 512). Anything longer at inference time was simply never learned, so the model cannot extrapolate. On the plus side, gradient descent does wonders, so they perform well in-distribution. This trade-off motivates the fixed sinusoidal scheme next.</p>",
          "bodyZh": "<p>在 RNN 中,词元是逐个处理的,顺序天然融入了计算。而在自注意力里,每个词元都与其他所有词元并行地建立<em>直接连接</em>,这换来了速度,却<em>丢失</em>了任何顺序感。讲者给出的第一个补救就是原始论文的做法:给每个位置一个专属嵌入,再把它<strong>加</strong>到词元嵌入上。对于「a cute teddy bear is reading」,位置 1 处的向量就是 <code>a</code> 的嵌入加上位置 1 的嵌入。</p><p>这些位置嵌入可以<strong>学习</strong>,也可以<strong>固定</strong> —— 作者两者都试过。学习式做法是为每个槽位(比如位置 1 到 512)预留一个可学习的占位嵌入,再像其他权重一样交给梯度下降去调。讲者特别点出两个局限:学习式位置会<em>过拟合</em>到训练集中事物常出现的位置;而且只能学到训练时见过的最长序列以内的位置(例如 512)。推理时一旦更长,就根本没学过,模型无法外推。好处是梯度下降很擅长从数据中学习,因此在同分布下表现不错。正是这一权衡引出了下面的固定正弦方案。</p>"
        },
        {
          "name": "Sinusoidal encodings & the relative-distance intuition",
          "nameZh": "正弦编码与相对距离的直觉",
          "body": "<p>The second scheme keeps one vector per position but <em>hardcodes</em> it with sines and cosines. For position \\(m\\) and a vector of size \\(d_{\\text{model}}\\), the instructor writes the even/odd dimensions as</p>\\[ PE_{m,2i} = \\sin(\\omega_i\\, m), \\quad PE_{m,2i+1} = \\cos(\\omega_i\\, m), \\quad \\omega_i = 10000^{-2i/d_{\\text{model}}}. \\]<p>Why sines and cosines? Because we want close tokens to look more similar than far ones, and <em>similarity means dot product</em> (cosine similarity is just a normalized dot product). Using \\(\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b\\), the dot product of two position vectors becomes a sum \\(\\sum_i \\cos\\!\\big(\\omega_i(m-n)\\big)\\) — a function of the <strong>relative distance</strong> \\(m-n\\) only. At \\(m=n\\) every term is \\(\\cos 0 = 1\\), so it is maximal: a position is most similar to itself. The instructor notes \\(\\omega_i\\) is high frequency for low dimensions and low frequency for high dimensions, which is exactly the banding you see when plotting the embeddings. The key benefit over learned positions: this <em>extends to any sequence length</em>, with comparable quality.</p>",
          "bodyZh": "<p>第二种方案仍是每个位置一个向量,但用正弦和余弦把它<em>硬编码</em>。对位置 \\(m\\)、维度为 \\(d_{\\text{model}}\\) 的向量,讲者把偶 / 奇维度写成</p>\\[ PE_{m,2i} = \\sin(\\omega_i\\, m), \\quad PE_{m,2i+1} = \\cos(\\omega_i\\, m), \\quad \\omega_i = 10000^{-2i/d_{\\text{model}}}. \\]<p>为什么用正余弦?因为我们希望相近的词元比相远的更相似,而<em>相似度即点积</em>(余弦相似度不过是归一化的点积)。利用 \\(\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b\\),两个位置向量的点积就化为求和 \\(\\sum_i \\cos\\!\\big(\\omega_i(m-n)\\big)\\) —— 只依赖<strong>相对距离</strong> \\(m-n\\)。当 \\(m=n\\) 时每一项都是 \\(\\cos 0 = 1\\),取得最大值:一个位置与自身最相似。讲者指出 \\(\\omega_i\\) 在低维是高频、在高维是低频,这正是把嵌入画出来时看到的条带。相较学习式位置,关键好处是:它能<em>外推到任意序列长度</em>,且质量相当。</p>"
        },
        {
          "name": "From absolute to relative: T5 bias, ALiBi, and RoPE",
          "nameZh": "从绝对到相对:T5 偏置、ALiBi 与 RoPE",
          "body": "<p>By 2025 we keep the <em>idea</em> (far tokens less similar) but stop adding embeddings at the input. The instructor's argument: similarity is decided inside the <strong>attention layer</strong>, so the relative signal should act there directly, not indirectly through the input. So people add a term <em>inside the softmax</em> of \\(\\mathrm{softmax}\\!\\big(QK^{\\top}/\\sqrt{d_k}\\big)V\\). <strong>T5</strong> learns a per-head bias by bucketizing \\(m-n\\). <strong>ALiBi</strong> (Attention with Linear Biases, from <em>Train Short, Test Long</em>) instead uses a deterministic linear penalty in \\(m-n\\) — no learning, but quite restrictive.</p><p>Most modern models use <strong>RoPE</strong> (Rotary Position Embeddings) instead. The idea: <em>rotate</em> the query by an angle tied to its position \\(m\\), and the key by an angle tied to its position \\(n\\). The instructor recalls how rotation is just a matrix multiply with the 2-D rotation matrix</p>\\[ R(\\theta)=\\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}. \\]<p>Writing a vector by its norm and angle as \\(v=r(\\cos\\varphi,\\sin\\varphi)\\), a short trigonometric expansion gives \\(R(\\theta)\\,v=r(\\cos(\\theta+\\varphi),\\sin(\\theta+\\varphi))\\) — a clean rotation by \\(\\theta\\). This is the foundation the instructor put on the blackboard before explaining why rotating Q and K is exactly what we want.</p>",
          "bodyZh": "<p>到了 2025 年,我们保留了「越远越不相似」的<em>思想</em>,却不再在输入端相加嵌入。讲者的论证是:相似度是在<strong>注意力层</strong>内部裁定的,所以相对信号应当直接作用在那里,而不是经由输入间接生效。于是人们在 \\(\\mathrm{softmax}\\!\\big(QK^{\\top}/\\sqrt{d_k}\\big)V\\) 的 <em>softmax 内部</em>加一项。<strong>T5</strong> 把 \\(m-n\\) 分桶,逐头学习一个偏置。<strong>ALiBi</strong>(线性偏置注意力,出自《Train Short, Test Long》)则改用关于 \\(m-n\\) 的确定性线性惩罚 —— 不学习,但相当受限。</p><p>大多数现代模型转而使用 <strong>RoPE</strong>(旋转位置编码)。其思想是:把查询按与其位置 \\(m\\) 绑定的角度<em>旋转</em>,把键按与其位置 \\(n\\) 绑定的角度旋转。讲者回顾了旋转其实就是与二维旋转矩阵做矩阵乘法</p>\\[ R(\\theta)=\\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}. \\]<p>把向量按其模长与夹角写成 \\(v=r(\\cos\\varphi,\\sin\\varphi)\\),经过简短的三角展开即得 \\(R(\\theta)\\,v=r(\\cos(\\theta+\\varphi),\\sin(\\theta+\\varphi))\\) —— 干净地旋转了 \\(\\theta\\)。这正是讲者在解释「为何旋转 Q 与 K 恰好是我们想要的」之前,先写在黑板上的基础。</p>"
        },
        {
          "name": "RoPE: why rotation captures relative distance",
          "nameZh": "RoPE:旋转为何捕获相对距离",
          "body": "<p>Here is the payoff. If the query at position \\(m\\) is rotated by \\(R(m\\theta)\\) and the key at position \\(n\\) by \\(R(n\\theta)\\), then in the attention score \\(q^{\\top}k\\) the two rotations combine into a single rotation by the <strong>relative</strong> offset:</p>\\[ \\big(R(m\\theta)\\,q\\big)^{\\top}\\big(R(n\\theta)\\,k\\big) = q^{\\top} R\\big((n-m)\\theta\\big)\\, k. \\]<p>So absolute positions go in, but the score depends only on \\(n-m\\) — exactly the relative-distance property we wanted, now living right inside attention. For \\(d>2\\), you split the vector into 2-D blocks and rotate each block by its own angle. The instructor stresses \\(\\theta\\) is <strong>fixed</strong>, not learned: it is a function of the dimension index \\(i\\) (running over \\(1\\) to \\(d/2\\)) and of \\(d\\), essentially the same \\(\\omega_i\\) as in the sinusoidal scheme. RoPE adds no parameters. The RoFormer paper also proves (in an appendix) a <strong>long-term decay</strong>: the upper bound of the attention weight shrinks as \\(|m-n|\\) grows, with small oscillations — far tokens attend less. This is why most models today use RoPE.</p>",
          "bodyZh": "<p>关键回报在此。若位置 \\(m\\) 处的查询被 \\(R(m\\theta)\\) 旋转、位置 \\(n\\) 处的键被 \\(R(n\\theta)\\) 旋转,那么在注意力分数 \\(q^{\\top}k\\) 中,两个旋转会合并成一个按<strong>相对</strong>偏移的单一旋转:</p>\\[ \\big(R(m\\theta)\\,q\\big)^{\\top}\\big(R(n\\theta)\\,k\\big) = q^{\\top} R\\big((n-m)\\theta\\big)\\, k. \\]<p>于是绝对位置被注入,分数却只依赖 \\(n-m\\) —— 正是我们想要的相对距离特性,而且就活在注意力内部。对 \\(d>2\\),把向量切成一个个二维块,每块按各自的角度旋转。讲者强调 \\(\\theta\\) 是<strong>固定</strong>的、并非学习得来:它是维度下标 \\(i\\)(从 \\(1\\) 到 \\(d/2\\))与 \\(d\\) 的函数,本质上就是正弦方案里的那个 \\(\\omega_i\\)。RoPE 不增加参数。RoFormer 论文还在附录中证明了<strong>长程衰减</strong>:随着 \\(|m-n|\\) 增大,注意力权重的上界会变小(带有小幅振荡)—— 越远的词元被关注得越少。这就是当今多数模型采用 RoPE 的原因。</p>"
        },
        {
          "name": "Layer normalization: Post-Norm, Pre-Norm, RMSNorm",
          "nameZh": "层归一化:后置、前置与 RMSNorm",
          "body": "<p>The <code>Add &amp; Norm</code> boxes take the sub-layer input plus its output (a residual connection), then normalize. The instructor explains the mechanism: take a vector, subtract its mean, divide by its standard deviation, then apply two learned parameters — a rescale \\(\\gamma\\) and a shift \\(\\beta\\):</p>\\[ \\mathrm{LN}(x)=\\gamma\\,\\frac{x-\\mu}{\\sigma}+\\beta. \\]<p>The intuition (keyword: <em>internal covariate shift</em>): activations sometimes have extreme values in some components, which makes layer weights hard to learn; normalizing pulls every component into a sane range, improving training stability and convergence speed. Unlike <strong>batch normalization</strong>, which normalizes each component across the <em>batch</em> dimension, LayerNorm works per-vector — preferable here because it does not couple training to the batch.</p><p>Two things changed since 2017. First, location: the original was <strong>Post-Norm</strong> (normalize after the residual add); modern models use <strong>Pre-Norm</strong> (normalize right before the sub-layer — attention or FFN). Second, modern models use <strong>RMSNorm</strong>: divide \\(x\\) by its root-mean-square and learn <em>only</em> \\(\\gamma\\). Comparable convergence, fewer parameters, so it is faster.</p>",
          "bodyZh": "<p><code>Add &amp; Norm</code> 框会取子层的输入加上其输出(残差连接),再做归一化。讲者解释了机制:取一个向量,减去其均值,除以其标准差,再施加两个可学习参数 —— 缩放 \\(\\gamma\\) 与平移 \\(\\beta\\):</p>\\[ \\mathrm{LN}(x)=\\gamma\\,\\frac{x-\\mu}{\\sigma}+\\beta. \\]<p>其直觉(关键词:<em>内部协变量偏移 internal covariate shift</em>):激活值有时在某些分量上取极端值,使得各层权重难以学习;归一化把每个分量拉进合理区间,从而提升训练稳定性与收敛速度。与沿<em>批</em>维度归一化各分量的<strong>批归一化(batch norm)</strong>不同,LayerNorm 是逐向量的 —— 在此更可取,因为它不会把训练与批耦合起来。</p><p>2017 年以来变了两点。其一是位置:原版是<strong>后置归一化(Post-Norm)</strong>(在残差相加之后归一化);现代模型用<strong>前置归一化(Pre-Norm)</strong>(在进入子层 —— 注意力或 FFN —— 之前就归一化)。其二是现代模型采用 <strong>RMSNorm</strong>:把 \\(x\\) 除以其均方根,且<em>只</em>学习 \\(\\gamma\\)。收敛性相当、参数更少,因此更快。</p>"
        },
        {
          "name": "Efficient attention: sliding windows & sparse attention",
          "nameZh": "高效注意力:滑动窗口与稀疏注意力",
          "body": "<p>Letting every token interact with every other gives an \\(n\\times n\\) interaction matrix — \\(O(n^2)\\) complexity, painful as \\(n\\) grows. <strong>Longformer</strong> (2020) restricts the window so each token attends only to its neighborhood; today this is called <strong>sliding-window attention (SWA)</strong>. A natural question raised in class: if softmax normally runs over everything, how does restricting help? The answer is clever implementations — <em>tiling</em> and related tricks — that never materialize the full \\(\\mathrm{softmax}(QK^{\\top}/\\sqrt{d_k})\\) matrix.</p><p>Modern models <strong>interleave</strong> local-attention layers with full global-attention layers; there is no fixed recipe, and the window — tiny in slide illustrations — is realistically several <em>thousand</em> tokens. The instructor links this to the <strong>receptive field</strong> in CNNs: in <strong>Mistral 7B</strong>, which stacks SWA at every layer, a token attends to its window, but each of those attends to <em>its</em> window, so stacked layers let information propagate far beyond one window — just like asking which inputs a convolutional output effectively saw.</p>",
          "bodyZh": "<p>让每个词元都与其他所有词元交互,会得到一个 \\(n\\times n\\) 的交互矩阵 —— \\(O(n^2)\\) 复杂度,随 \\(n\\) 增大而吃力。<strong>Longformer</strong>(2020)限制窗口,使每个词元只关注其邻域;如今这被称作<strong>滑动窗口注意力(SWA)</strong>。课堂上一个自然的问题:既然 softmax 通常要在全体上计算,限制范围又怎么帮得上忙?答案在于巧妙的实现 —— <em>分块(tiling)</em>及相关技巧 —— 它们从不显式构造完整的 \\(\\mathrm{softmax}(QK^{\\top}/\\sqrt{d_k})\\) 矩阵。</p><p>现代模型会把局部注意力层与完整的全局注意力层<strong>交替穿插</strong>;没有固定配方,而那个在幻灯片插图里很小的窗口,实际可达数<em>千</em>词元。讲者把它与 CNN 的<strong>感受野(receptive field)</strong>联系起来:在每层都堆叠 SWA 的 <strong>Mistral 7B</strong> 中,一个词元关注它的窗口,而窗口里的每个词元又各自关注<em>它们</em>的窗口,于是层层堆叠让信息传播得远超单个窗口 —— 正如追问一个卷积输出实际「看到」了哪些输入。</p>"
        },
        {
          "name": "Sharing K/V heads: MHA → MQA → GQA and the KV cache",
          "nameZh": "共享键值头:MHA → MQA → GQA 与 KV 缓存",
          "body": "<p>A second, orthogonal trick: instead of one projection matrix per head, <strong>share</strong> the key and value projections across heads while keeping a separate query projection per head. Why share K/V but not Q? Intuitively the query asks whether things are similar, so keeping query diversity helps. But the core reason is decoding cost: when you generate a token you attend it to <em>all previous</em> tokens, so keys and values are reused again and again. Next lecture's <strong>KV cache</strong> stores past keys/values to avoid recomputation, and we want that cache to stay small — sharing K/V projections across heads saves memory.</p><p>The instructor names the spectrum: all \\(H\\) heads share one K/V is <strong>Multi-Query Attention (MQA)</strong>; \\(G\\) groups of size \\(H/G\\), each sharing K/V, is <strong>Grouped-Query Attention (GQA)</strong>; one K/V per head is standard <strong>Multi-Head Attention (MHA)</strong>. The choice trades performance against latency/cost; many recent models lean toward GQA, though it is not universal. This applies to any attention layer but matters most for the masked self-attention in decoder-only LLMs.</p>",
          "bodyZh": "<p>第二个、与前者正交的技巧:不再为每个头配一套投影矩阵,而是在各头之间<strong>共享</strong>键和值的投影,同时仍为每个头保留独立的查询投影。为什么共享 K/V 却不共享 Q?直觉上,查询负责发问「是否相似」,保留查询的多样性更有益。但核心原因是解码成本:生成一个词元时,要让它关注<em>之前所有</em>词元,因此键和值会被反复复用。下一讲的 <strong>KV 缓存</strong>会存下过去的键 / 值以避免重算,而我们希望这块缓存保持小巧 —— 跨头共享 K/V 投影正好省显存。</p><p>讲者点明了这条谱系:所有 \\(H\\) 个头共享一份 K/V 即<strong>多查询注意力(MQA)</strong>;分成 \\(G\\) 组、每组大小 \\(H/G\\) 且组内共享 K/V,即<strong>分组查询注意力(GQA)</strong>;每头各有一份 K/V 即标准的<strong>多头注意力(MHA)</strong>。选择是在性能与延迟 / 成本之间权衡;许多近期模型偏向 GQA,但并非人人如此。该技巧可用于任何注意力层,但对仅解码器 LLM 中的掩码自注意力最为关键。</p>"
        },
        {
          "name": "Three model shapes & the T5 family",
          "nameZh": "三种模型形态与 T5 家族",
          "body": "<p>Shervine groups all Transformer-based models into three categories. <strong>Encoder-decoder</strong> (text-to-text) includes the <strong>T5</strong> family: T5 (Transfer Text-to-Text Transformer), mT5 (<em>multilingual</em>), and ByT5 (tokenizer-free, working at the <em>byte</em> level so the vocabulary is just \\(2^8=256\\) instead of ~30k). T5 also swaps next-token prediction for a <strong>span-corruption</strong> objective: the encoder sees text with blanks marked by <em>sentinel tokens</em> (e.g. <em>my teddy bear [X] is reading</em>), and the decoder reconstructs each masked span in series, trained with teacher forcing.</p><p><strong>Encoder-only</strong> (BERT, DistilBERT, RoBERTa) drops the decoder, so it cannot generate — but its embeddings are ideal for classification and token-level tasks. <strong>Decoder-only</strong> (GPT series) drops the encoder and the cross-attention module entirely, leaving stacked blocks of masked self-attention + FFN. Encoder-decoder was popular ~2018-2022; decoder-only dominates now, because next-word prediction scales effortlessly on raw text and aligns naturally with being a helpful chatbot, whereas span corruption is more bespoke.</p>",
          "bodyZh": "<p>Shervine 把所有基于 Transformer 的模型归为三类。<strong>编码-解码</strong>(文本到文本)包含 <strong>T5</strong> 家族:T5(迁移式文本到文本 Transformer)、mT5(<em>多语言 multilingual</em>),以及 ByT5(免分词,在<em>字节 byte</em> 层级工作,词表只有 \\(2^8=256\\) 而非约 3 万)。T5 还把下一词预测换成了<strong>跨段损坏(span corruption)</strong>目标:编码器看到的文本里留有空白,以<em>哨兵词元(sentinel token)</em>标记(例如「my teddy bear [X] is reading」),解码器再依次重建每个被遮的跨段,用教师强制(teacher forcing)训练。</p><p><strong>仅编码器</strong>(BERT、DistilBERT、RoBERTa)去掉解码器,故无法生成 —— 但其嵌入非常适合分类与词元级任务。<strong>仅解码器</strong>(GPT 系列)则彻底去掉编码器与交叉注意力模块,只留下「掩码自注意力 + FFN」的堆叠块。编码-解码在约 2018–2022 年流行;如今仅解码器主导,因为下一词预测能在原始文本上毫不费力地扩展,且天然契合「乐于助人的聊天机器人」,而跨段损坏则更为定制化。</p>"
        },
        {
          "name": "BERT deep dive: bidirectionality, MLM & NSP",
          "nameZh": "BERT 深拆:双向性、MLM 与 NSP",
          "body": "<p><strong>BERT</strong> = Bidirectional Encoder Representations from Transformers. Keeping only the encoder means the self-attention is <em>truly bidirectional</em> — every token attends to every other — unlike a decoder's masked (causal) self-attention where a token sees only itself and earlier tokens. The 2018 paper explicitly contrasts this with GPT, which is not bidirectional. (Its contemporary <strong>ELMo</strong>, a bidirectional LSTM, had the same insight but was hard to scale due to recurrence; both are Sesame Street characters.)</p><p>BERT trains in two stages. <strong>Pretraining</strong> uses two self-supervised proxy tasks on unlabeled text. <strong>Masked Language Modeling (MLM):</strong> ~15% of tokens are selected, of which 80% become <code>[MASK]</code>, 10% are replaced by a random word, and 10% are left unchanged; the model predicts the originals from both-side context. <strong>Next Sentence Prediction (NSP):</strong> two sentences are shown consecutively 50% of the time, randomly otherwise, and a head on the <code>[CLS]</code> token predicts whether they truly follow each other. Then <strong>fine-tuning</strong> attaches a small head for the end task, needing very little labeled data.</p>",
          "bodyZh": "<p><strong>BERT</strong> = 来自 Transformer 的双向编码器表示(Bidirectional Encoder Representations from Transformers)。只保留编码器,意味着自注意力是<em>真正双向</em>的 —— 每个词元都能关注其他所有词元 —— 这不同于解码器的掩码(因果)自注意力(词元只能看到自身及更早的词元)。2018 年的论文明确把它与并非双向的 GPT 作对比。(同期的 <strong>ELMo</strong> 是双向 LSTM,洞见相同,却因循环结构难以扩展;两者都是芝麻街角色。)</p><p>BERT 分两阶段训练。<strong>预训练</strong>在无标注文本上用两个自监督代理任务。<strong>掩码语言建模(MLM):</strong>约 15% 的词元被选中,其中 80% 变为 <code>[MASK]</code>,10% 替换成随机词,10% 保持不变;模型用两侧上下文预测原词。<strong>下一句预测(NSP):</strong>两个句子有 50% 时间是真正连续的、其余时间随机配对,由 <code>[CLS]</code> 词元上的输出头预测它们是否真的前后相承。随后的<strong>微调</strong>只需接上一个针对终端任务的小输出头,所需标注数据极少。</p>"
        },
        {
          "name": "BERT in practice: tokens, segments & the CLS head",
          "nameZh": "BERT 实战:词元、分段与 CLS 输出头",
          "body": "<p>The walkthrough uses <em>This teddy bear is SO CUTE!</em>. In an <em>uncased</em> model the text is lowercased, then tokenized by <strong>WordPiece</strong> — a tokenizer trained beforehand with merge rules that maximize likelihood, vocabulary ~30k (the usual \\(10^4\\)-ish order, except byte-level ByT5). A <code>[CLS]</code> token is prepended as a classification placeholder, <code>[SEP]</code> separates/ends segments, and <code>[PAD]</code> fills each batch row to a fixed length.</p><p>Each token's input vector is the sum of three learned pieces: the <strong>token embedding</strong> (a giant lookup table), the <strong>positional encoding</strong>, and the <em>new</em> <strong>segment embedding</strong> — just two vectors, A and B, added to all tokens of the first vs second sentence to support NSP. After the encoder, the magic of bidirectional self-attention is that the <code>[CLS]</code> output has mixed in every other token, becoming a context-aware embedding; for sentiment extraction we feed <em>only</em> that <code>[CLS]</code> embedding into a small FFN and discard the rest. For token-level tasks like question answering, the per-token embeddings <em>are</em> used — e.g. two FFNs predicting the start and end of the answer span. Sizes range from BERT-Tiny (4M params) up through BERT-Base (L=12, H=768, A=12, 110M) to BERT-Large (340M).</p>",
          "bodyZh": "<p>演示用的是「This teddy bear is SO CUTE!」。在<em>不区分大小写(uncased)</em>的模型里,文本先转小写,再由 <strong>WordPiece</strong> 分词 —— 这是一个预先训练好的分词器,其合并规则以最大化似然为目标,词表约 3 万(通常是 \\(10^4\\) 量级,字节级的 ByT5 除外)。前面加一个 <code>[CLS]</code> 词元作为分类占位,<code>[SEP]</code> 用于分隔 / 结尾各分段,<code>[PAD]</code> 把每个批次行补到固定长度。</p><p>每个词元的输入向量是三个学习分量之和:<strong>词元嵌入</strong>(一张巨大的查找表)、<strong>位置编码</strong>,以及<em>新增</em>的<strong>分段嵌入</strong> —— 仅 A、B 两个向量,分别加到第一句与第二句的所有词元上以支持 NSP。经过编码器后,双向自注意力的魔力在于:<code>[CLS]</code> 的输出已混入其他每个词元,成为一个上下文感知的嵌入;做情感抽取时,我们<em>只</em>把这个 <code>[CLS]</code> 嵌入送入一个小 FFN,其余丢弃。而像问答这样的词元级任务则会<em>用到</em>逐词元的嵌入 —— 例如用两个 FFN 分别预测答案跨段的起止位置。模型规模从 BERT-Tiny(4M 参数)经 BERT-Base(L=12、H=768、A=12、110M)到 BERT-Large(340M)。</p>"
        },
        {
          "name": "Shrinking & improving BERT: distillation, DistilBERT, RoBERTa",
          "nameZh": "缩小与改进 BERT:蒸馏、DistilBERT、RoBERTa",
          "body": "<p>BERT's limitations: a 512-token context window, high cost/latency (BERT-Base is 110M params), and a complex MLM+NSP+fine-tune pipeline. Two variants attack these. <strong>Distillation</strong> rests on the Hinton-et-al. observation that <em>the soft targets contain almost all the knowledge</em> — matching a small <strong>student</strong> to the teacher's full output distribution teaches more than hard labels. The objective minimizes the <strong>KL divergence</strong> from teacher \\(T\\) to student \\(S\\); the instructor notes that when the target is a one-hot hard label, KL reduces to the ordinary cross-entropy \\(-\\log y_S\\). <strong>DistilBERT</strong> applies this with half the layers (6 vs 12), retaining ~97% of performance while running ~1.6x faster.</p><p><strong>RoBERTa</strong> is a thorough ablation showing BERT was undertrained. Its findings: <em>removing NSP</em> (and segment embeddings) causes almost no drop; <em>static masking</em> should become <strong>dynamic</strong> (re-mask the same text differently each epoch); and the data should be far bigger and longer-trained (16 GB → 160 GB; 1M steps at batch 256 vs 500k at batch 8k). Result: roughly +4% across benchmarks with the same architecture.</p>",
          "bodyZh": "<p>BERT 的局限:512 词元的上下文窗口、高成本 / 高延迟(BERT-Base 有 110M 参数),以及 MLM+NSP+微调这套复杂流程。两个变体针对它们。<strong>蒸馏</strong>立足于 Hinton 等人的观察 —— <em>软目标几乎包含了全部知识</em> —— 让一个小<strong>学生模型</strong>去拟合教师的完整输出分布,比拟合硬标签教得更多。其目标是最小化从教师 \\(T\\) 到学生 \\(S\\) 的 <strong>KL 散度</strong>;讲者指出,当目标是 one-hot 硬标签时,KL 退化为普通的交叉熵 \\(-\\log y_S\\)。<strong>DistilBERT</strong> 据此把层数减半(6 对 12),保留约 97% 的性能,同时快约 1.6 倍。</p><p><strong>RoBERTa</strong> 是一次彻底的消融,表明 BERT 训练不足。其结论:<em>去掉 NSP</em>(及分段嵌入)几乎不掉点;<em>静态掩码</em>应改为<strong>动态掩码</strong>(每个 epoch 对同一文本重新做不同的掩码);数据应大得多、训得更久(16 GB → 160 GB;100 万步、批量 256,对比 50 万步、批量 8k)。结果:在相同架构下,各基准平均约 +4%。</p>"
        }
      ],
      "takeaways": [
        "The 2017 Transformer is still the backbone; only a few components (positions, normalization, attention sharing) quietly changed.",
        "Sinusoidal positions work because the dot product of two position vectors depends only on their relative distance m−n.",
        "RoPE rotates Q and K by position-dependent angles, so attention scores depend on n−m; it adds no parameters and shows long-term decay — the default today.",
        "Modern blocks use Pre-Norm with RMSNorm (learn only \\(\\gamma\\)) instead of the original Post-Norm LayerNorm.",
        "Sliding-window/sparse attention tames the \\(O(n^2)\\) cost; sharing K/V heads (MQA, GQA) shrinks the KV cache that bottlenecks decoding.",
        "Three shapes = same block, different masking; decoder-only won because next-token pretraining scales. BERT is the canonical encoder-only model.",
        "BERT pretrains with MLM (15%: 80/10/10) + NSP, then fine-tunes a small head on [CLS]; DistilBERT keeps ~97% at ~1.6x speed and RoBERTa shows NSP is unnecessary."
      ],
      "takeawaysZh": [
        "2017 年的 Transformer 至今仍是骨架;只有少数组件(位置、归一化、注意力共享)悄悄变了。",
        "正弦位置之所以奏效,是因为两个位置向量的点积只取决于相对距离 m−n。",
        "RoPE 按位置相关角度旋转 Q 与 K,使注意力分数只依赖 n−m;它不增加参数,且呈长程衰减 —— 这是当今默认选择。",
        "现代模块采用前置归一化配合 RMSNorm(只学 \\(\\gamma\\)),取代原版的后置归一化 LayerNorm。",
        "滑动窗口 / 稀疏注意力驯服了 \\(O(n^2)\\) 成本;共享 K/V 头(MQA、GQA)缩小了瓶颈解码的 KV 缓存。",
        "三种形态 = 同一模块、不同掩码;仅解码器因下一词预训练可扩展而胜出。BERT 是仅编码器的典范。",
        "BERT 以 MLM(15%:80/10/10)+ NSP 预训练,再在 [CLS] 上微调一个小输出头;DistilBERT 以约 1.6 倍速度保留约 97% 性能,RoBERTa 则表明 NSP 并非必需。"
      ],
      "refs": [
        {
          "t": "Attention Is All You Need (Vaswani et al., 2017)",
          "u": "https://arxiv.org/abs/1706.03762",
          "tZh": "注意力就是你所需要的一切(原名 Attention Is All You Need, 2017)"
        },
        {
          "t": "RoFormer: Enhanced Transformer with Rotary Position Embedding (Su et al., 2021)",
          "u": "https://arxiv.org/abs/2104.09864",
          "tZh": "RoFormer:带旋转位置编码的增强 Transformer(原名 RoFormer, 2021)"
        },
        {
          "t": "Train Short, Test Long: ALiBi (Press et al., 2021)",
          "u": "https://arxiv.org/abs/2108.12409",
          "tZh": "短训长测:线性偏置注意力 ALiBi(原名 Train Short, Test Long, 2021)"
        },
        {
          "t": "Root Mean Square Layer Normalization — RMSNorm (Zhang & Sennrich, 2019)",
          "u": "https://arxiv.org/abs/1910.07467",
          "tZh": "均方根层归一化 RMSNorm(原名 RMS Layer Normalization, 2019)"
        },
        {
          "t": "Longformer: The Long-Document Transformer (Beltagy et al., 2020)",
          "u": "https://arxiv.org/abs/2004.05150",
          "tZh": "Longformer:长文档 Transformer(原名 Longformer, 2020)"
        },
        {
          "t": "GQA: Training Generalized Multi-Query Transformers (Ainslie et al., 2023)",
          "u": "https://arxiv.org/abs/2305.13245",
          "tZh": "GQA:训练通用多查询 Transformer(原名 GQA, 2023)"
        },
        {
          "t": "Exploring the Limits of Transfer Learning — T5 (Raffel et al., 2020)",
          "u": "https://arxiv.org/abs/1910.10683",
          "tZh": "探索迁移学习的极限 — T5(原名 T5, 2020)"
        },
        {
          "t": "BERT: Pre-training of Deep Bidirectional Transformers (Devlin et al., 2018)",
          "u": "https://arxiv.org/abs/1810.04805",
          "tZh": "BERT:深度双向 Transformer 预训练(原名 BERT, 2018)"
        },
        {
          "t": "DistilBERT, a distilled version of BERT (Sanh et al., 2019)",
          "u": "https://arxiv.org/abs/1910.01108",
          "tZh": "DistilBERT:BERT 的蒸馏版本(原名 DistilBERT, 2019)"
        },
        {
          "t": "RoBERTa: A Robustly Optimized BERT Pretraining Approach (Liu et al., 2019)",
          "u": "https://arxiv.org/abs/1907.11692",
          "tZh": "RoBERTa:鲁棒优化的 BERT 预训练方法(原名 RoBERTa, 2019)"
        }
      ]
    },
    {
      "id": 3,
      "num": "03",
      "slug": "large-language-models",
      "title": "Large Language Models",
      "titleZh": "大语言模型",
      "date": "Oct 10, 2025",
      "duration": "1:48:44",
      "videoId": "Q5baLehv5So",
      "accent": "cyan",
      "dateZh": "2025年10月10日",
      "tagline": "Scale, sparsity, sampling and the art of prompting.",
      "taglineZh": "规模、稀疏化、采样,以及提示的艺术。",
      "overview": "<p>What turns a Transformer into a <em>large</em> language model? After recapping the three model families (encoder-decoder like T5, encoder-only like BERT, decoder-only like GPT), this lecture establishes that an LLM is a <strong>decoder-only</strong> next-token predictor scaled up in parameters, data and compute. It then covers the <strong>mixture-of-experts</strong> trick for growing capacity cheaply, how a response is actually generated (greedy, beam, sampling, temperature, top-k, top-p, guided decoding), context length and its limits, the emergent skill of <strong>prompting</strong> (in-context learning, chain-of-thought, self-consistency), and finally a tour of <strong>inference optimizations</strong> — KV caching, grouped-query and latent attention, PagedAttention, speculative decoding and multi-token prediction.</p>",
      "overviewZh": "<p>是什么把 Transformer 变成「大」语言模型?在回顾三类模型(像 T5 的编码器-解码器、像 BERT 的仅编码器、像 GPT 的仅解码器)之后,本讲确立:大语言模型本质是一个被放大了参数、数据与算力的<strong>仅解码器</strong>下一词元预测器。随后讲解低成本扩展容量的<strong>混合专家(MoE)</strong>技巧、一段回复究竟如何生成(贪心、束搜索、采样、温度、top-k、top-p、引导解码)、上下文长度及其局限、涌现出的<strong>提示</strong>技能(上下文学习、思维链、自一致性),最后系统梳理一系列<strong>推理优化</strong> —— KV 缓存、分组查询注意力与潜在注意力、PagedAttention、推测解码与多词元预测。</p>",
      "topics": [
        {
          "name": "What is an LLM?",
          "nameZh": "什么是大语言模型",
          "body": "<p>An LLM is first a <strong>language model</strong> — a model that assigns probabilities to sequences of tokens; concretely it always predicts the next token. It is <strong>large</strong> along three axes the instructor stressed: <strong>model size</strong> (billions of parameters, often hundreds of billions), <strong>training data</strong> (hundreds of billions to tens of trillions of tokens), and <strong>compute</strong> (many GPUs, though consumer-GPU tricks now exist). These terms are recent: around 2018-19 there was no settled definition. Under today's definition BERT is <em>not</em> an LLM — it is encoder-only and produces no text.</p><p>Architecturally an LLM is <strong>decoder-only</strong>: take the Transformer decoder, drop the encoder and therefore the cross-attention, and keep masked self-attention, the feed-forward network, and add-and-norm. This backbone is run autoregressively (text in, text out). More than 90% of modern LLMs are decoder-only — examples the instructor named include the GPT series, LLaMA (Meta), Gemma (Google), DeepSeek, Mistral and Qwen.</p>",
          "bodyZh": "<p>大语言模型首先是一个<strong>语言模型</strong> —— 即给词元序列赋予概率的模型;具体而言它始终在预测下一个词元。它之所以「大」,在于讲师强调的三个维度:<strong>模型规模</strong>(数十亿参数,常达数千亿)、<strong>训练数据</strong>(数千亿至数十万亿词元)、<strong>算力</strong>(大量 GPU,尽管如今已有面向消费级显卡的优化技巧)。这些术语都很新:2018-19 年左右并无公认定义。按今天的定义,BERT <em>并不</em>算大语言模型 —— 它是仅编码器、不产生文本。</p><p>在架构上,大语言模型是<strong>仅解码器</strong>的:取 Transformer 的解码器,去掉编码器、随之去掉交叉注意力,保留带掩码的自注意力、前馈网络与残差加归一化。这一主干被自回归地运行(文本进、文本出)。超过 90% 的现代大语言模型都是仅解码器 —— 讲师点名的例子包括 GPT 系列、LLaMA(Meta)、Gemma(Google)、DeepSeek、Mistral 与 Qwen。</p>"
        },
        {
          "name": "Mixture of Experts (MoE)",
          "nameZh": "混合专家 MoE",
          "body": "<p>Do all parameters need to fire for one prediction? The instructor's metaphor: you walk into a room with a mathematician, physicist, chemist and historian; with a math question, you would ask the mathematician, not everyone. <strong>MoE</strong> formalizes this. With \\(n\\) experts \\(E_i\\) and a gate/router \\(G\\), the output is</p>\\[ \\hat{y} = \\sum_{i} G(x)_i\\, E_i(x). \\]<p>A <strong>dense MoE</strong> weights all experts (probabilities summing to one, just leaning more on the relevant one); a <strong>sparse MoE</strong> sums only over the <strong>top-\\(k\\)</strong> selected experts (often \\(k=1\\) or \\(2\\)), which lowers the <strong>FLOPs</strong> (floating-point operations) per forward pass. Experts are placed where the <strong>FFN</strong> is — the instructor's quiz answer — because it is the most parameter-heavy block, with cost on the order of \\(2\\, d_{\\text{model}}\\, d_{ff}\\) (here \\(d_{\\text{model}}\\sim O(100\\text{-}1000)\\) but \\(d_{ff}\\sim O(1000\\text{-}10000)\\)), versus the much smaller attention projection matrices. Each expert is itself an FFN, you train several but activate only one or two, and routing is done <strong>per token</strong> by a layer-specific trainable gate that projects \\(x\\) to \\(n\\) dims and applies softmax (one gate per layer, weights not shared, so layer 1 may pick expert 3 while layer 2 picks expert 1). Crucially MoE scales <em>total</em> capacity without scaling <em>active</em> parameters — Switch Transformer reached ~1.x trillion params and was more sample-efficient.</p>",
          "bodyZh": "<p>一次预测真的需要所有参数都参与吗?讲师的比喻:你走进一个房间,里面有数学家、物理学家、化学家与历史学家;遇到数学问题,你会问数学家,而非每个人。<strong>MoE</strong> 把这一想法形式化。设有 \\(n\\) 个专家 \\(E_i\\) 与一个门控/路由器 \\(G\\),输出为</p>\\[ \\hat{y} = \\sum_{i} G(x)_i\\, E_i(x). \\]<p><strong>稠密 MoE</strong> 对所有专家加权(概率之和为一,只是更倚重相关的那个);<strong>稀疏 MoE</strong> 只对选中的<strong>前 \\(k\\) 个</strong>专家求和(常取 \\(k=1\\) 或 \\(2\\)),从而降低每次前向的 <strong>FLOPs</strong>(浮点运算数)。专家被放在 <strong>FFN</strong> 所在处 —— 这正是讲师课堂提问的答案,因为它是参数最重的模块,代价约为 \\(2\\, d_{\\text{model}}\\, d_{ff}\\)(其中 \\(d_{\\text{model}}\\sim O(100\\text{-}1000)\\),而 \\(d_{ff}\\sim O(1000\\text{-}10000)\\)),远大于注意力的投影矩阵。每个专家本身就是一个 FFN,训练若干个却只激活一两个;路由<strong>按词元</strong>进行,由一个层特定、可训练的门控完成,它把 \\(x\\) 投影到 \\(n\\) 维再做 softmax(每层一个门控、权重不共享,故第 1 层可能选专家 3,第 2 层却选专家 1)。关键在于:MoE 扩展了<em>总</em>容量却不扩展<em>激活</em>参数 —— Switch Transformer 达到约 1.x 万亿参数,且更具样本效率。</p>"
        },
        {
          "name": "Training MoE: routing collapse",
          "nameZh": "训练 MoE:路由坍缩",
          "body": "<p>The gate \\(G\\) and experts \\(E_i\\) are trained <strong>jointly</strong> — an ordinary mini-batch forward pass, loss, and backprop, with no separate training stage for the router. A natural worry is whether this stays differentiable; the answer is that \\(P_i\\) below is a clean function of the gate outputs, and modern frameworks handle the rest. The main difficulty is <strong>routing collapse</strong>: the router keeps picking the same one or two experts while the rest stay idle. The remedy is an <strong>auxiliary load-balancing loss</strong> added to the objective,</p>\\[ \\mathcal{L}_{\\text{aux}} = \\alpha\\, n \\sum_{i} f_i\\, P_i, \\]<p>where \\(f_i\\) is the fraction of tokens routed to expert \\(i\\) and \\(P_i\\) is the average routing probability for expert \\(i\\). The takeaway is not the exact formula but that this term pushes the usage toward a <strong>uniform</strong> distribution across experts, so all stay in the game. A related trick is <strong>noisy gating</strong> — adding noise to the gate outputs so other experts occasionally get involved by chance (similar in spirit to dropout). The instructor showed a Mixtral figure coloring, for layer 0, which expert each token was routed to: the colors look roughly uniform — what you do <em>not</em> want is every token the same color.</p>",
          "bodyZh": "<p>门控 \\(G\\) 与专家 \\(E_i\\) 是<strong>联合训练</strong>的 —— 普通的小批量前向、损失、反向传播,路由器没有单独的训练阶段。一个自然的疑问是这是否可微;答案是下文的 \\(P_i\\) 是门控输出的干净函数,其余部分现代框架会自动处理。主要难点是<strong>路由坍缩</strong>:路由器总挑同样的一两个专家,其余专家闲置。补救办法是在目标里加一项<strong>辅助负载均衡损失</strong>,</p>\\[ \\mathcal{L}_{\\text{aux}} = \\alpha\\, n \\sum_{i} f_i\\, P_i, \\]<p>其中 \\(f_i\\) 是被路由到专家 \\(i\\) 的词元比例,\\(P_i\\) 是专家 \\(i\\) 的平均路由概率。要记住的不是公式细节,而是这一项促使各专家的使用趋于<strong>均匀</strong>分布,使所有专家都参与进来。一个相关技巧是<strong>噪声门控(noisy gating)</strong> —— 在门控输出上加噪声,让其他专家偶尔凭机会被选中(理念类似 dropout)。讲师展示了一张 Mixtral 图,为第 0 层标出每个词元被路由到哪个专家:颜色大致均匀 —— 你<em>不</em>希望看到的是每个词元都是同一种颜色。</p>"
        },
        {
          "name": "Decoding I: greedy, beam, sampling",
          "nameZh": "解码(一):贪心、束搜索、采样",
          "body": "<p>Given a probability distribution over the next token, how do we choose? The first idea is <strong>greedy decoding</strong>: take the argmax. It is deterministic (same input always gives the same output) and <em>locally</em> optimal but not <em>globally</em> optimal — picking a 0.8 token now can lead to a lower-probability whole sequence than a 0.2 token followed by confident steps. The second idea is <strong>beam search</strong>: keep the top-\\(k\\) most likely partial sequences (\\(k\\) is the beam width), scoring a path by the sum of log-probabilities</p>\\[ \\log p(\\text{seq}) = \\sum_t \\log p(x_t \\mid x_{<t}). \\]<p>Because multiplying probabilities below one shrinks toward zero, beam search favors short sequences, so a <strong>length penalty</strong> (roughly dividing by the number of tokens to some power) is added. Beam search is costly and lacks diversity, so it is mainly used for <strong>machine translation</strong>. The third idea, and what people actually use, is <strong>sampling</strong>: draw the next token from the distribution, so fluffy, gentle, kind and smart are likely while airplane has small but nonzero probability — giving diversity and creativity.</p>",
          "bodyZh": "<p>给定下一个词元的概率分布,如何选词?第一个想法是<strong>贪心解码</strong>:取最大值。它是确定的(相同输入总给相同输出),且<em>局部</em>最优却非<em>全局</em>最优 —— 现在选一个 0.8 的词元,可能得到比「先选 0.2、随后步步高置信」更低概率的整句。第二个想法是<strong>束搜索(beam search)</strong>:保留概率最高的前 \\(k\\) 条部分序列(\\(k\\) 即束宽),用对数概率之和给一条路径打分</p>\\[ \\log p(\\text{seq}) = \\sum_t \\log p(x_t \\mid x_{<t}). \\]<p>由于把小于一的概率连乘会趋于零,束搜索偏好短序列,因此要加一项<strong>长度惩罚</strong>(大致是除以词元数的某个幂)。束搜索计算量大且缺乏多样性,故主要用于<strong>机器翻译</strong>。第三个想法、也是人们实际采用的,是<strong>采样</strong>:从分布中抽取下一个词元,于是 fluffy、gentle、kind、smart 较可能被抽到,而 airplane 概率虽小却非零 —— 由此带来多样性与创造性。</p>"
        },
        {
          "name": "Decoding II: temperature, top-k/top-p, guided",
          "nameZh": "解码(二):温度、top-k/top-p、引导",
          "body": "<p>Probabilities come from a <strong>linear layer</strong> projecting the \\(d_{\\text{model}}\\) vector to vocabulary size \\(|V|\\), then a softmax with a <strong>temperature</strong> \\(T\\):</p>\\[ p_i = \\frac{\\exp(x_i / T)}{\\sum_j \\exp(x_j / T)}. \\]<p>Factoring numerator and denominator by \\(\\exp(x_k/T)\\) at the argmax index \\(k\\) shows the limits: as \\(T \\to 0\\) all other terms \\(\\exp((x_j-x_k)/T)\\to 0\\), giving a <strong>spiky</strong> distribution (greedy); as \\(T \\to \\infty\\) every term \\(\\to 1\\), giving a <strong>uniform</strong> \\(1/|V|\\). So low \\(T\\) is deterministic and high-quality, high \\(T\\) is creative. To avoid sampling junk, restrict the pool: <strong>top-k</strong> samples among the \\(k\\) most probable tokens (e.g. \\(k=4\\)); <strong>top-p (nucleus)</strong> samples from the smallest set whose cumulative probability exceeds \\(p\\) (e.g. 90%), adapting to how peaked the distribution is. Note nothing in the Transformer is probabilistic <em>except</em> sampling — yet \\(T=0\\) may still be non-deterministic in practice because GPU reductions sum numbers in varying order (see <em>Defeating Nondeterminism in LLM Inference</em>). Finally, <strong>guided decoding</strong> enforces a format like JSON by filtering out invalid next tokens (e.g. the first token must be an opening brace), implemented via finite-state machines or context-free grammars.</p>",
          "bodyZh": "<p>概率来自一个<strong>线性层</strong>:把 \\(d_{\\text{model}}\\) 向量投影到词表大小 \\(|V|\\),再经带<strong>温度</strong> \\(T\\) 的 softmax:</p>\\[ p_i = \\frac{\\exp(x_i / T)}{\\sum_j \\exp(x_j / T)}. \\]<p>在最大值下标 \\(k\\) 处,用 \\(\\exp(x_k/T)\\) 同时约分分子分母即可看出极限:当 \\(T \\to 0\\),其余各项 \\(\\exp((x_j-x_k)/T)\\to 0\\),得到<strong>尖峰</strong>分布(即贪心);当 \\(T \\to \\infty\\),每一项 \\(\\to 1\\),得到<strong>均匀</strong>的 \\(1/|V|\\)。故低温确定且高质量,高温更具创造性。为避免抽到垃圾词元,需限制候选池:<strong>top-k</strong> 在概率最高的 \\(k\\) 个词元中采样(如 \\(k=4\\));<strong>top-p(核采样)</strong> 在累积概率超过 \\(p\\) 的最小集合中采样(如 90%),自适应于分布的尖锐程度。注意:Transformer 里<em>唯一</em>非确定的就是采样 —— 但实践中 \\(T=0\\) 仍可能非确定,因为 GPU 的归约会以不同次序累加数值(见 <em>Defeating Nondeterminism in LLM Inference</em>)。最后,<strong>引导解码(guided decoding)</strong>通过过滤掉非法的下一词元来强制输出格式(如 JSON,首个词元必须是左花括号),由有限状态机或上下文无关文法实现。</p>"
        },
        {
          "name": "Context length & prompting structure",
          "nameZh": "上下文长度与提示结构",
          "body": "<p>The number of input tokens a model can attend to at once goes by <strong>context length</strong>, context size or window size — all the same thing, equal to what self-attention sees. Modern LLMs range from tens of thousands to hundreds of thousands or even millions of tokens (Gemini advertises the million territory). But longer is not strictly better: a paper this summer dubbed <strong>context rot</strong>, using the <strong>needle-in-a-haystack</strong> test (burying an answer in ever-larger text), shows retrieval accuracy <em>decreases</em> as context grows, worsened by <strong>distractors</strong> (added noise). Hence for retrieval tasks you want to target the right context, not just dump everything in.</p><p>There is no formal theory of prompt structure, but a useful mental model has four parts: <strong>context</strong> (the setting), <strong>instructions</strong> (the task, like a function), <strong>input</strong> (its arguments), and <strong>constraints</strong> (e.g. tone or safety). For an everyday assistant, the context might be a system message giving the date and time, and the constraints might be hidden safety rules such as do not generate harmful content.</p>",
          "bodyZh": "<p>模型一次能关注的输入词元数,有<strong>上下文长度(context length)</strong>、上下文大小、窗口大小等叫法 —— 都是一回事,等于自注意力所见的范围。现代大语言模型从数万到数十万、乃至数百万词元(Gemini 宣传到百万级)。但更长并非一味更好:今夏一篇论文称之为<strong>上下文腐化(context rot)</strong>,用<strong>大海捞针(needle-in-a-haystack)</strong>测试(在越来越长的文本中埋入答案)表明,随上下文增长,检索准确率<em>下降</em>,并因<strong>干扰项(distractors)</strong>(加入的噪声)而恶化。因此做检索类任务时,应精准锁定正确的上下文,而非一股脑塞进去。</p><p>提示结构没有正式理论,但有一个好用的心智模型,分四部分:<strong>上下文</strong>(背景设定)、<strong>指令</strong>(任务,像一个函数)、<strong>输入</strong>(它的参数)、<strong>约束</strong>(如语气或安全)。对日常助手而言,上下文可能是给出日期与时间的系统消息,约束可能是用户看不到的安全规则,例如「不要生成有害内容」。</p>"
        },
        {
          "name": "In-context learning, CoT & self-consistency",
          "nameZh": "上下文学习、思维链与自一致性",
          "body": "<p><strong>In-context learning (ICL)</strong> steers an LLM through its input with no weight updates — learning is overloaded here, since nothing in the weights changes. <strong>Zero-shot</strong> just states the task; <strong>few-shot</strong> includes input-output examples (e.g. generate a story for a teddy named Teddy, then for one named Bob) so the model infers the pattern. Few-shot is <em>generally</em> better but costs effort, tokens and latency — and with newer reasoning models, well-written instructions can match or beat examples, because examples constrain the model to a finite set and hurt generalization to unseen distributions (cf. <em>plan-and-solve</em> prompting).</p><p><strong>Chain-of-thought (CoT)</strong> asks the model to emit its reasoning before the answer — e.g. the bear was born in 2020, so it is 4, hence 5 next year — which sharply improves multi-step accuracy and aids debugging (if the chain says we are in 2019, you can root-cause a wrong date in the prompt). <strong>Self-consistency</strong> goes further: sample many CoT paths <em>in parallel</em>, parse out each final answer (e.g. instruct it to put the answer last, or extract via regex), and take a <strong>majority vote</strong> — denoising individual mistakes for a robust answer.</p>",
          "bodyZh": "<p><strong>上下文学习(ICL)</strong>仅通过输入来引导大语言模型,不更新权重 —— 这里「学习」一词被借用了,因为权重并未改变。<strong>零样本</strong>只陈述任务;<strong>少样本</strong>则放入输入-输出示例(例如先为名叫 Teddy 的泰迪熊生成故事,再为名叫 Bob 的生成),让模型推断模式。少样本<em>通常</em>更好,但要付出整理成本、词元与延迟 —— 而对更新的推理模型,写得好的指令可与示例持平甚至更优,因为示例会把模型约束到一个有限集合,损害对未见分布的泛化(参见 <em>plan-and-solve</em> 提示)。</p><p><strong>思维链(CoT)</strong>让模型在给出答案前先输出推理 —— 例如「熊生于 2020,故现在 4 岁,因此明年 5 岁」 —— 这能显著提升多步准确率,也便于调试(若链中说「现在是 2019」,你就能定位到提示里写错的日期)。<strong>自一致性(self-consistency)</strong>更进一步:<em>并行</em>采样多条思维链,解析出各自的最终答案(例如指示它把答案放最后,或用正则提取),再做<strong>多数投票</strong> —— 消除个别错误,得到更稳健的答案。</p>"
        },
        {
          "name": "Inference optimizations",
          "nameZh": "推理优化",
          "body": "<p>Generation is expensive, and at inference you are <strong>memory-bound</strong> (memory, not compute, is the bottleneck). <strong>Exact</strong> tricks keep the same outputs: <strong>KV caching</strong> stores past keys and values so a new token only computes its own \\(K,V\\) and reuses the rest from cache (queries of past tokens are not needed; training uses teacher forcing so caching does not arise). <strong>Grouped-query attention (GQA)</strong> shares key/value heads across groups of queries — vanilla MHA has \\(h\\) query/key/value heads, MQA has one K/V head, GQA uses \\(G<h\\). <strong>PagedAttention</strong> (vLLM) fixes KV-cache memory waste — naively reserving the full context length per request causes internal and external fragmentation — by storing K/V in non-contiguous fixed-size blocks (the paper uses 16) with a position-to-block map. <strong>Latent / multi-head latent attention</strong> (DeepSeek-V2) factorizes the K/V projection through a low-dimensional latent, compressing then decompressing, and <em>shares</em> the compression across keys, values and heads — one vector per token per block — which also acts as helpful regularization.</p><p><strong>Approximate</strong> tricks trade a little accuracy for speed at the token level. <strong>Speculative decoding</strong> uses a small <strong>draft</strong> model to propose several tokens, then the big <strong>target</strong> model scores them in one pass; an accept/reject rule (a form of rejection sampling) guarantees the output matches the target distribution, and the last position yields a free next-token sample. <strong>Multi-token prediction (MTP)</strong> embeds draft and target in one model by training \\(k\\) prediction heads (changing the objective from next-token to multi-token); the extra heads act as the draft, accepted greedily.</p>",
          "bodyZh": "<p>生成代价高昂,而推理时你受<strong>显存约束</strong>(瓶颈是显存而非算力)。<strong>精确</strong>技巧保持输出不变:<strong>KV 缓存</strong>存下过去的键与值,使新词元只需计算自己的 \\(K,V\\),其余从缓存复用(过去词元的查询用不到;训练用教师强制,因此不涉及缓存)。<strong>分组查询注意力(GQA)</strong>让若干查询共享键/值头 —— 原始 MHA 有 \\(h\\) 个查询/键/值头,MQA 只有一个 K/V 头,GQA 取 \\(G<h\\)。<strong>PagedAttention</strong>(vLLM)解决 KV 缓存的显存浪费 —— 朴素地为每个请求预留满上下文长度会造成内部与外部碎片 —— 办法是把 K/V 存进不连续的定长块(论文取 16),并用「位置到块」的映射表。<strong>潜在/多头潜在注意力</strong>(DeepSeek-V2)把 K/V 投影分解为经过一个低维潜在空间的「先压缩再解压」,并在键、值与各头之间<em>共享</em>压缩 —— 每块每词元仅一个向量 —— 这还起到有益的正则化作用。</p><p><strong>近似</strong>技巧在词元层面以少许精度换速度。<strong>推测解码(speculative decoding)</strong>用一个小的<strong>草稿(draft)</strong>模型一次提出多个词元,再由大的<strong>目标(target)</strong>模型一遍打分;一个接受/拒绝规则(一种拒绝采样)保证输出与目标分布一致,而最后一个位置还顺带免费给出下一词元的采样。<strong>多词元预测(MTP)</strong>把草稿与目标嵌入同一模型,通过训练 \\(k\\) 个预测头实现(目标从下一词预测改为多词预测);多出的头充当草稿,以贪心方式被接受。</p>"
        }
      ],
      "takeaways": [
        "An LLM is a decoder-only next-token predictor scaled in parameters, data and compute; over 90% of modern models are decoder-only.",
        "MoE puts experts at the FFN and routes each token to its top-k, decoupling total capacity from active parameters; routing collapse is fixed with a load-balancing auxiliary loss.",
        "Decoding choices: greedy is local-optimal and deterministic, beam search suits translation, and sampling with temperature, top-k and top-p trades determinism for creativity.",
        "Prompting (zero/few-shot ICL), chain-of-thought and majority-vote self-consistency buy accuracy at test time with no weight updates.",
        "Inference is memory-bound; KV caching, GQA, PagedAttention, latent attention, speculative decoding and MTP make generation efficient."
      ],
      "takeawaysZh": [
        "大语言模型是一个在参数、数据、算力上放大的仅解码器下一词预测器;超过 90% 的现代模型为仅解码器。",
        "MoE 把专家放在 FFN 处,并将每个词元路由到其前 k 个专家,从而把总容量与激活参数解耦;路由坍缩用负载均衡辅助损失解决。",
        "解码选择:贪心是局部最优且确定,束搜索适合翻译,而带温度、top-k、top-p 的采样以确定性换创造性。",
        "提示(零/少样本 ICL)、思维链与多数投票的自一致性,可在测试期不更新权重而换取准确率。",
        "推理受显存约束;KV 缓存、GQA、PagedAttention、潜在注意力、推测解码与 MTP 让生成更高效。"
      ],
      "refs": [
        {
          "t": "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer (Shazeer et al., 2017)",
          "u": "https://arxiv.org/abs/1701.06538",
          "tZh": "稀疏门控混合专家层(原名 Outrageously Large Neural Networks, 2017)"
        },
        {
          "t": "Switch Transformers: Scaling to Trillion Parameter Models (Fedus et al., 2021)",
          "u": "https://arxiv.org/abs/2101.03961",
          "tZh": "Switch Transformers:扩展至万亿参数模型(原名 Switch Transformers, 2021)"
        },
        {
          "t": "Mixtral of Experts (Jiang et al., 2024)",
          "u": "https://arxiv.org/abs/2401.04088",
          "tZh": "Mixtral 混合专家(原名 Mixtral of Experts, 2024)"
        },
        {
          "t": "Language Models are Few-Shot Learners — GPT-3 (Brown et al., 2020)",
          "u": "https://arxiv.org/abs/2005.14165",
          "tZh": "语言模型是少样本学习者 —— GPT-3(原名 Language Models are Few-Shot Learners, 2020)"
        },
        {
          "t": "Chain-of-Thought Prompting Elicits Reasoning (Wei et al., 2022)",
          "u": "https://arxiv.org/abs/2201.11903",
          "tZh": "思维链提示激发推理能力(原名 Chain-of-Thought Prompting, 2022)"
        },
        {
          "t": "Self-Consistency Improves Chain of Thought Reasoning (Wang et al., 2022)",
          "u": "https://arxiv.org/abs/2203.11171",
          "tZh": "自一致性提升思维链推理(原名 Self-Consistency, 2022)"
        },
        {
          "t": "Context Rot: How Increasing Input Tokens Impacts LLM Performance (Hong et al., 2025)",
          "u": "https://research.trychroma.com/context-rot",
          "tZh": "上下文腐化:输入词元增加如何影响大语言模型表现(原名 Context Rot, 2025)"
        },
        {
          "t": "Efficient Memory Management for LLM Serving with PagedAttention (Kwon et al., 2023)",
          "u": "https://arxiv.org/abs/2309.06180",
          "tZh": "用 PagedAttention 高效管理大语言模型服务显存(原名 PagedAttention, 2023)"
        },
        {
          "t": "DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model (DeepSeek, 2024)",
          "u": "https://arxiv.org/abs/2405.04434",
          "tZh": "DeepSeek-V2:强大、经济、高效的 MoE 语言模型(原名 DeepSeek-V2, 2024)"
        },
        {
          "t": "Accelerating LLM Decoding with Speculative Sampling (Chen et al., 2023)",
          "u": "https://arxiv.org/abs/2302.01318",
          "tZh": "用推测采样加速大语言模型解码(原名 Speculative Sampling, 2023)"
        },
        {
          "t": "Better & Faster Large Language Models via Multi-token Prediction (Gloeckle et al., 2024)",
          "u": "https://arxiv.org/abs/2404.19737",
          "tZh": "通过多词元预测得到更好更快的大语言模型(原名 Multi-token Prediction, 2024)"
        },
        {
          "t": "Defeating Nondeterminism in LLM Inference (He et al., 2025)",
          "u": "https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/",
          "tZh": "战胜大语言模型推理中的非确定性(原名 Defeating Nondeterminism in LLM Inference, 2025)"
        }
      ]
    },
    {
      "id": 4,
      "num": "04",
      "slug": "llm-training",
      "title": "LLM Training",
      "titleZh": "大模型训练",
      "date": "Oct 17, 2025",
      "duration": "1:47:27",
      "videoId": "VlA_jt_3Qc4",
      "accent": "emerald",
      "dateZh": "2025年10月17日",
      "tagline": "Pretrain on the internet, make it fit, then adapt it cheaply.",
      "taglineZh": "在互联网上预训练,让它装得下,再低成本地适配。",
      "overview": "<p>This lecture follows the <strong>paradigm shift</strong> from training a model per task to <strong>pretraining</strong> one big model on language and code, then <em>tuning</em> it. We cover the next-token pretraining objective, scaling laws and the <strong>Chinchilla</strong> rule, then the systems engineering that makes it possible: the memory bottleneck on a single GPU, data and model parallelism, <strong>ZeRO</strong> sharding, <strong>FlashAttention</strong>, mixed precision and <strong>quantization</strong>. The second half (Shervine) turns the base model into a helpful assistant via <strong>supervised fine-tuning</strong> and instruction tuning, discusses evaluation, and ends with parameter-efficient adaptation: <strong>LoRA</strong> and <strong>QLoRA</strong>.</p>",
      "overviewZh": "<p>本讲沿着一条<strong>范式转变</strong>展开:从「每个任务训练一个模型」转向「在语言与代码上<strong>预训练</strong>一个大模型,再去<em>微调(tuning)</em>它」。我们讲下一词预测的预训练目标、扩展定律与 <strong>Chinchilla</strong> 法则,然后是让这一切成为可能的系统工程:单卡显存瓶颈、数据并行与模型并行、<strong>ZeRO</strong> 分片、<strong>FlashAttention</strong>、混合精度与<strong>量化</strong>。后半部分(Shervine 讲授)通过<strong>有监督微调(SFT)</strong>与指令微调把基座模型变成有用的助手,讨论评测难题,并以参数高效适配 <strong>LoRA</strong> 与 <strong>QLoRA</strong> 收尾。</p>",
      "topics": [
        {
          "name": "Paradigm shift: pretrain then tune",
          "nameZh": "范式转变:先预训练,再微调",
          "body": "<p>A decade ago you trained a separate model per task — one for spam detection, one for sentiment, one for translation — each from scratch on its own train/val/test split. But these tasks all share something: <em>understanding text</em>. <strong>Transfer learning</strong> exploits this — start from a pretrained model and reuse its knowledge instead of starting from zero.</p><p>This is exactly the LLM paradigm. Stage 1 is <strong>pretraining</strong>: train one large model on vast data to learn the patterns of language and code. Stage 2 is <strong>tuning</strong>: adapt the weights to a specific end task (spam, sentiment, translation) or, more commonly, to being a general assistant.</p><p>The pretraining objective is simple <strong>next-token prediction</strong>. An LLM is a text-to-text model and in <em>over 90% of cases</em> a decoder-only transformer; throughout the lecture, LLM means a decoder-only transformer-based model. It consumes input text and predicts the following token iteratively — starting from a beginning-of-sentence token \\([\\text{BOS}]\\) and rolling forward over the corpus.</p>",
          "bodyZh": "<p>十年前,你会为每个任务单独训练一个模型 —— 垃圾邮件检测一个、情感分析一个、翻译一个 —— 每个都在自己的训练/验证/测试集上从零训练。但这些任务有共同点:都要<em>理解文本</em>。<strong>迁移学习(transfer learning)</strong>正是利用这一点 —— 从一个预训练好的模型出发、复用其知识,而非从零开始。</p><p>这正是大模型的范式。第一阶段是<strong>预训练</strong>:在海量数据上训练一个大模型,学习语言与代码的规律。第二阶段是<strong>微调(tuning)</strong>:把权重适配到某个具体下游任务(垃圾邮件、情感、翻译),或更常见地,适配成一个通用助手。</p><p>预训练目标很简单,就是<strong>下一词预测</strong>。大模型是文本到文本模型,在<em>超过 90% 的情况下</em>是仅解码器(decoder-only)的 Transformer;本讲中说的「大模型」就指仅解码器的 Transformer 模型。它读入文本,迭代地预测下一个词元 —— 从句首标记 \\([\\text{BOS}]\\) 起步,在语料上一路向前滚动。</p>"
        },
        {
          "name": "Pretraining: data, scale, FLOPs, scaling laws",
          "nameZh": "预训练:数据、规模、FLOPs 与扩展定律",
          "body": "<p>Pretraining is by far the most expensive stage. The data is <em>everything you can find</em>: web text (<strong>Common Crawl</strong> archives roughly 3 billion pages per month, plus Wikipedia, Reddit), code (GitHub, StackOverflow), many languages. Size is measured in tokens — hundreds of billions to <em>tens of trillions</em>. Concretely: <strong>GPT-3 used 300 billion tokens; Llama 3 used 15 trillion</strong>.</p><p>Two notations recur. <strong>FLOPs</strong> (FLoating-point OPerations) is a unit of <em>total compute</em> — training an LLM is on the order of \\(10^{25}\\) FLOPs, roughly \\(O(\\text{params}\\times\\text{tokens})\\), though MoE models cost less since only some parameters activate. <strong>FLOPS / FLOP/s</strong> (per second) is hardware <em>speed</em>. Papers sometimes swap them, so read from context.</p><p>Kaplan et al. (2020) showed loss improves predictably with more compute, more data and bigger models, and that bigger models are more <strong>sample-efficient</strong> (better performance per token). Given a <em>fixed</em> compute budget, the <strong>Chinchilla</strong> result (Hoffmann et al., 2022) found a compute-optimal sweet spot of about <strong>20 training tokens per parameter</strong>. By this measure GPT-3 (175B parameters, 300B tokens) was badly <em>under-trained</em>.</p>",
          "bodyZh": "<p>预训练是迄今最昂贵的阶段。数据是<em>能找到的一切</em>:网页文本(<strong>Common Crawl</strong> 每月归档约 30 亿个页面,外加维基百科、Reddit)、代码(GitHub、StackOverflow)、多种语言。规模以词元计 —— 从数千亿到<em>数十万亿</em>。具体地:<strong>GPT-3 用了 3000 亿词元;Llama 3 用了 15 万亿</strong>。</p><p>有两个反复出现的记号。<strong>FLOPs</strong>(浮点运算次数)是<em>总算力</em>单位 —— 训练一个大模型约为 \\(10^{25}\\) FLOPs,大致是 \\(O(\\text{参数}\\times\\text{词元})\\),不过混合专家(MoE)模型更省,因为只激活部分参数。<strong>FLOPS / FLOP/s</strong>(每秒)是硬件<em>速度</em>。论文里有时会把两者混用,需结合上下文判断。</p><p>Kaplan 等人(2020)表明:算力越多、数据越多、模型越大,损失越低且可预测;而且更大的模型更<strong>样本高效(sample-efficient)</strong>(每个词元带来更好性能)。在<em>固定</em>算力预算下,<strong>Chinchilla</strong> 的结论(Hoffmann 等,2022)是存在一个算力最优甜点:大约<strong>每个参数配 20 个训练词元</strong>。按此标准,GPT-3(1750 亿参数、3000 亿词元)其实严重<em>训练不足</em>。</p>"
        },
        {
          "name": "Pretraining challenges: cost, knowledge cutoff",
          "nameZh": "预训练的挑战:成本与知识截止",
          "body": "<p>Pretraining has hard limits beyond compute. <strong>Cost</strong> is <em>at least</em> millions of dollars, often tens or hundreds of millions, takes a long time, and carries an environmental / electricity footprint that papers increasingly report.</p><p>The model also only knows data up to its <strong>knowledge cutoff date</strong> — the point at which the pretraining corpus was cut. A base model has no way by itself to know events after that date. On model cards (OpenAI, Google) this is always stated; for example GPT-5 lists a cutoff of September 30. Injecting or <em>editing</em> knowledge afterwards is a hard, unsolved problem: changing weights to add a fact tends to regress other domains, so there is no clean surgical update.</p><p>A further risk: because the model predicts the most likely next token, it can reproduce text seen verbatim during training — <strong>plagiarism</strong>. These challenges (cost, stale knowledge, memorization) motivate everything that follows — both the efficiency tricks and the later retrieval and tuning stages.</p>",
          "bodyZh": "<p>除算力外,预训练还有硬性限制。<strong>成本</strong><em>至少</em>是数百万美元,常常是数千万乃至数亿美元,耗时很长,并带来环境/电力开销 —— 如今论文也越来越多地披露这部分。</p><p>模型只知道截止到其<strong>知识截止日期(knowledge cutoff)</strong>之前的数据 —— 即预训练语料被切断的时点。基座模型本身无从知晓该日期之后发生的事。在模型卡(OpenAI、Google)上总会标明这一点;例如 GPT-5 标注的截止日期是 9 月 30 日。事后<em>注入或编辑</em>知识是个困难且未解的问题:改权重去加一个事实,往往会让其他领域退化,因此没有干净的「外科手术式」更新。</p><p>还有一重风险:由于模型预测最可能的下一词,它可能逐字复现训练时见过的文本 —— 即<strong>抄袭(plagiarism)</strong>。这些挑战(成本、知识陈旧、记忆)正是后续一切的动机 —— 既包括效率技巧,也包括后面的检索与微调阶段。</p>"
        },
        {
          "name": "Training memory & parallelism (DP, ZeRO, MP)",
          "nameZh": "训练显存与并行(DP、ZeRO、模型并行)",
          "body": "<p>Training tunes weights via a <strong>forward pass</strong> (compute loss), a <strong>backward pass</strong> (gradients), and a <strong>weight update</strong> (e.g. <em>Adam</em>, which also stores first and second moments — moving averages of the gradient and squared gradient). Four things must live in memory: <strong>activations</strong> (scale with model size, batch size, and context length — the latter is \\(O(n^2)\\) from self-attention), gradients, parameters, and optimizer state. An H100 has only ~<strong>80 GB</strong> — not a lot.</p><p>So we spread the load across many GPUs. <strong>Data parallelism (DP)</strong> splits the batch across devices, each holding a full model copy; gradients are then <em>averaged</em> across GPUs, adding a <strong>communication cost</strong> that slows training. Since every GPU redundantly stores the same parameters, gradients and optimizer state, <strong>ZeRO</strong> (Zero Redundancy Optimization) shards them: <em>ZeRO-1</em> partitions optimizer state, <em>ZeRO-2</em> adds gradients, <em>ZeRO-3</em> adds parameters — less memory per GPU, more communication. <strong>Model parallelism</strong> splits the computation itself: <em>tensor</em> parallelism cuts big matrix multiplies, <em>pipeline</em> parallelism assigns layer ranges to GPUs, and <em>expert</em> parallelism places different MoE experts on different devices.</p>",
          "bodyZh": "<p>训练通过三步调整权重:<strong>前向传播</strong>(算损失)、<strong>反向传播</strong>(算梯度)、<strong>权重更新</strong>(如 <em>Adam</em>,它还存一阶矩与二阶矩 —— 梯度与梯度平方的滑动平均)。有四样东西必须放进显存:<strong>激活值</strong>(随模型大小、批量大小、上下文长度增长 —— 后者因自注意力呈 \\(O(n^2)\\))、梯度、参数、优化器状态。一块 H100 只有约 <strong>80 GB</strong> —— 并不多。</p><p>于是把负载摊到多块 GPU 上。<strong>数据并行(DP)</strong>把批量切到各设备,每块都存一份完整模型;之后在 GPU 间对梯度<em>求平均</em>,带来拖慢训练的<strong>通信开销</strong>。由于每块 GPU 都冗余地存着相同的参数、梯度与优化器状态,<strong>ZeRO</strong>(零冗余优化)将它们分片:<em>ZeRO-1</em> 切分优化器状态,<em>ZeRO-2</em> 再加梯度,<em>ZeRO-3</em> 再加参数 —— 每卡显存更少,通信更多。<strong>模型并行</strong>则切分计算本身:<em>张量</em>并行切开大矩阵乘法,<em>流水线</em>并行把若干层指派给不同 GPU,<em>专家</em>并行把不同 MoE 专家放到不同设备上。</p>"
        },
        {
          "name": "FlashAttention",
          "nameZh": "FlashAttention",
          "body": "<p><strong>FlashAttention</strong> (Dao et al., 2022, developed at Stanford) speeds up attention <em>exactly</em> — no approximation — by exploiting GPU memory hierarchy. A GPU has two memories: <strong>HBM</strong>, big but slow (tens of GB, a few TB/s), and <strong>SRAM</strong>, on-chip, tiny but fast (tens of MB, tens of TB/s). Standard attention, \\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right)V, \\] reads/writes the full intermediate matrices to slow HBM repeatedly (compute \\(S\\), write, read, softmax, write, read, multiply by \\(V\\), write). Data transfer becomes the bottleneck.</p><p><strong>Idea 1 — tiling.</strong> Softmax normalizes each row to sum to 1, which seems to require the whole row first. But the softmax of a row split into blocks equals the per-block softmaxes corrected by a scaling factor. So load small blocks of \\(Q,K,V\\) into SRAM, compute a block of the output end-to-end, and write it once — collapsing many HBM trips into essentially one. <strong>Idea 2 — recomputation.</strong> Since attention is now fast, don't store activations for the backward pass; recompute them. This does <em>more</em> FLOPs yet runs <em>faster</em> and uses less memory (HBM access fell from 40.3 to ~4, a ~10x cut) — the best of both worlds. Variants FlashAttention-2/3 adapt the idea to newer GPUs.</p>",
          "bodyZh": "<p><strong>FlashAttention</strong>(Dao 等,2022,在斯坦福提出)在不做任何近似的前提下<em>精确地</em>加速注意力,靠的是利用 GPU 的存储层级。GPU 有两种内存:<strong>HBM</strong>,大但慢(数十 GB,几 TB/s);<strong>SRAM</strong>,在芯片上、极小但快(数十 MB,数十 TB/s)。标准注意力 \\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right)V \\] 会把中间大矩阵反复读写到慢速 HBM(算 \\(S\\)、写、读、做 softmax、写、读、乘 \\(V\\)、写)。数据搬运成了瓶颈。</p><p><strong>想法一 —— 分块(tiling)。</strong>softmax 让每一行归一化为和等于 1,看似必须先有整行。但把一行切成若干块后,整行的 softmax 等于各块 softmax 经一个缩放因子修正后的结果。于是把 \\(Q,K,V\\) 的小块载入 SRAM,端到端算出输出的一块,只写回一次 —— 把多次 HBM 往返压缩成基本上一次。<strong>想法二 —— 重算(recomputation)。</strong>既然注意力已经很快,就别为反向传播存激活了,直接重算。这虽然做了<em>更多</em> FLOPs,却跑得<em>更快</em>且更省显存(HBM 访问从 40.3 降到约 4,约 10 倍)—— 两全其美。变体 FlashAttention-2/3 把该想法适配到更新的 GPU。</p>"
        },
        {
          "name": "Mixed precision & quantization",
          "nameZh": "混合精度与量化",
          "body": "<p>Weights are floating-point numbers — bits split into sign, exponent and mantissa (granularity). Common formats: <strong>FP32</strong> (1/8/23), <strong>FP16</strong> (1/5/10), <strong>FP64</strong> (1/11/52), <strong>BF16</strong> (1/8/7). Lower precision means half the memory and faster compute — an H100 does ~34 TFLOPS in FP64 but roughly doubles going to FP32, and so on.</p><p><strong>Mixed precision training</strong> (Micikevicius et al., 2017) keeps a high-precision FP32 master copy of the <em>weights</em>, runs the forward and backward passes in low precision (FP16), and does the <em>weight update</em> in FP32. Intuition: training data is noisy, so the gradient direction needn't be ultra-precise, but the weights must stay precise to avoid accumulating quantization error.</p><p><strong>Quantization</strong> converts a number's precision, e.g. to INT8 or INT4. A value maps through a scale (and optional zero-point): \\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right) + z, \\qquad \\hat{x} = s\\,(x_q - z). \\] Variants such as <strong>zero-point quantization</strong> and <strong>absmax</strong> differ in how they handle the value range; later methods (GPTQ, AWQ for post-training; QAT during training) build on this.</p>",
          "bodyZh": "<p>权重是浮点数 —— 比特分为符号位、指数位与尾数位(决定粒度)。常见格式:<strong>FP32</strong>(1/8/23)、<strong>FP16</strong>(1/5/10)、<strong>FP64</strong>(1/11/52)、<strong>BF16</strong>(1/8/7)。精度越低,显存减半、计算更快 —— H100 在 FP64 下约 34 TFLOPS,降到 FP32 大致翻倍,依此类推。</p><p><strong>混合精度训练</strong>(Micikevicius 等,2017)保留一份高精度 FP32 的<em>权重</em>主副本,前向与反向传播用低精度(FP16)进行,而<em>权重更新</em>用 FP32。直觉是:训练数据本身有噪声,梯度方向不必超精确,但权重必须保持精确以免累积量化误差。</p><p><strong>量化(quantization)</strong>把数值的精度转换,例如转成 INT8 或 INT4。数值通过一个缩放因子(及可选零点)映射:\\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right) + z, \\qquad \\hat{x} = s\\,(x_q - z). \\] 像<strong>零点量化(zero-point)</strong>与 <strong>absmax</strong> 这类变体,区别在于如何处理数值范围;后续方法(训练后量化的 GPTQ、AWQ;训练时的量化感知训练 QAT)都建立在此之上。</p>"
        },
        {
          "name": "SFT, instruction tuning & evaluation",
          "nameZh": "SFT、指令微调与评测",
          "body": "<p>Ask a <em>base</em> model can I put my teddy bear in the washer and it does not answer — it predicts likely continuations, e.g. teddy bears are often made of polyester and cotton. It was trained on next-token prediction, not to be helpful. <strong>SFT</strong> (Supervised Fine-Tuning) fixes this: train on <em>(input, output)</em> pairs with desired behavior, using the same next-token loss but computing it <strong>only on the response</strong> — the prompt is fixed context (no teacher forcing on it), so the model learns to <em>produce</em> good answers rather than parrot the input. SFT on instruction-following data is <strong>instruction tuning</strong>, which graduates the model into a helpful assistant; the same teddy-bear prompt now yields no, hand wash it instead.</p><p>SFT data mixtures span assistant dialogues, synthetic instructions, math/reasoning/code, and safety alignment (refusals, hedging), and are increasingly LLM-generated then human-reviewed. They are smaller and higher-quality than pretraining: GPT-3 used ~13k examples, Llama 3 ~10 million — orders of magnitude fewer tokens. <strong>Evaluation</strong> is hard: benchmarks like MMLU, ARC-Challenge, GSM8K, HumanEval can be gamed by <em>training on the test task</em>; LMArena puts a number on vibes via pairwise human votes but suffers cold-start noise, can be rigged, and reflects personal/safety biases. SFT plus preference tuning (Lecture 5) is called <strong>alignment</strong>.</p>",
          "bodyZh": "<p>问一个<em>基座</em>模型「能把泰迪熊放进洗衣机吗」,它并不回答 —— 而是预测最可能的续写,例如「泰迪熊通常由聚酯纤维和棉花制成」。它是被训练来做下一词预测的,而非乐于助人。<strong>SFT</strong>(有监督微调)解决了这点:在带有期望行为的<em>(输入, 输出)</em>对上训练,用同样的下一词损失,但<strong>只在回答上</strong>计算 —— 提示是固定的上下文(不对它做教师强制),于是模型学会<em>产出</em>好答案,而非鹦鹉学舌地复述输入。在「指令遵循」数据上做 SFT 就是<strong>指令微调</strong>,它把模型「升级」成有用的助手;同样的泰迪熊提问,现在会得到「不行,请改用手洗」。</p><p>SFT 的数据混合涵盖助手对话、合成指令、数学/推理/代码,以及安全对齐(拒答、措辞留有余地的 hedging),且越来越多地由大模型生成、再经人工审核。它比预训练数据更小、质量更高:GPT-3 用了约 1.3 万个样本,Llama 3 约 1000 万 —— 词元数量低好几个数量级。<strong>评测</strong>很难:MMLU、ARC-Challenge、GSM8K、HumanEval 等基准会被<em>「在测试任务上训练」</em>钻空子;LMArena 用人类两两投票给「感觉(vibes)」打分,但有冷启动噪声、可被操纵,还掺杂个人偏好与安全惩罚的偏差。SFT 加上偏好微调(第 5 讲)合称<strong>对齐(alignment)</strong>。</p>"
        },
        {
          "name": "LoRA & QLoRA",
          "nameZh": "LoRA 与 QLoRA",
          "body": "<p>Full fine-tuning updates the entire weight matrix — resource-intensive, and you store a full model per task. <strong>LoRA</strong> (Hu et al., 2021) freezes the pretrained weights \\(W_0\\) and learns a low-rank update from two small matrices:</p>\\[ W = W_0 + BA, \\qquad B\\in\\mathbb{R}^{d\\times r},\\ A\\in\\mathbb{R}^{r\\times k},\\ r \\ll d. \\]<p>The forward pass runs both terms and adds them. While \\(W\\)'s dimensions are hundreds or thousands, the rank \\(r\\) is tiny (often up to ~10; rank 4 is a common default), so far fewer parameters train. A neat benefit: swap \\(A,B\\) to swap tasks — many adapters share one frozen base. Two empirical quirks: LoRA wants a <strong>~10x higher learning rate</strong> than full fine-tuning and does <strong>poorly with large batch sizes</strong>. The original paper applied LoRA to attention matrices; recent guidance (LoRA Without Regret, 2025) finds the <em>feed-forward</em> blocks give the most benefit, so today both carry adapters.</p><p><strong>QLoRA</strong> (Dettmers et al., 2023) quantizes the frozen \\(W_0\\) to 4-bit <strong>NF4</strong> (NormalFloat — assumes normal weights, splitting the range into quantiles so each bucket holds about equally many values) while \\(A,B\\) stay in full precision (BF16) and computation is full precision. It also <strong>double-quantizes</strong> — quantizing the quantization constants. On LLaMA 65B this gave ~16x VRAM savings, with double quantization adding ~6% more.</p>",
          "bodyZh": "<p>全量微调会更新整个权重矩阵 —— 既耗资源,每个任务又要存一份完整模型。<strong>LoRA</strong>(Hu 等,2021)冻结预训练权重 \\(W_0\\),用两个小矩阵学习一个低秩更新:</p>\\[ W = W_0 + BA, \\qquad B\\in\\mathbb{R}^{d\\times r},\\ A\\in\\mathbb{R}^{r\\times k},\\ r \\ll d. \\]<p>前向传播分别算两项再相加。\\(W\\) 的维度是数百到数千,而秩 \\(r\\) 极小(常常不超过约 10;秩 4 是常用默认值),因此要训练的参数少得多。一个巧妙的好处:换掉 \\(A,B\\) 就换了任务 —— 许多适配器共享同一个冻结基座。两条经验规律:LoRA 需要比全量微调<strong>高约 10 倍的学习率</strong>,且在<strong>大批量下表现较差</strong>。原始论文把 LoRA 加在注意力矩阵上;近期的指引(LoRA Without Regret,2025)发现<em>前馈(feed-forward)</em>块收益最大,故如今两者都会带适配器。</p><p><strong>QLoRA</strong>(Dettmers 等,2023)把冻结的 \\(W_0\\) 量化为 4-bit 的 <strong>NF4</strong>(NormalFloat —— 假设权重服从正态分布,按分位数而非等宽桶切分,使每个桶里值的数量大致相等),而 \\(A,B\\) 保持全精度(BF16)、计算也用全精度。它还做<strong>双重量化</strong> —— 把量化常数也量化一遍。在 LLaMA 65B 上,这带来约 16 倍的显存(VRAM)节省,双重量化再多省约 6%。</p>"
        }
      ],
      "takeaways": [
        "LLMs use transfer learning: pretrain once on language/code via next-token prediction, then tune.",
        "Chinchilla-optimal training pairs ~20 tokens per parameter; GPT-3 (175B, 300B tokens) was under-trained while Llama 3 saw 15T tokens.",
        "A single H100 holds ~80 GB, so training relies on data/model parallelism and ZeRO-1/2/3 sharding of optimizer state, gradients and parameters.",
        "FlashAttention is exact: tiling through SRAM plus backward-pass recomputation cuts HBM I/O ~10x and runs faster.",
        "Mixed precision keeps FP32 master weights but computes in FP16/BF16; quantization (INT8/INT4) maps values via a scale and zero-point.",
        "SFT/instruction tuning trains on (input, output) pairs with loss only on the response, turning a base model into a helpful assistant.",
        "LoRA learns a low-rank delta W = W0 + BA (W0 frozen); QLoRA quantizes W0 to NF4 for ~16x VRAM savings, enabling fine-tuning on small GPUs."
      ],
      "takeawaysZh": [
        "大模型采用迁移学习:先用下一词预测在语言/代码上预训练一次,再微调。",
        "Chinchilla 最优训练约为每参数 20 词元;GPT-3(1750 亿参数、3000 亿词元)训练不足,而 Llama 3 见过 15 万亿词元。",
        "单块 H100 仅约 80 GB,故训练依赖数据/模型并行,以及对优化器状态、梯度、参数做 ZeRO-1/2/3 分片。",
        "FlashAttention 是精确的:经 SRAM 分块加上反向传播重算,把 HBM 读写削减约 10 倍且跑得更快。",
        "混合精度保留 FP32 主权重但用 FP16/BF16 计算;量化(INT8/INT4)通过缩放因子与零点映射数值。",
        "SFT/指令微调在(输入, 输出)对上训练且只在回答上计损失,把基座模型变成有用的助手。",
        "LoRA 学习低秩增量 W = W0 + BA(W0 冻结);QLoRA 把 W0 量化为 NF4,约省 16 倍显存,使小卡也能微调。"
      ],
      "refs": [
        {
          "t": "Scaling Laws for Neural Language Models (Kaplan et al., 2020)",
          "u": "https://arxiv.org/abs/2001.08361",
          "tZh": "神经语言模型的扩展定律(Scaling Laws for Neural Language Models, 2020)"
        },
        {
          "t": "Training Compute-Optimal LLMs — Chinchilla (Hoffmann et al., 2022)",
          "u": "https://arxiv.org/abs/2203.15556",
          "tZh": "算力最优的大模型训练 —— Chinchilla(Training Compute-Optimal LLMs, 2022)"
        },
        {
          "t": "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (Rajbhandari et al., 2019)",
          "u": "https://arxiv.org/abs/1910.02054",
          "tZh": "ZeRO:面向万亿参数训练的显存优化(ZeRO, 2019)"
        },
        {
          "t": "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (Dao et al., 2022)",
          "u": "https://arxiv.org/abs/2205.14135",
          "tZh": "FlashAttention:感知 IO 的快速省内存精确注意力(FlashAttention, 2022)"
        },
        {
          "t": "Mixed Precision Training (Micikevicius et al., 2017)",
          "u": "https://arxiv.org/abs/1710.03740",
          "tZh": "混合精度训练(Mixed Precision Training, 2017)"
        },
        {
          "t": "Finetuned Language Models Are Zero-Shot Learners — FLAN instruction tuning (Wei et al., 2022)",
          "u": "https://arxiv.org/abs/2109.01652",
          "tZh": "微调后的语言模型是零样本学习者 —— FLAN 指令微调(Wei et al., 2022)"
        },
        {
          "t": "LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)",
          "u": "https://arxiv.org/abs/2106.09685",
          "tZh": "LoRA:大语言模型的低秩适配(LoRA, 2021)"
        },
        {
          "t": "QLoRA: Efficient Finetuning of Quantized LLMs (Dettmers et al., 2023)",
          "u": "https://arxiv.org/abs/2305.14314",
          "tZh": "QLoRA:量化大模型的高效微调(QLoRA, 2023)"
        },
        {
          "t": "Training on the Test Task Confounds Evaluation and Emergence (Dominguez-Olmedo et al., 2024)",
          "u": "https://arxiv.org/abs/2407.07890",
          "tZh": "在测试任务上训练混淆了评测与涌现(Training on the Test Task, 2024)"
        }
      ]
    },
    {
      "id": 5,
      "num": "05",
      "slug": "llm-tuning",
      "title": "LLM Tuning & Alignment",
      "titleZh": "偏好微调与对齐",
      "date": "Oct 31, 2025",
      "duration": "1:47:42",
      "videoId": "PmW_TMQ3l0I",
      "accent": "amber",
      "dateZh": "2025年10月31日",
      "tagline": "Teaching models what humans actually prefer, not just what is likely.",
      "taglineZh": "教模型理解人类真正偏好什么,而不仅仅是什么更可能。",
      "overview": "<p>Pretraining and <strong>SFT</strong> give a helpful autocompleter that follows instructions, but it may answer in the wrong tone, unsafely, or unhelpfully. The third stage, <strong>preference tuning</strong> (alignment), reshapes <em>behavior</em> toward what humans prefer without teaching new facts. The instructor motivates it with one running example: ask an assistant to suggest an activity with your teddy bear and it replies <em>I would suggest you do not spend much time with your teddy bear at all</em> — fluent, but not what we want.</p><p>We cover why likelihood is the wrong objective (humans compare far more reliably than they score), how to collect <strong>pairwise preference pairs</strong>, the two-stage <strong>RLHF</strong> pipeline (reward model then RL), the <strong>Bradley–Terry</strong> reward loss, <strong>PPO</strong> with its clipped and KL-penalty objectives, the cheap inference-time alternative <strong>Best-of-N</strong>, and the RL-free <strong>DPO</strong>, whose loss treats the policy as a secret reward model.</p>",
      "overviewZh": "<p>预训练加 <strong>SFT</strong> 给出一个会遵循指令的有用自动补全器,但它的语气可能不对、不安全或没帮助。第三个阶段 —— <strong>偏好微调</strong>(对齐,alignment)—— 在不教新事实的前提下,把<em>行为</em>重塑得符合人类偏好。讲者用一个贯穿全程的例子作引子:让助手建议一项可以和泰迪熊一起做的活动,它却回答<em>我建议你根本别在泰迪熊身上花太多时间</em> —— 流畅,却不是我们想要的。</p><p>本讲讲解为何似然是错误目标(人类比较远比打分可靠)、如何收集<strong>成对偏好对</strong>、两阶段的 <strong>RLHF</strong> 流程(先奖励模型再 RL)、<strong>Bradley–Terry</strong> 奖励损失、带裁剪与 KL 惩罚两种目标的 <strong>PPO</strong>、便宜的推理期替代方案 <strong>Best-of-N</strong>,以及免强化学习的 <strong>DPO</strong> —— 其损失把策略本身当作一个隐藏的奖励模型。</p>",
      "topics": [
        {
          "name": "Why preference tuning?",
          "nameZh": "为什么需要偏好微调",
          "body": "<p>Why a third stage after SFT? The instructor gives three reasons. First, <strong>comparing is easier than generating</strong>: writing a great poem from scratch (the SFT label) is hard, but shown a bad poem and a good one you can instantly say which is better. Second, SFT is sensitive to the <strong>prompt distribution</strong> — adding one corrective example can over-bias the model toward that kind of prompt. Third, high-quality SFT data is <strong>not scalable</strong>; chasing every misstep with new SFT labels is costly.</p><p>The deeper point: SFT only teaches what the model <em>should</em> say (positive signal); it has no way to say <em>do not generate this</em>. Preference tuning lets us <strong>inject a negative signal</strong>. We collect <strong>preference pairs</strong> \\(y_w \\succ y_l\\) — winner beats loser for the same prompt — and align the model toward what people prefer. A caveat the instructor stresses: if the model misbehaves a lot, it can be a wake-up call to check the SFT data first; preference tuning is not a fix for everything.</p>",
          "bodyZh": "<p>SFT 之后为何还要第三个阶段?讲者给出三个理由。其一,<strong>比较比生成容易</strong>:从零写一首好诗(SFT 的标签)很难,但给你一首差诗和一首好诗,你能立刻说出哪个更好。其二,SFT 对<strong>提示分布</strong>很敏感 —— 多加一个纠错样本就可能把模型过度偏向那类提示。其三,高质量 SFT 数据<strong>难以规模化</strong>;为每个失误都补 SFT 标签代价很高。</p><p>更深的一点:SFT 只教模型<em>应该</em>说什么(正向信号),却无法告诉它<em>别生成这个</em>。偏好微调让我们能<strong>注入负向信号</strong>。我们收集<strong>偏好对</strong> \\(y_w \\succ y_l\\) —— 同一提示下胜者优于败者 —— 并把模型向人们偏好的方向对齐。讲者强调一个提醒:若模型大量失常,这往往是先去检查 SFT 数据的警钟;偏好微调并非万能解药。</p>"
        },
        {
          "name": "Collecting preference data",
          "nameZh": "收集偏好数据",
          "body": "<p>An observation is a (prompt, response) pair. There are three ways to label preferences. <strong>Pointwise</strong> scoring (e.g. 0.4, 0.9, 0.1, 0.2) is hard for humans — what does 0.9 vs 0.2 even mean? <strong>Listwise</strong> ranking of n responses is easier but still fiddly. <strong>Pairwise</strong> (is A better than B?) is easiest, so it is what people use.</p><p>The recipe to get a pair: (1) take a prompt \\(x\\) from logs or a reference distribution, run it through the SFT model <em>twice with positive temperature</em> to get two different responses (or use synthetic outputs / human <strong>rewrites</strong> of a bad logged answer). (2) Label which wins, via <strong>human ratings</strong> or proxies — <strong>LLM-as-a-judge</strong> (covered later), or rule-based BLEU/ROUGE (less used now). Labels can be a <strong>binary</strong> scale (better/worse) or a nuanced one (much better, slightly better, ...). Because many tasks are subjective, people usually settle on the binary scale; the instructor notes human ratings are very sensitive to how objective the annotation guidelines are.</p>",
          "bodyZh": "<p>一个观测就是一个(提示,回答)对。标注偏好有三种方式。<strong>逐点(pointwise)</strong>打分(如 0.4、0.9、0.1、0.2)对人很难 —— 0.9 与 0.2 究竟差在哪?对 n 个回答做<strong>列表(listwise)</strong>排序更容易,但仍繁琐。<strong>成对(pairwise)</strong>(A 是否比 B 好?)最容易,因此人们都用它。</p><p>获取一对的配方:(1)从日志或参考分布取一个提示 \\(x\\),把它<em>带正温度地两次</em>送入 SFT 模型得到两个不同回答(或用合成输出、对日志里差答案的人工<strong>改写</strong>)。(2)标注谁胜,用<strong>人类评分</strong>或代理 —— <strong>LLM 当裁判(LLM-as-a-judge)</strong>(后续讲),或基于规则的 BLEU/ROUGE(现已少用)。标签可用<strong>二元</strong>尺度(更好/更差)或更细的尺度(好很多、略好……)。因许多任务主观,人们通常采用二元尺度;讲者指出人类评分对标注指南是否客观非常敏感。</p>"
        },
        {
          "name": "RL formulation & the RLHF pipeline",
          "nameZh": "RL 形式化与 RLHF 流程",
          "body": "<p>To use preferences we borrow <strong>reinforcement learning</strong>. An agent in a state \\(s_t\\) takes an action \\(a_t\\) under a policy \\(\\pi_\\theta(a_t \\mid s_t)\\) and receives a reward. Mapped to an LLM: the <strong>agent is the LLM</strong>, the <strong>state is the input so far</strong>, the <strong>action is the next token</strong>, the <strong>environment is the vocabulary</strong>, and the <strong>policy is the next-token distribution</strong> from the forward pass. The goal is to learn \\(\\theta\\) so \\(\\pi_\\theta\\) aligns with human preferences.</p><p><strong>RLHF</strong> (Reinforcement Learning from Human Feedback) has two stages: (1) <strong>reward modeling</strong> — input (prompt, response), output a scalar score distinguishing good from bad; (2) <strong>RL</strong> — input a prompt, generate a response more aligned with reward. The <em>human feedback</em> refers to the labels the reward model is trained on; if preferences come from a model instead, it is <strong>RLAIF</strong> (AI feedback). The instructor flags that RLHF gives a <em>sparse</em> signal — roughly one reward per whole completion, not per token as in SFT.</p>",
          "bodyZh": "<p>要用偏好,我们借用<strong>强化学习(RL)</strong>。处于状态 \\(s_t\\) 的智能体,按策略 \\(\\pi_\\theta(a_t \\mid s_t)\\) 采取动作 \\(a_t\\) 并获得奖励。映射到 LLM:<strong>智能体就是 LLM</strong>,<strong>状态是目前的输入</strong>,<strong>动作是下一个词元</strong>,<strong>环境是词表</strong>,<strong>策略是前向得到的下一词元分布</strong>。目标是学到 \\(\\theta\\) 使 \\(\\pi_\\theta\\) 与人类偏好对齐。</p><p><strong>RLHF</strong>(基于人类反馈的强化学习)分两阶段:(1)<strong>奖励建模</strong> —— 输入(提示,回答),输出一个区分好坏的标量分;(2)<strong>RL</strong> —— 输入提示,生成更对齐奖励的回答。其中的<em>人类反馈</em>指训练奖励模型所用的标签;若偏好改由模型给出,则是 <strong>RLAIF</strong>(AI 反馈)。讲者提示 RLHF 的信号是<em>稀疏</em>的 —— 大约每条完整完成才一个奖励,而非像 SFT 那样每个词元都有。</p>"
        },
        {
          "name": "Reward modeling (Bradley–Terry)",
          "nameZh": "奖励建模(Bradley–Terry)",
          "body": "<p>Step 1 builds a model \\(r\\) scoring (prompt, response). The <strong>Bradley–Terry</strong> formulation says the probability that \\(y_i\\) beats \\(y_j\\) is</p>\\[ P(y_i \\succ y_j) = \\frac{e^{r_i}}{e^{r_i}+e^{r_j}} = \\sigma\\big(r_i - r_j\\big), \\]<p>with \\(\\sigma\\) the sigmoid. So if \\(i\\) is better we want \\(r_i\\) high and \\(r_j\\) low. The instructor derives the loss from first principles: assuming pairs are independent, maximize the product \\(\\prod \\sigma(r_w - r_l)\\); take the log (products underflow), flip the sign because ML minimizes, giving</p>\\[ \\mathcal{L} = -\\,\\mathbb{E}_{(x,y_w,y_l)}\\Big[\\log \\sigma\\big(r(x,y_w) - r(x,y_l)\\big)\\Big]. \\]<p>Beautifully, the loss is <em>pairwise</em> but the trained reward model is <strong>pointwise</strong> — it takes one (prompt, response) and emits one number (e.g. a good answer scores 0.8, a bad one −2). Data is \\(O(10{,}000)\\) human-labeled pairs; the model is typically a decoder-only LLM with a classification head (or BERT via the [CLS] token). Scores are normalized per batch; <strong>RewardBench</strong> evaluates such models. Rewards are usually defined along a dimension — helpful, safe, friendly.</p>",
          "bodyZh": "<p>第一步构建一个给(提示,回答)打分的模型 \\(r\\)。<strong>Bradley–Terry</strong> 公式给出 \\(y_i\\) 胜过 \\(y_j\\) 的概率:</p>\\[ P(y_i \\succ y_j) = \\frac{e^{r_i}}{e^{r_i}+e^{r_j}} = \\sigma\\big(r_i - r_j\\big), \\]<p>其中 \\(\\sigma\\) 是 sigmoid。故若 \\(i\\) 更好,我们要 \\(r_i\\) 高、\\(r_j\\) 低。讲者从第一性原理推导损失:设各对相互独立,最大化乘积 \\(\\prod \\sigma(r_w - r_l)\\);取对数(乘积会下溢),再因机器学习习惯最小化而取负号,得</p>\\[ \\mathcal{L} = -\\,\\mathbb{E}_{(x,y_w,y_l)}\\Big[\\log \\sigma\\big(r(x,y_w) - r(x,y_l)\\big)\\Big]. \\]<p>妙处在于:损失是<em>成对</em>的,但训练出的奖励模型是<strong>逐点</strong>的 —— 输入一个(提示,回答)就吐出一个数(如好答案打 0.8,差答案打 −2)。数据约 \\(O(10{,}000)\\) 个人工标注对;模型通常是带分类头的仅解码器 LLM(或用 [CLS] 词元的 BERT)。分数会按批归一化;<strong>RewardBench</strong> 用于评测此类模型。奖励通常沿某个维度定义 —— 有用、安全、友好。</p>"
        },
        {
          "name": "RL with PPO",
          "nameZh": "用 PPO 做强化学习",
          "body": "<p>Step 2 tunes the policy (LLM, initialized at SFT) with the <em>frozen</em> reward model over \\(O(100{,}000)\\) prompts. The objective <strong>maximizes reward while staying near the base model</strong> via a KL term — three reasons: avoid catastrophic forgetting, avoid <strong>reward hacking</strong> (the reward model is imperfect), and avoid instability. The instructor's reward-hacking analogy: if a lecturer optimizes for loud applause instead of being informative, telling jokes maximizes the proxy but fails the true goal.</p><p>Subtlety: PPO maximizes <strong>advantage</strong> (\\(\\approx\\) reward − baseline), which lowers variance. The baseline comes from a <strong>value function</strong> — a token-level head trained jointly with the policy to predict the reward if generation continues under the policy (estimated via GAE). <strong>PPO-Clip</strong> caps the policy-update size:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon)\\,A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\text{old}}(a_t \\mid s_t)}. \\]<p>Here \\(\\rho_t\\) is a probability <em>ratio</em> (not a reward), and <em>old</em> is the previous RL iteration. The <strong>KL-penalty</strong> variant uses \\(\\rho_t A_t - \\beta\\,\\mathrm{KL}\\) against the reference. PPO is powerful but juggles four models — policy, value, reward, base.</p>",
          "bodyZh": "<p>第二步用<em>冻结</em>的奖励模型在约 \\(O(100{,}000)\\) 条提示上微调策略(LLM,以 SFT 初始化)。目标是<strong>最大化奖励同时贴近基座模型</strong>,靠一个 KL 项实现 —— 三个理由:避免灾难性遗忘、避免<strong>奖励黑客(reward hacking)</strong>(奖励模型不完美)、避免不稳定。讲者的奖励黑客类比:若讲师只优化掌声大小而非信息量,讲笑话能最大化代理指标却背离真实目标。</p><p>细节:PPO 最大化的是<strong>优势(advantage)</strong>(\\(\\approx\\) 奖励 − 基线),以降低方差。基线来自<strong>价值函数</strong> —— 一个与策略联合训练的词元级头,预测若按策略续写最终能得多少奖励(用 GAE 估计)。<strong>PPO-Clip</strong> 限制策略更新幅度:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon)\\,A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\text{old}}(a_t \\mid s_t)}. \\]<p>这里 \\(\\rho_t\\) 是概率<em>比率</em>(不是奖励),<em>old</em> 指上一轮 RL 迭代。<strong>KL 惩罚</strong>变体用 \\(\\rho_t A_t - \\beta\\,\\mathrm{KL}\\) 对参考模型做约束。PPO 强大但要同时维护四个模型 —— 策略、价值、奖励、基座。</p>"
        },
        {
          "name": "Best-of-N & challenges of RL",
          "nameZh": "Best-of-N 与 RL 的挑战",
          "body": "<p>The instructor lists RL pain points: it is a brittle <strong>two-stage</strong> process (a flaw in the reward model forces redoing everything), has many <strong>hyperparameters</strong> (\\(\\beta\\), \\(\\epsilon\\), GAE knobs), suffers <strong>instability</strong>, lacks a clean training metric (you can only watch average reward), and needs <strong>diversity</strong> in completions to explore. It is <strong>on-policy</strong>: the model trains on samples it generated itself, unlike off-policy SFT on external data. Alternatives like <strong>REINFORCE</strong> and <strong>GRPO</strong> (next lecture) drop some of the machinery.</p><p>If you have a reward model but want no RL, use <strong>Best-of-N (BoN)</strong>: with the frozen SFT model, sample N completions, score each with the reward model, and return the top one. For the teddy-bear prompt the three samples score 0.8, −2, 0.2, so you return the 0.8 answer. The cost is pushed to <strong>inference</strong> — N forward passes per query, painful under traffic. A subtle point: even with infinite parallel compute, latency is the <em>max</em> over N samples, whose distribution shifts right, so you wait longer than a single pass.</p>",
          "bodyZh": "<p>讲者列出 RL 的痛点:它是脆弱的<strong>两阶段</strong>流程(奖励模型一旦有缺陷就得全部重来),有许多<strong>超参数</strong>(\\(\\beta\\)、\\(\\epsilon\\)、GAE 的旋钮),存在<strong>不稳定</strong>,缺少干净的训练指标(只能盯平均奖励),且需要完成上的<strong>多样性</strong>来探索。它是<strong>同策略(on-policy)</strong>的:模型在自己生成的样本上训练,不同于在外部数据上的异策略(off-policy)SFT。<strong>REINFORCE</strong> 与 <strong>GRPO</strong>(下一讲)等替代方案省掉了部分机制。</p><p>若你已有奖励模型却不想做 RL,可用 <strong>Best-of-N(BoN)</strong>:用冻结的 SFT 模型采样 N 个完成,用奖励模型各打一分,返回最高的那个。对泰迪熊提示,三个样本分别得 0.8、−2、0.2,于是返回 0.8 的答案。代价被推到<strong>推理期</strong> —— 每个查询要 N 次前向,在高流量下很痛。一个微妙点:即便有无限并行算力,延迟是 N 个样本的<em>最大值</em>,其分布向右偏移,所以仍比单次前向等得更久。</p>"
        },
        {
          "name": "DPO: Direct Preference Optimization",
          "nameZh": "DPO:直接偏好优化",
          "body": "<p><strong>DPO</strong> answers the recurring question — why not just supervise? It rewrites alignment as one loss with <strong>no reward model and no RL loop</strong>. The derivation: start from the PPO objective, solve for the optimal policy \\(\\pi^*\\) (a closed form involving reward and a partition function \\(Z\\) that only normalizes), rearrange to express the <strong>reward as a function of the policy</strong>, plug that into Bradley–Terry, and infer the loss:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)}\\Big)\\Big]. \\]<p>There is no \\(r(x,y)\\) — hence the title <em>Your Language Model is Secretly a Reward Model</em>. It just raises the reference-normalized probability of \\(y_w\\) and lowers \\(y_l\\)'s, with \\(\\beta \\approx 0.1\\) the same KL strength as PPO. Only <strong>two models</strong> are needed (trained \\(\\pi_\\theta\\), frozen \\(\\pi_{\\text{ref}}\\)). Trade-offs (Xu et al. 2024): RLHF/PPO generally scores higher for experts who can tune it, while DPO is far simpler; its weakness is a <strong>distribution shift</strong> (fitting data the model did not generate). For the washer prompt, DPO turns a rough <em>No, it might get damaged</em> into a gentle <em>It is better not to — your teddy could get hurt; a gentle hand wash is safer</em>. Variants include IPO, KTO and ORPO.</p>",
          "bodyZh": "<p><strong>DPO</strong> 回答了反复出现的问题 —— 为什么不直接监督?它把对齐改写成一个损失,<strong>无奖励模型、无 RL 循环</strong>。推导:从 PPO 目标出发,解出最优策略 \\(\\pi^*\\)(一个含奖励与仅做归一化的配分函数 \\(Z\\) 的闭式),重排以把<strong>奖励表示为策略的函数</strong>,代入 Bradley–Terry,再推得损失:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)}\\Big)\\Big]. \\]<p>式中没有 \\(r(x,y)\\) —— 故论文题为<em>你的语言模型其实暗中是个奖励模型</em>。它只是抬高(相对参考归一化后)\\(y_w\\) 的概率、压低 \\(y_l\\) 的概率,其中 \\(\\beta \\approx 0.1\\) 与 PPO 的 KL 强度相同。只需<strong>两个模型</strong>(被训练的 \\(\\pi_\\theta\\)、冻结的 \\(\\pi_{\\text{ref}}\\))。权衡(Xu 等,2024):对能调好它的专家,RLHF/PPO 总体分更高,而 DPO 简单得多;其弱点是<strong>分布偏移</strong>(拟合的是模型自己没生成过的数据)。对洗衣机提示,DPO 把生硬的<em>不行,可能会损坏</em>变成温柔的<em>最好别 —— 你的泰迪可能会受伤;轻柔手洗更安全</em>。变体包括 IPO、KTO、ORPO。</p>"
        }
      ],
      "takeaways": [
        "Likelihood is the wrong objective: humans compare two answers far more reliably than they score one, so we tune on preference pairs (winner beats loser).",
        "Preference tuning injects a negative signal SFT cannot, but heavy misbehavior may instead signal bad SFT data.",
        "RLHF = SFT -> reward model (Bradley-Terry pairwise loss, pointwise at inference) -> RL that maximizes reward with a KL leash to the reference.",
        "The KL penalty prevents reward hacking (clapping-for-jokes), forgetting, and instability; PPO clips the policy ratio and juggles four models.",
        "Best-of-N skips RL by sampling N and keeping the top-scored answer, but pushes cost to inference.",
        "DPO is RL-free: a closed-form derivation makes the reward implicit in the policy, giving a single classification loss on pairs with just two models."
      ],
      "takeawaysZh": [
        "似然是错误目标:人类比较两个答案远比给一个答案打分可靠,所以我们在偏好对(胜者优于败者)上微调。",
        "偏好微调能注入 SFT 给不了的负向信号,但大量失常也可能是 SFT 数据有问题的信号。",
        "RLHF = SFT -> 奖励模型(Bradley-Terry 成对损失,推理时逐点)-> 用带参考 KL 拴绳的 RL 最大化奖励。",
        "KL 惩罚防止奖励黑客(为笑话鼓掌)、遗忘与不稳定;PPO 裁剪策略比率,并要同时维护四个模型。",
        "Best-of-N 通过采样 N 个并保留得分最高者来跳过 RL,但把代价推到推理期。",
        "DPO 免强化学习:闭式推导让奖励隐含在策略里,只用两个模型,在偏好对上得到单一分类损失。"
      ],
      "refs": [
        {
          "t": "Training language models to follow instructions with human feedback — InstructGPT (Ouyang et al., 2022)",
          "u": "https://arxiv.org/abs/2203.02155",
          "tZh": "用人类反馈训练语言模型遵循指令 —— InstructGPT,RLHF 流程的范本(原名 Training language models to follow instructions with human feedback, 2022)"
        },
        {
          "t": "Rank analysis of incomplete block designs: the method of paired comparisons (Bradley & Terry, 1952)",
          "u": "https://www.jstor.org/stable/2334029",
          "tZh": "成对比较法的不完全区组设计秩分析 —— 奖励建模所用 Bradley–Terry 公式的来源(原名 Rank Analysis of Incomplete Block Designs, 1952)"
        },
        {
          "t": "Proximal Policy Optimization Algorithms — PPO (Schulman et al., 2017)",
          "u": "https://arxiv.org/abs/1707.06347",
          "tZh": "近端策略优化算法 —— PPO,RLHF 默认 RL 算法,含裁剪与 KL 惩罚两种目标(原名 Proximal Policy Optimization Algorithms, 2017)"
        },
        {
          "t": "High-Dimensional Continuous Control Using Generalized Advantage Estimation — GAE (Schulman et al., 2015)",
          "u": "https://arxiv.org/abs/1506.02438",
          "tZh": "用广义优势估计做高维连续控制 —— PPO 估计优势所用的 GAE 方法(原名 High-Dimensional Continuous Control Using GAE, 2015)"
        },
        {
          "t": "RewardBench: Evaluating Reward Models for Language Modeling (Lambert et al., 2024)",
          "u": "https://arxiv.org/abs/2403.13787",
          "tZh": "RewardBench:评测语言建模的奖励模型(原名 RewardBench, 2024)"
        },
        {
          "t": "Direct Preference Optimization: Your Language Model is Secretly a Reward Model — DPO (Rafailov et al., 2023)",
          "u": "https://arxiv.org/abs/2305.18290",
          "tZh": "直接偏好优化:你的语言模型其实暗中是个奖励模型 —— DPO(原名 Direct Preference Optimization, 2023)"
        },
        {
          "t": "Is DPO Superior to PPO for LLM Alignment? A Comprehensive Study (Xu et al., 2024)",
          "u": "https://arxiv.org/abs/2404.10719",
          "tZh": "在大模型对齐上 DPO 优于 PPO 吗?一项全面研究 —— DPO 与 PPO 的取舍对比(原名 Is DPO Superior to PPO for LLM Alignment?, 2024)"
        },
        {
          "t": "DeepSeekMath: Pushing the Limits of Mathematical Reasoning — introduces GRPO (Shao et al., 2024)",
          "u": "https://arxiv.org/abs/2402.03300",
          "tZh": "DeepSeekMath:推进数学推理极限 —— 提出 GRPO,作为 PPO 替代方案的预告(原名 DeepSeekMath, 2024)"
        }
      ]
    },
    {
      "id": 6,
      "num": "06",
      "slug": "llm-reasoning",
      "title": "LLM Reasoning",
      "titleZh": "大模型推理",
      "date": "Nov 7, 2025",
      "duration": "1:47:10",
      "videoId": "k5Fh-UgTuCo",
      "accent": "rose",
      "dateZh": "2025年11月7日",
      "tagline": "Spending compute to think — long chains of thought trained by RL with verifiable rewards.",
      "taglineZh": "用算力去「思考」 —— 由可验证奖励的强化学习训练出的长思维链。",
      "overview": "<p>This is the 2024–25 leap. We move from <em>vanilla</em> LLMs that map a prompt straight to an answer, to <strong>reasoning models</strong> whose output is <em>reasoning chain + answer</em>. The instructor builds it in the slide order: what reasoning models are (and how to spot one), the benchmarks and <strong>pass@k</strong> metric that score them, why we reach for <strong>RL with verifiable rewards</strong> instead of SFT, the <strong>GRPO</strong> algorithm that drops PPO's value network, the <em>increasing-length</em> pathology that GRPO can cause and how DAPO / Dr. GRPO fix it, and finally how DeepSeek stitched it all together into <strong>R1-Zero</strong> and <strong>R1</strong>. The framing throughout: reasoning is a <em>trained behavior</em>, and letting the model emit more tokens is letting it spend more compute — a brand-new scaling axis at <em>inference</em> time.</p>",
      "overviewZh": "<p>这是 2024–25 年的飞跃。我们从把提示直接映射为答案的<em>朴素(vanilla)</em>大模型,走向<strong>推理模型</strong> —— 其输出是<em>思维链 + 答案</em>。讲解严格沿着幻灯片顺序展开:推理模型是什么(以及如何辨认它)、给它们打分的基准与 <strong>pass@k</strong> 指标、为何选用<strong>可验证奖励的强化学习(RL)</strong>而非 SFT、去掉 PPO 价值网络的 <strong>GRPO</strong> 算法、GRPO 可能引发的<em>输出变长</em>病态及 DAPO / Dr. GRPO 的修正,最后是 DeepSeek 如何把这一切拼接成 <strong>R1-Zero</strong> 与 <strong>R1</strong>。贯穿全篇的视角是:推理是一种<em>被训练出来的行为</em>,而让模型多吐词元就是让它多花算力 —— 一条全新的、发生在<em>推理期</em>的扩展轴。</p>",
      "topics": [
        {
          "name": "Reasoning models: chain of thought at scale",
          "nameZh": "推理模型:大规模的思维链",
          "body": "<p>The instructor first defines (tentatively) <strong>reasoning</strong> as the <em>ability to solve a problem</em> through a multi-step process — like breaking down an exam question. The contrast: <code>What is the course code of Stanford's Transformers and LLMs class?</code> is pure knowledge (CME 295), whereas <code>A bear was born in 2020, how old is it in 2025?</code> needs steps.</p><p>The core idea revives <strong>chain-of-thought (CoT)</strong> prompting (Wei et al., 2022) but does it <em>at much larger scale</em>: instead of mapping <code>Question → Answer</code>, the model emits <code>Question → reasoning chain → Answer</code>, so the output is <strong>reasoning + answer</strong>. Intuition for why this helps: a hard problem rarely appeared verbatim in training, so the model decomposes it into tractable sub-problems it <em>has</em> seen patterns for; and emitting more tokens literally buys more compute (one forward pass per token), what people call the <strong>compute budget</strong>.</p><p>You can spot a reasoning model by the word <em>thinking</em> in the UI. Crucially the shown <em>thought summary</em> is not the raw chain — providers hide it because it may be unintelligible, users do not want pages of it, and competitors could otherwise train on those chains. Note: you are billed for reasoning tokens as output tokens.</p>",
          "bodyZh": "<p>讲师先给出(尝试性的)定义:<strong>推理</strong>是通过多步过程<em>解决问题的能力</em> —— 就像把一道考题拆成几步。对比一下:<code>斯坦福 Transformers 与大模型课程的课程代码是什么?</code>纯属知识(CME 295),而<code>一只熊出生于 2020 年,到 2025 年它几岁?</code>则需要分步。</p><p>核心思路复用了<strong>思维链(chain-of-thought, CoT)</strong>提示(Wei 等,2022),但把它放到<em>大得多的规模</em>上做:不再是<code>问题 → 答案</code>,而是让模型先产出<code>问题 → 思维链 → 答案</code>,因此输出是<strong>推理 + 答案</strong>。为何有用的直觉:难题很少在训练中原样出现,于是模型把它拆解成自己<em>见过</em>模式的可处理子问题;而且多吐词元字面上就是买到更多算力(每个词元一次前向),即人们说的<strong>算力预算(compute budget)</strong>。</p><p>辨认推理模型,看界面里的<em>thinking(思考)</em>字样。关键是:界面展示的<em>思维摘要(thought summary)</em>并非原始思维链 —— 厂商把原始链藏起来,因为它可能难以读懂、用户也不想读好几页,且对手否则能拿这些链去训练。注意:推理词元会作为输出词元向你计费。</p>"
        },
        {
          "name": "Benchmarks and the pass@k metric",
          "nameZh": "基准与 pass@k 指标",
          "body": "<p>Two benchmark families dominate, both <em>verifiable</em>. <strong>Coding</strong>: produce a solution that passes all test cases — HumanEval (~164 human-written problems), CodeForces (competitive programming), SWE-bench (real GitHub issues). <strong>Math</strong>: parse the model's answer (often forced into a box) and compare to ground truth — AIME (the US Math Olympiad qualifier) and GSM8K (grade-school).</p><p>The headline metric is <strong>pass@k</strong>: the probability that at least one of \\(k\\) attempts succeeds. Estimating it from only \\(k\\) samples is noisy, so you draw \\(n\\) samples, count \\(c\\) successes, and ask: if I picked \\(k\\) of these \\(n\\), what is the chance at least one passes? Using the at-least-one trick (one minus all-incorrect) and sampling-without-replacement, the instructor derives:</p>\\[ \\text{pass@}k = 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}}. \\]<p>The special case <strong>pass@1</strong> reduces to the fraction of correct attempts. Pass@k mirrors lecture 5's best-of-\\(n\\), but with a deterministic verifier instead of a reward model. <strong>Temperature</strong> matters: at \\(t{=}0\\) samples are good but identical (pass@k stays flat); raising it adds diversity that helps, but too high (e.g. \\(t{=}1.2\\)) harms quality — papers always report the temperature. Also seen: <strong>cons@k</strong> (consensus / majority voting), tied to self-consistency.</p>",
          "bodyZh": "<p>两大基准家族占主导,且都<em>可验证</em>。<strong>编程</strong>:产出能通过所有测试用例的解 —— HumanEval(约 164 道人工编写题)、CodeForces(竞赛编程)、SWE-bench(真实 GitHub issue)。<strong>数学</strong>:解析模型答案(常被强制放进一个方框)并与标准答案比对 —— AIME(美国数学奥赛资格赛)与 GSM8K(小学水平)。</p><p>头号指标是 <strong>pass@k</strong>:\\(k\\) 次尝试中至少一次成功的概率。只用 \\(k\\) 个样本估计它会很嘈杂,于是抽 \\(n\\) 个样本、数出 \\(c\\) 个成功,再问:若从这 \\(n\\) 个里挑 \\(k\\) 个,至少一个通过的概率是多少?用「至少一个 = 1 减去全部错误」的技巧加上无放回抽样,讲师推导出:</p>\\[ \\text{pass@}k = 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}}. \\]<p>特例 <strong>pass@1</strong> 化简为正确尝试的比例。pass@k 与第 5 讲的 best-of-\\(n\\) 相似,只是把奖励模型换成了确定性的验证器。<strong>温度</strong>很关键:\\(t{=}0\\) 时样本好但雷同(pass@k 持平);升高它带来有益的多样性,但过高(如 \\(t{=}1.2\\))会损害质量 —— 论文总会报告所用温度。还会见到 <strong>cons@k</strong>(共识 / 多数投票),与自洽性(self-consistency)相关。</p>"
        },
        {
          "name": "RL with verifiable rewards (and controlling the thinking)",
          "nameZh": "可验证奖励的强化学习(以及控制思考量)",
          "body": "<p>How do we get long reasoning chains <em>at scale</em>? Not SFT: writing long chains by hand is impractical, and we do not want to <em>limit</em> the model to human-written reasoning (the model may reason differently from us). But reasoning tasks come with a <strong>natural verifiable reward</strong> — did it solve the problem, yes or no? So: try RL.</p><p>The recipe uses two simple, model-free rewards. <strong>Reward 1 (formatting):</strong> check the reasoning chain is present via <code>&lt;think&gt;...&lt;/think&gt;</code> delimiters. <strong>Reward 2 (accuracy):</strong> verify the solution — all test cases pass for code, or the parsed answer matches ground truth for math. Total <em>reward = formatting + accuracy</em>. Running RL on just these, AIME accuracy climbs steadily over RL steps (this is the DeepSeek-R1-Zero curve).</p><p>Since <em>not all prompts are equal</em>, much work controls the amount of thinking: a <strong>dynamic budget</strong> (a classifier flags high- vs low-thinking prompts), <strong>context awareness</strong> (the chain must fit the context window), and <strong>budget forcing</strong> (s1, Muennighoff et al., 2025) — inject a token like <code>Wait</code> to make it think more, or <code>Time is up, my answer is</code> to force a stop. A separate line uses <strong>continuous thoughts</strong> (Hao et al., 2024): think in compressed latent representations rather than language tokens.</p>",
          "bodyZh": "<p>如何<em>大规模</em>地得到长思维链?不靠 SFT:手写长链不现实,而且我们不想把模型<em>限制</em>在人类写的推理上(模型的推理方式也许与我们不同)。但推理任务自带一个<strong>天然的可验证奖励</strong> —— 它解出问题了吗,是或否?那就:试试 RL。</p><p>配方用两个简单、无需模型的奖励。<strong>奖励 1(格式):</strong>通过 <code>&lt;think&gt;...&lt;/think&gt;</code> 分隔符检查思维链是否存在。<strong>奖励 2(正确性):</strong>验证解 —— 代码要通过所有测试用例,数学则比对解析出的答案与标准答案。总奖励 <em>= 格式 + 正确性</em>。仅凭这两项做 RL,AIME 准确率就随 RL 步数稳步攀升(这正是 DeepSeek-R1-Zero 的曲线)。</p><p>由于<em>并非所有提示都一样</em>,大量工作在控制思考量:<strong>动态预算(dynamic budget)</strong>(用分类器判定提示属高思考还是低思考)、<strong>上下文感知</strong>(思维链必须放得进上下文窗口),以及<strong>预算强制(budget forcing)</strong>(s1,Muennighoff 等,2025) —— 插入像 <code>Wait</code> 这样的词让它多想,或用 <code>时间到了,我的答案是</code> 强制它收尾。另一条路线用<strong>连续思维(continuous thoughts)</strong>(Hao 等,2024):在压缩的隐空间表示里思考,而非在语言词元里思考。</p>"
        },
        {
          "name": "GRPO: group-relative advantage, no value net",
          "nameZh": "GRPO:组相对优势,无价值网络",
          "body": "<p><strong>GRPO (Group Relative Policy Optimization)</strong> (Shao et al., DeepSeekMath, 2024) is the go-to RL algorithm for reasoning. Like PPO it does two things — maximize advantages and not deviate too much from the old/base model — but it differs in <em>how it computes the advantage</em>. PPO trains a separate <strong>value function</strong> jointly with the policy and feeds it through Generalized Advantage Estimation; that critic is the expensive bottleneck.</p><p>GRPO drops it. For one prompt it samples a <em>group</em> of \\(G\\) completions, scores each, and sets each completion's advantage <em>relative to its group</em>: reward minus the group mean, over the group standard deviation:</p>\\[ \\hat{A}_i = \\frac{r_i - \\operatorname{mean}(r_1,\\dots,r_G)}{\\operatorname{std}(r_1,\\dots,r_G)}. \\]<p>Intuition: a high reward on an easy problem is unremarkable, but a correct answer on a hard problem (where most of the group fails) should up-weight those tokens hard — the group baseline bakes difficulty in. Two more contrasts: GRPO puts the <strong>KL term explicitly in the objective</strong>, whereas PPO usually folds KL into the per-token reward; and in the reasoning setting there is <em>no reward model at all</em> (the reward is verifiable), so GRPO trains <strong>only the policy</strong> while PPO trains policy <em>and</em> value. The instructor calls this the hardest part of the whole class.</p>",
          "bodyZh": "<p><strong>GRPO(组相对策略优化,Group Relative Policy Optimization)</strong>(Shao 等,DeepSeekMath,2024)是推理训练的首选 RL 算法。它与 PPO 做的两件事相同 —— 最大化优势、且不偏离旧模型/基座模型太远 —— 但区别在于<em>如何计算优势</em>。PPO 要与策略联合训练一个独立的<strong>价值函数</strong>,并经广义优势估计(GAE)送入;那个评论家(critic)正是昂贵的瓶颈。</p><p>GRPO 把它去掉。对一个提示,它采样一<em>组</em> \\(G\\) 个补全,逐个打分,并把每个补全的优势设为<em>相对其组</em>而言:奖励减去组内均值,再除以组内标准差:</p>\\[ \\hat{A}_i = \\frac{r_i - \\operatorname{mean}(r_1,\\dots,r_G)}{\\operatorname{std}(r_1,\\dots,r_G)}. \\]<p>直觉:简单题上的高奖励不足为奇,但难题上(组内大多失败)的正确答案就该把那些词元的概率大幅上调 —— 组基线把难度也烘焙了进去。还有两点对比:GRPO 把 <strong>KL 项显式放进目标函数</strong>,而 PPO 通常把 KL 折进逐词元奖励;且在推理设定里<em>根本没有奖励模型</em>(奖励可验证),所以 GRPO <strong>只训练策略</strong>,而 PPO 同时训练策略<em>和</em>价值。讲师称这是全课最难的部分。</p>"
        },
        {
          "name": "The increasing-length pathology and its fixes",
          "nameZh": "输出变长的病态及其修正",
          "body": "<p>An empirical observation in RL training: average response length keeps rising. Early on this tracks rising performance (richer reasoning), but later <em>performance plateaus while length keeps growing</em> — wasteful, since you pay for those tokens. The culprit is GRPO's per-output normalization. The objective sums over the group and over tokens, with a factor \\(\\tfrac{1}{|o_i|}\\) that depends only on which output a token sits in:</p>\\[ \\mathcal{J}_{\\text{GRPO}} \\sim \\sum_{i=1}^{G} \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\big(\\text{clipped ratio}\\times \\hat{A}_{i}\\big) - \\beta\\, \\mathbb{D}_{\\text{KL}}. \\]<p>So a token in a <em>short</em> output carries a bigger weight than the same token in a long one. For negative advantage this means a <strong>short bad output is penalized more than a long bad output</strong> — a bad incentive that pushes the model toward longer bad outputs. Fixes equalize token-level contributions: <strong>DAPO</strong> (Yu et al., 2025) uses a normalizer common to all tokens, and <strong>Dr. GRPO</strong> (Liu et al., 2025) removes the factor entirely. The result: correct samples keep their length, but incorrect samples get much shorter. Two further tweaks the instructor flags: the <strong>std in the advantage</strong> biases by difficulty (hard prompts give mostly failures → tiny std → blow-up), and using <strong>asymmetric clipping epsilons</strong> so very-low-probability tokens (whose room to grow is \\(1+\\epsilon\\) times a tiny \\(\\pi_{\\text{old}}\\)) are not unfairly stuck — encouraging diversity.</p>",
          "bodyZh": "<p>RL 训练中的一个经验观察:平均回答长度持续上升。早期它与性能上升同步(推理更丰富),但后期<em>性能见顶、长度却仍在增长</em> —— 很浪费,因为这些词元要付费。罪魁是 GRPO 的逐输出归一化。目标在组与词元上求和,带一个只取决于词元落在哪个输出里的因子 \\(\\tfrac{1}{|o_i|}\\):</p>\\[ \\mathcal{J}_{\\text{GRPO}} \\sim \\sum_{i=1}^{G} \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\big(\\text{裁剪后的比率}\\times \\hat{A}_{i}\\big) - \\beta\\, \\mathbb{D}_{\\text{KL}}. \\]<p>于是<em>短</em>输出里的某词元权重大于同一词元在长输出里的权重。对负优势而言,这意味着<strong>短的差输出被罚得比长的差输出更狠</strong> —— 一个坏激励,把模型推向更长的差输出。修正办法是均衡词元级贡献:<strong>DAPO</strong>(Yu 等,2025)用对所有词元通用的归一化因子,<strong>Dr. GRPO</strong>(Liu 等,2025)则干脆去掉该因子。结果是:正确样本长度不变,而错误样本变得短得多。讲师还点出两处微调:<strong>优势里的标准差</strong>会按难度引入偏置(难题大多失败 → 标准差极小 → 数值放大),以及使用<strong>非对称的裁剪 \\(\\epsilon\\)</strong>,使概率极低的词元(其增长空间是 \\(1+\\epsilon\\) 乘以一个极小的 \\(\\pi_{\\text{old}}\\))不被不公平地卡死 —— 以鼓励多样性。</p>"
        },
        {
          "name": "Stitching it together: DeepSeek R1-Zero, R1, and distillation",
          "nameZh": "拼接全图:DeepSeek R1-Zero、R1 与蒸馏",
          "body": "<p>DeepSeek starts from a <strong>V3-Base</strong> pretrained model (a Mixture-of-Experts, ~671B total / ~37B active, reusing multi-head latent attention from V2). <strong>R1-Zero</strong> is a proof of concept: apply GRPO with verifiable rewards <em>directly</em> on the base model — no SFT at all — using the famous <code>&lt;think&gt;...&lt;/think&gt; &lt;answer&gt;...&lt;/answer&gt;</code> template. Benefit: reasoning emerges with zero SFT. Challenge: the chains have formatting and readability issues, including <strong>language mixing</strong>.</p><p><strong>R1</strong> is the full 5-stage pipeline that fixes this: (1) pretrain V3-Base; (2) <em>small-scale</em> cold-start SFT on long CoTs generated by R1-Zero and rewritten by humans for clean formatting; (3) GRPO with reward = formatting + accuracy + a <strong>language-consistency</strong> term (ratio of target-language tokens); (4) <em>large-scale</em> SFT mixing ~600k reasoning pairs (built by <strong>rejection sampling</strong> R1-so-far via rules + a V3 judge) with ~200k general pairs reused from V3 (≈3:1); (5) a final GRPO over reasoning <em>and</em> non-reasoning data — reasoning keeps formatting+accuracy, non-reasoning adds <strong>helpfulness</strong> (user-facing) and <strong>harmlessness</strong> (applied to the whole output, including the think section). Results: a clear reasoning vs non-reasoning cluster gap, and R1 competitive with closed-source reasoning models.</p><p>Finally, <strong>distillation</strong>: unlike lecture 2's soft-label next-token matching, here R1 (teacher) generates entire responses <em>with</em> thinking tokens offline, then a smaller model is SFT'd to reproduce those full sequences. It is competitive with o1-mini, and at small scale distilling beats running RL from scratch — a good use of compute.</p>",
          "bodyZh": "<p>DeepSeek 从一个 <strong>V3-Base</strong> 预训练模型出发(混合专家 MoE,约 6710 亿总参 / 约 370 亿激活,复用了 V2 的多头潜在注意力 MLA)。<strong>R1-Zero</strong> 是概念验证:<em>直接</em>在基座模型上用可验证奖励做 GRPO —— 完全不做 SFT —— 采用那套著名模板 <code>&lt;think&gt;...&lt;/think&gt; &lt;answer&gt;...&lt;/answer&gt;</code>。好处:零 SFT 也涌现出推理。挑战:思维链存在格式与可读性问题,包括<strong>语言混杂</strong>。</p><p><strong>R1</strong> 是修复这些问题的完整五阶段流程:(1)预训练 V3-Base;(2)<em>小规模</em>冷启动 SFT,用 R1-Zero 生成、再经人工改写以规范格式的长思维链;(3)GRPO,奖励 = 格式 + 正确性 + <strong>语言一致性</strong>项(目标语言词元的比例);(4)<em>大规模</em> SFT,混合约 60 万条推理样本(对「目前的 R1」用规则 + V3 裁判做<strong>拒绝采样(rejection sampling)</strong>构建)与约 20 万条复用自 V3 的通用样本(约 3:1);(5)最后在推理<em>与</em>非推理数据上再做一次 GRPO —— 推理仍用格式 + 正确性,非推理加入<strong>有用性(helpfulness,面向用户)</strong>与<strong>无害性(harmlessness,作用于整段输出,含 think 部分)</strong>。结果:推理与非推理模型呈现明显的两簇差距,且 R1 与闭源推理模型相当。</p><p>最后是<strong>蒸馏</strong>:不同于第 2 讲的软标签逐词元分布匹配,这里由 R1(教师)离线生成<em>带</em>思考词元的整段回答,再对一个较小模型做 SFT 以复现这些完整序列。它与 o1-mini 相当;且在小规模下,蒸馏胜过从零做 RL —— 是算力的好用法。</p>"
        }
      ],
      "takeaways": [
        "Reasoning models output reasoning chain + answer; reasoning is a trained behavior (CoT at scale), and more tokens = more inference-time compute.",
        "Reasoning tasks have verifiable rewards: format (think tokens present) + accuracy (tests pass / answer matches). No reward model needed.",
        "pass@k = 1 − C(n−c,k)/C(n,k) estimates the chance one of k attempts succeeds; pass@1 is the success fraction; temperature trades quality vs diversity.",
        "GRPO drops PPO's value network and sets advantage = (reward − group mean) / group std over a sampled group of completions.",
        "GRPO's 1/|output| factor over-rewards length; DAPO and Dr. GRPO equalize/remove it so bad outputs stop growing longer.",
        "DeepSeek R1-Zero = RL-only proof of concept; R1 = 5-stage pipeline (cold-start SFT → GRPO → large SFT → GRPO); R1-Distill = SFT a small model on R1's full traces."
      ],
      "takeawaysZh": [
        "推理模型输出「思维链 + 答案」;推理是被训练出的行为(大规模 CoT),多吐词元 = 推理期多花算力。",
        "推理任务自带可验证奖励:格式(存在 think 词元)+ 正确性(测试通过 / 答案匹配)。无需奖励模型。",
        "pass@k = 1 − C(n−c,k)/C(n,k) 估计 k 次尝试至少一次成功的概率;pass@1 即成功比例;温度在质量与多样性间权衡。",
        "GRPO 去掉 PPO 的价值网络,在采样的一组补全上令优势 =(奖励 − 组均值)/ 组标准差。",
        "GRPO 的 1/|输出| 因子过度奖励长度;DAPO 与 Dr. GRPO 将其均衡/移除,使差输出不再越变越长。",
        "DeepSeek R1-Zero = 纯 RL 的概念验证;R1 = 五阶段流程(冷启动 SFT → GRPO → 大规模 SFT → GRPO);R1-Distill = 在 R1 的完整轨迹上对小模型做 SFT。"
      ],
      "refs": [
        {
          "t": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (DeepSeek-AI, 2025)",
          "u": "https://arxiv.org/abs/2501.12948",
          "tZh": "DeepSeek-R1:用强化学习激励大模型的推理能力(DeepSeek-AI, 2025)"
        },
        {
          "t": "DeepSeekMath — introduces GRPO (Shao et al., 2024)",
          "u": "https://arxiv.org/abs/2402.03300",
          "tZh": "DeepSeekMath —— 提出 GRPO(Shao 等, 2024)"
        },
        {
          "t": "Chain-of-Thought Prompting Elicits Reasoning in LLMs (Wei et al., 2022)",
          "u": "https://arxiv.org/abs/2201.11903",
          "tZh": "思维链提示激发大模型推理(Wei 等, 2022)"
        },
        {
          "t": "Evaluating Large Language Models Trained on Code — pass@k (Chen et al., 2021)",
          "u": "https://arxiv.org/abs/2107.03374",
          "tZh": "评测在代码上训练的大模型 —— pass@k(Chen 等, 2021)"
        },
        {
          "t": "s1: Simple Test-Time Scaling — budget forcing (Muennighoff et al., 2025)",
          "u": "https://arxiv.org/abs/2501.19393",
          "tZh": "s1:简单的测试期扩展 —— 预算强制(Muennighoff 等, 2025)"
        },
        {
          "t": "DAPO: An Open-Source LLM RL System at Scale (Yu et al., 2025)",
          "u": "https://arxiv.org/abs/2503.14476",
          "tZh": "DAPO:大规模开源大模型强化学习系统(Yu 等, 2025)"
        },
        {
          "t": "Understanding R1-Zero-Like Training — Dr. GRPO (Liu et al., 2025)",
          "u": "https://arxiv.org/abs/2503.20783",
          "tZh": "理解类 R1-Zero 训练 —— Dr. GRPO(Liu 等, 2025)"
        },
        {
          "t": "Training LLMs to Reason in a Continuous Latent Space — Coconut (Hao et al., 2024)",
          "u": "https://arxiv.org/abs/2412.06769",
          "tZh": "训练大模型在连续隐空间中推理 —— Coconut(Hao 等, 2024)"
        }
      ]
    },
    {
      "id": 7,
      "num": "07",
      "slug": "agentic-llms",
      "title": "Agentic LLMs",
      "titleZh": "智能体化大模型",
      "date": "Nov 14, 2025",
      "duration": "1:49:23",
      "videoId": "h-7S6HNq0Vg",
      "accent": "sky",
      "dateZh": "2025年11月14日",
      "tagline": "Connecting the model to live knowledge and tools so it can retrieve, act, and loop toward a goal.",
      "taglineZh": "把模型接到实时知识与工具上,让它能检索、行动,并循环逼近目标。",
      "overview": "<p>Up to now the LLM has been on its own: a prompt goes in, a response comes out, and all it knows is frozen at its training cutoff. This lecture (taught by Afshine on RAG, Shervine on tools and agents) connects the model to the outside world in two complementary ways. <strong>Retrieval-augmented generation (RAG)</strong> grounds answers in an external knowledge base of unstructured documents; <strong>tool / function calling</strong> lets the model invoke structured APIs to fetch real-time data or take actions; and <strong>agents</strong> wrap tool use in a reasoning loop, with the <strong>ReAct</strong> framework (Observe to Plan to Act) as the canonical recipe. We also cover advanced retrieval (hybrid search, reranking, HyDE), tool selection and the <strong>MCP</strong> and <strong>A2A</strong> standards, and the new safety surface that acting in the world opens up.</p>",
      "overviewZh": "<p>到目前为止,大模型都是「单打独斗」:输入一个提示,输出一个回答,而它所知的一切都被冻结在训练截止日期。本讲(由 Afshine 讲 RAG,Shervine 讲工具与智能体)以两种互补方式把模型连到外部世界。<strong>检索增强生成(RAG)</strong>把回答建立在外部非结构化文档知识库之上;<strong>工具 / 函数调用(tool / function calling)</strong>让模型调用结构化 API 来获取实时数据或采取行动;<strong>智能体(agent)</strong>则把工具使用包进一个推理循环,其经典范式就是 <strong>ReAct</strong> 框架(观察 → 规划 → 行动)。我们还会讲进阶检索(混合检索、重排序、HyDE)、工具选择,以及 <strong>MCP</strong> 与 <strong>A2A</strong> 标准,还有「能在世界中行动」所带来的全新安全面。</p>",
      "topics": [
        {
          "name": "Why we need RAG: the knowledge-cutoff problem",
          "nameZh": "为何需要 RAG:知识截止问题",
          "body": "<p>A trained LLM only knows what was in its pretraining data. Every model card lists a <strong>knowledge cutoff</strong> — for GPT-5 it is September 30, 2024 — so asking about an election held last week gives a wrong answer or none. Why not just keep training on newer data? Two reasons: changing an LLM's knowledge tends to cause <em>regression</em> elsewhere, and re-injecting knowledge across every fine-tuned use case is a maintenance nightmare. So people avoid retraining to add knowledge.</p><p>Why not just paste everything after the cutoff into the prompt? Three problems. (1) <strong>Context is limited</strong> — even GPT-5's 400k tokens (one token roughly four characters, so hundreds of pages) is not infinite. (2) The model <strong>gets distracted by irrelevant information</strong>: the <em>needle-in-a-haystack</em> test (Kamradt, 2023) showed GPT-4 fails to retrieve a planted fact once the prompt is long enough, especially when the fact sits in the first half. (3) You <strong>pay per token</strong> — on the order of a dollar per million tokens, which adds up. The fix: put only the <em>relevant</em> pieces into the prompt.</p>",
          "bodyZh": "<p>训练好的大模型只知道预训练数据里有的东西。每张模型卡都写着<strong>知识截止(knowledge cutoff)</strong>日期 —— GPT-5 是 2024 年 9 月 30 日 —— 所以问它上周举行的选举,它要么答错要么答不出。为什么不继续拿新数据训练?两个原因:改动大模型的知识往往会在别处引起<em>退化(regression)</em>;而且为每一个微调过的用例都重新注入知识,维护起来是噩梦。所以人们避免用重训来加知识。</p><p>那为什么不把截止日期之后的一切都贴进提示?三个问题。(1) <strong>上下文有限</strong> —— 即便是 GPT-5 的 40 万词元(一个词元约四个字符,即几百页)也并非无限。(2) 模型会<strong>被无关信息干扰</strong>:大海捞针(needle-in-a-haystack,Kamradt,2023)测试显示,提示一旦足够长,GPT-4 就找不到被埋入的事实,尤其当该事实位于前半段时。(3) 你要<strong>按词元付费</strong> —— 量级约为每百万词元一美元,积少成多。解决办法:只把<em>相关</em>片段放进提示。</p>"
        },
        {
          "name": "RAG: Retrieve, Augment, Generate",
          "nameZh": "RAG:检索、增强、生成",
          "body": "<p><strong>RAG</strong> (Lewis et al., 2020) augments the prompt with relevant information in three steps: <strong>Retrieve</strong> relevant documents from a knowledge base via a similarity operation, <strong>Augment</strong> the prompt by pasting that retrieved info in, and <strong>Generate</strong> the response with the LLM. For the election example, the prompt effectively becomes who won this election, by the way this election was held on... and the winner was... — you are handing the model the answer.</p><p>The <strong>knowledge base</strong> is built offline: <em>collect</em> useful documents, <em>divide</em> them into <strong>chunks</strong> (a subset of a document, capped at a few hundred tokens), and <em>embed</em> each chunk into a vector stored in a vector database. Three hyperparameters to tune: <strong>embedding size</strong> (on the order of a thousand-plus, e.g. ~1500 — bigger captures more nuance but costs more), <strong>chunk size</strong> (~500 tokens — too small loses context, too large dilutes the embedding), and <strong>overlap</strong> between consecutive chunks (low hundreds of tokens, so context carries across the cut). Since a bad retrieval yields a bad answer, the whole game is making retrieval good.</p>",
          "bodyZh": "<p><strong>RAG</strong>(Lewis 等,2020)用相关信息来增强提示,分三步:用相似度操作从知识库<strong>检索(Retrieve)</strong>相关文档,把检索到的信息贴进去<strong>增强(Augment)</strong>提示,再让大模型<strong>生成(Generate)</strong>回答。以选举为例,提示实际上变成「谁赢了这场选举,顺便说,这场选举于……举行,赢家是……」—— 等于把答案递到了模型手里。</p><p><strong>知识库</strong>是离线构建的:<em>收集</em>有用文档,把它们<em>切分</em>成<strong>块(chunk)</strong>(文档的一个子集,上限为几百词元),再把每块<em>嵌入</em>为向量,存进向量数据库。三个要调的超参数:<strong>嵌入维度</strong>(量级在一千多,如约 1500 —— 越大捕捉的细微差别越多,但成本越高)、<strong>块大小</strong>(约 500 词元 —— 太小丢上下文,太大稀释嵌入),以及相邻块之间的<strong>重叠(overlap)</strong>(低几百词元,让上下文跨越切口延续)。由于检索差则答案差,整个关键就在于把检索做好。</p>"
        },
        {
          "name": "Candidate retrieval: embeddings, cosine similarity, BM25",
          "nameZh": "候选检索:嵌入、余弦相似度、BM25",
          "body": "<p>Retrieval mirrors search and recommender systems and runs in two stages. Stage one, <strong>candidate retrieval</strong>, filters a huge knowledge base down to ~100+ candidates and aims to <strong>maximize recall</strong>. We embed the query and compare it to every chunk embedding, keeping the top matches by <strong>cosine similarity</strong>:</p>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]<p>Other distances (e.g. L2) appear, but if vectors are normalized they reduce to roughly the same thing. Because the base can be huge, <strong>approximate nearest neighbor (ANN)</strong> methods partition the embeddings to avoid a naive linear scan. The query and chunk are each passed through their own encoder — a <strong>bi-encoder</strong> setup, typically a BERT-like model; the recommended read is <em>Sentence-BERT</em> (Reimers et al., 2019), trained so relevant pairs get high cosine similarity. Pure semantic search has no <em>keyword</em> guarantee: asking Where is Cuddly? may return semantically similar chunks about Huggy that never mention Cuddly. <strong>BM25</strong>, a heuristic keyword-overlap score, guarantees the keyword appears, so many systems use a <strong>hybrid</strong> of embeddings plus BM25.</p>",
          "bodyZh": "<p>检索与搜索、推荐系统如出一辙,分两阶段进行。第一阶段<strong>候选检索(candidate retrieval)</strong>把庞大的知识库筛到约 100 多个候选,目标是<strong>最大化召回(recall)</strong>。我们把查询嵌入,再与每个块的嵌入比较,按<strong>余弦相似度(cosine similarity)</strong>留下最高匹配:</p>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]<p>也会见到别的距离(如 L2),但若向量都归一化,它们大致等价。由于库可能极大,<strong>近似最近邻(ANN)</strong>方法会对嵌入分区,避免朴素的线性扫描。查询与块各自过一个独立编码器 —— 这是<strong>双编码器(bi-encoder)</strong>结构,通常是类 BERT 模型;推荐阅读 <em>Sentence-BERT</em>(Reimers 等,2019),其训练目标是让相关对得到高余弦相似度。纯语义检索不保证<em>关键词</em>命中:问「Cuddly 在哪?」可能返回关于 Huggy 的语义相近块,却根本没提 Cuddly。<strong>BM25</strong> 是一种基于关键词重叠的启发式打分,能保证关键词出现,所以许多系统用嵌入加 BM25 的<strong>混合(hybrid)</strong>检索。</p>"
        },
        {
          "name": "Retrieval extensions: HyDE, contextual chunks, prompt caching",
          "nameZh": "检索扩展:HyDE、上下文化分块、提示缓存",
          "body": "<p>Two practical problems and their fixes. First, a query and a document are <em>different in nature</em> — a short question versus long prose — so embedding both with the same encoder gives poorly comparable vectors. <strong>HyDE</strong> (Gao et al., 2022) mitigates this: instead of embedding the prompt, an LLM call first generates a <em>fake document</em> answering it (Cuddly is in...), and that fake document is embedded to retrieve real chunks. (Alternatively, train separate query and document encoders, though people avoid this for maintenance reasons.)</p><p>Second, chunks split naively can be meaningless out of context. <strong>Contextual retrieval</strong> (Anthropic, 2024) prepends a short generated context to each chunk: feed the whole document plus the chunk to an LLM and ask it to give a short succinct context to situate this chunk. That is many LLM calls, so use <strong>prompt caching</strong> — because decoders are left-to-right, a shared prefix (the whole document) produces identical activations, so you compute them once, save the activations, and just look them up. Providers expose this: a cached input token can cost about one-tenth of a regular input token, so gather repeated content at the start of prompts.</p>",
          "bodyZh": "<p>两个实际问题及其修法。其一,查询与文档<em>本质不同</em> —— 短问句对长篇文字 —— 用同一编码器嵌入两者,得到的向量可比性差。<strong>HyDE</strong>(Gao 等,2022)缓解此问题:不嵌入提示本身,而是先用一次大模型调用生成一个回答它的<em>假文档</em>(「Cuddly 在……」),再嵌入这个假文档去检索真实块。(另一办法是训练分开的查询编码器与文档编码器,但出于维护原因人们多不这么做。)</p><p>其二,朴素切出的块脱离上下文可能毫无意义。<strong>上下文检索(contextual retrieval)</strong>(Anthropic,2024)给每块前置一段生成的简短上下文:把整篇文档加上该块喂给大模型,请它「给出一段简短精炼的上下文以定位此块」。这是大量大模型调用,所以要用<strong>提示缓存(prompt caching)</strong> —— 因为解码器是从左到右的,共享前缀(整篇文档)会产生相同的激活,于是只算一次、存下激活、之后查表即可。各家供应商都提供此功能:一个缓存输入词元的价格约为常规输入词元的十分之一,所以要把重复内容集中放在提示开头。</p>"
        },
        {
          "name": "Reranking with cross-encoders, and retrieval metrics",
          "nameZh": "用交叉编码器重排序,与检索指标",
          "body": "<p>Stage two, <strong>ranking (reranking)</strong>, takes the ~100 candidates and produces a final score to <strong>maximize precision</strong>. Instead of comparing two independent embeddings, a <strong>cross-encoder</strong> feeds the query <em>and</em> the chunk together into one encoder, computing attention across both, and outputs a relevance score. This captures query-chunk interaction the bi-encoder misses; it is more compute-intensive, but affordable on a small candidate set. The reranker reorders chunks (d, b, a, c becomes a:1, b:2, c:3, d:4) and you keep the top-k for the prompt.</p><p>To know if the ranking is good, use ranking metrics. <strong>NDCG@k</strong> sums relevance over the top k, discounting by position so a relevant chunk at rank 1 beats one at rank k, then normalizes by the ideal DCG (a perfect ranking scores 1). <strong>Reciprocal Rank (RR@k)</strong> is the inverse of the rank of the first relevant chunk — simple and well-correlated. <strong>Recall@k</strong> and <strong>Precision@k</strong> are the ranking analogues of the classification metrics. Benchmark a retriever on <strong>MTEB</strong> (the Massive Text Embedding Benchmark) to compare solutions.</p>",
          "bodyZh": "<p>第二阶段<strong>排序(ranking / reranking)</strong>拿到约 100 个候选,产出最终分数以<strong>最大化精确率(precision)</strong>。它不再比较两个独立嵌入,而是用<strong>交叉编码器(cross-encoder)</strong>把查询<em>和</em>块一起喂进同一个编码器,在两者之间计算注意力,输出一个相关性分数。这捕捉到了双编码器漏掉的查询-块交互;它更耗算力,但在小候选集上可以承受。重排序器重新排列各块(d、b、a、c 变成 a:1、b:2、c:3、d:4),你保留前 k 个放进提示。</p><p>要判断排序好不好,就用排序指标。<strong>NDCG@k</strong> 在前 k 上对相关性求和,按位置打折扣,使排第 1 的相关块胜过排第 k 的,再用理想 DCG 归一化(完美排序得 1)。<strong>倒数排名(RR@k)</strong>是第一个相关块排名的倒数 —— 简单且相关性好。<strong>Recall@k</strong> 与 <strong>Precision@k</strong> 则是分类指标在排序上的对应物。可在 <strong>MTEB</strong>(海量文本嵌入基准,Massive Text Embedding Benchmark)上评测检索器以比较方案。</p>"
        },
        {
          "name": "Tool / function calling",
          "nameZh": "工具 / 函数调用",
          "body": "<p>RAG injects <em>unstructured</em> text; <strong>tool calling</strong> handles <em>structured</em> input-output. A table mapping inputs to outputs can be reframed as a function, so we call it <strong>function calling</strong> (LLMs favor Python for readability). Per IBM, tool calling lets autonomous systems complete tasks by dynamically accessing and acting upon external resources. Example: ask Find a bear near me! and a vanilla LLM says it does not know; with a documented find_teddy_bear(location) function it can answer. The LLM never sees the implementation — only the function API, its inputs/outputs, and the docstring; the body (the backend API call, the returned TeddyBearInfo with name, distance, mood) stays in your codebase.</p><p>It works in three stages: (1) the LLM picks the right function and fills its <strong>arguments</strong> from the query and context (e.g. location = (37.42, -122.17) from your GPS); (2) the runtime <strong>executes</strong> the call — no LLM involved — returning structured JSON; (3) the LLM <strong>reads that result</strong> and writes a natural-language reply. Use cases span information (search, weather, stocks, codebase), computation (calculator, code execution), and action (sending emails or messages on your behalf).</p>",
          "bodyZh": "<p>RAG 注入的是<em>非结构化</em>文本;<strong>工具调用(tool calling)</strong>处理<em>结构化</em>的输入-输出。一张把输入映射到输出的表可重述为一个函数,故称<strong>函数调用(function calling)</strong>(大模型偏爱 Python,因其易读)。按 IBM 的定义,工具调用让自主系统通过动态访问并作用于外部资源来完成任务。例:问「帮我找附近的熊!」,普通大模型会说不知道;有了一个文档完备的 find_teddy_bear(location) 函数,它就能回答。大模型从不看实现 —— 只看函数 API、其输入/输出与文档字符串;函数体(后端 API 调用、返回的含名字、距离、心情的 TeddyBearInfo)留在你的代码库里。</p><p>它分三阶段:(1) 大模型挑出正确函数,并从查询与上下文中填好<strong>参数</strong>(如从你的 GPS 得到 location = (37.42, -122.17));(2) 运行时<strong>执行</strong>该调用 —— 不涉及大模型 —— 返回结构化 JSON;(3) 大模型<strong>读取该结果</strong>并写出自然语言回复。应用横跨信息类(搜索、天气、股票、代码库)、计算类(计算器、代码执行)与行动类(替你发邮件或消息)。</p>"
        },
        {
          "name": "Teaching tools, tool selection, and MCP",
          "nameZh": "教会用工具、工具选择与 MCP",
          "body": "<p>You can teach tool use two ways. <strong>Via training:</strong> two sets of SFT pairs — <em>tool prediction</em> (query plus function API to the right call) and <em>response generation</em> (the whole conversation history plus tool result to a final reply), with varied examples covering the user distribution. <strong>Via prompting:</strong> since modern models already write Python well, prepend the function API plus a detailed explanation of how to use it. You should not hand-write that explanation; instead treat the SFT pairs as an <em>evaluation set</em>, run your current prompt, score wins and losses, and feed the results to a powerful reasoning model to rewrite the explanation — it does surprisingly well.</p><p>In practice you expose <em>many</em> tools at once, which hurts: too many tools degrade performance (needle-in-a-haystack again) and never fit a finite context. <strong>Tool selection</strong> (a Router; Robert et al., 2024) first picks relevant tools from a long list of API names, then feeds only those to the LLM. And since each provider defines tools differently, <strong>MCP</strong> (Model Context Protocol, Anthropic, 2024) standardizes exposure: an <em>MCP server</em> serves <em>tools</em>, <em>prompts</em> (usage templates), and <em>resources</em> (external data) to an <em>MCP client</em> in the host (e.g. Claude Desktop calling a book provider's server).</p>",
          "bodyZh": "<p>教模型用工具有两种途径。<strong>通过训练:</strong>两套 SFT 配对 —— <em>工具预测</em>(查询加函数 API → 正确调用)和<em>回复生成</em>(整段对话历史加工具结果 → 最终回复),并用覆盖用户分布的多样例子。<strong>通过提示:</strong>由于现代模型已能熟练写 Python,在前面放上函数 API 加一段如何使用它的详细说明。这段说明不应手写;而应把 SFT 配对当作<em>评估集</em>,跑当前提示,统计成败,再把结果喂给一个强推理模型来重写说明 —— 它做得出奇地好。</p><p>实践中你会一次暴露<em>很多</em>工具,这会带来麻烦:工具太多会降性能(又是大海捞针),也永远塞不进有限上下文。<strong>工具选择(tool selection)</strong>(路由器 Router;Robert 等,2024)先从一长串 API 名称里挑出相关工具,再只把它们喂给大模型。又因各家定义工具的方式各异,<strong>MCP</strong>(模型上下文协议,Model Context Protocol,Anthropic,2024)统一了暴露方式:一个 <em>MCP 服务器</em>向宿主里的 <em>MCP 客户端</em>提供<em>工具</em>、<em>提示</em>(用法模板)与<em>资源</em>(外部数据)(如 Claude Desktop 调用某图书供应商的服务器)。</p>"
        },
        {
          "name": "Agents and the ReAct loop",
          "nameZh": "智能体与 ReAct 循环",
          "body": "<p>An <strong>agent</strong> is a system that autonomously pursues goals and completes tasks on a user's behalf. Compared to a single tool call it adds <em>recurrence and higher-level reasoning</em>: traditional is Question to Answer; reasoning adds a chain; an agent is Question to LLM to Calls to LLM to ... to Answer, looping until done. The canonical recipe is <strong>ReAct</strong> = Reason + Act (Yao et al., 2022), which decomposes a goal into a loop of <strong>Observe to Plan to Act</strong> (the paper uses Thought/Action/Observation; names vary).</p><p>Worked example: input My teddy bear is cold. Please do something. <strong>Observe</strong> synthesizes what is known — the bear may be cold because the room temperature is unknown. <strong>Plan</strong> spells out the next task: determine the room temperature. <strong>Act</strong> calls get_current_room_temperature(), which returns 65F. Back to <strong>Observe</strong>: that is about 5F below average, so we need more heat. <strong>Plan</strong>: increase the temperature by 5F. <strong>Act</strong>: increase_temperature(value=5). <strong>Observe</strong>: thermostat now at 70F — warm enough — so exit the loop and <strong>Output</strong> a natural-language reply. At each turn the LLM checks whether the goal is met; if yes it outputs, otherwise it loops.</p>",
          "bodyZh": "<p><strong>智能体(agent)</strong>是一个自主追求目标、替用户完成任务的系统。相比单次工具调用,它多了<em>循环与更高层次的推理</em>:传统是问题 → 回答;推理模型多一条思维链;智能体是问题 → 大模型 → 调用 → 大模型 → …… → 回答,反复循环直到完成。其经典范式是 <strong>ReAct</strong> = Reason + Act(推理 + 行动,Yao 等,2022),它把目标拆解成一个<strong>观察 → 规划 → 行动</strong>的循环(论文用思考/行动/观察,叫法不一)。</p><p>实例:输入「我的泰迪熊冷了,请想想办法。」<strong>观察</strong>综合已知 —— 熊可能冷是因为房间温度未知。<strong>规划</strong>明确下一步任务:测定房间温度。<strong>行动</strong>调用 get_current_room_temperature(),返回 65F。回到<strong>观察</strong>:这比平均低约 5F,所以需要加热。<strong>规划</strong>:把温度提高 5F。<strong>行动</strong>:increase_temperature(value=5)。<strong>观察</strong>:恒温器现已到 70F —— 够暖了 —— 于是退出循环并<strong>输出</strong>一句自然语言回复。每一轮大模型都检查目标是否达成;达成就输出,否则继续循环。</p>"
        },
        {
          "name": "Multi-agent (A2A), safety, and closing advice",
          "nameZh": "多智能体(A2A)、安全与收尾建议",
          "body": "<p>You can have many agents — a thermostat agent, an energy-management agent, an occupancy agent, an air-quality agent — that talk to each other. That motivates <strong>A2A</strong> (Agent2Agent, Google, 2025), which standardizes what an agent exposes: an <em>AgentCard</em> (name, url), <em>AgentSkill</em>s with examples so other agents know its capabilities, and an <em>AgentExecutor</em> defining how it executes and cancels requests. Agents run independently with their own reasoning loops; only inputs and outputs cross between them.</p><p><strong>Safety</strong> becomes critical once models can act: a key risk is <em>data exfiltration</em> (a prompt tricking an email tool into mailing out a password). Remediations come in two classes — <em>training-stage</em> harmlessness data in SFT/RL, and <em>inference safeguards</em> like a safety classifier watching the conversation — plus benchmarks such as <strong>Agent-SafetyBench</strong> and the <em>ToolSword</em> survey. Anthropic just reported a real AI-orchestrated cyber-espionage campaign run via its model, underscoring the stakes. <strong>Closing advice:</strong> hallucination and reasoning are the bottlenecks (fine-tuning helps but is hard; prefer better base capabilities); start simple then scale; start with the most capable model and optimize size/latency later; and keep the reasoning chains observable for debugging. Shervine's favorite agentic use case is coding — but learn the fundamentals, because judging whether code is correct is the hard part.</p>",
          "bodyZh": "<p>你可以有许多智能体 —— 恒温器智能体、能源管理智能体、占用情况智能体、空气质量智能体 —— 彼此对话。这催生了 <strong>A2A</strong>(Agent2Agent,Google,2025),它标准化一个智能体所暴露的东西:<em>AgentCard</em>(名称、网址)、带示例的 <em>AgentSkill</em>(让别的智能体了解其能力),以及定义如何执行与取消请求的 <em>AgentExecutor</em>。各智能体独立运行、各有自己的推理循环;它们之间只传递输入与输出。</p><p>一旦模型能行动,<strong>安全</strong>就变得至关重要:一个关键风险是<em>数据外泄(data exfiltration)</em>(用提示诱使邮件工具把密码寄出)。缓解分两类 —— SFT/RL 中的<em>训练阶段</em>无害化数据,以及像安全分类器那样监看对话的<em>推理期防护</em> —— 还有 <strong>Agent-SafetyBench</strong> 等基准与 <em>ToolSword</em> 综述。Anthropic 刚刚报告了一起借其模型实施的、真实的 AI 编排网络间谍行动,凸显了利害。<strong>收尾建议:</strong>幻觉与推理是瓶颈(微调有帮助但难,宁可提升底座能力);先做简单再扩展;先用最强模型,之后再优化尺寸与延迟;并让推理链可观测以便调试。Shervine 最爱的智能体用例是写代码 —— 但要学好基本功,因为判断代码是否正确才是难的部分。</p>"
        }
      ],
      "takeaways": [
        "An LLM's knowledge is frozen at its cutoff (GPT-5: Sep 30, 2024); stuffing everything into context fails on size, distraction (needle-in-a-haystack), and per-token cost.",
        "RAG = Retrieve (similarity over a chunked, embedded knowledge base) to Augment the prompt to Generate; key knobs are embedding size, chunk size, and overlap.",
        "Retrieval is two-stage: candidate retrieval maximizes recall via bi-encoder cosine similarity (and BM25/hybrid for keywords); cross-encoder reranking maximizes precision.",
        "Cosine similarity is the default match score: sim(q,d) = (q.d) / (||q|| ||d||); evaluate retrievers with NDCG@k, RR@k, recall@k, precision@k on MTEB.",
        "Advanced tricks: HyDE embeds a generated fake document; contextual retrieval prepends chunk context (cheaply, via prompt caching at ~1/10 the input cost).",
        "Tool calling exposes documented function schemas; the model fills arguments, the runtime executes, the model reads the structured result and replies.",
        "Agents loop a tool-using LLM via ReAct (Observe to Plan to Act); MCP standardizes tool exposure and A2A standardizes agent-to-agent communication.",
        "Acting in the world raises safety risks (data exfiltration); errors compound over long horizons, so start simple, use capable models, and keep reasoning observable."
      ],
      "takeawaysZh": [
        "大模型的知识冻结在截止日期(GPT-5:2024 年 9 月 30 日);把一切塞进上下文会因体量、干扰(大海捞针)与按词元计费而失败。",
        "RAG = 检索(在切块并嵌入的知识库上做相似度)→ 增强提示 → 生成;关键旋钮是嵌入维度、块大小与重叠。",
        "检索分两阶段:候选检索用双编码器余弦相似度最大化召回(并用 BM25/混合抓关键词);交叉编码器重排序最大化精确率。",
        "余弦相似度是默认匹配分数:sim(q,d) = (q.d) / (||q|| ||d||);用 NDCG@k、RR@k、recall@k、precision@k 在 MTEB 上评测检索器。",
        "进阶技巧:HyDE 嵌入一份生成的假文档;上下文检索为每块前置上下文(借提示缓存以约 1/10 的输入成本廉价完成)。",
        "工具调用暴露文档完备的函数模式;模型填参数,运行时执行,模型读取结构化结果并回复。",
        "智能体通过 ReAct(观察 → 规划 → 行动)让会用工具的大模型循环;MCP 统一工具暴露,A2A 统一智能体间通信。",
        "在世界中行动带来安全风险(数据外泄);误差在长链条上累积,所以先做简单、用强模型、并让推理可观测。"
      ],
      "refs": [
        {
          "t": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)",
          "u": "https://arxiv.org/abs/2005.11401",
          "tZh": "面向知识密集型 NLP 任务的检索增强生成 —— RAG 原始论文(Lewis et al., 2020)"
        },
        {
          "t": "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (Reimers et al., 2019)",
          "u": "https://arxiv.org/abs/1908.10084",
          "tZh": "Sentence-BERT:用孪生 BERT 网络计算句向量,RAG 检索器的基础(Reimers et al., 2019)"
        },
        {
          "t": "Precise Zero-Shot Dense Retrieval without Relevance Labels — HyDE (Gao et al., 2022)",
          "u": "https://arxiv.org/abs/2212.10496",
          "tZh": "无相关性标注的精确零样本稠密检索 —— HyDE,用假文档缓解查询-文档差异(Gao et al., 2022)"
        },
        {
          "t": "Introducing Contextual Retrieval (Anthropic, 2024)",
          "u": "https://www.anthropic.com/news/contextual-retrieval",
          "tZh": "上下文检索:为每个块前置生成的上下文并配合提示缓存(Anthropic, 2024)"
        },
        {
          "t": "Introducing the Model Context Protocol — MCP (Anthropic, 2024)",
          "u": "https://www.anthropic.com/news/model-context-protocol",
          "tZh": "模型上下文协议 MCP:用标准方式把工具/数据接到大模型(Anthropic, 2024)"
        },
        {
          "t": "ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)",
          "u": "https://arxiv.org/abs/2210.03629",
          "tZh": "ReAct:在语言模型中协同推理与行动,智能体经典范式(Yao et al., 2022)"
        },
        {
          "t": "Announcing the Agent2Agent Protocol — A2A (Google, 2025)",
          "u": "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
          "tZh": "Agent2Agent 协议 A2A:标准化智能体之间的通信(Google, 2025)"
        },
        {
          "t": "Agent-SafetyBench: Evaluating the Safety of LLM Agents (Zhang et al., 2024)",
          "u": "https://arxiv.org/abs/2412.14470",
          "tZh": "Agent-SafetyBench:评测大模型智能体安全性的基准套件(Zhang et al., 2024)"
        }
      ]
    },
    {
      "id": 8,
      "num": "08",
      "slug": "llm-evaluation",
      "title": "LLM Evaluation",
      "titleZh": "大模型评测",
      "date": "Nov 21, 2025",
      "duration": "1:49:25",
      "videoId": "8fNP4N46RRo",
      "accent": "teal",
      "dateZh": "2025年11月21日",
      "tagline": "How do you measure an open-ended generator?",
      "taglineZh": "如何衡量一个开放式生成器?",
      "overview": "<p>Without a way to measure an LLM, you cannot know what to improve — which is why the instructor calls this one of the most important lectures of the course. The hard part is that an LLM is a <strong>text-to-text</strong> model whose output can be natural language, code, or math, so universal metrics are elusive. The lecture walks from the gold standard (human ratings) through cheap rule-based metrics, to the workhorse <strong>LLM-as-a-judge</strong> paradigm, then its <strong>biases</strong> and best practices, and finally how agents and whole models are benchmarked.</p>",
      "overviewZh": "如果没有办法衡量一个大模型,就无从知道该改进什么 —— 因此讲者称这是整门课最重要的一讲。难点在于:大模型是<strong>文本到文本</strong>(text-to-text)的模型,输出可以是自然语言、代码或数学,因而很难有通用指标。本讲从黄金标准(人工评分)出发,经过廉价的基于规则的指标,讲到主力范式 <strong>LLM-as-a-judge</strong>(以大模型为裁判),再剖析其<strong>偏差</strong>与最佳实践,最后讲如何对智能体与整个模型做基准测试。</p>",
      "topics": [
        {
          "name": "From human ratings to inter-rater agreement",
          "nameZh": "从人工评分到评分者一致性",
          "body": "<p>The ideal is to ask a human to rate every LLM output — it is closest to ground truth — but it is slow and expensive. It also runs into <strong>subjectivity</strong>. The instructor's example: asked <em>what birthday gift should I get</em>, the model says <em>a teddy bear is almost always a sweet gift</em>; rated for <strong>usefulness</strong>, one rater calls it useful, another says it never specified which stuffed animal.</p><p>So we track <strong>inter-rater agreement</strong>. A naive metric is the raw agreement rate, but it is misleading: if two raters, Alice and Bob, each answer good/not-good randomly with \\(p_A=p_B=0.5\\), the agreement by pure chance is already \\(0.5^2 + 0.5^2 = 0.5\\). Worse, chance agreement rises as the rating probabilities become more skewed, so a raw number cannot be judged good or bad in isolation.</p><p>The fix is metrics relative to chance, such as <strong>Cohen's Kappa</strong>: it compares observed agreement to expected-by-chance agreement, equals 1 at perfect agreement, and goes negative when raters do worse than chance. <strong>Fleiss' Kappa</strong> and <strong>Krippendorff's alpha</strong> extend this to many raters. In practice teams track this as a health metric and hold alignment sessions when it is low.</p>",
          "bodyZh": "<p>理想做法是让人来给每一条大模型输出打分 —— 这最接近真值 —— 但又慢又贵,还会遇到<strong>主观性</strong>问题。讲者的例子:问<em>该送什么生日礼物</em>,模型答<em>泰迪熊几乎总是个贴心礼物</em>;就<strong>有用性</strong>(usefulness)打分时,一位评分者认为有用,另一位却说它根本没指明该选哪种毛绒玩具。</p><p>于是我们要追踪<strong>评分者间一致性</strong>(inter-rater agreement)。最朴素的指标是原始一致率,但它有误导性:若两位评分者 Alice 与 Bob 都以 \\(p_A=p_B=0.5\\) 随机回答好/不好,纯靠运气的一致率就已是 \\(0.5^2 + 0.5^2 = 0.5\\)。更糟的是,打分概率越偏斜,偶然一致率越高,因此孤立看一个数字无法判断它是好是坏。</p><p>解决办法是采用相对于随机基线的指标,例如 <strong>Cohen's Kappa</strong>:它把观测一致率与偶然期望一致率作比较,完全一致时等于 1,当评分者表现差于随机时取负值。<strong>Fleiss' Kappa</strong> 与 <strong>Krippendorff's alpha</strong> 把它推广到多位评分者。实践中团队把它当作健康指标追踪,过低时就开对齐会统一打分口径。</p>"
        },
        {
          "name": "Rule-based metrics: METEOR, BLEU, ROUGE",
          "nameZh": "基于规则的指标:METEOR、BLEU、ROUGE",
          "body": "<p>Instead of rating every output, write the <strong>references</strong> once and compare each new output against them — so you can iterate on the model without re-collecting human ratings. These metrics aim to be a little flexible, since the same answer can be phrased many ways.</p><p><strong>METEOR</strong> (Metric for Evaluation of Translation with Explicit ORdering) takes the form \\(\\text{F-score} \\times (1 - \\text{penalty})\\). The F-score is a weighted harmonic mean of <em>precision</em> (matched unigrams over the prediction) and <em>recall</em> (matched unigrams over the reference); the penalty depends on the number of contiguous matched chunks \\(C\\) over matched unigrams, so fewer/longer contiguous runs mean better ordering. It even counts synonyms and shared word-roots, but with hand-chosen \\(\\gamma,\\beta\\) it feels like a recipe. <strong>BLEU</strong> (BiLingual Evaluation Understudy) is precision-focused on matched n-grams with a <em>brevity penalty</em> so short translations cannot game it. <strong>ROUGE</strong> (recall-oriented, many variants) is used for summarization.</p><p>The limitations: they ignore <strong>stylistic variation</strong> (three very different but equally good teddy-bear sentences all score poorly), correlation with humans is not great, and you still need human-written references to start.</p>",
          "bodyZh": "<p>与其给每条输出打分,不如把<strong>参考答案</strong>(references)写一次,然后拿每条新输出去对比 —— 这样就能迭代模型而无需反复收集人工评分。由于同一个答案可以有多种表述,这些指标力求带一点灵活性。</p><p><strong>METEOR</strong>(显式排序的翻译评估指标)形如 \\(\\text{F-score} \\times (1 - \\text{penalty})\\)。F-score 是<em>精确率</em>(预测中匹配的一元词占比)与<em>召回率</em>(参考中匹配的一元词占比)的加权调和平均;惩罚项取决于匹配连续块数 \\(C\\) 与匹配一元词数之比,连续段越少越长即排序越好。它甚至会算上同义词和同词根,但因 \\(\\gamma,\\beta\\) 靠手工选,显得像个配方。<strong>BLEU</strong>(双语评估替补)以匹配 n-gram 的精确率为主,带<em>简短惩罚</em>(brevity penalty),使过短译文无法钻空子。<strong>ROUGE</strong>(召回导向,变体众多)用于摘要任务。</p><p>其局限:忽略<strong>风格变化</strong>(讲者给的三句迥异却同样好的泰迪熊句子都会得低分),与人类评分相关性不高,且仍需人写的参考才能起步。</p>"
        },
        {
          "name": "LLM-as-a-judge: setup, structured output, variations",
          "nameZh": "以大模型为裁判:设置、结构化输出与变体",
          "body": "<p>Since LLMs are pretrained on human knowledge and tuned to human preference, we can feed one model's response into another model — the <strong>LLM-as-a-judge</strong> (term from Zheng et al., 2023). Inputs are the <em>prompt</em>, the <em>response</em>, and the <em>criteria</em>; outputs are a <strong>score</strong> (ideally binary, pass/fail) and, crucially, a <strong>rationale</strong> explaining the score — something rule-based metrics never gave. A useful trick is to make it write the rationale <em>before</em> the score; this mirrors chain-of-thought in reasoning models, letting it externalize its reasoning before judging.</p><p>But sampling is probabilistic, so a parseable rationale-and-score is not guaranteed. The fix, from Lecture 3, is <strong>constrained / guided decoding</strong> — sampling only valid tokens to force a format. Providers expose this as <strong>structured output</strong>: define a <code>Response</code> class with <code>rationale</code> and <code>score</code>, then pass <code>text_format=Response</code> in the call.</p><p>Two main variations: <strong>pointwise</strong> (evaluate one response) and <strong>pairwise</strong> (is A or B better?). Pairwise is also a great way to <em>synthesize preference data</em> for reward-model training, as seen in the preference-tuning lecture.</p>",
          "bodyZh": "<p>既然大模型在人类知识上预训练、并被调到贴合人类偏好,我们就能把一个模型的回答喂给另一个模型 —— 即 <strong>LLM-as-a-judge</strong>(以大模型为裁判,术语出自 Zheng 等,2023)。输入是<em>提示</em>、<em>回答</em>与<em>评判标准</em>;输出是一个<strong>分数</strong>(最好是二元,通过/不通过)和一段<strong>理由</strong>(rationale)来解释打分 —— 这是基于规则的指标从未提供过的。一个实用技巧是让它先写理由<em>再</em>给分;这与推理模型的思维链思路一致,让它在评判前把推理外化出来。</p><p>但采样有概率性,因此并不保证能解析出理由和分数。解决办法来自第 3 讲的<strong>受约束/引导解码</strong>(constrained / guided decoding)—— 只从合法词元采样以强制格式。各厂商把它称为<strong>结构化输出</strong>(structured output):定义一个含 <code>rationale</code> 与 <code>score</code> 的 <code>Response</code> 类,再在调用时传 <code>text_format=Response</code>。</p><p>两种主要变体:<strong>逐条</strong>(pointwise,评单条回答)与<strong>成对</strong>(pairwise,A 与 B 哪个更好?)。成对模式也是为奖励模型训练<em>合成偏好数据</em>的好办法,正如偏好微调那一讲所讲。</p>"
        },
        {
          "name": "Biases & pitfalls of LLM judges",
          "nameZh": "大模型裁判的偏差与陷阱",
          "body": "<p>LLM judges fail in systematic ways. <strong>Position bias</strong>: the judge may pick Response A just because it appeared first. The standard remedy is to ask both <em>A or B</em> and <em>B or A</em>, then take the majority/average; if the verdict flips, distrust it. (Tweaking position embeddings exists but is advanced.)</p><p><strong>Verbosity bias</strong>: the judge prefers a longer, more detailed answer even when a short, correct one is better. Remedies are explicit guidelines telling it not to favor length, few-shot examples, and/or a pointwise penalty on output length.</p><p><strong>Self-enhancement bias</strong>: a model rates outputs from itself more highly — intuitively, it generated that sequence because it found it probable. The slide shows a human-curated perfect answer (A) losing to a model-generated one (B). The remedy is to not use the same model for generation and judging — though since models share training data this is imperfect. A useful follow-up: a judge that is <em>bigger and stronger</em> is less likely to be fooled by something that merely sounds like its own output.</p><p>These three are not exhaustive — a judge simply being misaligned with human preference is another bias.</p>",
          "bodyZh": "<p>大模型裁判会以系统性的方式出错。<strong>位置偏差</strong>(position bias):裁判可能仅因回答 A 排在前面就选它。标准对策是既问 <em>A 还是 B</em> 又问 <em>B 还是 A</em>,再取多数/平均;若判定翻转,就别信它。(调整位置嵌入也行,但属进阶手段。)</p><p><strong>冗长偏差</strong>(verbosity bias):裁判偏好更长更详细的答案,哪怕简短而正确的更好。对策有:明确写进指引让它别偏好长度、加少样本示例,以及/或在逐条打分时对输出长度施加惩罚。</p><p><strong>自我增强偏差</strong>(self-enhancement bias):模型给自己产出的回答打更高分 —— 直觉上,它之所以生成那段序列,正因为它认为其概率高。幻灯片显示一份人工精修的完美答案(A)输给了模型生成的答案(B)。对策是生成与评判不用同一个模型 —— 不过因各模型共享训练数据,这并不彻底。一个有益的追问:一个<em>更大更强</em>的裁判,更不易被那些只是听起来像自己输出的内容所蒙骗。</p><p>这三种并不穷尽 —— 裁判本身与人类偏好不对齐也是一种偏差。</p>"
        },
        {
          "name": "Best practices, the revised workflow & factuality",
          "nameZh": "最佳实践、修订后的工作流与事实性",
          "body": "<p>The instructor's checklist: write <strong>crisp guidelines</strong>; prefer a <strong>binary scale</strong> over granular ones (easier for the judge and for human calibration); output the <strong>rationale before the score</strong>; mitigate the known biases; <strong>calibrate against human ratings</strong> by collecting some and running correlation analysis; and use a <strong>low temperature</strong> (around 0.1–0.2) for reproducible runs. The revised workflow keeps humans (the slow tortoise) in the loop only to calibrate the judge (the fast rabbit) — you must not over-optimize against the judge, which is itself only a proxy for human ratings.</p><p>Two dimension families matter: <strong>task performance</strong> (usefulness, factuality, relevance) and <strong>alignment</strong> (tone, style, safety). <strong>Factuality</strong> needs more nuance than a binary score because a long text mixes right and wrong claims. The recipe (Wei et al., 2024) is: one LLM call to <strong>decompose</strong> the text into atomic facts, then <strong>fact-check</strong> each one (often via RAG or web search), then aggregate with per-fact importance weights \\(\\alpha_i\\). For the teddy-bear text (created in the 1920s — wrong, it was the 1900s; Roosevelt <em>refused</em> to shoot — also wrong), only facts 2 and 3 are correct, giving a score of \\(0.60\\).</p>",
          "bodyZh": "<p>讲者的清单:写<strong>清晰的指引</strong>;偏好<strong>二元量表</strong>而非细粒度量表(对裁判与人工校准都更省事);让裁判先输出<strong>理由再给分</strong>;缓解已知偏差;通过收集少量人工评分并做相关性分析来<strong>对人类校准</strong>;并用<strong>低温度</strong>(约 0.1–0.2)以保证可复现。修订后的工作流只让人(慢吞吞的乌龟)参与校准裁判(跑得快的兔子)—— 切勿对裁判过度优化,因为裁判本身只是人类评分的代理。</p><p>两大维度族很重要:<strong>任务表现</strong>(有用性、事实性、相关性)与<strong>对齐</strong>(语气、风格、安全)。<strong>事实性</strong>(factuality)比二元打分需要更多细腻处理,因为长文本混杂着对与错的陈述。其配方(Wei 等,2024)是:用一次大模型调用把文本<strong>分解</strong>成原子事实,再对每个事实<strong>核查</strong>(常借助 RAG 或网络搜索),最后按每条事实的重要性权重 \\(\\alpha_i\\) 聚合。对那段泰迪熊文本(说创于 1920 年代 —— 错,应是 1900 年代;说罗斯福得意地要射杀 —— 也错,他其实<em>拒绝</em>了),只有第 2、3 条事实正确,得分为 \\(0.60\\)。</p>"
        },
        {
          "name": "Evaluating agents: tool-call failure modes",
          "nameZh": "评测智能体:工具调用的失败模式",
          "body": "<p>An agent loops over observe/plan/act, and a single tool call decomposes into three steps: (1) find the right tool and arguments, (2) execute it, (3) synthesize a response. The instructor catalogs failure modes at each. For <strong>tool prediction</strong>: <em>not using a tool</em> (the model <em>punts</em>: <code>Sorry, I cannot do that</code> — fix the recall-oriented tool router, or SFT/prompt the model to use the tool); <em>hallucinating a tool</em> (calling <code>find_bear()</code> when only <code>find_teddy_bear()</code> exists — model too weak, illogical API naming, or unclear instructions); <em>using the wrong tool</em>; and <em>inferring a wrong argument</em> (location <code>(0,0)</code> in the South Atlantic because the context lacked the user's location — add a helper tool or carry the info).</p><p>For the <strong>tool call</strong> itself: a wrong response or error (fix the implementation; note errors can be legitimate), or no response (always return something meaningful — even an empty JSON beats <code>None</code>, since empty JSON means <em>no bears found</em>). For <strong>response generation</strong>: the model ignores a valid result, often because the tool output spams the context or is not descriptive enough — trim it and make the output format meaningful. Be methodical: group errors by category.</p>",
          "bodyZh": "<p>智能体在观察/规划/行动间循环,而单次工具调用分为三步:(1) 找对工具与参数,(2) 执行,(3) 综合出回答。讲者逐步列举失败模式。<strong>工具预测</strong>阶段:<em>不用工具</em>(模型<em>摆烂</em>(punt):<code>抱歉,我做不到</code> —— 修以召回为导向的工具路由,或用 SFT/提示教模型去用它);<em>幻觉出工具</em>(只有 <code>find_teddy_bear()</code> 却调 <code>find_bear()</code> —— 模型太弱、API 命名不合逻辑、或指令不清);<em>用错工具</em>;以及<em>推错参数</em>(因上下文缺用户位置,坐标填成南大西洋的 <code>(0,0)</code> —— 加辅助工具或在上下文中携带信息)。</p><p><strong>工具调用</strong>本身:返回错误值或报错(去修实现;注意报错有时是合理的),或无返回(永远返回有意义的东西 —— 哪怕空 JSON 也胜过 <code>None</code>,因为空 JSON 表示<em>没找到熊</em>)。<strong>回答生成</strong>阶段:模型无视有效结果,常因工具输出刷屏占满上下文或描述性不足 —— 应裁剪并让输出格式有意义。要有条理:把错误按类别分组处理。</p>"
        },
        {
          "name": "Benchmarks, the Pareto frontier & contamination",
          "nameZh": "基准测试、帕累托前沿与数据污染",
          "body": "<p>Benchmarks compare whole models along an axis. <strong>Knowledge</strong>: <strong>MMLU</strong> (Massive Multitask Language Understanding) — 57 tasks (math, US history, law, medicine...), A/B/C/D choice, hardcoded match; it reflects pretraining quality. <strong>Reasoning</strong>: <strong>AIME</strong> (a hard high-school olympiad) where you give a 3-digit answer, and <strong>PIQA</strong> (Physical Interaction QA) — ~20k everyday-physics questions with two choices (e.g. vacuum with a <em>hairnet</em>, not a solid seal, to recover a lost item). <strong>Coding</strong>: <strong>SWE-bench</strong> — 2,294 real GitHub issues across 12 Python repos, each with a base commit and a merged PR with tests; the generated patch must pass the tests. It is a proxy for tool-use ability.</p><p><strong>Safety</strong>: <strong>HarmBench</strong> — 510 harmful behaviors graded by a <em>classifier</em> via attack success rate; it counts an attempt even if low-quality. Safety is provider-specific, so it is rarely used to rank models. <strong>Agents</strong>: <strong>tau-bench</strong> (Tool-Agent-User) — airline/retail domains with an LLM-simulated user, scored by database-state reward and <strong>pass^k</strong> (probability that <em>all</em> k attempts succeed — reliability, stricter than pass@k).</p><p>Models trace a <strong>Pareto frontier</strong> (quality vs cost/latency/context). Beware <strong>contamination</strong> (use hashes, blocklists, newer test versions) — Goodhart's Law: when a measure becomes a target it stops being good. Complement with Chatbot Arena and just trying models yourself.</p>",
          "bodyZh": "<p>基准沿某个维度比较整个模型。<strong>知识</strong>:<strong>MMLU</strong>(大规模多任务语言理解)—— 57 个任务(数学、美国史、法律、医学……),A/B/C/D 选项,硬编码匹配;反映预训练质量。<strong>推理</strong>:<strong>AIME</strong>(高难度高中奥赛,作答为三位数)与 <strong>PIQA</strong>(物理交互问答)—— 约 2 万道日常物理两选一题(例如用<em>发网</em>而非实心密封头去吸回丢失的小物件)。<strong>代码</strong>:<strong>SWE-bench</strong> —— 取自 12 个 Python 仓库的 2294 个真实 GitHub issue,每题含基础提交与一个带测试的已合并 PR;生成的补丁须通过测试,可作为工具使用能力的代理。</p><p><strong>安全</strong>:<strong>HarmBench</strong> —— 510 种有害行为,由一个<em>分类器</em>按攻击成功率评判,即便尝试质量低也计入。安全是各厂商自定的,故很少用来给模型排名。<strong>智能体</strong>:<strong>tau-bench</strong>(工具-智能体-用户)—— 航空/零售域,用一个大模型模拟用户,按数据库状态奖励与 <strong>pass^k</strong>(<em>所有</em> k 次尝试都成功的概率 —— 衡量可靠性,比 pass@k 更严)评分。</p><p>各模型勾勒出一条<strong>帕累托前沿</strong>(quality 与成本/延迟/上下文的权衡)。当心<strong>数据污染</strong>(用哈希、屏蔽名单、更新的测试版本)—— 古德哈特定律(Goodhart's Law):当一个度量成为目标,它就不再是好度量。再以 Chatbot Arena 及亲自试用模型来补全画面。</p>"
        }
      ],
      "takeaways": [
        "Human rating is the gold standard but slow, costly and subjective; track inter-rater agreement relative to chance (Cohen's/Fleiss' Kappa), not raw agreement.",
        "Rule-based metrics (METEOR, BLEU, ROUGE) compare against fixed references but miss stylistic variation, correlate weakly with humans, and still need references.",
        "LLM-as-a-judge scores and explains responses with no reference needed; force a parseable format with structured output, and prefer pairwise, binary, rationale-before-score.",
        "Judges have systematic biases — position (swap and average), verbosity (penalize length), self-enhancement (use a different, bigger model) — and must be calibrated against humans at low temperature.",
        "Factuality is measured by decomposing text into atomic facts, fact-checking each (RAG/web), and aggregating with importance weights.",
        "Agent evaluation means cataloging tool-call failure modes methodically across prediction, execution and synthesis.",
        "Benchmarks (MMLU, AIME, PIQA, SWE-bench, HarmBench, tau-bench with pass^k) profile a model along an axis; watch for contamination and remember Goodhart's Law."
      ],
      "takeawaysZh": [
        "人工评分是黄金标准,但慢、贵且主观;要追踪相对于随机基线的评分者一致性(Cohen's/Fleiss' Kappa),而非原始一致率。",
        "基于规则的指标(METEOR、BLEU、ROUGE)拿固定参考作比较,却忽略风格变化、与人类相关性弱,且仍需参考。",
        "LLM-as-a-judge 无需参考即可给回答打分并解释;用结构化输出强制可解析格式,并偏好成对、二元、先理由后分数。",
        "裁判有系统性偏差 —— 位置(交换取平均)、冗长(惩罚长度)、自我增强(换用更大的不同模型)—— 且须在低温度下对人类校准。",
        "事实性的衡量方式:把文本分解成原子事实、逐条核查(RAG/网络搜索),再按重要性权重聚合。",
        "评测智能体即有条理地在预测、执行、综合三步上归类工具调用的失败模式。",
        "基准(MMLU、AIME、PIQA、SWE-bench、HarmBench、带 pass^k 的 tau-bench)沿某一维度刻画模型画像;当心数据污染并牢记古德哈特定律。"
      ],
      "refs": [
        {
          "t": "Judging LLM-as-a-Judge with MT-Bench & Chatbot Arena (Zheng et al., 2023)",
          "u": "https://arxiv.org/abs/2306.05685",
          "tZh": "用 MT-Bench 与 Chatbot Arena 检验以大模型为裁判(原名 Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, 2023)"
        },
        {
          "t": "Long-form Factuality in Large Language Models / SAFE (Wei et al., 2024)",
          "u": "https://arxiv.org/abs/2403.18802",
          "tZh": "大模型中的长文本事实性 / SAFE(原名 Long-form factuality in large language models, 2024)"
        },
        {
          "t": "Measuring Massive Multitask Language Understanding / MMLU (Hendrycks et al., 2020)",
          "u": "https://arxiv.org/abs/2009.03300",
          "tZh": "衡量大规模多任务语言理解 / MMLU(原名 Measuring Massive Multitask Language Understanding, 2020)"
        },
        {
          "t": "SWE-bench: Can Language Models Resolve Real-World GitHub Issues? (Jimenez et al., 2023)",
          "u": "https://arxiv.org/abs/2310.06770",
          "tZh": "SWE-bench:语言模型能解决真实 GitHub issue 吗?(原名 SWE-bench, 2023)"
        },
        {
          "t": "tau-bench: A Benchmark for Tool-Agent-User Interaction (Yao et al., 2024)",
          "u": "https://arxiv.org/abs/2406.12045",
          "tZh": "tau-bench:工具-智能体-用户交互基准(原名 τ-bench, 2024)"
        },
        {
          "t": "HarmBench: Standardized Evaluation for Automated Red Teaming (Mazeika et al., 2024)",
          "u": "https://arxiv.org/abs/2402.04249",
          "tZh": "HarmBench:自动化红队的标准化评估框架(原名 HarmBench, 2024)"
        }
      ]
    },
    {
      "id": 9,
      "num": "09",
      "slug": "current-trends",
      "title": "Recap & Current Trends",
      "titleZh": "回顾与前沿趋势",
      "date": "Dec 5, 2025",
      "duration": "1:51:31",
      "videoId": "Q86qzJ1K1Ss",
      "accent": "fuchsia",
      "dateZh": "2025年12月5日",
      "tagline": "The season finale: how the pieces fit, and where the field is going next.",
      "taglineZh": "收官之讲:各部分如何拼成整体,以及这个领域接下来要去往何方。",
      "overview": "<p>The last lecture has a three-part menu, delivered by Afshine and Shervine. First, a <strong>recap</strong> walking lecture by lecture through the whole quarter so the pieces fit together: tokenization and embeddings, RNNs and their long-range limits, self-attention, the Transformer and its descendants (BERT, GPT, T5), LLMs and mixture-of-experts, scaling laws and efficient training (FlashAttention), the pretraining then fine-tuning then preference-tuning recipe, RL and reward models, reasoning with PPO and GRPO, RAG and tool calling and agents, and finally evaluation. Second, <strong>trends</strong>: the instructors stress that everything taught was Transformers for text-to-text, then show how the same self-attention idea travels to images (Vision Transformer), how multimodal models read images, and how ideas flow both ways with diffusion-based LLMs. Third, <strong>closing thoughts</strong> from Shervine: cross-pollination between modalities, how much foundational Transformer research is still open, hardware, the everyday uses of LLMs, what may come next, lingering challenges, and how to keep learning after the course.</p>",
      "overviewZh": "<p>最后一讲由 Afshine 与 Shervine 共同呈现,分三个部分。第一部分是<strong>回顾</strong>,逐讲串起整个学期,让各部分拼成整体:分词与词嵌入、循环网络及其长程依赖的局限、自注意力、Transformer 及其衍生模型(BERT、GPT、T5)、大语言模型与专家混合、扩展律与高效训练(FlashAttention)、预训练再微调再偏好微调的配方、强化学习与奖励模型、用 PPO 与 GRPO 做推理、RAG 与工具调用与智能体,最后是评测。第二部分是<strong>趋势</strong>:讲师强调整门课讲的都是用于文本到文本的 Transformer,然后展示同一套自注意力思想如何迁移到图像(视觉 Transformer),多模态模型如何读图,以及思想如何在两个方向上互相流动 —— 基于扩散的大语言模型。第三部分是 Shervine 的<strong>结语</strong>:模态之间的相互借鉴、Transformer 仍有多少基础研究悬而未决、硬件、大语言模型的日常用途、未来可能出现什么、尚存的挑战,以及结课后如何持续学习。</p>",
      "topics": [
        {
          "name": "Recap, part one: from tokens to efficient training (L1–L4)",
          "nameZh": "回顾(上):从词元到高效训练(L1–L4)",
          "body": "<p>The instructor rewinds roughly ten weeks. <strong>L1</strong>: text first becomes tokens (subword tokenization, so word roots are reused), then embeddings. Early word2vec representations were not context-aware; RNNs added context but suffered <em>long-range dependency</em> loss as sequences grew. The fix was <strong>self-attention</strong>, a direct link between any two tokens via query, key and value, scored by scaled dot products and a softmax, \\( \\text{softmax}(QK^{T}/\\sqrt{d_k})V \\). The Transformer (2017) has an encoder and a decoder, shown via translation. <strong>L2</strong>: refinements — rotary position embeddings (RoPE) rotate queries and keys so only relative distance matters inside attention; grouped-query attention shares key and value projections; pre-norm replaced post-norm. From the Transformer come BERT (encoder-only, embeddings for classification via the CLS token), GPT (decoder-only, autoregressive) and T5 (encoder-decoder). <strong>L3</strong>: LLMs are decoder-only text-to-text models; mixture-of-experts (MoE) sparsely activates a subset of feed-forward experts per token via a gate; sampling with a temperature knob trades determinism for variety. <strong>L4</strong>: scaling laws (bigger is better) led to a rule of thumb — train on at least 20 tokens per parameter (a 100B model wants 2T tokens); FlashAttention is an exact method that minimizes slow HBM reads/writes by tiling into fast SRAM and recomputing rather than storing.</p>",
          "bodyZh": "<p>讲师把时间倒回大约十周前。<strong>L1</strong>:文本先变成词元(子词分词,使词根可以复用),再变成词嵌入。早期的 word2vec 表示不具上下文感知;循环网络加入了上下文,却随序列变长而丢失<em>长程依赖</em>。解法是<strong>自注意力</strong> —— 任意两个词元之间通过查询、键、值建立直连,用缩放点积加 softmax 打分,\\( \\text{softmax}(QK^{T}/\\sqrt{d_k})V \\)。2017 年的 Transformer 含编码器与解码器,借翻译任务展示。<strong>L2</strong>:各项改进 —— 旋转位置编码(RoPE)旋转查询和键,使注意力内部只关心相对距离;分组查询注意力共享键值投影矩阵;前置归一化取代后置归一化。由 Transformer 衍生出 BERT(仅编码器,借 CLS 词元产出可用于分类的嵌入)、GPT(仅解码器,自回归)与 T5(编码器解码器)。<strong>L3</strong>:大语言模型是仅解码器的文本到文本模型;专家混合(MoE)通过门控为每个词元稀疏激活一部分前馈专家;用温度旋钮在确定性与多样性之间权衡。<strong>L4</strong>:扩展律(越大越好)引出一条经验法则 —— 每个参数至少训练 20 个词元(1000 亿参数模型需 2 万亿词元);FlashAttention 是一种精确方法,通过把计算切块送入快速的 SRAM 并重算而非存储,来尽量减少对慢速 HBM 的读写。</p>"
        },
        {
          "name": "Recap, part two: alignment, reasoning, agents, evaluation (L5–L8)",
          "nameZh": "回顾(下):对齐、推理、智能体、评测(L5–L8)",
          "body": "<p>Training has three stages: <strong>pretraining</strong> (trillions of tokens; an initialized model becomes an autocompleter), <strong>supervised fine-tuning</strong> (SFT — teaches the model what to do via input-output pairs), and <strong>preference tuning</strong> (teaches what not to do, using pairwise human-preference data). <strong>L5</strong> — which the instructor calls the most technically challenging lecture — frames the LLM as an RL policy: given the state (input so far) it takes an action (next token) in the environment of tokens, earning a reward. Since rewards are scarce, a reward model is trained pairwise via the Bradley-Terry formulation; the RL loss maximizes reward while staying close to the SFT base model (to curb <em>reward hacking</em>) and close to the previous iteration. <strong>L6</strong>: reasoning models output a chain-of-thought before the answer; this is taught with RL, where GRPO is now preferred over PPO because it drops the expensive value model and instead compares rewards across several sampled completions, and shines when rewards are <em>verifiable</em> (e.g. math, where you already know the answer). Extensions like Dr. GRPO and DAPO fix a length bias that otherwise rewards ever-longer wrong answers. <strong>L7</strong>: RAG retrieves documents (bi-encoder candidate search, then cross-encoder reranking, then augment the prompt) to go beyond the knowledge cutoff; tool calling lets the model pick an API and arguments; agents chain both. <strong>L8</strong>: rule-based metrics (BLEU, ROUGE, METEOR) miss valid paraphrases, so LLM-as-a-judge emits a rationale then a (often binary) score, with position, verbosity and self-enhancement biases to watch; benchmarks span knowledge, reasoning, coding and safety.</p>",
          "bodyZh": "<p>训练分三个阶段:<strong>预训练</strong>(数万亿词元;初始化模型变成自动补全器)、<strong>有监督微调</strong>(SFT —— 用输入输出对教模型该做什么),以及<strong>偏好微调</strong>(用成对的人类偏好数据教模型不该做什么)。<strong>L5</strong> —— 讲师称之为全课技术上最有挑战的一讲 —— 把大语言模型看作强化学习中的策略:给定状态(到目前为止的输入),它在词元环境里采取动作(下一个词元),获得奖励。由于奖励稀缺,奖励模型用 Bradley-Terry 公式以成对方式训练;强化学习损失在最大化奖励的同时,既要贴近 SFT 基座模型(以抑制<em>奖励黑客</em>),也要贴近上一轮迭代。<strong>L6</strong>:推理模型在给出答案前先输出思维链;这用强化学习来教,如今 GRPO 优于 PPO,因为它省去了昂贵的价值模型,改为在若干采样补全之间比较奖励,并在奖励<em>可验证</em>时(如数学题,答案已知)表现尤佳。Dr. GRPO 与 DAPO 等扩展修正了一种长度偏差 —— 否则会奖励越来越长的错误答案。<strong>L7</strong>:RAG 检索文档(双编码器候选检索,再用交叉编码器重排,再增广提示)以突破知识截止日;工具调用让模型挑选 API 及参数;智能体把两者串起来。<strong>L8</strong>:基于规则的指标(BLEU、ROUGE、METEOR)会漏掉合理的同义改写,因此用大语言模型当裁判 —— 先给理由再给(常为二元的)分数,需警惕位置偏差、冗长偏差与自我偏好偏差;基准覆盖知识、推理、编码与安全。</p>"
        },
        {
          "name": "Beyond text: Vision Transformer and multimodal models",
          "nameZh": "超越文本:视觉 Transformer 与多模态模型",
          "body": "<p>The instructor poses a natural question: the Transformer was born for translation, excelled at other text tasks — could it work on non-text inputs? The key realization is that text tokens are just vectors, so feed it vectors that represent something else, like image patches. For image understanding (a classification task) you keep the <strong>encoder</strong>, exactly as BERT did for classification. This is the <strong>Vision Transformer (ViT)</strong> (Dosovitskiy et al., 2020): split an image into fixed-size patches (e.g. 3x3), flatten each patch of RGB pixels through a learned linear projection into a vector, add a learnable CLS embedding and position embeddings, run the encoder so every patch attends to every other, then project the encoded CLS embedding through a feed-forward network to class probabilities — classifying, say, a teddy bear. The remarkable result: with enough data, ViT beats convolutional networks despite its <em>weaker inductive bias</em> (CNNs are hand-designed to scan locally; ViT lets all parts attend freely and simply learns the structure). For a vision-language model (VLM) answering questions about an image, <strong>Method 1</strong> (more common, e.g. LLaVA) encodes the image into tokens, concatenates them with text tokens, and decodes autoregressively; <strong>Method 2</strong> (less common, e.g. Llama 3) injects the image at the cross-attention layer. Transformers also power image generation (diffusion transformers, MM-DiT) and recommendation and speech — keep an open mind for non-text uses.</p>",
          "bodyZh": "<p>讲师抛出一个自然的问题:Transformer 为翻译而生,在其他文本任务上也很出色 —— 它能用于非文本输入吗?关键的认识是:文本词元本质上就是向量,那么把代表别的东西(比如图像块)的向量喂进去会怎样?对于图像理解(一个分类任务),保留<strong>编码器</strong>即可,正如 BERT 用于分类那样。这就是 <strong>视觉 Transformer(ViT)</strong>(Dosovitskiy 等,2020):把图像切成固定大小的块(如 3x3),把每块的 RGB 像素通过一个可学习的线性投影压平成向量,加上可学习的 CLS 嵌入和位置嵌入,跑编码器让每块与其他块互相注意,再把编码后的 CLS 嵌入经前馈网络投影到各类别概率 —— 比如把一张图分类为泰迪熊。值得注意的结果是:在数据足够多时,尽管 ViT 的<em>归纳偏置更弱</em>(卷积网络是人为设计来局部滑动扫描的;ViT 让各部分自由互注意,直接学出结构),它依然胜过卷积网络。对于回答图像问题的视觉语言模型(VLM),<strong>方法一</strong>(更常见,如 LLaVA)把图像编码成词元,与文本词元拼接,再自回归解码;<strong>方法二</strong>(较少见,如 Llama 3)在交叉注意力层注入图像。Transformer 还驱动图像生成(扩散 Transformer、MM-DiT)以及推荐与语音 —— 对非文本用途保持开放心态。</p>"
        },
        {
          "name": "Diffusion LLMs: borrowing from the image world",
          "nameZh": "扩散式大语言模型:向图像世界借鉴",
          "body": "<p>If ViT brought text ideas to vision, diffusion goes the other way. Today's LLMs are <strong>autoregressive (ARM)</strong>: predict the next token, append it, repeat — so inference is <em>not parallelizable</em> (each step needs all prior ones), though training is, thanks to the causal mask. To escape this, researchers adapt diffusion, which works wonderfully for images and produced impressive 2025 demos (Google's I/O text-diffusion model; startups like Inception). In images, you start from <strong>noise</strong> (easy to sample, mathematically clean via Gaussians) and learn a transformation to the data distribution — the instructor quotes Michelangelo: the sculpture is already in the marble, you just chisel away the superfluous. Diffusion adds noise (forward) then learns to denoise (reverse). But text is <em>discrete</em>, not continuous, so there is no obvious noise. The insight: <strong>the mask token is to text what noise is to images</strong>. The forward process masks more and more tokens until all are masked; the reverse process learns to unmask and reconstruct, conditioned on a prompt. These are <strong>masked diffusion models (MDM)</strong> or diffusion LLMs (DLLM). The intuition: like drafting a speech as a rough outline then refining each section — coarse-to-fine, not strictly left-to-right. The payoff is speed (decoding in far fewer forward passes, claims of ~10x output tokens/sec), useful for coding and naturally good at fill-in-the-middle. Open work: matching frontier performance, and porting ARM tricks like reasoning chains. Suggested reading: Large Language Diffusion Models (Nie et al., 2025).</p>",
          "bodyZh": "<p>如果说 ViT 把文本的思想带到视觉,扩散则走相反方向。今天的大语言模型是<strong>自回归(ARM)</strong>的:预测下一个词元,追加,重复 —— 因此推理<em>无法并行</em>(每一步都需要之前所有步),不过训练借助因果掩码是可以并行的。为摆脱这点,研究者借鉴了在图像上极其奏效的扩散,并在 2025 年带来令人印象深刻的演示(谷歌 I/O 的文本扩散模型;Inception 等创业公司)。在图像中,你从<strong>噪声</strong>出发(易于采样,用高斯分布在数学上很干净),学习一个通向数据分布的变换 —— 讲师引用米开朗基罗:雕塑本已在大理石中,你只需凿去多余的部分。扩散先加噪(正向),再学去噪(反向)。但文本是<em>离散</em>的,而非连续,因此没有现成的噪声。关键洞见是:<strong>掩码词元之于文本,正如噪声之于图像</strong>。正向过程逐步掩盖越来越多的词元直至全被掩盖;反向过程在提示的条件下学习去掩并重建原句。这类模型叫<strong>掩码扩散模型(MDM)</strong>或扩散式大语言模型(DLLM)。直觉上:就像写演讲稿先列粗略提纲再逐节细化 —— 由粗到细,而非严格从左到右。回报是速度(解码所需的前向次数少得多,有基准称每秒输出词元约快 10 倍),对编码很有用,也天然擅长中间填空。尚待解决的工作:追平前沿性能,以及把思维链等自回归技巧移植过来。推荐阅读:Large Language Diffusion Models(Nie 等,2025)。</p>"
        },
        {
          "name": "Closing thoughts: open research, hardware, uses, and what is next",
          "nameZh": "结语:开放研究、硬件、用途与未来",
          "body": "<p>Shervine closes on <strong>cross-pollination</strong>: diffusion came from images to text; transformers replaced convolutions in image diffusion (DiT); DeepSeek-OCR shows text can be reconstructed from very few vision tokens, hinting tokenizers may not be the best tool; RoPE was reformulated to 2D for images. He stresses foundational Transformer research is <em>very much alive and unsettled</em>: optimizers (AdamW vs the newer MuonClip from Kimi K2), normalization (post-norm gave way to pre-norm, layer-norm to RMSNorm), attention design (MHA/MQA/GQA varying per layer and paper), activation functions (ReLU to GELU-like), MoE-or-not, and layer counts are all still debated. <strong>Data</strong> is a worry: the web is now flooded with LLM-generated text, risking <em>model collapse</em> (less diverse data, weaker learning); the response is data curation and a new <em>mid-training</em> stage on smaller high-quality corpora. The field is shifting from pure benchmark-chasing toward the cost/quality Pareto frontier — hence small language models (SLMs), since providers reportedly lose money even on top tiers. On <strong>hardware</strong>, GPUs only really do matrix multiplies while attention needs constant KV reads/writes; an analog in-memory computing paper claims up to ~100x latency and ~70,000x energy gains over an H100. Everyday <strong>uses</strong> already span coding, conversational assistants, creativity and learning — Shervine praises students who brainstorm concepts with ChatGPT to learn faster. Next: democratized agents (Google Workspace), browser and OS-level assistants (Atlas), maybe truly useful customer service. Open <strong>challenges</strong>: fixed weights vs continuous learning, hallucinations (arguably a design consequence of next-token prediction), personalization, interpretability, safety. To stay current: arXiv cs.CL, NeurIPS/ICML/ICLR/ACL, authors' GitHub, Hugging Face trending papers, Twitter/X, and YouTube educators like Yannic Kilcher and Andrej Karpathy. The instructors thank the class and bring back the teddy bear one last time.</p>",
          "bodyZh": "<p>Shervine 以<strong>模态间相互借鉴</strong>收尾:扩散从图像来到文本;Transformer 在图像扩散中取代了卷积(DiT);DeepSeek-OCR 表明文本可以从极少的视觉词元中重建,暗示分词器未必是最佳工具;RoPE 被改写成二维以用于图像。他强调 Transformer 的基础研究<em>依然非常活跃且未有定论</em>:优化器(AdamW 对比来自 Kimi K2 的较新 MuonClip)、归一化(后置归一化让位于前置归一化,层归一化让位于 RMSNorm)、注意力设计(MHA/MQA/GQA 在不同层和不同论文间各异)、激活函数(从 ReLU 转向类 GELU)、是否用 MoE、层数,都仍在争论。<strong>数据</strong>令人担忧:如今网络充斥着大语言模型生成的文本,有<em>模型崩溃</em>之险(数据多样性下降,学习变弱);应对之道是数据筛选,以及在更小的高质量语料上做新增的<em>中期训练</em>阶段。这个领域正从单纯追逐基准,转向成本与质量的帕累托前沿 —— 于是有了小语言模型(SLM),因为据说服务商即便在最高档套餐上也在亏钱。在<strong>硬件</strong>方面,GPU 真正擅长的只是矩阵乘法,而注意力需要不断读写 KV;一篇模拟内存内计算的论文称相对 H100 可获约 100 倍延迟、约 70000 倍能耗的提升。日常<strong>用途</strong>已涵盖编码、对话助手、创意与学习 —— Shervine 称赞那些用 ChatGPT 头脑风暴概念以更快学习的学生。未来:智能体平民化(Google Workspace)、浏览器与操作系统级助手(Atlas),也许还有真正好用的客服。开放<strong>挑战</strong>:固定权重对比持续学习、幻觉(可以说是下一个词元预测这一设计的后果)、个性化、可解释性、安全。保持更新的途径:arXiv 的 cs.CL、NeurIPS/ICML/ICLR/ACL、作者的 GitHub、Hugging Face 的热门论文、Twitter/X,以及 Yannic Kilcher 与 Andrej Karpathy 等 YouTube 讲者。讲师感谢全班,并最后一次请出那只泰迪熊。</p>"
        }
      ],
      "takeaways": [
        "The course composes into one stack: tokens and embeddings, self-attention and the Transformer, LLMs and MoE, scaling and efficient training, then SFT, preference tuning, RL reasoning (PPO then GRPO), RAG, tools, agents and evaluation.",
        "Self-attention is the load-bearing idea, and it generalizes: text tokens are just vectors, so the same encoder classifies image patches (Vision Transformer), beating CNNs given enough data thanks to weaker inductive bias.",
        "Ideas flow both ways across modalities: diffusion LLMs treat the mask token as text's version of noise, decoding in far fewer forward passes (~10x faster), with coding and fill-in-the-middle as natural fits.",
        "Foundational Transformer research is unsettled — optimizers (MuonClip), normalization (RMSNorm, pre-norm), attention variants, activations and MoE choices still vary across papers, and the Transformer may not be the final architecture.",
        "Data quality (avoiding model collapse, adding a mid-training stage), the cost/quality Pareto frontier and small models, and attention-native analog hardware are emerging frontiers.",
        "Open challenges remain: continuous learning vs fixed weights, hallucinations, personalization, interpretability and safety; consolidate by building and stay current via arXiv, conferences, GitHub and educators like Karpathy."
      ],
      "takeawaysZh": [
        "整门课汇成一套栈:词元与嵌入、自注意力与 Transformer、大语言模型与 MoE、扩展与高效训练,再到 SFT、偏好微调、强化学习推理(先 PPO 后 GRPO)、RAG、工具、智能体与评测。",
        "自注意力是承重的核心思想,而且可以泛化:文本词元本质就是向量,于是同一个编码器也能给图像块分类(视觉 Transformer),凭借更弱的归纳偏置,在数据足够时胜过卷积网络。",
        "思想在模态之间双向流动:扩散式大语言模型把掩码词元当作文本版的噪声,所需前向次数少得多(约快 10 倍),编码与中间填空是天然契合的场景。",
        "Transformer 的基础研究尚无定论 —— 优化器(MuonClip)、归一化(RMSNorm、前置归一化)、注意力变体、激活函数与是否用 MoE 在各论文间仍不统一,Transformer 也未必是终极架构。",
        "数据质量(避免模型崩溃、增设中期训练阶段)、成本与质量的帕累托前沿与小模型,以及为注意力原生设计的模拟硬件,都是正在浮现的前沿。",
        "开放挑战仍在:持续学习对比固定权重、幻觉、个性化、可解释性与安全;靠动手实践来巩固,并通过 arXiv、会议、GitHub 以及 Karpathy 等讲者保持更新。"
      ],
      "refs": [
        {
          "t": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (Dosovitskiy et al., 2020)",
          "u": "https://arxiv.org/abs/2010.11929",
          "tZh": "一图胜过 16x16 个词:大规模图像识别的 Transformer,即视觉 Transformer / ViT(原名 An Image is Worth 16x16 Words, 2020)"
        },
        {
          "t": "Visual Instruction Tuning — LLaVA (Liu et al., 2023)",
          "u": "https://arxiv.org/abs/2304.08485",
          "tZh": "视觉指令微调,即视觉语言模型 LLaVA,把图像词元与文本词元拼接(原名 Visual Instruction Tuning, 2023)"
        },
        {
          "t": "Large Language Diffusion Models — LLaDA (Nie et al., 2025)",
          "u": "https://arxiv.org/abs/2502.09992",
          "tZh": "大语言扩散模型 LLaDA,讲解掩码扩散用于文本生成的数学原理(原名 Large Language Diffusion Models, 2025)"
        },
        {
          "t": "Scalable Diffusion Models with Transformers — DiT (Peebles & Xie, 2022)",
          "u": "https://arxiv.org/abs/2212.09748",
          "tZh": "用 Transformer 取代卷积的可扩展扩散模型 DiT(原名 Scalable Diffusion Models with Transformers, 2022)"
        },
        {
          "t": "DeepSeek-OCR: Contexts Optical Compression (Wei et al., 2025)",
          "u": "https://arxiv.org/abs/2510.18234",
          "tZh": "用极少视觉词元重建文本,暗示分词器未必最优(原名 DeepSeek-OCR: Contexts Optical Compression, 2025)"
        },
        {
          "t": "Kimi K2: Open Agentic Intelligence (Kimi Team, 2025)",
          "u": "https://arxiv.org/abs/2507.20534",
          "tZh": "提出 MuonClip 优化器、挑战 AdamW 标准地位(原名 Kimi K2: Open Agentic Intelligence, 2025)"
        },
        {
          "t": "The Curse of Recursion: Training on Generated Data Makes Models Forget (Shumailov et al., 2023)",
          "u": "https://arxiv.org/abs/2305.17493",
          "tZh": "用生成数据训练导致模型崩溃、数据多样性下降(原名 The Curse of Recursion, 2023)"
        },
        {
          "t": "Analog in-memory computing attention mechanism for fast and energy-efficient LLMs (Leroux et al., 2025)",
          "u": "https://arxiv.org/abs/2409.19315",
          "tZh": "为注意力原生设计的模拟内存内计算硬件,称相对 H100 大幅降低延迟与能耗(原名 Analog in-memory computing attention mechanism, 2025)"
        },
        {
          "t": "CME 295 — official VIP cheatsheet and Super Study Guide",
          "u": "https://github.com/afshinea/stanford-cme-295-transformers-large-language-models",
          "tZh": "CME 295 官方速查表与《Super Study Guide》,含多语言版本(VIP cheatsheet, 2024)"
        }
      ]
    }
  ],
  "milestones": [
    {
      "after": 4,
      "label": "Midterm Exam",
      "labelZh": "期中考试",
      "date": "Oct 24, 2025"
    },
    {
      "after": 9,
      "label": "Final Exam",
      "labelZh": "期末考试",
      "date": "Dec 10, 2025"
    }
  ]
};

if (typeof window !== "undefined") window.COURSE = COURSE;
