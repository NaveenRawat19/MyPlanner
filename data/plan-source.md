# DSA and System Design Study Topics

*A topic checklist for AI Engineer, Applied AI, Full Stack and SWE interviews*

## DSA topics

You've solved 500+ problems, so don't redo the basics. For each topic, solve one timed Medium: if you pass in 35 minutes, skip it, and if you fail, drill it.

### Tier 1 (asked constantly)

- Hashing, two pointers, sliding window, prefix sums
- Binary search, including "binary search on the answer"
- Stack and monotonic stack, linked lists
- Trees and BST: traversals, LCA, serialization
- BFS/DFS on graphs and grids
- Heaps and top-K
- Intervals, greedy
- Backtracking
- DP: 1D, 2D, knapsack, LIS, LCS, partitions

### Tier 2 (often asked)

- Graph algorithms: topological sort, union-find, Dijkstra
- Tries
- Design-style problems: LRU/LFU cache, min stack, iterators
- Bit manipulation, matrix problems

### Tier 3 (hard rounds and FAANG-level)

- Advanced DP: bitmask, interval DP, DP on trees
- Dijkstra variants, 0-1 BFS, MST
- Segment tree / Fenwick tree (rare, but it happens)

Alongside all of it, practice stating time and space complexity out loud.

## System design topics

### Fundamentals

- Requirements: functional vs non-functional
- Back-of-envelope estimation
- API design, data modeling
- SQL vs NoSQL tradeoffs

### Building blocks

Know the tradeoff, not just the definition.

- Load balancing, caching and invalidation, CDNs
- Indexing, replication, sharding, consistent hashing
- CAP/PACELC, consistency models, transactions and isolation levels
- Queues and streams (Kafka-style), pub/sub, idempotency, retries, backpressure
- Rate limiting, circuit breakers
- WebSockets vs polling, blob storage, search (inverted index)
- AuthN/AuthZ (JWT, OAuth), observability

### Classic designs to practice

- URL shortener, rate limiter, notification system
- Chat, news feed, key-value store
- Job scheduler, file storage, web crawler, typeahead

### AI system design (essential for your target roles)

- RAG system with citations
- LLM gateway: routing, fallbacks, caching, cost control
- Agent platform: orchestration, tool permissions, human-in-the-loop, audit
- Eval and observability pipeline
- Async document-processing pipeline
- Guardrails and prompt-injection defense

### Your hooks

You can draw on your own experience for queues (Celery/Redis), real-time systems (SyncFlix), orchestration with failure isolation (the patch orchestrator), and audit and RBAC (the MCP platform). Interviewers like designs grounded in systems you've actually run.

## Full topic list from the Codefarm roadmaps

