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
      "tagline": "A model only understands numbers. So how does it read 'A cute teddy bear is reading'? Follow that one question and you build the Transformer.",
      "taglineZh": "模型只懂数字,那它怎么读懂「A cute teddy bear is reading」?顺着这一个问题往下走,Transformer 就被你搭出来了。",
      "overview": "<p>Afshine and Shervine build the Transformer the slow way, the way that makes you see why each piece had to exist. Start with a model that reads only numbers and a sentence made of words. Something has to give. So you cut the text into tokens, turn the tokens into vectors, and try to make those vectors carry meaning. Word2vec gets you dense vectors. RNNs and LSTMs add word order. Each design works for a while, then dies of one concrete flaw — no context, vanishing gradients, too slow because it runs one word at a time. Every flaw points at the same fix: <strong>attention</strong>.</p><p>That is the 2017 paper, <em>Attention Is All You Need</em>. Query, key, value. Multi-head attention. An encoder that reads the source and a decoder that writes the target, with positional encodings bolted on so order survives. The lecture ends by running one sentence — <em>'A cute teddy bear is reading.'</em> — all the way through, word by word, into French.</p>",
      "overviewZh": "<p>Afshine 和 Shervine 用慢办法搭 Transformer:让你亲眼看到每一块为什么非有不可。开头很简单 —— 模型只读数字,句子却是一串词,总得有人让步。于是先把文本切成词元,再把词元变成向量,然后想办法让这些向量装得下意思。Word2vec 给你稠密向量,RNN 和 LSTM 把词序加进来。每种设计都管用一阵子,然后死于一个具体毛病 —— 没有上下文、梯度消失、一次只走一个词所以太慢。每个毛病都指向同一个解药:<strong>注意力(attention)</strong>。</p><p>这就是 2017 年那篇《Attention Is All You Need》。查询、键、值;多头注意力;一个读源语言的编码器,一个写目标语言的解码器,再栓上位置编码,好让顺序不丢。最后这堂课把一句话 —— <em>'A cute teddy bear is reading.'</em> —— 一个词一个词地从头跑到尾,翻成法语。</p>",
      "topics": [
        {
          "name": "What NLP tasks look like, and how we score them",
          "nameZh": "NLP 任务长什么样,又怎么打分",
          "body": "<p>What does <strong>NLP</strong> (natural language processing) actually ask a computer to do? Just compute things with text. The instructor drops every task into three buckets. <strong>Classification</strong> takes text in and gives one label out: is 'This teddy bear is SO CUTE!' positive or negative? 'I want to create an alarm for tomorrow' &rarr; the intent is create-alarm. Plus language detection and topic modeling. <strong>Multi-classification</strong> takes text in and tags several things at once — named-entity recognition labels 'teddy bear' as an ENTITY; part-of-speech tagging marks each word as noun or verb; then dependency and constituency parsing. <strong>Generation</strong> takes text in and gives text out, and you don't know the output length ahead of time: translation, question answering, summarization, a poem, some code.</p><p>Each bucket scores differently. Classification uses <code>accuracy</code>, then <code>precision</code> (of the things you called positive, how many were right) and <code>recall</code> (of the things that really were positive, how many you caught), and <code>F1</code>, their harmonic mean, to hand you one number. Why not just accuracy? Picture a dataset that is 99% positive and 1% negative. A model that blindly answers 'positive' every time scores 99% accuracy and is useless — precision and recall catch it; accuracy hides it. Translation is harder to grade, because a sentence has many correct translations. So people leaned on reference-based metrics: <strong>BLEU</strong> and <strong>ROUGE</strong> (the ML community's little joke — in French 'bleu' is blue, 'rouge' is red), plus <strong>perplexity</strong>, which asks how surprised the model is by its own output. BLEU and ROUGE go up when things are good; perplexity goes down. Every reference costs time and money to label, which is exactly why later in the course we drop references and score without them.</p>",
          "bodyZh": "<p><strong>NLP</strong>(自然语言处理)到底让计算机干什么?就是用文本做计算。讲者把所有任务丢进三个桶。<strong>分类</strong>:输入文本,输出一个标签 —— 'This teddy bear is SO CUTE!' 是正面还是负面?'I want to create an alarm for tomorrow' &rarr; 意图是创建闹钟。再加上语种检测、主题建模。<strong>多分类</strong>:输入文本,一次标好几样 —— 命名实体识别把 'teddy bear' 标成一个实体 ENTITY;词性标注把每个词标成名词或动词;还有依存和成分句法分析。<strong>生成</strong>:输入文本,输出文本,而且事先不知道输出多长 —— 翻译、问答、摘要、写首诗、写段代码。</p><p>每个桶打分方式不一样。分类用 <code>accuracy</code>(准确率),再加 <code>precision</code>(精确率:你判成正面的里头,有几个真对)和 <code>recall</code>(召回率:真正面的里头,你抓到几个),还有 <code>F1</code>(二者的调和平均),给你一个数。为什么不只看准确率?设想一个数据集 99% 是正面、1% 是负面。一个不管三七二十一永远答「正面」的模型,准确率 99%,却毫无用处 —— 精确率和召回率一抓一个准,准确率却把它盖住了。翻译更难打分,因为一句话有很多种正确译法。所以过去靠基于参考译文的指标:<strong>BLEU</strong> 和 <strong>ROUGE</strong>(机器学习圈的小玩笑 —— 法语里 'bleu' 是蓝、'rouge' 是红),再加 <strong>perplexity</strong>(困惑度),问的是模型被自己的输出惊到什么程度。BLEU 和 ROUGE 越高越好,困惑度越低越好。每一条参考译文都要花时间花钱去标,这也正是后面课程要甩掉参考译文、不靠它打分的原因。</p>"
        },
        {
          "name": "Tokenization: cutting text into pieces a model can swallow",
          "nameZh": "分词:把文本切成模型咽得下的小块",
          "body": "<p>A model reads numbers, not text. So before anything else you have to cut the sentence into pieces. That cutting is <strong>tokenization</strong>, and each piece is a <strong>token</strong> — and a token can be any unit you choose. Take <em>'A cute teddy bear is reading.'</em> You can chop it three ways, and each way pays for what it buys.</p><ul><li><strong>By word:</strong> simple, easy to read. But 'bear' and 'bears', 'run' and 'runs', land as completely separate tokens, and then you are stuck forcing their vectors to look alike. The vocabulary balloons, and you hit <strong>OOV</strong> (out-of-vocabulary): any word the model never saw in training becomes an UNKNOWN token at inference, a junk bucket for everything it can't place.</li><li><strong>By subword</strong> (WordPiece, BPE): cut along shared roots — 'teddy'&rarr;'ted','##dy', 'reading'&rarr;'read','##ing' — so 'bear' and 'bears' both keep the 'bear' piece. OOV gets rare. The bill: longer sequences.</li><li><strong>By character:</strong> shrug off misspellings and weird casing, almost never go OOV. But the sequence gets very long, and ask yourself what the vector for a lone 'u' is supposed to mean — basically nothing.</li></ul><p>Why does 'longer sequence' count against you? Here is the preview the instructor gives: a model's cost climbs with sequence length. More tokens, more to process, slower training, slower inference. In practice a single-language vocabulary runs in the tens of thousands; go multilingual or feed it code and it climbs into the hundreds of thousands. Subword sits in the sweet spot.</p>",
          "bodyZh": "<p>模型读的是数字,不是文本。所以动手之前,得先把句子切成小块。这一刀叫<strong>分词(tokenization)</strong>,切出来的每一块叫<strong>词元(token)</strong> —— 词元想取多大单位都行。拿 <em>'A cute teddy bear is reading.'</em> 来说,有三种切法,每种切法都得为它的好处付账。</p><ul><li><strong>按词:</strong> 简单、好读。可是 'bear' 和 'bears'、'run' 和 'runs' 会落成完全不同的词元,你只好硬逼它们的向量长得像。词表越撑越大,还会撞上 <strong>OOV</strong>(未登录词,out-of-vocabulary):训练时没见过的词,推理时只能标成 UNKNOWN(未知),成了一切认不出来的东西的垃圾桶。</li><li><strong>按子词</strong>(WordPiece、BPE):顺着共享词根切 —— 'teddy'&rarr;'ted','##dy','reading'&rarr;'read','##ing' —— 于是 'bear' 和 'bears' 都留着 'bear' 这一片。OOV 变得很少。账单是:序列变长。</li><li><strong>按字符:</strong> 拼错、大小写乱了都无所谓,几乎不会 OOV。但序列会拖得很长,而且你想想看,单个 'u' 的向量该表示什么 —— 基本啥也不是。</li></ul><p>序列变长怎么就成了缺点?讲者先剧透一句:模型的开销随序列长度往上爬。词元越多,要处理的就越多,训练更慢,推理更慢。实践里,单一语言的词表是几万量级;一旦上多语言、或者喂代码进去,就涨到几十万。子词正好卡在折中的位置上。</p>"
        },
        {
          "name": "Word representation: one-hot, similarity, and word2vec",
          "nameZh": "词表示:独热编码、相似度,和 word2vec",
          "body": "<p>You have tokens. Now each one needs a number form. The first thing anyone tries is <strong>one-hot encoding</strong>: with a three-token vocabulary {soft, teddy bear, book} you write [1,0,0], [0,1,0], [0,0,1]. To ask how close two tokens are, use <strong>cosine similarity</strong> — the angle between two vectors. Point the same way, they're similar; sit at right angles, they're unrelated; point opposite, they're opposites. Here is what kills one-hot: every one-hot vector sits at right angles to every other. So 'teddy bear' looks exactly as unrelated to 'soft' as it does to 'book'. That is backwards. Teddy bears are soft — you want 'teddy bear' and 'soft' close, and 'teddy bear' and 'book' near zero.</p><p>The fix is to stop hand-writing the vectors and <strong>learn</strong> them from data. <strong>Word2vec</strong> (2013) caught on because its vectors did something you could read off by hand: <em>king is to queen as Paris is to France, as Berlin is to Germany</em>. How did they get there? A <strong>proxy task</strong>. <strong>CBOW</strong> looks at the words around a blank and predicts the blank; <strong>skip-gram</strong> runs it backwards, from one word out to its neighbors. Nobody actually wants the prediction. The point is sneakier: a model that can predict the next word must have soaked up how language works, and that knowledge ends up baked into the vectors. Walk it through. Feed the one-hot of 'A', [1,0,0,0,0,0], into a plain little net — input width V, one hidden layer of width d much smaller than V (say 768), output width V. Softmax turns the output into next-word probabilities like [0.2,0.4,0.1,0.1,0.1,0.1]. Cross-entropy measures how far that is from the true next word, and backprop nudges the weights to close the gap. Do it over the whole corpus. When you're done, the hidden-layer weights — the 'green units' on the slide — are the embedding for each token.</p>",
          "bodyZh": "<p>词元有了,现在每个都得有个数字形态。谁上来都会先试<strong>独热编码(one-hot)</strong>:词表是三个词元 {soft, teddy bear, book} 时,就写成 [1,0,0]、[0,1,0]、[0,0,1]。想问两个词元有多近,用<strong>余弦相似度(cosine similarity)</strong> —— 两个向量之间的夹角。朝同一个方向,就相似;成直角,就无关;朝相反方向,就相反。独热的死穴在这:每个独热向量都跟其他所有向量成直角。于是 'teddy bear' 跟 'soft' 看着多无关,跟 'book' 就一样多无关。这正好反了。teddy bear 是软的 —— 你想要 'teddy bear' 和 'soft' 靠近,'teddy bear' 和 'book' 贴近零。</p><p>解法是别再手写向量,改成从数据里<strong>学</strong>出来。<strong>Word2vec</strong>(2013)火起来,是因为它学出的向量能让你用手算着读:<em>king 之于 queen,如同 Paris 之于 France,如同 Berlin 之于 Germany</em>。怎么做到的?一个<strong>代理任务(proxy task)</strong>。<strong>CBOW</strong> 看着空格周围的词去猜空格;<strong>skip-gram</strong> 反着来,从一个词去猜它周围的词。其实没人真在乎这个预测。门道更绕一层:一个能预测下一个词的模型,必然已经把语言的规律吸了进去,而这点本事最后就烙进了向量里。走一遍。把 'A' 的独热 [1,0,0,0,0,0] 喂进一个朴素小网络 —— 输入宽 V,一层隐藏层宽 d,d 比 V 小得多(比如 768),输出宽 V。softmax 把输出变成下一个词的概率,像 [0.2,0.4,0.1,0.1,0.1,0.1]。交叉熵量出它离真实下一个词有多远,反向传播再去推权重把这个差补上。整个语料跑一遍。跑完,隐藏层那组权重 —— 幻灯片上那些 '绿色单元' —— 就是每个词元的嵌入。</p>"
        },
        {
          "name": "RNNs and LSTMs: order arrives, but memory fades",
          "nameZh": "RNN 与 LSTM:顺序来了,记忆却在褪",
          "body": "<p>Want a vector for a whole sentence? Average its word embeddings. Quick — and it throws away the <em>order</em>, and hands every token the same vector no matter where it sits. <strong>Recurrent Neural Networks</strong> (RNNs, dreamed up back in the 1980s) put order back. They carry a <strong>hidden state</strong> — call it the activation or context vector, written \\(a\\) or \\(h\\) — and read one token at a time. A module takes the hidden state so far plus the current token, emits an output to predict the next token, and rolls the hidden state forward:</p>\\[ a^{\\langle t \\rangle} = g\\left(W_{a} a^{\\langle t-1 \\rangle} + W_{x} x^{\\langle t \\rangle} + b\\right). \\]<p>This drops straight onto the three buckets. Classify a sentence? Take the <em>last</em> hidden state. Label a token? Take that token's state. Generate? Squeeze the whole source into one context vector, then decode from it. <strong>LSTMs</strong> (1997) bolt on a second track, a <strong>cell state</strong> \\(c\\), to hold onto what matters for longer.</p><p>But RNNs carry real baggage. The whole sentence has to live inside one hidden state, so <strong>long-range dependencies</strong> slip away — the model forgets what it saw early on. Worse, training backpropagates through time, and that turns into a long product of factors. Below one, the product collapses toward zero and the gradient <strong>vanishes</strong>; above one, it <strong>explodes</strong>. Multiply a string of small numbers and you get nothing — and a weight you're trying to update by nothing just doesn't move. That is the vanishing-gradient problem. And because step \\(t\\) waits on step \\(t-1\\), the whole thing runs one token after another. Long sequence, long wait.</p>",
          "bodyZh": "<p>想给整句话一个向量?把它的词嵌入取平均。快是快 —— 顺序也被它扔了,而且不管词在哪个位置,都给同一个向量。<strong>循环神经网络</strong>(RNN,早在 1980 年代就被想出来了)把顺序补了回来。它携带一个<strong>隐藏状态</strong> —— 叫激活值或上下文向量也行,记作 \\(a\\) 或 \\(h\\) —— 一次读一个词元。一个模块拿此前的隐藏状态加当前词元,吐出一个用来预测下一个词元的输出,再把隐藏状态往前滚:</p>\\[ a^{\\langle t \\rangle} = g\\left(W_{a} a^{\\langle t-1 \\rangle} + W_{x} x^{\\langle t \\rangle} + b\\right). \\]<p>这跟三个桶一一对得上。给整句分类?取<em>最后</em>一个隐藏状态。给某个词元打标签?取那个词元的状态。生成?把整段源文本挤进一个上下文向量,再从它解码出来。<strong>LSTM</strong>(1997)又栓上第二条轨道,一个<strong>细胞状态(cell state)</strong> \\(c\\),把要紧的东西多攥住一会儿。</p><p>可 RNN 背着实打实的包袱。整句话得塞进一个隐藏状态里,于是<strong>长程依赖</strong>会溜走 —— 模型把开头看过的东西忘了。更糟的是,训练要沿时间反向传播,这就变成一长串因子连乘。小于 1,乘积塌向零,梯度<strong>消失</strong>;大于 1,就<strong>爆炸</strong>。一串小数乘到底,啥也不剩 —— 而你想拿一个「啥也不剩」去更新某个权重,它根本不动。这就是梯度消失。再加上第 \\(t\\) 步得等第 \\(t-1\\) 步,整件事只能一个词元接一个词元地走。序列一长,就得干等。</p>"
        },
        {
          "name": "Attention and self-attention: a wire straight to the past",
          "nameZh": "注意力与自注意力:一根直通过去的线",
          "body": "<p>If memory fades when everything has to squeeze through one hidden state, why squeeze it at all? Run a <strong>wire straight</strong> from the word you're predicting to the earlier words that matter. That is <strong>attention</strong>, introduced in 2014 by Bahdanau for translation: as you write the next French word, it would help to take a peek at the right slice of the English input. The 2017 Transformer takes the idea all the way — <strong>self-attention</strong> — and throws out recurrence entirely. Every token wires to every other token <em>at once</em>. Now 'teddy bear' gets a vector shaped by the words around it, so 'bank' in 'river bank' and 'bank' in 'robbing a bank' come out different.</p><p>The three words to learn are <strong>query, key, value</strong> (Q, K, V). To rewrite 'teddy bear' in terms of the rest of the sentence, take its <strong>query</strong> and compare it against every token's <strong>key</strong> to score how similar they are. Those scores weight the matching <strong>values</strong>, and you take the weighted average. Across the whole sequence, write it as matrices:</p>\\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V. \\]<p>Q, K and V aren't handed to you — they come from <strong>learned projection matrices</strong>. And writing it as matrices is the whole point: GPUs love matrices, so the entire sequence goes through in parallel. That is the edge an RNN never had, because an RNN is stuck going one token at a time.</p>",
          "bodyZh": "<p>既然一切都得挤过一个隐藏状态、记忆就会褪,那干嘛还挤?从你正在预测的那个词,拉一根<strong>线直通</strong>过去那些要紧的词。这就是<strong>注意力(attention)</strong>,2014 年 Bahdanau 为翻译提出来:写下一个法语词时,要是能瞥一眼英语输入里对应的那一小块,就省事了。2017 年的 Transformer 把这想法推到底 —— <strong>自注意力(self-attention)</strong> —— 干脆把循环整个扔掉。每个词元<em>一次性</em>跟其他每个词元连上线。这下 'teddy bear' 拿到的向量由它周围的词塑形,于是 'river bank'(河岸)里的 'bank' 和 'robbing a bank'(抢银行)里的 'bank' 出来就不一样了。</p><p>要记的三个词是<strong>查询、键、值</strong>(query, key, value,即 Q、K、V)。想用句子里其余的词重写 'teddy bear',就拿它的<strong>查询</strong>去跟每个词元的<strong>键</strong>比,打出相似度分。这些分给对应的<strong>值</strong>加权,再取加权平均。对整段序列,写成矩阵:</p>\\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right)V. \\]<p>Q、K、V 不是白给你的 —— 它们来自<strong>可学习的投影矩阵</strong>。写成矩阵正是要害所在:GPU 喜欢矩阵,于是整段序列并行跑完。这是 RNN 从来没有的优势,因为 RNN 卡在一次只能走一个词元。</p>"
        },
        {
          "name": "The Transformer architecture: encoder, decoder, and the tricks",
          "nameZh": "Transformer 架构:编码器、解码器,和那几个技巧",
          "body": "<p>The 2017 architecture splits in two: the <strong>encoder</strong> on the left reads the source language, the <strong>decoder</strong> on the right writes the target. The encoder runs <strong>self-attention</strong> so each input token comes out written in terms of all the others, then a <strong>feed-forward network</strong> (FFN) gives it room to learn more. Stack \\(N\\) of these layers and you walk out with context-aware embeddings for the whole input.</p><p>The decoder uses attention three different ways. Its <strong>masked self-attention</strong> is causal — predicting a token, it looks only at what it has translated so far, never to the right, because nothing to the right exists yet. Then <strong>cross-attention</strong> ties the two halves together. The instructor runs a quiz on it: the arrow coming from the decoder — is it query, key, or value? It's the <strong>query</strong> ('which input words matter to me right now?'), while the <strong>keys and values come from the encoder</strong>. A final linear layer and a softmax turn the output into a probability over the whole vocabulary.</p><p>Two tricks finish it. <strong>Multi-head attention</strong>: run the QKV computation \\(h\\) times in parallel, each with its own learned projections, the way a convolution runs several filters. Nobody forces the heads to differ, but gradient descent has no reason to copy a head, so in practice each learns its own view; then \\(W_O\\) projects the stacked-up result back to \\(d_{model}\\). <strong>Positional encoding</strong> (sinusoids, added element-wise) puts order back, because direct wires are blind to which token came first. And <strong>label smoothing</strong>: instead of demanding the one true word with probability 1, the target becomes \\(1-\\epsilon\\) on the truth and \\(\\epsilon/(V-1)\\) spread over the rest. Think 'what a great day / lecture / book' — more than one word fits the blank, so don't train the model to be 100% sure. It nudges BLEU up too.</p>",
          "bodyZh": "<p>2017 年的架构裂成两半:左边<strong>编码器(encoder)</strong>读源语言,右边<strong>解码器(decoder)</strong>写目标语言。编码器跑<strong>自注意力</strong>,让每个输入词元都用其余词元写出来,再接一个<strong>前馈网络(FFN)</strong>给它余地多学点东西。把这样的层叠 \\(N\\) 层,你就带着整段输入的、含上下文的嵌入走出来。</p><p>解码器用了三种不同的注意力。它的<strong>带掩码自注意力</strong>是因果(causal)的 —— 预测某个词元时,只看已经译出来的部分,绝不往右看,因为右边还啥都没有。接着<strong>交叉注意力(cross-attention)</strong>把两半拴到一起。讲者当场出了道小测:从解码器伸过来的那个箭头 —— 是查询、键,还是值?是<strong>查询</strong>('此刻哪些输入词对我要紧?'),而<strong>键和值来自编码器</strong>。最后一个线性层加一个 softmax,把输出变成整个词表上的概率。</p><p>两个技巧收尾。<strong>多头注意力</strong>:把 QKV 计算并行跑 \\(h\\) 次,每次各有自己那套可学习投影,就像卷积里跑好几个滤波器。没人逼各个头长得不一样,可梯度下降没理由去抄某个头,于是实践中每个头都学出自己的看法;再由 \\(W_O\\) 把摞起来的结果投影回 \\(d_{model}\\)。<strong>位置编码</strong>(正弦函数,逐元素相加)把顺序放回去,因为直通的线压根分不清哪个词元在前。还有<strong>标签平滑(label smoothing)</strong>:不再非要那个唯一真词的概率等于 1,而是把目标设成真值处 \\(1-\\epsilon\\)、其余处摊 \\(\\epsilon/(V-1)\\)。想想 'what a great day / lecture / book' —— 填空不止一个词说得通,那就别把模型训得 100% 笃定。它顺带还把 BLEU 抬高了一点。</p>"
        },
        {
          "name": "End-to-end: translating 'A cute teddy bear is reading.'",
          "nameZh": "端到端:翻译 'A cute teddy bear is reading.'",
          "body": "<p>Now Shervine runs the whole machine on the one sentence. <strong>Tokenize</strong> it, then wrap it in <code>[BOS]</code> and <code>[EOS]</code> to mark where the sequence starts and stops. Each token's vector is its learned <strong>embedding</strong> plus a <strong>position embedding</strong> (the paper's sines and cosines), added element-wise into one <em>position-aware</em> embedding. Stack those and you have a matrix of size \\(d_{model} \\times N\\).</p><p>Inside the encoder, push that matrix through \\(W_Q, W_K, W_V\\) to get Q, K and V. Each <em>row</em> of Q is one query; each <em>column</em> of \\(K^{\\top}\\) is one key. Multiply them and softmax each row, and the row becomes a probability distribution of that query over all the keys; multiply by V and you get a <strong>weighted average of values</strong>. Why divide by \\(\\sqrt{d_k}\\)? Because the dot product grows as the dimension grows (the matmul forces \\(d_q = d_k\\)), so you rescale it back down. Multi-head gives you \\(h\\) of these matrices, glued together column-wise, then \\(W_O\\) maps the result back to \\(d_{model}\\). An FFN follows — and here its hidden layer is <em>wider</em> than its input, the opposite of word2vec, because you want extra room to build richer features. Run all of that for \\(N\\) encoders.</p><p>Decoding opens at <code>[BOS]</code>: causal self-attention, then cross-attention whose keys and values are the encoder's output and whose queries come from the decoder, then an FFN — \\(N\\) times over — then linear plus softmax across the vocabulary, a vector like [0.001, ..., 0.4, ...]. Take the argmax as the next token and feed it back in, autoregressively: <em>'Un'</em> &rarr; <em>'ours en peluche'</em> &rarr; <em>'mignon'</em> &rarr; <em>'lit'</em>. Stop the moment it generates <code>[EOS]</code>. That is exactly how the original paper did machine translation.</p>",
          "bodyZh": "<p>现在 Shervine 把整台机器架在这一句话上跑。先<strong>分词</strong>,再用 <code>[BOS]</code> 和 <code>[EOS]</code> 把它包起来,标出序列从哪开始、到哪结束。每个词元的向量是它学到的<strong>嵌入</strong>加上一个<strong>位置嵌入</strong>(论文里的正弦余弦),逐元素相加,合成一个<em>含位置信息</em>的嵌入。把这些摞起来,就是一个 \\(d_{model} \\times N\\) 的矩阵。</p><p>进编码器,把这矩阵推过 \\(W_Q, W_K, W_V\\) 得到 Q、K、V。Q 的每一<em>行</em>是一个查询;\\(K^{\\top}\\) 的每一<em>列</em>是一个键。二者相乘,再对每行做 softmax,这一行就成了那个查询在所有键上的概率分布;乘以 V,就得到<strong>值的加权平均</strong>。为什么除以 \\(\\sqrt{d_k}\\)?因为点积会随维度增大而变大(矩阵乘法逼着 \\(d_q = d_k\\)),所以要把它缩回去。多头给你 \\(h\\) 个这样的矩阵,按列拼到一起,再由 \\(W_O\\) 把结果映射回 \\(d_{model}\\)。接着一个 FFN —— 这里它的隐藏层比输入<em>更宽</em>,跟 word2vec 反过来,因为你想多腾出地方搭更丰富的特征。这一整套跑 \\(N\\) 个编码器。</p><p>解码从 <code>[BOS]</code> 开场:因果自注意力,然后交叉注意力(键和值来自编码器输出,查询来自解码器),再一个 FFN —— 来回 \\(N\\) 遍 —— 最后线性层加词表上的 softmax,一个形如 [0.001, ..., 0.4, ...] 的向量。取概率最大那项作为下一个词元,自回归地喂回去:<em>'Un'</em> &rarr; <em>'ours en peluche'</em> &rarr; <em>'mignon'</em> &rarr; <em>'lit'</em>。一生成 <code>[EOS]</code> 就停。原论文做机器翻译,走的正是这一套。</p>"
        }
      ],
      "takeaways": [
        "NLP tasks fall into three buckets — classification, multi-classification, generation. Classification scores with accuracy/precision/recall/F1; generation with BLEU/ROUGE/perplexity. Accuracy alone lies under class imbalance, which is why precision and recall exist.",
        "Tokenization trades vocabulary size against OOV risk against sequence length. Subword (BPE, WordPiece) is the sweet spot, and a model's cost climbs with sequence length.",
        "One-hot vectors all sit at right angles to each other, so cosine similarity is useless on them. Word2vec learns dense vectors through a proxy task so similarity finally means something — but each word still gets one vector, blind to context.",
        "RNNs and LSTMs add word order, but long products of factors make gradients vanish on long-range dependencies, and they run one token at a time — so they're slow.",
        "Self-attention is a content-based weighted average of values, weighted by query-key similarity and scaled by 1/√dₖ. Written as matrices, it runs on a GPU in parallel.",
        "The Transformer is stacked encoders (self-attention + FFN) and decoders (masked self-attention + cross-attention + FFN), with positional encoding for order, multi-head attention for several views at once, and label smoothing as a training trick."
      ],
      "takeawaysZh": [
        "NLP 任务分三类 —— 分类、多分类、生成。分类用 accuracy/precision/recall/F1 打分,生成用 BLEU/ROUGE/困惑度。类别失衡时只看准确率会骗人,精确率和召回率就是为这个而生。",
        "分词在词表大小、OOV 风险、序列长度之间权衡。子词(BPE、WordPiece)卡在折中点上,而模型的开销随序列长度往上爬。",
        "独热向量两两成直角,所以余弦相似度在它们身上没用。Word2vec 通过代理任务学出稠密向量,相似度这才终于有了意义 —— 但每个词仍只有一个向量,看不见上下文。",
        "RNN 和 LSTM 把词序加了进来,可一长串因子连乘让梯度在长程依赖上消失,而且它们一次只走一个词元 —— 所以慢。",
        "自注意力是对值做基于内容的加权平均,权重来自查询-键相似度,再用 1/√dₖ 缩放。写成矩阵,就能在 GPU 上并行跑。",
        "Transformer 是叠起来的编码器(自注意力 + FFN)和解码器(带掩码自注意力 + 交叉注意力 + FFN),用位置编码管顺序,用多头注意力一次拿到多个看法,用标签平滑当训练技巧。"
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
      "tagline": "The 2017 Transformer never left. A handful of parts quietly changed — positions, normalization, cheaper attention — and three model shapes grew out of it.",
      "taglineZh": "2017 年的 Transformer 一直没走。只有几个零件悄悄换了 —— 位置、归一化、更省的注意力 —— 又从它长出三种模型形态。",
      "overview": "<p>Here is the fact <strong>Afshine</strong> opens with: the Transformer from 2017 is still the skeleton of 2025 models. Only a few parts changed, and they changed quietly. This lecture walks through those parts in the order you meet them inside one block. Afshine takes the engineering: how to inject position (learned and sinusoidal absolute positions, then relative biases like T5 and ALiBi, then <strong>RoPE</strong>), how to normalize (Post-Norm vs Pre-Norm, LayerNorm vs RMSNorm), and how to make attention cheaper (sliding-window and sparse attention, plus sharing key and value heads with MQA and GQA so the KV cache stays small). Then <strong>Shervine</strong> sorts every Transformer model into three shapes — encoder-decoder like T5, encoder-only like BERT, decoder-only like GPT — and pulls <strong>BERT</strong> apart in detail with the running <em>this teddy bear is so cute</em> example, ending on distillation, DistilBERT and RoBERTa.</p>",
      "overviewZh": "<p><strong>Afshine</strong> 开场就抛出一个事实:2017 年的 Transformer 至今还是 2025 年各种模型的骨架。只有几个零件变了,而且变得很安静。本讲就按这些零件在一个模块里出现的顺序,一个一个讲。Afshine 讲工程那一半:位置怎么注入(学习式和正弦式的绝对位置,再到 T5、ALiBi 这类相对偏置,再到 <strong>RoPE</strong>)、怎么归一化(后置归一化对前置归一化、LayerNorm 对 RMSNorm)、注意力怎么变便宜(滑动窗口和稀疏注意力,再加上用 MQA、GQA 共享键和值头,把 KV 缓存压小)。接着 <strong>Shervine</strong> 把所有 Transformer 模型分成三种形态 —— 编码-解码如 T5、仅编码器如 BERT、仅解码器如 GPT —— 再拿贯穿全课的「这只泰迪熊太可爱了(this teddy bear is so cute)」例子,把 <strong>BERT</strong> 一层层拆开,最后落到蒸馏、DistilBERT 和 RoBERTa。</p>",
      "topics": [
        {
          "name": "Why position must be injected",
          "nameZh": "为什么必须把位置塞进去",
          "body": "<p>An RNN reads tokens one at a time, so order is built into the order of the computation. Self-attention throws that away. Every token links to every other token at once, all in parallel — that buys speed, and it costs you any sense of who came first. So the order has to be added back by hand. Afshine's first fix is the one from the original paper: give each position its own embedding and <strong>add</strong> it to the token embedding. Take <em>a cute teddy bear is reading</em>. The vector at position 1 is the embedding of <code>a</code> plus the embedding of position 1.</p><p>Those position embeddings can be <strong>learned</strong> or <strong>fixed</strong> — the authors tried both. To learn them, you set aside a placeholder embedding for every slot, say positions 1 through 512, and let gradient descent tune them like any other weight. Two problems. First, learned positions <em>overfit</em>: if your training data keeps putting a certain kind of word at position 2, that bias gets baked in. Second, you can only learn positions up to the longest sequence you trained on — 512, say. Feed the model something longer at inference time and it has never seen that position, so it cannot extrapolate. The upside is real: gradient descent learns from data, so in-distribution these work well. That trade-off is exactly what pushes you to the fixed sinusoidal scheme next.</p>",
          "bodyZh": "<p>RNN 一次读一个词元,顺序就内建在计算的先后里。自注意力把这点扔了。每个词元同时连向其他所有词元,全部并行 —— 换来了速度,代价是丢掉了谁先谁后的感觉。于是顺序得手动补回来。Afshine 的第一个补救,就是原始论文那一招:给每个位置一个专属嵌入,再<strong>加</strong>到词元嵌入上。拿「a cute teddy bear is reading」来说,位置 1 的向量就是 <code>a</code> 的嵌入加上位置 1 的嵌入。</p><p>这些位置嵌入可以<strong>学习</strong>,也可以<strong>固定</strong> —— 作者两条路都试了。要学,就给每个槽位(比如位置 1 到 512)留一个占位嵌入,像别的权重一样交给梯度下降去调。两个毛病。第一,学出来的位置会<em>过拟合</em>:训练数据老把某类词放在位置 2,这个偏见就被记进去了。第二,你只能学到训练时见过的最长序列那么长 —— 比如 512。推理时来一句更长的,模型从没见过那个位置,就外推不了。好处也实在:梯度下降会从数据里学,所以在同分布下表现不错。正是这个权衡,把人推向下面的固定正弦方案。</p>"
        },
        {
          "name": "Sinusoidal encodings & the relative-distance intuition",
          "nameZh": "正弦编码与相对距离的直觉",
          "body": "<p>The second scheme still gives each position one vector, but instead of learning it, you <em>hardcode</em> it with sines and cosines. For position \\(m\\) and a vector of size \\(d_{\\text{model}}\\), Afshine writes the even and odd dimensions as</p>\\[ PE_{m,2i} = \\sin(\\omega_i\\, m), \\quad PE_{m,2i+1} = \\cos(\\omega_i\\, m), \\quad \\omega_i = 10000^{-2i/d_{\\text{model}}}. \\]<p>Why sines and cosines? Because what we want is simple: tokens close together should look more alike than tokens far apart, and <em>looking alike means a big dot product</em> — cosine similarity is just a normalized dot product. Now use \\(\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b\\). The dot product of two position vectors collapses to \\(\\sum_i \\cos\\!\\big(\\omega_i(m-n)\\big)\\) — a function of the <strong>gap</strong> \\(m-n\\) and nothing else. At \\(m=n\\) every term is \\(\\cos 0 = 1\\), so the sum is at its largest: a position is most similar to itself. Pull the two positions apart and it falls off. Afshine points out \\(\\omega_i\\) runs fast for low dimensions and slow for high ones, which is the striped pattern you get when you plot the embeddings. The win over learned positions: this <em>extends to any length</em>, at comparable quality. That is why the authors leaned this way.</p>",
          "bodyZh": "<p>第二种方案还是每个位置一个向量,但不去学它,而是用正弦和余弦把它<em>硬编码</em>。对位置 \\(m\\)、维度为 \\(d_{\\text{model}}\\) 的向量,Afshine 把偶、奇维度写成</p>\\[ PE_{m,2i} = \\sin(\\omega_i\\, m), \\quad PE_{m,2i+1} = \\cos(\\omega_i\\, m), \\quad \\omega_i = 10000^{-2i/d_{\\text{model}}}. \\]<p>为什么是正余弦?因为我们要的东西很简单:挨得近的词元要比离得远的更像,而<em>像就意味着点积大</em> —— 余弦相似度不过是归一化的点积。现在用上 \\(\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b\\)。两个位置向量的点积就塌缩成 \\(\\sum_i \\cos\\!\\big(\\omega_i(m-n)\\big)\\) —— 只看<strong>间距</strong> \\(m-n\\),别的都不看。当 \\(m=n\\) 时每一项都是 \\(\\cos 0 = 1\\),求和取到最大:一个位置跟自己最像。把两个位置拉开,它就往下掉。Afshine 指出 \\(\\omega_i\\) 在低维变得快、在高维变得慢,这就是把嵌入画出来时看到的那道道条纹。比学习式位置强在哪?它能<em>外推到任意长度</em>,质量还相当。这就是作者偏向它的原因。</p>"
        },
        {
          "name": "From absolute to relative: T5 bias, ALiBi, and RoPE",
          "nameZh": "从绝对到相对:T5 偏置、ALiBi 与 RoPE",
          "body": "<p>By 2025 we keep the <em>idea</em> — far tokens less alike — but we stop adding a position vector at the input. Afshine's reasoning: similarity gets decided inside the <strong>attention layer</strong>, so that is where the relative signal should act. Adding it at the input only reaches attention indirectly. So people put a term straight <em>inside the softmax</em> of \\(\\mathrm{softmax}\\!\\big(QK^{\\top}/\\sqrt{d_k}\\big)V\\). You can put whatever you want in there — the softmax normalizes it anyway. <strong>T5</strong> buckets the gap \\(m-n\\) and learns a per-head bias for each bucket. <strong>ALiBi</strong> (Attention with Linear Biases, from <em>Train Short, Test Long</em>) skips learning entirely and just subtracts a straight-line penalty in \\(m-n\\): simpler, but it boxes you in.</p><p>Most modern models reach for <strong>RoPE</strong> (Rotary Position Embeddings) instead. The move: <em>rotate</em> the query by an angle tied to its position \\(m\\), and rotate the key by an angle tied to its position \\(n\\). How do you rotate a vector? Multiply it by the 2-D rotation matrix</p>\\[ R(\\theta)=\\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}. \\]<p>Write a vector by its length and angle, \\(v=r(\\cos\\varphi,\\sin\\varphi)\\). Multiply it out and the trig identities fall into place: \\(R(\\theta)\\,v=r(\\cos(\\theta+\\varphi),\\sin(\\theta+\\varphi))\\) — the vector turned by \\(\\theta\\), length untouched. That is the piece Afshine put on the blackboard before showing why rotating Q and K is exactly the thing you want.</p>",
          "bodyZh": "<p>到了 2025 年,我们留下「越远越不像」这个<em>思想</em>,却不再在输入端加一个位置向量。Afshine 的理由是:相似度是在<strong>注意力层</strong>里裁定的,相对信号就该作用在那。加在输入端,只能间接传到注意力。于是人们干脆在 \\(\\mathrm{softmax}\\!\\big(QK^{\\top}/\\sqrt{d_k}\\big)V\\) 的 <em>softmax 里头</em>加一项。里头爱放什么放什么 —— 反正 softmax 会替你归一化。<strong>T5</strong> 把间距 \\(m-n\\) 分桶,逐头给每个桶学一个偏置。<strong>ALiBi</strong>(线性偏置注意力,出自《Train Short, Test Long》)干脆不学,直接按 \\(m-n\\) 减一个线性惩罚:更简单,但也把你框死了。</p><p>大多数现代模型转而用 <strong>RoPE</strong>(旋转位置编码)。它的招数是:把查询按与位置 \\(m\\) 绑定的角度<em>旋转</em>,把键按与位置 \\(n\\) 绑定的角度旋转。怎么旋转一个向量?拿它乘二维旋转矩阵</p>\\[ R(\\theta)=\\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}. \\]<p>把向量按长度和夹角写成 \\(v=r(\\cos\\varphi,\\sin\\varphi)\\)。乘开来,三角恒等式自然就对上了:\\(R(\\theta)\\,v=r(\\cos(\\theta+\\varphi),\\sin(\\theta+\\varphi))\\) —— 向量转了 \\(\\theta\\),长度没动。这就是 Afshine 在解释「为什么旋转 Q 和 K 恰好是我们想要的」之前,先写在黑板上的那块底子。</p>"
        },
        {
          "name": "RoPE: why rotation captures relative distance",
          "nameZh": "RoPE:旋转为何抓住相对距离",
          "body": "<p>Here is the payoff. Rotate the query at position \\(m\\) by \\(R(m\\theta)\\) and the key at position \\(n\\) by \\(R(n\\theta)\\). In the attention score \\(q^{\\top}k\\), the two rotations fold into one rotation by the <strong>gap</strong>:</p>\\[ \\big(R(m\\theta)\\,q\\big)^{\\top}\\big(R(n\\theta)\\,k\\big) = q^{\\top} R\\big((n-m)\\theta\\big)\\, k. \\]<p>So you feed in absolute positions, but the score comes out depending only on \\(n-m\\) — the relative-distance property we were after, now living right inside attention instead of bolted onto the input. For \\(d>2\\) you chop the vector into 2-D blocks and spin each block by its own angle. And \\(\\theta\\) is <strong>fixed</strong>, not learned: it is a function of the dimension index \\(i\\) (running \\(1\\) to \\(d/2\\)) and of \\(d\\) — the same \\(\\omega_i\\) from the sinusoidal scheme. So RoPE adds zero parameters. The RoFormer paper also proves, in an appendix, a <strong>long-term decay</strong>: as \\(|m-n|\\) grows the upper bound on the attention weight shrinks — not cleanly, it wobbles a bit, but far tokens do get attended to less. Cheap, parameter-free, and it pushes attention toward nearby tokens. That is why it is the default today.</p>",
          "bodyZh": "<p>回报来了。把位置 \\(m\\) 的查询用 \\(R(m\\theta)\\) 旋转、位置 \\(n\\) 的键用 \\(R(n\\theta)\\) 旋转。在注意力分数 \\(q^{\\top}k\\) 里,两个旋转会叠成一个按<strong>间距</strong>的旋转:</p>\\[ \\big(R(m\\theta)\\,q\\big)^{\\top}\\big(R(n\\theta)\\,k\\big) = q^{\\top} R\\big((n-m)\\theta\\big)\\, k. \\]<p>你喂进去的是绝对位置,出来的分数却只看 \\(n-m\\) —— 正是我们追的相对距离特性,而且就长在注意力里头,不再是硬贴在输入上。对 \\(d>2\\),把向量切成一个个二维块,每块按自己的角度转。而且 \\(\\theta\\) 是<strong>固定</strong>的,不是学来的:它是维度下标 \\(i\\)(从 \\(1\\) 到 \\(d/2\\))和 \\(d\\) 的函数 —— 就是正弦方案里那个 \\(\\omega_i\\)。所以 RoPE 一个参数都不加。RoFormer 论文还在附录里证了<strong>长程衰减</strong>:\\(|m-n|\\) 一大,注意力权重的上界就往下走 —— 不是干干净净地降,会抖一抖,但远处的词元确实被关注得更少。便宜、不加参数,又把注意力往近处的词元推。这就是它今天成为默认选择的原因。</p>"
        },
        {
          "name": "Layer normalization: Post-Norm, Pre-Norm, RMSNorm",
          "nameZh": "层归一化:后置、前置与 RMSNorm",
          "body": "<p>The <code>Add &amp; Norm</code> boxes do two things: take the sub-layer's input and add its output (the residual connection), then normalize. The mechanism: take a vector, subtract its mean, divide by its standard deviation, then apply two learned numbers — a rescale \\(\\gamma\\) and a shift \\(\\beta\\):</p>\\[ \\mathrm{LN}(x)=\\gamma\\,\\frac{x-\\mu}{\\sigma}+\\beta. \\]<p>Why bother? Across the stack, some activations blow up in a few components and stay tiny in others, and weights are hard to learn when the numbers feeding them swing that wildly. Normalizing drags every component back into a sane range, so training is steadier and converges faster — the keyword for this is <em>internal covariate shift</em>. Note the contrast with <strong>batch normalization</strong>, which normalizes each component across the <em>batch</em>. LayerNorm works one vector at a time, which is what you want here: it does not tie training to whatever else happens to be in the batch.</p><p>Two things moved since 2017. First, the location. The original was <strong>Post-Norm</strong> — normalize after the residual add. Modern models use <strong>Pre-Norm</strong> — normalize right before the vector enters the sub-layer, whether that is attention or the FFN. Second, modern models swap in <strong>RMSNorm</strong>: divide \\(x\\) by its root-mean-square and learn <em>only</em> \\(\\gamma\\), dropping the mean subtraction and \\(\\beta\\). Convergence holds up, there are fewer parameters, so it runs faster.</p>",
          "bodyZh": "<p><code>Add &amp; Norm</code> 框做两件事:把子层的输入和它的输出相加(残差连接),再归一化。机制是这样:取一个向量,减去它的均值,除以它的标准差,再施加两个学来的数 —— 缩放 \\(\\gamma\\) 和平移 \\(\\beta\\):</p>\\[ \\mathrm{LN}(x)=\\gamma\\,\\frac{x-\\mu}{\\sigma}+\\beta. \\]<p>为什么要这么做?在整叠网络里,有些激活值在少数几个分量上炸开、在别处又极小,而当喂进来的数这么大起大落时,权重就很难学。归一化把每个分量拽回合理区间,训练就更稳、收敛更快 —— 这个现象的关键词叫<em>内部协变量偏移(internal covariate shift)</em>。顺便对比一下<strong>批归一化(batch norm)</strong>,它是沿<em>批</em>方向归一化每个分量。LayerNorm 一次只管一个向量,这正是这里想要的:它不会把训练绑死在同一批里碰巧还有什么别的样本上。</p><p>2017 年以来动了两处。第一处是位置。原版是<strong>后置归一化(Post-Norm)</strong> —— 残差相加之后才归一化。现代模型用<strong>前置归一化(Pre-Norm)</strong> —— 向量进子层之前就归一化,不管子层是注意力还是 FFN。第二处,现代模型换上了 <strong>RMSNorm</strong>:把 \\(x\\) 除以它的均方根,而且<em>只</em>学 \\(\\gamma\\),把减均值和 \\(\\beta\\) 都丢了。收敛照样稳,参数更少,跑得更快。</p>"
        },
        {
          "name": "Efficient attention: sliding windows & sparse attention",
          "nameZh": "高效注意力:滑动窗口与稀疏注意力",
          "body": "<p>Let every token talk to every other token and you get an \\(n\\times n\\) interaction matrix — \\(O(n^2)\\), and it hurts more the longer \\(n\\) gets. <strong>Longformer</strong> (2020) shrinks the window so each token attends only to its neighbors; today that is called <strong>sliding-window attention (SWA)</strong>. A fair question came up in class: if softmax normally runs over the whole row, how does restricting the window save anything? The answer is in the implementation — <em>tiling</em> and related tricks that never build the full \\(\\mathrm{softmax}(QK^{\\top}/\\sqrt{d_k})\\) matrix in the first place.</p><p>Modern models <strong>interleave</strong>: some layers do local attention, some do full global attention. There is no fixed recipe — people try combinations. And the window, tiny in the slide drawing, is realistically several <em>thousand</em> tokens. Afshine ties this back to the <strong>receptive field</strong> in CNNs. Take <strong>Mistral 7B</strong>, which stacks SWA at every layer. A token attends to its window. But each token in that window attends to <em>its</em> window. Stack the layers and information walks far past any single window — the same question a vision person asks of a convolution: which inputs did this output actually end up seeing?</p>",
          "bodyZh": "<p>让每个词元都跟其他所有词元说话,你就得到一个 \\(n\\times n\\) 的交互矩阵 —— \\(O(n^2)\\),\\(n\\) 越长越疼。<strong>Longformer</strong>(2020)把窗口收小,让每个词元只关注它的邻居;如今这叫<strong>滑动窗口注意力(SWA)</strong>。课堂上有个问得在理:softmax 通常要在一整行上算,把窗口限住又能省下什么?答案在实现里 —— <em>分块(tiling)</em>之类的技巧,压根就不去把完整的 \\(\\mathrm{softmax}(QK^{\\top}/\\sqrt{d_k})\\) 矩阵建出来。</p><p>现代模型会<strong>交替穿插</strong>:有的层做局部注意力,有的层做完整的全局注意力。没有固定配方 —— 大家都在试不同组合。而那个在幻灯片里画得很小的窗口,实际可达数<em>千</em>词元。Afshine 把这事拉回 CNN 的<strong>感受野(receptive field)</strong>。看 <strong>Mistral 7B</strong>,它每层都堆 SWA。一个词元关注它的窗口。但那个窗口里的每个词元,又各自关注<em>它们</em>的窗口。层一叠,信息就走得远超任何单个窗口 —— 跟做视觉的人盯着一个卷积输出追问的问题一模一样:这个输出最后到底「看到」了哪些输入?</p>"
        },
        {
          "name": "Sharing K/V heads: MHA → MQA → GQA and the KV cache",
          "nameZh": "共享键值头:MHA → MQA → GQA 与 KV 缓存",
          "body": "<p>A second trick, orthogonal to the first: stop giving every head its own projection matrices. Keep a separate query projection per head, but <strong>share</strong> the key and value projections across heads. Why share K and V but not Q? Intuitively the query is the one asking <em>is this similar to that</em>, so it pays to keep query diversity. But the real reason is decoding cost. When you generate a token, you attend it to <em>every previous</em> token, so the same keys and values come back round after round. Next lecture's <strong>KV cache</strong> stores those past keys and values so you do not recompute them — and you want that cache to stay small. Share the K/V projections across heads and the cache shrinks.</p><p>Afshine lays out the spectrum. All \\(H\\) heads share one K/V: <strong>Multi-Query Attention (MQA)</strong>. \\(G\\) groups, each of size \\(H/G\\) sharing one K/V: <strong>Grouped-Query Attention (GQA)</strong>. One K/V per head, the version you already know: standard <strong>Multi-Head Attention (MHA)</strong>. The pick trades quality against latency and cost, and it depends on how big the model is and how long the inputs run. No clean rule, but a lot of recent models settle on GQA — not all of them. This works in any attention layer, but it matters most for the masked self-attention in decoder-only LLMs, which is where the KV cache does its heavy lifting.</p>",
          "bodyZh": "<p>第二个技巧,跟前一个正交:别再给每个头配一套投影矩阵。每个头仍保留独立的查询投影,但跨头<strong>共享</strong>键和值的投影。为什么共享 K 和 V,却不共享 Q?直觉上,查询是那个在问<em>这个跟那个像不像</em>的角色,保留查询的多样性划得来。但真正的原因是解码成本。生成一个词元时,你要让它关注<em>之前每一个</em>词元,所以同一批键和值会一轮一轮地回来。下一讲的 <strong>KV 缓存</strong>会把这些过去的键和值存下来,省得重算 —— 而你希望这块缓存保持小。跨头共享 K/V 投影,缓存就缩小了。</p><p>Afshine 把这条谱系摆开。所有 \\(H\\) 个头共享一份 K/V:<strong>多查询注意力(MQA)</strong>。分成 \\(G\\) 组、每组 \\(H/G\\) 个头共享一份 K/V:<strong>分组查询注意力(GQA)</strong>。每头各一份 K/V,也就是你已经熟的那种:标准<strong>多头注意力(MHA)</strong>。这一选是在质量和延迟、成本之间权衡,还要看模型多大、输入多长。没有干净的规则,但很多近期模型落在 GQA 上 —— 不是全部。这招在任何注意力层都能用,但对仅解码器 LLM 里的掩码自注意力最要紧,那正是 KV 缓存出大力的地方。</p>"
        },
        {
          "name": "Three model shapes & the T5 family",
          "nameZh": "三种模型形态与 T5 家族",
          "body": "<p>Shervine sorts every Transformer-based model into three shapes. <strong>Encoder-decoder</strong> (text-to-text) is the home of the <strong>T5</strong> family: T5 (Transfer Text-to-Text Transformer), mT5 (the <em>multilingual</em> one), and ByT5 (no tokenizer at all — it works at the <em>byte</em> level, so the vocabulary is just \\(2^8=256\\) instead of ~30k). T5 also drops next-token prediction for a <strong>span-corruption</strong> objective: the encoder sees text with blanks marked by <em>sentinel tokens</em> — <em>my teddy bear [X] is reading</em> — and the decoder rebuilds each masked span in turn, trained with teacher forcing.</p><p><strong>Encoder-only</strong> (BERT, DistilBERT, RoBERTa) cuts the decoder, so it cannot generate — but its embeddings are exactly what you want for classification and token-level tasks. <strong>Decoder-only</strong> (the GPT series) cuts the encoder and the cross-attention block entirely, leaving stacked blocks of masked self-attention plus FFN. Encoder-decoder was the popular shape around 2018-2022; decoder-only runs the show now. The reason is plain: next-word prediction scales on raw text without any setup, and it lines up naturally with being a helpful chatbot, while span corruption is fiddlier — you have to corrupt the text just so.</p>",
          "bodyZh": "<p>Shervine 把所有基于 Transformer 的模型分成三种形态。<strong>编码-解码</strong>(文本到文本)是 <strong>T5</strong> 家族的地盘:T5(迁移式文本到文本 Transformer)、mT5(<em>多语言 multilingual</em> 那个),还有 ByT5(完全不要分词器 —— 它在<em>字节 byte</em> 层级工作,所以词表只有 \\(2^8=256\\),而不是约 3 万)。T5 还把下一词预测换成了<strong>跨段损坏(span corruption)</strong>目标:编码器看到的文本里留着空,用<em>哨兵词元(sentinel token)</em>标出来 ——「my teddy bear [X] is reading」—— 解码器再一段一段把被遮的跨段补回来,用教师强制(teacher forcing)训练。</p><p><strong>仅编码器</strong>(BERT、DistilBERT、RoBERTa)砍掉解码器,所以不能生成 —— 但它的嵌入正是分类和词元级任务想要的。<strong>仅解码器</strong>(GPT 系列)把编码器和交叉注意力块整个砍掉,只留下「掩码自注意力 + FFN」的堆叠块。编码-解码在 2018 到 2022 年前后是热门形态;如今是仅解码器当家。原因很直白:下一词预测在原始文本上不用任何额外准备就能扩展,还天然对得上「乐于助人的聊天机器人」,而跨段损坏更费事 —— 你得把文本恰到好处地损坏掉。</p>"
        },
        {
          "name": "BERT deep dive: bidirectionality, MLM & NSP",
          "nameZh": "BERT 深拆:双向性、MLM 与 NSP",
          "body": "<p><strong>BERT</strong> = Bidirectional Encoder Representations from Transformers. Keep only the encoder and the self-attention is <em>truly bidirectional</em> — every token attends to every other token, both directions at once. A decoder cannot do that: its masked, causal self-attention lets a token see only itself and what came before. The 2018 paper makes a point of contrasting this with GPT, which is not bidirectional. Its contemporary <strong>ELMo</strong> — a bidirectional LSTM — had the same insight, but recurrence made it hard to scale, so it got overshadowed. Both, incidentally, are Sesame Street characters.</p><p>BERT trains in two stages. <strong>Pretraining</strong> runs two self-supervised tasks on plain unlabeled text. <strong>Masked Language Modeling (MLM):</strong> pick ~15% of the tokens; of those, 80% become <code>[MASK]</code>, 10% get swapped for a random word, and 10% are left alone — then predict the originals from context on both sides. Predicting a masked token forces the model to read what sits to its left and its right, which is bidirectionality doing its job. <strong>Next Sentence Prediction (NSP):</strong> show two sentences back to back — genuinely consecutive half the time, randomly paired the other half — and a head on the <code>[CLS]</code> token decides whether B really follows A. Then <strong>fine-tuning</strong> bolts on a small head for the actual end task, and it needs very little labeled data.</p>",
          "bodyZh": "<p><strong>BERT</strong> = 来自 Transformer 的双向编码器表示(Bidirectional Encoder Representations from Transformers)。只留编码器,自注意力就是<em>真正双向</em>的 —— 每个词元都关注其他所有词元,两个方向一齐看。解码器做不到这点:它那套带掩码的因果自注意力,只让一个词元看到自己和它前面的。2018 年的论文特意把这点跟并非双向的 GPT 作对比。同期的 <strong>ELMo</strong>(一个双向 LSTM)有一样的洞见,但循环结构让它难以扩展,于是被盖了过去。顺带一提,这俩都是芝麻街角色。</p><p>BERT 分两阶段训练。<strong>预训练</strong>在纯无标注文本上跑两个自监督任务。<strong>掩码语言建模(MLM):</strong>挑出约 15% 的词元;其中 80% 变成 <code>[MASK]</code>,10% 换成随机词,10% 原样不动 —— 然后用两侧的上下文把原词预测出来。预测一个被遮的词元,逼着模型既读它左边、又读它右边,这正是双向性在干活。<strong>下一句预测(NSP):</strong>把两个句子前后摆在一起 —— 一半时间是真的连续、另一半时间随机配对 —— 由 <code>[CLS]</code> 词元上的输出头判断 B 是不是真接在 A 后面。随后的<strong>微调</strong>给真正的终端任务接上一个小输出头,而且只需要很少的标注数据。</p>"
        },
        {
          "name": "BERT in practice: tokens, segments & the CLS head",
          "nameZh": "BERT 实战:词元、分段与 CLS 输出头",
          "body": "<p>Walk it through with <em>This teddy bear is SO CUTE!</em>. In an <em>uncased</em> model the text is lowercased first, then split by <strong>WordPiece</strong> — a tokenizer trained ahead of time, merging atomic pieces by rules that maximize likelihood, landing on a vocabulary of ~30k (the usual \\(10^4\\)-ish order, ByT5 being the byte-level exception). Prepend a <code>[CLS]</code> token as a classification placeholder, use <code>[SEP]</code> to split or end segments, and use <code>[PAD]</code> to fill each batch row out to a fixed length, since batches are matrices.</p><p>Each token's input vector is a sum of three learned pieces: the <strong>token embedding</strong> (one giant lookup table), the <strong>positional encoding</strong>, and the <em>new</em> <strong>segment embedding</strong> — just two vectors, A and B, added to every token of the first sentence versus the second to feed NSP. Run the encoder, and the <code>[CLS]</code> output has now mixed in every other token through self-attention — a context-aware embedding. For sentiment, we feed <em>only</em> that <code>[CLS]</code> embedding into a small FFN (two matrices through a hidden layer to a positive/negative output) and throw the rest away. Why throw them away? Because the task is one label for the whole sentence, and <code>[CLS]</code> already carries the whole sentence. For token-level tasks the per-token embeddings <em>are</em> the point: question answering, for instance, runs two FFNs over them to predict the start and end of the answer span. Sizes run from BERT-Tiny (4M params) up through BERT-Base (L=12, H=768, A=12, 110M) to BERT-Large (340M).</p>",
          "bodyZh": "<p>拿「This teddy bear is SO CUTE!」走一遍。在<em>不区分大小写(uncased)</em>的模型里,文本先转小写,再由 <strong>WordPiece</strong> 切分 —— 这分词器是预先训练好的,按最大化似然的规则把原子片段合并,最后落在约 3 万的词表(通常是 \\(10^4\\) 量级,字节级的 ByT5 是例外)。前面加一个 <code>[CLS]</code> 词元当分类占位,用 <code>[SEP]</code> 分隔或结尾各分段,再用 <code>[PAD]</code> 把每个批次行补到固定长度 —— 因为批次就是矩阵。</p><p>每个词元的输入向量是三个学来分量之和:<strong>词元嵌入</strong>(一张巨大的查找表)、<strong>位置编码</strong>,以及<em>新增</em>的<strong>分段嵌入</strong> —— 只有 A、B 两个向量,分别加到第一句和第二句的每个词元上,喂给 NSP。跑一遍编码器,<code>[CLS]</code> 的输出此刻已经通过自注意力把其他每个词元都混了进来 —— 成了一个上下文感知的嵌入。做情感分析时,我们<em>只</em>把这个 <code>[CLS]</code> 嵌入送进一个小 FFN(两个矩阵,过一个隐藏层到「正面 / 负面」的输出),其余全扔。为什么全扔?因为任务是给整句一个标签,而 <code>[CLS]</code> 已经把整句都带上了。词元级任务里,逐词元的嵌入才是重点:比如问答,就在它们上面跑两个 FFN,预测答案跨段的起点和终点。模型规模从 BERT-Tiny(4M 参数),经 BERT-Base(L=12、H=768、A=12、110M),到 BERT-Large(340M)。</p>"
        },
        {
          "name": "Shrinking & improving BERT: distillation, DistilBERT, RoBERTa",
          "nameZh": "缩小与改进 BERT:蒸馏、DistilBERT、RoBERTa",
          "body": "<p>BERT has three sore spots: a 512-token context window, high cost and latency (BERT-Base is 110M params), and a three-part MLM + NSP + fine-tune pipeline. Two variants go after them. <strong>Distillation</strong> starts from a line by Hinton and colleagues — <em>the soft targets contain almost all the knowledge</em>. Match a small <strong>student</strong> to the teacher's full output distribution and it learns more than it would from hard labels alone. The objective minimizes the <strong>KL divergence</strong> from teacher \\(T\\) to student \\(S\\): in a world described by \\(T\\), how badly does \\(S\\) model it? When the target is a one-hot hard label, that KL collapses to ordinary cross-entropy, \\(-\\log y_S\\). <strong>DistilBERT</strong> runs this with half the layers — 6 instead of 12 — and keeps ~97% of the performance while running ~1.6x faster. Four pages, big impact.</p><p><strong>RoBERTa</strong> is a careful ablation, and its verdict is that BERT was undertrained. Three findings. <em>Drop NSP</em> (and the segment embeddings) and performance barely moves. Switch <em>static masking</em> to <strong>dynamic</strong> — re-mask the same text differently every epoch. And feed it far more data, trained far longer: 16 GB to 160 GB, 500k steps at batch 8k versus 1M steps at batch 256. Same architecture, roughly +4% across benchmarks.</p>",
          "bodyZh": "<p>BERT 有三处痛点:512 词元的上下文窗口、高成本高延迟(BERT-Base 有 110M 参数),还有 MLM + NSP + 微调这套三段流程。两个变体冲着它们去。<strong>蒸馏</strong>从 Hinton 等人的一句话起步 —— <em>软目标几乎装着全部知识</em>。让一个小<strong>学生模型</strong>去拟合教师的完整输出分布,它学到的比单靠硬标签更多。目标是最小化从教师 \\(T\\) 到学生 \\(S\\) 的 <strong>KL 散度</strong>:在 \\(T\\) 描述的世界里,\\(S\\) 拟合得有多差?当目标是 one-hot 硬标签时,这个 KL 就塌成普通的交叉熵 \\(-\\log y_S\\)。<strong>DistilBERT</strong> 据此把层数减半 —— 6 层而不是 12 层 —— 保住约 97% 的性能,同时快约 1.6 倍。四页纸,影响很大。</p><p><strong>RoBERTa</strong> 是一次仔细的消融,结论是 BERT 训练不足。三个发现。<em>去掉 NSP</em>(连同分段嵌入),性能几乎不动。把<em>静态掩码</em>换成<strong>动态掩码</strong> —— 每个 epoch 对同一文本重新做一次不一样的掩码。再喂多得多的数据、训得久得多:16 GB 到 160 GB,50 万步、批量 8k,对比 100 万步、批量 256。同样的架构,各基准平均约 +4%。</p>"
        }
      ],
      "takeaways": [
        "The 2017 Transformer is still the skeleton; only a few parts changed quietly — positions, normalization, attention sharing.",
        "Sinusoidal positions work because the dot product of two position vectors depends only on the gap m−n, peaking when m=n.",
        "RoPE rotates Q and K by position-set angles, so the score folds down to depend only on n−m; it adds no parameters and decays over distance — the default today.",
        "Modern blocks normalize before the sub-layer (Pre-Norm) with RMSNorm (learn only \\(\\gamma\\)), replacing the original Post-Norm LayerNorm.",
        "Sliding-window/sparse attention tames the \\(O(n^2)\\) cost; sharing K/V heads (MQA, GQA) shrinks the KV cache that bottlenecks decoding.",
        "Three shapes = one block, different masking; decoder-only won because next-word pretraining scales on raw text. BERT is the canonical encoder-only model.",
        "BERT pretrains with MLM (15%: 80/10/10) + NSP, then fine-tunes a small head on [CLS]; DistilBERT keeps ~97% at ~1.6x speed and RoBERTa shows NSP is unnecessary."
      ],
      "takeawaysZh": [
        "2017 年的 Transformer 至今还是骨架;只有几个零件悄悄变了 —— 位置、归一化、注意力共享。",
        "正弦位置之所以管用,是因为两个位置向量的点积只看间距 m−n,在 m=n 时取到最大。",
        "RoPE 按位置定的角度旋转 Q 和 K,分数就折叠成只依赖 n−m;它不加参数,且随距离衰减 —— 这是今天的默认选择。",
        "现代模块在进子层前归一化(前置归一化),用 RMSNorm(只学 \\(\\gamma\\)),取代原版的后置归一化 LayerNorm。",
        "滑动窗口 / 稀疏注意力压住了 \\(O(n^2)\\) 成本;共享 K/V 头(MQA、GQA)缩小了卡住解码的 KV 缓存。",
        "三种形态 = 同一个块、不同掩码;仅解码器胜出,因为下一词预训练能在原始文本上扩展。BERT 是仅编码器的典范。",
        "BERT 以 MLM(15%:80/10/10)+ NSP 预训练,再在 [CLS] 上微调一个小输出头;DistilBERT 以约 1.6 倍速度保住约 97% 性能,RoBERTa 则表明 NSP 不是必需的。"
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
      "tagline": "Scale it up, route it sparsely, sample the next word, and learn to ask.",
      "taglineZh": "把模型做大,稀疏地路由,采样下一个词,再学会怎么提问。",
      "overview": "<p>When does a Transformer earn the word <em>large</em>? The lecture starts by sorting the three families again (encoder-decoder like T5, encoder-only like BERT, decoder-only like GPT), then lands on one answer: an LLM is a <strong>decoder-only</strong> next-token predictor that you have scaled up in parameters, data and compute. From there it follows the thread. <strong>Mixture-of-experts</strong> grows the model without growing the bill. Then the part everyone touches but few have looked inside: how a reply is actually built, token by token — greedy, beam, sampling, temperature, top-k, top-p, guided decoding. Then how much the model can read at once, and why more is not always better. Then prompting — in-context learning, chain-of-thought, self-consistency. And finally the engine room: <strong>inference optimizations</strong> — KV caching, grouped-query and latent attention, PagedAttention, speculative decoding and multi-token prediction.</p>",
      "overviewZh": "<p>Transformer 到了哪一步才配叫「大」?这一讲先把三类模型再理一遍(像 T5 的编码器-解码器、像 BERT 的仅编码器、像 GPT 的仅解码器),然后落到一句话:大语言模型就是一个被你在参数、数据、算力上放大了的<strong>仅解码器</strong>下一词元预测器。顺着这条线往下走。<strong>混合专家(MoE)</strong>把模型做大,却不让账单跟着变大。接着是人人都在用、却很少有人掀开看过的那部分:一段回复究竟怎样一个词元一个词元地被造出来 —— 贪心、束搜索、采样、温度、top-k、top-p、引导解码。再往后,模型一次能读多少、为什么读得越多反而越糟。再然后是提示 —— 上下文学习、思维链、自一致性。最后掀开发动机舱:<strong>推理优化</strong> —— KV 缓存、分组查询注意力与潜在注意力、PagedAttention、推测解码与多词元预测。</p>",
      "topics": [
        {
          "name": "What is an LLM?",
          "nameZh": "什么是大语言模型",
          "body": "<p>Strip away the hype and an LLM is still a <strong>language model</strong>: a model that puts probabilities on sequences of tokens, which in practice means it predicts the next token, over and over. What makes it <strong>large</strong> is scale along three axes the instructor kept coming back to. <strong>Model size</strong>: billions of parameters, often hundreds of billions. <strong>Training data</strong>: hundreds of billions of tokens, up to tens of trillions. <strong>Compute</strong>: racks of GPUs, though by now there are tricks to squeeze a model onto a consumer card. None of this vocabulary is old. Back in 2018-19 nobody had pinned down what an LLM was. By today's line, BERT does not make the cut — it is encoder-only and never writes a word.</p><p>The shape is <strong>decoder-only</strong>. Take the Transformer decoder, throw out the encoder, and with it the cross-attention; keep masked self-attention, the feed-forward network, and add-and-norm. Run that backbone autoregressively: text in, text out. More than 90% of today's LLMs are built this way — the instructor rattled off the GPT series, LLaMA (Meta), Gemma (Google), DeepSeek, Mistral, Qwen.</p>",
          "bodyZh": "<p>把热闹剥掉,大语言模型说到底还是一个<strong>语言模型</strong>:给词元序列赋概率的模型,落到实处就是一遍又一遍地预测下一个词元。让它「大」的,是讲师反复念叨的三个维度。<strong>模型规模</strong>:数十亿参数,常常上到数千亿。<strong>训练数据</strong>:数千亿词元,直到数十万亿。<strong>算力</strong>:成排的 GPU,不过如今也有把模型塞进一张消费级显卡的招数。这套词都不老。2018-19 年那会儿,没人说得清大语言模型到底指什么。按今天这条线,BERT 进不来 —— 它仅编码器,一个字也不写。</p><p>它的形状是<strong>仅解码器</strong>。取 Transformer 的解码器,把编码器扔掉,交叉注意力也跟着扔掉;留下带掩码的自注意力、前馈网络、残差加归一化。把这副主干自回归地跑起来:文本进,文本出。今天九成以上的大语言模型都这么搭 —— 讲师一口气点了 GPT 系列、LLaMA(Meta)、Gemma(Google)、DeepSeek、Mistral、Qwen。</p>"
        },
        {
          "name": "Mixture of Experts (MoE)",
          "nameZh": "混合专家 MoE",
          "body": "<p>Does every parameter really need to fire to predict one word? Picture the instructor's room: a mathematician, a physicist, a chemist, a historian. You walk in with a math question. You ask the mathematician — you do not poll the whole room. <strong>MoE</strong> writes that instinct into the model. With \\(n\\) experts \\(E_i\\) and a gate (or router) \\(G\\), the output is</p>\\[ \\hat{y} = \\sum_{i} G(x)_i\\, E_i(x). \\]<p>A <strong>dense MoE</strong> still pays everyone — the weights sum to one, it just leans harder on the expert that fits. A <strong>sparse MoE</strong> only sums over the <strong>top-\\(k\\)</strong> it picks (usually \\(k=1\\) or \\(2\\)), which cuts the <strong>FLOPs</strong> (floating-point operations) per forward pass. Where do the experts go? At the <strong>FFN</strong> — that was the quiz answer — because the FFN holds the most parameters, costing on the order of \\(2\\, d_{\\text{model}}\\, d_{ff}\\) (with \\(d_{\\text{model}}\\sim O(100\\text{-}1000)\\) but \\(d_{ff}\\sim O(1000\\text{-}10000)\\)), dwarfing the small attention projection matrices. So each expert is itself an FFN: you train several, you switch on one or two. Routing happens <strong>per token</strong>, decided by a gate that is specific to each layer — it projects \\(x\\) to \\(n\\) dimensions and softmaxes. The gates are not tied, so layer 1 might send a token to expert 3 while layer 2 sends it to expert 1. The payoff: MoE grows <em>total</em> capacity while holding <em>active</em> parameters flat. Switch Transformer rode this to about 1.x trillion parameters and learned from fewer samples.</p>",
          "bodyZh": "<p>预测一个词,真的得让每个参数都点火吗?想象讲师那个房间:一位数学家、一位物理学家、一位化学家、一位历史学家。你揣着一道数学题进门。你去问数学家 —— 你不会挨个把屋里人都问一遍。<strong>MoE</strong> 把这个直觉写进了模型。设有 \\(n\\) 个专家 \\(E_i\\),一个门控(或路由器)\\(G\\),输出为</p>\\[ \\hat{y} = \\sum_{i} G(x)_i\\, E_i(x). \\]<p><strong>稠密 MoE</strong> 还是给每个人发工资 —— 权重之和为一,只是更倚重对得上的那个。<strong>稀疏 MoE</strong> 只对它挑中的<strong>前 \\(k\\) 个</strong>专家求和(通常 \\(k=1\\) 或 \\(2\\)),每次前向的 <strong>FLOPs</strong>(浮点运算数)就降下来了。专家放哪儿?放在 <strong>FFN</strong> 上 —— 这正是课堂提问的答案 —— 因为参数最多的就是 FFN,代价约为 \\(2\\, d_{\\text{model}}\\, d_{ff}\\)(其中 \\(d_{\\text{model}}\\sim O(100\\text{-}1000)\\),而 \\(d_{ff}\\sim O(1000\\text{-}10000)\\)),把注意力那几个小投影矩阵远远甩在后头。所以每个专家本身就是一个 FFN:训好几个,只开一两个。路由<strong>按词元</strong>来,由一个层各自独立的门控拍板 —— 它把 \\(x\\) 投到 \\(n\\) 维再 softmax。门控之间不绑权重,于是第 1 层可能把某个词元送给专家 3,第 2 层却送给专家 1。回报是:MoE 把<em>总</em>容量做大,<em>激活</em>参数却按住不动。Switch Transformer 靠这个冲到约 1.x 万亿参数,而且用更少的样本就学会了。</p>"
        },
        {
          "name": "Training MoE: routing collapse",
          "nameZh": "训练 MoE:路由坍缩",
          "body": "<p>The gate \\(G\\) and the experts \\(E_i\\) train <strong>together</strong>: one mini-batch forward pass, one loss, one backprop — no separate stage for the router. Someone always asks whether this is still differentiable; the short version is that \\(P_i\\) below is a clean function of the gate outputs, and the framework takes care of the rest. The real trouble is <strong>routing collapse</strong>: the router keeps reaching for the same one or two experts while the others sit idle. The fix is an <strong>auxiliary load-balancing loss</strong> bolted onto the objective,</p>\\[ \\mathcal{L}_{\\text{aux}} = \\alpha\\, n \\sum_{i} f_i\\, P_i, \\]<p>where \\(f_i\\) is the fraction of tokens sent to expert \\(i\\) and \\(P_i\\) is the average routing probability for expert \\(i\\). Skip the algebra; what matters is the direction. This term nudges usage toward a <strong>uniform</strong> spread across experts, so nobody gets benched. A cousin trick is <strong>noisy gating</strong>: jitter the gate outputs so other experts occasionally win by luck — same spirit as dropout. The instructor put up a Mixtral figure for layer 0, coloring each token by the expert it landed on. The colors come out roughly even. The thing you dread is the whole page one color.</p>",
          "bodyZh": "<p>门控 \\(G\\) 和专家 \\(E_i\\) 是<strong>一起</strong>训的:一个小批量前向、一个损失、一次反向传播 —— 路由器没有单独的训练阶段。总有人问这还可不可微;一句话:下面的 \\(P_i\\) 是门控输出的干净函数,剩下的交给框架。真正的麻烦是<strong>路由坍缩</strong>:路由器老往同样的一两个专家身上凑,其余的干坐着。补救是在目标上拴一项<strong>辅助负载均衡损失</strong>,</p>\\[ \\mathcal{L}_{\\text{aux}} = \\alpha\\, n \\sum_{i} f_i\\, P_i, \\]<p>其中 \\(f_i\\) 是被送到专家 \\(i\\) 的词元比例,\\(P_i\\) 是专家 \\(i\\) 的平均路由概率。公式推导跳过;要紧的是方向。这一项把各专家的使用往<strong>均匀</strong>分布上推,谁也别想坐冷板凳。还有个表亲招数叫<strong>噪声门控(noisy gating)</strong>:给门控输出抖点噪声,让别的专家偶尔靠运气中签 —— 路数跟 dropout 一样。讲师放了一张 Mixtral 的第 0 层图,把每个词元按落到哪个专家上着色。颜色出来大致是均的。你最怕看到的,是整页一个颜色。</p>"
        },
        {
          "name": "Decoding I: greedy, beam, sampling",
          "nameZh": "解码(一):贪心、束搜索、采样",
          "body": "<p>The model hands you a probability distribution over the next token. Now what — how do you pick one? First guess: <strong>greedy decoding</strong>, just take the argmax. It is deterministic, so the same input always returns the same output, and it is <em>locally</em> optimal — but not <em>globally</em>. Grab a 0.8 token now and you can end up with a whole sequence that scores lower than if you had taken a 0.2 token and then walked through confident steps. Second guess: <strong>beam search</strong>, which holds onto the top-\\(k\\) partial sequences (\\(k\\) is the beam width) and scores each path by summing log-probabilities,</p>\\[ \\log p(\\text{seq}) = \\sum_t \\log p(x_t \\mid x_{<t}). \\]<p>Multiply numbers below one and the product drifts toward zero, so beam search keeps favoring short sequences; you patch that with a <strong>length penalty</strong> (roughly, divide by the token count raised to some power). Beam search is expensive and bland, so it mostly lives in <strong>machine translation</strong>. Third guess — the one people actually ship — is <strong>sampling</strong>: draw the next token straight from the distribution. So fluffy, gentle, kind and smart come up often, while airplane stays small but never quite zero. That little tail is where the variety and the surprise come from.</p>",
          "bodyZh": "<p>模型递给你下一个词元的概率分布。然后呢 —— 你怎么挑一个出来?第一个念头:<strong>贪心解码</strong>,取最大值就完了。它是确定的,相同输入永远给相同输出,而且<em>局部</em>最优 —— 可惜不<em>全局</em>。这步抓一个 0.8 的词元,整句反倒可能比「先吃一个 0.2、随后步步高置信」那条路得分更低。第二个念头:<strong>束搜索(beam search)</strong>,留住概率最高的前 \\(k\\) 条半成品序列(\\(k\\) 就是束宽),每条路径用对数概率求和打分,</p>\\[ \\log p(\\text{seq}) = \\sum_t \\log p(x_t \\mid x_{<t}). \\]<p>小于一的数连乘,乘积一路往零飘,束搜索就老偏爱短序列;你给它打个<strong>长度惩罚</strong>补丁(大致是除以词元数的某个幂)。束搜索又贵又寡淡,所以基本只在<strong>机器翻译</strong>里出没。第三个念头 —— 真正上线用的 —— 是<strong>采样</strong>:直接从分布里抽下一个词元。于是 fluffy、gentle、kind、smart 常被抽中,而 airplane 概率小,却从不归零。多样和意外,正出在那条小尾巴上。</p>"
        },
        {
          "name": "Decoding II: temperature, top-k/top-p, guided",
          "nameZh": "解码(二):温度、top-k/top-p、引导",
          "body": "<p>Where does that distribution come from? A <strong>linear layer</strong> projects the \\(d_{\\text{model}}\\) vector up to vocabulary size \\(|V|\\), then a softmax with a <strong>temperature</strong> \\(T\\) turns scores into probabilities:</p>\\[ p_i = \\frac{\\exp(x_i / T)}{\\sum_j \\exp(x_j / T)}. \\]<p>Factor both top and bottom by \\(\\exp(x_k/T)\\) at the argmax index \\(k\\) and the two limits fall out. As \\(T \\to 0\\) every other term \\(\\exp((x_j-x_k)/T)\\to 0\\), and the distribution goes <strong>spiky</strong> — that is greedy again. As \\(T \\to \\infty\\) every term \\(\\to 1\\), and you get a flat <strong>uniform</strong> \\(1/|V|\\). Temperature is one knob. Turn it down and the model plays it safe; turn it up and it gets reckless. To stop it from sampling junk, shrink the pool: <strong>top-k</strong> samples among the \\(k\\) likeliest tokens (say \\(k=4\\)); <strong>top-p (nucleus)</strong> samples from the smallest set whose probabilities clear \\(p\\) (say 90%), so the pool tightens when the model is sure and widens when it is not. One catch: nothing in the Transformer is random <em>except</em> the sampling step — and yet \\(T=0\\) can still wander, because GPUs add up numbers in whatever order the reduction lands (see <em>Defeating Nondeterminism in LLM Inference</em>). Last, <strong>guided decoding</strong> nails the output to a format like JSON by crossing off illegal next tokens — the first token has to be an opening brace, and so on — enforced with finite-state machines or context-free grammars.</p>",
          "bodyZh": "<p>那个分布是哪来的?一个<strong>线性层</strong>把 \\(d_{\\text{model}}\\) 向量投到词表大小 \\(|V|\\),再经一个带<strong>温度</strong> \\(T\\) 的 softmax,把分数变成概率:</p>\\[ p_i = \\frac{\\exp(x_i / T)}{\\sum_j \\exp(x_j / T)}. \\]<p>在最大值下标 \\(k\\) 处,把分子分母同除以 \\(\\exp(x_k/T)\\),两个极限就掉出来了。当 \\(T \\to 0\\),其余每一项 \\(\\exp((x_j-x_k)/T)\\to 0\\),分布变<strong>尖峰</strong> —— 又回到贪心。当 \\(T \\to \\infty\\),每一项 \\(\\to 1\\),你拿到一条平平的<strong>均匀</strong>分布 \\(1/|V|\\)。温度就一个旋钮:调低,模型求稳;调高,它开始乱来。要拦住它别抽到垃圾,就把池子收小:<strong>top-k</strong> 在概率最高的 \\(k\\) 个词元里采样(比如 \\(k=4\\));<strong>top-p(核采样)</strong>在累积概率刚过 \\(p\\) 的最小集合里采样(比如 90%),模型有把握时池子收紧、没把握时池子放宽。有个坑:Transformer 里<em>唯一</em>带随机的就是采样这一步 —— 可 \\(T=0\\) 仍可能飘,因为 GPU 按归约碰上的次序加数(见 <em>Defeating Nondeterminism in LLM Inference</em>)。最后,<strong>引导解码(guided decoding)</strong>把输出钉死成某种格式,比如 JSON,办法是划掉非法的下一词元 —— 第一个词元必须是左花括号,以此类推 —— 由有限状态机或上下文无关文法来管。</p>"
        },
        {
          "name": "Context length & prompting structure",
          "nameZh": "上下文长度与提示结构",
          "body": "<p>How many tokens can the model hold in view at once? That number goes by <strong>context length</strong>, context size, window size — same thing under different names, and it equals exactly what self-attention can see. Modern LLMs run from tens of thousands of tokens to hundreds of thousands, even into the millions (Gemini advertises the million range). But longer is not a free win. A paper this summer named the failure <strong>context rot</strong>: using the <strong>needle-in-a-haystack</strong> test — bury one answer in a bigger and bigger pile of text — retrieval accuracy <em>drops</em> as the context grows, and <strong>distractors</strong> (extra noise) drag it down further. So for a retrieval job, aim the right context at the model instead of dumping everything in.</p><p>There is no formal theory of prompt structure, but one mental model with four parts earns its keep. <strong>Context</strong> sets the scene. <strong>Instructions</strong> are the task, like a function. <strong>Input</strong> is its arguments. <strong>Constraints</strong> are the rules — tone, safety. For the assistant you chat with daily, the context might be a system message stamping the date and time, and the constraints might be safety rules you never see, like do not generate harmful content.</p>",
          "bodyZh": "<p>模型一次能盯住多少词元?这个数有好几个叫法 —— <strong>上下文长度(context length)</strong>、上下文大小、窗口大小,换名不换物,它正好等于自注意力能看到的范围。现代大语言模型从数万词元跑到数十万,乃至上百万(Gemini 宣传到百万级)。但更长不是白送的好处。今夏一篇论文给这种翻车起了名:<strong>上下文腐化(context rot)</strong>。用<strong>大海捞针(needle-in-a-haystack)</strong>测试 —— 把一个答案埋进越堆越大的文本里 —— 上下文一长,检索准确率就<em>往下掉</em>,再加上<strong>干扰项(distractors)</strong>(额外的噪声),掉得更狠。所以做检索的活,要把对的上下文瞄准了喂给模型,别一股脑全倒进去。</p><p>提示结构没有正经理论,但有个分四块的心智模型很顶用。<strong>上下文</strong>搭好场景。<strong>指令</strong>是任务,像一个函数。<strong>输入</strong>是它的参数。<strong>约束</strong>是规矩 —— 语气、安全。拿你天天聊的那个助手来说,上下文可能是一条盖了日期和时间的系统消息,约束可能是你从来看不见的安全规则,比如「不要生成有害内容」。</p>"
        },
        {
          "name": "In-context learning, CoT & self-consistency",
          "nameZh": "上下文学习、思维链与自一致性",
          "body": "<p><strong>In-context learning (ICL)</strong> steers the model through its input alone, touching no weights — the word learning is borrowed here, since nothing in the weights moves. <strong>Zero-shot</strong> just states the task. <strong>Few-shot</strong> slips in input-output examples — write a story for a teddy named Teddy, then for one named Bob — and lets the model read the pattern off them. Few-shot usually wins, but it costs you: curation, tokens, latency. And with the newer reasoning models, a well-written instruction can match or beat examples, because examples pin the model to a finite set and hurt it on distributions it never saw (see <em>plan-and-solve</em> prompting).</p><p><strong>Chain-of-thought (CoT)</strong> makes the model show its work before the answer — the bear was born in 2020, so it is 4, so next year it is 5 — and multi-step accuracy jumps. It also makes debugging easy: if the chain insists we are in 2019, you trace the wrong date straight back to the prompt. <strong>Self-consistency</strong> takes one more step. Sample many CoT paths <em>in parallel</em>, pull each final answer out (tell the model to put the answer last, or grab it with a regex), and take a <strong>majority vote</strong>. The individual mistakes cancel; the answer that survives is the one to trust.</p>",
          "bodyZh": "<p><strong>上下文学习(ICL)</strong>只靠输入来带模型,一个权重都不碰 —— 这里「学习」是借来的词,因为权重里什么都没动。<strong>零样本</strong>只把任务说出来。<strong>少样本</strong>往里塞输入-输出示例 —— 先给名叫 Teddy 的泰迪熊写个故事,再给名叫 Bob 的写一个 —— 让模型从示例里把套路读出来。少样本通常赢,但要你掏成本:整理、词元、延迟。而碰上更新的推理模型,一条写得好的指令能跟示例打平甚至更强,因为示例把模型钉在一个有限集合上,遇到没见过的分布就泛化不动了(见 <em>plan-and-solve</em> 提示)。</p><p><strong>思维链(CoT)</strong>让模型先把过程摆出来再给答案 —— 熊生于 2020,所以现在 4 岁,所以明年 5 岁 —— 多步准确率立马往上跳。它还让调试变得省事:要是链里咬定「现在是 2019」,你顺着就把写错的日期一路追回提示里。<strong>自一致性(self-consistency)</strong>再往前走一步。<em>并行</em>采样多条思维链,把每条的最终答案拎出来(让模型把答案放最后,或用正则抓),再来个<strong>多数投票</strong>。零星的错互相抵消;活下来的那个答案,才是该信的。</p>"
        },
        {
          "name": "Inference optimizations",
          "nameZh": "推理优化",
          "body": "<p>Generating text is expensive, and at inference the wall you hit is memory, not math — you are <strong>memory-bound</strong>. <strong>Exact</strong> tricks change nothing in the output. <strong>KV caching</strong> stashes past keys and values, so a new token computes only its own \\(K,V\\) and pulls the rest from the cache (the queries of past tokens are dead weight; training uses teacher forcing, so caching never comes up there). <strong>Grouped-query attention (GQA)</strong> shares key/value heads across groups of queries — plain MHA carries \\(h\\) query/key/value heads, MQA keeps a single K/V head, GQA picks \\(G<h\\) in between. <strong>PagedAttention</strong> (vLLM) tackles the memory the KV cache wastes — reserve the full context length per request the naive way and you bleed it to internal and external fragmentation — by storing K/V in non-contiguous fixed-size blocks (the paper uses 16) with a position-to-block map, the way an OS pages memory. <strong>Latent / multi-head latent attention</strong> (DeepSeek-V2) routes the K/V projection through a low-dimensional latent — compress, then decompress — and <em>shares</em> that compression across keys, values and heads, down to one vector per token per block. It also doubles as regularization.</p><p><strong>Approximate</strong> tricks give up a sliver of accuracy at the token level to go faster. <strong>Speculative decoding</strong> sends a small <strong>draft</strong> model out to propose several tokens, then the big <strong>target</strong> model scores all of them in one pass; an accept/reject rule (a flavor of rejection sampling) guarantees the output still matches the target distribution, and the final position throws in a next-token sample for free. <strong>Multi-token prediction (MTP)</strong> folds draft and target into one model by training \\(k\\) prediction heads (the objective shifts from next-token to multi-token); the extra heads play the draft, accepted greedily.</p>",
          "bodyZh": "<p>生成文本很贵,而推理时你撞上的墙是显存,不是算力 —— 你受<strong>显存约束</strong>。<strong>精确</strong>技巧不动输出分毫。<strong>KV 缓存</strong>把过去的键和值存起来,新词元只算自己的 \\(K,V\\),其余从缓存里拽(过去词元的查询是死重;训练用教师强制,那里压根不涉及缓存)。<strong>分组查询注意力(GQA)</strong>让一组查询共用键/值头 —— 朴素 MHA 扛着 \\(h\\) 个查询/键/值头,MQA 只留一个 K/V 头,GQA 取中间的 \\(G<h\\)。<strong>PagedAttention</strong>(vLLM)对付 KV 缓存浪费的那块显存 —— 朴素地给每个请求预留满上下文长度,就会被内部和外部碎片放干 —— 办法是把 K/V 存进不连续的定长块(论文取 16),配一张「位置到块」的映射表,就像操作系统给内存分页。<strong>潜在/多头潜在注意力</strong>(DeepSeek-V2)把 K/V 投影绕过一个低维潜在空间 —— 先压缩,再解压 —— 还把这道压缩在键、值与各头之间<em>共享</em>,压到每块每词元只剩一个向量。它顺带还当正则化用。</p><p><strong>近似</strong>技巧在词元层面让出一丝准确率来换速度。<strong>推测解码(speculative decoding)</strong>派一个小的<strong>草稿(draft)</strong>模型出去一口气提几个词元,再让大的<strong>目标(target)</strong>模型一遍把它们全打分;一条接受/拒绝规则(拒绝采样的一种)保证输出仍与目标分布一致,而最后一个位置还白送一个下一词元的采样。<strong>多词元预测(MTP)</strong>把草稿和目标揉进同一个模型,办法是训 \\(k\\) 个预测头(目标从下一词预测改成多词预测);多出来的头当草稿,贪心地接受。</p>"
        }
      ],
      "takeaways": [
        "An LLM is a decoder-only next-token predictor scaled up in parameters, data and compute; more than 90% of modern models are decoder-only.",
        "MoE puts experts at the FFN and routes each token to its top-k, so total capacity grows while active parameters stay flat; a load-balancing auxiliary loss keeps the router from collapsing onto a few experts.",
        "Picking the next token: greedy is local-optimal and deterministic, beam search suits translation, and sampling with temperature, top-k and top-p trades determinism for variety.",
        "Prompting buys accuracy at test time with no weight updates — zero/few-shot ICL, chain-of-thought, and majority-vote self-consistency.",
        "Inference is memory-bound; KV caching, GQA, PagedAttention, latent attention, speculative decoding and MTP make generation cheaper."
      ],
      "takeawaysZh": [
        "大语言模型是一个在参数、数据、算力上放大的仅解码器下一词元预测器;九成以上的现代模型都是仅解码器。",
        "MoE 把专家放在 FFN 处,每个词元路由到它的前 k 个专家,于是总容量做大、激活参数按住不动;一项负载均衡辅助损失,拦着路由器别坍缩到少数几个专家上。",
        "挑下一个词元:贪心局部最优且确定,束搜索适合翻译,带温度、top-k、top-p 的采样以确定性换多样。",
        "提示能在测试期不动权重就换来准确率 —— 零/少样本 ICL、思维链、多数投票的自一致性。",
        "推理受显存约束;KV 缓存、GQA、PagedAttention、潜在注意力、推测解码与 MTP 让生成更省。"
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
          "tZh": "Switch Transformers:扩展到万亿参数模型(原名 Switch Transformers, 2021)"
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
          "tZh": "上下文腐化:输入词元增多如何拖累大语言模型表现(原名 Context Rot, 2025)"
        },
        {
          "t": "Efficient Memory Management for LLM Serving with PagedAttention (Kwon et al., 2023)",
          "u": "https://arxiv.org/abs/2309.06180",
          "tZh": "用 PagedAttention 高效管理大语言模型服务的显存(原名 PagedAttention, 2023)"
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
          "tZh": "用多词元预测得到更好更快的大语言模型(原名 Multi-token Prediction, 2024)"
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
      "tagline": "Train one model on the whole internet, squeeze it onto the hardware, then adapt it on the cheap.",
      "taglineZh": "拿一个模型在整个互联网上训练,把它塞进硬件,再低成本地适配。",
      "overview": "<p>Ten years ago you built a model per task. Today you build one big model on language and code, then bend it to whatever you need. This lecture walks that whole arc. First the pretraining objective — next-token prediction — and what scaling laws and the <strong>Chinchilla</strong> rule say about how big and how long to train. Then the part nobody warns you about: the model does not fit on one GPU, so you spread it across many with data and model parallelism, <strong>ZeRO</strong> sharding, <strong>FlashAttention</strong>, mixed precision and <strong>quantization</strong>. The second half (Shervine) takes the base model, which only knows how to predict text, and turns it into something that answers your questions — <strong>supervised fine-tuning</strong> and instruction tuning — then asks the hard question of how you even measure that, and closes with cheap adaptation: <strong>LoRA</strong> and <strong>QLoRA</strong>.</p>",
      "overviewZh": "<p>十年前,你为每个任务造一个模型。今天,你造一个大模型,在语言和代码上训练,再把它掰成你需要的样子。本讲就走完这整条路。先讲预训练的目标 —— 下一词预测 —— 以及扩展定律和 <strong>Chinchilla</strong> 法则告诉我们的事:模型该多大、训多久。再讲没人提醒你的那部分:模型一块 GPU 装不下,于是你把它摊到很多块上,用数据并行、模型并行、<strong>ZeRO</strong> 分片、<strong>FlashAttention</strong>、混合精度和<strong>量化</strong>。后半部分(Shervine 讲)拿过基座模型 —— 它只会预测文本 —— 把它变成能回答你问题的东西:<strong>有监督微调(SFT)</strong>和指令微调;接着抛出那个难题:你到底怎么衡量它好不好;最后落在便宜的适配上:<strong>LoRA</strong> 与 <strong>QLoRA</strong>。</p>",
      "topics": [
        {
          "name": "Paradigm shift: pretrain then tune",
          "nameZh": "范式转变:先预训练,再微调",
          "body": "<p>Ten years ago, every task got its own model. Spam detection: train one from scratch on its own train/val/test split. Sentiment: train another. Translation: another. But step back and these tasks all lean on the same skill — <em>reading text</em>. <strong>Transfer learning</strong> cashes that in: start from a model that already knows language, and reuse what it knows instead of starting at zero.</p><p>That is the LLM recipe in two stages. Stage 1, <strong>pretraining</strong>: train one big model on a mountain of data so it learns the shape of language and code. Stage 2, <strong>tuning</strong>: nudge those weights toward a specific job (spam, sentiment, translation) or, far more often, toward being a general assistant.</p><p>The pretraining objective is plain <strong>next-token prediction</strong>. An LLM is a text-to-text model, and in <em>over 90% of cases</em> a decoder-only transformer — so for the rest of this lecture, LLM means a decoder-only transformer. Feed it text and it predicts the next token, then the next, rolling forward from a beginning-of-sentence token \\([\\text{BOS}]\\) all the way through the corpus.</p>",
          "bodyZh": "<p>十年前,每个任务都有自己的模型。垃圾邮件检测:在自己的训练/验证/测试集上从零训一个。情感分析:再训一个。翻译:再一个。可退一步看,这些任务靠的是同一种本事 —— <em>读文本</em>。<strong>迁移学习(transfer learning)</strong>就把这点兑现了:从一个已经懂语言的模型出发,复用它已经会的,而不是从零开始。</p><p>这就是大模型的配方,分两步。第一步,<strong>预训练</strong>:拿一座数据的大山训一个大模型,让它学会语言和代码的样子。第二步,<strong>微调(tuning)</strong>:把这些权重往某个具体活儿上推一推(垃圾邮件、情感、翻译),或者更常见地,往「通用助手」上推。</p><p>预训练的目标很朴素,就是<strong>下一词预测</strong>。大模型是文本到文本模型,而且<em>九成以上</em>是仅解码器(decoder-only)的 Transformer —— 所以本讲后面说「大模型」,就指仅解码器的 Transformer。喂它文本,它就预测下一个词元,再下一个,从句首标记 \\([\\text{BOS}]\\) 起步,一路滚过整个语料。</p>"
        },
        {
          "name": "Pretraining: data, scale, FLOPs, scaling laws",
          "nameZh": "预训练:数据、规模、FLOPs 与扩展定律",
          "body": "<p>Pretraining is the expensive stage, by a wide margin. The data is <em>everything you can scrape</em>: web text (<strong>Common Crawl</strong> archives roughly 3 billion pages a month, plus Wikipedia and Reddit), code (GitHub, StackOverflow), dozens of languages. You measure it in tokens — hundreds of billions, climbing into the <em>tens of trillions</em>. Two numbers to hold onto: <strong>GPT-3 trained on 300 billion tokens; Llama 3 on 15 trillion</strong>.</p><p>Two notations show up everywhere. <strong>FLOPs</strong> (FLoating-point OPerations) count <em>total compute</em> — training an LLM runs around \\(10^{25}\\) FLOPs, roughly \\(O(\\text{params}\\times\\text{tokens})\\), though MoE models cost less because only some parameters fire. <strong>FLOPS / FLOP/s</strong> (per second) is hardware <em>speed</em>: how fast the chip chews through those operations. Papers sometimes write one when they mean the other, so read the sentence around it.</p><p>Kaplan et al. (2020) ran the experiments: loss drops predictably as you add compute, add data, and grow the model — and bigger models are more <strong>sample-efficient</strong>, squeezing more out of each token. But compute is not free. Given a <em>fixed</em> budget, the <strong>Chinchilla</strong> paper (Hoffmann et al., 2022) found the sweet spot: about <strong>20 training tokens per parameter</strong>. By that yardstick GPT-3 — 175B parameters, only 300B tokens — was badly <em>under-trained</em>.</p>",
          "bodyZh": "<p>预训练是最烧钱的一步,而且遥遥领先。数据是<em>你能扒到的一切</em>:网页文本(<strong>Common Crawl</strong> 每月归档约 30 亿个页面,外加维基百科、Reddit)、代码(GitHub、StackOverflow)、几十种语言。规模用词元来量 —— 从数千亿一路爬到<em>数十万亿</em>。记住两个数:<strong>GPT-3 用了 3000 亿词元;Llama 3 用了 15 万亿</strong>。</p><p>有两个记号到处都是。<strong>FLOPs</strong>(浮点运算次数)数的是<em>总算力</em> —— 训一个大模型约 \\(10^{25}\\) FLOPs,大致是 \\(O(\\text{参数}\\times\\text{词元})\\),不过混合专家(MoE)模型更省,因为只有部分参数会被点亮。<strong>FLOPS / FLOP/s</strong>(每秒)是硬件<em>速度</em>:芯片啃这些运算有多快。论文里有时把两者写串,所以要看上下文那句话。</p><p>Kaplan 等人(2020)把实验跑了一遍:算力越多、数据越多、模型越大,损失就可预测地往下掉;而且更大的模型更<strong>样本高效(sample-efficient)</strong>,每个词元都榨出更多。可算力不白来。在<em>固定</em>预算下,<strong>Chinchilla</strong> 那篇(Hoffmann 等,2022)找到了甜点:大约<strong>每个参数配 20 个训练词元</strong>。按这把尺子量,GPT-3 —— 1750 亿参数,却只有 3000 亿词元 —— 严重<em>训练不足</em>。</p>"
        },
        {
          "name": "Pretraining challenges: cost, knowledge cutoff",
          "nameZh": "预训练的挑战:成本与知识截止",
          "body": "<p>Compute is not the only wall. <strong>Cost</strong> starts at millions of dollars and climbs into the tens or hundreds of millions, takes a long time, and burns enough electricity that papers now report the environmental footprint too.</p><p>And the model only knows what was in its data — up to the <strong>knowledge cutoff date</strong>, the moment the pretraining corpus was sealed. A base model has no way, on its own, to know what happened after that. Every model card (OpenAI, Google) states it; GPT-5, for instance, lists a cutoff of September 30. Adding or <em>editing</em> knowledge later turns out to be a hard, unsolved problem: poke the weights to insert one fact and other domains tend to regress, so there is no clean surgical fix.</p><p>One more hazard. Because the model reaches for the most likely next token, it can spit back text it saw word-for-word in training — <strong>plagiarism</strong>. Cost, stale knowledge, memorization: these three problems drive everything that comes next, both the efficiency tricks below and the retrieval and tuning stages later on.</p>",
          "bodyZh": "<p>算力不是唯一的墙。<strong>成本</strong>从数百万美元起步,往数千万乃至数亿爬,耗时很长,烧的电多到论文如今也得把环境账一起报上。</p><p>而且模型只知道它数据里有的东西 —— 到<strong>知识截止日期(knowledge cutoff)</strong>为止,也就是预训练语料被封存的那一刻。基座模型靠自己无从知晓那之后发生了什么。每张模型卡(OpenAI、Google)都会写明这一点;比如 GPT-5 标的截止日期是 9 月 30 日。事后<em>注入或编辑</em>知识,结果是个困难且没解开的问题:戳一下权重塞进一个事实,别的领域往往就退化,没有干净的「外科手术」。</p><p>还有一重坑。模型总伸手去抓最可能的下一词,于是它可能把训练时逐字见过的文本原样吐出来 —— 这就是<strong>抄袭(plagiarism)</strong>。成本、知识陈旧、死记硬背:正是这三个问题,推动了后面的一切 —— 下面的效率技巧,以及更后面的检索与微调。</p>"
        },
        {
          "name": "Training memory & parallelism (DP, ZeRO, MP)",
          "nameZh": "训练显存与并行(DP、ZeRO、模型并行)",
          "body": "<p>Training tunes the weights in three steps: a <strong>forward pass</strong> computes the loss, a <strong>backward pass</strong> computes the gradients, and a <strong>weight update</strong> applies them (with <em>Adam</em>, which also tracks first and second moments — moving averages of the gradient and the squared gradient). Four things have to sit in memory at once: <strong>activations</strong> (which grow with model size, batch size, and context length — the last one is \\(O(n^2)\\) thanks to self-attention), gradients, parameters, and optimizer state. An H100 holds about <strong>80 GB</strong>. That is not much.</p><p>So you spread the load across many GPUs. <strong>Data parallelism (DP)</strong> splits the batch across devices, each holding a full copy of the model; afterward the gradients get <em>averaged</em> across GPUs, and that averaging is a <strong>communication cost</strong> that drags training down. Since every GPU is redundantly storing the same parameters, gradients, and optimizer state, <strong>ZeRO</strong> (Zero Redundancy Optimization) shards them instead: <em>ZeRO-1</em> partitions optimizer state, <em>ZeRO-2</em> adds gradients, <em>ZeRO-3</em> adds parameters — less memory per GPU, more talking between them. <strong>Model parallelism</strong> cuts up the computation itself: <em>tensor</em> parallelism slices the big matrix multiplies, <em>pipeline</em> parallelism hands each GPU a range of layers, and <em>expert</em> parallelism puts different MoE experts on different devices.</p>",
          "bodyZh": "<p>训练靠三步调权重:<strong>前向传播</strong>算损失,<strong>反向传播</strong>算梯度,<strong>权重更新</strong>把它们用上(用 <em>Adam</em>,它还盯着一阶矩和二阶矩 —— 梯度与梯度平方的滑动平均)。有四样东西得同时待在显存里:<strong>激活值</strong>(随模型大小、批量大小、上下文长度一起长 —— 最后这项因自注意力是 \\(O(n^2)\\))、梯度、参数、优化器状态。一块 H100 装约 <strong>80 GB</strong>。这不算多。</p><p>于是把负担摊到很多块 GPU 上。<strong>数据并行(DP)</strong>把批量切到各设备,每块都存一份完整模型;之后在 GPU 间把梯度<em>求平均</em>,而这次求平均是一笔<strong>通信开销</strong>,会把训练拖慢。既然每块 GPU 都冗余地存着同样的参数、梯度、优化器状态,<strong>ZeRO</strong>(零冗余优化)干脆把它们分片:<em>ZeRO-1</em> 切优化器状态,<em>ZeRO-2</em> 再切梯度,<em>ZeRO-3</em> 再切参数 —— 每块显存更少,彼此之间话更多。<strong>模型并行</strong>切的是计算本身:<em>张量</em>并行把大矩阵乘法切片,<em>流水线</em>并行给每块 GPU 分一段层,<em>专家</em>并行把不同的 MoE 专家放到不同设备上。</p>"
        },
        {
          "name": "FlashAttention",
          "nameZh": "FlashAttention",
          "body": "<p><strong>FlashAttention</strong> (Dao et al., 2022, built at Stanford) speeds up attention <em>exactly</em> — no approximation — by playing the GPU's memory hierarchy. A GPU has two memories: <strong>HBM</strong>, big but slow (tens of GB, a few TB/s), and <strong>SRAM</strong>, on-chip, tiny but fast (tens of MB, tens of TB/s). Standard attention, \\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right)V, \\] keeps shuttling the full intermediate matrices in and out of slow HBM: compute \\(S\\), write it, read it back, softmax, write, read, multiply by \\(V\\), write again. The chip is fast, but it sits idle waiting on memory — the data transfer is the bottleneck.</p><p><strong>Idea 1 — tiling.</strong> Softmax normalizes each row to sum to 1, which looks like you need the whole row before you can start. But split a row into blocks and the row's softmax equals the per-block softmaxes, each fixed up by a scaling factor. So load small blocks of \\(Q,K,V\\) into SRAM, run a block of the output start to finish, and write it out once — many HBM round-trips collapse into roughly one. <strong>Idea 2 — recomputation.</strong> Attention is fast now, so stop storing activations for the backward pass and just recompute them. That does <em>more</em> FLOPs yet runs <em>faster</em> and uses less memory — HBM access dropped from 40.3 to about 4, roughly a 10x cut. More math, less waiting, both wins at once. FlashAttention-2 and -3 carry the idea onto newer GPUs.</p>",
          "bodyZh": "<p><strong>FlashAttention</strong>(Dao 等,2022,在斯坦福做出)在不做任何近似的前提下<em>精确地</em>加速注意力,玩的是 GPU 的存储层级。GPU 有两种内存:<strong>HBM</strong>,大但慢(数十 GB,几 TB/s);<strong>SRAM</strong>,在芯片上,极小但快(数十 MB,数十 TB/s)。标准注意力 \\[ \\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d}}\\right)V \\] 一直在把中间大矩阵搬进搬出慢速 HBM:算 \\(S\\)、写、读回、做 softmax、写、读、乘 \\(V\\)、再写。芯片很快,却在干等内存 —— 数据搬运才是瓶颈。</p><p><strong>想法一 —— 分块(tiling)。</strong>softmax 把每一行归一化到和为 1,看着像是得先有整行才能动手。但把一行切成块,整行的 softmax 就等于各块的 softmax,每块再用一个缩放因子修正一下。于是把 \\(Q,K,V\\) 的小块载进 SRAM,把输出的一块从头算到尾,只写出去一次 —— 多趟 HBM 往返就这么压成基本上一趟。<strong>想法二 —— 重算(recomputation)。</strong>注意力现在快了,那就别为反向传播存激活了,直接重算。这做了<em>更多</em> FLOPs,却跑得<em>更快</em>、还更省显存 —— HBM 访问从 40.3 掉到约 4,差不多砍掉 10 倍。算得多,等得少,两头都赢。FlashAttention-2 和 -3 把这想法搬到了更新的 GPU 上。</p>"
        },
        {
          "name": "Mixed precision & quantization",
          "nameZh": "混合精度与量化",
          "body": "<p>Weights are floating-point numbers — bits split into a sign, an exponent, and a mantissa (which sets how fine-grained the value is). The common formats: <strong>FP32</strong> (1/8/23), <strong>FP16</strong> (1/5/10), <strong>FP64</strong> (1/11/52), <strong>BF16</strong> (1/8/7). Fewer bits means half the memory and faster math — an H100 does about 34 TFLOPS in FP64, and roughly doubles that dropping to FP32, and so on down the line.</p><p><strong>Mixed precision training</strong> (Micikevicius et al., 2017) keeps a high-precision FP32 master copy of the <em>weights</em>, runs the forward and backward passes in low precision (FP16), and does the <em>weight update</em> back in FP32. The intuition: training data is noisy, so the gradient direction does not need to be razor-precise — but the weights do, or quantization error piles up update after update.</p><p><strong>Quantization</strong> converts a number to lower precision, say INT8 or INT4. A value maps through a scale, with an optional zero-point: \\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right) + z, \\qquad \\hat{x} = s\\,(x_q - z). \\] Store the weights in 4 bits instead of 16 and the model shrinks to a quarter of the size. It still mostly works. Variants like <strong>zero-point quantization</strong> and <strong>absmax</strong> differ in how they handle the value range; later methods build on this (GPTQ and AWQ after training; QAT during it).</p>",
          "bodyZh": "<p>权重是浮点数 —— 比特分成符号位、指数位和尾数位(尾数决定数有多细)。常见格式:<strong>FP32</strong>(1/8/23)、<strong>FP16</strong>(1/5/10)、<strong>FP64</strong>(1/11/52)、<strong>BF16</strong>(1/8/7)。比特越少,显存减半、算得更快 —— H100 在 FP64 下约 34 TFLOPS,掉到 FP32 大致翻倍,往下依此类推。</p><p><strong>混合精度训练</strong>(Micikevicius 等,2017)留一份高精度 FP32 的<em>权重</em>主副本,前向和反向传播用低精度(FP16)跑,而<em>权重更新</em>再回到 FP32。直觉是:训练数据本就有噪声,梯度方向不用刀切般精确 —— 但权重得精确,否则量化误差一次次更新地堆起来。</p><p><strong>量化(quantization)</strong>把一个数转成更低精度,比如 INT8 或 INT4。数值通过一个缩放因子映射,零点可选:\\[ x_q = \\text{round}\\!\\left(\\frac{x}{s}\\right) + z, \\qquad \\hat{x} = s\\,(x_q - z). \\] 把权重从 16 位存成 4 位,模型缩到四分之一大。而且基本还能用。像<strong>零点量化(zero-point)</strong>和 <strong>absmax</strong> 这些变体,区别在怎么处理数值范围;后续方法都建在这上面(训练后的 GPTQ、AWQ;训练时的量化感知训练 QAT)。</p>"
        },
        {
          "name": "SFT, instruction tuning & evaluation",
          "nameZh": "SFT、指令微调与评测",
          "body": "<p>Ask a <em>base</em> model can I put my teddy bear in the washer, and it does not answer — it predicts a likely continuation, something like teddy bears are often made of polyester and cotton. It was trained to predict the next token, not to help you. <strong>SFT</strong> (Supervised Fine-Tuning) fixes that: train on <em>(input, output)</em> pairs that show the behavior you want, using the same next-token loss but computing it <strong>only on the response</strong>. The prompt stays fixed context — no teacher forcing on it — so the model learns to <em>produce</em> good answers instead of parroting the question back. SFT on instruction-following data is <strong>instruction tuning</strong>, the step that graduates a base model into a helpful assistant. Same teddy-bear question, new answer: no, hand wash it instead.</p><p>The SFT data mix spans assistant dialogues, synthetic instructions, math, reasoning, code, and safety alignment (refusals, hedging) — and these days it is increasingly LLM-written, then checked by humans. It is smaller and cleaner than pretraining data: GPT-3 used about 13k examples, Llama 3 about 10 million — orders of magnitude fewer tokens. <strong>Evaluation</strong> is the hard part. Benchmarks like MMLU, ARC-Challenge, GSM8K, and HumanEval can be gamed by <em>training on the test task</em>; LMArena puts a number on the vibes through pairwise human votes, but it has cold-start noise, can be rigged, and bakes in personal taste and safety bias. SFT plus preference tuning (Lecture 5) together go by the name <strong>alignment</strong>.</p>",
          "bodyZh": "<p>问一个<em>基座</em>模型「能把泰迪熊放进洗衣机吗」,它不回答 —— 它预测一个最可能的续写,大概是「泰迪熊通常由聚酯纤维和棉花制成」。它是被训来预测下一词的,不是来帮你的。<strong>SFT</strong>(有监督微调)把这点掰过来:在<em>(输入, 输出)</em>对上训练,这些对展示了你想要的行为;用同样的下一词损失,但<strong>只在回答上</strong>算。提示保持为固定上下文 —— 不对它做教师强制 —— 于是模型学会<em>产出</em>好答案,而不是把问题原样复述回来。在「指令遵循」数据上做 SFT,就是<strong>指令微调</strong>,正是这一步把基座模型「毕业」成一个有用的助手。同样的泰迪熊问题,换了新答案:「不行,请改用手洗。」</p><p>SFT 的数据混合涵盖助手对话、合成指令、数学、推理、代码,以及安全对齐(拒答、措辞留余地的 hedging)—— 如今越来越多由大模型来写,再交给人审。它比预训练数据更小、更干净:GPT-3 用了约 1.3 万个样本,Llama 3 约 1000 万 —— 词元数少好几个数量级。<strong>评测</strong>才是难的。MMLU、ARC-Challenge、GSM8K、HumanEval 这些基准,会被<em>「在测试任务上训练」</em>钻空子;LMArena 用人类两两投票给「感觉(vibes)」打个分,可它有冷启动噪声、能被做手脚,还把个人口味和安全偏差一起烤了进去。SFT 加上偏好微调(第 5 讲),合起来叫<strong>对齐(alignment)</strong>。</p>"
        },
        {
          "name": "LoRA & QLoRA",
          "nameZh": "LoRA 与 QLoRA",
          "body": "<p>Full fine-tuning rewrites the entire weight matrix — heavy on resources, and you end up storing a whole model per task. <strong>LoRA</strong> (Hu et al., 2021) freezes the pretrained weights \\(W_0\\) and learns a small low-rank update from two skinny matrices:</p>\\[ W = W_0 + BA, \\qquad B\\in\\mathbb{R}^{d\\times r},\\ A\\in\\mathbb{R}^{r\\times k},\\ r \\ll d. \\]<p>The forward pass runs both terms and adds them. \\(W\\) spans hundreds or thousands of dimensions, but the rank \\(r\\) is tiny — often up to about 10, with rank 4 a common default — so far fewer parameters actually train. And here is the handy part: swap \\(A,B\\) and you swap tasks, so many adapters can ride on one frozen base. Two quirks from practice: LoRA wants a <strong>~10x higher learning rate</strong> than full fine-tuning, and it does <strong>poorly with large batch sizes</strong>. The original paper put LoRA on the attention matrices; newer guidance (LoRA Without Regret, 2025) finds the <em>feed-forward</em> blocks pay off most, so today both carry adapters.</p><p><strong>QLoRA</strong> (Dettmers et al., 2023) quantizes the frozen \\(W_0\\) down to 4-bit <strong>NF4</strong> (NormalFloat — it assumes the weights are roughly normal and splits the range into quantiles, so each bucket holds about the same number of values) while \\(A,B\\) stay full precision (BF16) and the compute runs full precision too. It also <strong>double-quantizes</strong> — quantizing the quantization constants themselves. On LLaMA 65B this bought about 16x VRAM savings, with double quantization shaving off roughly 6% more.</p>",
          "bodyZh": "<p>全量微调要把整个权重矩阵重写一遍 —— 吃资源,而且每个任务都得存一份完整模型。<strong>LoRA</strong>(Hu 等,2021)把预训练权重 \\(W_0\\) 冻住,用两个瘦长的矩阵学一个小小的低秩更新:</p>\\[ W = W_0 + BA, \\qquad B\\in\\mathbb{R}^{d\\times r},\\ A\\in\\mathbb{R}^{r\\times k},\\ r \\ll d. \\]<p>前向传播把两项分别算了再相加。\\(W\\) 横跨数百到数千个维度,而秩 \\(r\\) 很小 —— 常常不超过 10,秩 4 是常用默认值 —— 所以真正要训的参数少得多。还有顺手的一点:换掉 \\(A,B\\) 就换了任务,于是很多适配器能搭在同一个冻结基座上。两条实践里的怪脾气:LoRA 要比全量微调<strong>高约 10 倍的学习率</strong>,而且<strong>在大批量下表现差</strong>。原始论文把 LoRA 放在注意力矩阵上;更新的指引(LoRA Without Regret,2025)发现<em>前馈(feed-forward)</em>块回报最大,所以如今两处都带适配器。</p><p><strong>QLoRA</strong>(Dettmers 等,2023)把冻结的 \\(W_0\\) 量化到 4-bit 的 <strong>NF4</strong>(NormalFloat —— 它假设权重大致服从正态分布,把范围按分位数而非等宽切开,于是每个桶里值的数量差不多),而 \\(A,B\\) 保持全精度(BF16),计算也走全精度。它还做<strong>双重量化</strong> —— 把量化常数本身也量化一遍。在 LLaMA 65B 上,这换来约 16 倍的显存(VRAM)节省,双重量化再削掉约 6%。</p>"
        }
      ],
      "takeaways": [
        "LLMs run on transfer learning: pretrain once on language and code via next-token prediction, then tune.",
        "Chinchilla-optimal training pairs ~20 tokens per parameter; GPT-3 (175B, 300B tokens) was under-trained, while Llama 3 saw 15T tokens.",
        "A single H100 holds ~80 GB, so training leans on data and model parallelism plus ZeRO-1/2/3 sharding of optimizer state, gradients, and parameters.",
        "FlashAttention is exact: tiling through SRAM plus backward-pass recomputation cuts HBM I/O ~10x and runs faster, not slower.",
        "Mixed precision keeps FP32 master weights but computes in FP16/BF16; quantization (INT8/INT4) maps values through a scale and zero-point.",
        "SFT and instruction tuning train on (input, output) pairs with loss only on the response, turning a base model into a helpful assistant.",
        "LoRA learns a low-rank delta W = W0 + BA with W0 frozen; QLoRA quantizes W0 to NF4 for ~16x VRAM savings, so you can fine-tune on small GPUs."
      ],
      "takeawaysZh": [
        "大模型靠迁移学习:先用下一词预测在语言和代码上预训练一次,再微调。",
        "Chinchilla 最优训练约为每参数 20 词元;GPT-3(1750 亿参数、3000 亿词元)训练不足,而 Llama 3 见过 15 万亿词元。",
        "单块 H100 装约 80 GB,所以训练靠数据并行、模型并行,再加对优化器状态、梯度、参数做 ZeRO-1/2/3 分片。",
        "FlashAttention 是精确的:经 SRAM 分块加上反向传播重算,把 HBM 读写砍掉约 10 倍,而且跑得更快,不是更慢。",
        "混合精度留 FP32 主权重,却用 FP16/BF16 计算;量化(INT8/INT4)通过缩放因子和零点映射数值。",
        "SFT 和指令微调在(输入, 输出)对上训练,且只在回答上算损失,把基座模型变成有用的助手。",
        "LoRA 学一个低秩增量 W = W0 + BA,W0 冻住;QLoRA 把 W0 量化成 NF4,约省 16 倍显存,于是小卡也能微调。"
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
      "tagline": "Stop guessing what is likely. Show the model two answers and teach it which one people would pick.",
      "taglineZh": "别再猜什么更可能。给模型看两个答案,教它人会挑哪个。",
      "overview": "<p>After pretraining and <strong>SFT</strong> you have an autocompleter that follows instructions. It still answers in the wrong tone, says unsafe things, or just misses the point. The third stage, <strong>preference tuning</strong> (alignment), changes how the model <em>behaves</em> without feeding it new facts. One example runs through the whole lecture: ask the assistant to suggest something to do with your teddy bear and it says <em>I would suggest you do not spend much time with your teddy bear at all</em>. Fluent. Not what anyone asked for.</p><p>People can't write down what a good answer is, but show them two and they will point to the better one. RLHF is built on that one fact. We work through why likelihood is the wrong target, how to collect <strong>pairwise preference pairs</strong>, the two-stage <strong>RLHF</strong> pipeline (train a reward model, then run RL), the <strong>Bradley–Terry</strong> reward loss, <strong>PPO</strong> with its clipped and KL-penalty objectives, the cheap inference-time shortcut <strong>Best-of-N</strong>, and <strong>DPO</strong>, which throws out the RL loop and treats the policy itself as a hidden reward model.</p>",
      "overviewZh": "<p>预训练加 <strong>SFT</strong> 之后,你手里是一个会听指令的自动补全器。它的语气还会跑偏、会说不安全的话,或者干脆答非所问。第三个阶段 —— <strong>偏好微调</strong>(对齐,alignment)—— 不喂新事实,只改模型怎么<em>做事</em>。有个例子贯穿整堂课:让助手出个和泰迪熊一起玩的主意,它却说<em>我建议你根本别在泰迪熊身上花太多时间</em>。话很顺。没人想要这答案。</p><p>人说不清什么叫好答案,但给两个,他们一眼能挑出更好的那个。RLHF 就建在这件事上。我们一路走下来:为什么似然是错的目标、怎么收集<strong>成对偏好对</strong>、两阶段的 <strong>RLHF</strong> 流程(先训奖励模型,再跑 RL)、<strong>Bradley–Terry</strong> 奖励损失、带裁剪和 KL 惩罚两种目标的 <strong>PPO</strong>、推理期的省事捷径 <strong>Best-of-N</strong>,以及 <strong>DPO</strong> —— 它扔掉 RL 循环,把策略本身当成一个藏起来的奖励模型。</p>",
      "topics": [
        {
          "name": "Why preference tuning?",
          "nameZh": "为什么要偏好微调",
          "body": "<p>You already trained the model twice. Why a third pass? Three reasons. First, <strong>judging is easier than writing</strong>. Write a great poem from scratch and you struggle; that is the SFT label. Hand someone a bad poem and a good one and they tell you which is better in a second. Easier to judge means easier data to collect. Second, SFT is touchy about the <strong>prompt mix</strong>: drop in one corrective example and the model can tilt hard toward that kind of prompt. Third, good SFT data does <strong>not scale</strong> — chasing every slip with a fresh handwritten label burns time you do not have.</p><p>The real gap is this: SFT only ever says <em>generate this</em>. It has no way to say <em>do not generate that</em>. Preference tuning adds the missing half — a <strong>negative signal</strong>. We collect <strong>preference pairs</strong> \\(y_w \\succ y_l\\), winner over loser for the same prompt, and push the model toward what people actually pick. One warning from the instructor: if the model misbehaves constantly, that is not always a job for preference tuning. Go check the SFT data first. This stage is not a fix for everything.</p>",
          "bodyZh": "<p>模型你已经训了两轮,为什么还要第三轮?三个理由。第一,<strong>评判比写作容易</strong>。让你从零写一首好诗,你抓耳挠腮 —— 那是 SFT 的标签。可给你一首烂诗和一首好诗,你一秒就说出哪个好。好评判,意味着数据好收。第二,SFT 对<strong>提示的配比</strong>很敏感:塞进一个纠错样本,模型就可能往那类提示上猛偏。第三,好的 SFT 数据<strong>堆不上去</strong> —— 模型每出一次错你就手写一条标签去追,时间根本不够烧。</p><p>真正的缺口在这:SFT 只会说<em>生成这个</em>,它没办法说<em>别生成那个</em>。偏好微调把缺的那一半补上 —— 一个<strong>负向信号</strong>。我们收集<strong>偏好对</strong> \\(y_w \\succ y_l\\),同一个提示下胜者压过败者,把模型往人真正会挑的那边推。讲者提醒一句:要是模型老是出错,这不见得是偏好微调的活儿。先去查 SFT 数据。这一步不是包治百病。</p>"
        },
        {
          "name": "Collecting preference data",
          "nameZh": "收集偏好数据",
          "body": "<p>One observation is a (prompt, response) pair. There are three ways to label which response people like, and they are not equally pleasant for a human. <strong>Pointwise</strong> scoring — this poem is a 0.9, that one a 0.2 — falls apart fast: what is the difference between 0.9 and 0.2 supposed to mean? <strong>Listwise</strong> ranking of n responses drops the made-up numbers but is still fiddly. <strong>Pairwise</strong> — is A better than B? — is the one a human can answer cleanly, so it is the one people use.</p><p>Here is the recipe for a pair. (1) Take a prompt \\(x\\) from your logs or a target distribution. Run it through the SFT model <em>twice with positive temperature</em> and you get two different responses — or use synthetic outputs, or have a person <strong>rewrite</strong> a bad logged answer into a good one. (2) Say which one wins, by <strong>human ratings</strong> or a stand-in: <strong>LLM-as-a-judge</strong> (a few lectures away), or rule-based scores like BLEU/ROUGE (out of fashion now). The scale can be <strong>binary</strong> (better or worse) or graded (much better, slightly better, and so on). A lot of tasks are subjective, so people usually land on binary. The instructor's caution: human ratings are only as good as your annotation guidelines — vague guidelines, noisy labels.</p>",
          "bodyZh": "<p>一个观测就是一个(提示,回答)对。判断人喜欢哪个回答有三种方式,对人来说累不累差很多。<strong>逐点(pointwise)</strong>打分 —— 这首诗 0.9,那首 0.2 —— 很快就崩:0.9 和 0.2 差的那点到底是啥意思?对 n 个回答做<strong>列表(listwise)</strong>排序,省了瞎编的数字,可还是麻烦。<strong>成对(pairwise)</strong> —— A 是不是比 B 好? —— 才是人能干脆答出来的,所以大家都用它。</p><p>一对怎么来,配方如下。(1)从日志或目标分布里取一个提示 \\(x\\)。<em>带正温度送进 SFT 模型两次</em>,就得到两个不一样的回答 —— 也可以用合成输出,或让人把日志里的烂答案<strong>改写</strong>成好答案。(2)定谁赢,靠<strong>人类评分</strong>或者替身:<strong>LLM 当裁判(LLM-as-a-judge)</strong>(过几讲再细说),或 BLEU/ROUGE 这类基于规则的分(现在过气了)。尺度可以<strong>二元</strong>(更好或更差),也可以分级(好很多、略好,等等)。很多任务主观,大家通常落到二元。讲者的提醒:人类评分好不好,全看你的标注指南 —— 指南含糊,标签就吵。</p>"
        },
        {
          "name": "RL formulation & the RLHF pipeline",
          "nameZh": "RL 形式化与 RLHF 流程",
          "body": "<p>To turn preferences into training, borrow the machinery of <strong>reinforcement learning</strong>. An agent sits in a state \\(s_t\\), takes an action \\(a_t\\) under a policy \\(\\pi_\\theta(a_t \\mid s_t)\\), and collects a reward. Now map that onto an LLM and every piece has a home: the <strong>agent is the LLM</strong>, the <strong>state is the input so far</strong>, the <strong>action is the next token</strong>, the <strong>environment is the vocabulary</strong>, and the <strong>policy is the next-token distribution</strong> that falls out of the forward pass. We want to learn \\(\\theta\\) so \\(\\pi_\\theta\\) lines up with what people prefer.</p><p><strong>RLHF</strong> (Reinforcement Learning from Human Feedback) runs in two stages. (1) <strong>Reward modeling</strong>: feed in (prompt, response), read out a scalar that separates good from bad. (2) <strong>RL</strong>: feed in a prompt, generate a response that scores higher. The <em>human feedback</em> in the name is just the labels the reward model learned from — swap in a model to give those labels and you have <strong>RLAIF</strong> (AI feedback). One thing to keep in the back of your mind: RLHF gives a <em>sparse</em> signal. Roughly one reward for an entire completion, not one per token the way SFT trains.</p>",
          "bodyZh": "<p>要把偏好变成训练,就借<strong>强化学习(RL)</strong>这套东西。一个智能体处在状态 \\(s_t\\),按策略 \\(\\pi_\\theta(a_t \\mid s_t)\\) 做动作 \\(a_t\\),拿到奖励。把它套到 LLM 上,每个零件都对得上:<strong>智能体就是 LLM</strong>,<strong>状态是目前的输入</strong>,<strong>动作是下一个词元</strong>,<strong>环境是词表</strong>,<strong>策略是前向算出的下一词元分布</strong>。我们要学的是 \\(\\theta\\),让 \\(\\pi_\\theta\\) 对上人的偏好。</p><p><strong>RLHF</strong>(基于人类反馈的强化学习)分两步走。(1)<strong>奖励建模</strong>:喂进(提示,回答),读出一个分好坏的标量。(2)<strong>RL</strong>:喂进提示,生成一个分数更高的回答。名字里的<em>人类反馈</em>,指的就是奖励模型学的那些标签 —— 换成模型来给标签,就成了 <strong>RLAIF</strong>(AI 反馈)。心里记一件事:RLHF 的信号是<em>稀疏</em>的。差不多一整条完成才给一个奖励,而不是像 SFT 那样每个词元一个。</p>"
        },
        {
          "name": "Reward modeling (Bradley–Terry)",
          "nameZh": "奖励建模(Bradley–Terry)",
          "body": "<p>Stage one builds a model \\(r\\) that scores a (prompt, response). The <strong>Bradley–Terry</strong> formula sets the probability that \\(y_i\\) beats \\(y_j\\) to</p>\\[ P(y_i \\succ y_j) = \\frac{e^{r_i}}{e^{r_i}+e^{r_j}} = \\sigma\\big(r_i - r_j\\big), \\]<p>where \\(\\sigma\\) is the sigmoid. So when \\(i\\) is the better answer, push \\(r_i\\) up and \\(r_j\\) down. The instructor builds the loss from scratch. Assume the pairs are independent, so the chance of seeing all of them is the product \\(\\prod \\sigma(r_w - r_l)\\). Maximize that. Products of small numbers underflow, so take the log. ML likes to minimize, so flip the sign:</p>\\[ \\mathcal{L} = -\\,\\mathbb{E}_{(x,y_w,y_l)}\\Big[\\log \\sigma\\big(r(x,y_w) - r(x,y_l)\\big)\\Big]. \\]<p>Now the twist. The loss is <em>pairwise</em>, but the reward model it produces is <strong>pointwise</strong>: hand it one (prompt, response) and it returns one number — a good teddy-bear answer scores 0.8, a bad one −2. You train on pairs; you serve on singles. Data is around \\(O(10{,}000)\\) human-labeled pairs. The model is usually a decoder-only LLM with a classification head, or BERT read off the [CLS] token. Scores get normalized per batch; <strong>RewardBench</strong> grades models like these. And reward is always reward <em>along a dimension</em> — helpful, safe, friendly.</p>",
          "bodyZh": "<p>第一步建一个给(提示,回答)打分的模型 \\(r\\)。<strong>Bradley–Terry</strong> 公式把 \\(y_i\\) 胜过 \\(y_j\\) 的概率定为:</p>\\[ P(y_i \\succ y_j) = \\frac{e^{r_i}}{e^{r_i}+e^{r_j}} = \\sigma\\big(r_i - r_j\\big), \\]<p>其中 \\(\\sigma\\) 是 sigmoid。所以 \\(i\\) 是更好的那个时,就把 \\(r_i\\) 顶上去、\\(r_j\\) 压下来。讲者把损失从头搭起来。假设各对相互独立,那么看到全部这些对的概率就是乘积 \\(\\prod \\sigma(r_w - r_l)\\)。把它最大化。小数连乘会下溢,那就取对数。机器学习习惯最小化,那就翻个负号:</p>\\[ \\mathcal{L} = -\\,\\mathbb{E}_{(x,y_w,y_l)}\\Big[\\log \\sigma\\big(r(x,y_w) - r(x,y_l)\\big)\\Big]. \\]<p>转折来了。损失是<em>成对</em>的,可它训出来的奖励模型是<strong>逐点</strong>的:递给它一个(提示,回答),它吐回一个数 —— 好的泰迪熊答案打 0.8,差的打 −2。训练用成对,上线用单个。数据大约 \\(O(10{,}000)\\) 个人工标注对。模型一般是带分类头的仅解码器 LLM,或者从 [CLS] 词元读出的 BERT。分数按批归一化;<strong>RewardBench</strong> 就是给这类模型打分的。还有,奖励永远是<em>沿某个维度</em>的奖励 —— 有用、安全、友好。</p>"
        },
        {
          "name": "RL with PPO",
          "nameZh": "用 PPO 做强化学习",
          "body": "<p>Stage two tunes the policy (the LLM, started from SFT) against the <em>frozen</em> reward model over \\(O(100{,}000)\\) prompts. The objective <strong>chases reward but stays close to the base model</strong>, held there by a KL term. Why the leash? Three reasons: keep the model from catastrophically forgetting what it knew, keep it from <strong>reward hacking</strong> a reward model that is never perfect, and keep training from blowing up. The instructor's picture for reward hacking: a lecturer who optimizes for loud applause instead of teaching well just starts telling jokes — the proxy goes up, the real goal does not.</p><p>One more wrinkle. PPO does not maximize raw reward; it maximizes <strong>advantage</strong> (\\(\\approx\\) reward − baseline), which cuts variance and steadies training. The baseline comes from a <strong>value function</strong>: a token-level head trained alongside the policy that, given a partial generation, predicts the reward you would end up with if you kept generating under the policy (estimated with GAE). <strong>PPO-Clip</strong> caps how far one update can move:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon)\\,A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\text{old}}(a_t \\mid s_t)}. \\]<p>Read \\(\\rho_t\\) as a probability <em>ratio</em>, not a reward, and <em>old</em> as the previous RL iteration — not the SFT model. When the advantage is positive, push the token's probability up, but the clip stops you from shoving it too far; when it is negative, push it down, again only so far. The <strong>KL-penalty</strong> variant swaps the clip for \\(\\rho_t A_t - \\beta\\,\\mathrm{KL}\\) against the reference. Either way, PPO juggles four models at once — policy, value, reward, base.</p>",
          "bodyZh": "<p>第二步拿<em>冻结</em>的奖励模型,在 \\(O(100{,}000)\\) 条提示上微调策略(那个 LLM,从 SFT 起步)。目标是<strong>追奖励,但贴着基座模型不走远</strong>,靠一个 KL 项拴住。为什么要拴?三个理由:别让模型把学过的东西灾难性地忘掉,别让它去钻一个永远不完美的奖励模型的空子 —— <strong>奖励黑客(reward hacking)</strong>,还有别让训练炸掉。讲者给奖励黑客画的画面:一个讲师不好好讲课,只盯着掌声大不大,那他干脆开始讲笑话 —— 代理指标涨了,真正的目标没达成。</p><p>还有一道弯。PPO 最大化的不是原始奖励,是<strong>优势(advantage)</strong>(\\(\\approx\\) 奖励 − 基线),这样能砍方差、稳训练。基线来自<strong>价值函数</strong>:一个跟策略一起训的词元级头,给它一段没写完的生成,它预测你按策略接着写下去最终能拿到多少奖励(用 GAE 估)。<strong>PPO-Clip</strong> 给一次更新能走多远封了个顶:</p>\\[ \\mathcal{L}^{\\text{CLIP}} = \\mathbb{E}\\big[\\min(\\rho_t A_t,\\ \\text{clip}(\\rho_t, 1-\\epsilon, 1+\\epsilon)\\,A_t)\\big], \\quad \\rho_t = \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\text{old}}(a_t \\mid s_t)}. \\]<p>\\(\\rho_t\\) 要读成概率<em>比率</em>,不是奖励;<em>old</em> 是上一轮 RL 迭代 —— 不是 SFT 模型。优势为正,就把这个词元的概率往上推,但裁剪不让你推过头;优势为负,就往下压,同样只压到一定程度。<strong>KL 惩罚</strong>变体把裁剪换成 \\(\\rho_t A_t - \\beta\\,\\mathrm{KL}\\),对参考模型做约束。不管哪种,PPO 都得同时耍四个模型 —— 策略、价值、奖励、基座。</p>"
        },
        {
          "name": "Best-of-N & challenges of RL",
          "nameZh": "Best-of-N 与 RL 的挑战",
          "body": "<p>RL has a long list of sore spots. It is a brittle <strong>two-stage</strong> chain: find a flaw in the reward model and you redo the whole thing. It has a pile of <strong>hyperparameters</strong> (\\(\\beta\\), \\(\\epsilon\\), the GAE knobs). It is <strong>unstable</strong>. It has no clean training metric — all you can watch is average reward, which is nothing like the cross-entropy curve you trusted in pretraining and SFT. And it needs <strong>diversity</strong> in its completions, or the model never explores enough to learn what is good. It is also <strong>on-policy</strong>: the model trains on samples it generated itself, unlike SFT, which learns off-policy from outside data. Lighter alternatives like <strong>REINFORCE</strong> and <strong>GRPO</strong> (next lecture) drop some of the machinery.</p><p>Got a reward model but want to skip RL entirely? Use <strong>Best-of-N (BoN)</strong>. Take the frozen SFT model, sample N completions, score each with the reward model, return the top one. For the teddy-bear prompt the three samples score 0.8, −2, 0.2 — so you ship the 0.8 answer. The cost does not vanish; it moves to <strong>inference</strong>, N forward passes per query, which hurts under real traffic. And here is the catch that survives even infinite parallel compute: your latency is now the <em>max</em> over N samples, and the max of N draws shifts right, so you wait longer than a single pass no matter how many machines you own.</p>",
          "bodyZh": "<p>RL 的痛处一长串。它是条脆弱的<strong>两阶段</strong>链:奖励模型里挑出一个毛病,你就得整条重来。它有一堆<strong>超参数</strong>(\\(\\beta\\)、\\(\\epsilon\\)、GAE 那几个旋钮)。它<strong>不稳定</strong>。它没有干净的训练指标 —— 你只能盯着平均奖励,这跟预训练和 SFT 里你信得过的交叉熵曲线完全两回事。它还得让完成有<strong>多样性</strong>,不然模型探不开,学不到什么是好。它又是<strong>同策略(on-policy)</strong>的:模型在自己生成的样本上训,不像 SFT 在外部数据上做异策略(off-policy)学习。更轻的替代品像 <strong>REINFORCE</strong> 和 <strong>GRPO</strong>(下一讲)砍掉了一部分机制。</p><p>已经有奖励模型,又想彻底绕过 RL?用 <strong>Best-of-N(BoN)</strong>。拿冻结的 SFT 模型采 N 个完成,用奖励模型各打一分,把最高的那个返回。对泰迪熊提示,三个样本打 0.8、−2、0.2 —— 那就发 0.8 的那个。代价没消失,它挪到了<strong>推理期</strong>,每个查询 N 次前向,真上了流量就疼。还有个就算给你无限并行算力也躲不掉的坑:现在延迟是 N 个样本里的<em>最大值</em>,而 N 次抽样的最大值会往右偏,所以不管你有多少台机器,都比单次前向等得久。</p>"
        },
        {
          "name": "DPO: Direct Preference Optimization",
          "nameZh": "DPO:直接偏好优化",
          "body": "<p>The question kept coming up all lecture — why not just supervise this? <strong>DPO</strong> is the answer. It collapses alignment into a single loss with <strong>no reward model and no RL loop</strong>. Watch it fall out in five steps. Start from the PPO objective. Solve for the optimal policy \\(\\pi^*\\) — a closed form involving the reward and a partition function \\(Z\\) that only normalizes, nothing new. Rearrange to write the <strong>reward as a function of the policy</strong>. Plug that into Bradley–Terry. Turn the resulting probability into a loss:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)}\\Big)\\Big]. \\]<p>No \\(r(x,y)\\) anywhere — that is the whole point of the title, <em>Your Language Model is Secretly a Reward Model</em>. The loss just raises the reference-normalized probability of \\(y_w\\) and lowers \\(y_l\\)'s, with \\(\\beta \\approx 0.1\\) playing the same KL role it played in PPO. You carry <strong>two models</strong>, not four — the trained \\(\\pi_\\theta\\) and the frozen \\(\\pi_{\\text{ref}}\\). The trade-off (Xu et al. 2024): tuned by an expert, RLHF/PPO still scores higher, but DPO is far simpler to run; its weak spot is a <strong>distribution shift</strong>, since it fits data the model never generated. For the washer prompt, DPO turns a blunt <em>No, it might get damaged</em> into a gentle <em>It is better not to — your teddy could get hurt; a gentle hand wash is safer</em>. Same facts, kinder voice. Variants include IPO, KTO, and ORPO.</p>",
          "bodyZh": "<p>这个问题整堂课冒了一遍又一遍 —— 为什么不直接监督算了?<strong>DPO</strong> 就是答案。它把对齐压成一个损失,<strong>不要奖励模型,不要 RL 循环</strong>。看它分五步落地。从 PPO 目标出发。解出最优策略 \\(\\pi^*\\) —— 一个含奖励和只管归一化的配分函数 \\(Z\\) 的闭式,没引入新东西。重排,把<strong>奖励写成策略的函数</strong>。代进 Bradley–Terry。把得到的概率变成损失:</p>\\[ \\mathcal{L}_{\\text{DPO}} = -\\,\\mathbb{E}\\Big[\\log \\sigma\\Big(\\beta \\log \\tfrac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\text{ref}}(y_w \\mid x)} - \\beta \\log \\tfrac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\text{ref}}(y_l \\mid x)}\\Big)\\Big]. \\]<p>从头到尾没有 \\(r(x,y)\\) —— 这正是那篇论文标题的意思,<em>你的语言模型其实暗中是个奖励模型</em>。这个损失只是抬高(对参考归一化后)\\(y_w\\) 的概率、压低 \\(y_l\\) 的,其中 \\(\\beta \\approx 0.1\\),扮的还是它在 PPO 里那个 KL 的角色。你带<strong>两个模型</strong>,不是四个 —— 被训的 \\(\\pi_\\theta\\) 和冻结的 \\(\\pi_{\\text{ref}}\\)。权衡(Xu 等,2024):让专家调好,RLHF/PPO 分还是更高,可 DPO 跑起来简单太多;它的软肋是<strong>分布偏移</strong>,因为它拟合的是模型自己没生成过的数据。对洗衣机提示,DPO 把生硬的<em>不行,可能会损坏</em>,变成温和的<em>最好别 —— 你的泰迪可能会受伤;轻柔手洗更安全</em>。事实一样,口气软了。变体有 IPO、KTO、ORPO。</p>"
        }
      ],
      "takeaways": [
        "Likelihood is the wrong target. People pick the better of two answers far more reliably than they grade one, so we train on preference pairs where a winner beats a loser.",
        "Preference tuning adds the negative signal SFT cannot give. But if the model misbehaves constantly, suspect the SFT data first.",
        "RLHF = SFT, then a reward model (Bradley-Terry pairwise loss, pointwise at serving time), then RL that chases reward on a KL leash to the reference.",
        "The KL leash blocks reward hacking (the lecturer who tells jokes for applause), forgetting, and instability; PPO clips the policy ratio and juggles four models.",
        "Best-of-N skips RL by sampling N and keeping the top-scored answer, but it pushes the whole cost onto inference.",
        "DPO drops the RL loop: a five-step derivation folds the reward into the policy, leaving one classification loss on pairs and only two models to carry."
      ],
      "takeawaysZh": [
        "似然是错的目标。给人两个答案让他挑更好的,比让他给一个答案打分靠谱得多,所以我们在偏好对上训练 —— 胜者压过败者。",
        "偏好微调补上了 SFT 给不了的负向信号。但模型要是老出错,先怀疑 SFT 数据。",
        "RLHF = SFT,再来奖励模型(Bradley-Terry 成对损失,上线时逐点),再来用一根拴向参考模型的 KL 绳子去追奖励的 RL。",
        "这根 KL 绳子挡住奖励黑客(那个为掌声讲笑话的讲师)、遗忘和不稳定;PPO 裁剪策略比率,还要同时耍四个模型。",
        "Best-of-N 靠采 N 个、留得分最高的那个来绕开 RL,可它把全部代价压到了推理上。",
        "DPO 扔掉 RL 循环:五步推导把奖励叠进策略里,只剩偏好对上的一个分类损失,只用带两个模型。"
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
          "tZh": "成对比较法的不完全区组设计秩分析 —— 奖励建模所用 Bradley–Terry 公式的出处(原名 Rank Analysis of Incomplete Block Designs, 1952)"
        },
        {
          "t": "Proximal Policy Optimization Algorithms — PPO (Schulman et al., 2017)",
          "u": "https://arxiv.org/abs/1707.06347",
          "tZh": "近端策略优化算法 —— PPO,RLHF 默认的 RL 算法,含裁剪与 KL 惩罚两种目标(原名 Proximal Policy Optimization Algorithms, 2017)"
        },
        {
          "t": "High-Dimensional Continuous Control Using Generalized Advantage Estimation — GAE (Schulman et al., 2015)",
          "u": "https://arxiv.org/abs/1506.02438",
          "tZh": "用广义优势估计做高维连续控制 —— PPO 估优势所用的 GAE 方法(原名 High-Dimensional Continuous Control Using GAE, 2015)"
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
          "tZh": "在大模型对齐上 DPO 真比 PPO 强吗?一项全面研究 —— DPO 与 PPO 的取舍对比(原名 Is DPO Superior to PPO for LLM Alignment?, 2024)"
        },
        {
          "t": "DeepSeekMath: Pushing the Limits of Mathematical Reasoning — introduces GRPO (Shao et al., 2024)",
          "u": "https://arxiv.org/abs/2402.03300",
          "tZh": "DeepSeekMath:推进数学推理的极限 —— 提出 GRPO,作为 PPO 替代方案的预告(原名 DeepSeekMath, 2024)"
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
      "tagline": "Spend compute to think. Train long chains of thought with RL, and let a verifier — not a human — say if the answer is right.",
      "taglineZh": "花算力去「想」。用可验证奖励的强化学习训练出长思维链,让验证器、而不是人,来判定答案对不对。",
      "overview": "<p>This is the 2024–25 jump. A <em>vanilla</em> LLM reads a prompt and writes an answer. A <strong>reasoning model</strong> writes a chain of thought first, then the answer — output becomes <em>reasoning + answer</em>. The lecture builds it in slide order: what a reasoning model is and how to spot one in a chat UI; the benchmarks and the <strong>pass@k</strong> metric that score them; why we reach for <strong>RL with verifiable rewards</strong> instead of SFT; <strong>GRPO</strong>, which throws out PPO's value network; the <em>ever-growing output</em> problem GRPO can cause, and how DAPO and Dr. GRPO patch it; and how DeepSeek wired the whole thing into <strong>R1-Zero</strong> and <strong>R1</strong>. One idea runs through all of it: reasoning is a behavior you train, and every extra token the model writes is extra compute spent — a new place to scale, this time at inference.</p>",
      "overviewZh": "<p>这是 2024–25 年的那一跳。<em>朴素(vanilla)</em>大模型读一个提示,写一个答案。<strong>推理模型</strong>先写一段思维链,再写答案 —— 输出变成了<em>推理 + 答案</em>。本讲沿幻灯片顺序往下走:推理模型是什么、怎样在聊天界面里一眼认出它;给它们打分的基准和 <strong>pass@k</strong> 指标;为什么不用 SFT 而要上<strong>可验证奖励的强化学习(RL)</strong>;<strong>GRPO</strong> 怎样扔掉了 PPO 的价值网络;GRPO 会引出的<em>输出越写越长</em>的毛病,以及 DAPO 和 Dr. GRPO 怎么补;最后是 DeepSeek 怎样把这一切接成 <strong>R1-Zero</strong> 和 <strong>R1</strong>。一条线贯穿全篇:推理是训出来的行为,模型每多写一个词元,就多花一份算力 —— 一条新的扩展轴,这一次落在推理这一端。</p>",
      "topics": [
        {
          "name": "Reasoning models: chain of thought at scale",
          "nameZh": "推理模型:大规模的思维链",
          "body": "<p>Start with two questions. <code>What is the course code of Stanford's Transformers and LLMs class?</code> — you either know it (CME 295) or you do not; that is recall. <code>A bear was born in 2020, how old is it in 2025?</code> — nobody memorized that; you subtract. The instructor's working definition of <strong>reasoning</strong> is the second kind: solving a problem in steps, the way you break down an exam question instead of blurting an answer.</p><p>The trick is old. <strong>Chain-of-thought (CoT)</strong> prompting (Wei et al., 2022) showed that if you make the model write its steps, it does better. Reasoning models take that and crank up the scale. Instead of <code>Question → Answer</code>, the model writes <code>Question → reasoning chain → Answer</code>, so the output is <strong>reasoning + answer</strong>. Why does writing more help? A hard problem almost never showed up word-for-word in training, so the model chops it into smaller pieces it <em>has</em> seen — the same move you make linking a new problem back to one you studied. And there is a second, blunter reason: every token is one forward pass, so more tokens means more compute. People call that the <strong>compute budget</strong>.</p><p>Want to know if you are talking to a reasoning model? Look for the word <em>thinking</em> in the UI. But what it shows you is a <em>thought summary</em>, not the raw chain. Providers hide the raw chain for three reasons: it can be hard to read, you do not want pages of it, and a competitor could train on it. One catch for your wallet — those reasoning tokens bill as output tokens.</p>",
          "bodyZh": "<p>先看两个问题。<code>斯坦福 Transformers 与大模型课程的课程代码是什么?</code>—— 你要么知道(CME 295),要么不知道,这是记忆。<code>一只熊出生于 2020 年,到 2025 年它几岁?</code>—— 没人背过这个,你得去减。讲师对<strong>推理</strong>的临时定义就是后一种:分步解题,像把一道考题拆开来做,而不是张口就答。</p><p>这套路子并不新。<strong>思维链(chain-of-thought, CoT)</strong>提示(Wei 等,2022)早就发现:逼模型把步骤写出来,它就答得更好。推理模型把这一招放大到很大的规模。不再是<code>问题 → 答案</code>,而是让模型写<code>问题 → 思维链 → 答案</code>,于是输出成了<strong>推理 + 答案</strong>。多写为什么有用?难题几乎不会原样出现在训练里,模型只好把它切成自己<em>见过</em>的小块 —— 就像你把一道新题挂回学过的某道题上。还有个更直白的理由:每个词元就是一次前向,词元越多,算力越多。人们管这叫<strong>算力预算(compute budget)</strong>。</p><p>想知道对面是不是推理模型?看界面里有没有<em>thinking(思考)</em>这个词。可它给你看的是<em>思维摘要(thought summary)</em>,不是原始思维链。厂商把原始链藏起来,有三个理由:它可能难读、你不想看好几页、对手能拿它去训练。还有一处关系到钱包 —— 这些推理词元是按输出词元收费的。</p>"
        },
        {
          "name": "Benchmarks and the pass@k metric",
          "nameZh": "基准与 pass@k 指标",
          "body": "<p>Two families of benchmarks rule this space, and both share one virtue: a machine can check the answer. <strong>Coding</strong> — write code that passes every test case, and you are done; HumanEval (~164 hand-written problems), CodeForces (competitive programming), SWE-bench (real GitHub issues). <strong>Math</strong> — make the model put its answer in a box, parse it out, compare to ground truth; AIME (the US Math Olympiad qualifier) and GSM8K (grade school).</p><p>The number everyone reports is <strong>pass@k</strong>: the chance that at least one of \\(k\\) tries gets it right. Score it from just \\(k\\) samples and the estimate jumps around. So draw more — \\(n\\) samples, count \\(c\\) correct — then ask: if I pick \\(k\\) out of these \\(n\\), what is the chance at least one passes? Flip it to one-minus-all-wrong, sample without replacement, and the formula falls out:</p>\\[ \\text{pass@}k = 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}}. \\]<p>Set \\(k{=}1\\) and it collapses to the fraction correct — that is <strong>pass@1</strong>. Pass@k is lecture 5's best-of-\\(n\\) wearing new clothes: same idea, but a deterministic verifier replaces the reward model. Now <strong>temperature</strong>. At \\(t{=}0\\) every sample is the same good answer, so drawing more buys you nothing — the curve stays flat. Nudge it up and diversity helps. Push too far (say \\(t{=}1.2\\)) and quality falls apart, because tokens that should be rare start showing up. That is why papers always state the temperature. You will also see <strong>cons@k</strong> — take the majority answer, the consensus — which is self-consistency by another name.</p>",
          "bodyZh": "<p>两大基准家族占着这块地盘,它们有个共同的好处:机器能判对错。<strong>编程</strong> —— 写出能过每一个测试用例的代码,就算赢;HumanEval(约 164 道手写题)、CodeForces(竞赛编程)、SWE-bench(真实 GitHub issue)。<strong>数学</strong> —— 让模型把答案放进一个方框,解析出来,再和标准答案比;AIME(美国数学奥赛资格赛)和 GSM8K(小学水平)。</p><p>人人都报的那个数是 <strong>pass@k</strong>:\\(k\\) 次尝试里至少一次答对的概率。只用 \\(k\\) 个样本去估它,数字会乱跳。那就多抽点 —— 抽 \\(n\\) 个样本,数出 \\(c\\) 个对的 —— 再问:从这 \\(n\\) 个里挑 \\(k\\) 个,至少一个通过的概率是多少?把它翻成「1 减去全错」,无放回地抽,公式就出来了:</p>\\[ \\text{pass@}k = 1 - \\frac{\\binom{n-c}{k}}{\\binom{n}{k}}. \\]<p>令 \\(k{=}1\\),它就塌成正确比例 —— 这就是 <strong>pass@1</strong>。pass@k 是第 5 讲 best-of-\\(n\\) 换了身衣裳:想法一样,只是把奖励模型换成了确定性的验证器。再说<strong>温度</strong>。\\(t{=}0\\) 时每个样本都是同一个好答案,多抽也白抽 —— 曲线是平的。往上推一点,多样性帮了忙。推过头(比如 \\(t{=}1.2\\)),质量就垮了,因为本该罕见的词元开始冒头。所以论文总会写明温度。你还会看到 <strong>cons@k</strong> —— 取出现最多的那个答案,即共识 —— 它就是自洽性(self-consistency)的另一个名字。</p>"
        },
        {
          "name": "RL with verifiable rewards (and controlling the thinking)",
          "nameZh": "可验证奖励的强化学习(以及控制思考量)",
          "body": "<p>We want long reasoning chains, and we want them at scale. SFT will not get us there. Writing long chains by hand is brutal work, and even if you did it, you would pin the model to <em>human</em> reasoning — but the model may reason in ways we never would. Here is the opening, though: reasoning tasks come with a <strong>verifiable reward</strong> baked in. Did it solve the problem? Yes or no. So skip SFT and run RL.</p><p>The recipe needs only two rewards, and neither needs a model to compute. <strong>Reward 1, formatting:</strong> did the chain show up? Check for <code>&lt;think&gt;...&lt;/think&gt;</code> tags. <strong>Reward 2, accuracy:</strong> did the answer work? Run the test cases for code, match the parsed answer to ground truth for math. Add them: <em>reward = formatting + accuracy</em>. Train on nothing but these, plot AIME accuracy against RL steps, and the line climbs and keeps climbing — that is the DeepSeek-R1-Zero curve.</p><p>Not every prompt deserves the same amount of thinking, so a lot of work tries to dial it. A <strong>dynamic budget</strong> runs a quick classifier to flag a prompt as high- or low-thinking. <strong>Context awareness</strong> keeps the chain inside the context window. And <strong>budget forcing</strong> (s1, Muennighoff et al., 2025) reaches in mid-stream: drop in a token like <code>Wait</code> and the model thinks more; drop in <code>Time is up, my answer is</code> and it stops. A different line drops language entirely — <strong>continuous thoughts</strong> (Hao et al., 2024) think in compressed latent vectors instead of words.</p>",
          "bodyZh": "<p>我们要长思维链,而且要大规模地要。SFT 给不了。手写长链是苦活,就算写出来,也把模型钉死在<em>人类</em>的推理上 —— 可模型的推理方式也许是我们想都想不到的。但有个突破口:推理任务自带一个<strong>可验证奖励</strong>。它解出问题了吗?是,或否。那就跳过 SFT,直接上 RL。</p><p>配方只要两个奖励,而且算哪个都不用另搭模型。<strong>奖励 1,格式:</strong>思维链出现了吗?查 <code>&lt;think&gt;...&lt;/think&gt;</code> 标签。<strong>奖励 2,正确性:</strong>答案管用吗?代码就跑测试用例,数学就把解析出的答案和标准答案比。两个相加:<em>奖励 = 格式 + 正确性</em>。只拿这两项去训,把 AIME 准确率对着 RL 步数画出来,那条线往上爬,而且一直爬 —— 这就是 DeepSeek-R1-Zero 的曲线。</p><p>不是每个提示都配得上同样多的思考,于是一大堆工作在调这个量。<strong>动态预算(dynamic budget)</strong>跑一个快速分类器,把提示标成高思考或低思考。<strong>上下文感知</strong>让思维链待在上下文窗口里别溢出。还有<strong>预算强制(budget forcing)</strong>(s1,Muennighoff 等,2025)直接半路插手:塞个 <code>Wait</code> 进去,模型就多想;塞个 <code>时间到了,我的答案是</code>,它就收尾。另一条路干脆不用语言 —— <strong>连续思维(continuous thoughts)</strong>(Hao 等,2024)在压缩的隐空间向量里想,而不在词里想。</p>"
        },
        {
          "name": "GRPO: group-relative advantage, no value net",
          "nameZh": "GRPO:组相对优势,无价值网络",
          "body": "<p><strong>GRPO (Group Relative Policy Optimization)</strong> (Shao et al., DeepSeekMath, 2024) is the algorithm everyone reaches for to train reasoning. It chases the same two goals as PPO — push up the advantages, and do not drift too far from the old model or the base model. The split is in <em>how it gets the advantage</em>. PPO trains a separate <strong>value function</strong> alongside the policy and runs it through Generalized Advantage Estimation. That critic is the bottleneck: a whole second model to train.</p><p>GRPO drops the critic. For one prompt it samples a <em>group</em> of \\(G\\) completions, scores each one, and grades every completion <em>against its own group</em> — reward minus the group mean, divided by the group standard deviation:</p>\\[ \\hat{A}_i = \\frac{r_i - \\operatorname{mean}(r_1,\\dots,r_G)}{\\operatorname{std}(r_1,\\dots,r_G)}. \\]<p>Think about what that does. A high reward on an easy problem is nothing special — most of the group nailed it too. But a correct answer on a hard problem, where the rest of the group flopped, should pull those tokens up hard. The group baseline bakes the difficulty right in. Two more differences from PPO. GRPO writes the <strong>KL term straight into the objective</strong>, while PPO usually folds KL into the per-token reward. And in the reasoning setting there is <em>no reward model at all</em> — the reward is a verifier — so GRPO trains <strong>only the policy</strong>, whereas PPO trains policy <em>and</em> value. The instructor calls this the hardest stretch of the whole class.</p>",
          "bodyZh": "<p><strong>GRPO(组相对策略优化,Group Relative Policy Optimization)</strong>(Shao 等,DeepSeekMath,2024)是训练推理时人人都伸手去拿的算法。它追的两个目标和 PPO 一样 —— 把优势顶上去,别离旧模型或基座模型太远。分岔在<em>怎样拿到优势</em>。PPO 要在策略旁边再训一个<strong>价值函数</strong>,经广义优势估计(GAE)送进去。那个评论家(critic)就是瓶颈:整整多出一个模型要训。</p><p>GRPO 把评论家扔了。对一个提示,它采样一<em>组</em> \\(G\\) 个补全,逐个打分,再让每个补全<em>跟自己这一组</em>比 —— 奖励减组内均值,除以组内标准差:</p>\\[ \\hat{A}_i = \\frac{r_i - \\operatorname{mean}(r_1,\\dots,r_G)}{\\operatorname{std}(r_1,\\dots,r_G)}. \\]<p>想想这是在干什么。简单题上拿高奖励不算什么 —— 组里别人也都做对了。可难题上的一个正确答案,组里其余全栽了,就该把那些词元狠狠往上拉。组基线把难度直接烘进去了。和 PPO 还有两处不同。GRPO 把 <strong>KL 项直接写进目标函数</strong>,PPO 通常把 KL 折进逐词元奖励。而在推理设定里<em>根本没有奖励模型</em> —— 奖励是个验证器 —— 所以 GRPO <strong>只训策略</strong>,PPO 则同时训策略<em>和</em>价值。讲师说,这是全课最难啃的一段。</p>"
        },
        {
          "name": "The increasing-length pathology and its fixes",
          "nameZh": "输出变长的病态及其修正",
          "body": "<p>Watch an RL run long enough and you see it: the average response keeps getting longer. Early on that is fine — longer chains, better scores, the two move together. Then the scores level off and the length keeps climbing anyway. Now you are paying for tokens that buy you nothing. The culprit is how GRPO normalizes each output. The objective sums over the group and over tokens, with a factor \\(\\tfrac{1}{|o_i|}\\) that depends only on which output a token lands in:</p>\\[ \\mathcal{J}_{\\text{GRPO}} \\sim \\sum_{i=1}^{G} \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\big(\\text{clipped ratio}\\times \\hat{A}_{i}\\big) - \\beta\\, \\mathbb{D}_{\\text{KL}}. \\]<p>So a token in a <em>short</em> output weighs more than the same token in a long one. Now flip the advantage negative: a <strong>short bad output gets punished harder than a long bad output</strong>. The model reads that signal and pads its mistakes — make the bad answer longer and the penalty softens. The fixes even out the token-level weight. <strong>DAPO</strong> (Yu et al., 2025) swaps in one normalizer shared across all tokens; <strong>Dr. GRPO</strong> (Liu et al., 2025) drops the factor outright. The payoff shows in the plot: correct answers keep their length, wrong answers shrink way down. The instructor flags two more knobs. The <strong>std in the advantage</strong> tilts things by difficulty — a hard prompt is almost all failures, so the std goes tiny and the advantage blows up. And <strong>asymmetric clipping epsilons</strong>: a very-low-probability token can only grow to \\(1+\\epsilon\\) times a tiny \\(\\pi_{\\text{old}}\\), so a symmetric \\(\\epsilon\\) stocks it in place — loosen the upper side to let diversity breathe.</p>",
          "bodyZh": "<p>RL 跑得够久,你就会撞见它:平均回答越来越长。早期这没问题 —— 链更长,分更高,两者一起涨。然后分数走平,长度却还在往上爬。这下你是在为白花花的词元掏钱。罪魁是 GRPO 怎样给每个输出做归一化。目标在组上和词元上求和,带一个只看词元落在哪个输出里的因子 \\(\\tfrac{1}{|o_i|}\\):</p>\\[ \\mathcal{J}_{\\text{GRPO}} \\sim \\sum_{i=1}^{G} \\frac{1}{|o_i|} \\sum_{t=1}^{|o_i|} \\big(\\text{裁剪后的比率}\\times \\hat{A}_{i}\\big) - \\beta\\, \\mathbb{D}_{\\text{KL}}. \\]<p>于是<em>短</em>输出里的一个词元,比同一个词元在长输出里更重。再把优势翻成负的:<strong>短的差输出被罚得比长的差输出更狠</strong>。模型读懂了这个信号,就给自己的错误注水 —— 把差答案拖长,罚就轻了。修正办法是把词元级的权重抹平。<strong>DAPO</strong>(Yu 等,2025)换上一个对所有词元通用的归一化因子;<strong>Dr. GRPO</strong>(Liu 等,2025)干脆把这因子去掉。好处在图上看得见:正确答案长度不变,错误答案大幅缩短。讲师还点出两个旋钮。<strong>优势里的标准差</strong>会按难度把秤压偏 —— 难题几乎全是失败,标准差就变得极小,优势随之炸开。还有<strong>非对称的裁剪 \\(\\epsilon\\)</strong>:一个概率极低的词元至多只能涨到 \\(1+\\epsilon\\) 乘以一个极小的 \\(\\pi_{\\text{old}}\\),对称的 \\(\\epsilon\\) 会把它卡死在原地 —— 把上界放松些,让多样性喘口气。</p>"
        },
        {
          "name": "Stitching it together: DeepSeek R1-Zero, R1, and distillation",
          "nameZh": "拼接全图:DeepSeek R1-Zero、R1 与蒸馏",
          "body": "<p>DeepSeek starts from <strong>V3-Base</strong>, a pretrained Mixture-of-Experts (~671B total, ~37B active, reusing the multi-head latent attention from V2). <strong>R1-Zero</strong> is the proof of concept, and it is almost reckless: take GRPO with verifiable rewards and run it <em>straight on the base model</em> — no SFT, none — using the now-famous <code>&lt;think&gt;...&lt;/think&gt; &lt;answer&gt;...&lt;/answer&gt;</code> template. The win: reasoning shows up with zero SFT. The catch: the chains read badly, with formatting glitches and <strong>language mixing</strong> — the model never got a clean signal to anchor on.</p><p><strong>R1</strong> is the 5-stage pipeline that cleans that up. (1) Pretrain V3-Base. (2) A <em>small</em> cold-start SFT on long chains that R1-Zero generated and humans rewrote into clean format. (3) GRPO with reward = formatting + accuracy + a <strong>language-consistency</strong> term — the share of tokens in the target language, to stop the mixing. (4) A <em>large</em> SFT mixing ~600k reasoning pairs with ~200k general pairs recycled from V3, about 3:1; the reasoning pairs come from <strong>rejection sampling</strong> the current R1 — generate, then keep the good ones using rules plus a V3 judge. (5) A final GRPO over both kinds of data: reasoning still scored on formatting + accuracy, non-reasoning adds <strong>helpfulness</strong> for what the user sees and <strong>harmlessness</strong> across the whole output, the think section included. The results: reasoning and non-reasoning models split into two clear clusters, and R1 lands right alongside the closed-source reasoning models.</p><p>Last, <strong>distillation</strong> — but not the soft-label, next-token-matching kind from lecture 2. Here R1 plays teacher: offline, it writes whole responses with the thinking tokens left in. Then you SFT a smaller model to copy those full sequences, start to finish. It holds its own against o1-mini, and at small scale this beats running RL from scratch — better mileage from the same compute.</p>",
          "bodyZh": "<p>DeepSeek 从 <strong>V3-Base</strong> 起步,一个预训练的混合专家(MoE,约 6710 亿总参、约 370 亿激活,复用了 V2 的多头潜在注意力 MLA)。<strong>R1-Zero</strong> 是概念验证,做法几乎是莽:拿可验证奖励的 GRPO,<em>直接怼在基座模型上</em> —— 不做 SFT,一点都不做 —— 用上那套如今出了名的模板 <code>&lt;think&gt;...&lt;/think&gt; &lt;answer&gt;...&lt;/answer&gt;</code>。赢在:零 SFT 也涌现出了推理。坑在:思维链读着别扭,格式出错,还<strong>语言混杂</strong> —— 模型从没拿到一个干净的信号去落脚。</p><p><strong>R1</strong> 就是把这收拾干净的五阶段流程。(1)预训练 V3-Base。(2)一次<em>小规模</em>冷启动 SFT,数据是 R1-Zero 生成、再由人改写成干净格式的长链。(3)GRPO,奖励 = 格式 + 正确性 + 一项<strong>语言一致性</strong> —— 目标语言词元的占比,用来止住混杂。(4)一次<em>大规模</em> SFT,把约 60 万条推理样本和约 20 万条从 V3 回收的通用样本混在一起,约 3:1;推理样本来自对当下的 R1 做<strong>拒绝采样(rejection sampling)</strong> —— 先生成,再用规则加 V3 裁判把好的留下。(5)最后一次 GRPO,两类数据一起上:推理仍按格式 + 正确性打分,非推理加上面向用户的<strong>有用性(helpfulness)</strong>,以及覆盖整段输出、连 think 部分也算在内的<strong>无害性(harmlessness)</strong>。结果是:推理与非推理模型裂成清清楚楚的两簇,而 R1 就落在闭源推理模型的旁边。</p><p>最后是<strong>蒸馏</strong> —— 但不是第 2 讲那种软标签、逐词元对分布的蒸馏。这里 R1 当老师:离线写出整段回答,思考词元都留着。然后你 SFT 一个更小的模型,让它从头到尾照抄这些完整序列。它跟 o1-mini 掰手腕不落下风,而且在小规模下,这比从零跑 RL 更划算 —— 同样的算力,跑得更远。</p>"
        }
      ],
      "takeaways": [
        "A reasoning model writes reasoning chain + answer. Reasoning is a trained behavior (CoT at scale), and more tokens means more compute spent at inference.",
        "Reasoning tasks carry a verifiable reward: formatting (think tokens present) + accuracy (tests pass / answer matches). No reward model needed.",
        "pass@k = 1 − C(n−c,k)/C(n,k) estimates the chance one of k tries succeeds; pass@1 is just the success fraction; temperature trades quality for diversity.",
        "GRPO drops PPO's value network and grades each completion against its group: advantage = (reward − group mean) / group std.",
        "GRPO's 1/|output| factor punishes short wrong answers harder, so the model pads its mistakes; DAPO and Dr. GRPO even it out or remove it, and wrong answers stop growing.",
        "DeepSeek R1-Zero is RL-only proof of concept; R1 is the 5-stage pipeline (cold-start SFT → GRPO → large SFT → GRPO); R1-Distill is a small model SFT'd on R1's full traces."
      ],
      "takeawaysZh": [
        "推理模型写的是「思维链 + 答案」。推理是训出来的行为(大规模 CoT),词元越多,推理期花的算力越多。",
        "推理任务自带可验证奖励:格式(有 think 词元)+ 正确性(测试通过 / 答案匹配)。不需要奖励模型。",
        "pass@k = 1 − C(n−c,k)/C(n,k) 估计 k 次尝试至少一次成功的概率;pass@1 就是成功比例;温度拿质量换多样性。",
        "GRPO 扔掉 PPO 的价值网络,让每个补全跟自己这一组比:优势 =(奖励 − 组均值)/ 组标准差。",
        "GRPO 的 1/|输出| 因子把短的错答案罚得更狠,模型于是给错误注水;DAPO 与 Dr. GRPO 把它抹平或去掉,错答案就不再越写越长。",
        "DeepSeek R1-Zero 是纯 RL 的概念验证;R1 是五阶段流程(冷启动 SFT → GRPO → 大规模 SFT → GRPO);R1-Distill 是在 R1 的完整轨迹上对小模型做 SFT。"
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
      "tagline": "Wire the model up to live knowledge and tools so it can look things up, take action, and loop until the job is done.",
      "taglineZh": "把模型接到实时知识和工具上,让它能查资料、动手做事,一圈圈循环到把活儿干完。",
      "overview": "<p>So far the model has worked alone. A prompt goes in, an answer comes out, and everything it knows froze on the day training stopped. This lecture (Afshine on RAG, Shervine on tools and agents) opens two doors to the outside world. <strong>Retrieval-augmented generation (RAG)</strong> grounds the answer in a knowledge base of plain documents. <strong>Tool / function calling</strong> hands the model structured APIs so it can pull live data or do something. <strong>Agents</strong> wrap those tool calls in a reasoning loop, and the standard recipe is <strong>ReAct</strong>: observe, plan, act, repeat. Along the way we cover sharper retrieval (hybrid search, reranking, HyDE), how to pick the right tool, the <strong>MCP</strong> and <strong>A2A</strong> standards, and the new ways things can go wrong once a model can act in the world.</p>",
      "overviewZh": "<p>到现在为止,模型一直在单干。提示进去,回答出来,它知道的一切都停在训练结束那一天。这一讲(Afshine 讲 RAG,Shervine 讲工具和智能体)给它开了两扇通往外部世界的门。<strong>检索增强生成(RAG)</strong>把回答落在一个由普通文档组成的知识库上。<strong>工具 / 函数调用(tool / function calling)</strong>把结构化 API 交到模型手里,让它能拉取实时数据、动手做事。<strong>智能体(agent)</strong>则把这些工具调用包进一个推理循环,标准做法叫 <strong>ReAct</strong>:观察、规划、行动,再来一遍。一路上我们还会讲更精的检索(混合检索、重排序、HyDE)、怎么挑对工具、<strong>MCP</strong> 和 <strong>A2A</strong> 标准,以及模型一旦能在世界里行动、会冒出哪些新的出错方式。</p>",
      "topics": [
        {
          "name": "Why we need RAG: the knowledge-cutoff problem",
          "nameZh": "为什么需要 RAG:知识截止问题",
          "body": "<p>A trained model only knows what was in its pretraining data. Ask it who won an election held last week and it answers wrong, or not at all. Every model card spells out the line: a <strong>knowledge cutoff</strong>. For GPT-5 it is September 30, 2024. Nothing after that date is in there.</p><p>So why not keep training on newer data? Two headaches. Push new facts into a model and you tend to break things elsewhere — that is <em>regression</em>. And if you have fine-tuned the model for several use cases, you would have to re-inject the knowledge into every one of them, which is a maintenance nightmare. People skip retraining for this reason.</p><p>Then why not paste everything after the cutoff straight into the prompt? Three problems. First, <strong>context is limited</strong> — even GPT-5 tops out at 400k tokens. One token is roughly four characters, so that is hundreds of pages, a thick book. Big, but not infinite. Second, the model <strong>gets lost in junk</strong>. The <em>needle-in-a-haystack</em> test (Kamradt, 2023) buried one fact in a long prompt and asked GPT-4 to find it; once the prompt got long enough the model missed it, worst of all when the fact sat in the first half. Third, you <strong>pay by the token</strong> — on the order of a dollar per million tokens, which piles up fast across every call. The way out: find the <em>relevant</em> pieces and put only those in the prompt.</p>",
          "bodyZh": "<p>训练好的模型只知道预训练数据里有的东西。问它上周那场选举谁赢了,它要么答错,要么干脆答不上来。每张模型卡都写明了那条线:<strong>知识截止(knowledge cutoff)</strong>。GPT-5 是 2024 年 9 月 30 日。这天之后的一切,它都没有。</p><p>那为什么不接着拿新数据训练?两个头疼的地方。往模型里塞新事实,往往会把别处弄坏 —— 这就是<em>退化(regression)</em>。而且要是你为好几个用例分别微调过模型,就得给每一个都重新注入知识,维护起来是场噩梦。人们因此干脆不靠重训来加知识。</p><p>那为什么不把截止日期之后的东西全贴进提示?三个问题。第一,<strong>上下文有限</strong> —— 就连 GPT-5 也只到 40 万词元。一个词元大约四个字符,那是几百页,一本厚书。不少,但不是无限。第二,模型会<strong>淹没在废料里</strong>。大海捞针(needle-in-a-haystack,Kamradt,2023)这个测试把一条事实埋进长提示,让 GPT-4 去找;提示一长它就找不着,最糟的是当这条事实落在前半段时。第三,你要<strong>按词元付钱</strong> —— 量级约为每百万词元一美元,每次调用都摊上,加起来很快。出路是:找出<em>相关</em>的片段,只把这些放进提示。</p>"
        },
        {
          "name": "RAG: Retrieve, Augment, Generate",
          "nameZh": "RAG:检索、增强、生成",
          "body": "<p>The model's knowledge is frozen on the day training stopped. RAG fixes that: look things up first, then answer from what you found. <strong>RAG</strong> (Lewis et al., 2020) does it in three moves. <strong>Retrieve</strong> the relevant documents from a knowledge base with a similarity search. <strong>Augment</strong> the prompt by pasting that retrieved text in. <strong>Generate</strong> the answer with the model. For the election question, the prompt quietly becomes <em>who won this election, by the way it was held on... and the winner was...</em> — you are handing the model the answer.</p><p>The <strong>knowledge base</strong> gets built ahead of time. Collect the documents worth keeping. Cut each one into <strong>chunks</strong> — a slice of a document, capped at a few hundred tokens. Embed each chunk into a vector and store it in a vector database. Three knobs to set. <strong>Embedding size</strong> sits in the low thousands, say around 1500: bigger catches more nuance but costs more space and compute. <strong>Chunk size</strong> runs about 500 tokens: too small and the text loses its context, too large and the embedding blurs everything together. And <strong>overlap</strong> between neighboring chunks, in the low hundreds of tokens, so context carries across the cut. Bad retrieval means a bad answer, so the whole game is getting retrieval right.</p>",
          "bodyZh": "<p>模型的知识停在训练那天。RAG 的办法很直接:先查资料,再照着查到的内容回答。<strong>RAG</strong>(Lewis 等,2020)分三步走。用相似度搜索从知识库里<strong>检索(Retrieve)</strong>出相关文档。把检索到的文字贴进去<strong>增强(Augment)</strong>提示。再让模型<strong>生成(Generate)</strong>回答。回到选举那个问题,提示悄悄变成了<em>「谁赢了这场选举,顺带一提,它于……举行,赢家是……」</em> —— 等于把答案递到了模型手上。</p><p><strong>知识库</strong>是提前搭好的。先收集值得留的文档。把每篇切成<strong>块(chunk)</strong> —— 文档的一片,上限是几百词元。把每块嵌成一个向量,存进向量数据库。三个旋钮要拧。<strong>嵌入维度</strong>在一千多,比如 1500 上下:越大捕捉的细节越多,但也更费空间和算力。<strong>块大小</strong>大约 500 词元:太小,文字就脱了上下文;太大,嵌入又把什么都糊到一起。还有相邻块之间的<strong>重叠(overlap)</strong>,低几百词元,好让上下文跨过切口接上。检索差,答案就差,所以整件事的关键就是把检索做对。</p>"
        },
        {
          "name": "Candidate retrieval: embeddings, cosine similarity, BM25",
          "nameZh": "候选检索:嵌入、余弦相似度、BM25",
          "body": "<p>Retrieval works the way search and recommender systems do, in two stages. Stage one is <strong>candidate retrieval</strong>: trim a huge knowledge base down to a hundred-odd candidates, and the aim is to <strong>maximize recall</strong> — cast a wide net, miss nothing. Embed the query, compare it against every chunk embedding, keep the top matches by <strong>cosine similarity</strong>:</p>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]<p>You will see other distances too, like L2, but once the vectors are normalized they mostly collapse to the same thing. The base can be enormous, so <strong>approximate nearest neighbor (ANN)</strong> methods partition the embeddings instead of scanning every one. The query and the chunk each go through their own encoder — a <strong>bi-encoder</strong> setup, usually a BERT-like model. Worth reading: <em>Sentence-BERT</em> (Reimers et al., 2019), trained so relevant pairs land at high cosine similarity. Pure semantic search makes no promise about <em>keywords</em>: ask <em>Where is Cuddly?</em> and you might get chunks about Huggy that read as similar but never say Cuddly. <strong>BM25</strong>, a keyword-overlap score, guarantees the word shows up. So many systems run a <strong>hybrid</strong> — embeddings plus BM25 — to get the best of both.</p>",
          "bodyZh": "<p>检索跟搜索、推荐系统是一个路数,分两阶段。第一阶段是<strong>候选检索(candidate retrieval)</strong>:把庞大的知识库砍到一百来个候选,目标是<strong>最大化召回(recall)</strong> —— 网撒得宽,一个都别漏。把查询嵌入,跟每个块的嵌入比一遍,按<strong>余弦相似度(cosine similarity)</strong>留下最高的几个:</p>\\[ \\text{sim}(q,d) = \\frac{q \\cdot d}{\\lVert q \\rVert\\, \\lVert d \\rVert}. \\]<p>你也会见到别的距离,比如 L2,但向量一归一化,它们基本就归到一处了。库可能极大,所以<strong>近似最近邻(ANN)</strong>方法对嵌入分区,而不是挨个扫。查询和块各走各的编码器 —— 这叫<strong>双编码器(bi-encoder)</strong>结构,通常是类 BERT 模型。值得一读:<em>Sentence-BERT</em>(Reimers 等,2019),它训练出来就是让相关的一对落在高余弦相似度上。纯语义检索对<em>关键词</em>不打包票:你问<em>「Cuddly 在哪?」</em>,返回的可能是讲 Huggy 的块,读着相近,却压根没提 Cuddly。<strong>BM25</strong> 是个关键词重叠的打分,能保证那个词确实出现。所以很多系统跑<strong>混合(hybrid)</strong> —— 嵌入加 BM25 —— 两头的好处都要。</p>"
        },
        {
          "name": "Retrieval extensions: HyDE, contextual chunks, prompt caching",
          "nameZh": "检索扩展:HyDE、上下文化分块、提示缓存",
          "body": "<p>Two practical snags, two fixes. First, a query and a document are different animals — a short question on one side, long prose on the other. Run both through the same encoder and the vectors barely line up. <strong>HyDE</strong> (Gao et al., 2022) sidesteps this. Instead of embedding the prompt, make one model call to write a <em>fake document</em> that answers it (<em>Cuddly is in...</em>), then embed that fake document and use it to fetch the real chunks. (You could also train separate query and document encoders, but people avoid that — too much to maintain.)</p><p>Second, a chunk cut out cold can be meaningless on its own. <strong>Contextual retrieval</strong> (Anthropic, 2024) glues a short generated context onto the front of each chunk: feed the whole document plus the chunk to a model and ask it for a <em>short, succinct context to place this chunk</em>. That is a lot of model calls, so reach for <strong>prompt caching</strong>. Decoders read left to right, so a shared prefix — here, the whole document — always produces the same activations. Compute them once, save them, and from then on just look them up. Providers price this in: a cached input token can cost about a tenth of a regular one. So gather whatever repeats and park it at the start of the prompt.</p>",
          "bodyZh": "<p>两个实际的坎,两个解法。第一,查询和文档是两种动物 —— 一边是短问句,一边是长篇文字。两边都过同一个编码器,出来的向量根本对不齐。<strong>HyDE</strong>(Gao 等,2022)绕开了这一步。它不去嵌入提示,而是先用一次模型调用写出一份回答它的<em>假文档</em>(<em>「Cuddly 在……」</em>),再把这份假文档嵌入,拿它去捞真正的块。(你也可以分别训练查询编码器和文档编码器,但人们不爱这么干 —— 要维护的东西太多。)</p><p>第二,一块文字硬切出来,孤零零的可能没意义。<strong>上下文检索(contextual retrieval)</strong>(Anthropic,2024)在每块前头粘上一段生成的简短上下文:把整篇文档连同这一块喂给模型,请它给一段<em>简短精炼、能给这块定位的上下文</em>。这要调用模型很多次,于是请出<strong>提示缓存(prompt caching)</strong>。解码器从左读到右,所以共享的前缀 —— 这里就是整篇文档 —— 永远算出同样的激活。算一次,存下来,往后只管查表。各家供应商把这写进了价格:一个缓存输入词元的价钱大约是常规的十分之一。所以把会重复的东西归到一起,搁在提示开头。</p>"
        },
        {
          "name": "Reranking with cross-encoders, and retrieval metrics",
          "nameZh": "用交叉编码器重排序,与检索指标",
          "body": "<p>Stage two is <strong>ranking (reranking)</strong>. It takes the hundred-odd candidates and scores them properly, this time to <strong>maximize precision</strong> — put the truly relevant ones up top. Rather than compare two separate embeddings, a <strong>cross-encoder</strong> feeds the query <em>and</em> the chunk into one encoder together and runs attention across both, then emits a relevance score. That catches the query-chunk interaction the bi-encoder never sees. It costs more compute, but on a small candidate set you can afford it. The reranker shuffles the order — d, b, a, c becomes a:1, b:2, c:3, d:4 — and you keep the top-k for the prompt.</p><p>How do you know the ranking is any good? Ranking metrics. <strong>NDCG@k</strong> adds up relevance over the top k and discounts by position, so a relevant chunk at rank 1 beats the same chunk at rank k; then it divides by the ideal DCG, so a perfect ranking scores 1. <strong>Reciprocal Rank (RR@k)</strong> is just one over the rank of the first relevant chunk — simple, and it tracks the others well. <strong>Recall@k</strong> and <strong>Precision@k</strong> are the ranking versions of the metrics you already know from classification. To compare retrievers, benchmark them on <strong>MTEB</strong>, the Massive Text Embedding Benchmark.</p>",
          "bodyZh": "<p>第二阶段是<strong>排序(ranking / reranking)</strong>。它拿到那一百来个候选,认真打分,这回是要<strong>最大化精确率(precision)</strong> —— 把真正相关的顶到最上面。它不去比两个分开的嵌入,而是用<strong>交叉编码器(cross-encoder)</strong>把查询<em>和</em>块一起塞进同一个编码器,在两者之间跑注意力,再给出一个相关性分数。这就抓住了双编码器永远看不到的查询-块互动。它更费算力,但在小候选集上花得起。重排序器把次序重洗 —— d、b、a、c 变成 a:1、b:2、c:3、d:4 —— 你留下前 k 个放进提示。</p><p>怎么知道排得好不好?靠排序指标。<strong>NDCG@k</strong> 把前 k 的相关性加起来,按位置打折,于是排第 1 的相关块胜过同一块排在第 k;再除以理想 DCG,这样完美排序得 1。<strong>倒数排名(RR@k)</strong>就是第一个相关块排名的倒数 —— 简单,而且跟其他指标走势一致。<strong>Recall@k</strong> 和 <strong>Precision@k</strong> 是你在分类里早就熟悉的那两个指标的排序版。要比较检索器,就在 <strong>MTEB</strong>(海量文本嵌入基准,Massive Text Embedding Benchmark)上跑一跑。</p>"
        },
        {
          "name": "Tool / function calling",
          "nameZh": "工具 / 函数调用",
          "body": "<p>RAG feeds in <em>unstructured</em> text. <strong>Tool calling</strong> handles <em>structured</em> input and output. A table that maps inputs to outputs is really just a function, so we call it <strong>function calling</strong> (models lean on Python here because it reads cleanly). IBM puts it this way: tool calling lets autonomous systems finish tasks by reaching out to external resources and acting on them. Picture it: you ask <em>Find a bear near me!</em> and a plain model shrugs — it has no idea. Give it a documented <code>find_teddy_bear(location)</code> function and now it can answer. The model never sees the guts — only the function's API, its inputs and outputs, and the docstring. The body — the backend API call, the returned <code>TeddyBearInfo</code> with name, distance, mood — stays in your codebase.</p><p>It runs in three stages. First the model picks the right function and fills in its <strong>arguments</strong> from your query and context — say <code>location = (37.42, -122.17)</code>, lifted from your GPS. Second the runtime <strong>executes</strong> the call — no model involved — and gets back structured JSON. Third the model <strong>reads that result</strong> and writes a plain-English reply. The uses fan out: information (search, weather, stocks, your codebase), computation (a calculator, running code), and action (sending an email or a message for you).</p>",
          "bodyZh": "<p>RAG 喂进去的是<em>非结构化</em>文本。<strong>工具调用(tool calling)</strong>对付的是<em>结构化</em>的输入和输出。一张把输入映射到输出的表,其实就是一个函数,所以叫<strong>函数调用(function calling)</strong>(这里模型偏爱 Python,因为它读着清爽)。IBM 是这么说的:工具调用让自主系统去够到外部资源、作用于它们,从而把任务做完。想象一下:你问<em>「帮我找附近的熊!」</em>,普通模型一摊手 —— 它压根不知道。给它一个文档齐全的 <code>find_teddy_bear(location)</code> 函数,它就能答了。模型从不看里头的内脏 —— 只看函数的 API、它的输入输出和文档字符串。函数体 —— 后端 API 调用、返回的那个带名字、距离、心情的 <code>TeddyBearInfo</code> —— 留在你的代码库里。</p><p>它分三阶段跑。第一,模型挑出对的函数,从你的查询和上下文里把<strong>参数</strong>填好 —— 比如从你的 GPS 取来 <code>location = (37.42, -122.17)</code>。第二,运行时<strong>执行</strong>这次调用 —— 不牵涉模型 —— 拿回结构化 JSON。第三,模型<strong>读这个结果</strong>,写出一句大白话回复。用途铺开来:信息类(搜索、天气、股票、你的代码库)、计算类(计算器、跑代码)、行动类(替你发邮件、发消息)。</p>"
        },
        {
          "name": "Teaching tools, tool selection, and MCP",
          "nameZh": "教会用工具、工具选择与 MCP",
          "body": "<p>There are two ways to teach a model to use tools. <strong>By training:</strong> two batches of SFT pairs — <em>tool prediction</em> (query plus function API maps to the right call) and <em>response generation</em> (the whole conversation history plus the tool result maps to a final reply), with examples varied enough to cover how real users actually ask. <strong>By prompting:</strong> modern models already write Python well, so just drop the function API up front with a detailed explanation of how to use it. Do not write that explanation by hand. Treat the SFT pairs as an <em>evaluation set</em>, run your current prompt against them, tally the wins and losses, and feed all that to a strong reasoning model to rewrite the explanation — run it in practice and you will be surprised how well it does.</p><p>In practice you expose <em>many</em> tools at once, and that bites. Too many tools drag down performance (needle-in-a-haystack, again), and they will never all fit in a finite context anyway. <strong>Tool selection</strong> (a Router; Robert et al., 2024) reads a long list of API names, picks the few that look relevant, and passes only those to the model. And since every provider defines tools its own way, <strong>MCP</strong> (Model Context Protocol, Anthropic, 2024) standardizes how they are exposed: an <em>MCP server</em> serves <em>tools</em>, <em>prompts</em> (usage templates), and <em>resources</em> (external data) to an <em>MCP client</em> living in the host — say Claude Desktop calling a book provider's server.</p>",
          "bodyZh": "<p>教模型用工具有两条路。<strong>靠训练:</strong>两批 SFT 配对 —— <em>工具预测</em>(查询加函数 API 映射到对的调用),以及<em>回复生成</em>(整段对话历史加工具结果映射到最终回复),例子要足够多样,把真实用户怎么问都覆盖到。<strong>靠提示:</strong>现代模型本来就能熟练写 Python,所以把函数 API 摆在前头,配上一段怎么用它的详细说明就行。这段说明别手写。把那些 SFT 配对当成<em>评估集</em>,拿当前提示去跑一遍,数清楚哪些对了哪些错了,把这些一并喂给一个强推理模型来重写说明 —— 它干得出奇地好。</p><p>实践里你会一下子摆出<em>很多</em>工具,这就咬人了。工具太多会拖垮表现(又是大海捞针),反正它们也永远塞不进有限的上下文。<strong>工具选择(tool selection)</strong>(路由器 Router;Robert 等,2024)读一长串 API 名称,挑出看着相关的那几个,只把它们递给模型。又因为各家定义工具的方式各不相同,<strong>MCP</strong>(模型上下文协议,Model Context Protocol,Anthropic,2024)把暴露方式统一了:一个 <em>MCP 服务器</em>向宿主里的 <em>MCP 客户端</em>提供<em>工具</em>、<em>提示</em>(用法模板)和<em>资源</em>(外部数据) —— 比如 Claude Desktop 去调某家图书供应商的服务器。</p>"
        },
        {
          "name": "Agents and the ReAct loop",
          "nameZh": "智能体与 ReAct 循环",
          "body": "<p>An <strong>agent</strong> chases a goal on its own and finishes the task for you. Next to a single tool call, it adds two things: <em>recurrence and higher-level reasoning</em>. The old way is question maps to answer. A reasoning model adds a chain in the middle. An agent goes question to model to calls to model to ... to answer, looping until it is done. The standard recipe is <strong>ReAct</strong> = Reason + Act (Yao et al., 2022), which breaks a goal into a loop of <strong>observe, plan, act</strong> (the paper labels them Thought/Action/Observation; the names drift around).</p><p>Walk through one. Input: <em>My teddy bear is cold. Please do something.</em> <strong>Observe</strong> pulls together what is known — the bear may be cold, but the room temperature is unknown. <strong>Plan</strong> names the next task: find out the room temperature. <strong>Act</strong> calls <code>get_current_room_temperature()</code>, which returns 65F. Back to <strong>Observe</strong>: that is about 5F below average, so it needs more heat. <strong>Plan</strong>: raise the temperature by 5F. <strong>Act</strong>: <code>increase_temperature(value=5)</code>. <strong>Observe</strong>: the thermostat now reads 70F — warm enough — so break out of the loop and <strong>Output</strong> a plain-English reply. Every turn, the model asks whether the goal is met; if yes it answers, if not it loops again.</p>",
          "bodyZh": "<p><strong>智能体(agent)</strong>自己去追一个目标,替你把任务做完。比起单次工具调用,它多了两样东西:<em>循环和更高层次的推理</em>。老路子是问题映射到回答。推理模型在中间加一条思维链。智能体走的是问题到模型到调用到模型到……到回答,一圈圈转,直到做完。标准做法是 <strong>ReAct</strong> = Reason + Act(推理 + 行动,Yao 等,2022),它把一个目标拆成<strong>观察、规划、行动</strong>的循环(论文里标的是思考/行动/观察;叫法各处不一)。</p><p>走一遍看看。输入:<em>「我的泰迪熊冷了,请想想办法。」</em><strong>观察</strong>把已知的拢到一起 —— 熊可能冷,但房间温度还不知道。<strong>规划</strong>点出下一步任务:查清房间温度。<strong>行动</strong>调用 <code>get_current_room_temperature()</code>,返回 65F。回到<strong>观察</strong>:这比平均低约 5F,所以得加点热。<strong>规划</strong>:把温度调高 5F。<strong>行动</strong>:<code>increase_temperature(value=5)</code>。<strong>观察</strong>:恒温器现在读 70F —— 够暖了 —— 于是跳出循环,<strong>输出</strong>一句大白话回复。每一轮,模型都问一句目标达成了没;达成了就回答,没达成就再转一圈。</p>"
        },
        {
          "name": "Multi-agent (A2A), safety, and closing advice",
          "nameZh": "多智能体(A2A)、安全与收尾建议",
          "body": "<p>You can run a whole crew of agents — one for the thermostat, one for energy management, one for occupancy, one for air quality — and let them talk. That is what <strong>A2A</strong> (Agent2Agent, Google, 2025) is for: it standardizes what an agent shows the world. An <em>AgentCard</em> (name, url). <em>AgentSkill</em>s with examples, so other agents know what it can do. An <em>AgentExecutor</em> spelling out how it runs a request and how it cancels one. Each agent runs on its own, with its own reasoning loop; only inputs and outputs pass between them.</p><p>Once a model can act, <strong>safety</strong> stops being optional. One sharp risk is <em>data exfiltration</em> — a prompt that tricks an email tool into mailing out a password. The fixes come in two kinds: <em>training-stage</em> harmlessness data folded into SFT and RL, and <em>inference safeguards</em> like a safety classifier watching the conversation as it goes — plus benchmarks like <strong>Agent-SafetyBench</strong> and the <em>ToolSword</em> survey. Anthropic just reported a real cyber-espionage campaign run through its model, tools and agents and all, which is a blunt reminder of the stakes. <strong>Closing advice.</strong> Hallucination and reasoning are the bottlenecks — fine-tuning helps but is hard, so lean on a stronger base model instead. Start simple, then scale. Reach for the most capable model first to see how far you can get, then trim size and latency later. And keep the reasoning chains in view so you can debug. Shervine's favorite agentic use case is coding — but learn the basics, because the hard part is judging whether the code is actually right.</p>",
          "bodyZh": "<p>你可以养一整队智能体 —— 一个管恒温器,一个管能源调度,一个管占用情况,一个管空气质量 —— 让它们彼此对话。<strong>A2A</strong>(Agent2Agent,Google,2025)就是干这个的:它把一个智能体向外亮出的东西统一了。一张 <em>AgentCard</em>(名称、网址)。带示例的 <em>AgentSkill</em>,让别的智能体知道它会干什么。一个 <em>AgentExecutor</em>,讲清它怎么执行一个请求、怎么取消一个请求。每个智能体各自运行,各有各的推理循环;它们之间只传输入和输出。</p><p>模型一旦能行动,<strong>安全</strong>就不再是可选项。一个尖锐的风险是<em>数据外泄(data exfiltration)</em> —— 一段提示骗过邮件工具,把密码寄了出去。解法分两类:塞进 SFT 和 RL 的<em>训练阶段</em>无害化数据,以及像安全分类器那样边走边盯着对话的<em>推理期防护</em> —— 再加上 <strong>Agent-SafetyBench</strong> 这类基准和 <em>ToolSword</em> 综述。Anthropic 刚报告了一起借它的模型实施的真实网络间谍行动,工具和智能体都用上了,直白地提醒着利害有多大。<strong>收尾建议。</strong>幻觉和推理是瓶颈 —— 微调有帮助,但难,所以宁可靠一个更强的底座模型。先做简单,再扩。先抓最强的模型,看看能走多远,之后再去削尺寸、压延迟。还有,把推理链留在眼前,方便你调试。Shervine 最爱的智能体用例是写代码 —— 但要学好基本功,因为难的那部分是判断代码到底对不对。</p>"
        }
      ],
      "takeaways": [
        "A model's knowledge freezes at its cutoff (GPT-5: Sep 30, 2024); stuffing everything into context fails on size, on distraction (needle-in-a-haystack), and on per-token cost.",
        "RAG = Retrieve (similarity search over a chunked, embedded knowledge base), Augment the prompt, Generate the answer; the knobs are embedding size, chunk size, and overlap.",
        "Retrieval runs in two stages: candidate retrieval maximizes recall via bi-encoder cosine similarity (with BM25/hybrid for keywords); cross-encoder reranking maximizes precision.",
        "Cosine similarity is the default match score, sim(q,d) = (q.d) / (||q|| ||d||); judge retrievers with NDCG@k, RR@k, recall@k, and precision@k on MTEB.",
        "Sharper retrieval: HyDE embeds a generated fake document; contextual retrieval prepends chunk context cheaply, via prompt caching at about a tenth of the input cost.",
        "Tool calling exposes documented function schemas; the model fills the arguments, the runtime executes the call, and the model reads the structured result and replies.",
        "Agents loop a tool-using model with ReAct (observe, plan, act); MCP standardizes how tools are exposed, and A2A standardizes how agents talk to each other.",
        "Acting in the world opens safety risks like data exfiltration; errors compound over long runs, so start simple, use capable models, and keep the reasoning in view."
      ],
      "takeawaysZh": [
        "模型的知识冻结在截止日期(GPT-5:2024 年 9 月 30 日);把一切塞进上下文,会败在体量、败在干扰(大海捞针)、也败在按词元计费上。",
        "RAG = 检索(在切块并嵌入的知识库上做相似度搜索)、增强提示、生成回答;旋钮是嵌入维度、块大小和重叠。",
        "检索分两阶段:候选检索用双编码器余弦相似度最大化召回(配 BM25 / 混合抓关键词);交叉编码器重排序最大化精确率。",
        "余弦相似度是默认的匹配分数,sim(q,d) = (q.d) / (||q|| ||d||);在 MTEB 上用 NDCG@k、RR@k、recall@k、precision@k 评判检索器。",
        "更精的检索:HyDE 嵌入一份生成的假文档;上下文检索给每块前置上下文,靠提示缓存以约十分之一的输入成本廉价做到。",
        "工具调用亮出文档齐全的函数模式;模型填参数,运行时执行调用,模型再读结构化结果并回复。",
        "智能体用 ReAct(观察、规划、行动)让会用工具的模型循环;MCP 统一工具怎么暴露,A2A 统一智能体之间怎么对话。",
        "在世界里行动会打开数据外泄这类安全风险;误差在长链条上越滚越大,所以先做简单、用强模型、把推理留在眼前。"
      ],
      "refs": [
        {
          "t": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)",
          "u": "https://arxiv.org/abs/2005.11401",
          "tZh": "面向知识密集型 NLP 任务的检索增强生成 —— RAG 的开山论文(Lewis et al., 2020)"
        },
        {
          "t": "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (Reimers et al., 2019)",
          "u": "https://arxiv.org/abs/1908.10084",
          "tZh": "Sentence-BERT:用孪生 BERT 网络算句向量,RAG 检索器的根基(Reimers et al., 2019)"
        },
        {
          "t": "Precise Zero-Shot Dense Retrieval without Relevance Labels — HyDE (Gao et al., 2022)",
          "u": "https://arxiv.org/abs/2212.10496",
          "tZh": "无相关性标注的精确零样本稠密检索 —— HyDE,用假文档抹平查询和文档的差距(Gao et al., 2022)"
        },
        {
          "t": "Introducing Contextual Retrieval (Anthropic, 2024)",
          "u": "https://www.anthropic.com/news/contextual-retrieval",
          "tZh": "上下文检索:给每块前置一段生成的上下文,再配上提示缓存(Anthropic, 2024)"
        },
        {
          "t": "Introducing the Model Context Protocol — MCP (Anthropic, 2024)",
          "u": "https://www.anthropic.com/news/model-context-protocol",
          "tZh": "模型上下文协议 MCP:用一套标准把工具和数据接到模型上(Anthropic, 2024)"
        },
        {
          "t": "ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)",
          "u": "https://arxiv.org/abs/2210.03629",
          "tZh": "ReAct:在语言模型里把推理和行动拧到一起,智能体的经典范式(Yao et al., 2022)"
        },
        {
          "t": "Announcing the Agent2Agent Protocol — A2A (Google, 2025)",
          "u": "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
          "tZh": "Agent2Agent 协议 A2A:把智能体之间的对话方式统一起来(Google, 2025)"
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
      "tagline": "If you can't measure the output, you can't improve it.",
      "taglineZh": "衡量不了输出,就改进不了模型。",
      "overview": "<p>Measure the model first, then you know what to fix. That is why the instructor calls this one of the most important lectures of the quarter. The trouble is that an LLM is a <strong>text-to-text</strong> model: the output can be a sentence, a block of code, or a chain of math, so no single metric covers all of it. We start at the gold standard, a human reading every answer, then trade it for cheap rule-based metrics, then hand the grading to another model with <strong>LLM-as-a-judge</strong>. We catch the judge's <strong>biases</strong>, settle on a workflow, and finish by scoring whole agents and whole models on benchmarks.</p>",
      "overviewZh": "先衡量,再知道该修哪里。讲者把这一讲称为整门课最重要的几讲之一。麻烦在于:大模型是<strong>文本到文本</strong>(text-to-text)的模型,输出可能是一句话、一段代码,或一串数学推导,没有哪个单一指标能全管住。我们从黄金标准 —— 人读每一条答案 —— 出发,把它换成廉价的基于规则的指标,再把判卷交给另一个模型,也就是 <strong>LLM-as-a-judge</strong>(以大模型为裁判)。接着抓出裁判的<strong>偏差</strong>,定下一套工作流,最后用基准测试给整个智能体、整个模型打分。</p>",
      "topics": [
        {
          "name": "From human ratings to inter-rater agreement",
          "nameZh": "从人工评分到评分者一致性",
          "body": "<p>Ask a person to read every answer and rate it. That is as close to the truth as you get, and it is slow, expensive, and often a matter of opinion. Take the instructor's example: someone asks <em>what birthday gift should I get</em>, the model says <em>a teddy bear is almost always a sweet gift</em>. You grade it for <strong>usefulness</strong>. One rater calls it useful. The next says it never told you which stuffed animal to buy, so it is not. Same answer, two verdicts.</p><p>So you measure how often your raters agree. The obvious number is the raw agreement rate, and it lies to you. Suppose Alice and Bob each flip a coin between good and not-good, \\(p_A=p_B=0.5\\). They land on the same answer \\(0.5^2 + 0.5^2 = 0.5\\) of the time, half, by luck alone. Skew the odds and that chance number climbs even higher. So a raw agreement rate on its own tells you nothing.</p><p>Subtract the luck. <strong>Cohen's Kappa</strong> measures how far observed agreement beats chance agreement: it hits 1 when raters match perfectly, and goes negative when they do worse than coin flips. <strong>Fleiss' Kappa</strong> and <strong>Krippendorff's alpha</strong> stretch the same idea to many raters. Teams watch this number as a health check; when it sags, they sit the raters down and re-align on what the guidelines mean.</p>",
          "bodyZh": "<p>让人读每一条答案再打分。这最接近真值 —— 也最慢、最贵,而且常常只是看法不同。看讲者的例子:有人问<em>该送什么生日礼物</em>,模型答<em>泰迪熊几乎总是个贴心礼物</em>。你就<strong>有用性</strong>(usefulness)打分。一位评分者说有用。下一位说它根本没讲清楚该买哪种毛绒玩具,所以没用。同一条答案,两种判定。</p><p>于是你去量评分者多久意见一致。最顺手的数字是原始一致率,而它会骗你。假设 Alice 和 Bob 各自在好与不好之间抛硬币,\\(p_A=p_B=0.5\\)。他们落到同一答案的概率是 \\(0.5^2 + 0.5^2 = 0.5\\),一半,全靠运气。再把概率拉偏,这个偶然数字还会更高。所以孤立看一个原始一致率,什么也说明不了。</p><p>把运气减掉。<strong>Cohen's Kappa</strong> 量的是观测一致率比偶然一致率高出多少:两人完全吻合时取 1,表现还不如抛硬币时取负。<strong>Fleiss' Kappa</strong> 与 <strong>Krippendorff's alpha</strong> 把同一个想法推广到多位评分者。团队把这个数当作健康指标盯着;一旦下滑,就把评分者叫到一起,重新统一对指引的理解。</p>"
        },
        {
          "name": "Rule-based metrics: METEOR, BLEU, ROUGE",
          "nameZh": "基于规则的指标:METEOR、BLEU、ROUGE",
          "body": "<p>Stop re-rating every output. Write the <strong>references</strong> once, freeze them, and score each new answer against them. Now you can change the model all day and never call the raters back. The catch is that the same idea can be said ten ways, so these metrics try to leave a little room.</p><p><strong>METEOR</strong> (Metric for Evaluation of Translation with Explicit ORdering) is \\(\\text{F-score} \\times (1 - \\text{penalty})\\). The F-score is a weighted harmonic mean of <em>precision</em> (matched unigrams over the prediction) and <em>recall</em> (matched unigrams over the reference). The penalty looks at \\(C\\), the number of contiguous matched chunks, over the matched unigrams; fewer, longer runs mean the words line up in the right order. It even credits synonyms and shared word-roots, but you hand-pick \\(\\gamma,\\beta\\), so it reads like a recipe. <strong>BLEU</strong> (BiLingual Evaluation Understudy) counts matched n-grams as precision and adds a <em>brevity penalty</em> so a tiny translation cannot cheat its way to a high score. <strong>ROUGE</strong> (recall-oriented, many flavors) does the same job for summarization.</p><p>Where they break: they cannot see <strong>stylistic variation</strong>. The instructor writes three teddy-bear sentences that mean the same thing in completely different words, and all three score badly. They track human judgment only loosely. And you still need someone to write the references before you can begin.</p>",
          "bodyZh": "<p>别再给每条输出重新打分。把<strong>参考答案</strong>(references)写一次、定死,然后拿每条新答案去对照。这样模型怎么改都行,不必再把评分者叫回来。问题是同一个意思能说出十种说法,所以这些指标想留一点余地。</p><p><strong>METEOR</strong>(显式排序的翻译评估指标)是 \\(\\text{F-score} \\times (1 - \\text{penalty})\\)。F-score 是<em>精确率</em>(预测中匹配的一元词占比)与<em>召回率</em>(参考中匹配的一元词占比)的加权调和平均。惩罚项看 \\(C\\),即匹配连续块的数目,除以匹配一元词数;块越少越长,说明词的顺序排得越对。它甚至给同义词和同词根加分,但 \\(\\gamma,\\beta\\) 要你手工挑,所以读起来像一份配方。<strong>BLEU</strong>(双语评估替补)把匹配的 n-gram 当精确率算,再加一个<em>简短惩罚</em>(brevity penalty),免得一句极短的译文靠取巧拿高分。<strong>ROUGE</strong>(召回导向,变体众多)在摘要任务上做同样的事。</p><p>它们崩在哪:看不见<strong>风格变化</strong>。讲者写了三句意思相同、用词却完全不同的泰迪熊句子,三句都得低分。它们和人类判断只是松松地挂钩。而且开工之前,你仍然得有人来写参考。</p>"
        },
        {
          "name": "LLM-as-a-judge: setup, structured output, variations",
          "nameZh": "以大模型为裁判:设置、结构化输出与变体",
          "body": "<p>Hire a strong model to grade the answers. It agrees with humans about 80% of the time and never sleeps — but it has tells you have to watch for. The setup is plain: feed one model the <em>prompt</em>, the <em>response</em>, and the <em>criteria</em>; ask it back for a <strong>score</strong> (binary if you can, pass or fail) and a <strong>rationale</strong> saying why. The rationale is the part rule-based metrics never gave you. Make it write the rationale <em>before</em> the score. Like the chain-of-thought in a reasoning model, thinking out loud first sharpens the verdict that follows.</p><p>One catch: sampling is probabilistic, so you are not guaranteed a rationale-and-score you can actually parse. The fix goes back to Lecture 3 — <strong>constrained / guided decoding</strong>, where the model may only sample valid tokens and the format is forced. Providers ship this as <strong>structured output</strong>: define a <code>Response</code> class with a <code>rationale</code> field and a <code>score</code> field, then pass <code>text_format=Response</code> in the call and the shape is guaranteed.</p><p>Two flavors show up everywhere. <strong>Pointwise</strong>: grade one response on its own. <strong>Pairwise</strong>: put A next to B and ask which is better. Pairwise doubles as a way to <em>synthesize preference data</em> for training a reward model, exactly as the preference-tuning lecture described.</p>",
          "bodyZh": "<p>请一个强模型来当判卷老师。它和人类大约 80% 的时候意见一致,还不用睡觉 —— 但它有几个毛病你得盯着。设置很直白:把<em>提示</em>、<em>回答</em>、<em>评判标准</em>喂给一个模型;让它返回一个<strong>分数</strong>(能二元就二元,通过或不通过)和一段<strong>理由</strong>(rationale)说明为什么。这段理由正是基于规则的指标从没给过你的东西。让它先写理由<em>再</em>给分。这跟推理模型里的思维链一个道理 —— 先把话想明白说出来,后面的判定就更准。</p><p>有个坑:采样带概率性,所以并不保证你能解析出一段理由加一个分数。解决办法回到第 3 讲 —— <strong>受约束/引导解码</strong>(constrained / guided decoding),让模型只从合法词元采样,强行锁住格式。各厂商把它做成<strong>结构化输出</strong>(structured output):定义一个 <code>Response</code> 类,带一个 <code>rationale</code> 字段和一个 <code>score</code> 字段,调用时传 <code>text_format=Response</code>,形状就有了保证。</p><p>两种用法到处都是。<strong>逐条</strong>(pointwise):单独给一条回答打分。<strong>成对</strong>(pairwise):把 A 摆在 B 旁边,问哪个更好。成对还能顺手<em>合成偏好数据</em>来训练奖励模型,正是偏好微调那一讲讲过的做法。</p>"
        },
        {
          "name": "Biases & pitfalls of LLM judges",
          "nameZh": "大模型裁判的偏差与陷阱",
          "body": "<p>The judge fails in patterns, and once you know the patterns you can defend against them. <strong>Position bias</strong>: it picks Response A just because A came first. So ask twice — <em>A or B</em>, then <em>B or A</em> — and take the majority. If the winner flips when you swap the order, throw the verdict out. (You can also tweak the position embeddings, but that is an advanced move, not the default.)</p><p><strong>Verbosity bias</strong>: it reaches for the long, padded answer over the short, correct one, rewarding length instead of substance. Push back three ways: spell out in the guidelines that length is not a virtue, show a few examples that make the point, and add a pointwise penalty on output length.</p><p><strong>Self-enhancement bias</strong>: a model scores its own writing higher. The intuition is simple — it generated that sequence because it found it probable, so of course it likes it. The slide shows a human-polished, near-perfect answer (A) losing to a model's own answer (B). The fix is to keep the generator and the judge as different models — imperfect, since models share training data, but it helps. And a <em>bigger, stronger</em> judge is harder to fool with something that merely sounds like its own output.</p><p>These three are not the whole list. A judge that is simply out of step with human preference is a bias too.</p>",
          "bodyZh": "<p>裁判按套路出错,套路一旦摸清,就能防。<strong>位置偏差</strong>(position bias):它选回答 A,只因为 A 排在前面。那就问两遍 —— 先<em>A 还是 B</em>,再<em>B 还是 A</em> —— 取多数。换了顺序赢家就翻,这个判定就扔掉。(你也可以去调位置嵌入,但那是进阶手段,不是默认做法。)</p><p><strong>冗长偏差</strong>(verbosity bias):它伸手去拿又长又注水的答案,而不是简短却正确的那个,奖励篇幅而非内容。三招顶回去:在指引里写明白篇幅不算优点,摆几个例子把道理说透,再在逐条打分时对输出长度加惩罚。</p><p><strong>自我增强偏差</strong>(self-enhancement bias):模型给自己写的东西打更高分。道理很简单 —— 它生成那段序列,正因为它觉得那段概率高,所以当然喜欢。幻灯片上,一份人工精修、近乎完美的答案(A)输给了模型自己的答案(B)。对策是让生成的模型和评判的模型不是同一个 —— 因各模型共享训练数据,这并不彻底,但有用。而且一个<em>更大更强</em>的裁判,更难被那种只是听起来像自己输出的东西骗到。</p><p>这三种不是全部。一个裁判单纯就跟人类偏好不合拍,也是一种偏差。</p>"
        },
        {
          "name": "Best practices, the revised workflow & factuality",
          "nameZh": "最佳实践、修订后的工作流与事实性",
          "body": "<p>The instructor's checklist, short and concrete. Write <strong>crisp guidelines</strong> that say what you want and what you don't. Use a <strong>binary scale</strong>, not a 1-to-10 one — easier on the judge, easier to line up with humans. Put the <strong>rationale before the score</strong>. Patch the known biases. <strong>Calibrate against humans</strong>: collect some real ratings and run a correlation against the judge's. And turn the <strong>temperature down</strong> to about 0.1 to 0.2 so the same run gives the same numbers two days later. The workflow that comes out keeps humans in the loop for one job only — calibrating the judge. Never over-optimize against the judge; it is just a stand-in for the humans, and you do not want to chase the stand-in off a cliff.</p><p>Two families of things to measure: <strong>task performance</strong> (useful, factual, relevant) and <strong>alignment</strong> (tone, style, safety). <strong>Factuality</strong> refuses to fit in a yes-or-no box, because a long passage mixes true claims with false ones, and one slip should not sink the whole thing. The recipe (Wei et al., 2024): one LLM call to <strong>break the text into atomic facts</strong>, then <strong>fact-check each one</strong> (usually with RAG or web search), then add them up with per-fact importance weights \\(\\alpha_i\\). Run it on the teddy-bear passage — it says they were created in the 1920s (wrong, it was the 1900s) and that Roosevelt proudly wanted to shoot a captured bear (wrong, he refused). Only facts 2 and 3 hold up, and the score lands at \\(0.60\\).</p>",
          "bodyZh": "<p>讲者的清单,短而具体。写<strong>干脆的指引</strong>,讲清楚要什么、不要什么。用<strong>二元量表</strong>,别用一到十的 —— 裁判更省事,跟人对齐也更省事。把<strong>理由放在分数前面</strong>。补上已知的偏差。<strong>对人类校准</strong>:收一些真实评分,跟裁判的打分跑相关性。再把<strong>温度调低</strong>到大约 0.1 到 0.2,这样两天后重跑还是同样的数字。由此得到的工作流只留人做一件事 —— 校准裁判。千万别对裁判过度优化;它不过是人类的替身,你可不想追着替身跳崖。</p><p>要衡量的东西分两族:<strong>任务表现</strong>(有用、事实、相关)与<strong>对齐</strong>(语气、风格、安全)。<strong>事实性</strong>(factuality)塞不进非对即错的盒子,因为一长段话里真假掺着,一处出错不该把整段都判死。配方(Wei 等,2024):用一次大模型调用把文本<strong>拆成原子事实</strong>,再<strong>逐条核查</strong>(通常靠 RAG 或网络搜索),最后按每条事实的重要性权重 \\(\\alpha_i\\) 加起来。拿那段泰迪熊文本跑一遍 —— 它说泰迪熊创于 1920 年代(错,应是 1900 年代),又说罗斯福得意地想射杀一头被困的熊(错,他拒绝了)。只有第 2、3 条事实站得住,得分落在 \\(0.60\\)。</p>"
        },
        {
          "name": "Evaluating agents: tool-call failure modes",
          "nameZh": "评测智能体:工具调用的失败模式",
          "body": "<p>An agent runs a loop: observe, plan, act. Crack open one tool call and it splits into three steps — (1) pick the right tool and arguments, (2) run it, (3) turn the result into an answer. Things break at each step, so go through them one at a time. At <strong>tool prediction</strong>: the model <em>skips the tool</em> and punts with <code>Sorry, I cannot do that</code> (fix the recall-oriented tool router, or use SFT or a better prompt to teach it to call the tool); it <em>hallucinates a tool</em>, calling <code>find_bear()</code> when only <code>find_teddy_bear()</code> exists (the model is too weak, the API names are illogical, or the instructions are unclear); it <em>grabs the wrong tool</em>; or it <em>makes up an argument</em>, dropping a pin at <code>(0,0)</code> in the South Atlantic because nothing in the context said where the user is (add a location-finder tool, or carry the location through).</p><p>At the <strong>tool call</strong> itself: it returns a wrong value or an error (go fix the code — though an error can be the honest answer), or it returns nothing (always hand back something with meaning — an empty JSON beats <code>None</code>, because empty JSON says <em>no bears found</em> while <code>None</code> says nothing). At <strong>response generation</strong>: the model ignores a perfectly good result, usually because the tool dumped a wall of text that buried the useful part, or the output was too bare to read — so trim it and give the output a meaningful shape. Stay organized: bucket the errors by category and clear them in groups.</p>",
          "bodyZh": "<p>智能体跑一个循环:观察、规划、行动。把一次工具调用掰开,它分成三步 —— (1) 选对工具和参数,(2) 执行,(3) 把结果变成回答。每一步都会出岔子,所以一步一步过。<strong>工具预测</strong>这一步:模型<em>跳过工具</em>,撂挑子甩一句 <code>抱歉,我做不到</code>(修以召回为导向的工具路由,或用 SFT、用更好的提示教它去调工具);它<em>幻觉出一个工具</em>,只有 <code>find_teddy_bear()</code> 却去调 <code>find_bear()</code>(模型太弱、API 命名不合逻辑,或指令不清);它<em>抓错了工具</em>;或者它<em>编了个参数</em>,把定位点丢到南大西洋的 <code>(0,0)</code>,只因上下文里没说用户在哪(加一个定位工具,或把位置一路带着)。</p><p><strong>工具调用</strong>本身:它返回错误值或报错(去修代码 —— 不过报错有时正是诚实的答案),或者什么都不返回(永远递回有意义的东西 —— 空 JSON 胜过 <code>None</code>,因为空 JSON 说<em>没找到熊</em>,而 <code>None</code> 什么都没说)。<strong>回答生成</strong>这一步:模型无视一个完全可用的结果,通常是工具甩出一堵文字墙,把有用的那点埋了,或者输出太干读不出来 —— 那就裁剪它,给输出一个有意义的形状。保持条理:把错误按类别分桶,成组清掉。</p>"
        },
        {
          "name": "Benchmarks, the Pareto frontier & contamination",
          "nameZh": "基准测试、帕累托前沿与数据污染",
          "body": "<p>Benchmarks line whole models up along one axis. <strong>Knowledge</strong>: <strong>MMLU</strong> (Massive Multitask Language Understanding) — 57 tasks across math, US history, law, medicine and more, each an A/B/C/D pick with a hardcoded match; it mostly shows how well pretraining stuck. <strong>Reasoning</strong>: <strong>AIME</strong>, a brutal high-school olympiad where the answer is a single 3-digit number, and <strong>PIQA</strong> (Physical Interaction QA) — about 20k everyday-physics questions, two choices each (to fish a lost item off the carpet, vacuum with a <em>hairnet</em> over the nozzle, not a solid seal that lets no air through). <strong>Coding</strong>: <strong>SWE-bench</strong> — 2,294 real GitHub issues from 12 Python repos, each with a base commit and a merged PR carrying tests; the model's patch has to make those tests pass. It stands in for tool-use skill, since the tools are code too.</p><p><strong>Safety</strong>: <strong>HarmBench</strong> — 510 harmful behaviors, scored by a <em>classifier</em> on attack success rate, and it counts the attempt even when the output is junk. Safety is set provider by provider, so it rarely ranks models against each other. <strong>Agents</strong>: <strong>tau-bench</strong> (Tool-Agent-User) — airline and retail worlds with an LLM playing the user, scored by the resulting database state and by <strong>pass^k</strong>, the chance that <em>all</em> k tries succeed. That is reliability, and it is stricter than pass@k.</p><p>Plot models against cost, latency, or context and the best ones trace a <strong>Pareto frontier</strong>, the edge of what is achievable at each price. Watch for <strong>contamination</strong> — the model having already seen the test — and fight it with hashes, blocklists, and fresh test versions. Goodhart's Law puts it plainly: once a measure becomes a target, it stops being a good measure. Round it out with Chatbot Arena and, in the end, just running the models yourself.</p>",
          "bodyZh": "<p>基准把整批模型沿一条轴排开。<strong>知识</strong>:<strong>MMLU</strong>(大规模多任务语言理解)—— 横跨数学、美国史、法律、医学等 57 个任务,每题 A/B/C/D 四选一,硬编码匹配;主要反映预训练记住了多少。<strong>推理</strong>:<strong>AIME</strong>,一场残酷的高中奥赛,答案是一个三位数,还有 <strong>PIQA</strong>(物理交互问答)—— 约 2 万道日常物理题,每题两选一(要把丢在地毯上的小东西吸回来,得在吸嘴上套个<em>发网</em>,而不是用一个不透气的实心密封头)。<strong>代码</strong>:<strong>SWE-bench</strong> —— 取自 12 个 Python 仓库的 2294 个真实 GitHub issue,每题带一个基础提交和一个带测试的已合并 PR;模型给的补丁得让那些测试通过。它充当工具使用能力的代理,因为工具本身也是代码。</p><p><strong>安全</strong>:<strong>HarmBench</strong> —— 510 种有害行为,由一个<em>分类器</em>按攻击成功率打分,哪怕输出是废话,这次尝试也照样计入。安全是各厂商各自划定的,所以很少用来把模型互相排名。<strong>智能体</strong>:<strong>tau-bench</strong>(工具-智能体-用户)—— 航空与零售两个场景,由一个大模型扮演用户,按最终数据库状态和 <strong>pass^k</strong> 评分,pass^k 是 <em>k 次尝试全部</em>成功的概率。那衡量的是可靠性,比 pass@k 更严。</p><p>把模型按成本、延迟或上下文画出来,最好的那一批勾出一条<strong>帕累托前沿</strong>(Pareto frontier),也就是每个价位上能做到的极限边界。当心<strong>数据污染</strong> —— 模型早就见过测试题 —— 用哈希、屏蔽名单和全新的测试版本去防。古德哈特定律(Goodhart's Law)说得直白:一个度量一旦变成目标,就不再是好度量。再用 Chatbot Arena 补一补,最后,亲自把模型跑一遍。</p>"
        }
      ],
      "takeaways": [
        "Human rating is the gold standard but slow, costly and subjective; measure agreement against chance with Cohen's or Fleiss' Kappa, since a raw rate (Alice and Bob coin-flipping agree 50% of the time) tells you nothing.",
        "Rule-based metrics (METEOR, BLEU, ROUGE) score against frozen references, but they miss stylistic variation, track humans loosely, and still need references to start.",
        "LLM-as-a-judge grades and explains an answer with no reference; lock the format with structured output, write the rationale before the score, and prefer pairwise and binary.",
        "Judges have patterned biases — position (swap and vote), verbosity (penalize length), self-enhancement (use a different, bigger model) — so calibrate against humans and run at low temperature.",
        "Factuality breaks a passage into atomic facts, fact-checks each (RAG or web), and weights them; the teddy-bear text with 2 errors scores 0.60.",
        "Evaluating an agent means walking the tool call (predict, run, synthesize) and bucketing failures by category — punting, hallucinating find_bear over find_teddy_bear, a (0,0) argument, no response.",
        "Benchmarks (MMLU, AIME, PIQA, SWE-bench's 2294 issues, HarmBench, tau-bench with pass^k) profile a model along one axis; watch for contamination, and remember Goodhart's Law."
      ],
      "takeawaysZh": [
        "人工评分是黄金标准,但慢、贵、主观;要用 Cohen's 或 Fleiss' Kappa 衡量相对于随机的一致性,因为原始一致率(Alice 和 Bob 抛硬币也有 50% 一致)什么都说明不了。",
        "基于规则的指标(METEOR、BLEU、ROUGE)对照定死的参考打分,却看不见风格变化、和人类只是松松挂钩,而且开工还得先有参考。",
        "LLM-as-a-judge 无需参考就能给答案打分并解释;用结构化输出锁住格式,理由写在分数前,优先用成对和二元。",
        "裁判有成套路的偏差 —— 位置(交换再投票)、冗长(惩罚长度)、自我增强(换一个更大的不同模型)—— 所以要对人类校准,并在低温度下跑。",
        "事实性把一段话拆成原子事实,逐条核查(RAG 或网络),再加权;那段有 2 处错误的泰迪熊文本得 0.60。",
        "评测智能体就是走一遍工具调用(预测、执行、综合),把失败按类别分桶 —— 撂挑子、把 find_teddy_bear 幻觉成 find_bear、填出 (0,0) 这种参数、没有返回。",
        "基准(MMLU、AIME、PIQA、SWE-bench 的 2294 个 issue、HarmBench、带 pass^k 的 tau-bench)沿一条轴刻画模型;当心数据污染,牢记古德哈特定律。"
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
      "tagline": "The last class: how the pieces fit, and where the field goes from here.",
      "taglineZh": "最后一课:各部分如何拼成整体,以及这个领域往哪走。",
      "overview": "<p>The final lecture has a three-part menu, taught by Afshine and Shervine. First a <strong>recap</strong> that walks the whole quarter lecture by lecture, so the pieces snap together: tokens and embeddings, RNNs and where their memory fades, self-attention, the Transformer and its descendants (BERT, GPT, T5), LLMs and mixture-of-experts, scaling laws and efficient training (FlashAttention), the pretrain-then-fine-tune-then-preference-tune recipe, RL and reward models, reasoning with PPO and GRPO, RAG and tool calling and agents, and last, evaluation. Then <strong>trends</strong>: everything taught was Transformers for text-to-text, so the instructors show the same self-attention idea jumping to images (Vision Transformer), how a model reads an image and answers questions, and how ideas travel back the other way with diffusion LLMs. Then Shervine's <strong>closing thoughts</strong>: how modalities borrow from each other, how much foundational Transformer research is still open, hardware, what people actually do with LLMs all day, what might come next, the problems that still bite, and how to keep up once the course ends.</p>",
      "overviewZh": "<p>最后一讲由 Afshine 与 Shervine 一起上,菜单分三道。先是<strong>回顾</strong>,逐讲走完整个学期,让各部分对上榫卯:词元与词嵌入、循环网络以及它记忆褪色的地方、自注意力、Transformer 及其衍生模型(BERT、GPT、T5)、大语言模型与专家混合、扩展律与高效训练(FlashAttention)、先预训练再微调再偏好微调的配方、强化学习与奖励模型、用 PPO 与 GRPO 做推理、RAG 与工具调用与智能体,最后是评测。接着是<strong>趋势</strong>:整门课讲的都是用于文本到文本的 Transformer,于是两位讲师演示同一套自注意力思想如何跳到图像(视觉 Transformer)、模型如何读图答题,以及思想又如何反向流回来 —— 扩散式大语言模型。最后是 Shervine 的<strong>结语</strong>:模态之间怎样互相借东西、Transformer 还有多少基础研究没定论、硬件、人们整天拿大语言模型干什么、接下来可能出现什么、哪些问题仍在咬人,以及结课后怎么跟上。</p>",
      "topics": [
        {
          "name": "Recap, part one: from tokens to efficient training (L1–L4)",
          "nameZh": "回顾(上):从词元到高效训练(L1–L4)",
          "body": "<p>Rewind about ten weeks. <strong>L1</strong>: text becomes tokens first (subword tokenization, so word roots get reused), then embeddings. Early word2vec vectors had no sense of context; RNNs added context but lost the thread on <em>long-range dependencies</em> as sequences grew. <strong>Self-attention</strong> fixed that — a direct line between any two tokens through query, key and value, scored by scaled dot products and a softmax, \\( \\text{softmax}(QK^{T}/\\sqrt{d_k})V \\). The 2017 Transformer pairs an encoder with a decoder, shown on translation. <strong>L2</strong>: the refinements that piled on since. Rotary position embeddings (RoPE) rotate queries and keys so attention sees only relative distance; grouped-query attention shares key and value projections; pre-norm moved the normalization ahead of each sub-layer, replacing post-norm. Strip the Transformer down and you get its children: BERT keeps the encoder and reads out the CLS token for classification, GPT keeps the decoder and generates left to right, T5 keeps both. <strong>L3</strong>: LLMs are decoder-only text-to-text models. Mixture-of-experts (MoE) sends each token through a gate that wakes up only a few feed-forward experts instead of the whole network. Sampling with a temperature knob trades determinism for variety. <strong>L4</strong>: scaling laws said bigger wins, and out of them came a rule of thumb — train on at least 20 tokens per parameter, so a 100B model wants 2T tokens. FlashAttention is exact, not approximate: it tiles the computation into fast SRAM and recomputes results instead of parking them in slow HBM, cutting the expensive memory traffic.</p>",
          "bodyZh": "<p>把时间倒回大约十周前。<strong>L1</strong>:文本先变成词元(子词分词,词根因此能复用),再变成词嵌入。早期的 word2vec 向量没有上下文概念;循环网络补上了上下文,却在序列变长时跟丢了<em>长程依赖</em>。<strong>自注意力</strong>解决了这个 —— 任意两个词元之间一条直线,经查询、键、值,用缩放点积加 softmax 打分,\\( \\text{softmax}(QK^{T}/\\sqrt{d_k})V \\)。2017 年的 Transformer 把编码器和解码器配成一对,在翻译上演示。<strong>L2</strong>:此后堆上来的各种改进。旋转位置编码(RoPE)旋转查询和键,让注意力只看相对距离;分组查询注意力共享键值投影;前置归一化把归一化挪到每个子层之前,取代后置归一化。把 Transformer 拆开,就得到它的孩子们:BERT 留下编码器,读出 CLS 词元做分类;GPT 留下解码器,从左往右生成;T5 两个都留。<strong>L3</strong>:大语言模型是仅解码器的文本到文本模型。专家混合(MoE)让每个词元经过一个门控,只唤醒几个前馈专家,而不是整张网络。带温度旋钮的采样,在确定性和多样性之间换挡。<strong>L4</strong>:扩展律说越大越赢,由此引出一条经验法则 —— 每个参数至少喂 20 个词元,1000 亿参数的模型就要 2 万亿词元。FlashAttention 是精确而非近似的:它把计算切块送进快速的 SRAM,把结果重算一遍而不是停放进慢速的 HBM,省下了那笔昂贵的内存搬运。</p>"
        },
        {
          "name": "Recap, part two: alignment, reasoning, agents, evaluation (L5–L8)",
          "nameZh": "回顾(下):对齐、推理、智能体、评测(L5–L8)",
          "body": "<p>Training comes in three stages, each teaching the model something the last one couldn't. <strong>Pretraining</strong> pours trillions of tokens through an initialized model until it can autocomplete. <strong>Supervised fine-tuning</strong> (SFT) shows it what to do, through input-output pairs. <strong>Preference tuning</strong> teaches what <em>not</em> to do, from pairwise human-preference data. <strong>L5</strong> — the instructor calls it the hardest lecture of the course — reads the LLM as an RL policy: given the state (the input so far) it takes an action (the next token) in the environment of tokens, and earns a reward. Rewards are scarce, so a reward model is trained pairwise through the Bradley-Terry formulation. The RL loss chases reward while staying close to the SFT base model — that leash is what curbs <em>reward hacking</em> — and close to the previous iteration too. <strong>L6</strong>: reasoning models write a chain-of-thought before the answer, and you teach that with RL. GRPO has overtaken PPO because it drops the expensive value model and instead compares rewards across several sampled completions; it shines when rewards are <em>verifiable</em>, like math, where you already know the right answer and need no reward model at all. Left alone, GRPO's length term rewards ever-longer wrong answers, so Dr. GRPO and DAPO patch that bias. <strong>L7</strong>: RAG reaches past the knowledge cutoff — bi-encoder candidate search, cross-encoder reranking, then the top documents go into the prompt. Tool calling lets the model name an API and its arguments; agents chain retrieval and tools together. <strong>L8</strong>: rule-based metrics (BLEU, ROUGE, METEOR) punish valid paraphrases, so LLM-as-a-judge writes a rationale and then a score (often just pass/fail) — watch for position, verbosity and self-enhancement bias. Benchmarks span knowledge, reasoning, coding and safety. That is the whole arc, and it is all that's on the final.</p>",
          "bodyZh": "<p>训练分三个阶段,每一阶段教模型上一阶段教不会的东西。<strong>预训练</strong>把数万亿词元灌进一个初始化的模型,直到它会自动补全。<strong>有监督微调</strong>(SFT)用输入输出对告诉它该做什么。<strong>偏好微调</strong>用成对的人类偏好数据,教它<em>不该</em>做什么。<strong>L5</strong> —— 讲师称这是全课最难的一讲 —— 把大语言模型读作强化学习里的策略:给定状态(到目前为止的输入),它在词元环境里采取动作(下一个词元),拿到奖励。奖励稀缺,所以奖励模型用 Bradley-Terry 公式成对训练。强化学习的损失一边追奖励,一边贴着 SFT 基座模型 —— 这根绳子正是用来勒住<em>奖励黑客</em>的 —— 同时也贴着上一轮迭代。<strong>L6</strong>:推理模型在答案之前先写思维链,这用强化学习来教。GRPO 已经超过 PPO,因为它扔掉了昂贵的价值模型,改为在若干采样补全之间比较奖励;当奖励<em>可验证</em>时它最来劲,比如数学题,答案已知,根本不需要奖励模型。放着不管,GRPO 里的长度项会奖励越来越长的错答案,于是 Dr. GRPO 与 DAPO 把这处偏差补上。<strong>L7</strong>:RAG 伸手够到知识截止日之外 —— 双编码器候选检索,交叉编码器重排,再把排在前面的文档塞进提示。工具调用让模型报出一个 API 及其参数;智能体把检索和工具串成一条链。<strong>L8</strong>:基于规则的指标(BLEU、ROUGE、METEOR)会冤枉合理的同义改写,于是用大语言模型当裁判 —— 先写理由再给分(常常只是通过/不通过)—— 但要提防位置偏差、冗长偏差和自我偏好偏差。基准覆盖知识、推理、编码与安全。这就是整条主线,期末考的也全在这儿。</p>"
        },
        {
          "name": "Beyond text: Vision Transformer and multimodal models",
          "nameZh": "超越文本:视觉 Transformer 与多模态模型",
          "body": "<p>Here's the natural question. The Transformer was born for translation, then it ran away with every other text task — so does it have to stop at text? The trick that opens the door: a text token is just a vector, so hand the model vectors that stand for something else, like patches of an image. To understand an image you keep the <strong>encoder</strong>, the same move BERT made for classification. That is the <strong>Vision Transformer (ViT)</strong> (Dosovitskiy et al., 2020). Cut the image into fixed-size patches (say 3x3), flatten each patch of RGB pixels through a learned linear projection into a vector, add a learnable CLS embedding and position embeddings, run the encoder so every patch attends to every other, then push the encoded CLS embedding through a feed-forward network to class probabilities — and out comes, say, teddy bear. The result that surprised people: give it enough data and ViT beats convolutional networks, even with a <em>weaker inductive bias</em>. A CNN is hand-built to slide across the image the way your eye does; ViT bakes in none of that, lets every part attend to every other, and just learns the structure from data. To answer questions about an image you need a vision-language model (VLM), and there are two ways to wire it. <strong>Method 1</strong>, the common one and what LLaVA does, encodes the image into tokens, glues them onto the text tokens, and decodes left to right like any LLM. <strong>Method 2</strong>, rarer and used by Llama 3, slips the image in at the cross-attention layer. Transformers also drive image generation (diffusion transformers, MM-DiT), recommendation and speech — so keep an open mind for the non-text uses.</p>",
          "bodyZh": "<p>有个很自然的问题。Transformer 为翻译而生,接着把其他文本任务一个个收入囊中 —— 那它非得止步于文本吗?推开这扇门的诀窍是:文本词元不过是向量,那就把代表别的东西的向量喂给它,比如图像块。要理解图像,保留<strong>编码器</strong>就行,这正是 BERT 做分类时的那一手。这就是<strong>视觉 Transformer(ViT)</strong>(Dosovitskiy 等,2020)。把图像切成固定大小的块(比如 3x3),把每块的 RGB 像素通过一个可学习的线性投影压平成向量,加上可学习的 CLS 嵌入和位置嵌入,跑编码器让每块与其余块互相注意,再把编码后的 CLS 嵌入推过前馈网络得到各类别概率 —— 出来的就是,比如说,泰迪熊。让人意外的结果是:给够数据,ViT 就赢过卷积网络,哪怕它的<em>归纳偏置更弱</em>。卷积网络是人为造来像眼睛那样在图像上滑动扫描的;ViT 什么都不预设,让每块自由互注意,直接从数据里学出结构。要回答图像问题就得有视觉语言模型(VLM),接线有两种。<strong>方法一</strong>是常见的那种,也是 LLaVA 的做法:把图像编码成词元,粘到文本词元上,像任何大语言模型那样从左往右解码。<strong>方法二</strong>较少见,Llama 3 用它:在交叉注意力层把图像塞进去。Transformer 还驱动图像生成(扩散 Transformer、MM-DiT)、推荐和语音 —— 所以对非文本的用途留个心眼。</p>"
        },
        {
          "name": "Diffusion LLMs: borrowing from the image world",
          "nameZh": "扩散式大语言模型:向图像世界借鉴",
          "body": "<p>ViT carried text ideas into vision; diffusion runs the other direction. Today's LLMs are <strong>autoregressive (ARM)</strong>: predict the next token, append it, repeat — so inference <em>can't be parallelized</em>, since each step waits on every step before it (training can, thanks to the causal mask). To break out of that, researchers borrow diffusion, which works beautifully on images and produced some striking 2025 demos — Google's text-diffusion model at I/O, startups like Inception. In images you start from <strong>noise</strong> — easy to sample, clean to handle through Gaussians — and learn a transformation toward the data distribution. The instructor reaches for Michelangelo: the sculpture is already in the marble, you just chisel away what doesn't belong. Diffusion adds noise on the way in, then learns to denoise on the way out. But text is <em>discrete</em>, not continuous, so there's no obvious noise to add. The insight that cracks it: <strong>the mask token is to text what noise is to images</strong>. The forward process masks more and more tokens until the sequence is all mask; the reverse process learns to unmask and rebuild the sentence, conditioned on a prompt. These are <strong>masked diffusion models (MDM)</strong>, or diffusion LLMs (DLLM). Think of drafting a speech: you don't write it word by word, you rough out an outline and refine each section — coarse to fine, not strictly left to right. The payoff is speed: decoding takes far fewer forward passes, with benchmarks claiming around 10x the output tokens per second, which matters for coding and makes fill-in-the-middle a natural fit. Still open: matching frontier quality, and porting over ARM tricks like reasoning chains. Worth a read: Large Language Diffusion Models (Nie et al., 2025).</p>",
          "bodyZh": "<p>ViT 把文本的思想带进视觉;扩散往反方向走。今天的大语言模型是<strong>自回归(ARM)</strong>的:预测下一个词元,追加,重复 —— 所以推理<em>没法并行</em>,因为每一步都等着前面所有步(训练靠因果掩码倒是可以并行)。为了挣脱这点,研究者借来扩散,它在图像上极其好用,2025 年还放出了几个亮眼的演示 —— 谷歌 I/O 上的文本扩散模型,Inception 这类创业公司。在图像里你从<strong>噪声</strong>出发 —— 好采样,用高斯分布处理起来干净 —— 学一个通向数据分布的变换。讲师搬出米开朗基罗:雕塑早就在大理石里,你只需凿掉不属于它的部分。扩散进门时加噪,出门时学着去噪。可文本是<em>离散</em>的,不是连续的,没有现成的噪声可加。一锤定音的洞见是:<strong>掩码词元之于文本,正如噪声之于图像</strong>。正向过程把越来越多词元盖上,直到整句全是掩码;反向过程在提示的条件下学着揭开掩码、把句子重建出来。这类模型叫<strong>掩码扩散模型(MDM)</strong>,或扩散式大语言模型(DLLM)。想想写演讲稿:你不会一个字一个字地写,而是先打个提纲再逐节细化 —— 由粗到细,而不是严格从左到右。回报是速度:解码所需的前向次数少得多,有基准号称每秒输出词元约快 10 倍,这对编码很要紧,也让中间填空成了天生合适的场景。还没解决的:追平前沿质量,以及把思维链这类自回归的招数移植过来。值得一读:Large Language Diffusion Models(Nie 等,2025)。</p>"
        },
        {
          "name": "Closing thoughts: open research, hardware, uses, and what is next",
          "nameZh": "结语:开放研究、硬件、用途与未来",
          "body": "<p>Shervine closes on how the modalities trade ideas. Diffusion walked from images to text; transformers walked the other way and pushed convolutions out of image diffusion (DiT); DeepSeek-OCR rebuilt text from a handful of vision tokens, a hint that the tokenizer may not be the right tool; RoPE got rewritten in 2D for images. He wants one thing clear: foundational Transformer research is wide open and far from settled. Optimizers (AdamW versus the newer MuonClip from Kimi K2), normalization (post-norm gave way to pre-norm, layer-norm to RMSNorm), attention design (MHA, MQA, GQA shuffled around per layer and per paper), activations (ReLU drifting toward GELU-like functions), MoE or not, how many layers — all still argued over. <strong>Data</strong> is the worry. The web is now soaked in LLM-generated text, which risks <em>model collapse</em>: feed models their own less-diverse output and they learn less. The answer is careful data curation plus a new <em>mid-training</em> stage on smaller, higher-quality corpora. The field is sliding off pure benchmark-chasing toward the cost/quality Pareto frontier — hence small language models (SLMs), since providers reportedly lose money even on their top tiers. On <strong>hardware</strong>: GPUs really only do matrix multiplies well, yet attention keeps reading and writing KV. One analog in-memory computing paper bakes the operations into the chip and claims up to roughly 100x lower latency and 70,000x less energy than an H100. The everyday <strong>uses</strong> are already here — coding, conversational assistants, creative drafts, learning. Shervine singles out students who brainstorm concepts with ChatGPT to learn faster, and says now is a great time to be learning. Next up: agents made usable for everyone (Google Workspace), assistants that act at the browser and OS level (Atlas), maybe customer service that's actually worth talking to. The <strong>challenges</strong> that stick around: fixed weights versus learning continuously, hallucinations (arguably baked into next-token prediction), personalization, interpretability, safety. To keep up: arXiv cs.CL, NeurIPS/ICML/ICLR/ACL, the authors' own GitHub, Hugging Face trending papers, Twitter/X, and YouTube teachers like Yannic Kilcher and Andrej Karpathy. The instructors thank the class, and the teddy bear takes one last bow.</p>",
          "bodyZh": "<p>Shervine 收尾时讲模态之间怎么互换主意。扩散从图像走到文本;Transformer 走了反方向,把卷积挤出了图像扩散(DiT);DeepSeek-OCR 用区区几个视觉词元重建出文本,暗示分词器未必是对的工具;RoPE 被改写成二维以用于图像。他想把一件事说清楚:Transformer 的基础研究敞着大门,远没定论。优化器(AdamW 对上来自 Kimi K2 的较新 MuonClip)、归一化(后置归一化让位给前置归一化,层归一化让位给 RMSNorm)、注意力设计(MHA、MQA、GQA 在不同层、不同论文里换着用)、激活函数(ReLU 漂向类 GELU 的函数)、用不用 MoE、几层 —— 全都还在吵。<strong>数据</strong>是心病。如今网络被大语言模型生成的文本泡透了,这有<em>模型崩溃</em>之险:拿模型自己那些不够多样的输出再去喂它,它就学得越来越少。对策是仔细筛数据,外加一个新的<em>中期训练</em>阶段,在更小、更高质量的语料上做。这个领域正从单纯刷基准滑向成本与质量的帕累托前沿 —— 于是有了小语言模型(SLM),因为据说服务商连最高档套餐都在亏钱。说到<strong>硬件</strong>:GPU 真正擅长的只有矩阵乘法,可注意力一直在读写 KV。有一篇模拟内存内计算的论文把这些操作直接烧进芯片,号称相对 H100 延迟最多低约 100 倍、能耗少约 70000 倍。日常<strong>用途</strong>已经摆在眼前 —— 编码、对话助手、创意初稿、学习。Shervine 特别点名那些用 ChatGPT 头脑风暴概念、学得更快的学生,说现在正是学东西的好时候。接下来:让人人都用得上的智能体(Google Workspace)、在浏览器和操作系统层面替你动手的助手(Atlas),也许还有真正值得对话的客服。甩不掉的<strong>挑战</strong>:固定权重对上持续学习、幻觉(可以说是下一个词元预测里天生带的)、个性化、可解释性、安全。想跟上:arXiv 的 cs.CL、NeurIPS/ICML/ICLR/ACL、作者自己的 GitHub、Hugging Face 的热门论文、Twitter/X,以及 Yannic Kilcher 和 Andrej Karpathy 这样的 YouTube 老师。两位讲师向全班道谢,泰迪熊最后谢了一次幕。</p>"
        }
      ],
      "takeaways": [
        "The course stacks into one pipeline: tokens and embeddings, self-attention and the Transformer, LLMs and MoE, scaling and efficient training, then SFT, preference tuning, RL reasoning (PPO then GRPO), RAG, tools, agents and evaluation.",
        "Self-attention is the load-bearing idea, and it travels: a text token is just a vector, so the same encoder classifies image patches (Vision Transformer), beating CNNs given enough data despite a weaker inductive bias.",
        "Ideas cross both ways between modalities: diffusion LLMs treat the mask token as text's noise, decoding in far fewer passes (around 10x faster), with coding and fill-in-the-middle as natural fits.",
        "Foundational Transformer research is unsettled — optimizers (MuonClip), normalization (RMSNorm, pre-norm), attention variants, activations and MoE choices still differ paper to paper, and the Transformer may not be the last word.",
        "Data quality (dodging model collapse, adding a mid-training stage), the cost/quality Pareto frontier and small models, and analog attention-native hardware are the frontiers now opening up.",
        "Six months from now half of this will be out of date. The foundations won't be — attention, scaling, alignment, evaluation are the words you'll still be using; the open problems are continuous learning, hallucination, personalization, interpretability and safety, so build things and keep up via arXiv, conferences, GitHub and teachers like Karpathy."
      ],
      "takeawaysZh": [
        "整门课叠成一条流水线:词元与嵌入、自注意力与 Transformer、大语言模型与 MoE、扩展与高效训练,再到 SFT、偏好微调、强化学习推理(先 PPO 后 GRPO)、RAG、工具、智能体与评测。",
        "自注意力是那根承重梁,而且能搬家:文本词元不过是向量,同一个编码器也能给图像块分类(视觉 Transformer),归纳偏置更弱却在数据足够时赢过卷积网络。",
        "思想在模态之间双向穿行:扩散式大语言模型把掩码词元当作文本的噪声,所需前向次数少得多(约快 10 倍),编码和中间填空是天生合适的场景。",
        "Transformer 的基础研究尚无定论 —— 优化器(MuonClip)、归一化(RMSNorm、前置归一化)、注意力变体、激活函数和用不用 MoE,各论文之间都还不一样,Transformer 也未必是终点。",
        "数据质量(躲开模型崩溃、加一个中期训练阶段)、成本与质量的帕累托前沿与小模型,以及为注意力原生设计的模拟硬件,是眼下正打开的几条前沿。",
        "半年后,这里一半内容会过时。但地基不会:注意力、扩展、对齐、评测,你以后还得天天用这几个词;敞着的难题是持续学习、幻觉、个性化、可解释性与安全,所以动手做东西,并靠 arXiv、会议、GitHub 以及 Karpathy 这样的老师跟上。"
      ],
      "refs": [
        {
          "t": "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (Dosovitskiy et al., 2020)",
          "u": "https://arxiv.org/abs/2010.11929",
          "tZh": "一图胜过 16x16 个词:把 Transformer 用于大规模图像识别,即视觉 Transformer / ViT(原名 An Image is Worth 16x16 Words, 2020)"
        },
        {
          "t": "Visual Instruction Tuning — LLaVA (Liu et al., 2023)",
          "u": "https://arxiv.org/abs/2304.08485",
          "tZh": "视觉指令微调,即视觉语言模型 LLaVA,把图像词元粘到文本词元上(原名 Visual Instruction Tuning, 2023)"
        },
        {
          "t": "Large Language Diffusion Models — LLaDA (Nie et al., 2025)",
          "u": "https://arxiv.org/abs/2502.09992",
          "tZh": "大语言扩散模型 LLaDA,讲透掩码扩散为何能用来生成文本的数学原理(原名 Large Language Diffusion Models, 2025)"
        },
        {
          "t": "Scalable Diffusion Models with Transformers — DiT (Peebles & Xie, 2022)",
          "u": "https://arxiv.org/abs/2212.09748",
          "tZh": "用 Transformer 顶替卷积的可扩展扩散模型 DiT(原名 Scalable Diffusion Models with Transformers, 2022)"
        },
        {
          "t": "DeepSeek-OCR: Contexts Optical Compression (Wei et al., 2025)",
          "u": "https://arxiv.org/abs/2510.18234",
          "tZh": "用极少视觉词元重建文本,暗示分词器未必最优(原名 DeepSeek-OCR: Contexts Optical Compression, 2025)"
        },
        {
          "t": "Kimi K2: Open Agentic Intelligence (Kimi Team, 2025)",
          "u": "https://arxiv.org/abs/2507.20534",
          "tZh": "提出 MuonClip 优化器,撼动 AdamW 的标准地位(原名 Kimi K2: Open Agentic Intelligence, 2025)"
        },
        {
          "t": "The Curse of Recursion: Training on Generated Data Makes Models Forget (Shumailov et al., 2023)",
          "u": "https://arxiv.org/abs/2305.17493",
          "tZh": "拿生成数据训练会导致模型崩溃、数据多样性下降(原名 The Curse of Recursion, 2023)"
        },
        {
          "t": "Analog in-memory computing attention mechanism for fast and energy-efficient LLMs (Leroux et al., 2025)",
          "u": "https://arxiv.org/abs/2409.19315",
          "tZh": "为注意力原生设计的模拟内存内计算硬件,号称相对 H100 大幅降低延迟与能耗(原名 Analog in-memory computing attention mechanism, 2025)"
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
