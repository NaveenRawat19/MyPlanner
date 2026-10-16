## 8-week daily plan (2 hours a day, all four tracks every day)

**Daily time split (120 min):** DSA 40 min, HLD 25 min, LLD 25 min, AI 30 min. Every day has all four tracks.

**Day 7 of every week is review:** redo the DSA problem you failed, redo one HLD design and one LLD design from the week, and use the AI block for a mock or an eval pass.

**How to run each block**

- **DSA (40 min):** attempt for 30 minutes. If unsolved, read the editorial, write a one-line pattern note, and redo it on day 7.
- **HLD (25 min):** follow the Codefarm System Design roadmap in order, one or two skills a day, using its guides as the main material and *Designing Data-Intensive Applications* for depth. Items marked skim get 10 minutes and a one-sentence explanation. Day 7 holds the designs the roadmap lacks.
- **LLD (25 min):** use [Hello Interview's LLD course](https://www.hellointerview.com/learn/low-level-design) for its delivery framework, design principles, concurrency and problem breakdowns, and the Codefarm LLD roadmap for the remaining patterns and problems. Code in Python. One session on a problem gives you requirements, classes and the key pattern, so code the full solution in that week's Day 7 review.
- **AI (30 min):** build the capstone, a document extraction, comparison and Q&A agent over public PDFs (SEC 10-Ks or sample insurance policies). 30 minutes a day is about 28 hours in total, enough for a deployed thin product.

Day 1 can be any weekday. The weeks are numbered by day, not by calendar date.

**How to track:** tick each box when the task is done. Every link opens the problem or resource for that task. HLD tasks link to the [System Design roadmap](https://codefarm.in/roadmap/system-design) because I could not verify its per-skill guide URLs, so open the matching skill from its phase. LLD tasks link to Hello Interview where it covers the topic (patterns, concurrency, problem breakdowns, delivery framework) and to the Codefarm phase guides for everything else; pattern tasks add a Refactoring Guru reference. Meeting Rooms II and Alien Dictionary need LeetCode Premium. A task with no link is practice you do yourself.

### Week 1: hashing, windows, stacks · HLD foundations · LLD OOP and SOLID · extraction

**Day 1**

- [ ] **DSA:** [Group Anagrams](https://leetcode.com/problems/group-anagrams/) (hashing)
- [ ] **HLD:** [Networking basics](https://codefarm.in/roadmap/system-design): OSI, TCP/IP, DNS, HTTP and TLS
- [ ] **LLD:** [OOP pillars](https://codefarm.in/guides/lld/01-oop-foundations-solid): encapsulation, abstraction, inheritance, polymorphism; also Hello Interview's [intro](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/introduction) and [OOP concepts](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/oop-concepts)
- [ ] **AI:** [OpenAI tokenizer](https://platform.openai.com/tokenizer): tokens, context windows, sampling; same prompt at temperature 0 vs 1

**Day 2**

- [ ] **DSA:** [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (sliding window)
- [ ] **HLD:** [Client-server architecture](https://codefarm.in/roadmap/system-design), REST and HTTP
- [ ] **LLD:** [SOLID part 1](https://codefarm.in/guides/lld/01-oop-foundations-solid) (S, O, L) with violations and fixes; also Hello Interview's [design principles](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/design-principles)
- [ ] **AI:** [Pydantic docs](https://docs.pydantic.dev/latest/): structured extraction from 5 PDFs

**Day 3**

- [ ] **DSA:** [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) (prefix sums + hashmap)
- [ ] **HLD:** [SQL fundamentals](https://codefarm.in/roadmap/system-design): relational model, ACID
- [ ] **LLD:** [SOLID part 2](https://codefarm.in/guides/lld/01-oop-foundations-solid) (I, D); also Hello Interview's [design principles](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/design-principles)
- [ ] **AI:** [PyMuPDF docs](https://pymupdf.readthedocs.io/): text vs layout vs OCR, tables

**Day 4**

- [ ] **DSA:** [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) (monotonic stack)
- [ ] **HLD:** [NoSQL overview](https://codefarm.in/roadmap/system-design): CAP, eventual consistency, data models
- [ ] **LLD:** [Coupling and cohesion](https://codefarm.in/guides/lld/01-oop-foundations-solid)
- [ ] **AI:** [Claude tool use docs](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview): define one tool and inspect the call

**Day 5**

- [ ] **DSA:** [3Sum](https://leetcode.com/problems/3sum/) (two pointers)
- [ ] **HLD:** [Basic system concepts](https://codefarm.in/roadmap/system-design): latency, throughput, scaling, plus back-of-envelope estimation
- [ ] **LLD:** [Design by contract and invariants](https://codefarm.in/guides/lld/01-oop-foundations-solid)
- [ ] **AI:** [Prompt caching docs](https://docs.claude.com/en/docs/build-with-claude/prompt-caching): cost and latency model for 1,000 documents

**Day 6**

- [ ] **DSA:** [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) (hard)
- [ ] **HLD:** [Load balancing](https://codefarm.in/roadmap/system-design): L4 vs L7, algorithms, health checks
- [ ] **LLD:** [UML class and sequence diagrams](https://codefarm.in/guides/lld/05-schema-api-design): draw your SOLID example
- [ ] **AI:** Compare 10 extraction prompts on [OpenAI](https://platform.openai.com/docs), [Gemini](https://ai.google.dev/gemini-api/docs) and [Claude](https://docs.claude.com)

**Day 7 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** estimation drill from the [System Design Primer](https://github.com/donnemartin/system-design-primer): QPS, storage and bandwidth for 3 systems
- [ ] **LLD:** refactor a small class that violates SOLID ([SOLID guide](https://codefarm.in/guides/lld/01-oop-foundations-solid))
- [ ] **AI:** label 20 fields by hand and compute accuracy; write "LLM fundamentals in 2 minutes"

### Week 2: graphs, binary search · HLD building blocks · LLD creational and structural patterns · RAG

**Day 8**

- [ ] **DSA:** [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) (topological sort)
- [ ] **HLD:** [Caching strategies](https://codefarm.in/roadmap/system-design): cache-aside, write-through, write-back, eviction
- [ ] **LLD:** [Singleton and Monostate](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Singleton](https://refactoring.guru/design-patterns/singleton)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns) on when not to use it
- [ ] **AI:** [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings): embed and search 20 chunks

**Day 9**

- [ ] **DSA:** [Redundant Connection](https://leetcode.com/problems/redundant-connection/) (union-find)
- [ ] **HLD:** [Message queues and brokers](https://codefarm.in/roadmap/system-design): pub/sub, RabbitMQ vs Kafka
- [ ] **LLD:** [Factory Method and Abstract Factory](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Factory Method](https://refactoring.guru/design-patterns/factory-method), [Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns) (simple factory)
- [ ] **AI:** [LangChain text splitters](https://python.langchain.com/docs/concepts/text_splitters/): fixed vs recursive vs heading-aware

**Day 10**

- [ ] **DSA:** [Network Delay Time](https://leetcode.com/problems/network-delay-time/) (Dijkstra)
- [ ] **HLD:** [API design and gateways](https://codefarm.in/roadmap/system-design): REST, GraphQL, gRPC
- [ ] **LLD:** [Builder pattern](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Builder](https://refactoring.guru/design-patterns/builder)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns)
- [ ] **AI:** [pgvector](https://github.com/pgvector/pgvector): table, HNSW index, query

**Day 11**

- [ ] **DSA:** [Word Ladder](https://leetcode.com/problems/word-ladder/) (BFS)
- [ ] **HLD:** [Replication and sharding](https://codefarm.in/roadmap/system-design): leader/follower, partitioning
- [ ] **LLD:** [Prototype pattern](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Prototype](https://refactoring.guru/design-patterns/prototype))
- [ ] **AI:** [Supabase hybrid search](https://supabase.com/docs/guides/ai/hybrid-search): tsvector + vector

**Day 12**

- [ ] **DSA:** [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (binary search on the answer)
- [ ] **HLD:** [Consistency and consensus](https://codefarm.in/roadmap/system-design): isolation levels, a first look at Raft
- [ ] **LLD:** [Adapter and Facade](https://codefarm.in/guides/lld/03-structural-patterns) (ref: [Adapter](https://refactoring.guru/design-patterns/adapter), [Facade](https://refactoring.guru/design-patterns/facade)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns) (Facade)
- [ ] **AI:** [Cross-encoder reranking](https://www.sbert.net/examples/applications/cross-encoder/README.html)

**Day 13**

- [ ] **DSA:** [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [ ] **HLD:** [Distributed system fallacies](https://codefarm.in/roadmap/system-design) and failure modes
- [ ] **LLD:** [Decorator and Proxy](https://codefarm.in/guides/lld/03-structural-patterns) (ref: [Decorator](https://refactoring.guru/design-patterns/decorator), [Proxy](https://refactoring.guru/design-patterns/proxy)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns) (Decorator)
- [ ] **AI:** [Claude citations docs](https://docs.claude.com/en/docs/build-with-claude/citations): answers with page references; refuse when nothing is retrieved

**Day 14 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design a notification system (queues, retries, fan-out); reference: [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ ] **LLD:** re-code [Factory Method](https://refactoring.guru/design-patterns/factory-method) and [Decorator](https://refactoring.guru/design-patterns/decorator) from memory; check against Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns)
- [ ] **AI:** [RAGAS docs](https://docs.ragas.io): 25 Q&A pairs, recall@5; explain RAG failure modes aloud

### Week 3: dynamic programming · HLD distributed systems · LLD structural and behavioral patterns · agents

**Day 15**

- [ ] **DSA:** [Coin Change](https://leetcode.com/problems/coin-change/) (1D DP)
- [ ] **HLD:** [Distributed transactions and sagas](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Bridge and Composite](https://codefarm.in/guides/lld/03-structural-patterns) (ref: [Bridge](https://refactoring.guru/design-patterns/bridge), [Composite](https://refactoring.guru/design-patterns/composite))
- [ ] **AI:** [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): the agent loop (ReAct)

**Day 16**

- [ ] **DSA:** [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)
- [ ] **HLD:** [Service discovery and configuration](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Flyweight](https://codefarm.in/guides/lld/03-structural-patterns), then a structural-patterns recap (ref: [Flyweight](https://refactoring.guru/design-patterns/flyweight))
- [ ] **AI:** [LangGraph docs](https://langchain-ai.github.io/langgraph/): state, nodes, edges; build a 3-node graph

**Day 17**

- [ ] **DSA:** [Edit Distance](https://leetcode.com/problems/edit-distance/) (2D DP)
- [ ] **HLD:** [Distributed caching and CDNs](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Strategy and Template Method](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Strategy](https://refactoring.guru/design-patterns/strategy), [Template Method](https://refactoring.guru/design-patterns/template-method)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns) (Strategy, the most common pattern in LLD interviews)
- [ ] **AI:** [LangChain Academy: Intro to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph): plan, retrieve, draft, critic flow

**Day 18**

- [ ] **DSA:** [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) (knapsack)
- [ ] **HLD:** [Distributed data stores](https://codefarm.in/roadmap/system-design) (Dynamo-style)
- [ ] **LLD:** [Observer and Pub-Sub](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Observer](https://refactoring.guru/design-patterns/observer)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns)
- [ ] **AI:** [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/): Postgres checkpointer; kill a run and resume it

**Day 19**

- [ ] **DSA:** [Word Break](https://leetcode.com/problems/word-break/)
- [ ] **HLD:** [Fault tolerance and resilience](https://codefarm.in/roadmap/system-design): circuit breaker, retry, bulkhead
- [ ] **LLD:** [Command and Chain of Responsibility](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Command](https://refactoring.guru/design-patterns/command), [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility))
- [ ] **AI:** [LangGraph human-in-the-loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/): interrupt before a risky action

**Day 20**

- [ ] **DSA:** [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) (state-machine DP)
- [ ] **HLD:** [Consistent hashing and Bloom filters](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [State and Mediator](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [State](https://refactoring.guru/design-patterns/state), [Mediator](https://refactoring.guru/design-patterns/mediator)); also Hello Interview's [patterns page](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns) (state machine)
- [ ] **AI:** [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents): schemas, idempotency, errors, permissions

**Day 21 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design a key-value store (Dynamo-style); reference: [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ ] **LLD:** code a small order-status state machine ([State](https://refactoring.guru/design-patterns/state), [Hello Interview vending machine example](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/patterns))
- [ ] **AI:** end-to-end agent test; explain aloud single vs multi-agent and when not to use agents ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents))

### Week 4: heaps, intervals, greedy · HLD core algorithms and architecture patterns · LLD schema, API design, concurrency · integrations

**Day 22**

- [ ] **DSA:** [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) (heap)
- [ ] **HLD:** [Write-ahead log and Raft consensus](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Iterator, Memento and Visitor](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Iterator](https://refactoring.guru/design-patterns/iterator), [Memento](https://refactoring.guru/design-patterns/memento), [Visitor](https://refactoring.guru/design-patterns/visitor))
- [ ] **AI:** [FastAPI docs](https://fastapi.tiangolo.com/): async wrapper with POST /runs and GET /runs/{id}

**Day 23**

- [ ] **DSA:** [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
- [ ] **HLD:** [Paxos, 2PC and 3PC](https://codefarm.in/roadmap/system-design) (skim); quorum reads and writes (N, R, W)
- [ ] **LLD:** [ER diagrams and schema design](https://codefarm.in/guides/lld/05-schema-api-design)
- [ ] **AI:** [Python hmac docs](https://docs.python.org/3/library/hmac.html): webhook signature verification and idempotency keys

**Day 24**

- [ ] **DSA:** [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) (intervals, Premium)
- [ ] **HLD:** [Merkle trees, vector clocks](https://codefarm.in/roadmap/system-design) (skim)
- [ ] **LLD:** [REST API contract design](https://codefarm.in/guides/lld/05-schema-api-design)
- [ ] **AI:** [Celery docs](https://docs.celeryq.dev/): background worker for long runs

**Day 25**

- [ ] **DSA:** [Task Scheduler](https://leetcode.com/problems/task-scheduler/) (greedy)
- [ ] **HLD:** [LRU/LFU eviction, TinyLFU, Snowflake IDs](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [gRPC and Protobuf contract design](https://codefarm.in/guides/lld/05-schema-api-design)
- [ ] **AI:** [FastMCP docs](https://gofastmcp.com): expose your extraction as an MCP tool

**Day 26**

- [ ] **DSA:** [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) (two heaps, hard)
- [ ] **HLD:** [Microservices architecture](https://codefarm.in/roadmap/system-design): decomposition, database per service
- [ ] **LLD:** Concurrency: Hello Interview's [intro](https://www.hellointerview.com/learn/low-level-design/concurrency/intro) and [correctness](https://www.hellointerview.com/learn/low-level-design/concurrency/correctness); Python [threading](https://docs.python.org/3/library/threading.html) and [asyncio](https://docs.python.org/3/library/asyncio.html) docs
- [ ] **AI:** [n8n courses](https://docs.n8n.io/courses/): webhook, HTTP call, Slack workflow

**Day 27**

- [ ] **DSA:** [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) (hard linked list)
- [ ] **HLD:** [Event-driven architecture](https://codefarm.in/roadmap/system-design): event sourcing, CQRS
- [ ] **LLD:** Problem: parking lot. Read Hello Interview's [delivery framework](https://www.hellointerview.com/learn/low-level-design/in-a-hurry/delivery) first, then its [parking lot breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/parking-lot); also Codefarm's [problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** [Tenacity docs](https://tenacity.readthedocs.io): retries, timeouts and a dead-letter queue around LLM calls

**Day 28 (review and gate)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design a job scheduler or distributed task queue; reference: [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ ] **LLD:** code the parking lot's core classes with one test ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/parking-lot), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** compare [Temporal](https://docs.temporal.io), [Prefect](https://docs.prefect.io) and [n8n](https://docs.n8n.io) aloud. **Gate:** the capstone runs end to end locally. Start applying now.

### Week 5: trees, tries, backtracking · HLD architecture patterns and vector search · LLD interview problems · evals

**Day 29**

- [ ] **DSA:** [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
- [ ] **HLD:** [Serverless and FaaS](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** Problem: elevator system ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/elevator), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** [Langfuse docs](https://langfuse.com/docs): golden set of 25 test cases for your agent

**Day 30**

- [ ] **DSA:** [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) (hard)
- [ ] **HLD:** [Service mesh and sidecar pattern](https://codefarm.in/roadmap/system-design) (skim)
- [ ] **LLD:** [Problem: snake and ladder](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** [RAGAS docs](https://docs.ragas.io): deterministic checks vs LLM-as-judge, and the judge's biases

**Day 31**

- [ ] **DSA:** [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
- [ ] **HLD:** [Domain-driven design](https://codefarm.in/roadmap/system-design): bounded contexts
- [ ] **LLD:** [Problem: hotel booking](https://codefarm.in/guides/lld/06-lld-interview-problems) (date ranges, concurrency)
- [ ] **AI:** [Langfuse docs](https://langfuse.com/docs): tracing on one run

**Day 32**

- [ ] **DSA:** [Word Search II](https://leetcode.com/problems/word-search-ii/) (trie + backtracking)
- [ ] **HLD:** [Hexagonal and clean architecture](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: Splitwise](https://codefarm.in/guides/lld/06-lld-interview-problems) (debt simplification)
- [ ] **AI:** [Langfuse docs](https://langfuse.com/docs): token and cost accounting per graph node

**Day 33**

- [ ] **DSA:** [Combination Sum](https://leetcode.com/problems/combination-sum/) (backtracking)
- [ ] **HLD:** [Embeddings and vector databases](https://codefarm.in/roadmap/system-design) (HNSW)
- [ ] **LLD:** Problem: movie ticket booking with seat locking ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/bookmyshow), [scarcity](https://www.hellointerview.com/learn/low-level-design/concurrency/scarcity), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** [GitHub Actions docs](https://docs.github.com/en/actions): eval regression gate

**Day 34**

- [ ] **DSA:** [N-Queens](https://leetcode.com/problems/n-queens/) (hard backtracking)
- [ ] **HLD:** [RAG architecture](https://codefarm.in/roadmap/system-design): chunking, reranking, evaluation
- [ ] **LLD:** [Problem: chess](https://codefarm.in/guides/lld/06-lld-interview-problems) (move validation)
- [ ] **AI:** [Langfuse docs](https://langfuse.com/docs): categorize 10 failures and fix the top one

**Day 35 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design enterprise RAG with citations ([RAG architecture](https://codefarm.in/roadmap/system-design))
- [ ] **LLD:** redo hotel or movie booking in code, with locking ([Hello Interview movie booking](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/bookmyshow), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** explain aloud how you would evaluate any agent in production

### Week 6: advanced patterns · HLD Gen AI and LLM systems · LLD interview problems · safety and extraction

**Day 36**

- [ ] **DSA:** [Single Number III](https://leetcode.com/problems/single-number-iii/) (bit manipulation)
- [ ] **HLD:** [LLM gateway and routing](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** Problem: logger framework ([Hello Interview logging service](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/logging-service), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** [OWASP Top 10 for LLM apps](https://genai.owasp.org/llm-top-10/): poison a document and watch the injection work

**Day 37**

- [ ] **DSA:** [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)
- [ ] **HLD:** [Prompt caching and semantic caching](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: ATM](https://codefarm.in/guides/lld/06-lld-interview-problems) (state machine, denominations)
- [ ] **AI:** [OWASP Top 10 for LLM apps](https://genai.owasp.org/llm-top-10/): allowlists, output validation, least privilege, approval steps

**Day 38**

- [ ] **DSA:** [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) (monotonic stack, hard)
- [ ] **HLD:** [Agentic patterns and tool use](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: cache (LRU and LFU)](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** [Presidio docs](https://microsoft.github.io/presidio/): PII redaction, audit logs, tenant isolation, retention

**Day 39**

- [ ] **DSA:** [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) (two pointers, hard)
- [ ] **HLD:** [Streaming and latency optimization](https://codefarm.in/roadmap/system-design) (SSE, time to first token)
- [ ] **LLD:** Problem: rate limiter with token bucket and sliding window ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/rate-limiter), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** [Pydantic docs](https://docs.pydantic.dev/latest/): extract entities from two quotes or policies into one schema

**Day 40**

- [ ] **DSA:** [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) (binary search, hard)
- [ ] **HLD:** [Guardrails and output validation](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** Problem: pub-sub system ([Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems); Hello Interview's [coordination](https://www.hellointerview.com/learn/low-level-design/concurrency/coordination) for the producer-consumer side)
- [ ] **AI:** quote comparison: diff two extractions and cite pages

**Day 41**

- [ ] **DSA:** [Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) (bitmask BFS, hard)
- [ ] **HLD:** [LLM observability and evaluation](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: tic-tac-toe](https://codefarm.in/guides/lld/06-lld-interview-problems) (win detection)
- [ ] **AI:** [Amazon Bedrock workshop](https://github.com/aws-samples/amazon-bedrock-workshop): add a fallback provider to your LLM router

**Day 42 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design an agent platform with an LLM gateway and guardrails ([roadmap phase 6](https://codefarm.in/roadmap/system-design))
- [ ] **LLD:** code LRU/LFU with a test and a thread-safe variant ([Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems), [Hello Interview correctness](https://www.hellointerview.com/learn/low-level-design/concurrency/correctness))
- [ ] **AI:** measure extraction and comparison accuracy on your eval set

### Week 7: hard mixed problems · HLD scalability, security, compliance · LLD design for AI systems · production and UI

**Day 43**

- [ ] **DSA:** [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
- [ ] **HLD:** [Horizontal vs vertical scaling, database scaling patterns](https://codefarm.in/roadmap/system-design) (read replicas, sharding, materialized views)
- [ ] **LLD:** [Problem: car rental system](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/): non-root image for the API

**Day 44**

- [ ] **DSA:** [Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) (MST)
- [ ] **HLD:** [Rate limiting and throttling; CDNs and edge computing](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** Dependency injection and tests with fakes and mocks: [pytest docs](https://docs.pytest.org/), [unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
- [ ] **AI:** [GitHub Actions docs](https://docs.github.com/en/actions): CI with lint, tests and the eval gate

**Day 45**

- [ ] **DSA:** [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) (Fenwick tree)
- [ ] **HLD:** [Observability and monitoring](https://codefarm.in/roadmap/system-design): metrics, logs, tracing, SLOs
- [ ] **LLD:** LLM client classes with provider adapters, retries and structured output (ref: [Adapter](https://refactoring.guru/design-patterns/adapter))
- [ ] **AI:** [Amazon ECS Workshop](https://ecsworkshop.com): deploy to a cloud container service; /health returns the git SHA

**Day 46**

- [ ] **DSA:** [Burst Balloons](https://leetcode.com/problems/burst-balloons/) (interval DP, hard)
- [ ] **HLD:** [Authentication and authorization; encryption and secrets](https://codefarm.in/roadmap/system-design) (OAuth2, OIDC, JWT)
- [ ] **LLD:** Agent tool registry ([Claude tool use docs](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview))
- [ ] **AI:** [React docs](https://react.dev/learn): UI part 1, upload and results list

**Day 47**

- [ ] **DSA:** [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) (topological sort, hard, Premium)
- [ ] **HLD:** [DDoS and WAF](https://codefarm.in/roadmap/system-design) (skim); disaster recovery: backups, RPO, RTO
- [ ] **LLD:** Workflow engine with a DAG executor ([graphlib docs](https://docs.python.org/3/library/graphlib.html))
- [ ] **AI:** [openapi-typescript](https://openapi-ts.dev): UI part 2, citations view using a generated TS client

**Day 48**

- [ ] **DSA:** [LFU Cache](https://leetcode.com/problems/lfu-cache/) (design, hard)
- [ ] **HLD:** [Compliance and data governance](https://codefarm.in/roadmap/system-design): GDPR, SOC 2-style controls, multi-tenancy
- [ ] **LLD:** [Capstone, shortened](https://codefarm.in/roadmap/lld): food-ordering order state machine and pricing strategy
- [ ] **AI:** fine-tuning vs RAG vs prompting; cost optimization

**Day 49 (review and mock)**

- [ ] **DSA:** redo the problem you failed this week, then one new Medium
- [ ] **HLD:** mock design, 25 min: multi-tenant document-processing platform ([roadmap](https://codefarm.in/roadmap/system-design))
- [ ] **LLD:** mock, 25 min: a problem you haven't done, either [Amazon Locker](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/amazon-locker) or [Inventory Management](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/inventory-management); attempt it before reading the breakdown
- [ ] **AI:** answer interview questions aloud and record yourself

### Week 8: timed practice · HLD real-world case studies · LLD timed redos · packaging

**Day 50**

- [ ] **DSA:** [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) (monotonic deque)
- [ ] **HLD:** [Timed case study: URL shortener](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** Timed redo: parking lot ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/parking-lot), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** README with an architecture diagram and measured results (only numbers from your own evals)

**Day 51**

- [ ] **DSA:** [Decode Ways](https://leetcode.com/problems/decode-ways/)
- [ ] **HLD:** [Timed case study: Twitter and news feed](https://codefarm.in/roadmap/system-design) (fan-out, celebrity problem)
- [ ] **LLD:** Timed redo: elevator ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/elevator), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** record a 3-minute demo

**Day 52**

- [ ] **DSA:** [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) (quickselect or heap)
- [ ] **HLD:** [Timed case study: WhatsApp and chat](https://codefarm.in/roadmap/system-design) (WebSockets, delivery receipts)
- [ ] **LLD:** Timed redo: movie ticket booking ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/bookmyshow), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** map 6 stories to STAR (patch orchestrator, MCP platform, platform adoption, parameter-update feature, mentoring, FINRAA); reference: [Amazon Leadership Principles](https://www.amazon.jobs/en/principles)

**Day 53**

- [ ] **DSA:** [Clone Graph](https://leetcode.com/problems/clone-graph/)
- [ ] **HLD:** [Timed case study: YouTube and video streaming](https://codefarm.in/roadmap/system-design) (transcoding, CDN)
- [ ] **LLD:** [Timed redo: LRU/LFU cache](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** mock Q&A on LLM fundamentals and RAG

**Day 54**

- [ ] **DSA:** [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) (hard)
- [ ] **HLD:** [Timed case study: Uber and ride-hailing](https://codefarm.in/roadmap/system-design) (geohash, real-time matching)
- [ ] **LLD:** Timed redo: rate limiter ([Hello Interview breakdown](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/rate-limiter), [Codefarm problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** mock Q&A on agents, evals and safety

**Day 55**

- [ ] **DSA:** a new problem from your weakest pattern
- [ ] **HLD:** [Timed case study: distributed search engine](https://codefarm.in/roadmap/system-design) (crawler, inverted index)
- [ ] **LLD:** redo your weakest two problems ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** resume pass: add the capstone, named models and measured results; build the application list

**Day 56 (final mock)**

- [ ] **DSA:** one Medium, 40 min
- [ ] **HLD:** [Trade-off analysis and decision frameworks](https://codefarm.in/roadmap/system-design) (ADRs), then one random design, 25 min
- [ ] **LLD:** one new problem, 25 min: [Connect Four](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/connect-four) or [File System](https://www.hellointerview.com/learn/low-level-design/problem-breakdowns/file-system); attempt it before reading the breakdown
- [ ] **AI:** one question aloud plus a final capstone check. **Gate:** deployed URL, README with measured results, 2 mock interviews done, 10+ targeted applications sent.