Together, the [LLD roadmap](https://codefarm.in/roadmap/lld) and the [System Design roadmap](https://codefarm.in/roadmap/system-design) cover most of what you need. The 2-hour plan below follows their order.

### HLD: 9 phases, 58 skills

- **Phase 1, foundations:** networking basics, client-server architecture, SQL fundamentals, NoSQL overview, basic system concepts
- **Phase 2, building blocks:** load balancing, caching strategies, message queues and brokers, API design and gateways, replication and sharding, consistency and consensus
- **Phase 3, distributed systems:** failure fallacies, distributed transactions and sagas, service discovery and configuration, distributed caching and CDNs, distributed data stores, fault tolerance and resilience
- **Phase 4, core algorithms:** consistent hashing, Bloom filters, write-ahead log, Raft, Paxos and 2PC/3PC, Merkle trees and anti-entropy, vector clocks, LRU/LFU and TinyLFU, Snowflake IDs, quorum reads and writes
- **Phase 5, architecture patterns:** microservices, event-driven (event sourcing, CQRS), serverless, service mesh, domain-driven design, hexagonal and clean architecture
- **Phase 6, Gen AI and LLM systems:** embeddings and vector databases, RAG architecture, LLM gateway and routing, prompt and semantic caching, agentic patterns and tool use, streaming and latency, guardrails and output validation, LLM observability and evaluation
- **Phase 7, scalability:** horizontal and vertical scaling, database scaling patterns, rate limiting, observability and monitoring, CDN and edge
- **Phase 8, security and reliability:** authentication and authorization, encryption and secrets, DDoS and WAF, disaster recovery, compliance and data governance
- **Phase 9, real-world systems:** URL shortener, Twitter/news feed, YouTube, Uber, WhatsApp/chat, distributed search engine, trade-off analysis

### LLD: 6 phases, 35 skills

- **Phase 1, OOP and SOLID:** OOP pillars, SOLID, coupling and cohesion, design by contract
- **Phase 2, creational patterns:** Singleton, Factory, Builder, Prototype
- **Phase 3, structural patterns:** Adapter and Facade, Decorator and Proxy, Bridge and Composite, Flyweight
- **Phase 4, behavioral patterns:** Strategy and Template Method, Observer and Pub-Sub, Command and Chain of Responsibility, State and Mediator, Iterator, Memento and Visitor
- **Phase 5, schema and API design:** ER diagrams, REST contracts, gRPC and Protobuf, UML
- **Phase 6, problems:** parking lot, elevator, snake and ladder, hotel booking, Splitwise, movie ticket booking, chess, logger, ATM, LRU/LFU cache, rate limiter, pub-sub, tic-tac-toe, car rental

### Added beyond the roadmaps

- **HLD:** back-of-envelope estimation; designs for a notification system, key-value store, job scheduler, enterprise RAG, agent platform and multi-tenant document processing
- **LLD:** concurrency (threads, locks, asyncio), dependency injection and testing, LLM client and agent tool registry design, a DAG workflow engine
- **Not covered by either:** Dropbox and file sync, typeahead, payments, Kubernetes. Add these only for a specific interview.

## How to study each topic

1. Read the concept in *Designing Data-Intensive Applications* or the System Design Primer.
2. Explain the tradeoff aloud in 2 minutes, without notes.
3. Apply it by designing one system on paper in 45 minutes.
4. Redo your weakest designs a week later.

## 8-week daily plan (2 hours a day, all four tracks every day)

**Daily time split (120 min):** DSA 40 min, HLD 25 min, LLD 25 min, AI 30 min. Every day has all four tracks.

**Day 7 of every week is review:** redo the DSA problem you failed, redo one HLD design and one LLD design from the week, and use the AI block for a mock or an eval pass.

**How to run each block**

- **DSA (40 min):** attempt for 30 minutes. If unsolved, read the editorial, write a one-line pattern note, and redo it on day 7.
- **HLD (25 min):** follow the Codefarm System Design roadmap in order, one or two skills a day, using its guides as the main material and *Designing Data-Intensive Applications* for depth. Items marked skim get 10 minutes and a one-sentence explanation. Day 7 holds the designs the roadmap lacks.
- **LLD (25 min):** follow the Codefarm LLD roadmap in order and code in Python. One session on a problem gives you requirements, classes and the key pattern, so code the full solution in that week's Day 7 review.
- **AI (30 min):** build the capstone, a document extraction, comparison and Q&A agent over public PDFs (SEC 10-Ks or sample insurance policies). 30 minutes a day is about 28 hours in total, enough for a deployed thin product.

Day 1 can be any weekday. The weeks are numbered by day, not by calendar date.

**How to track:** tick each box when the task is done. Every link opens the problem or resource for that task. HLD tasks link to the [System Design roadmap](https://codefarm.in/roadmap/system-design) because I could not verify its per-skill guide URLs, so open the matching skill from its phase. LLD tasks link to the roadmap's phase guides, and pattern tasks add a Refactoring Guru reference. Meeting Rooms II and Alien Dictionary need LeetCode Premium. A task with no link is practice you do yourself.

### Week 1: hashing, windows, stacks · HLD foundations · LLD OOP and SOLID · extraction

**Day 1**

- [ ] **DSA:** [Group Anagrams](https://leetcode.com/problems/group-anagrams/) (hashing)
- [ ] **HLD:** [Networking basics](https://codefarm.in/roadmap/system-design): OSI, TCP/IP, DNS, HTTP and TLS
- [ ] **LLD:** [OOP pillars](https://codefarm.in/guides/lld/01-oop-foundations-solid): encapsulation, abstraction, inheritance, polymorphism
- [ ] **AI:** [OpenAI tokenizer](https://platform.openai.com/tokenizer): tokens, context windows, sampling; same prompt at temperature 0 vs 1

**Day 2**

- [ ] **DSA:** [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) (sliding window)
- [ ] **HLD:** [Client-server architecture](https://codefarm.in/roadmap/system-design), REST and HTTP
- [ ] **LLD:** [SOLID part 1](https://codefarm.in/guides/lld/01-oop-foundations-solid) (S, O, L) with violations and fixes
- [ ] **AI:** [Pydantic docs](https://docs.pydantic.dev/latest/): structured extraction from 5 PDFs

**Day 3**

- [ ] **DSA:** [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) (prefix sums + hashmap)
- [ ] **HLD:** [SQL fundamentals](https://codefarm.in/roadmap/system-design): relational model, ACID
- [ ] **LLD:** [SOLID part 2](https://codefarm.in/guides/lld/01-oop-foundations-solid) (I, D)
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
- [ ] **LLD:** [Singleton and Monostate](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Singleton](https://refactoring.guru/design-patterns/singleton))
- [ ] **AI:** [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings): embed and search 20 chunks

**Day 9**

- [ ] **DSA:** [Redundant Connection](https://leetcode.com/problems/redundant-connection/) (union-find)
- [ ] **HLD:** [Message queues and brokers](https://codefarm.in/roadmap/system-design): pub/sub, RabbitMQ vs Kafka
- [ ] **LLD:** [Factory Method and Abstract Factory](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Factory Method](https://refactoring.guru/design-patterns/factory-method), [Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory))
- [ ] **AI:** [LangChain text splitters](https://python.langchain.com/docs/concepts/text_splitters/): fixed vs recursive vs heading-aware

**Day 10**

- [ ] **DSA:** [Network Delay Time](https://leetcode.com/problems/network-delay-time/) (Dijkstra)
- [ ] **HLD:** [API design and gateways](https://codefarm.in/roadmap/system-design): REST, GraphQL, gRPC
- [ ] **LLD:** [Builder pattern](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Builder](https://refactoring.guru/design-patterns/builder))
- [ ] **AI:** [pgvector](https://github.com/pgvector/pgvector): table, HNSW index, query

**Day 11**

- [ ] **DSA:** [Word Ladder](https://leetcode.com/problems/word-ladder/) (BFS)
- [ ] **HLD:** [Replication and sharding](https://codefarm.in/roadmap/system-design): leader/follower, partitioning
- [ ] **LLD:** [Prototype pattern](https://codefarm.in/guides/lld/02-creational-patterns) (ref: [Prototype](https://refactoring.guru/design-patterns/prototype))
- [ ] **AI:** [Supabase hybrid search](https://supabase.com/docs/guides/ai/hybrid-search): tsvector + vector

**Day 12**

- [ ] **DSA:** [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) (binary search on the answer)
- [ ] **HLD:** [Consistency and consensus](https://codefarm.in/roadmap/system-design): isolation levels, a first look at Raft
- [ ] **LLD:** [Adapter and Facade](https://codefarm.in/guides/lld/03-structural-patterns) (ref: [Adapter](https://refactoring.guru/design-patterns/adapter), [Facade](https://refactoring.guru/design-patterns/facade))
- [ ] **AI:** [Cross-encoder reranking](https://www.sbert.net/examples/applications/cross-encoder/README.html)

**Day 13**

- [ ] **DSA:** [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [ ] **HLD:** [Distributed system fallacies](https://codefarm.in/roadmap/system-design) and failure modes
- [ ] **LLD:** [Decorator and Proxy](https://codefarm.in/guides/lld/03-structural-patterns) (ref: [Decorator](https://refactoring.guru/design-patterns/decorator), [Proxy](https://refactoring.guru/design-patterns/proxy))
- [ ] **AI:** [Claude citations docs](https://docs.claude.com/en/docs/build-with-claude/citations): answers with page references; refuse when nothing is retrieved

**Day 14 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design a notification system (queues, retries, fan-out); reference: [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ ] **LLD:** re-code [Factory Method](https://refactoring.guru/design-patterns/factory-method) and [Decorator](https://refactoring.guru/design-patterns/decorator) from memory
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
- [ ] **LLD:** [Strategy and Template Method](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Strategy](https://refactoring.guru/design-patterns/strategy), [Template Method](https://refactoring.guru/design-patterns/template-method))
- [ ] **AI:** [LangChain Academy: Intro to LangGraph](https://academy.langchain.com/courses/intro-to-langgraph): plan, retrieve, draft, critic flow

**Day 18**

- [ ] **DSA:** [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) (knapsack)
- [ ] **HLD:** [Distributed data stores](https://codefarm.in/roadmap/system-design) (Dynamo-style)
- [ ] **LLD:** [Observer and Pub-Sub](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Observer](https://refactoring.guru/design-patterns/observer))
- [ ] **AI:** [LangGraph persistence](https://langchain-ai.github.io/langgraph/concepts/persistence/): Postgres checkpointer; kill a run and resume it

**Day 19**

- [ ] **DSA:** [Word Break](https://leetcode.com/problems/word-break/)
- [ ] **HLD:** [Fault tolerance and resilience](https://codefarm.in/roadmap/system-design): circuit breaker, retry, bulkhead
- [ ] **LLD:** [Command and Chain of Responsibility](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [Command](https://refactoring.guru/design-patterns/command), [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility))
- [ ] **AI:** [LangGraph human-in-the-loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/): interrupt before a risky action

**Day 20**

- [ ] **DSA:** [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) (state-machine DP)
- [ ] **HLD:** [Consistent hashing and Bloom filters](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [State and Mediator](https://codefarm.in/guides/lld/04-behavioral-patterns) (ref: [State](https://refactoring.guru/design-patterns/state), [Mediator](https://refactoring.guru/design-patterns/mediator))
- [ ] **AI:** [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents): schemas, idempotency, errors, permissions

**Day 21 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design a key-value store (Dynamo-style); reference: [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ ] **LLD:** code a small order-status state machine ([State](https://refactoring.guru/design-patterns/state))
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
- [ ] **LLD:** Concurrency: [threading docs](https://docs.python.org/3/library/threading.html), [asyncio docs](https://docs.python.org/3/library/asyncio.html); locks and race conditions
- [ ] **AI:** [n8n courses](https://docs.n8n.io/courses/): webhook, HTTP call, Slack workflow

**Day 27**

- [ ] **DSA:** [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/) (hard linked list)
- [ ] **HLD:** [Event-driven architecture](https://codefarm.in/roadmap/system-design): event sourcing, CQRS
- [ ] **LLD:** [Problem: parking lot](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** [Tenacity docs](https://tenacity.readthedocs.io): retries, timeouts and a dead-letter queue around LLM calls

**Day 28 (review and gate)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design a job scheduler or distributed task queue; reference: [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [ ] **LLD:** code the parking lot's core classes with one test ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** compare [Temporal](https://docs.temporal.io), [Prefect](https://docs.prefect.io) and [n8n](https://docs.n8n.io) aloud. **Gate:** the capstone runs end to end locally. Start applying now.

### Week 5: trees, tries, backtracking · HLD architecture patterns and vector search · LLD interview problems · evals

**Day 29**

- [ ] **DSA:** [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
- [ ] **HLD:** [Serverless and FaaS](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: elevator system](https://codefarm.in/guides/lld/06-lld-interview-problems)
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
- [ ] **LLD:** [Problem: movie ticket booking](https://codefarm.in/guides/lld/06-lld-interview-problems) (seat locking)
- [ ] **AI:** [GitHub Actions docs](https://docs.github.com/en/actions): eval regression gate

**Day 34**

- [ ] **DSA:** [N-Queens](https://leetcode.com/problems/n-queens/) (hard backtracking)
- [ ] **HLD:** [RAG architecture](https://codefarm.in/roadmap/system-design): chunking, reranking, evaluation
- [ ] **LLD:** [Problem: chess](https://codefarm.in/guides/lld/06-lld-interview-problems) (move validation)
- [ ] **AI:** [Langfuse docs](https://langfuse.com/docs): categorize 10 failures and fix the top one

**Day 35 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design enterprise RAG with citations ([RAG architecture](https://codefarm.in/roadmap/system-design))
- [ ] **LLD:** redo hotel or movie booking in code, with locking ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** explain aloud how you would evaluate any agent in production

### Week 6: advanced patterns · HLD Gen AI and LLM systems · LLD interview problems · safety and extraction

**Day 36**

- [ ] **DSA:** [Single Number III](https://leetcode.com/problems/single-number-iii/) (bit manipulation)
- [ ] **HLD:** [LLM gateway and routing](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: logger framework](https://codefarm.in/guides/lld/06-lld-interview-problems)
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
- [ ] **LLD:** [Problem: rate limiter](https://codefarm.in/guides/lld/06-lld-interview-problems) (token bucket, sliding window)
- [ ] **AI:** [Pydantic docs](https://docs.pydantic.dev/latest/): extract entities from two quotes or policies into one schema

**Day 40**

- [ ] **DSA:** [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) (binary search, hard)
- [ ] **HLD:** [Guardrails and output validation](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: pub-sub system](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** quote comparison: diff two extractions and cite pages

**Day 41**

- [ ] **DSA:** [Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) (bitmask BFS, hard)
- [ ] **HLD:** [LLM observability and evaluation](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Problem: tic-tac-toe](https://codefarm.in/guides/lld/06-lld-interview-problems) (win detection)
- [ ] **AI:** [Amazon Bedrock workshop](https://github.com/aws-samples/amazon-bedrock-workshop): add a fallback provider to your LLM router

**Day 42 (review)**

- [ ] **DSA:** redo the problem you failed this week
- [ ] **HLD:** design an agent platform with an LLM gateway and guardrails ([roadmap phase 6](https://codefarm.in/roadmap/system-design))
- [ ] **LLD:** code LRU/LFU with a test and a thread-safe variant ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
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
- [ ] **LLD:** mock, 25 min: a problem you haven't done, such as a library or bike rental system ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** answer interview questions aloud and record yourself

### Week 8: timed practice · HLD real-world case studies · LLD timed redos · packaging

**Day 50**

- [ ] **DSA:** [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) (monotonic deque)
- [ ] **HLD:** [Timed case study: URL shortener](https://codefarm.in/roadmap/system-design)
- [ ] **LLD:** [Timed redo: parking lot](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** README with an architecture diagram and measured results (only numbers from your own evals)

**Day 51**

- [ ] **DSA:** [Decode Ways](https://leetcode.com/problems/decode-ways/)
- [ ] **HLD:** [Timed case study: Twitter and news feed](https://codefarm.in/roadmap/system-design) (fan-out, celebrity problem)
- [ ] **LLD:** [Timed redo: elevator](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** record a 3-minute demo

**Day 52**

- [ ] **DSA:** [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) (quickselect or heap)
- [ ] **HLD:** [Timed case study: WhatsApp and chat](https://codefarm.in/roadmap/system-design) (WebSockets, delivery receipts)
- [ ] **LLD:** [Timed redo: movie ticket booking](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** map 6 stories to STAR (patch orchestrator, MCP platform, platform adoption, parameter-update feature, mentoring, FINRAA); reference: [Amazon Leadership Principles](https://www.amazon.jobs/en/principles)

**Day 53**

- [ ] **DSA:** [Clone Graph](https://leetcode.com/problems/clone-graph/)
- [ ] **HLD:** [Timed case study: YouTube and video streaming](https://codefarm.in/roadmap/system-design) (transcoding, CDN)
- [ ] **LLD:** [Timed redo: LRU/LFU cache](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** mock Q&A on LLM fundamentals and RAG

**Day 54**

- [ ] **DSA:** [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) (hard)
- [ ] **HLD:** [Timed case study: Uber and ride-hailing](https://codefarm.in/roadmap/system-design) (geohash, real-time matching)
- [ ] **LLD:** [Timed redo: rate limiter](https://codefarm.in/guides/lld/06-lld-interview-problems)
- [ ] **AI:** mock Q&A on agents, evals and safety

**Day 55**

- [ ] **DSA:** a new problem from your weakest pattern
- [ ] **HLD:** [Timed case study: distributed search engine](https://codefarm.in/roadmap/system-design) (crawler, inverted index)
- [ ] **LLD:** redo your weakest two problems ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** resume pass: add the capstone, named models and measured results; build the application list

**Day 56 (final mock)**

- [ ] **DSA:** one Medium, 40 min
- [ ] **HLD:** [Trade-off analysis and decision frameworks](https://codefarm.in/roadmap/system-design) (ADRs), then one random design, 25 min
- [ ] **LLD:** one new problem, 25 min ([problem guide](https://codefarm.in/guides/lld/06-lld-interview-problems))
- [ ] **AI:** one question aloud plus a final capstone check. **Gate:** deployed URL, README with measured results, 2 mock interviews done, 10+ targeted applications sent.

### Notes on this plan

- **Total load:** about 112 hours. If you miss a day, shift the schedule by a day instead of compressing two days into one.
- **Sources:** HLD follows the [System Design roadmap](https://codefarm.in/roadmap/system-design) (9 phases, 58 skills) and LLD follows the [LLD roadmap](https://codefarm.in/roadmap/lld) (6 phases, 35 skills). The LLD roadmap is written for Java, so implement in Python. Both pages are overviews: judge the depth of the guides they link to after your first two sessions.
- **Skimmed:** Paxos, 2PC and 3PC, Merkle trees, vector clocks, service mesh, DDoS and WAF. Read for 10 minutes and explain each in one sentence.
- **Added beyond the roadmaps:** estimation drills, plus HLD designs for a notification system, key-value store, job scheduler, enterprise RAG, agent platform and multi-tenant document processing; LLD concurrency, dependency injection and testing, LLM client, agent tool registry and workflow engine.
- **Not covered:** Dropbox and file sync, typeahead, payments, Kubernetes, deep ML theory, hands-on fine-tuning. Add them for a specific application only.
- **If you must cut:** AI-startup roles care less about LLD problems and hard DSA. For those, move 25 minutes a day from LLD to AI. If you target Amazon or large product companies, keep LLD.
