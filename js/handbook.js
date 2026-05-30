/* 机器学习的概率视角 — 由官方文档经并行 agent 逐章排版、转写公式后装配而成。MathJax: \( \) 与 \[ \]。 */

const HANDBOOK = {
  "meta": {
    "title": "机器学习的概率视角",
    "subtitle": "从「承认 y 是随机的」到 Scaling Law 的完整逻辑链",
    "date": "2026 · 硬核推导手册"
  },
  "chapters": [
    {
      "num": "引",
      "slug": "intro",
      "title": "引言:这份手册的目标",
      "sections": [
        {
          "title": "这份手册的目标",
          "body": "<p>本手册把一次完整的机器学习学习对话整理成一条自洽的逻辑链。它不是知识点的堆砌,而是按照 <strong>世界观 → 方法论 → 动力学 → 诊断学</strong> 的顺序,从最底层的「数据为什么是随机的」一路推导到现代深度学习的 Scaling Law。</p><p>核心立场只有一句:<strong>机器学习是在统计学、微积分与概率论的交汇处,对高维空间中的复杂分布做统计估计。</strong>因此每一个公式(Sigmoid、Softmax、MSE、交叉熵、L1/L2 正则)都不是工程上拍脑袋的产物,而是某个概率假设下的数学必然。</p><p><strong>相对原始对话,本手册补全 / 修正了以下内容:</strong></p><ol><li>补全了偏差-方差分解中两处交叉项为零的完整证明;</li><li>补全了 Sigmoid 导数 \\( \\sigma' = \\sigma(1-\\sigma) \\) 的证明,以及 Softmax 梯度 \\( \\partial J/\\partial z = p - y \\) 的通用推导(原对话只给了「正确类别」的简化版);</li><li>补全了 Adam 的<strong>偏差修正</strong>项(bias correction),这是原对话省略、但实际不可或缺的一步;</li><li>补充了「为什么分类不能用 MSE」的定量解释(梯度消失 vs 非凸);</li><li>补充了 Huber Loss 的精确公式,并整理了 Focal / 对比 / 排序损失;</li><li>把原对话里反复出现的多份总结合并为一条统一逻辑链,去掉重复,并补上了估计理论(无偏、有效、一致、贝塞尔校正、频率派 vs 贝叶斯派)。</li></ol>"
        }
      ]
    },
    {
      "num": "01",
      "slug": "ch1",
      "title": "为什么 y 是随机的",
      "sections": [
        {
          "title": "引言",
          "body": "<p>一切的起点，是承认我们的无知。要理解后面所有的概率建模，必须先把视角从「硬盘上那一列固定的标签」切换到「产生这些标签的上帝过程」。</p>"
        },
        {
          "title": "1.1 上帝视角 vs 人类视角",
          "body": "<p>真实的数据生成过程可以写成：</p>\\[ y = f(x) + \\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, \\sigma^2) \\]<ul><li>\\( f(x) \\)</li><li>\\( \\epsilon \\)</li><li>\\( y \\)</li></ul><p><strong>思想实验（自由落体）：</strong>\\( x = 10 \\)</p>"
        },
        {
          "title": "1.2 噪声的两个来源",
          "body": "<p><strong>(A) 测量误差。</strong> 秒表的反应、尺子的刻度、传感器的抖动；在分类里则是标注员看花了眼。</p><p><strong>(B) 未观测变量（这才是大头）。</strong> 假设决定房价的真实因素有 1000 个，而你只采集了「面积」这一个特征：</p>\\[ y = \\underbrace{w_1 \\cdot x_{\\text{面积}}}_{\\text{你的模型}} + \\underbrace{\\left(w_2 \\cdot \\text{位置} + \\cdots + w_{1000} \\cdot \\text{昨晚是否下雨}\\right)}_{\\text{全都坍缩成噪声}\\ \\epsilon} \\]<p>当你只看面积时，两套 100 平米的房子价格忽高忽低，在你眼里就是「随机」。</p><blockquote><p><strong>一句话：随机性是「无知」的代名词。</strong>\\( y \\)</p></blockquote>"
        },
        {
          "title": "1.3 分类任务里的随机性：贝叶斯误差",
          "body": "<p>分类的标签是离散的，随机性体现为「标签重叠」或<strong>贝叶斯误差 (Bayes Error)</strong>。</p><p>\\( x \\)</p>"
        },
        {
          "title": "1.4 随机变量的严格辨析",
          "body": "<p>这是后续所有推导的符号地基。在一个<strong>固定的测试点</strong>\\( x \\)</p><table><thead><tr><th>符号</th><th>名称</th><th>属性</th><th>含义</th></tr></thead><tbody><tr><td>\\( x \\)</td><td>输入特征</td><td>常量</td><td>我们选定的考题</td></tr><tr><td>\\( f(x) \\)</td><td>真实函数</td><td>常量</td><td>标准答案，上帝定的，不随数据变</td></tr><tr><td>\\( \\epsilon \\)</td><td>噪声</td><td>随机变量</td><td>测量抖动 / 贝叶斯随机性</td></tr><tr><td>\\( y \\)</td><td>标签</td><td>随机变量</td><td>\\( y = f(x) + \\epsilon \\)</td></tr><tr><td>\\( D \\)</td><td>训练集</td><td>随机变量</td><td>\\( (x, y) \\)</td></tr><tr><td>\\( \\hat{f}(x) \\)</td><td>模型估计</td><td>随机变量</td><td>\\( D \\)</td></tr><tr><td>\\( \\hat{y} \\)</td><td>最终预测</td><td>随机变量</td><td>\\( \\hat{f} \\)</td></tr></tbody></table><p><strong>逻辑链：数据随机抽样（</strong>\\( D \\) <strong>随机）→ 吃数据的模型随机生成（</strong>\\( \\hat{f} \\) <strong>随机）→ 模型的预测随机波动（</strong>\\( \\hat{f}(x) \\) <strong>随机）。</strong>\\( \\mathbb{E}[\\cdot] \\)</p>"
        },
        {
          "title": "\\( \\hat{f}(x) \\)",
          "body": "<p>在严格理论里两者有别：</p><ul><li><strong>回归：</strong>\\( \\hat{y} = \\hat{f}(x) \\)</li><li><strong>分类（含 LLM）：</strong>\\( \\hat{f}(x) \\) <strong>概率分布 / logits</strong> \\( \\hat{y} = \\arg\\max \\hat{f}(x) \\) <strong>预测类别</strong> \\( 0.51 \\) <strong>理论分析用</strong> \\( \\hat{f} \\) <strong>，实际部署算指标用</strong> \\( \\hat{y} \\) <strong>。</strong></li></ul>"
        },
        {
          "title": "\\( y \\)",
          "body": "<p>\\( y \\) <strong>包含噪声</strong> \\( f(x) \\) <em>「the model is fitting the noise in the ground truth」</em> \\( y \\)</p>"
        }
      ]
    },
    {
      "num": "02",
      "slug": "ch2",
      "title": "从概率假设到模型:广义线性模型 (GLM)",
      "sections": [
        {
          "title": "2.1 二分类 → Sigmoid（从对数几率反解）",
          "body": "<p><strong>服从什么分布</strong> \\( z = w^\\top x + b \\)</p><p>下面三个激活函数都不是被「设计」出来的，而是被概率假设「逼」出来的。</p><p>\\( p \\in [0,1] \\)</p><p><strong>第一步</strong> \\( [0,1] \\)</p><p><strong>第二步</strong> \\( [0, +\\infty) \\)</p><p>\\[ \\ln\\left(\\frac{p}{1-p}\\right) = z \\]</p><p><strong>第三步</strong> \\( p \\)</p><p>\\[ \\frac{p}{1-p} = e^z \\;\\Rightarrow\\; p = e^z(1-p) \\;\\Rightarrow\\; p(1+e^z) = e^z \\]</p><p>\\[ p = \\frac{e^z}{1+e^z} = \\frac{1}{1+e^{-z}} = \\sigma(z) \\]</p><blockquote>这正是「为什么非要用 Sigmoid，而不是别的 S 形曲线」的答案：它是「线性模型拟合对数几率」这一假设的数学反解。</blockquote>"
        },
        {
          "title": "2.2 多分类 → Softmax（非负化 + 归一化）",
          "body": "<p>\\( K \\)</p><p>\\[ p_k = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}} \\]</p>"
        },
        {
          "title": "2.3 回归 → 恒等映射",
          "body": "<p>\\( y \\)</p>"
        },
        {
          "title": "2.4 GLM 映射总表",
          "body": "<table><thead><tr><th>任务</th><th>假设分布</th><th>取值范围</th><th>逆链接函数（激活）</th></tr></thead><tbody><tr><td>回归（房价）</td><td>高斯 Gaussian</td><td>\\( (-\\infty, \\infty) \\)</td><td>Identity</td></tr><tr><td>二分类（是非）</td><td>伯努利 Bernoulli</td><td>\\( \\{0,1\\} \\)</td><td>Sigmoid</td></tr><tr><td>多分类（预测词）</td><td>类别 Categorical</td><td>\\( \\sum = 1 \\)</td><td>Softmax</td></tr><tr><td>计数（人流量）</td><td>泊松 Poisson</td><td>\\( [0, \\infty) \\)</td><td>\\( \\exp(\\cdot) \\)</td></tr></tbody></table><blockquote><strong>术语严谨性：</strong> 单次试验的多分类对应 <strong>Categorical 分布</strong> \\( n \\) <code>Categorical</code>。</blockquote>"
        }
      ]
    },
    {
      "num": "03",
      "slug": "ch3",
      "title": "极大似然:损失函数是怎么算出来的",
      "sections": [
        {
          "title": "3.1 回归 → MSE（高斯假设）",
          "body": "<p>有了分布假设，用<strong>极大似然估计 (MLE)</strong> 求 \\( w \\)：</p><p>\\[ \\text{Maximize } L(w) \\iff \\text{Minimize } -\\ln L(w) \\]</p><p>假设噪声 \\( \\epsilon \\sim \\mathcal{N}(0, \\sigma^2) \\)：</p><p>\\[ L(w) = \\prod_{i=1}^{m} \\frac{1}{\\sqrt{2\\pi}\\,\\sigma} \\exp\\left( -\\frac{(y^{(i)} - w^{\\top} x^{(i)})^2}{2\\sigma^2} \\right) \\]</p><p>取对数：</p><p>\\[ \\ln L(w) = \\underbrace{m \\cdot C}_{\\text{常数}} - \\frac{1}{2\\sigma^2} \\sum_{i=1}^{m} \\left( y^{(i)} - \\hat{y}^{(i)} \\right)^2 \\]</p><p>所以对 \\( w \\)：</p><p>\\[ \\text{Maximize } \\ln L \\iff \\text{Minimize } \\sum_{i} (y^{(i)} - \\hat{y}^{(i)})^2 = \\text{MSE} \\]</p><blockquote>这就是「为什么回归默认用平方损失」：它等价于「误差服从高斯分布」。若噪声是重尾的，MSE 在统计上未必合理（见 3.6）。</blockquote>"
        },
        {
          "title": "3.2 二分类 → BCE（伯努利假设）",
          "body": "<p>\\[ P(y \\mid x) = \\hat{y}^{\\,y} (1 - \\hat{y})^{1-y} \\]</p><p>\\[ J(w) = -\\sum_{i=1}^{m} \\left[ y^{(i)} \\ln \\hat{y}^{(i)} + (1 - y^{(i)}) \\ln(1 - \\hat{y}^{(i)}) \\right] \\]</p><p>即二元交叉熵 (Binary Cross Entropy)。</p>"
        },
        {
          "title": "3.3 多分类 → 交叉熵（类别分布）",
          "body": "<p>对真实类别 \\( y \\)：</p><p>\\[ J = -\\sum_{k=1}^{K} y_k \\ln p_k \\]</p><p>这就是<strong>交叉熵</strong>——它不是被发明出来的，而是类别分布在 MLE 下的自然产物。</p>"
        },
        {
          "title": "3.4 加权损失 \\( \\sum g_y \\ell \\)",
          "body": "<p>在 MLE 基础上人为放大某些样本的重要性，用于<strong>类别不平衡</strong>，例如 \\( g_0 = 1,\\ g_1 = 9900/100 = 99 \\)：</p><p>\\[ J = -\\sum_{i} g_{y_i} \\ln P(y_i \\mid x_i) \\]</p><p>\\[ \\nabla(g_y \\ell) = g_y \\nabla \\ell \\]</p>"
        },
        {
          "title": "3.5（补充）为什么分类不能用 MSE",
          "body": "<p>两个理由，都很硬：</p><p><strong>(1) 非凸。</strong>套上 \\( \\sigma(z) \\) 后，MSE 关于参数不再是凸函数。</p><p><strong>(2) 梯度消失（更致命）。</strong>对 \\( w \\) 求导：</p><p>\\[ \\frac{\\partial}{\\partial w} (\\sigma(z) - y)^2 = 2(\\hat{y} - y) \\cdot \\underbrace{\\sigma'(z)}_{= \\hat{y}(1 - \\hat{y})} \\cdot x \\]</p><p>当 \\( \\hat{y} \\to 0 \\) 时，梯度也趋近于 0。</p>"
        },
        {
          "title": "3.6（补充）其他损失的设计哲学",
          "body": "<p>设计损失，本质是回答两件事：<strong>我们到底想要什么（目标）</strong>、<strong>犯错时怎么罚才利于改正（梯度特性）</strong>。</p><ul><li><strong>MAE（L1 Loss）</strong>：\\( |y - \\hat{y}| \\)，对应<strong>拉普拉斯</strong>噪声假设。</li><li><strong>Huber Loss</strong>（MSE 与 MAE 的缝合）：误差小用平方（平滑好收敛），误差大用绝对值（抗离群）。</li></ul><p>\\[ L_{\\delta}(a) = \\begin{cases} \\frac{1}{2} a^2, & |a| \\le \\delta \\\\ \\delta(|a| - \\frac{1}{2}\\delta), & |a| > \\delta \\end{cases} \\qquad a = y - \\hat{y} \\]</p><ul><li><strong>Focal Loss</strong>：\\( L = -(1 - p)^{\\gamma} \\log p \\)。</li><li><strong>对比损失 (Contrastive)</strong>：\\( \\text{Dist}(\\text{正}) - \\text{Dist}(\\text{负}) + \\text{Margin} \\)。</li><li><strong>排序损失 (Ranking, RLHF)</strong>：\\( L = -\\log \\sigma\\big( r(x_w) - r(x_l) \\big) \\)。</li></ul>"
        }
      ]
    },
    {
      "num": "04",
      "slug": "ch4",
      "title": "梯度与反向传播",
      "sections": [
        {
          "title": "4.1 梯度下降：蒙眼下山",
          "body": "<p>\\( w \\) <strong>链式法则（反向传播）</strong>。</p><p>单参数情形，参数更新公式：</p><p>\\[ \\theta_{\\text{new}} \\leftarrow \\theta_{\\text{old}} - \\eta \\cdot \\frac{dL}{d\\theta} \\]</p><ul><li>导数符号给方向：要逆着梯度走（梯度指向上山方向，最小化需减去它）；</li><li>\\( \\eta \\)</li></ul><p>\\( \\nabla L \\)</p><p>\\[ \\theta \\leftarrow \\theta - \\eta \\cdot \\nabla L(\\theta) \\]</p><p><strong>极简验证：</strong>\\( L(\\theta) = \\theta^2 \\)</p>"
        },
        {
          "title": "4.2 链式法则：剥洋葱",
          "body": "<p>\\[ L = \\big( w_3(w_2(w_1 x)) - y \\big)^2 \\]</p><p><strong>整体变化率 = 链路上每环局部变化率之积。</strong> 这使每个节点只需做「接收上游梯度 → 乘以本地导数 → 回传」，无论网络多深都能模块化求解。</p>"
        },
        {
          "title": "4.3 万能梯度 \\( (\\hat{y} - y)\\, x \\) 的完整推导",
          "body": "<p>\\[ z = w \\cdot x \\]</p><p>\\[ \\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\frac{\\partial \\hat{y}}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w} \\]</p><p><strong>①</strong> \\( L \\) <strong>对</strong> \\( \\hat{y} \\)<strong>：</strong></p><p>\\[ \\frac{\\partial L}{\\partial \\hat{y}} = -\\frac{y}{\\hat{y}} + \\frac{1-y}{1-\\hat{y}} = \\frac{-y(1-\\hat{y}) + \\hat{y}(1-y)}{\\hat{y}(1-\\hat{y})} = \\frac{\\hat{y} - y}{\\hat{y}(1-\\hat{y})} \\]</p><p><strong>② Sigmoid 的导数（补全证明</strong> \\( \\sigma' = \\sigma(1-\\sigma) \\)<strong>）：</strong>\\( \\sigma(z) = (1 + e^{-z})^{-1} \\)</p><p>\\[ \\sigma'(z) = -(1 + e^{-z})^{-2} \\cdot (-e^{-z}) = \\frac{1}{1 + e^{-z}} \\cdot \\frac{e^{-z}}{1 + e^{-z}} = \\sigma(z)\\big(1 - \\sigma(z)\\big) \\]</p><p>\\[ \\frac{e^{-z}}{1 + e^{-z}} = 1 - \\frac{1}{1 + e^{-z}} \\]</p><p><strong>③</strong> \\( z \\) <strong>对</strong> \\( w \\)<strong>：</strong>\\( \\dfrac{\\partial z}{\\partial w} = x \\)</p><p><strong>合体（约分见证奇迹）：</strong></p><p>\\[ \\frac{\\partial L}{\\partial w} = \\underbrace{\\frac{\\hat{y} - y}{\\hat{y}(1-\\hat{y})}}_{①} \\cdot \\underbrace{\\hat{y}(1-\\hat{y})}_{②} \\cdot \\underbrace{x}_{③} = \\boxed{(\\hat{y} - y)\\, x} \\]</p><p>分母与 Sigmoid 导数完美抵消。</p>"
        },
        {
          "title": "4.4 Softmax 梯度 \\( \\partial J/\\partial z = p - y \\) 的通用推导",
          "body": "<p>原对话只算了「正确类别」那一项，这里给<strong>任意类别</strong> \\( k \\)</p><p>\\[ \\frac{\\partial p_i}{\\partial z_j} = \\begin{cases} p_i(1 - p_i), & i = j \\\\ -p_i p_j, & i \\neq j \\end{cases} \\]</p><p>\\[ J = -\\sum_i y_i \\ln p_i \\]</p><p>\\[ \\begin{aligned} \\frac{\\partial J}{\\partial z_k} &= -\\sum_i \\frac{y_i}{p_i} \\frac{\\partial p_i}{\\partial z_k} = -\\frac{y_k}{p_k} p_k(1 - p_k) - \\sum_{i \\neq k} \\frac{y_i}{p_i}\\big(-p_i p_k\\big) \\\\ &= -y_k(1 - p_k) + p_k \\sum_{i \\neq k} y_i = -y_k + p_k \\sum_i y_i = p_k - y_k \\end{aligned} \\]</p><p>\\( \\sum_i y_i = 1 \\)<strong>结论：无论二分类（Sigmoid+BCE）还是多分类（Softmax+CE），对 logits 的梯度都是</strong> \\( p - y \\)<strong>。</strong></p>"
        },
        {
          "title": "4.5 找回 \\( x \\)：从 logits 梯度到参数梯度",
          "body": "<p>\\( \\partial J/\\partial z = p - y \\)<strong>误差项</strong> \\( \\delta \\)</p><p>\\[ \\frac{\\partial J}{\\partial w} = \\underbrace{(p - y)}_{\\partial J/\\partial z} \\cdot \\underbrace{x}_{\\partial z/\\partial w} = (p - y)\\, x \\]</p><p>\\( W \\)</p><p>\\[ \\nabla_W = \\delta\\, x^{\\top}, \\qquad (K \\times 1) \\times (1 \\times D) \\rightarrow (K \\times D) \\]</p>"
        },
        {
          "title": "4.6 物理意义：归责机制",
          "body": "<p>\\( (p - y)\\, x \\)<strong>误差</strong> \\( (p - y) \\) <strong>指明方向，输入</strong> \\( x \\) <strong>决定力度</strong>：</p><ul><li>\\( x \\)</li><li>\\( x \\)</li><li>\\( x = 0 \\)</li></ul><blockquote><p><strong>统一性（指数族）：</strong>\\( (\\hat{y} - y)x \\)<strong>广义线性模型</strong>的指数族分布，形式上的统一保证了同一套算法能解各种回归/分类问题。</p></blockquote>"
        }
      ]
    },
    {
      "num": "05",
      "slug": "ch5",
      "title": "正则化的概率解释:从 MLE 到 MAP",
      "sections": [
        {
          "title": "5.1 L2 正则 ← 高斯先验",
          "body": "<p>正则化不是「人为的工程手段」,而是概率论的必然推论。</p><ul><li><strong>不加正则 = MLE:</strong> 完全信赖数据;</li><li><strong>加正则 = MAP(最大后验):</strong> 信数据,也带入自己的先验偏见。</li></ul><p>\\( P(\\text{Data}) \\)</p><p>\\( P(w \\mid D) \\propto P(D \\mid w) \\cdot P(w) \\)</p><p>取负对数后最小化:</p><p>\\[ \\underbrace{-\\ln P(D \\mid w)}_{\\text{原始 Loss(似然)}} + \\underbrace{(-\\ln P(w))}_{\\text{正则项(先验)}} \\]</p><p><strong>结论:正则项就是参数先验的负对数</strong> \\( -\\ln P(w) \\)<strong>。</strong></p><p>\\( w \\sim \\mathcal{N}(0, \\tau^2) \\)</p><p>\\[ -\\ln P(w) \\propto \\frac{1}{2\\tau^2} w^2 \\Rightarrow \\text{Loss}_{\\text{total}} = \\text{Loss}_{\\text{data}} + \\lambda \\lVert w \\rVert^2, \\quad \\lambda = \\frac{1}{2\\tau^2} \\]</p><p>\\( \\tau^2 \\)<strong>橡皮筋效应</strong>\\( w \\)</p>"
        },
        {
          "title": "5.2 L1 正则 ← 拉普拉斯先验",
          "body": "<p>\\( w \\sim \\text{Laplace}(0, b) \\)</p><p>\\[ -\\ln P(w) \\propto \\frac{1}{b} |w| \\Rightarrow \\text{Loss}_{\\text{total}} = \\text{Loss}_{\\text{data}} + \\lambda |w|, \\quad \\lambda = \\frac{1}{b} \\]</p>"
        },
        {
          "title": "5.3 几何直觉:为什么 L1 能把参数压到 0",
          "body": "<p>\\( w_1^2 + w_2^2 \\leq C \\)</p><ul><li><strong>L2(圆)光滑</strong>\\( w_1, w_2 \\)</li><li><strong>L1(菱形)有尖角</strong>(恰在坐标轴上):等高线极易撞上尖角,一旦撞上就意味着某个分量精确为 0。</li></ul><p>因此 L1 产生<strong>稀疏解</strong>,可用于特征选择(1000 个特征里只留有用的 10 个)。</p>"
        },
        {
          "title": "5.4 正则化方法总表",
          "body": "<table><thead><tr><th>方法</th><th>先验分布</th><th>物理含义</th><th>优化目标</th></tr></thead><tbody><tr><td>无</td><td>均匀 Uniform</td><td>\\( w \\)</td><td>MLE</td></tr><tr><td>L2 (Ridge)</td><td>高斯 Gaussian</td><td>\\( w \\)</td><td>\\( \\text{MLE} + \\lambda \\lVert w \\rVert^2 \\)</td></tr><tr><td>L1 (Lasso)</td><td>拉普拉斯 Laplace</td><td>\\( w \\)</td><td>\\( \\text{MLE} + \\lambda |w| \\)</td></tr></tbody></table>"
        },
        {
          "title": "5.5 另类正则化:Dropout",
          "body": "<p>训练时随机「杀掉」一部分神经元(如 50%)。每次网络结构都不同,迫使神经元不依赖特定队友、各自提取更鲁棒的特征;宏观上相当于同时训练大量子网络再做平均(Ensemble),从而降低方差。</p><blockquote><p><strong>对 Agent 的启示:</strong> 设 <code>weight_decay=0.01</code>,本质是在告诉优化器「我相信参数服从某方差的高斯分布,别为了拟合几个坏数据让某些参数变得巨大」。</p></blockquote>"
        }
      ]
    },
    {
      "num": "06",
      "slug": "ch6",
      "title": "偏差-方差分解:误差从哪来",
      "sections": [
        {
          "title": "第六章 偏差-方差分解:误差从哪来",
          "body": "<p>这是泛化能力的「圣杯」,把期望泛化误差像外科手术一样拆成三块。</p>"
        },
        {
          "title": "6.1 打靶比喻",
          "body": "<ul><li><strong>偏差 Bias(准头不行):</strong> 弹孔中心离靶心多远 → 模型太简单,抓不住规律(欠拟合);</li><li><strong>方差 Variance(手不稳):</strong> 弹孔散得多开 → 模型太敏感,换点数据预测就剧变(过拟合);</li><li><strong>噪声 Noise(靶子在抖):</strong> 数据本身的随机性 → 不可约误差。</li></ul>"
        },
        {
          "title": "6.2 符号设定",
          "body": "<p>\\( x \\)</p>"
        },
        {
          "title": "6.3 完整推导(补全两处交叉项为零的证明)",
          "body": "<p>\\[ \\mathrm{Err}(x) = \\mathbb{E}\\left[(y - \\hat{f})^2\\right] \\]</p><p><strong>第一层:分离噪声。</strong>\\( y = f + \\epsilon \\)</p><p>\\[ \\begin{aligned} \\mathrm{Err}(x) &= \\mathbb{E}\\left[(f + \\epsilon - \\hat{f})^2\\right] = \\mathbb{E}\\left[((f - \\hat{f}) + \\epsilon)^2\\right] \\\\ &= \\mathbb{E}\\left[(f - \\hat{f})^2\\right] + \\mathbb{E}[\\epsilon^2] + 2\\,\\mathbb{E}\\left[\\epsilon(f - \\hat{f})\\right] \\end{aligned} \\]</p><p>\\( \\mathbb{E}[\\epsilon^2] = \\sigma^2 \\)<strong>交叉项 1 为零</strong>\\( \\epsilon \\)</p><p>\\[ \\mathbb{E}\\left[\\epsilon(f - \\hat{f})\\right] = \\mathbb{E}[\\epsilon] \\cdot \\mathbb{E}[f - \\hat{f}] = 0 \\cdot (\\cdots) = 0 \\]</p><p>\\[ \\mathrm{Err}(x) = \\mathbb{E}\\left[(f - \\hat{f})^2\\right] + \\sigma^2 \\]</p><p><strong>第二层:加一项减一项</strong> \\( \\bar{f} \\)<strong>。</strong></p><p>\\[ \\begin{aligned} \\mathbb{E}\\left[(f - \\hat{f})^2\\right] &= \\mathbb{E}\\left[((f - \\bar{f}) + (\\bar{f} - \\hat{f}))^2\\right] \\\\ &= \\underbrace{(f - \\bar{f})^2}_{\\text{常量}} + \\underbrace{\\mathbb{E}\\left[(\\bar{f} - \\hat{f})^2\\right]}_{\\text{方差定义}} + 2(f - \\bar{f})\\,\\mathbb{E}[\\bar{f} - \\hat{f}] \\end{aligned} \\]</p><p><strong>交叉项 2 为零</strong>\\( (f - \\bar{f}) \\)</p><p>\\[ \\mathbb{E}[\\bar{f} - \\hat{f}] = \\bar{f} - \\mathbb{E}[\\hat{f}] = \\bar{f} - \\bar{f} = 0 \\]</p><p>\\( \\bar{f} \\)</p><p><strong>最终合体:</strong></p><p>\\[ \\boxed{\\;\\mathbb{E}\\left[(y - \\hat{f}(x))^2\\right] = \\underbrace{(f - \\bar{f})^2}_{\\text{Bias}^2} + \\underbrace{\\mathbb{E}\\left[(\\hat{f} - \\bar{f})^2\\right]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Noise}}\\;} \\]</p>"
        },
        {
          "title": "6.4 三项的物理含义",
          "body": "<ul><li>\\( \\text{Bias}^2 = (f - \\bar{f})^2 \\)<strong>:</strong> 平均模型离真理多远 → 欠拟合。对策:加参数、换强模型、增加特征、减小正则。</li><li>\\( \\text{Variance} = \\mathbb{E}\\left[(\\hat{f} - \\bar{f})^2\\right] \\)<strong>:</strong> 单个模型相对平均模型的散布 → 过拟合。对策:加数据、加正则、降维、Bagging。</li><li>\\( \\text{Noise} = \\sigma^2 \\)<strong>:</strong> 改模型没用,只能清洗数据 / 换更好传感器 / 补充上下文。</li></ul>"
        },
        {
          "title": "6.5 诊断手册(用训练误差 vs 验证误差观测)",
          "body": "<p>现实中算不出真理,但能通过两个误差判断病因:</p><table><thead><tr><th>训练误差</th><th>验证误差</th><th>诊断</th><th>潜台词</th></tr></thead><tbody><tr><td>高</td><td>高</td><td>High Bias(欠拟合)</td><td>开卷考都不及格</td></tr><tr><td>低</td><td>高</td><td>High Variance(过拟合)</td><td>做过的题全对,变形就挂</td></tr><tr><td>低</td><td>低</td><td>理想</td><td>神功大成</td></tr><tr><td>高</td><td>更高</td><td>Bias & Variance 双高</td><td>又笨又躁</td></tr></tbody></table><p>它最大的用处是<strong>防止瞎忙活</strong>:High Bias 时去收集更多数据无用(能力天花板太低);High Variance 时去加层数有害(更过拟合)。</p>"
        },
        {
          "title": "6.6 与既有知识的联系",
          "body": "<ul><li><strong>正则化:</strong> 主动增加一点 Bias(限制参数灵活性)换取 Variance 的大幅下降,从而降低总误差。</li><li><strong>数据量:</strong> 通常不影响 Bias(结构定了,上限就定了),但能显著降低 Variance(噪声被平均掉)。</li><li><strong>集成学习:</strong>\\( \\mathrm{Var}\\left(\\frac{1}{n}\\sum X_i\\right) = \\frac{1}{n}\\mathrm{Var}(X) \\)</li></ul>"
        },
        {
          "title": "6.7 误差分解只能「权衡」吗",
          "body": "<p>不止。它是<strong>可操作的诊断 + 处方</strong>,把「玄学调参」变成「科学实验」:先问「是 Bias 高(没学会)还是 Variance 高(学偏了)」,方向立刻清晰。</p><p><strong>对 Agent 的具体指导:</strong></p><ul><li>Agent 答非所问、逻辑断裂 → High Bias → 换更强基座、Few-shot、Chain-of-Thought 降低单步推理难度;</li><li>Agent 改几个字就剧变、JSON 经常坏 → High Variance → 自洽采样 (Self-Consistency)、降低 Temperature、用语法约束 (GBNF) 人工消除方差。</li></ul>"
        }
      ]
    },
    {
      "num": "07",
      "slug": "ch7",
      "title": "概率统计补课:估计理论",
      "sections": [
        {
          "title": "7.1 点估计 vs 区间估计",
          "body": "<ul><li><strong>点估计:</strong> \\( \\hat{\\theta} \\)</li><li><strong>区间估计:</strong> \\( [\\hat{\\theta}_L, \\hat{\\theta}_U] \\)</li></ul>"
        },
        {
          "title": "7.2 好估计的三大黄金指标",
          "body": "<p><strong>(A) 无偏性 Unbiasedness(不歪):</strong> \\[ \\mathbb{E}[\\hat{\\theta}] = \\theta \\] <strong>故意</strong>牺牲无偏性(如 L2 把参数拉向 0)来换方差下降。</p><p><strong>(B) 有效性 Efficiency(得稳):</strong> 方差越小越好。<strong>Cramér–Rao 下界</strong> \\[ \\mathrm{Var}(\\hat{\\theta}) \\geq 1/I(\\theta) \\]</p><p><strong>(C) 一致性 Consistency(人多力量大):</strong> \\[ \\lim_{n \\to \\infty} P(|\\hat{\\theta} - \\theta| > \\epsilon) = 0 \\]</p>"
        },
        {
          "title": "7.3 样本方差为何除以 \\( n - 1 \\)",
          "body": "<p>\\( \\bar{x} \\) <strong>系统性地偏小</strong> \\( n \\) <strong>贝塞尔校正 (Bessel’s Correction)</strong>。</p>"
        },
        {
          "title": "7.4 两大门派",
          "body": "<ul><li><strong>频率派 → MLE:</strong> \\( \\theta \\)</li><li><strong>贝叶斯派 → MAP:</strong> 参数也是随机变量、数据是固定证据。「结合数据与经验(先验),最可能的参数是什么。」对应 Loss + 正则化。</li></ul>"
        },
        {
          "title": "7.5 机器学习 ↔ 统计学映射",
          "body": "<table><thead><tr><th>机器学习操作</th><th>统计学术语</th></tr></thead><tbody><tr><td>训练模型</td><td>参数估计</td></tr><tr><td>\\( w \\)</td><td>点估计量</td></tr><tr><td>Loss 函数</td><td>负对数似然</td></tr><tr><td>L2 正则</td><td>高斯先验</td></tr><tr><td>L1 正则</td><td>拉普拉斯先验</td></tr><tr><td>Dropout / Ensemble</td><td>近似贝叶斯推断</td></tr><tr><td>大数据训练</td><td>利用一致性逼近真理</td></tr></tbody></table>"
        }
      ]
    },
    {
      "num": "08",
      "slug": "ch8",
      "title": "从经典机器学习到深度学习",
      "sections": [
        {
          "title": "8.1 特征工程的诅咒",
          "body": "<p>\\( x \\) <strong>人工设计</strong> \\( x \\) <strong>模型自己把原始数据变成</strong> \\( x \\)</p><p>\\[ y = \\sigma(w^\\top x + b) \\]</p>"
        },
        {
          "title": "8.2 端到端：函数复合",
          "body": "<p>\\( x \\)</p><p>\\[ y = \\sigma\\Big( W_2 \\cdot \\underbrace{\\sigma(W_1 \\cdot \\mathrm{raw} + b_1)}_{\\text{学到的特征 } x} + b_2 \\Big) \\]</p><p>\\( y \\) <strong>End-to-End 学习</strong>。</p>"
        },
        {
          "title": "8.3 激活函数与万能逼近定理",
          "body": "<p>\\[ y = W_2(W_1\\,\\mathrm{raw}) = (W_2 W_1)\\,\\mathrm{raw} \\]</p><p><strong>弯曲空间的力量</strong>，引入非线性，使网络能逼近任意复杂函数——<strong>万能逼近定理 (Universal Approximation Theorem)</strong>。</p>"
        },
        {
          "title": "8.4 表示学习 = 信息瓶颈（压缩去噪）",
          "body": "<p>一个深刻的视角：<strong>神经网络是用来做表示学习的——要定义「学什么、什么不重要」，通过增加约束实现压缩去噪。</strong> 在数学上这对应<strong>信息瓶颈 (Information Bottleneck)</strong>\\( X \\)</p><p>\\[ \\min\\ \\underbrace{I(X;Z)}_{\\text{压缩输入}} \\quad \\text{s.t.} \\quad \\underbrace{I(Z;Y)}_{\\text{保留目标}}\\ \\text{最大} \\]</p><ul><li>\\( I(Z;Y) \\)</li><li>\\( I(X;Z) \\)</li></ul><blockquote><strong>深度学习的本质是「遗忘」。</strong> 学得好的模型，是那些知道该忘掉什么的模型。它在寻找<strong>最小充分统计量</strong>\\( Y \\)</blockquote>"
        },
        {
          "title": "8.5 架构 = 归纳偏置（不同约束）",
          "body": "<p>另一个关键洞察：<strong>不同的神经网络架构相当于不同的约束。</strong> 全连接 (MLP) 太自由（什么都背），于是我们人为加入「先验约束」——<strong>归纳偏置 (Inductive Bias)</strong>，强迫模型按我们理解世界的方式去看数据：</p><table><thead><tr><th>架构</th><th>施加的约束</th><th>对世界的假设</th></tr></thead><tbody><tr><td>MLP</td><td>无（all-to-all）</td><td>任意两像素都可能相关（效率极低）</td></tr><tr><td>CNN</td><td>局部性 + 平移不变</td><td>物体在哪都一样；像素只和邻近相关</td></tr><tr><td>RNN</td><td>时序性</td><td>现在取决于上一时刻；时间向前流</td></tr><tr><td>Transformer</td><td>关系性 + 排列不变</td><td>距离不重要，内容关联才重要</td></tr><tr><td>GNN</td><td>拓扑结构</td><td>只有相连的节点才有关系</td></tr></tbody></table><blockquote>设计新架构 = 设计一种新的约束方式，告诉模型「世界按这个规律运转，请在这个范围内找答案」。</blockquote>"
        },
        {
          "title": "8.6 两种噪声：输入噪声 ≠ 标签噪声",
          "body": "<p>注意区分（它们分处方程两端）：</p><ul><li><strong>标签噪声（输出端</strong> \\( y \\)<strong>）：</strong>\\( y = f(x) + \\epsilon \\)<strong>包容</strong>它（别死记硬背那 1% 标错的样本）。</li><li><strong>输入噪声 / 干扰变量 Nuisance（输入端</strong> \\( x \\)<strong>）：</strong> 阻碍看清本质的「迷雾」（背景、光照、坏点）。表示学习应<strong>剔除</strong>\\( Z \\)<strong>不变 (Invariant)</strong>。</li></ul><p><strong>反面教材——「被识别为狼的哈士奇」：</strong> 模型区分狼和哈士奇准确率很高，但它根本没看动物，只看背景<strong>有没有雪</strong>（训练集里狼多在雪地、哈士奇多在室内）。把「输入噪声」当成了「信号」，表示学习失败。</p>"
        },
        {
          "title": "8.7 流形假设",
          "body": "<p>表示学习的几何意义是<strong>流形假设 (Manifold Hypothesis)</strong>\\( 1000 \\times 1000 \\)<strong>这就是把数据从乱糟糟的高维空间映射到整齐的低维流形。</strong></p><blockquote><strong>从经典 ML 到 DL 的对照：</strong>\\( x \\)</blockquote>"
        }
      ]
    },
    {
      "num": "09",
      "slug": "ch9",
      "title": "过拟合消除史与 Scaling Law",
      "sections": [
        {
          "title": "9.1 两种 U 型曲线（极易混淆）",
          "body": "<p>人类对「过拟合」的恐惧，经历了三个阶段的逐步消除。</p><p>它们形状相同，但横轴含义完全不同：</p><ul><li><strong>复杂度维度（教科书版）：</strong> 横轴是模型复杂度（参数量），纵轴是测试误差。复杂度增大 → 测试误差先降后升（过拟合）。对应<strong>正则化 / 模型选择</strong>。</li><li><strong>时间维度（监控版）：</strong> 横轴是训练轮数 Epochs，纵轴是验证误差。训练太久 → 模型开始背噪声，验证误差反弹。对应 <strong>Early Stopping（早停）</strong>。</li></ul><p>两者本质相通：<strong>训练时间越长 ≈ 模型有效复杂度越高</strong>（初始参数接近 0 等效于简单模型，训练久了参数变精细等效于复杂模型）。</p>"
        },
        {
          "title": "9.2 阶段一：古典 ML —— 戴着镣铐跳舞（恐惧过拟合）",
          "body": "<p>手工特征 + 模型容量小。把模型搞太复杂，方差立刻爆炸（经典 U 型曲线）。心态：小心翼翼，靠特征工程精简输入、靠严格正则，在 U 型最低点停下。</p>"
        },
        {
          "title": "9.3 阶段二：深度学习 —— 双下降（发现良性过拟合）",
          "body": "<p>端到端学习把特征提取也交给数据。当参数量刚越过样本量的「插值阈值」时，方差确实会出现一个尖峰；但继续疯狂增大参数（<strong>过参数化</strong>），让模型大到足以轻松记住所有数据后，<strong>测试误差竟再次下降</strong>——这就是<strong>双下降 (Double Descent)</strong>。我们由此敢于做大模型。</p><blockquote><strong>时间维度也有双下降——Grokking（顿悟）：</strong> 验证误差升高时若不早停、硬训很久（哪怕训练误差早已为 0），验证误差会神奇地再次下降。模型在「死记硬背」一段时间后，突然把规则融会贯通成通用规律，泛化能力再次提升。</blockquote>"
        },
        {
          "title": "9.4 双下降的机制：高维空间稀释噪声",
          "body": "<p>\\( \\epsilon \\) <strong>方差的下降来自高维稀释，而非突破了统计极限。</strong></p>"
        },
        {
          "title": "9.5 SGD 的隐式正则化（为什么是 SGD 而不是架构独占功劳）",
          "body": "<p>在过参数化下，使训练误差为 0 的解有无穷多个，有好有坏。<strong>为什么 SGD 偏偏选中「好」的那个？</strong></p><ul><li><strong>最小范数解 (Minimum Norm)：</strong> \\( \\|w\\| \\)</li><li><strong>平坦极小值 (Flat Minima)：</strong> SGD 的随机噪声会把模型从又深又窄的「尖锐谷底」震出来，最终停在宽阔平坦的谷底。平坦通常意味着泛化好（测试数据稍偏移，Loss 也不飙升）。</li></ul><blockquote><strong>架构 vs 算法的分工：</strong> 架构（如 CNN）是「地图」，先把违背物理常识的解（区域）涂黑、缩小搜索空间（硬约束）；SGD 是「探险队的走路习惯」，在剩下的可行解里偏好最简单、最平滑的那个（软偏好 / 隐式正则化）。若改用全批量梯度下降或牛顿法（无随机噪声），往往收敛到泛化较差的解。所以「SGD 自带隐式正则化」这句话是成立的，且是深度学习成功的关键魔法之一。</blockquote>"
        },
        {
          "title": "9.6 阶段三：Scaling Law —— 暴力美学",
          "body": "<p>更严谨地说，Scaling Law 不是「再次」双下降，而是证明了<strong>我们可以一直停留在双下降曲线右侧的下滑区，且下滑可预测</strong>：只要处于过参数化区域，Loss 随计算量、数据量、参数量的增加呈严格的<strong>幂律 (Power Law)</strong> 下降（双对数坐标下近似一条直线），几乎看不到尽头。它打破了「参数再多迟早会翘起来 / 饱和」的旧认知。</p>"
        },
        {
          "title": "9.7 双下降是否突破了 Cramér–Rao 下界？",
          "body": "<p><strong>没有。</strong> 数学定理不会被推翻，只能被「绕过」——双下降破坏了 CR 下界成立的前提：</p><ol><li><strong>CR 下界只保护「无偏估计」。</strong> 深度网络（含 SGD 隐式正则）是<strong>有偏的</strong>，一旦引入偏差，CR 下界就不再适用。可以牺牲一点无偏性换方差大幅下降，使总 MSE 低于「无偏估计所受限」的水平（统计学早有先例：James–Stein 估计在 MSE 上战胜无偏的 MLE）。</li><li><strong>战场不同。</strong> CR 下界谈参数估计方差；双下降谈预测风险。过参数化下方程欠定，参数甚至不可识别、Fisher 信息矩阵奇异，标准 CR 下界在此无法定义。SGD 是在无穷多解中找了一个「最小范数解」，这不代表对参数的估计突破了极限。</li></ol><blockquote><strong>科研启示：</strong> \\( \\text{Risk} = \\text{Bias}^2 + \\text{Variance} \\)</blockquote>"
        }
      ]
    },
    {
      "num": "10",
      "slug": "ch10",
      "title": "优化器:从 SGD 到 AdamW",
      "sections": [
        {
          "title": "10.1 SGD 的两个弱点",
          "body": "<p>朴素 SGD 像近视又没方向感的醉汉,爬不出 Transformer 那种极度复杂的地形。现代优化器引入三件套:<strong>动量(惯性)、自适应(地形感知)、日程表(配速)</strong>。</p><ol><li><strong>怕峡谷:</strong> 狭长峡谷里在两壁间剧烈震荡;</li><li><strong>一刀切:</strong> 所有参数共用一个学习率,但常见词频繁更新、生僻词很久才更新一次。</li></ol>"
        },
        {
          "title": "10.2 动量 (Momentum) —— 解决震荡",
          "body": "<p>\\( m_t \\)</p><p>\\[ m_t = \\beta_1\\, m_{t-1} + (1 - \\beta_1)\\, g_t \\]</p><p>梯度忽左忽右会被平均抵消;一直向下则速度越来越快。</p>"
        },
        {
          "title": "10.3 自适应学习率 (RMSProp) —— 解决稀疏",
          "body": "<p>\\( v_t \\)</p><p>\\[ v_t = \\beta_2\\, v_{t-1} + (1 - \\beta_2)\\, g_t^2 \\]</p><p>\\( \\sqrt{v_t} \\)</p>"
        },
        {
          "title": "10.4 Adam(补全偏差修正 bias correction)",
          "body": "<p>\\( m_0 = v_0 = 0 \\) <strong>偏向 0</strong>,必须做偏差修正(原对话省略的关键一步):</p><p>\\[ \\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\qquad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t} \\]</p><p>\\( t \\)</p><p>\\[ \\theta_{t+1} = \\theta_t - \\eta\\, \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} \\]</p><ul><li>\\( \\hat{m}_t \\)</li><li>\\( \\sqrt{\\hat{v}_t} \\)</li></ul>"
        },
        {
          "title": "10.5 AdamW —— 解耦权重衰减",
          "body": "<p>\\( g_t \\) <strong>在更新幅度大时失效</strong>,这对大模型是致命的。AdamW 把权重衰减从梯度里拿出来,直接作用于权重:</p><p>\\[ \\theta_{t+1} = \\theta_t - \\eta\\left( \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} + \\lambda\\, \\theta_t \\right) \\]</p><blockquote><strong>训练 Transformer / BERT / GPT 必须用 AdamW,否则泛化能力会明显变差。</strong></blockquote>"
        },
        {
          "title": "10.6 Warmup & Scheduler —— 配速",
          "body": "<p><strong>Warmup(热身):</strong> \\( \\eta \\)</p><p><strong>Decay(衰减):</strong> \\( \\eta \\)</p>"
        },
        {
          "title": "10.7 梯度裁剪 (Gradient Clipping) —— 安全绳",
          "body": "<p>在深层网络的崎岖地形里会遇到「悬崖」,梯度突然变成 10000,一步就把参数踢飞。给梯度模长设上限:</p><p>\\[ g \\leftarrow g \\cdot \\frac{\\mathrm{max\\_norm}}{\\lVert g \\rVert} \\quad (\\text{当 } \\lVert g \\rVert > \\mathrm{max\\_norm}) \\]</p><p><strong>只缩放力度、不改变方向</strong>。哪怕踩空(梯度爆炸),安全绳也会拉住你。</p>"
        },
        {
          "title": "10.8 一个真实的训练循环(把全书串起来)",
          "body": "<p><code># 1. 模型 (f) 与优化器 (AdamW:动量+自适应+解耦L2)</code></p><p><code>model = Transformer(...)</code></p><p><code>optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)</code></p><p><code># 2. 日程表:先热身,再余弦衰减</code></p><p><code>scheduler = get_cosine_schedule_with_warmup(optimizer, warmup_steps=100, ...)</code></p><p><code>for x, y in dataloader:</code></p><ul><li><code>logits = model(x)</code> # 3. 前向 → 算 Loss</li><li><code>loss = cross_entropy(logits, y)</code> # 交叉熵(类别分布的 MLE)</li><li><code>loss.backward()</code> # 4. 反向 → 链式法则算梯度 (p-y)x</li><li><code>torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)</code> # 5. 梯度裁剪:模长上限 1.0(安全绳)</li><li><code>optimizer.step()</code> # 6. 更新:θ = θ - η·m̂/(√v̂+ε) + 解耦衰减</li><li><code>scheduler.step()</code> # 7. 调整下一步学习率(配速)</li><li><code>optimizer.zero_grad()</code> # 8. 清空梯度</li></ul><p>这就是训练一个 LLM Agent 时,后台每一步都在发生的真实过程。</p>"
        }
      ]
    },
    {
      "num": "闭",
      "slug": "loop",
      "title": "全局逻辑闭环",
      "sections": [
        {
          "title": "把全书压缩成一条链",
          "body": "<ol><li><strong>现实充满不确定性</strong>(\\( \\epsilon \\)),所以观测到的 \\( y \\) 是随机的。</li><li><strong>为了建模随机的 \\( y \\)</strong>,先假设它服从什么分布(第二章 GLM)。</li><li><strong>基于分布假设</strong>,用 <strong>MLE</strong> 推导出 Loss(MSE / 交叉熵,第三章),用 <strong>MAP</strong> 推导出正则项(L1 / L2 ← 先验,第五章)。</li><li><strong>为最小化 Loss</strong>,用反向传播算出梯度(万能形式 \\( (p-y)x \\),第四章),再用 <strong>AdamW + Warmup + 梯度裁剪</strong> 优化参数(第十章)。</li><li><strong>为诊断模型</strong>,用<strong>偏差-方差分解</strong>定位病因(笨 = Bias / 躁 = Variance / 烂 = Noise,第六章),其统计根基是估计理论(第七章)。</li><li><strong>从经典 ML 到深度学习</strong>:让模型自己学特征(表示学习 = 信息瓶颈 + 归纳偏置 + 流形,第八章)。</li><li><strong>过拟合消除史</strong>:恐惧过拟合 → 发现良性过拟合(双下降)→ 利用巨大过拟合实现超级智能(Scaling Law,第九章)。</li></ol><p>你手里现在有三样武器:<strong>概率论</strong>(定义问题:设计 Loss 与正则)、<strong>微积分</strong>(求解问题:梯度下降)、<strong>统计学</strong>(评估问题:偏差-方差)。地基已经打牢。</p><blockquote><strong>下一站预告 —— Transformer 的心脏:</strong>注意力机制。这正是 CME 295 第一讲的起点。</blockquote>"
        },
        {
          "title": "校订说明(把流行说法说严谨)",
          "body": "<p>整理时对几处常见但不够严谨的说法做了校订,一并放在这里:</p><ol><li><strong>「表示学习 = 信息瓶颈」</strong>是一种有影响力的视角,而非公认定论。Tishby 的信息瓶颈理论曾受质疑 —— Saxe 等(2018)指出所谓「压缩阶段」依赖激活函数选择、未必普遍存在。严谨表述应为「信息瓶颈是理解表示学习的一种视角」。</li><li><strong>Grokking 与 epoch-wise double descent</strong> 相关但并不等同。Grokking(Power 等,2022)是延迟极久的突变式泛化相变,多见于小规模算法任务,与权重范数动力学、权重衰减有关;直接划等号是常见的口头简化。</li><li><strong>「高维稀释噪声」是直觉比喻,并非严格机制。</strong>可证明的解释是「最小范数插值解 + 良性过拟合」(Bartlett 等,2020):过参数化后能完美插值的解有无穷多,(S)GD 偏好其中范数最小、最光滑者。高维本身并不保证泛化好,还取决于数据协方差的谱。</li><li><strong>「平坦极小值 ⇒ 泛化好」是流行但有争议的观点,并非定理。</strong>Dinh 等(2017)指出「平坦度」不具重参数化不变性、存在反例。</li><li><strong>「Scaling Law = 停在双下降右侧」是本手册所作的概念衔接,并非教科书等式。</strong>Scaling Law(Kaplan 等 2020;Hoffmann 等 2022「Chinchilla」)是 LLM 预训练 loss 的经验幂律,与双下降文献基本独立发展;幂律还含一个不可约常数项(熵下限)。</li></ol>"
        }
      ]
    }
  ]
};

if (typeof window !== "undefined") window.HANDBOOK = HANDBOOK;
